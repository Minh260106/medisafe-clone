from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import IntakeLog, User
from app.auth import get_current_user
from app.schemas import ComplianceStatsResponse

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/compliance", response_model=ComplianceStatsResponse, status_code=status.HTTP_200_OK)
def get_compliance_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)

    logs = (
        db.query(IntakeLog)
        .filter(IntakeLog.user_id == current_user.id, IntakeLog.timestamp >= seven_days_ago)
        .all()
    )

    total_logs = len(logs)
    if total_logs == 0:
        return ComplianceStatsResponse(taken_percentage=0, skipped_percentage=0)

    taken_count = sum(1 for log in logs if log.status == "Taken")
    skipped_count = sum(1 for log in logs if log.status == "Skipped")

    taken_percentage = round((taken_count / total_logs) * 100, 2)
    skipped_percentage = round((skipped_count / total_logs) * 100, 2)

    return ComplianceStatsResponse(
        taken_percentage=taken_percentage,
        skipped_percentage=skipped_percentage,
    )
