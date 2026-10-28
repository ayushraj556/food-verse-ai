import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db
from backend.models import FreshnessModel
from backend.schemas import FreshnessResponse, FRESHNESS_DISCLAIMER
from backend.services.freshness_analysis import analyze_freshness

router = APIRouter(prefix="/freshness", tags=["Food Freshness Analysis"])

@router.post("/analyze", response_model=FreshnessResponse)
async def analyze_freshness_endpoint(
    file: UploadFile = File(...),
    force_demo: bool = Form(False),
    db: Session = Depends(get_db)
):
    content_type = (file.content_type or "").lower()
    if content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Allowed types are: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )

    image_bytes = await file.read()
    file_size = len(image_bytes)

    if file_size == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File size ({file_size / (1024*1024):.1f}MB) exceeds limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    ext = Path(file.filename or "produce.jpg").suffix.lower() or ".jpg"
    unique_filename = f"freshness_{uuid.uuid4().hex[:12]}{ext}"
    save_path = settings.UPLOAD_DIR / unique_filename
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    return analyze_freshness(
        image_bytes=image_bytes,
        mime_type=content_type,
        image_filename=unique_filename,
        db=db,
        force_demo=force_demo
    )

@router.get("/{analysis_id}", response_model=FreshnessResponse)
def get_freshness_analysis(analysis_id: int, db: Session = Depends(get_db)):
    rec = db.query(FreshnessModel).filter(FreshnessModel.id == analysis_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Freshness analysis record not found.")

    return FreshnessResponse(
        id=rec.id,
        item_name=rec.item_name,
        image_filename=rec.image_filename,
        freshness_status=rec.freshness_status,
        confidence_level=rec.confidence_level or "Moderate",
        visual_indicators=rec.visual_indicators,
        safety_guidance=rec.safety_guidance or "",
        recommendations=rec.recommendations,
        storage_tip=rec.storage_tip or "",
        disclaimer=FRESHNESS_DISCLAIMER,
        is_demo=rec.is_demo,
        model_used=rec.model_used or "demo",
        created_at=rec.created_at
    )
