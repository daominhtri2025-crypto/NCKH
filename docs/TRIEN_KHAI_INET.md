# Hướng dẫn triển khai lên hosting iNET

Tài liệu dành cho nhóm kỹ thuật. Mục tiêu: đưa ứng dụng lên hosting chia sẻ iNET (PHP 8.1 trở lên, MySQL/MariaDB) sau khi đã kiểm thử cục bộ theo `docs/CHAY_CUC_BO.md`.

Trước khi triển khai, cần xác nhận:
- Trên hosting có PHP 8.1 trở lên, extension `pdo_mysql`, và chức năng Terminal hoặc SSH để chạy lệnh `php`. Nếu không có Terminal, các lệnh trong mục 4 không thực hiện được và phải dùng cách thay thế ghi ở đó.
- Đã có phiếu đồng ý và phê duyệt đạo đức (xem mục 6).

## 1. Ai làm gì trên hosting

Nhóm kỹ thuật là vai trò duy nhất có quyền chạy lệnh trên máy chủ. Giáo viên và học sinh không đăng nhập vào hosting; họ chỉ dùng trình duyệt trên ứng dụng.

| Việc | Ai làm | Cách làm |
|---|---|---|
| Tạo CSDL, nạp lược đồ | Nhóm kỹ thuật | Terminal hoặc phpMyAdmin |
| Tạo lớp | Nhóm kỹ thuật | `php api/bin/add_class.php` |
| In thẻ mã cho lớp | Nhóm kỹ thuật | `php api/bin/issue_cards.php` |
| Tạo tài khoản giáo viên | Nhóm kỹ thuật | `php api/bin/create_teacher.php` |
| Đặt lại mật khẩu giáo viên | Nhóm kỹ thuật | `php api/bin/reset_teacher_password.php` |
| Xuất dữ liệu nghiên cứu | Nhóm kỹ thuật | `php api/bin/export_assessments.php` hoặc HTTP với `ADMIN_TOKEN` |

## 2. Cấu trúc thư mục trên hosting

```
public_html/
├── index.html               ← từ web/dist/
├── assets/                  ← từ web/dist/assets/
├── .htaccess                ← mục 5
└── api/
    ├── index.php
    ├── bootstrap.php
    ├── src/
    ├── content/
    ├── database/schema.sql
    ├── bin/
    └── .env                 ← tạo trên máy chủ, KHÔNG tải lên kho mã
```

## 3. Đưa mã lên và cấu hình

1. Trên máy cá nhân, build giao diện:
   ```bash
   cd web
   npm ci
   npm run build
   ```
   Kết quả nằm trong `web/dist/`.
2. Tải nội dung `web/dist/` lên `public_html/`.
3. Tải thư mục `api/` lên `public_html/api/`. Không tải `api/tests/`, `api/router.php` và `api/.env`.
4. Tạo CSDL và user MySQL trong bảng điều khiển iNET. Ghi lại tên CSDL, tên user, mật khẩu và host.
5. Tạo `public_html/api/.env` từ `api/.env.example`:
   ```ini
   APP_URL=https://<tên-miền-của-bạn>
   DB_HOST=<host CSDL do iNET cấp>
   DB_PORT=3306
   DB_NAME=<tên CSDL>
   DB_USER=<user CSDL>
   DB_PASS=<mật khẩu CSDL>
   ADMIN_TOKEN=<chuỗi ngẫu nhiên dài, hoặc để trống để tắt xuất HTTP>
   DELAYED_MIN_DAYS=28
   ```
   `APP_URL` phải khớp chính xác với địa chỉ người dùng truy cập, vì đây là một phần của kiểm tra CSRF.
6. Nạp lược đồ:
   ```bash
   cd public_html
   php api/bin/migrate.php
   ```
   Nếu không có Terminal, mở phpMyAdmin, chọn CSDL, tab **Import**, chọn `api/database/schema.sql`, rồi bấm **Go**.

## 4. Tạo lớp, in thẻ và cấp tài khoản giáo viên

Làm theo thứ tự, mỗi lớp một lần. Chạy từ thư mục `public_html`.

```bash
# 1. Tạo lớp
php api/bin/add_class.php 8A1 "Lớp 8A1" "<Tên cơ sở giáo dục>"

# 2. In thẻ mã (ví dụ 40 thẻ), lưu thành tệp CSV
php api/bin/issue_cards.php 8A1 40 the_8A1.csv

# 3. Tạo tài khoản giáo viên (mật khẩu được in ra một lần)
php api/bin/create_teacher.php gv_8a1 8A1
```

Sau khi chạy xong:
- Tệp `the_8A1.csv` chứa mã thẻ. Tải về máy cá nhân để in, rồi xóa khỏi hosting. Chỉ giữ bản in và sổ phát thẻ. Không để tệp này trên `public_html`, vì thư mục đó có thể bị truy cập qua trình duyệt.
- Mật khẩu giáo viên chỉ hiện một lần. Ghi lại và trao cho giáo viên qua kênh trực tiếp.
- Nếu giáo viên quên mật khẩu, chạy `php api/bin/reset_teacher_password.php gv_8a1`. Lệnh này cũng đăng xuất mọi phiên đang mở của giáo viên đó.

Cách thay thế khi không có Terminal: không có cách đơn giản. Cần nhờ nhà cung cấp hosting bật Terminal, hoặc chuyển dữ liệu lớp và thẻ bằng SQL trong phpMyAdmin, điều này không khuyến nghị vì dễ sai mã và không sinh được mật khẩu băm đúng.

## 5. Mẫu `.htaccess` (đặt tại `public_html/.htaccess`)

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

Nếu iNET không cho phép `RewriteRule ... - [F]`, chặn thư mục bằng `api/src/.htaccess` với nội dung `Require all denied`, và làm tương tự cho `api/bin/`, `api/database/`, `api/content/`, `api/tests/`.

## 6. Kiểm tra sau triển khai

1. Mở `https://<tên-miền>/api/health`. Kết quả phải là `{"ok":true}`.
2. Kiểm tra thẻ: chạy smoke test trỏ tới tên miền thật với một thẻ chưa kích hoạt:
   ```bash
   SMOKE_BASE=https://<tên-miền> SMOKE_CARD=XXXX-XXXX node scripts/smoke-test.mjs
   ```
   Thẻ này sẽ bị kích hoạt. Dùng một thẻ thử nghiệm riêng, không dùng thẻ của học sinh thật.
3. Đăng nhập giáo viên bằng tài khoản thử nghiệm và kiểm tra danh sách lớp.
4. Nếu bật xuất HTTP, kiểm tra `GET /api/admin/export/wide.csv` với header `X-Admin-Token` đúng và sai.

## 7. Vận hành và đạo đức nghiên cứu

- Sao lưu CSDL định kỳ và lưu bản sao ngoài hosting.
- Sổ phát thẻ (ai nhận thẻ nào) là thông tin nhạy cảm. Bảo quản riêng, không lưu trên hosting, không đưa vào kho mã.
- Không công bố kết quả theo lớp khi lớp có dưới 5 học sinh.
- Khi kết thúc nghiên cứu, xóa dữ liệu theo phiếu đồng ý và xóa tài khoản giáo viên.

## 8. Giới hạn đã biết

- Đăng nhập học sinh và giáo viên chưa có giới hạn số lần thử. Cần bổ sung trước khi triển khai rộng.
- Chưa có giao diện quản trị cho nhóm kỹ thuật; mọi thao tác trên mục 4 dùng dòng lệnh.
- Chưa có cơ chế nhắc khảo sát theo dõi.
- Chưa thử nghiệm trên hosting iNET thật. Mục 6 là bước bắt buộc để xác nhận.
- Lược đồ hiện tại chưa được triển khai lên hosting nào. Nếu CSDL đã được tạo bằng một phiên bản lược đồ cũ trong môi trường thử nghiệm, phải tạo lại CSDL trên hosting.
