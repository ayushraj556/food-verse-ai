import io
import logging
import random
import tempfile
from pathlib import Path
from typing import Tuple, List, Optional
from sqlalchemy.orm import Session
from PIL import Image

from backend.config import settings
from backend.models import HygieneModel
from backend.schemas import HygieneResponse, HYGIENE_DISCLAIMER
from backend.services.ai_client import ai_client
from backend.services.demo_data import DEMO_HYGIENE_SAMPLES

logger = logging.getLogger("food_verse.hygiene_analysis")

HYGIENE_SYSTEM_PROMPT = """
You are an expert Kitchen Food Safety & Sanitation Inspection Screening AI Agent.
Analyze the provided visual frame(s) of a commercial, restaurant, or domestic food preparation area.

CRITICAL DIRECTIVES & LIMITATIONS:
1. You must assess ONLY visible indicators in the provided imagery.
2. Focus strictly on:
   - Visible use of food-handling gloves
   - Hair coverings (hairnets, chef hats, tied-back hair)
   - Visible cleanliness and sanitization of workstations, prep tables, and cutting boards
   - Observable cross-contamination risks (e.g. raw meats next to ready-to-eat produce, improper utensil placement)
3. Do NOT claim to certify a restaurant, verify HACCP compliance, or guarantee absence of invisible microbes.

OUTPUT MUST BE STRICTLY VALID JSON MATCHING:
{
  "overall_hygiene_score": "Good | Moderate Concern | Critical Attention",
  "gloves_observed": "Clear description of glove usage or bare-hand handling observed",
  "hair_covering_observed": "Observation on chef hat, hairnet, or lack thereof",
  "surface_cleanliness": "Assessment of visible cutting board/countertop cleanliness and debris",
  "cross_contamination_risk": "Assessment of raw vs cooked/ready-to-eat separation and utensil hygiene",
  "observations": [
    "Specific positive or neutral visible operational practices"
  ],
  "concerns": [
    "Visible safety hazards, sanitary infractions, or risky handling"
  ],
  "improvements": [
    "Concrete actionable recommendations to enhance food hygiene standards"
  ],
  "limitations": "Detailed statement highlighting what cannot be determined from visual frames alone"
}
"""

def extract_representative_frame_from_video(video_bytes: bytes, filename: str) -> Tuple[Optional[bytes], str]:
    """
    Extracts a representative middle keyframe from video bytes using OpenCV.
    Returns: (jpeg_bytes, message)
    """
    try:
        import cv2

        suffix = Path(filename).suffix or ".mp4"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temp_video:
            temp_video.write(video_bytes)
            temp_path = temp_video.name

        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            Path(temp_path).unlink(missing_ok=True)
            return None, "Could not open video file stream."

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
            total_frames = 30

        # Sample frame from 40% into the video for stability
        target_frame_idx = max(0, int(total_frames * 0.4))
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame_idx)
        success, frame = cap.read()

        if not success or frame is None:
            # Fallback to frame 0
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, frame = cap.read()

        cap.release()
        Path(temp_path).unlink(missing_ok=True)

        if not success or frame is None:
            return None, "Failed to decode valid frame from video."

        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb_frame)
        buf = io.BytesIO()
        pil_img.save(buf, format="JPEG", quality=85)
        return buf.getvalue(), f"Successfully extracted keyframe at index {target_frame_idx} of {total_frames} frames."

    except Exception as e:
        logger.error(f"Error extracting video frame: {e}")
        return None, f"Video frame extraction error: {str(e)}"


def analyze_kitchen_hygiene(
    file_bytes: bytes,
    mime_type: str,
    file_name: str,
    is_video: bool,
    db: Session,
    force_demo: bool = False
) -> HygieneResponse:
    is_demo = force_demo or not ai_client.is_available()
    model_used = "demo"
    data = None
    media_type = "video" if is_video else "image"
    frame_analysis_note = ""

    if not is_demo:
        analysis_bytes = file_bytes
        analysis_mime = mime_type

        if is_video:
            extracted_bytes, note = extract_representative_frame_from_video(file_bytes, file_name)
            if extracted_bytes:
                analysis_bytes = extracted_bytes
                analysis_mime = "image/jpeg"
                frame_analysis_note = note
            else:
                logger.warning(f"Could not extract frame from video: {note}. Falling back to demo mode.")
                is_demo = True

        if not is_demo:
            user_prompt = "Perform a thorough kitchen and food preparation sanitation inspection on the visible workstation and food handlers."
            parsed, error = ai_client.generate_multimodal_json(
                image_bytes=analysis_bytes,
                mime_type=analysis_mime,
                system_prompt=HYGIENE_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )
            if parsed and "overall_hygiene_score" in parsed:
                data = parsed
                model_used = settings.GEMINI_MODEL
            else:
                logger.warning(f"AI hygiene analysis failed: {error}. Falling back to demo data.")
                is_demo = True

    if is_demo or not data:
        # Match demo dataset by media type
        candidates = [s for s in DEMO_HYGIENE_SAMPLES if s.get("media_type") == media_type]
        data = dict(candidates[0] if candidates else DEMO_HYGIENE_SAMPLES[0])
        model_used = "demo-sample"
        is_demo = True

    overall_score = data.get("overall_hygiene_score", "Good")
    gloves = data.get("gloves_observed", "Not clearly visible in frame")
    hair = data.get("hair_covering_observed", "Hairnet or hat observed")
    surface = data.get("surface_cleanliness", "Work surface appears organized")
    cross = data.get("cross_contamination_risk", "Low visible risk observed")
    observations = data.get("observations", [])
    concerns = data.get("concerns", [])
    improvements = data.get("improvements", [])
    limitations = data.get("limitations", "Visual screening cannot verify sanitizer chemical dilution or bacterial load.")

    if frame_analysis_note:
        observations.insert(0, f"Video Processing: {frame_analysis_note}")

    # Persist in DB
    db_record = HygieneModel(
        file_name=file_name,
        media_type=media_type,
        overall_hygiene_score=overall_score,
        gloves_observed=gloves,
        hair_covering_observed=hair,
        surface_cleanliness=surface,
        cross_contamination_risk=cross,
        limitations=limitations,
        is_demo=is_demo,
        model_used=model_used
    )
    db_record.observations = observations
    db_record.concerns = concerns
    db_record.improvements = improvements
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return HygieneResponse(
        id=db_record.id,
        file_name=file_name,
        media_type=media_type,
        overall_hygiene_score=overall_score,
        gloves_observed=gloves,
        hair_covering_observed=hair,
        surface_cleanliness=surface,
        cross_contamination_risk=cross,
        observations=observations,
        concerns=concerns,
        improvements=improvements,
        limitations=limitations,
        disclaimer=HYGIENE_DISCLAIMER,
        is_demo=is_demo,
        model_used=model_used,
        created_at=db_record.created_at
    )
