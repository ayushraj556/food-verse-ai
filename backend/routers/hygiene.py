import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db
from backend.models import HygieneModel
from backend.schemas import HygieneResponse, HYGIENE_DISCLAIMER
from backend.services.hygiene_analysis import analyze_kitchen_hygiene

router = APIRouter(prefix="/hygiene", tags=["Kitchen Hygiene Analysis"])

@router.post("/analyze", response_model=HygieneResponse)
async def analyze_hygiene_endpoint(
    file: UploadFile = File(...),
    force_demo: bool = Form(False),
    db: Session = Depends(get_db)
):
    content_type = (file.content_type or "").lower()
    is_image = content_type in settings.ALLOWED_IMAGE_TYPES
    is_video = content_type in settings.ALLOWED_VIDEO_TYPES

    if not (is_image or is_video):
        all_allowed = list(settings.ALLOWED_IMAGE_TYPES | settings.ALLOWED_VIDEO_TYPES)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Allowed types: images ({', '.join(settings.ALLOWED_IMAGE_TYPES)}) or videos ({', '.join(settings.ALLOWED_VIDEO_TYPES)})."
        )

    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File size ({file_size / (1024*1024):.1f}MB) exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    ext = Path(file.filename or ("kitchen.mp4" if is_video else "kitchen.jpg")).suffix.lower()
    prefix = "video" if is_video else "hygiene"
    unique_filename = f"{prefix}_{uuid.uuid4().hex[:12]}{ext}"
    save_path = settings.UPLOAD_DIR / unique_filename
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    return analyze_kitchen_hygiene(
        file_bytes=file_bytes,
        mime_type=content_type,
        file_name=unique_filename,
        is_video=is_video,
        db=db,
        force_demo=force_demo
    )

@router.get("/{analysis_id}", response_model=HygieneResponse)
def get_hygiene_analysis(analysis_id: int, db: Session = Depends(get_db)):
    rec = db.query(HygieneModel).filter(HygieneModel.id == analysis_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Kitchen hygiene analysis record not found.")

    return HygieneResponse(
        id=rec.id,
        file_name=rec.file_name,
        media_type=rec.media_type or "image",
        overall_hygiene_score=rec.overall_hygiene_score,
        gloves_observed=rec.gloves_observed or "",
        hair_covering_observed=rec.hair_covering_observed or "",
        surface_cleanliness=rec.surface_cleanliness or "",
        cross_contamination_risk=rec.cross_contamination_risk or "",
        observations=rec.observations,
        concerns=rec.concerns,
        improvements=rec.improvements,
        limitations=rec.limitations or "",
        disclaimer=HYGIENE_DISCLAIMER,
        is_demo=rec.is_demo,
        model_used=rec.model_used or "demo",
        created_at=rec.created_at
    )
