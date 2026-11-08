# An Toàn Số Học Đường

Ứng dụng web phục vụ đề tài nghiên cứu khoa học và trải nghiệm an toàn số cho học sinh THCS. Mã nguồn kế thừa cấu trúc và các lớp bảo mật từ dự án *Sơn Trà Số* (`daominhtri2025-crypto/Son_tra_so`).

## Thành phần

| Thư mục | Nội dung |
|---|---|
| `web/` | Giao diện React 19 + TypeScript + Vite |
| `api/` | API PHP 8.1+ với PDO MySQL, không framework |
| `api/database/` | Lược đồ CSDL (`schema.sql`) |
| `api/content/` | Nội dung kịch bản (JSON có phiên bản) |
| `docs/` | Hướng dẫn triển khai và vận hành |

## Mô-đun

- **Module 1: Sân chơi tình huống.** Đã hoàn thiện: 5 tình huống về cuộc gọi giả mạo, OTP, tin nhắn trúng thưởng, tài khoản mạo danh và trang thanh toán giả.
- **Module 2: Thám tử không gian mạng.** Đã hoàn thiện: 12 URL (5 chính thống, 7 giả mạo theo 5 kiểu đánh lừa), có thẻ "Đọc từ phải sang trái" và giải thích sau mỗi lượt. Mọi tên miền dùng đuôi `.test` hoặc `.example`.
- **Module 3: Phòng thí nghiệm tài khoản.** Đang phát triển.

## Bắt đầu nhanh

Xem hướng dẫn chi tiết tại [docs/TRIEN_KHAI_INET.md](docs/TRIEN_KHAI_INET.md).

```bash
php api/tests/run.php          # cần DB_NAME kết thúc bằng _test
cd web && npm run build        # kiểm tra kiểu và build giao diện
```

## Nguyên tắc nghiên cứu

- Học sinh đăng nhập bằng mã giả danh do hệ thống cấp, không nhập họ tên hay thông tin cá nhân.
- Điểm nghiên cứu chỉ tính trên lần trả lời đầu tiên của mỗi tình huống. Mọi lần thử đều được lưu để phân tích.
- Đáp án đúng không bao giờ được gửi đến trình duyệt trước khi học sinh trả lời.
