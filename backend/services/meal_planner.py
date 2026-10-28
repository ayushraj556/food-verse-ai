import logging
import copy
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.config import settings
from backend.models import MealPlanModel
from backend.schemas import MealPlanRequest, MealPlanResponse, NUTRITION_DISCLAIMER
from backend.services.ai_client import ai_client
from backend.services.demo_data import DEMO_MEAL_PLANS

logger = logging.getLogger("food_verse.meal_planner")

MEAL_PLAN_SYSTEM_PROMPT = """
You are an expert Registered Dietitian and Meal Planning AI Assistant.
Create a comprehensive, personalized 7-Day Meal Plan (Monday through Sunday) tailored strictly to the user's diet preferences, caloric/macronutrient goals, schedule, and allergy restrictions.

CRITICAL RULES:
1. Provide healthy, nutritionally balanced, varied meals for every single day (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday).
2. For each day, include:
   - "breakfast": {"name": "...", "description": "...", "estimated_calories_kcal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
   - "lunch": {"name": "...", "description": "...", "estimated_calories_kcal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
   - "dinner": {"name": "...", "description": "...", "estimated_calories_kcal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
   - "snack": {"name": "...", "description": "...", "estimated_calories_kcal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0}
   - "daily_calories_kcal": total float
   - "daily_protein_g": total float
3. Strictly respect stated allergies and food intolerances.
4. DO NOT recommend extreme calorie restriction or dangerous crash diets. Keep daily targets sensible (typically 1400-2400 kcal based on goal).

OUTPUT MUST BE STRICTLY VALID JSON MATCHING:
{
  "title": "Inspiring Meal Plan Title",
  "diet_preference": "User diet type",
  "target_goal": "Goal description",
  "notes": "Guidance on meal prep, hydration, and nutritional focus",
  "plan_data": {
    "Monday": { ... },
    "Tuesday": { ... },
    "Wednesday": { ... },
    "Thursday": { ... },
    "Friday": { ... },
    "Saturday": { ... },
    "Sunday": { ... }
  }
}
"""

def generate_meal_plan(
    req: MealPlanRequest,
    db: Session,
    force_demo: bool = False
) -> MealPlanResponse:
    is_demo = force_demo or not ai_client.is_available()
    data = None

    if not is_demo:
        allergies_str = ", ".join(req.allergies) if req.allergies else "None"
        schedule_str = ", ".join(req.daily_schedule) if req.daily_schedule else "Breakfast, Lunch, Dinner, Snack"
        user_prompt = f"""
Meal Plan Title: {req.title}
Diet Preference: {req.diet_preference}
Primary Goal: {req.target_goal}
Strict Allergies / Ingredients to Avoid: {allergies_str}
Daily Schedule: {schedule_str}
Available Cooking Time: {req.cooking_time_pref or 'Moderate'}
Additional Notes: {req.additional_notes or 'Focus on fresh, whole foods'}
"""
        parsed, error = ai_client.generate_text_json(
            system_prompt=MEAL_PLAN_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )
        if parsed and "plan_data" in parsed:
            data = parsed
        else:
            logger.warning(f"AI meal plan generation failed: {error}. Falling back to demo plan.")
            is_demo = True

    if is_demo or not data:
        # Use demo plan
        demo_key = "Balanced Nutrition"
        demo_base = DEMO_MEAL_PLANS.get(demo_key, list(DEMO_MEAL_PLANS.values())[0])
        data = copy.deepcopy(demo_base)
        data["title"] = req.title or f"7-Day {req.diet_preference} Plan ({req.target_goal})"
        data["diet_preference"] = req.diet_preference
        data["target_goal"] = req.target_goal
        data["notes"] = f"[Demo Mode] Personalized demo template adapted for {req.diet_preference} with target '{req.target_goal}'."
        is_demo = True

    title = data.get("title", req.title or "7-Day Personalized Meal Plan")
    diet_pref = data.get("diet_preference", req.diet_preference)
    goal = data.get("target_goal", req.target_goal)
    notes = data.get("notes", "")
    plan_data = data.get("plan_data", {})

    # Save to DB
    db_record = MealPlanModel(
        title=title,
        diet_preference=diet_pref,
        target_goal=goal,
        notes=notes,
        is_demo=is_demo
    )
    db_record.allergies = req.allergies or []
    db_record.daily_schedule = req.daily_schedule or ["Breakfast", "Lunch", "Dinner", "Snack"]
    db_record.plan_data = plan_data
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return MealPlanResponse(
        id=db_record.id,
        title=title,
        diet_preference=diet_pref,
        target_goal=goal,
        allergies=db_record.allergies,
        daily_schedule=db_record.daily_schedule,
        plan_data=plan_data,
        notes=notes,
        disclaimer=NUTRITION_DISCLAIMER,
        is_demo=is_demo,
        created_at=db_record.created_at,
        updated_at=db_record.updated_at
    )
