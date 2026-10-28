from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.config import settings
from backend.database import get_db

router = APIRouter(prefix="", tags=["System & Health"])

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
