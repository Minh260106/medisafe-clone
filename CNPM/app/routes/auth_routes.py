from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import logging

from app.database import get_db
from app.models.user import User
from app.auth import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_user,
)

logger = logging.getLogger("uvicorn.error")

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)


from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, field_validator, field_serializer, ConfigDict, model_validator
import re


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str = "user"
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, dt: Optional[datetime], _info) -> Optional[str]:
        if dt is None:
            return None
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat()

    model_config = ConfigDict(from_attributes=True)


class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=100, description="Tên đăng nhập (3-100 ký tự)")
    email: str = Field(..., max_length=255, description="Địa chỉ email")
    password: str = Field(..., min_length=6, max_length=100, description="Mật khẩu (tối thiểu 6 ký tự)")
    confirm_password: Optional[str] = Field(None, description="Xác nhận mật khẩu")

    @field_validator("username", "email")
    @classmethod
    def strip_and_validate(cls, v: str, info) -> str:
        if not v or not v.strip():
            raise ValueError(f"{info.field_name} không được để trống")
        val = v.strip()
        if info.field_name == "email":
            email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            if not re.match(email_regex, val):
                raise ValueError("Định dạng email không hợp lệ")
        return val

    @model_validator(mode="after")
    def validate_confirm_password(self):
        if self.confirm_password is not None and self.confirm_password != self.password:
            raise ValueError("Mật khẩu xác nhận không khớp")
        return self


# ===== Routes =====

@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Đăng nhập: nhận username (hoặc email) + password.
    Trả về access_token (JWT).
    """
    user = authenticate_user(db, form_data.username.strip(), form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tên đăng nhập hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị vô hiệu hóa",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """
    Đăng ký tài khoản mới.
    """
    username_clean = request.username.strip()
    email_clean = request.email.strip().lower()

    # Kiểm tra username đã tồn tại -> 409 CONFLICT
    existing_user = db.query(User).filter(User.username == username_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tên đăng nhập đã tồn tại"
        )

    # Kiểm tra email đã tồn tại -> 409 CONFLICT
    existing_email = db.query(User).filter(User.email == email_clean).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email đã được sử dụng"
        )

    logger.info("New registration request: username='%s', email='%s'", username_clean, email_clean)

    user = User(
        username=username_clean,
        email=email_clean,
        password_hash=get_password_hash(request.password),
        role="user",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Lấy thông tin user đang đăng nhập (cần token).
    """
    return current_user
