import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models import Medication, User
from app.auth import get_current_user

# Tạo database SQLite in-memory cho testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tạo tất cả các bảng
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override get_db dependency cho test"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


def override_get_current_user():
    """Override get_current_user dependency cho test"""
    db = TestingSessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            user = User(id=1, username="testuser", email="test@example.com", password_hash="hash", is_active=True)
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

# Test client
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_teardown():
    """Cleanup database trước và sau mỗi test"""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    # Seed default test user
    db = TestingSessionLocal()
    user = User(id=1, username="testuser", email="test@example.com", password_hash="hash", is_active=True)
    db.add(user)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


class TestMedicationCreate:
    """Test cases cho endpoint POST /api/medications"""
    
    def test_create_medication_success(self):
        """Scenario 1: Thêm thuốc thành công"""
        # GIVEN: Người dùng cung cấp đầy đủ thông tin
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "dosage": "500mg",
            "stock": 10.0
        }
        
        # WHEN: Gửi request POST
        response = client.post("/api/medications", json=medication_data)
        
        # THEN: Trả về 201 Created
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Panadol"
        assert data["form"] == "Viên"
        assert data["dosage"] == "500mg"
        assert data["stock"] == 10.0
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
    
    def test_create_medication_missing_name(self):
        """Scenario 2: Thiếu tên thuốc (bắt buộc)"""
        # GIVEN: Bỏ trống tên thuốc
        medication_data = {
            "form": "Viên",
            "dosage": "500mg",
            "stock": 10.0
        }
        
        # WHEN: Gửi request POST
        response = client.post("/api/medications", json=medication_data)
        
        # THEN: Trả về 422 Unprocessable Entity
        assert response.status_code == 422
    
    def test_create_medication_missing_form(self):
        """Scenario 2: Thiếu dạng bào chế (bắt buộc)"""
        medication_data = {
            "name": "Panadol",
            "dosage": "500mg",
            "stock": 10.0
        }
        
        response = client.post("/api/medications", json=medication_data)
        assert response.status_code == 422
    
    def test_create_medication_missing_dosage(self):
        """Scenario 2: Thiếu liều lượng (bắt buộc)"""
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "stock": 10.0
        }
        
        response = client.post("/api/medications", json=medication_data)
        assert response.status_code == 422
    
    def test_create_medication_missing_stock(self):
        """Scenario 2: Thiếu tồn kho (bắt buộc)"""
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "dosage": "500mg"
        }
        
        response = client.post("/api/medications", json=medication_data)
        assert response.status_code == 422
    
    def test_create_medication_negative_stock(self):
        """Scenario 2: Tồn kho âm (không hợp lệ)"""
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "dosage": "500mg",
            "stock": -5.0
        }
        
        response = client.post("/api/medications", json=medication_data)
        assert response.status_code == 422
    
    def test_create_medication_empty_name(self):
        """Scenario 2: Tên thuốc rỗng (không hợp lệ)"""
        medication_data = {
            "name": "",
            "form": "Viên",
            "dosage": "500mg",
            "stock": 10.0
        }
        
        response = client.post("/api/medications", json=medication_data)
        assert response.status_code == 422


class TestMedicationGet:
    """Test cases cho endpoint GET /api/medications"""
    
    def test_get_medications_empty(self):
        """Lấy danh sách thuốc khi chưa có thuốc nào"""
        response = client.get("/api/medications")
        
        assert response.status_code == 200
        data = response.json()
        assert data == []
    
    def test_get_medications_multiple(self):
        """Lấy danh sách thuốc khi có nhiều thuốc"""
        # Tạo 3 thuốc
        medications_data = [
            {"name": "Panadol", "form": "Viên", "dosage": "500mg", "stock": 10},
            {"name": "Aspirin", "form": "Viên", "dosage": "100mg", "stock": 20},
            {"name": "Biogestin", "form": "Nước", "dosage": "5ml", "stock": 5}
        ]
        
        for med in medications_data:
            client.post("/api/medications", json=med)
        
        # Lấy danh sách
        response = client.get("/api/medications")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 3
        assert data[0]["name"] == "Panadol"
        assert data[1]["name"] == "Aspirin"
        assert data[2]["name"] == "Biogestin"
    
    def test_get_medications_with_pagination(self):
        """Lấy danh sách thuốc với pagination"""
        # Tạo 5 thuốc
        for i in range(5):
            medication_data = {
                "name": f"Thuốc {i+1}",
                "form": "Viên",
                "dosage": "100mg",
                "stock": 10
            }
            client.post("/api/medications", json=medication_data)
        
        # Lấy 2 bản ghi, bỏ qua 1 bản ghi
        response = client.get("/api/medications?skip=1&limit=2")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Thuốc 2"
        assert data[1]["name"] == "Thuốc 3"
    
    def test_get_medication_by_id_success(self):
        """Lấy chi tiết thuốc theo ID thành công"""
        # Tạo một thuốc
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "dosage": "500mg",
            "stock": 10
        }
        create_response = client.post("/api/medications", json=medication_data)
        medication_id = create_response.json()["id"]
        
        # Lấy chi tiết
        response = client.get(f"/api/medications/{medication_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == medication_id
        assert data["name"] == "Panadol"
    
    def test_get_medication_by_id_not_found(self):
        """Lấy chi tiết thuốc với ID không tồn tại"""
        response = client.get("/api/medications/9999")
        
        assert response.status_code == 404
        data = response.json()
        assert "không tồn tại" in data["detail"]


class TestMedicationDelete:
    """Test cases cho endpoint DELETE /api/medications/{id}"""
    
    def test_delete_medication_success(self):
        """Xóa thuốc thành công"""
        # Tạo một thuốc
        medication_data = {
            "name": "Panadol",
            "form": "Viên",
            "dosage": "500mg",
            "stock": 10
        }
        create_response = client.post("/api/medications", json=medication_data)
        medication_id = create_response.json()["id"]
        
        # Xóa thuốc
        response = client.delete(f"/api/medications/{medication_id}")
        
        assert response.status_code == 204
        
        # Kiểm tra thuốc đã bị xóa
        get_response = client.get(f"/api/medications/{medication_id}")
        assert get_response.status_code == 404
    
    def test_delete_medication_not_found(self):
        """Xóa thuốc không tồn tại"""
        response = client.delete("/api/medications/9999")
        
        assert response.status_code == 404
