from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Medication, Schedule, User
from app.auth import get_current_user
from app.schemas import ScheduleCreate, ScheduleResponse

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
    dependencies=[Depends(get_current_user)]
)


@router.get("", response_model=List[ScheduleResponse])
def list_schedules(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Schedule)
        .filter(Schedule.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Đảm bảo thuốc thuộc về user hiện tại
    medication = (
        db.query(Medication)
        .filter(Medication.id == schedule.medication_id, Medication.user_id == current_user.id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thuốc không tồn tại",
        )

    db_schedule = Schedule(
        medication_id=schedule.medication_id,
        user_id=current_user.id,
        frequency=schedule.frequency,
        time_to_take=schedule.time_to_take,
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch uống không tồn tại",
        )
    return schedule


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch uống không tồn tại",
        )

    # Đảm bảo thuốc mới (nếu đổi medication_id) thuộc về user hiện tại
    medication = (
        db.query(Medication)
        .filter(Medication.id == schedule_update.medication_id, Medication.user_id == current_user.id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thuốc không tồn tại",
        )

    schedule.medication_id = schedule_update.medication_id
    schedule.frequency = schedule_update.frequency
    schedule.time_to_take = schedule_update.time_to_take

    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    schedule = (
        db.query(Schedule)
        .filter(Schedule.id == schedule_id, Schedule.user_id == current_user.id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lịch uống không tồn tại",
        )

    db.delete(schedule)
    db.commit()
