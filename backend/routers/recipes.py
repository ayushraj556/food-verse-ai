from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import RecipeModel
from backend.schemas import RecipeRequest, RecipeResponse, RecipeNutrition, RECIPE_ALLERGY_DISCLAIMER
from backend.services.recipe_service import generate_recipe

router = APIRouter(prefix="/recipes", tags=["Smart Cooking Assistant"])

@router.post("/generate", response_model=RecipeResponse)
def generate_recipe_endpoint(
    req: RecipeRequest,
    force_demo: bool = Query(False),
    db: Session = Depends(get_db)
):
    return generate_recipe(req=req, db=db, force_demo=force_demo)

@router.get("", response_model=List[RecipeResponse])
def list_recipes(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    records = db.query(RecipeModel).order_by(RecipeModel.created_at.desc()).offset(offset).limit(limit).all()
    results = []
    for r in records:
        nut_dict = r.nutrition or {}
        results.append(RecipeResponse(
            id=r.id,
            recipe_name=r.recipe_name,
            cuisine=r.cuisine,
            diet_type=r.diet_type,
            prep_time_min=r.prep_time_min,
            cook_time_min=r.cook_time_min,
            servings=r.servings,
            ingredients=r.ingredients,
            instructions=r.instructions,
            estimated_nutrition=RecipeNutrition(
                calories_per_serving_kcal=nut_dict.get("calories_per_serving_kcal", 0.0),
                protein_g=nut_dict.get("protein_g", 0.0),
                carbs_g=nut_dict.get("carbs_g", 0.0),
                fat_g=nut_dict.get("fat_g", 0.0)
            ),
            safety_notes=r.safety_notes,
            disclaimer=RECIPE_ALLERGY_DISCLAIMER,
            is_demo=r.is_demo,
            created_at=r.created_at
        ))
    return results

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    r = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Recipe not found.")

    nut_dict = r.nutrition or {}
    return RecipeResponse(
        id=r.id,
        recipe_name=r.recipe_name,
        cuisine=r.cuisine,
        diet_type=r.diet_type,
        prep_time_min=r.prep_time_min,
        cook_time_min=r.cook_time_min,
        servings=r.servings,
        ingredients=r.ingredients,
        instructions=r.instructions,
        estimated_nutrition=RecipeNutrition(
            calories_per_serving_kcal=nut_dict.get("calories_per_serving_kcal", 0.0),
            protein_g=nut_dict.get("protein_g", 0.0),
            carbs_g=nut_dict.get("carbs_g", 0.0),
            fat_g=nut_dict.get("fat_g", 0.0)
        ),
        safety_notes=r.safety_notes,
        disclaimer=RECIPE_ALLERGY_DISCLAIMER,
        is_demo=r.is_demo,
        created_at=r.created_at
    )

@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    r = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    db.delete(r)
    db.commit()
    return {"status": "success", "message": f"Recipe {recipe_id} deleted successfully."}
