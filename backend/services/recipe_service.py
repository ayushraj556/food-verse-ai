import logging
import random
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import RecipeModel
from backend.schemas import RecipeRequest, RecipeResponse, RecipeNutrition, RECIPE_ALLERGY_DISCLAIMER
from backend.services.ai_client import ai_client
from backend.services.demo_data import DEMO_RECIPES

logger = logging.getLogger("food_verse.recipe_service")

RECIPE_SYSTEM_PROMPT = """
You are a creative, professional Culinary Chef & Nutrition Specialist AI.
Generate a delicious, practical recipe strictly tailored to the user's available ingredients, dietary preference, maximum cooking time, and allergen restrictions.

CRITICAL ALLERGEN & SAFETY RULES:
1. NEVER include ingredients that conflict with stated allergies or dietary preferences.
2. Provide explicit safety notes regarding raw ingredient handling, food safety temperatures, and cross-contact awareness.
3. Be realistic about prep times and cooking step clarity.

OUTPUT MUST BE STRICTLY VALID JSON MATCHING:
{
  "recipe_name": "Appealing, descriptive recipe title",
  "cuisine": "Cuisine style (e.g. Mediterranean, Asian, Mexican, Italian)",
  "diet_type": "Vegetarian, Non-Vegetarian, Vegan, etc.",
  "prep_time_min": 10,
  "cook_time_min": 15,
  "servings": 2,
  "ingredients": [
    "Precise ingredient item with quantity and measurement unit"
  ],
  "instructions": [
    "Clear, step-by-step sequential cooking instructions"
  ],
  "estimated_nutrition": {
    "calories_per_serving_kcal": 350.0,
    "protein_g": 20.0,
    "carbs_g": 35.0,
    "fat_g": 12.0
  },
  "safety_notes": [
    "Crucial food safety precaution (internal temperatures, cutting board hygiene, allergen vigilance)"
  ]
}
"""

def generate_recipe(
    req: RecipeRequest,
    db: Session,
    force_demo: bool = False
) -> RecipeResponse:
    is_demo = force_demo or not ai_client.is_available()
    data = None

    if not is_demo:
        ingredients_list = ", ".join(req.ingredients)
        allergies_list = ", ".join(req.allergies) if req.allergies else "None specified"
        user_prompt = f"""
Available Ingredients: {ingredients_list}
Diet Preference: {req.diet_preference}
Cuisine Style: {req.cuisine or 'Any'}
Max Total Time: {req.max_time_min or 30} minutes
Allergies / Avoid: {allergies_list}
Target Servings: {req.servings or 2}
"""
        parsed, error = ai_client.generate_text_json(
            system_prompt=RECIPE_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
        if parsed and "recipe_name" in parsed:
            data = parsed
        else:
            logger.warning(f"AI recipe generation failed: {error}. Falling back to demo recipe.")
            is_demo = True

    if is_demo or not data:
        # Match demo recipe by diet preference if possible
        candidates = [r for r in DEMO_RECIPES if req.diet_preference.lower() in r.get("diet_type", "").lower()]
        data = dict(candidates[0] if candidates else DEMO_RECIPES[0])
        is_demo = True

    nutrition_raw = data.get("estimated_nutrition", {})
    nutrition = RecipeNutrition(
        calories_per_serving_kcal=float(nutrition_raw.get("calories_per_serving_kcal", 350.0)),
        protein_g=float(nutrition_raw.get("protein_g", 18.0)),
        carbs_g=float(nutrition_raw.get("carbs_g", 30.0)),
        fat_g=float(nutrition_raw.get("fat_g", 12.0))
    )

    recipe_name = data.get("recipe_name", "Chef's Pantry Special")
    cuisine = data.get("cuisine", req.cuisine or "Contemporary")
    diet_type = data.get("diet_type", req.diet_preference)
    prep_time = int(data.get("prep_time_min", 15))
    cook_time = int(data.get("cook_time_min", 20))
    servings = int(data.get("servings", req.servings or 2))
    ingredients = data.get("ingredients", [])
    instructions = data.get("instructions", [])
    safety_notes = data.get("safety_notes", [])

    # Save recipe to DB
    db_record = RecipeModel(
        recipe_name=recipe_name,
        cuisine=cuisine,
        diet_type=diet_type,
        prep_time_min=prep_time,
        cook_time_min=cook_time,
        servings=servings,
        is_demo=is_demo
    )
    db_record.ingredients = ingredients
    db_record.instructions = instructions
    db_record.nutrition = nutrition.model_dump()
    db_record.safety_notes = safety_notes
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return RecipeResponse(
        id=db_record.id,
        recipe_name=recipe_name,
        cuisine=cuisine,
        diet_type=diet_type,
        prep_time_min=prep_time,
        cook_time_min=cook_time,
        servings=servings,
        ingredients=ingredients,
        instructions=instructions,
        estimated_nutrition=nutrition,
        safety_notes=safety_notes,
        disclaimer=RECIPE_ALLERGY_DISCLAIMER,
        is_demo=is_demo,
        created_at=db_record.created_at
    )
