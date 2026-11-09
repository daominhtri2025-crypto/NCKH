# Chạy và kiểm thử trên máy cá nhân (Local)

Tài liệu này hướng dẫn từng lệnh để chạy "An Toàn Số Học Đường" trên máy tính cá nhân, gồm: cài gói phụ thuộc, tạo cơ sở dữ liệu MySQL, chạy API PHP và giao diện Vite, rồi kiểm thử.

Cấu hình cổng mặc định:

| Thành phần | Địa chỉ | Ghi chú |
|---|---|---|
| API PHP (Built-in Server) | `http://127.0.0.1:8000` | Dùng `127.0.0.1`, không dùng `localhost`, để khớp với proxy của Vite |
| Giao diện (Vite dev server) | `http://localhost:5173` | Trình duyệt mở địa chỉ này. Vite chuyển tiếp `/api` về cổng 8000 |

## 0. Windows với XAMPP (quy trình đã chạy thành công)

Phần này dành cho máy Windows dùng XAMPP (MariaDB 10.4.32, PHP 8.2.12). Các đường dẫn giả định XAMPP cài ở `C:\xampp`.

### 0.1. Chuẩn bị một lần

1. Mở **XAMPP Control Panel**, bấm **Start** ở dòng **MySQL**.
2. Kiểm tra PHP có `pdo_mysql` và `mysqli`:
   ```bat
   "C:\xampp\php\php.exe" -m | findstr /i "mysqli pdo_mysql"
   ```
   Nếu không thấy, mở `C:\xampp\php\php.ini`, bỏ dấu `;` ở hai dòng `extension=mysqli` và `extension=pdo_mysql` (mỗi dòng chỉ xuất hiện một lần).
3. **Chuyển bộ gõ sang tiếng Anh (EN)** trước khi nhập mật khẩu. Bộ gõ tiếng Việt kiểu Telex biến các chữ như `s`, `f`, `r`, `x`, `j` thành dấu thanh, làm mật khẩu bị sai.

### 0.2. Tạo CSDL, user và nạp schema (tự động)

Từ thư mục gốc dự án, chạy:

```bat
cd /d D:\UNG_DUNG_VIBE\NCKH
scripts\setup-windows.bat
```

Script làm các việc sau: tạo `antoanso_dev` và `antoanso_test`, tạo user `antoanso` với mật khẩu em nhập (chỉ chữ và số), sửa bảng `mysql.db` nếu bị hỏng, nạp `api\database\schema.sql`, tạo `api\.env`, tạo lớp `8A1`, và chạy bộ kiểm thử. Script giả định `root` của XAMPP chưa có mật khẩu.

Nếu muốn làm từng bước thủ công, xem phụ lục A cuối tài liệu.

### 0.3. Chạy hằng ngày (hai cửa sổ cmd)

**Cửa sổ 1: API PHP** (từ thư mục gốc):

```bat
cd /d D:\UNG_DUNG_VIBE\NCKH
"C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t api api\router.php
```

**Cửa sổ 2: giao diện Vite** (lệnh `npm` phải chạy trong thư mục `web`):

```bat
cd /d D:\UNG_DUNG_VIBE\NCKH\web
npm run dev
```

Lần đầu, chạy `npm install` trong `web` trước khi `npm run dev`.

Mở trình duyệt tại `http://localhost:5173`.

### 0.4. Kiểm tra nhanh

Ở cửa sổ thứ ba, trong thư mục gốc:

```bat
curl http://127.0.0.1:8000/api/health
```

Kết quả phải là `{"ok":true}`.

Muốn chạy smoke test luồng học sinh (cần Node.js và một thẻ mã chưa kích hoạt):

```bat
cd /d D:\UNG_DUNG_VIBE\NCKH
"C:\xampp\php\php.exe" api\bin\issue_cards.php 8A1 1 the_thu.csv
set SMOKE_CARD=<mã trong the_thu.csv, dạng XXXX-XXXX>
node scripts\smoke-test.mjs
```

### 0.5. Xử lý sự cố riêng cho Windows

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `'mysql' is not recognized` | Chưa thêm MySQL vào PATH | Dùng đường dẫn đầy đủ `"C:\xampp\mysql\bin\mysql.exe"` |
| `Access denied for user 'antoanso'` dù đã tạo user | Bộ gõ tiếng Việt, hoặc mật khẩu nhập khác với mật khẩu đã đặt | Chuyển bộ gõ sang EN, đặt lại mật khẩu bằng `ALTER USER` |
| `Index for table 'db' is corrupt` | Bảng quyền `mysql.db` bị hỏng | Chạy `REPAIR TABLE mysql.db;` bằng root |
| `npm error ENOENT ... package.json` | Chạy `npm` ở thư mục gốc | Chạy `npm` trong thư mục `web` |
| Nạp schema báo `Access denied` dù mật khẩu đúng | Khi dùng `<` để nạp tệp, `mysql.exe` đọc mật khẩu từ tệp thay vì bàn phím | Đăng nhập tương tác rồi dùng `SOURCE D:/UNG_DUNG_VIBE/NCKH/api/database/schema.sql;` |
| `Module "mysqli" is already loaded` | Một extension khai báo hai lần trong `php.ini` | Xóa dòng trùng, giữ một dòng `extension=mysqli` |

## Phụ lục A: Làm từng bước thủ công trên Windows

Dùng khi không chạy được script ở mục 0.2.

```bat
"C:\xampp\mysql\bin\mysql.exe" -u root
```

```sql
REPAIR TABLE mysql.db;
CREATE DATABASE IF NOT EXISTS antoanso_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS antoanso_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'antoanso'@'localhost' IDENTIFIED BY 'Antoanso2026';
CREATE USER IF NOT EXISTS 'antoanso'@'127.0.0.1' IDENTIFIED BY 'Antoanso2026';
ALTER USER 'antoanso'@'localhost' IDENTIFIED BY 'Antoanso2026';
ALTER USER 'antoanso'@'127.0.0.1' IDENTIFIED BY 'Antoanso2026';
GRANT ALL PRIVILEGES ON antoanso_dev.* TO 'antoanso'@'localhost';
GRANT ALL PRIVILEGES ON antoanso_test.* TO 'antoanso'@'localhost';
GRANT ALL PRIVILEGES ON antoanso_dev.* TO 'antoanso'@'127.0.0.1';
GRANT ALL PRIVILEGES ON antoanso_test.* TO 'antoanso'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

Sau đó đăng nhập tương tác và nạp schema:

```bat
"C:\xampp\mysql\bin\mysql.exe" -u antoanso -p antoanso_dev
```

```sql
SOURCE D:/UNG_DUNG_VIBE/NCKH/api/database/schema.sql;
SHOW TABLES;
EXIT;
```

Tạo `api\.env` từ `api\.env.example`, đặt `DB_PASS=Antoanso2026`, rồi tạo lớp:

```bat
"C:\xampp\php\php.exe" api\bin\add_class.php 8A1 "Lop 8A1" "THCS Thu nghiem"
```

---

## 1. Yêu cầu

- **PHP 8.1 trở lên**, có extension `pdo_mysql`. Kiểm tra: `php -v` và `php -m | grep pdo_mysql`.
- **MySQL 8.0 hoặc MariaDB 10.6 trở lên**. Kiểm tra: `mysql --version`.
- **Node.js 20 trở lên** (kèm npm). Kiểm tra: `node -v` và `npm -v`.
- **Git** để lấy mã nguồn.

## 2. Lấy mã nguồn đúng nhánh

```bash
git clone https://github.com/daominhtri2025-crypto/NCKH.git
cd NCKH
git checkout claude/gifted-brown-mfv1i8
```

## 3. Tạo cơ sở dữ liệu MySQL cục bộ

Đăng nhập MySQL với quyền quản trị (trên Windows dùng cùng lệnh trong PowerShell hoặc Command Prompt):

```bash
mysql -u root -p
```

Trong dấu nhắc `mysql>`, chạy lần lượt các lệnh sau (đổi `doi_mat_khau_nay` thành mật khẩu của em):

```sql
CREATE DATABASE antoanso_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE antoanso_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'antoanso'@'localhost' IDENTIFIED BY 'doi_mat_khau_nay';
GRANT ALL PRIVILEGES ON antoanso_dev.* TO 'antoanso'@'localhost';
GRANT ALL PRIVILEGES ON antoanso_test.* TO 'antoanso'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

- `antoanso_dev` dùng để chạy thử và ghi dữ liệu thử.
- `antoanso_test` dùng cho bộ kiểm thử. **Bộ kiểm thử xóa sạch dữ liệu trong CSDL này.**

## 4. Cấu hình API (`api/.env`)

Sao chép tệp mẫu:

```bash
cp api/.env.example api/.env
```

Trên Windows (PowerShell): `Copy-Item api/.env.example api/.env`

Mở `api/.env` bằng trình soạn thảo và điền:

```ini
APP_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=antoanso_dev
DB_USER=antoanso
DB_PASS=doi_mat_khau_nay
ADMIN_TOKEN=
DELAYED_MIN_DAYS=28
```

Ghi chú:
- `APP_URL` phải khớp với địa chỉ trình duyệt mở. Đây là một phần của kiểm tra CSRF.
- `ADMIN_TOKEN` để trống thì chức năng xuất dữ liệu bị tắt. Đặt một chuỗi ngẫu nhiên dài nếu cần xuất CSV.
- `DELAYED_MIN_DAYS=28` là số ngày tối thiểu trước khi mở khảo sát theo dõi. Đặt `0` khi cần thử nghiệm nhanh.

Ưu tiên của cấu hình: biến môi trường của tiến trình có ưu tiên hơn `api/.env`. Có thể đổi CSDL tạm thời mà không sửa tệp, ví dụ `DB_NAME=antoanso_test`.

## 5. Tạo bảng và lớp học thử

Có hai cách, chọn một.

**Cách A: dùng lệnh import SQL trực tiếp** (chạy từ thư mục gốc của dự án):

```bash
mysql -u antoanso -p antoanso_dev < api/database/schema.sql
```

**Cách B: dùng script PHP** (đọc cấu hình từ `api/.env`):

```bash
php api/bin/migrate.php
```

Sau đó tạo một lớp thử, rồi in thẻ mã cho lớp đó (học sinh kích hoạt thẻ, không tự đăng ký):

```bash
php api/bin/add_class.php 8A1 "Lớp 8A1" "THCS Thử nghiệm"
```

> **Cảnh báo:** các lệnh `php api/bin/*.php` đọc CSDL từ `api/.env`. Nếu `DB_NAME` trong `api/.env` đang là `antoanso_test`, lớp và dữ liệu sẽ bị ghi vào CSDL test, và bộ kiểm thử sẽ xóa chúng. Trước khi chạy, kiểm tra bằng `grep DB_NAME api/.env`. Muốn ghi vào CSDL khác, đặt biến môi trường trước lệnh, ví dụ `DB_NAME=antoanso_dev php api/bin/add_class.php ...`.

Kiểm tra bảng đã được tạo:

```bash
mysql -u antoanso -p antoanso_dev -e "SHOW TABLES;"
```

Kết quả phải có: `classes`, `participants`, `module_events`, `assessments_self`.

## 6. Cài gói phụ thuộc phía giao diện

```bash
cd web
npm install
cd ..
```

Lệnh `npm install` đọc `web/package-lock.json`, nên phiên bản các gói được cố định.

Tùy chọn: cấu hình cổng hoặc địa chỉ API của Vite bằng cách sao chép `web/.env.example` thành `web/.env`. Nếu không tạo, mặc định là `127.0.0.1:8000` và cổng `5173`.

## 7. Chạy đồng thời API và giao diện

Cần **hai cửa sổ Terminal**, mở từ thư mục gốc của dự án.

**Terminal 1: API PHP**

```bash
php -S 127.0.0.1:8000 -t api api/router.php
```

Giữ cửa sổ này mở. Khi chạy đúng, sẽ thấy dòng `Development Server ... started`.

Nếu muốn chọn CSDL cho máy chủ mà không sửa `api/.env`, đặt biến môi trường trước lệnh, ví dụ (macOS/Linux):

```bash
DB_NAME=antoanso_dev php -S 127.0.0.1:8000 -t api api/router.php
```

Windows (PowerShell):

```powershell
$env:DB_NAME="antoanso_dev"; php -S 127.0.0.1:8000 -t api api/router.php
```

**Terminal 2: giao diện Vite**

```bash
cd web
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

Kiểm tra nhanh cả hai dịch vụ (ở Terminal thứ ba):

```bash
curl http://127.0.0.1:8000/api/health
curl http://localhost:5173/api/health
```

Cả hai phải trả về `{"ok":true}`.

## 8. Kiểm thử

### 8.1. Kiểm thử tích hợp API (PHP)

Dùng CSDL riêng có tên kết thúc bằng `_test`. Lệnh này **xóa sạch** dữ liệu trong `antoanso_test`.

```bash
DB_NAME=antoanso_test php api/tests/run.php
```

Windows (PowerShell): `$env:DB_NAME="antoanso_test"; php api/tests/run.php`

Kết quả mong đợi: dòng cuối là `Kết quả: 142 đạt, 0 lỗi.` (số lượng có thể tăng khi thêm kiểm tra).

### 8.2. Kiểm thử đơn vị bộ đánh giá mật khẩu (Node)

```bash
cd web
npm run test:unit
cd ..
```

Kết quả mong đợi: `# pass 14` và `# fail 0`.

### 8.3. Kiểm tra kiểu và build giao diện

```bash
cd web
npm run build
cd ..
```

Lệnh này chạy `tsc --noEmit` rồi `vite build`. Không được có lỗi.

### 8.4. Kiểm thử nhanh luồng học sinh (smoke test)

Chạy khi **API và Vite đang chạy** (mục 7). Kịch bản đi qua đường `localhost:5173` như trình duyệt, và thực hiện:
kích hoạt thẻ mã → pre-test → đăng nhập lại bằng mã → Module 1, 2, 3 → post-test → kiểm tra khóa delayed.

```bash
node scripts/smoke-test.mjs
```

Tùy chọn qua biến môi trường:

```bash
SMOKE_CARD=XXXX-XXXX SMOKE_ADMIN_TOKEN=token_cua_em node scripts/smoke-test.mjs
```

Windows (PowerShell):

```powershell
$env:SMOKE_ADMIN_TOKEN="token_cua_em"; node scripts/smoke-test.mjs
```

Kết quả mong đợi: `Kết quả: N đạt, 0 lỗi.` và mã thoát 0.

Nếu smoke test báo "Thẻ phải chưa được kích hoạt", hãy in thẻ mới bằng `issue_cards.php`, vì mỗi thẻ chỉ kích hoạt một lần.

### 8.5. Thẻ mã và tài khoản giáo viên (thử nghiệm)

```bash
php api/bin/issue_cards.php 8A1 5 the_thu.csv
php api/bin/create_teacher.php gv_thu 8A1
php api/bin/reset_teacher_password.php gv_thu   # khi cần đặt lại mật khẩu
```

Ghi lại mật khẩu giáo viên được in ra (chỉ hiện một lần). Đăng nhập tại `http://localhost:5173` bằng "Giáo viên đăng nhập" để xem tiến độ lớp `8A1`. Tài khoản giáo viên chỉ đăng nhập vào ứng dụng trên trình duyệt; nhóm kỹ thuật làm việc bằng dòng lệnh như trên.

Lưu ý: CSDL dev tạo trước khi có thẻ mã cần tạo lại (xóa và nạp lại `schema.sql`), vì bảng `participants` và `teachers` đã thay đổi cấu trúc.

## 9. Xử lý sự cố thường gặp

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| `SQLSTATE[HY000] [2002] Connection refused` | MySQL chưa chạy | Khởi động dịch vụ MySQL/MariaDB |
| `SQLSTATE[HY000] [1045] Access denied` | Sai `DB_USER` hoặc `DB_PASS` | Kiểm tra `api/.env` |
| `SQLSTATE[42S02] Table ... doesn't exist` | Chưa import lược đồ | Chạy lại bước 5 |
| Trang trắng hoặc lỗi `/api` ở trình duyệt | API chưa chạy ở cổng 8000 | Kiểm tra Terminal 1 |
| `403 Nguồn yêu cầu không được phép (Origin)` | `APP_URL` không khớp địa chỉ trình duyệt | Đặt `APP_URL=http://localhost:5173` |
| `415 Yêu cầu ghi phải dùng Content-Type: application/json` | Gọi API ghi không có header JSON | Dùng giao diện hoặc thêm header `Content-Type: application/json` |
| Module bị khóa (403) | Chưa làm pre-test | Làm khảo sát đầu vào trước |
| `Address already in use` khi chạy PHP | Cổng 8000 đang bận | Đóng tiến trình cũ, hoặc đổi cổng và `VITE_API_TARGET` |
| Chỉ mở được `localhost:5173` nhưng không có dữ liệu | API không chạy ở `127.0.0.1` | Dùng `127.0.0.1:8000`, không dùng `localhost:8000` |
| Smoke test báo "Mã lớp không hợp lệ" | Chưa tạo lớp trong CSDL mà API đang dùng | Kiểm tra `DB_NAME` trong `api/.env`, rồi chạy lại mục 5 |
| Xuất CSV trả về 503 | `ADMIN_TOKEN` chưa được đặt trong `api/.env` | Đặt `ADMIN_TOKEN` rồi thử lại |
| Xuất CSV trả về 401 | Token gửi lên không khớp | Kiểm tra header `X-Admin-Token` |

## 10. Dừng các dịch vụ

- Dừng API: nhấn `Ctrl + C` ở Terminal 1.
- Dừng Vite: nhấn `Ctrl + C` ở Terminal 2.
