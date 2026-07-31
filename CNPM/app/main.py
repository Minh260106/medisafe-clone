from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
from dotenv import load_dotenv

from app.database import engine, Base, init_db
from app.routes import medication_router, schedule_router, log_router, stats_router, auth_router
from app.models import Medication

# Load environment variables
load_dotenv()

# Global logger
logger = logging.getLogger("uvicorn.error")

# Khởi tạo tất cả các bảng trong database và chạy migration bổ sung nếu cần
try:
    init_db()
except Exception as exc:
    logger.warning("Could not initialize database tables: %s", exc)

# Khởi tạo ứng dụng FastAPI
app = FastAPI(
    title="Medisafe Clone API",
    description="API cho ứng dụng nhắc nhở uống thuốc"
)

# Configure CORS - allow origins come from environment variable `CORS_ORIGINS`
# Example: CORS_ORIGINS=http://localhost:3000,http://localhost:5173
cors_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(medication_router, prefix="/api")
app.include_router(schedule_router, prefix="/api")
app.include_router(log_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(auth_router, prefix="/api")


# Global exception handler to return friendly JSON responses and avoid leaking internals
logger = logging.getLogger("uvicorn.error")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


# Tạo một route (đường dẫn) cơ bản để test server
@app.get("/")
def read_root():
    return {"message": "Server FastAPI đang chạy thành công!"}