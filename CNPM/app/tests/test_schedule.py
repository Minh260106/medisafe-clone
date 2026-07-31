import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import User
from app.auth import get_current_user

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


def override_get_current_user():
    db = TestingSessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            user = User(id=1, username="testuser", email="test@example.com", password_hash="hash", is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_teardown():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    user = User(id=1, username="testuser", email="test@example.com", password_hash="hash", is_active=True)
    db.add(user)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


class TestScheduleCreate:
    def test_create_schedule_success(self):
        medication_response = client.post(
            "/api/medications",
            json={
                "name": "Panadol",
                "form": "Viên",
                "dosage": "500mg",
                "stock": 10.0,
            },
        )
        medication_id = medication_response.json()["id"]

        response = client.post(
            "/api/schedules",
            json={
                "medication_id": medication_id,
                "frequency": "Mỗi ngày",
                "time_to_take": "08:00",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["medication_id"] == medication_id
        assert data["frequency"] == "Mỗi ngày"
        assert data["time_to_take"] == "08:00"
        assert "id" in data

    def test_create_schedule_validation_error(self):
        response = client.post(
            "/api/schedules",
            json={
                "frequency": "Mỗi ngày",
                "time_to_take": "8:00",
            },
        )

        assert response.status_code == 422
