# Nâng cấp nền tảng Sales Funnel & Admin lên bản hoàn chỉnh

Phần lớn hệ thống đã có sẵn và chạy thật: form thu lead với 63 tỉnh chia theo miền, chống spam (bẫy ẩn + giới hạn 3 lần/5 phút), gửi lead qua webhook đa kênh, bắn sự kiện Pixel, tiêm mã theo dõi động, đổi màu/phông chữ trực tiếp, chuyển chế độ lưu trữ và kiểm tra kết nối.

Việc còn lại là thay nốt những phần còn sơ sài hoặc mới chỉ là hướng dẫn bằng chữ, để mọi thẻ trên thanh quản trị đều bấm được và làm việc thật.

## Những gì sẽ làm

### 1. Quản Lý Lead (Mini-CRM) — làm mới hoàn toàn

- Bảng lead đầy đủ cột: Tên, SĐT, Tỉnh/Thành, Ngành quan tâm, Thời gian, Nguồn UTM, Điểm AI, Nhãn.
- Ô tìm kiếm theo tên/SĐT, lọc theo trạng thái, nguồn và ngành.
- Đổi trạng thái từng lead (Mới → Đã gọi → Đang tư vấn → Chốt → Huỷ) và gắn nhãn tự do; lưu lại ngay.
- Xoá lead, xem chi tiết, và xuất CSV/Excel đúng theo bộ lọc đang chọn.

### 2. Thống Kê & Analytics — thêm biểu đồ

- Giữ các số liệu phiên truy cập, lượt đăng ký, tỷ lệ chuyển đổi.
- Thêm biểu đồ cột nguồn traffic và biểu đồ so sánh A/B, cùng bảng chuyển đổi theo từng nguồn.
- Nút làm mới số liệu và nút xoá số liệu thử nghiệm.

### 3. A/B Testing — chạy thật trên trang

- Tiêu đề và câu chốt ở khu vực đầu trang đổi theo biến thể A hoặc B đã chia.
- Trong bảng quản trị: nhập nội dung cho từng biến thể, chỉnh tỷ lệ chia, xem biến thể hiện tại của mình và ép xem thử A hoặc B.

### 4. Tự Động Hóa Email — xem trước và gửi thử

- Khung xem trước email đã thay sẵn {name}, {phone}, {city}, {ai_score} bằng dữ liệu mẫu hoặc một lead có thật.
- Nút "Gửi thử" chạy mô phỏng, hiện kết quả và ghi nhật ký các lần gửi.

### 5. Cloud Cron & Backup — thao tác thật

- Nút tải toàn bộ dữ liệu hệ thống (cấu hình + lead + thống kê) ra một file JSON.
- Nút nạp lại từ file JSON đã tải.
- Danh sách các bản lưu tự động gần nhất, khôi phục được từng bản.
- Nút kiểm tra kết nối nơi nhận backup.

### 6. Các thẻ còn là hướng dẫn — biến thành công cụ

- **Sửa Giao Diện**: sửa trực tiếp tiêu đề, mô tả, nhãn nút ở đầu trang và các khối chính.
- **Thêm Khối**: bật/tắt từng khối của trang (lợi ích, ngành học, chuyên gia, hình ảnh, đánh giá, FAQ…) và đổi thứ tự.
- **Đa Trang**: quản lý trang cảm ơn và các liên kết điều hướng.
- **UTM Hub**: công cụ tạo link quảng cáo có UTM, sao chép nhanh, kèm danh sách link đã tạo.

### 7. Gửi lead bền hơn

- Webhook gửi lỗi sẽ tự thử lại tối đa 3 lần (giãn dần), và ghi nhật ký kết quả từng kênh để xem trong bảng quản trị.

## Ghi chú kỹ thuật

- Dữ liệu lead/thống kê/nhật ký tiếp tục đi qua `src/services/dataAdapter.ts`; bổ sung trạng thái, nhãn, xoá lead, snapshot JSON và nhật ký webhook/email vào đây để cả hai chế độ lưu trữ dùng chung.
- Biến thể A/B đọc từ `src/lib/ab.ts` qua một hook nhỏ để trang chủ và admin dùng chung, có hỗ trợ ép biến thể bằng tham số URL.
- Biểu đồ vẽ bằng Recharts (đã có trong dự án) trong các panel admin.
- Các khối bật/tắt và nội dung sửa được lưu vào `SiteConfig`, giữ nguyên cơ chế LƯU / XUẤT CONFIG hiện tại.
- Không đổi thiết kế trang đích ngoài những chỗ cần đọc nội dung từ cấu hình.
