from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Medication(Base):
    __tablename__ = "medications"
    __table_args__ = (
        CheckConstraint("stock >= 0", name="check_stock_non_negative"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    name = Column(String(255), nullable=False, index=True)  # Tên thuốc (Panadol, ...)
    form = Column(String(100), nullable=False)  # Dạng bào chế (Viên, Nước, Kem, ...)
    dosage = Column(String(100), nullable=False)  # Liều lượng (500mg, 2 viên, ...)
    stock = Column(Float, nullable=False, default=0)  # Tồn kho (số lượng)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Thời gian tạo
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # Thời gian cập nhật

    # ORM Relationships
    user = relationship("User", back_populates="medications")
    schedules = relationship("Schedule", back_populates="medication", cascade="all, delete-orphan")