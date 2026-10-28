import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.database import init_db
from backend.routers import (
    health,
    food,
    freshness,
    hygiene,
    recipes,
    meal_plans,
    history,
    stats,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("food_verse.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    logger.info("Initializing Food Verse AI database schema...")
    init_db()
    logger.info(f"Database initialized. Demo mode active: {settings.is_demo_mode}")
    yield
    logger.info("Food Verse AI backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Food Intelligence Platform featuring nutritional recognition, freshness screening, kitchen hygiene inspection, and AI meal planning.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers under /api
app.include_router(health.router, prefix=settings.API_PREFIX)
app.include_router(food.router, prefix=settings.API_PREFIX)
app.include_router(freshness.router, prefix=settings.API_PREFIX)
app.include_router(hygiene.router, prefix=settings.API_PREFIX)
app.include_router(recipes.router, prefix=settings.API_PREFIX)
app.include_router(meal_plans.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)
app.include_router(stats.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "message": "Welcome to Food Verse AI - Multimodal Food Intelligence Agent API",
        "docs_url": "/docs",
        "health_check": f"{settings.API_PREFIX}/health",
        "demo_mode": settings.is_demo_mode,
        "version": settings.VERSION
    }

# Global JSON error handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing your food intelligence request.",
            "detail": str(exc) if not isinstance(exc, KeyError) else "Key error"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
