# 📌 Dự án: Quản lý Nhân sự

Hệ thống giúp doanh nghiệp quản lý thông tin nhân viên, yêu cầu nội bộ, hoạt động, và đánh giá khen thưởng một cách hiệu quả.

---

## 1. Yêu cầu chức năng

### 1.1. Quản lý hồ sơ nhân viên (Profile)
- Quản lý thông tin cơ bản: họ tên, căn cước/CMND, mã số thuế
- Địa chỉ, số điện thoại, email, tài khoản ngân hàng, …

### 1.2. Quản lý yêu cầu của nhân viên
- Các loại yêu cầu: nghỉ phép (leave), timesheet, check-in/out
- Quy trình: nhân viên tạo yêu cầu → quản lý phê duyệt

### 1.3. Quản lý hoạt động nhân viên
- Theo dõi hoạt động theo chiến dịch (ví dụ: chạy bộ)
- Lưu trữ: số km chạy, thời gian bắt đầu & kết thúc, thành tích

### 1.4. Quản lý khen thưởng (KPI)
- Mỗi nhân viên có điểm KPI theo tháng
- Nếu đạt mức điểm quy định → nhận thưởng
- Cho phép cấu hình mức điểm, mức thưởng
- Xử lý vi phạm nếu không đạt quy định

---

## 2. Yêu cầu công nghệ

| Layer     | Công nghệ đề xuất |
|----------|------------------|
| Backend  | Java Spring Boot |
| Frontend | ReactJS          |

---

## 3. Các mốc phát triển (Milestones)

### 🔹 Lần 1: Phát biểu & phân tích yêu cầu
- Trình bày lại đề tài
- Xác định các chức năng chính
- Mô tả dữ liệu sơ bộ (data dictionary)
- Vẽ use case tổng quan

### 🔹 Lần 2: Phân tích chi tiết
- Vẽ full use case cho từng chức năng
- Mô tả chi tiết (detail use case)
- Thiết kế database
- Xác định các module hệ thống

### 🔹 Lần 3: Thiết kế hệ thống
- Thiết kế giao diện UI
- Thiết kế service (API)
- Thiết kế database chi tiết
- Mockup giao diện

### 🔹 Lần 4: Xây dựng & tích hợp
- Lập trình frontend + backend + API
- Tích hợp toàn hệ thống
- Dữ liệu giả (dummy data) để demo
- Viết test case & kiểm thử
- Triển khai chạy thử
- Hoàn thiện báo cáo & chỉnh sửa cuối

---

## Mục tiêu dự án
- Quản lý nhân sự hiệu quả và minh bạch
- Tối ưu quy trình yêu cầu & phê duyệt
- Theo dõi hiệu suất làm việc dễ dàng
- Tạo môi trường làm việc chuyên nghiệp

---

## Thành viên nhóm
- Nông Quốc Việt  
- Nguyễn Quang Vũ  
- Nguyễn Văn Vũ  
- Bàn Hữu Bằng  

---

## Chạy hệ thống bằng Docker Compose

Hệ thống hỗ trợ khởi động nhanh toàn bộ Backend, Frontend và Database bằng **Docker Compose**.

### Yêu cầu môi trường
- Docker
- Docker Compose

### ▶️ Khởi động hệ thống

- Tại thư mục gốc của dự án (nơi chứa file `docker-compose.yml`), chạy lệnh: docker-compose up -d
- Các username mặc định: CEO, HR-HEAD, FIN-HEAD, IT-HEAD
- Mật khẩu mặc định là 123456
