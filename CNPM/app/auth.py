from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
import os
import logging
import bcrypt

# Fix passlib 1.7.4 compatibility with bcrypt 4.x on Python 3.13
try:
    _orig_hashpw = bcrypt.hashpw

    def _safe_hashpw(password, salt):
        if isinstance(password, str):
            password = password.encode("utf-8")
        if len(password) > 72:
            password = password[:72]
        return _orig_hashpw(password, salt)

    bcrypt.hashpw = _safe_hashpw
except Exception:
    pass

logger = logging.getLogger("uvicorn.error")

# ===== Cấu hình =====
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "CRITICAL SECURITY ERROR: SECRET_KEY is not set in environment variables (.env). "
        "Application cannot start without a valid SECRET_KEY."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 giờ

# ===== Password Hashing =====
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ===== OAuth2 =====
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu plain text với hash trong DB"""
    return pwd_context.verify(plain_password[:72], hashed_password)


def get_password_hash(password: str) -> str:
    """Tạo hash từ mật khẩu plain text"""
    return pwd_context.hash(password[:72])


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Tạo JWT access token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Xác thực người dùng bằng username HOẶC email.
    Trả về User nếu đúng, None nếu sai.
    """
    logger.info("Login attempt for: %s", username)

    # Tìm theo username trước
    user = db.query(User).filter(User.username == username).first()
    # Nếu không tìm thấy, thử tìm theo email
    if not user:
        user = db.query(User).filter(User.email == username).first()

    # Nếu vẫn không tìm thấy
    if not user:
        logger.warning("Login failed: user '%s' not found in database", username)
        return None

    # Kiểm tra mật khẩu
    if not verify_password(password, user.password_hash):
        logger.warning("Login failed: incorrect password for user '%s'", username)
        return None

    logger.info("Login successful for user '%s' (id=%d)", user.username, user.id)
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency: Lấy user hiện tại từ JWT token.
    Dùng trong các route cần xác thực.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception
        # JWT "sub" claim is always a string after decode; cast to int for DB lookup
        user_id = int(sub)
    except (JWTError, ValueError, TypeError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị vô hiệu hóa",
        )
    return user
