# db connection setup using environment variables
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env (if present)
load_dotenv()

logger = logging.getLogger("uvicorn.error")

DEFAULT_SQLITE_URL = "sqlite:///./medisafe.db"


def _build_engine(database_url: str):
    if database_url.startswith("sqlite"):
        return create_engine(database_url, connect_args={"check_same_thread": False})
    return create_engine(database_url, pool_pre_ping=True)


# Read the database URL from environment; fallback to a local SQLite file for
# development/testing to avoid hard-coded credentials in source code.
# Expected format for PostgreSQL: postgresql://<username>:<password>@<host>:<port>/<database>
SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL", DEFAULT_SQLITE_URL)

engine = _build_engine(SQLALCHEMY_DATABASE_URL)

# Try an initial connection; if PostgreSQL is unavailable, fall back to SQLite.
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    # Log which database is active
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        logger.info("Database: Connected to SQLite (local development)")
    else:
        logger.info("Database: Connected to PostgreSQL successfully")
except Exception as exc:
    if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        logger.warning("PostgreSQL unavailable (%s). Falling back to SQLite.", exc)
        SQLALCHEMY_DATABASE_URL = DEFAULT_SQLITE_URL
        os.environ["SQLALCHEMY_DATABASE_URL"] = DEFAULT_SQLITE_URL
        engine = _build_engine(SQLALCHEMY_DATABASE_URL)
    else:
        raise

# Khởi tạo phiên làm việc (Session)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class để các Models khác kế thừa
Base = declarative_base()


def init_db():
    """Khởi tạo bảng và tự động kiểm tra/bổ sung các cột mới nếu thiếu"""
    from sqlalchemy import inspect
    Base.metadata.create_all(bind=engine)
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        is_postgres = engine.dialect.name == "postgresql"
        timestamp_type = "TIMESTAMP WITH TIME ZONE" if is_postgres else "DATETIME"

        with engine.begin() as conn:
            if "users" in tables:
                columns = [c["name"] for c in inspector.get_columns("users")]
                if "hashed_password" in columns and "password_hash" not in columns:
                    conn.execute(text("ALTER TABLE users RENAME COLUMN hashed_password TO password_hash"))
                elif "password_hash" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))

                if "role" not in columns:
                    conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user' NOT NULL"))
                if "updated_at" not in columns:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN updated_at {timestamp_type}"))

            if "medications" in tables:
                med_cols = [c["name"] for c in inspector.get_columns("medications")]
                if "user_id" not in med_cols:
                    conn.execute(text("ALTER TABLE medications ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE"))

            if "schedules" in tables:
                sched_cols = [c["name"] for c in inspector.get_columns("schedules")]
                if "user_id" not in sched_cols:
                    conn.execute(text("ALTER TABLE schedules ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE"))

            if "intake_logs" in tables:
                log_cols = [c["name"] for c in inspector.get_columns("intake_logs")]
                if "user_id" not in log_cols:
                    conn.execute(text("ALTER TABLE intake_logs ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE"))
    except Exception as exc:
        logger.warning("Could not complete database migration check: %s", exc)


# Hàm lấy session database (Dùng cho các API sau này)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()