import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient

from backend.main import app
from backend.database import Base, engine, SessionLocal

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield
    # Cleanup if needed

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture
def sample_image_bytes():
    img = Image.new("RGB", (120, 120), color=(200, 70, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

@pytest.fixture
def sample_png_bytes():
    img = Image.new("RGBA", (100, 100), color=(40, 160, 80, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
