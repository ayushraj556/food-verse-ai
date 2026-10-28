from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import MealPlanModel
from backend.schemas import MealPlanRequest, MealPlanResponse, MealPlanUpdate, NUTRITION_DISCLAIMER
from backend.services.meal_planner import generate_meal_plan

router = APIRouter(prefix="/meal-plans", tags=["Personalized Meal Planner"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan_endpoint(
    req: MealPlanRequest,
    force_demo: bool = Query(False),
    db: Session = Depends(get_db)
):
    return generate_meal_plan(req=req, db=db, force_demo=force_demo)

@router.get("", response_model=List[MealPlanResponse])
def list_meal_plans(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    records = db.query(MealPlanModel).order_by(MealPlanModel.updated_at.desc()).offset(offset).limit(limit).all()
    return [
        MealPlanResponse(
            id=m.id,
            title=m.title,
            diet_preference=m.diet_preference,
            target_goal=m.target_goal,
            allergies=m.allergies,
            daily_schedule=m.daily_schedule,
            plan_data=m.plan_data,
            notes=m.notes,
            disclaimer=NUTRITION_DISCLAIMER,
            is_demo=m.is_demo,
            created_at=m.created_at,
            updated_at=m.updated_at
        )
        for m in records
    ]

@router.get("/{plan_id}", response_model=MealPlanResponse)
def get_meal_plan(plan_id: int, db: Session = Depends(get_db)):
    m = db.query(MealPlanModel).filter(MealPlanModel.id == plan_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meal plan not found.")

    return MealPlanResponse(
        id=m.id,
        title=m.title,
        diet_preference=m.diet_preference,
        target_goal=m.target_goal,
        allergies=m.allergies,
        daily_schedule=m.daily_schedule,
        plan_data=m.plan_data,
        notes=m.notes,
        disclaimer=NUTRITION_DISCLAIMER,
        is_demo=m.is_demo,
        created_at=m.created_at,
        updated_at=m.updated_at
    )

@router.put("/{plan_id}", response_model=MealPlanResponse)
def update_meal_plan(plan_id: int, update: MealPlanUpdate, db: Session = Depends(get_db)):
    m = db.query(MealPlanModel).filter(MealPlanModel.id == plan_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meal plan not found.")

    if update.title is not None:
        m.title = update.title
    if update.notes is not None:
        m.notes = update.notes
    if update.plan_data is not None:
        m.plan_data = update.plan_data

    db.commit()
    db.refresh(m)

    return MealPlanResponse(
        id=m.id,
        title=m.title,
        diet_preference=m.diet_preference,
        target_goal=m.target_goal,
        allergies=m.allergies,
        daily_schedule=m.daily_schedule,
        plan_data=m.plan_data,
        notes=m.notes,
        disclaimer=NUTRITION_DISCLAIMER,
        is_demo=m.is_demo,
        created_at=m.created_at,
        updated_at=m.updated_at
    )

@router.delete("/{plan_id}")
def delete_meal_plan(plan_id: int, db: Session = Depends(get_db)):
    m = db.query(MealPlanModel).filter(MealPlanModel.id == plan_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Meal plan not found.")
    db.delete(m)
    db.commit()
    return {"status": "success", "message": f"Meal plan {plan_id} deleted successfully."}
