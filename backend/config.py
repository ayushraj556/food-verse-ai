import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory if present, or workspace root
env_path = Path(__file__).parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Food Verse AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Gemini AI Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

    # Server settings
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip() 
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    ]

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./food_verse.db")

    # Storage
    UPLOAD_DIR: Path = Path(os.getenv("UPLOAD_DIR", Path(__file__).parent / "uploads"))
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
    MAX_UPLOAD_SIZE_BYTES: int = MAX_UPLOAD_SIZE_MB * 1024 * 1024

    REQUEST_TIMEOUT_SECONDS: int = int(os.getenv("REQUEST_TIMEOUT_SECONDS", "30"))

    # Allowed mime types
    ALLOWED_IMAGE_TYPES: set[str] = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
    ALLOWED_VIDEO_TYPES: set[str] = {"video/mp4", "video/webm", "video/quicktime"}

    @property
    def is_demo_mode(self) -> bool:
        return not bool(self.GEMINI_API_KEY)

settings = Settings()
# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
