from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Medication, User
from app.auth import get_current_user
from app.schemas import MedicationCreate, MedicationResponse, MedicationUpdate
from typing import List

router = APIRouter(
    prefix="/medications",
    tags=["medications"],
    dependencies=[Depends(get_current_user)]
)


@router.post("", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(
    medication: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thêm một loại thuốc mới cho người dùng hiện tại
    """
    db_medication = Medication(
        name=medication.name,
        form=medication.form,
        dosage=medication.dosage,
        stock=medication.stock,
        user_id=current_user.id
    )
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication


@router.get("", response_model=List[MedicationResponse])
def get_medications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách thuốc của người dùng hiện tại
    """
    medications = (
        db.query(Medication)
        .filter(Medication.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return medications


@router.get("/{medication_id}", response_model=MedicationResponse)
def get_medication(
    medication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy thông tin chi tiết một loại thuốc theo ID của người dùng hiện tại
    """
    medication = (
        db.query(Medication)
        .filter(Medication.id == medication_id, Medication.user_id == current_user.id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Thuốc với ID {medication_id} không tồn tại"
        )
    return medication


@router.put("/{medication_id}", response_model=MedicationResponse)
def update_medication(
    medication_id: int,
    medication_update: MedicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin một loại thuốc của người dùng hiện tại
    """
    medication = (
        db.query(Medication)
        .filter(Medication.id == medication_id, Medication.user_id == current_user.id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Thuốc với ID {medication_id} không tồn tại"
        )
    
    update_data = medication_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medication, key, value)
    
    db.add(medication)
    db.commit()
    db.refresh(medication)
    return medication


@router.delete("/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(
    medication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa một loại thuốc của người dùng hiện tại
    """
    medication = (
        db.query(Medication)
        .filter(Medication.id == medication_id, Medication.user_id == current_user.id)
        .first()
    )
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Thuốc với ID {medication_id} không tồn tại"
        )
    
    db.delete(medication)
    db.commit()
