from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Constants for Disclaimers
NUTRITION_DISCLAIMER = (
    "Nutritional values are visual AI estimates and approximate. "
    "Actual values vary significantly by exact portion weight, hidden fats, cooking oils, "
    "sodium, and preparation methods. Not intended as medical or clinical dietetic advice."
)

FRESHNESS_DISCLAIMER = (
    "Visual screening only. Appearance cannot reliably detect harmful bacterial pathogens "
    "(such as Salmonella, Listeria, or E. coli), invisible toxins, or internal mold. "
    "When in doubt, prioritize safety and do not consume questionable food."
)

HYGIENE_DISCLAIMER = (
    "Preliminary visual observation based strictly on visible frames. This automated analysis "
    "does not constitute a formal food safety inspection, health department certification, or regulatory compliance guarantee."
)

RECIPE_ALLERGY_DISCLAIMER = (
    "Please verify all ingredient packaging labels for allergen cross-contamination, especially "
    "if preparing meals for individuals with severe or life-threatening food allergies."
)

# ----------------- Food Recognition & Nutrition -----------------
class DetectedItem(BaseModel):
    name: str = Field(..., description="Name of the detected food component")
    portion: str = Field("1 serving", description="Portion estimate for this component")
    calories_kcal: float = Field(0.0, description="Estimated calories in kcal")
    protein_g: float = Field(0.0, description="Estimated protein in grams")
    carbs_g: float = Field(0.0, description="Estimated carbohydrates in grams")
    fat_g: float = Field(0.0, description="Estimated fat in grams")
    fiber_g: Optional[float] = Field(0.0, description="Estimated fiber in grams")

class NutritionSummary(BaseModel):
    total_calories_kcal: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    total_fiber_g: float = 0.0

class FoodAnalysisResponse(BaseModel):
    id: Optional[int] = None
    food_name: str
    category: str = "General"
    image_filename: Optional[str] = None
    detected_items: List[DetectedItem] = []
    nutrition_summary: NutritionSummary
    portion_size: str = "1 standard serving"
    confidence_score: float = Field(0.85, ge=0.0, le=1.0)
    confidence_note: str
    explanation: str
    dietary_tags: List[str] = []
    disclaimer: str = NUTRITION_DISCLAIMER
    is_demo: bool = False
    model_used: str = "demo"
    created_at: Optional[datetime] = None

# ----------------- Food Freshness Analysis -----------------
class FreshnessResponse(BaseModel):
    id: Optional[int] = None
    item_name: str
    image_filename: Optional[str] = None
    freshness_status: str  # "Fresh", "Moderately Fresh", "Possibly Spoiled"
    confidence_level: str  # "High", "Moderate", "Low"
    visual_indicators: List[str] = []
    safety_guidance: str
    recommendations: List[str] = []
    storage_tip: Optional[str] = ""
    disclaimer: str = FRESHNESS_DISCLAIMER
    is_demo: bool = False
    model_used: str = "demo"
    created_at: Optional[datetime] = None

# ----------------- Kitchen Hygiene Analysis -----------------
class HygieneResponse(BaseModel):
    id: Optional[int] = None
    file_name: Optional[str] = None
    media_type: str = "image"
    overall_hygiene_score: str  # "Good", "Moderate Concern", "Critical Attention"
    gloves_observed: str
    hair_covering_observed: str
    surface_cleanliness: str
    cross_contamination_risk: str
    observations: List[str] = []
    concerns: List[str] = []
    improvements: List[str] = []
    limitations: str
    disclaimer: str = HYGIENE_DISCLAIMER
    is_demo: bool = False
    model_used: str = "demo"
    created_at: Optional[datetime] = None

# ----------------- Smart Cooking Assistant -----------------
class RecipeRequest(BaseModel):
    ingredients: List[str] = Field(..., min_length=1, description="Available pantry/fridge ingredients")
    diet_preference: str = Field("Vegetarian", description="Vegetarian, Non-Vegetarian, Vegan, Pescatarian, Any")
    cuisine: Optional[str] = Field("Any", description="e.g. Italian, Indian, Mexican, Mediterranean, Asian")
    max_time_min: Optional[int] = Field(30, description="Maximum total cooking and prep time in minutes")
    allergies: Optional[List[str]] = Field(default=[], description="Allergies or ingredients to strictly avoid")
    servings: Optional[int] = Field(2, ge=1, le=12)

class RecipeNutrition(BaseModel):
    calories_per_serving_kcal: float = 0.0
    protein_g: float = 0.0
    carbs_g: float = 0.0
    fat_g: float = 0.0

class RecipeResponse(BaseModel):
    id: Optional[int] = None
    recipe_name: str
    cuisine: str
    diet_type: str
    prep_time_min: int
    cook_time_min: int
    servings: int
    ingredients: List[str]
    instructions: List[str]
    estimated_nutrition: RecipeNutrition
    safety_notes: List[str] = []
    disclaimer: str = RECIPE_ALLERGY_DISCLAIMER
    is_demo: bool = False
    created_at: Optional[datetime] = None

# ----------------- Personalized Meal Planner -----------------
class MealItem(BaseModel):
    name: str
    description: str
    estimated_calories_kcal: float
    protein_g: float
    carbs_g: float
    fat_g: float

class DayMealPlan(BaseModel):
    day: str  # "Monday", "Tuesday", etc.
    breakfast: MealItem
    lunch: MealItem
    dinner: MealItem
    snack: Optional[MealItem] = None
    daily_calories_kcal: float
    daily_protein_g: float

class MealPlanRequest(BaseModel):
    title: Optional[str] = "7-Day Personalized Meal Plan"
    diet_preference: str = Field("Vegetarian", description="Vegetarian, Non-Vegetarian, Vegan, Keto, Balanced")
    target_goal: str = Field("Balanced Nutrition", description="Balanced Nutrition, High Protein, Weight Management, Muscle Gain, Heart Health")
    allergies: Optional[List[str]] = Field(default=[], description="Allergies or ingredients to strictly avoid")
    daily_schedule: Optional[List[str]] = Field(default=["Breakfast", "Lunch", "Dinner", "Snack"])
    cooking_time_pref: Optional[str] = Field("Under 30 mins", description="Time available for cooking")
    additional_notes: Optional[str] = ""

class MealPlanResponse(BaseModel):
    id: Optional[int] = None
    title: str
    diet_preference: str
    target_goal: str
    allergies: List[str] = []
    daily_schedule: List[str] = []
    plan_data: Dict[str, Any]  # Keyed by days e.g. "Monday", "Tuesday", etc.
    notes: Optional[str] = ""
    disclaimer: str = NUTRITION_DISCLAIMER
    is_demo: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class MealPlanUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    plan_data: Optional[Dict[str, Any]] = None

# ----------------- Dashboard & History -----------------
class CategoryCount(BaseModel):
    category: str
    count: int

class RecentActivity(BaseModel):
    id: int
    type: str  # "food", "freshness", "hygiene", "meal_plan", "recipe"
    title: str
    timestamp: datetime
    status_or_metric: str
    is_demo: bool

class DashboardStats(BaseModel):
    total_analyses: int
    food_analyses_count: int
    freshness_count: int
    hygiene_count: int
    meal_plans_count: int
    avg_calories_kcal: float
    category_distribution: List[CategoryCount]
    recent_activities: List[RecentActivity]

class HistoryItem(BaseModel):
    id: int
    type: str  # "food", "freshness", "hygiene"
    title: str
    created_at: datetime
    summary: str
    metrics: Dict[str, Any]
    image_filename: Optional[str] = None
    is_demo: bool
    model_used: str
    full_data: Dict[str, Any]
