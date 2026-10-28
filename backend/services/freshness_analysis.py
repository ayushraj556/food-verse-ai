import logging
import random
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import FreshnessModel
from backend.schemas import FreshnessResponse, FRESHNESS_DISCLAIMER
from backend.services.ai_client import ai_client
from backend.services.demo_data import DEMO_FRESHNESS_SAMPLES

logger = logging.getLogger("food_verse.freshness_analysis")

FRESHNESS_SYSTEM_PROMPT = """
You are a specialized Food Quality and Freshness Screening AI Agent.
Analyze the provided food/produce/ingredient image to assess its visible state of freshness.

CRITICAL SAFETY DIRECTIVE:
Visual appearance alone CANNOT guarantee microbiological safety or absence of invisible pathogenic bacteria (such as Listeria, Salmonella, botulinum toxins) or deep fungal mycotoxins.
Your task is to provide visual indicators only and warn users safely.

CATEGORIES (You must select exactly ONE):
- "Fresh": Peak condition, crisp turgor, vibrant color, no visible defects or weeping.
- "Moderately Fresh": Ripe, slight skin wrinkling, acceptable sugar spotting, still safe for immediate eating or cooking.
- "Possibly Spoiled": Mold fuzz, dark rotting soft spots, slime film, translucent water-soaking, severe dehydration, or foul discoloration.

OUTPUT MUST BE STRICTLY VALID JSON MATCHING:
{
  "item_name": "Identified produce or food item",
  "freshness_status": "Fresh | Moderately Fresh | Possibly Spoiled",
  "confidence_level": "High | Moderate | Low",
  "visual_indicators": [
    "Specific observation about color, texture, surface skin, or moisture"
  ],
  "safety_guidance": "Clear advice on whether it is safe to eat raw, cook, or should be discarded",
  "recommendations": [
    "Practical recommendation for consumption timing, prep, or disposal"
  ],
  "storage_tip": "Advice on optimal storage conditions (temperature, humidity, containers)"
}
"""

def analyze_freshness(
    image_bytes: bytes,
    mime_type: str,
    image_filename: str,
    db: Session,
    force_demo: bool = False
) -> FreshnessResponse:
    is_demo = force_demo or not ai_client.is_available()
    model_used = "demo"
    data = None

    if not is_demo:
        user_prompt = "Examine this food item for signs of freshness, aging, wilting, bruising, or spoilage indicators."
        parsed, error = ai_client.generate_multimodal_json(
            image_bytes=image_bytes,
            mime_type=mime_type,
            system_prompt=FRESHNESS_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
        if parsed and "freshness_status" in parsed:
            data = parsed
            model_used = settings.GEMINI_MODEL
        else:
            logger.warning(f"AI freshness call failed or malformed: {error}. Using demo sample.")
            is_demo = True

    if is_demo or not data:
        sample = random.choice(DEMO_FRESHNESS_SAMPLES)
        data = dict(sample)
        model_used = "demo-sample"
        is_demo = True

    status = data.get("freshness_status", "Moderately Fresh")
    # Normalize status to one of the 3 specified values
    if "spoil" in status.lower() or "bad" in status.lower():
        status = "Possibly Spoiled"
    elif "moderat" in status.lower() or "ripe" in status.lower():
        status = "Moderately Fresh"
    else:
        status = "Fresh"

    item_name = data.get("item_name", "Inspected Food Item")
    confidence_level = data.get("confidence_level", "Moderate")
    visual_indicators = data.get("visual_indicators", [])
    safety_guidance = data.get("safety_guidance", "Visual screening only; verify aroma and texture prior to consuming.")
    recommendations = data.get("recommendations", [])
    storage_tip = data.get("storage_tip", "Keep refrigerated at 4°C (40°F) or below.")

    # Save to DB
    db_record = FreshnessModel(
        image_filename=image_filename,
        item_name=item_name,
        freshness_status=status,
        confidence_level=confidence_level,
        safety_guidance=safety_guidance,
        storage_tip=storage_tip,
        is_demo=is_demo,
        model_used=model_used
    )
    db_record.visual_indicators = visual_indicators
    db_record.recommendations = recommendations
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return FreshnessResponse(
        id=db_record.id,
        item_name=item_name,
        image_filename=image_filename,
        freshness_status=status,
        confidence_level=confidence_level,
        visual_indicators=visual_indicators,
        safety_guidance=safety_guidance,
        recommendations=recommendations,
        storage_tip=storage_tip,
        disclaimer=FRESHNESS_DISCLAIMER,
        is_demo=is_demo,
        model_used=model_used,
        created_at=db_record.created_at
    )
