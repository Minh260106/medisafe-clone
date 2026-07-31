from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Schedule, IntakeLog, Medication, User
from app.auth import get_current_user
from app.schemas import IntakeLogCreate, IntakeLogResponse, IntakeStatus

router = APIRouter(
    prefix="/logs",
    tags=["logs"],
    dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=List[IntakeLogResponse])
def list_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(IntakeLog)
        .filter(IntakeLog.user_id == current_user.id)
        .order_by(IntakeLog.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("", response_model=IntakeLogResponse, status_code=status.HTTP_201_CREATED)
def create_intake_log(
    log: IntakeLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Đảm bảo schedule thuộc về user hiện tại
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == log.schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch uống không tồn tại",
        )

    if log.status == IntakeStatus.Taken:
        medication = (
            db.query(Medication)
            .filter(Medication.id == schedule.medication_id, Medication.user_id == current_user.id)
            .with_for_update()
            .first()
        )
        if medication:
            if medication.stock < 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Số lượng thuốc trong kho không đủ (đã hết).",
                )
            medication.stock = round(max(0.0, medication.stock - 1), 2)
            db.add(medication)

    db_log = IntakeLog(
        schedule_id=log.schedule_id,
        user_id=current_user.id,
        status=log.status.value,
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


@router.get("/{log_id}", response_model=IntakeLogResponse)
def get_intake_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = (
        db.query(IntakeLog)
        .filter(IntakeLog.id == log_id, IntakeLog.user_id == current_user.id)
        .first()
    )
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhật ký uống thuốc không tồn tại",
        )
    return log


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_intake_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    log = (
        db.query(IntakeLog)
        .filter(IntakeLog.id == log_id, IntakeLog.user_id == current_user.id)
        .first()
    )
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhật ký uống thuốc không tồn tại",
        )

    db.delete(log)
    db.commit()
