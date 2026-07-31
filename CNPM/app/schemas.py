from enum import Enum
from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import Optional
from datetime import datetime, timezone


def _ensure_utc_iso(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


class MedicationBase(BaseModel):
    """Schema cơ bản cho Medication"""
    name: str = Field(..., min_length=1, max_length=255, description="Tên thuốc")
    form: str = Field(..., min_length=1, max_length=100, description="Dạng bào chế (Viên, Nước, Kem, ...)")
    dosage: str = Field(..., min_length=1, max_length=100, description="Liều lượng (500mg, 2 viên, ...)")
    stock: float = Field(..., ge=0, description="Tồn kho (phải >= 0)")


class MedicationCreate(MedicationBase):
    """Schema cho việc tạo Medication (POST request)"""
    pass


class MedicationUpdate(BaseModel):
    """Schema cho việc cập nhật Medication (PUT request)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    form: Optional[str] = Field(None, min_length=1, max_length=100)
    dosage: Optional[str] = Field(None, min_length=1, max_length=100)
    stock: Optional[float] = Field(None, ge=0)


class MedicationResponse(MedicationBase):
    """Schema cho response (GET, POST)"""
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, dt: datetime, _info) -> str:
        return _ensure_utc_iso(dt)

    model_config = ConfigDict(from_attributes=True)


class ScheduleCreate(BaseModel):
    medication_id: int = Field(..., description="ID thuốc cần đặt lịch")
    frequency: str = Field(..., min_length=1, max_length=50, description="Tần suất uống thuốc")
    time_to_take: str = Field(..., pattern=r"^([01]\d|2[0-3]):([0-5]\d)$", description="Giờ uống theo định dạng HH:MM")


class ScheduleResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    medication_id: int
    frequency: str
    time_to_take: str
    created_at: datetime
    updated_at: datetime

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, dt: datetime, _info) -> str:
        return _ensure_utc_iso(dt)

    model_config = ConfigDict(from_attributes=True)


class IntakeStatus(str, Enum):
    Taken = "Taken"
    Skipped = "Skipped"
    Snoozed = "Snoozed"


class IntakeLogCreate(BaseModel):
    schedule_id: int = Field(..., description="ID lịch uống cần ghi nhận")
    status: IntakeStatus = Field(..., description="Trạng thái hành động")


class IntakeLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    schedule_id: int
    status: str
    timestamp: datetime

    @field_serializer("timestamp")
    def serialize_timestamp(self, dt: datetime, _info) -> str:
        return _ensure_utc_iso(dt)

    model_config = ConfigDict(from_attributes=True)


class ComplianceStatsResponse(BaseModel):
    taken_percentage: float
    skipped_percentage: float

    model_config = ConfigDict(from_attributes=True)
