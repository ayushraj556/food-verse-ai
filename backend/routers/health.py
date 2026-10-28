from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.config import settings
from backend.database import get_db
from backend.services.ai_client import ai_client

router = APIRouter(prefix="", tags=["System & Health"])

class VerifyKeyRequest(BaseModel):
    api_key: Optional[str] = None
    apply: bool = True

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "healthy" if db_ok else "degraded",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "is_demo_mode": settings.is_demo_mode,
        "active_model": settings.GEMINI_MODEL if not settings.is_demo_mode else "demo-dataset",
        "api_key_configured": bool(settings.GEMINI_API_KEY),
        "database_connected": db_ok,
        "max_upload_size_mb": settings.MAX_UPLOAD_SIZE_MB
    }

@router.post("/settings/verify-api-key")
def verify_api_key_endpoint(req: VerifyKeyRequest):
    key_to_test = (req.api_key or settings.GEMINI_API_KEY or "").strip()
    if not key_to_test:
        return {
            "valid": False,
            "message": "No API key was provided to verify.",
            "model": None,
            "active_mode": "Demo Mode" if settings.is_demo_mode else "AI Mode"
        }

    is_valid, message, model_used = ai_client.verify_api_key(key_to_test)

    if is_valid and req.apply:
        ai_client.set_api_key(key_to_test)
        if model_used:
            settings.GEMINI_MODEL = model_used

    return {
        "valid": is_valid,
        "message": message,
        "model": model_used or settings.GEMINI_MODEL,
        "active_mode": "AI Mode" if (is_valid and req.apply) else ("Demo Mode" if settings.is_demo_mode else "AI Mode")
    }
