@echo off
rem ============================================================
rem  Thiet lap An Toan So Hoc Duong tren Windows voi XAMPP.
rem  Chay tu thu muc bat ky: double-click file nay hoac chay trong cmd.
rem  Yeu cau: XAMPP da cai, MySQL/MariaDB dang Start trong XAMPP Control Panel,
rem  tai khoan root cua MySQL chua co mat khau (mac dinh cua XAMPP).
rem  Nen chuyen bo go sang tieng Anh (EN) truoc khi nhap mat khau.
rem ============================================================

cd /d "%~dp0\.."

set "MYSQL=C:\xampp\mysql\bin\mysql.exe"
set "PHP=C:\xampp\php\php.exe"

if not exist "%MYSQL%" (
  echo [LOI] Khong tim thay %MYSQL%. Kiem tra lai duong dan XAMPP.
  exit /b 1
)
if not exist "%PHP%" (
  echo [LOI] Khong tim thay %PHP%. Kiem tra lai duong dan XAMPP.
  exit /b 1
)

echo.
echo Nhap mat khau cho user antoanso: chi chu cai va chu so, khong dau cach.
echo Vi du: Antoanso2026
set /p "APP_PASS=Mat khau: "
echo(%APP_PASS%| findstr /R "^[A-Za-z0-9][A-Za-z0-9]*$" >nul
if errorlevel 1 (
  echo [LOI] Mat khau chi duoc chua chu cai va chu so, khong co khoang trang.
  exit /b 1
)

echo.
echo [1/5] Tao CSDL, user va cap quyen...
set "SQL=%TEMP%\antoanso_setup.sql"
(
  echo REPAIR TABLE mysql.db;
  echo CREATE DATABASE IF NOT EXISTS antoanso_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  echo CREATE DATABASE IF NOT EXISTS antoanso_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  echo CREATE USER IF NOT EXISTS 'antoanso'@'localhost' IDENTIFIED BY '%APP_PASS%';
  echo CREATE USER IF NOT EXISTS 'antoanso'@'127.0.0.1' IDENTIFIED BY '%APP_PASS%';
  echo ALTER USER 'antoanso'@'localhost' IDENTIFIED BY '%APP_PASS%';
  echo ALTER USER 'antoanso'@'127.0.0.1' IDENTIFIED BY '%APP_PASS%';
  echo GRANT ALL PRIVILEGES ON antoanso_dev.* TO 'antoanso'@'localhost';
  echo GRANT ALL PRIVILEGES ON antoanso_test.* TO 'antoanso'@'localhost';
  echo GRANT ALL PRIVILEGES ON antoanso_dev.* TO 'antoanso'@'127.0.0.1';
  echo GRANT ALL PRIVILEGES ON antoanso_test.* TO 'antoanso'@'127.0.0.1';
  echo FLUSH PRIVILEGES;
) > "%SQL%"
"%MYSQL%" -u root < "%SQL%"
if errorlevel 1 (
  echo [LOI] Khong thiet lap duoc CSDL bang user root. Xem thong bao loi phia tren.
  del "%SQL%" >nul 2>&1
  exit /b 1
)
del "%SQL%" >nul 2>&1

echo [2/5] Nap cau truc bang tu api\database\schema.sql...
"%MYSQL%" -u antoanso -p%APP_PASS% --default-character-set=utf8mb4 antoanso_dev < api\database\schema.sql
if errorlevel 1 (
  echo [LOI] Nap schema that bai. Xem thong bao loi phia tren.
  exit /b 1
)

echo [3/5] Tao file api\.env...
if exist api\.env (
  echo       api\.env da ton tai, giu nguyen. Neu DB_PASS khac %APP_PASS%, hay sua bang Notepad.
) else (
  (
    echo APP_URL=http://localhost:5173
    echo DB_HOST=127.0.0.1
    echo DB_PORT=3306
    echo DB_NAME=antoanso_dev
    echo DB_USER=antoanso
    echo DB_PASS=%APP_PASS%
    echo ADMIN_TOKEN=
    echo DELAYED_MIN_DAYS=28
  ) > api\.env
  echo       Da tao api\.env.
)

echo [4/5] Tao lop thu nghiem 8A1...
"%PHP%" api\bin\add_class.php 8A1 "Lop 8A1" "THCS Thu nghiem"
if errorlevel 1 (
  echo [LOI] Khong tao duoc lop. Kiem tra lai api\.env va CSDL.
  exit /b 1
)

echo [5/5] Chay bo kiem thu tren antoanso_test (se xoa du lieu trong CSDL test)...
set "DB_NAME=antoanso_test"
"%PHP%" api\tests\run.php
if errorlevel 1 (
  echo [LOI] Bo kiem thu co loi. Gui noi dung o tren de duoc ho tro.
  exit /b 1
)

echo.
echo [OK] Thiet lap xong. Tiep theo, mo 2 cua so cmd:
echo   Cua so 1: "%PHP%" -S 127.0.0.1:8000 -t api api\router.php
echo   Cua so 2: cd web  roi  npm run dev   (mo http://localhost:5173)
exit /b 0
