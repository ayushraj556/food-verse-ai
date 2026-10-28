import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from backend.database import Base

class FoodAnalysisModel(Base):
    __tablename__ = "food_analyses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    image_filename = Column(String(255), nullable=True)
    food_name = Column(String(255), nullable=False)
    category = Column(String(100), default="General")
    detected_items_json = Column(Text, default="[]")
    calories_kcal = Column(Float, default=0.0)
    protein_g = Column(Float, default=0.0)
    carbs_g = Column(Float, default=0.0)
    fat_g = Column(Float, default=0.0)
    fiber_g = Column(Float, default=0.0)
    portion_size = Column(String(100), default="1 standard serving")
    confidence_score = Column(Float, default=0.85)
    confidence_note = Column(String(255), default="Visual estimation confidence")
    explanation = Column(Text, default="")
    dietary_tags_json = Column(Text, default="[]")
    is_demo = Column(Boolean, default=False)
    model_used = Column(String(100), default="demo")

    @property
    def detected_items(self):
        try:
            return json.loads(self.detected_items_json or "[]")
        except Exception:
            return []

    @detected_items.setter
    def detected_items(self, val):
        self.detected_items_json = json.dumps(val or [])

    @property
    def dietary_tags(self):
        try:
            return json.loads(self.dietary_tags_json or "[]")
        except Exception:
            return []

    @dietary_tags.setter
    def dietary_tags(self, val):
        self.dietary_tags_json = json.dumps(val or [])


class FreshnessModel(Base):
    __tablename__ = "freshness_analyses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    image_filename = Column(String(255), nullable=True)
    item_name = Column(String(255), nullable=False)
    freshness_status = Column(String(50), nullable=False)  # "Fresh", "Moderately Fresh", "Possibly Spoiled"
    confidence_level = Column(String(50), default="Moderate")  # "High", "Moderate", "Low"
    visual_indicators_json = Column(Text, default="[]")
    safety_guidance = Column(Text, default="")
    recommendations_json = Column(Text, default="[]")
    storage_tip = Column(Text, default="")
    is_demo = Column(Boolean, default=False)
    model_used = Column(String(100), default="demo")

    @property
    def visual_indicators(self):
        try:
            return json.loads(self.visual_indicators_json or "[]")
        except Exception:
            return []

    @visual_indicators.setter
    def visual_indicators(self, val):
        self.visual_indicators_json = json.dumps(val or [])

    @property
    def recommendations(self):
        try:
            return json.loads(self.recommendations_json or "[]")
        except Exception:
            return []

    @recommendations.setter
    def recommendations(self, val):
        self.recommendations_json = json.dumps(val or [])


class HygieneModel(Base):
    __tablename__ = "hygiene_analyses"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    file_name = Column(String(255), nullable=True)
    media_type = Column(String(50), default="image")  # "image" or "video"
    overall_hygiene_score = Column(String(50), default="Acceptable")  # "Good", "Moderate Concern", "Critical Attention"
    gloves_observed = Column(String(100), default="Not detected")
    hair_covering_observed = Column(String(100), default="Not detected")
    surface_cleanliness = Column(String(100), default="Visibly clear")
    cross_contamination_risk = Column(String(100), default="Low visible risk")
    observations_json = Column(Text, default="[]")
    concerns_json = Column(Text, default="[]")
    improvements_json = Column(Text, default="[]")
    limitations = Column(Text, default="")
    is_demo = Column(Boolean, default=False)
    model_used = Column(String(100), default="demo")

    @property
    def observations(self):
        try:
            return json.loads(self.observations_json or "[]")
        except Exception:
            return []

    @observations.setter
    def observations(self, val):
        self.observations_json = json.dumps(val or [])

    @property
    def concerns(self):
        try:
            return json.loads(self.concerns_json or "[]")
        except Exception:
            return []

    @concerns.setter
    def concerns(self, val):
        self.concerns_json = json.dumps(val or [])

    @property
    def improvements(self):
        try:
            return json.loads(self.improvements_json or "[]")
        except Exception:
            return []

    @improvements.setter
    def improvements(self, val):
        self.improvements_json = json.dumps(val or [])


class MealPlanModel(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    title = Column(String(255), nullable=False)
    diet_preference = Column(String(100), default="Vegetarian")
    target_goal = Column(String(100), default="Balanced Nutrition")
    allergies_json = Column(Text, default="[]")
    daily_schedule_json = Column(Text, default="[]")
    plan_data_json = Column(Text, nullable=False)  # Full 7-day structured JSON
    notes = Column(Text, default="")
    is_demo = Column(Boolean, default=False)

    @property
    def allergies(self):
        try:
            return json.loads(self.allergies_json or "[]")
        except Exception:
            return []

    @allergies.setter
    def allergies(self, val):
        self.allergies_json = json.dumps(val or [])

    @property
    def daily_schedule(self):
        try:
            return json.loads(self.daily_schedule_json or "[]")
        except Exception:
            return []

    @daily_schedule.setter
    def daily_schedule(self, val):
        self.daily_schedule_json = json.dumps(val or [])

    @property
    def plan_data(self):
        try:
            return json.loads(self.plan_data_json or "{}")
        except Exception:
            return {}

    @plan_data.setter
    def plan_data(self, val):
        self.plan_data_json = json.dumps(val or {})


class RecipeModel(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    recipe_name = Column(String(255), nullable=False)
    cuisine = Column(String(100), default="General")
    diet_type = Column(String(100), default="Any")
    prep_time_min = Column(Integer, default=15)
    cook_time_min = Column(Integer, default=20)
    servings = Column(Integer, default=2)
    ingredients_json = Column(Text, default="[]")
    instructions_json = Column(Text, default="[]")
    nutrition_json = Column(Text, default="{}")
    safety_notes_json = Column(Text, default="[]")
    is_demo = Column(Boolean, default=False)

    @property
    def ingredients(self):
        try:
            return json.loads(self.ingredients_json or "[]")
        except Exception:
            return []

    @ingredients.setter
    def ingredients(self, val):
        self.ingredients_json = json.dumps(val or [])

    @property
    def instructions(self):
        try:
            return json.loads(self.instructions_json or "[]")
        except Exception:
            return []

    @instructions.setter
    def instructions(self, val):
        self.instructions_json = json.dumps(val or [])

    @property
    def nutrition(self):
        try:
            return json.loads(self.nutrition_json or "{}")
        except Exception:
            return {}

    @nutrition.setter
    def nutrition(self, val):
        self.nutrition_json = json.dumps(val or {})

    @property
    def safety_notes(self):
        try:
            return json.loads(self.safety_notes_json or "[]")
        except Exception:
            return []

    @safety_notes.setter
    def safety_notes(self, val):
        self.safety_notes_json = json.dumps(val or [])
