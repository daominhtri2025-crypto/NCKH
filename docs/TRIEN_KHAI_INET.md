# Hướng dẫn triển khai: An Toàn Số Học Đường

Tài liệu dành cho người phụ trách kỹ thuật. Mục tiêu: chạy thử cục bộ, sau đó đưa lên hosting chia sẻ iNET (PHP 8.1+ và MySQL/MariaDB).

## 1. Yêu cầu

- PHP 8.1 trở lên, các extension: `pdo_mysql`, `json`, `mbstring`.
- MySQL 8.0 hoặc MariaDB 10.6 trở lên.
- Node.js 20 trở lên (chỉ để build giao diện, không cần trên máy chủ).

## 2. Chạy thử cục bộ

```bash
# CSDL
mysql -uroot -e "CREATE DATABASE antoanso_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -uroot -e "CREATE USER 'antoanso'@'localhost' IDENTIFIED BY 'đổi_mật_khẩu'; GRANT ALL ON antoanso_dev.* TO 'antoanso'@'localhost';"

# Cấu hình API
cp api/.env.example api/.env        # sau đó sửa DB_NAME, DB_USER, DB_PASS

# Tạo bảng và lớp học thử
php api/bin/migrate.php
php api/bin/add_class.php 8A1 "Lớp 8A1" "THCS Thử nghiệm"

# Terminal 1: API
php -S 127.0.0.1:8000 -t api api/router.php

# Terminal 2: giao diện (proxy /api về cổng 8000)
cd web && npm install && npm run dev
```

Mở `http://localhost:5173`.

### Kiểm thử

```bash
# Bộ kiểm thử XÓA SẠCH dữ liệu, bắt buộc dùng CSDL có tên kết thúc bằng _test
mysql -uroot -e "CREATE DATABASE antoanso_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
DB_NAME=antoanso_test php api/tests/run.php

# Kiểm tra kiểu và build giao diện
cd web && npm run build
```

Lưu ý: biến môi trường của tiến trình có ưu tiên hơn tệp `api/.env`, nên có thể đổi CSDL mà không sửa tệp.

### Lưu ý khi cập nhật CSDL đã tạo trước đó

Lược đồ dùng `CREATE TABLE IF NOT EXISTS`, nên không tự thêm cột vào bảng đã có. Với CSDL tạo từ Module 1, chạy thêm một lần:

```sql
ALTER TABLE module_events ADD COLUMN hint_used TINYINT(1) NULL AFTER response_ms;
```

Với CSDL triển khai mới, không cần làm gì thêm: `schema.sql` đã có cột này.

### Chọn CSDL cho máy chủ dev

Biến môi trường của tiến trình có ưu tiên hơn `api/.env`. Khi chạy máy chủ dev, nên đặt rõ CSDL để không ghi nhầm vào CSDL kiểm thử:

```bash
DB_NAME=antoanso_dev php -S 127.0.0.1:8000 -t api api/router.php
```

## 3. Triển khai lên iNET

Cấu trúc đề xuất trên `public_html`:

```
public_html/
├── index.html            ← từ web/dist/
├── assets/               ← từ web/dist/assets/
├── .htaccess             ← định tuyến /api về api/index.php, và chuyển mọi đường dẫn khác về index.html
└── api/
    ├── index.php
    ├── bootstrap.php
    ├── src/
    ├── content/
    ├── database/schema.sql
    ├── bin/
    └── .env              ← tạo trên máy chủ, KHÔNG tải lên kho mã
```

Các bước:

1. Build giao diện: `cd web && npm ci && npm run build`. Kết quả nằm trong `web/dist/`.
2. Tải nội dung `web/dist/` lên `public_html/`.
3. Tải thư mục `api/` (không gồm `tests/`, `router.php` và `.env`) lên `public_html/api/`.
4. Tạo CSDL và người dùng MySQL trong bảng điều khiển iNET, sau đó tạo `public_html/api/.env` theo `api/.env.example` với thông tin thật.
5. Chạy `php public_html/api/bin/migrate.php` qua SSH hoặc chức năng Terminal (nếu có). Nếu không có SSH, chạy `schema.sql` trong phpMyAdmin.
6. Thêm lớp học bằng `php api/bin/add_class.php` hoặc trực tiếp bằng SQL vào bảng `classes`.
7. Đặt `APP_URL=https://<tên-miền-của-bạn>` trong `api/.env`. Giá trị này phải khớp chính xác với nguồn truy cập (dùng để chống CSRF).
8. Kiểm tra: `https://<tên-miền>/api/health` phải trả về `{"ok":true}`.

### Mẫu `.htaccess` (đặt tại `public_html/.htaccess`)

```apache
RewriteEngine On

# Chặn truy cập vào mã nguồn, CSDL và script (phải đặt TRƯỚC quy tắc /api bên dưới)
RewriteRule ^api/(src|database|content|bin|tests)(/|$) - [F,L]

# API: /api/... → api/index.php
RewriteRule ^api/?$ api/index.php [L,QSA]
RewriteRule ^api/(.*)$ api/index.php [L,QSA]

# Tệp và thư mục có thật thì giữ nguyên
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Ứng dụng một trang: mọi đường dẫn khác về index.html
RewriteRule ^ index.html [L]

<IfModule mod_headers.c>
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

Lưu ý: nếu iNET không cho phép `RewriteRule ... - [F]`, hãy chặn thư mục bằng `api/src/.htaccess` với nội dung `Require all denied`.

## 4. Vận hành và đạo đức nghiên cứu

- Chỉ đưa dữ liệu ra ngoài sau khi đã ẩn danh. Hệ thống không lưu họ tên, email, số điện thoại.
- Mã học sinh là định danh duy nhất. Không in mã kèm tên học sinh trên cùng một tờ giấy.
- Sao lưu CSDL định kỳ và lưu bản sao ngoài máy chủ.
- Khi kết thúc nghiên cứu, xóa dữ liệu theo quy định đã ghi trong phiếu đồng ý.

## 5. Giới hạn đã biết

- Chưa có giới hạn tần suất cho đăng nhập bằng mã. Mã 8 ký tự (khoảng 40 bit) là định danh nghiên cứu, không phải mật khẩu. Nếu lớp học lớn hoặc có rủi ro dò mã, cần bổ sung giới hạn theo IP.
- Module 1 và Module 2 đã hoàn thiện. Module 3 đang ở trạng thái "Sắp mở".
- Bảng điều khiển quản trị cho giáo viên và chức năng xuất dữ liệu nghiên cứu sẽ được làm sau.
