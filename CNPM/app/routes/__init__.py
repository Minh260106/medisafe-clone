from .medication import router as medication_router
from .schedule import router as schedule_router
from .log import router as log_router
from .stats import router as stats_router
from .auth_routes import router as auth_router

__all__ = ["medication_router", "schedule_router", "log_router", "stats_router", "auth_router"]
