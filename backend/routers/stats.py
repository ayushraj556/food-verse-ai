import csv
import io
import json
from collections import Counter
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import FoodAnalysisModel, FreshnessModel, HygieneModel, MealPlanModel
from backend.schemas import DashboardStats, CategoryCount, RecentActivity

router = APIRouter(prefix="", tags=["Dashboard & Statistics"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    food_records = db.query(FoodAnalysisModel).all()
    freshness_records = db.query(FreshnessModel).all()
    hygiene_records = db.query(HygieneModel).all()
    meal_plans_count = db.query(MealPlanModel).count()

    food_count = len(food_records)
    freshness_count = len(freshness_records)
    hygiene_count = len(hygiene_records)
    total_analyses = food_count + freshness_count + hygiene_count

    # Calculate average calories across analyzed food records
    if food_count > 0:
        total_cal = sum(f.calories_kcal for f in food_records)
        avg_calories = round(total_cal / food_count, 1)
    else:
        avg_calories = 0.0

    # Food category distribution
    cat_counter = Counter()
    for f in food_records:
        cat_name = f.category.strip() if f.category else "General"
        cat_counter[cat_name] += 1

    category_distribution = [
        CategoryCount(category=cat, count=cnt)
        for cat, cnt in cat_counter.most_common(6)
    ]

    # Build recent activity timeline from real records
    activities: list[RecentActivity] = []

    for f in sorted(food_records, key=lambda x: x.created_at, reverse=True)[:5]:
        activities.append(RecentActivity(
            id=f.id,
            type="food",
            title=f.food_name,
            timestamp=f.created_at,
            status_or_metric=f"{int(f.calories_kcal)} kcal",
            is_demo=f.is_demo
        ))

    for fr in sorted(freshness_records, key=lambda x: x.created_at, reverse=True)[:5]:
        activities.append(RecentActivity(
            id=fr.id,
            type="freshness",
            title=fr.item_name,
            timestamp=fr.created_at,
            status_or_metric=fr.freshness_status,
            is_demo=fr.is_demo
        ))

    for h in sorted(hygiene_records, key=lambda x: x.created_at, reverse=True)[:5]:
        activities.append(RecentActivity(
            id=h.id,
            type="hygiene",
            title=f"Kitchen Inspection ({h.media_type})",
            timestamp=h.created_at,
            status_or_metric=h.overall_hygiene_score,
            is_demo=h.is_demo
        ))

    # Sort all activities by timestamp descending
    activities.sort(key=lambda a: a.timestamp, reverse=True)

    return DashboardStats(
        total_analyses=total_analyses,
        food_analyses_count=food_count,
        freshness_count=freshness_count,
        hygiene_count=hygiene_count,
        meal_plans_count=meal_plans_count,
        avg_calories_kcal=avg_calories,
        category_distribution=category_distribution,
        recent_activities=activities[:8]
    )


@router.get("/export/{file_format}")
def export_analyses_report(file_format: str, db: Session = Depends(get_db)):
    file_format = file_format.lower()
    food_records = db.query(FoodAnalysisModel).order_by(FoodAnalysisModel.created_at.desc()).all()
    freshness_records = db.query(FreshnessModel).order_by(FreshnessModel.created_at.desc()).all()
    hygiene_records = db.query(HygieneModel).order_by(HygieneModel.created_at.desc()).all()

    if file_format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Record ID", "Module Type", "Title / Name", "Timestamp (UTC)", 
            "Primary Metric / Rating", "Mode", "Model Used", "Summary Notes"
        ])

        for f in food_records:
            writer.writerow([
                f.id, "Food Nutrition", f.food_name, f.created_at.isoformat(),
                f"{f.calories_kcal:.1f} kcal (P:{f.protein_g}g C:{f.carbs_g}g F:{f.fat_g}g)",
                "Demo" if f.is_demo else "AI Live", f.model_used, f.explanation[:120]
            ])

        for fr in freshness_records:
            writer.writerow([
                fr.id, "Freshness Inspection", fr.item_name, fr.created_at.isoformat(),
                fr.freshness_status, "Demo" if fr.is_demo else "AI Live", fr.model_used,
                fr.safety_guidance[:120]
            ])

        for h in hygiene_records:
            writer.writerow([
                h.id, "Kitchen Hygiene", f"Kitchen ({h.media_type})", h.created_at.isoformat(),
                h.overall_hygiene_score, "Demo" if h.is_demo else "AI Live", h.model_used,
                h.surface_cleanliness
            ])

        csv_content = output.getvalue()
        filename = f"food_verse_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    elif file_format == "json":
        data = {
            "exported_at": datetime.now().isoformat(),
            "summary": {
                "total_food_analyses": len(food_records),
                "total_freshness_analyses": len(freshness_records),
                "total_hygiene_analyses": len(hygiene_records)
            },
            "food_analyses": [
                {
                    "id": f.id,
                    "food_name": f.food_name,
                    "created_at": f.created_at.isoformat(),
                    "calories_kcal": f.calories_kcal,
                    "protein_g": f.protein_g,
                    "carbs_g": f.carbs_g,
                    "fat_g": f.fat_g,
                    "detected_items": f.detected_items,
                    "is_demo": f.is_demo
                }
                for f in food_records
            ],
            "freshness_analyses": [
                {
                    "id": fr.id,
                    "item_name": fr.item_name,
                    "created_at": fr.created_at.isoformat(),
                    "status": fr.freshness_status,
                    "indicators": fr.visual_indicators,
                    "guidance": fr.safety_guidance,
                    "is_demo": fr.is_demo
                }
                for fr in freshness_records
            ],
            "hygiene_analyses": [
                {
                    "id": h.id,
                    "file_name": h.file_name,
                    "created_at": h.created_at.isoformat(),
                    "score": h.overall_hygiene_score,
                    "gloves": h.gloves_observed,
                    "observations": h.observations,
                    "concerns": h.concerns,
                    "is_demo": h.is_demo
                }
                for h in hygiene_records
            ]
        }
        json_content = json.dumps(data, indent=2)
        filename = f"food_verse_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        raise HTTPException(status_code=400, detail="Unsupported export format. Choose 'csv' or 'json'.")
