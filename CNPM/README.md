# 🏥 Medisafe Clone - Hệ Thống Quản Lý & Nhắc Nhở Uống Thuốc Thông Minh

> **Đồ án môn học:** Công nghệ Phần mềm (Software Engineering)
> **Thành viên phát triển:** > - Thành viên 1: Lead Backend Developer (Quản lý Database, APIs, Logic Nghiệp vụ)
> - Thành viên 2: Frontend Developer (Phát triển Giao diện Web/App, Tương tác Người dùng)


## 🎯 1.Product Vision

Đối với những bệnh nhân điều trị ngoại trú, người mắc bệnh mãn tính hoặc người cao tuổi, việc tuân thủ phác đồ điều trị và uống thuốc đúng giờ là yếu tố quyết định đến hiệu quả chữa bệnh. Tuy nhiên, sự bận rộn, suy giảm trí nhớ hoặc lịch trình phức tạp thường dẫn đến việc quên liều hoặc uống sai liều lượng.

**Medisafe Clone** ra đời nhằm giải quyết triệt để bài toán này bằng cách cung cấp một giải pháp công nghệ y tế (HealthTech) số hóa toàn bộ lịch trình sử dụng thuốc.

### 💡Product Vision Statement
* **DÀNH CHO** các bệnh nhân ngoại trú, người mắc bệnh mãn tính, người cao tuổi và những người chăm sóc sức khỏe chủ động.
* **NHỮNG NGƯỜI ĐANG GẶP KHÓ KHĂN** trong việc ghi nhớ phác đồ điều trị phức tạp, quản lý lượng thuốc tồn kho và theo dõi tỷ lệ tuân thủ uống thuốc hàng ngày.
* **SẢN PHẨM Medisafe Clone** là một hệ thống ứng dụng thông minh hỗ trợ quản lý danh mục thuốc và lập lịch nhắc nhở tự động.
* **MANG LẠI GIÁ TRỊ** tự động hóa quy trình theo dõi sức khỏe, cảnh báo thông minh khi đến giờ uống thuốc, ghi nhận lịch sử tương tác thời gian thực và cung cấp biểu đồ trực quan về mức độ tuân thủ điều trị.
* **KHÁC BIỆT VỚI** các ứng dụng báo thức thông thường hay ghi chú thủ công vốn dễ bị bỏ qua và không có khả năng kiểm soát số lượng thuốc còn lại hay đo lường độ tuân thủ.
* **SẢN PHẨM CỦA CHÚNG TÔI** tích hợp sâu giữa cơ sở dữ liệu PostgreSQL bảo mật mạnh mẽ và thuật toán lập lịch linh hoạt, tối ưu hóa giao diện người dùng tối giản giúp đơn giản hóa quá trình chăm sóc sức khỏe cá nhân.

---

## 🔍 2. Phân Tích Đối Tượng Mục Tiêu (User Personas)

Để tối ưu hóa trải nghiệm người dùng, hệ thống tập trung giải quyết nỗi đau (Pain Points) của 3 nhóm đối tượng chính:

| Chân dung (Persona) | Đặc điểm & Hành vi | Nỗi đau (Pain Points) | Giải pháp từ Medisafe Clone |
| :--- | :--- | :--- | :--- |
| **Bệnh nhân mãn tính** (Tiểu đường, Huyết áp...) | Phải uống nhiều loại thuốc khác nhau vào nhiều khung giờ cố định trong ngày, kéo dài liên tục. | - Quên liều do lịch uống quá dày.<br>- Hết thuốc đột xuất mà không kịp mua thêm. | - Lập lịch thông minh cho từng loại thuốc.<br>- Tự động trừ kho thuốc (`inventory`) và cảnh báo khi sắp hết thuốc. |
| **Người cao tuổi** | Trí nhớ suy giảm, không rành công nghệ phức tạp. | - Giao diện quá nhiều chữ hoặc nút bấm phức tạp.<br>- Không nhớ mình đã uống thuốc hay chưa. | - Giao diện tối giản, trực quan.<br>- Chỉ cần 1 chạm để xác nhận "Đã uống" (Taken) hoặc "Bỏ qua" (Skipped). |
| **Người bận rộn** | Đi làm, đi công tác thường xuyên, chăm sóc sức khỏe chủ động. | - Bị cuốn vào công việc dẫn đến trễ giờ uống thuốc.<br>- Không theo dõi được tiến trình tuân thủ phác đồ. | - Ghi nhận nhật ký thông tin thời gian thực.<br>- Dashboard thống kê tỷ lệ tuân thủ (%) theo tuần để điều chỉnh thói quen. |

---

## 🛠️ 3. Danh Sách Tính Năng Cốt Lõi (Core Features)

Dự án được phát triển theo mô hình Agile/Scrum, chia làm các Sprint tương ứng với các nhóm tính năng cốt lõi sau:

### 📦 Quản Lý Danh Mục Thuốc (Medication Management)
* Cho phép người dùng thêm mới thuốc vào tủ thuốc cá nhân với các thuộc tính: Tên thuốc, dạng bào chế (Viên nén, siro, tiêm...), liều lượng và số lượng tồn kho hiện tại.
* Cập nhật thông tin thuốc và kiểm soát số lượng thuốc tự động giảm dần sau mỗi lần uống.

### 📅 Lập Lịch Nhắc Nhở Thông Minh (Smart Scheduling)
* Thiết lập thời gian uống thuốc linh hoạt: Hàng ngày, cách ngày, hoặc các thứ cụ thể trong tuần.
* Đặt nhiều mốc thời gian uống trong ngày cho cùng một loại thuốc (ví dụ: Sáng 08:00, Tối 20:00).

### 📝 Nhật Ký Uống Thuốc Thời Gian Thực (Intake Logging)
* Ghi nhận phản hồi hành động của người dùng khi đến giờ uống thuốc:
  * **Taken (Đã uống):** Xác nhận đã dùng thuốc, hệ thống ghi nhận thời gian thực và tự động trừ 1 liều trong kho thuốc.
  * **Skipped (Bỏ qua):** Người dùng chủ động bỏ qua liều thuốc kèm theo lý do (nếu có).
  * **Snoozed (Nhắc lại):** Trì hoãn thông báo nhắc nhở sau 10-15 phút.

### 📊 Dashboard Thống Kê Tuân Thủ (Compliance Analytics)
* Tổng hợp dữ liệu từ lịch sử nhật ký (Intake Logs).
* Tính toán và hiển thị tỷ lệ tuân thủ điều trị (%) dưới dạng biểu đồ trực quan, giúp người dùng và bác sĩ điều trị dễ dàng đánh giá tiến trình phục hồi.

---

## 💻 4. Công Nghệ Sử Dụng (Technology Stack)

Hệ thống được xây dựng trên các công nghệ chuẩn công nghiệp, đảm bảo tính mở rộng (Scalability) và bảo mật (Security):

* **Backend Framework:** FastAPI (Python) - Đảm bảo hiệu năng cực cao, hỗ trợ Asynchronous (bất đồng bộ) mạnh mẽ và tự động sinh tài liệu API (Swagger UI).
* **Database System:** PostgreSQL - Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn dữ liệu thông qua các ràng buộc khóa ngoại (Foreign Keys).
* **ORM (Object-Relational Mapping):** SQLAlchemy - Giúp quản lý cơ sở dữ liệu dưới dạng các lớp đối tượng Python chuyên nghiệp.
* **Data Validation:** Pydantic - Kiểm tra tính hợp lệ của dữ liệu đầu vào và đầu ra ngay tại tầng gateway của API.
* **Environment Configuration:** Python-dotenv - Bảo vệ các thông tin nhạy cảm (mật khẩu database, cổng kết nối) thông qua file cấu hình môi trường `.env`.

---

## 📂 5. Kiến Trúc Mã Nguồn (Repository Structure)

Thư mục dự án được tổ chức theo cấu trúc **Clean Architecture** chuẩn chỉnh cho các dự án FastAPI:

```text
CNPM/
├── .github/
│   └── workflows/
│       └── python-app.yml       # Cấu hình tự động kiểm thử (CI/CD)
├── app/
│   ├── models/                  # Định nghĩa cấu trúc bảng Database (SQLAlchemy)
│   │   ├── medication.py
│   │   ├── schedule.py
│   │   └── ...
│   ├── routes/                  # Định nghĩa các endpoint APIs (FastAPI Routers)
│   │   ├── medication_routes.py
│   │   ├── schedule_routes.py
│   │   └── ...
│   ├── database.py              # Cấu hình kết nối và tạo phiên làm việc với PostgreSQL
│   └── main.py                  # Điểm khởi chạy (Entrypoint) của ứng dụng
├── .env.example                 # File cấu hình biến môi trường mẫu
├── .gitignore                   # Chặn các file rác và file chứa mật khẩu (.env) lên Git
├── README.md                    # Tài liệu hướng dẫn và tầm nhìn dự án
└── requirements.txt             # Danh sách thư viện Python cần cài đặt

## Yêu cầu hệ thống
- Python 3.11+

## Hướng dẫn cài đặt và chạy (Local)
1. Cài đặt thư viện:
   ```bash
   pip install -r requirements.txt
