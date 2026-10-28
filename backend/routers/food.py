import os
import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.config import settings
from backend.database import get_db
from backend.models import FoodAnalysisModel
from backend.schemas import FoodAnalysisResponse, DetectedItem, NutritionSummary, NUTRITION_DISCLAIMER
from backend.services.food_analysis import analyze_food_image

router = APIRouter(prefix="/food", tags=["Food Recognition & Nutrition"])

@router.post("/analyze", response_model=FoodAnalysisResponse)
async def analyze_food(
    file: UploadFile = File(...),
    force_demo: bool = Form(False),
    db: Session = Depends(get_db)
):
    # Validate MIME type
    content_type = (file.content_type or "").lower()
    if content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Allowed types are: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )

    # Read and validate file size
    image_bytes = await file.read()
    file_size = len(image_bytes)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File size ({file_size / (1024*1024):.1f}MB) exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Save image to upload dir
    ext = Path(file.filename or "image.jpg").suffix.lower() or ".jpg"
    unique_filename = f"food_{uuid.uuid4().hex[:12]}{ext}"
    save_path = settings.UPLOAD_DIR / unique_filename
    with open(save_path, "wb") as f:
        f.write(image_bytes)

    # Execute analysis service
    return analyze_food_image(
        image_bytes=image_bytes,
        mime_type=content_type,
        image_filename=unique_filename,
        db=db,
        force_demo=force_demo
    )

@router.get("/{analysis_id}", response_model=FoodAnalysisResponse)
def get_food_analysis(analysis_id: int, db: Session = Depends(get_db)):
    rec = db.query(FoodAnalysisModel).filter(FoodAnalysisModel.id == analysis_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Food analysis record not found.")

    items = [DetectedItem(**it) for it in rec.detected_items]
    summary = NutritionSummary(
        total_calories_kcal=rec.calories_kcal,
        total_protein_g=rec.protein_g,
        total_carbs_g=rec.carbs_g,
        total_fat_g=rec.fat_g,
        total_fiber_g=rec.fiber_g or 0.0
    )

    return FoodAnalysisResponse(
        id=rec.id,
        food_name=rec.food_name,
        category=rec.category or "General",
        image_filename=rec.image_filename,
        detected_items=items,
        nutrition_summary=summary,
        portion_size=rec.portion_size or "1 serving",
        confidence_score=rec.confidence_score or 0.85,
        confidence_note=rec.confidence_note or "",
        explanation=rec.explanation or "",
        dietary_tags=rec.dietary_tags,
        disclaimer=NUTRITION_DISCLAIMER,
        is_demo=rec.is_demo,
        model_used=rec.model_used or "demo",
        created_at=rec.created_at
    )
