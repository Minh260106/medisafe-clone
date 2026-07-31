import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models.user import User
import os

# Database SQLite cho test
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_success():
    payload = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "Password123",
        "confirm_password": "Password123"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"
    assert data["role"] == "user"
    assert data["is_active"] is True
    assert "password" not in data
    assert "password_hash" not in data


def test_login_with_registered_user():
    # Register user first
    reg_payload = {
        "username": "loginuser",
        "email": "loginuser@example.com",
        "password": "SecretPassword123"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201

    # Login with username
    login_res = client.post(
        "/api/auth/login",
        data={"username": "loginuser", "password": "SecretPassword123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

    # Login with email
    login_email_res = client.post(
        "/api/auth/login",
        data={"username": "loginuser@example.com", "password": "SecretPassword123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert login_email_res.status_code == 200


def test_register_duplicate_username():
    payload = {
        "username": "duplicateuser",
        "email": "user1@example.com",
        "password": "Password123"
    }
    client.post("/api/auth/register", json=payload)

    # Try registering again with same username
    payload2 = {
        "username": "duplicateuser",
        "email": "user2@example.com",
        "password": "Password123"
    }
    res = client.post("/api/auth/register", json=payload2)
    assert res.status_code == 409
    assert "Tên đăng nhập đã tồn tại" in res.json()["detail"]


def test_register_duplicate_email():
    payload = {
        "username": "user1",
        "email": "same_email@example.com",
        "password": "Password123"
    }
    client.post("/api/auth/register", json=payload)

    # Try registering again with same email
    payload2 = {
        "username": "user2",
        "email": "same_email@example.com",
        "password": "Password123"
    }
    res = client.post("/api/auth/register", json=payload2)
    assert res.status_code == 409
    assert "Email đã được sử dụng" in res.json()["detail"]


def test_register_invalid_email():
    payload = {
        "username": "user1",
        "email": "not-an-email",
        "password": "Password123"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 422


def test_register_short_password():
    payload = {
        "username": "user1",
        "email": "user1@example.com",
        "password": "123"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 422


def test_register_mismatched_confirm_password():
    payload = {
        "username": "user1",
        "email": "user1@example.com",
        "password": "Password123",
        "confirm_password": "DifferentPassword123"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 422


def test_register_whitespace_trimming():
    payload = {
        "username": "  spaceduser  ",
        "email": "  spaced@example.com  ",
        "password": "Password123"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["username"] == "spaceduser"
    assert data["email"] == "spaced@example.com"


def test_password_is_hashed_in_db():
    payload = {
        "username": "hashcheck",
        "email": "hashcheck@example.com",
        "password": "MyPlainPassword123"
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 201

    db = TestingSessionLocal()
    try:
        user = db.query(User).filter(User.username == "hashcheck").first()
        assert user is not None
        assert user.password_hash != "MyPlainPassword123"
        assert user.password_hash.startswith("$2b$") or user.password_hash.startswith("$2a$")
    finally:
        db.close()
