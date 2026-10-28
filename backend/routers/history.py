from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import FoodAnalysisModel, FreshnessModel, HygieneModel
from backend.schemas import HistoryItem

router = APIRouter(prefix="/history", tags=["Analysis History"])

@router.get("", response_model=List[HistoryItem])
def get_history(
    analysis_type: Optional[str] = Query("all", description="all, food, freshness, hygiene"),
    search: Optional[str] = Query(None, description="Search keyword in name or status"),
    limit: int = 50,
    db: Session = Depends(get_db)
):
    items: List[HistoryItem] = []

    # 1. Food Analyses
    if analysis_type in ("all", "food"):
        query = db.query(FoodAnalysisModel)
        if search:
            query = query.filter(FoodAnalysisModel.food_name.ilike(f"%{search}%"))
        foods = query.order_by(FoodAnalysisModel.created_at.desc()).limit(limit).all()
        for f in foods:
            items.append(HistoryItem(
                id=f.id,
                type="food",
                title=f.food_name,
                created_at=f.created_at,
                summary=f"{int(f.calories_kcal)} kcal | P: {f.protein_g}g C: {f.carbs_g}g F: {f.fat_g}g",
                metrics={
                    "calories_kcal": f.calories_kcal,
                    "protein_g": f.protein_g,
                    "carbs_g": f.carbs_g,
                    "fat_g": f.fat_g,
                    "portion_size": f.portion_size,
                    "confidence_score": f.confidence_score
                },
                image_filename=f.image_filename,
                is_demo=f.is_demo,
                model_used=f.model_used or "demo",
                full_data={
                    "category": f.category,
                    "detected_items": f.detected_items,
                    "explanation": f.explanation,
                    "confidence_note": f.confidence_note,
                    "dietary_tags": f.dietary_tags
                }
            ))

    # 2. Freshness Analyses
    if analysis_type in ("all", "freshness"):
        query = db.query(FreshnessModel)
        if search:
            query = query.filter(
                (FreshnessModel.item_name.ilike(f"%{search}%")) |
                (FreshnessModel.freshness_status.ilike(f"%{search}%"))
            )
        freshness_records = query.order_by(FreshnessModel.created_at.desc()).limit(limit).all()
        for fr in freshness_records:
            items.append(HistoryItem(
                id=fr.id,
                type="freshness",
                title=fr.item_name,
                created_at=fr.created_at,
                summary=f"Status: {fr.freshness_status} ({fr.confidence_level} confidence)",
                metrics={
                    "status": fr.freshness_status,
                    "confidence": fr.confidence_level
                },
                image_filename=fr.image_filename,
                is_demo=fr.is_demo,
                model_used=fr.model_used or "demo",
                full_data={
                    "visual_indicators": fr.visual_indicators,
                    "safety_guidance": fr.safety_guidance,
                    "recommendations": fr.recommendations,
                    "storage_tip": fr.storage_tip
                }
            ))

    # 3. Hygiene Analyses
    if analysis_type in ("all", "hygiene"):
        query = db.query(HygieneModel)
        if search:
            query = query.filter(
                (HygieneModel.overall_hygiene_score.ilike(f"%{search}%")) |
                (HygieneModel.file_name.ilike(f"%{search}%"))
            )
        hygiene_records = query.order_by(HygieneModel.created_at.desc()).limit(limit).all()
        for h in hygiene_records:
            items.append(HistoryItem(
                id=h.id,
                type="hygiene",
                title=f"Kitchen Inspection ({h.media_type.title()})",
                created_at=h.created_at,
                summary=f"Rating: {h.overall_hygiene_score} | Cleanliness: {h.surface_cleanliness}",
                metrics={
                    "score": h.overall_hygiene_score,
                    "gloves": h.gloves_observed,
                    "cross_contamination": h.cross_contamination_risk
                },
                image_filename=h.file_name,
                is_demo=h.is_demo,
                model_used=h.model_used or "demo",
                full_data={
                    "media_type": h.media_type,
                    "hair_covering": h.hair_covering_observed,
                    "surface_cleanliness": h.surface_cleanliness,
                    "observations": h.observations,
                    "concerns": h.concerns,
                    "improvements": h.improvements,
                    "limitations": h.limitations
                }
            ))

    # Sort unified results by created_at descending
    items.sort(key=lambda x: x.created_at, reverse=True)
    return items[:limit]

@router.delete("/{record_type}/{record_id}")
def delete_history_record(record_type: str, record_id: int, db: Session = Depends(get_db)):
    record_type = record_type.lower()
    if record_type == "food":
        r = db.query(FoodAnalysisModel).filter(FoodAnalysisModel.id == record_id).first()
    elif record_type == "freshness":
        r = db.query(FreshnessModel).filter(FreshnessModel.id == record_id).first()
    elif record_type == "hygiene":
        r = db.query(HygieneModel).filter(HygieneModel.id == record_id).first()
    else:
        raise HTTPException(status_code=400, detail="Invalid record type. Must be food, freshness, or hygiene.")

    if not r:
        raise HTTPException(status_code=404, detail=f"{record_type.capitalize()} record {record_id} not found.")

    db.delete(r)
    db.commit()
    return {"status": "success", "message": f"{record_type.capitalize()} record {record_id} deleted."}
