import logging
import random
from typing import Tuple
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import FoodAnalysisModel
from backend.schemas import FoodAnalysisResponse, DetectedItem, NutritionSummary, NUTRITION_DISCLAIMER
from backend.services.ai_client import ai_client
from backend.services.demo_data import DEMO_FOOD_SAMPLES

logger = logging.getLogger("food_verse.food_analysis")

FOOD_SYSTEM_PROMPT = """
You are an expert AI Food Intelligence and Nutritional Analyst agent.
Your task is to visually recognize food items in the provided image and estimate their macronutrients and calories.

CRITICAL RULES:
1. Visual nutrition estimates are approximate. Never claim exact calorie values from an image alone.
2. If multiple food items are visible on the plate, return itemized estimates for each detected component, PLUS a combined total summary.
3. Be realistic about standard restaurant and home-cooked portion sizes, hidden cooking oils, and dressings.
4. Output MUST BE strictly valid JSON matching this structure:
{
  "food_name": "Primary dish or meal name",
  "category": "e.g. Healthy Bowl, High Protein, Vegetarian, Fast Food, Dessert, Breakfast",
  "detected_items": [
    {
      "name": "Component name (e.g. Grilled Chicken Breast)",
      "portion": "e.g. 150g or 1 cup",
      "calories_kcal": 250.0,
      "protein_g": 35.0,
      "carbs_g": 0.0,
      "fat_g": 6.0,
      "fiber_g": 0.0
    }
  ],
  "nutrition_summary": {
    "total_calories_kcal": 550.0,
    "total_protein_g": 40.0,
    "total_carbs_g": 45.0,
    "total_fat_g": 20.0,
    "total_fiber_g": 6.0
  },
  "portion_size": "Estimated overall meal size (e.g. 1 medium bowl, approx 400g)",
  "confidence_score": 0.88,
  "confidence_note": "Short note explaining visual certainty and factors that may affect accuracy",
  "explanation": "Detailed visual description of ingredients, visible cooking style, and nutritional balance.",
  "dietary_tags": ["High Protein", "Gluten-Free", "Low Carb", etc.]
}
"""

def analyze_food_image(
    image_bytes: bytes,
    mime_type: str,
    image_filename: str,
    db: Session,
    force_demo: bool = False
) -> FoodAnalysisResponse:
    is_demo = force_demo or not ai_client.is_available()
    model_used = "demo"
    data = None

    if not is_demo:
        user_prompt = "Identify the food items on this plate, segment each component, and estimate macronutrients (calories, protein, carbs, fats, fiber)."
        parsed, error = ai_client.generate_multimodal_json(
            image_bytes=image_bytes,
            mime_type=mime_type,
            system_prompt=FOOD_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
        if parsed and "food_name" in parsed:
            data = parsed
            model_used = settings.GEMINI_MODEL
        else:
            logger.warning(f"AI call failed or malformed: {error}. Falling back to demo data.")
            is_demo = True

    if is_demo or not data:
        # Select one of the realistic demo food samples
        sample = random.choice(DEMO_FOOD_SAMPLES)
        data = dict(sample)
        data["confidence_note"] = f"[Demo Mode] {data.get('confidence_note', 'Sample estimation profile.')}"
        model_used = "demo-sample"
        is_demo = True

    # Parse detected items
    detected_items_objs = []
    total_cal = 0.0
    total_pro = 0.0
    total_carbs = 0.0
    total_fat = 0.0
    total_fiber = 0.0

    raw_items = data.get("detected_items", [])
    for item in raw_items:
        det = DetectedItem(
            name=item.get("name", "Food item"),
            portion=item.get("portion", "1 portion"),
            calories_kcal=float(item.get("calories_kcal", 0.0)),
            protein_g=float(item.get("protein_g", 0.0)),
            carbs_g=float(item.get("carbs_g", 0.0)),
            fat_g=float(item.get("fat_g", 0.0)),
            fiber_g=float(item.get("fiber_g", 0.0))
        )
        detected_items_objs.append(det)
        total_cal += det.calories_kcal
        total_pro += det.protein_g
        total_carbs += det.carbs_g
        total_fat += det.fat_g
        total_fiber += (det.fiber_g or 0.0)

    raw_summary = data.get("nutrition_summary", {})
    summary = NutritionSummary(
        total_calories_kcal=float(raw_summary.get("total_calories_kcal", total_cal)),
        total_protein_g=float(raw_summary.get("total_protein_g", total_pro)),
        total_carbs_g=float(raw_summary.get("total_carbs_g", total_carbs)),
        total_fat_g=float(raw_summary.get("total_fat_g", total_fat)),
        total_fiber_g=float(raw_summary.get("total_fiber_g", total_fiber))
    )

    food_name = data.get("food_name", "Analyzed Meal")
    category = data.get("category", "General")
    portion_size = data.get("portion_size", "1 standard serving")
    confidence_score = float(data.get("confidence_score", 0.88))
    confidence_note = data.get("confidence_note", "Visual estimation.")
    explanation = data.get("explanation", "")
    dietary_tags = data.get("dietary_tags", [])

    # Persist in DB
    db_record = FoodAnalysisModel(
        image_filename=image_filename,
        food_name=food_name,
        category=category,
        calories_kcal=summary.total_calories_kcal,
        protein_g=summary.total_protein_g,
        carbs_g=summary.total_carbs_g,
        fat_g=summary.total_fat_g,
        fiber_g=summary.total_fiber_g,
        portion_size=portion_size,
        confidence_score=confidence_score,
        confidence_note=confidence_note,
        explanation=explanation,
        is_demo=is_demo,
        model_used=model_used
    )
    db_record.detected_items = [d.model_dump() for d in detected_items_objs]
    db_record.dietary_tags = dietary_tags
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return FoodAnalysisResponse(
        id=db_record.id,
        food_name=food_name,
        category=category,
        image_filename=image_filename,
        detected_items=detected_items_objs,
        nutrition_summary=summary,
        portion_size=portion_size,
        confidence_score=confidence_score,
        confidence_note=confidence_note,
        explanation=explanation,
        dietary_tags=dietary_tags,
        disclaimer=NUTRITION_DISCLAIMER,
        is_demo=is_demo,
        model_used=model_used,
        created_at=db_record.created_at
    )
