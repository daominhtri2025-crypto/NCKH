@echo off
chcp 65001 >nul
rem ============================================================
rem  Thiet lap An Toan So Hoc Duong tren Windows voi XAMPP.
rem  Cach dung (PowerShell hoac cmd, tai thu muc goc du an):
rem      .\scripts\setup-windows.bat
rem  Co the dat mat khau rieng cho user antoanso (chi chu cai va chu so):
rem      .\scripts\setup-windows.bat MatKhauCuaBan123
rem  Mac dinh mat khau la Antoanso2026 (chi dung cho may ca nhan).
rem  Yeu cau: XAMPP cai o C:\xampp, MySQL dang chay, root chua co mat khau (mac dinh XAMPP).
rem ============================================================

cd /d "%~dp0\.."

set "MYSQL=C:\xampp\mysql\bin\mysql.exe"
set "PHP=C:\xampp\php\php.exe"

if not exist "%MYSQL%" (
  echo [LOI] Khong tim thay %MYSQL%. Kiem tra lai XAMPP da cai o C:\xampp chua.
  exit /b 1
)
if not exist "%PHP%" (
  echo [LOI] Khong tim thay %PHP%. Kiem tra lai XAMPP da cai o C:\xampp chua.
  exit /b 1
)

if "%~1"=="" (set "APP_PASS=Antoanso2026") else (set "APP_PASS=%~1")
echo(%APP_PASS%| findstr /R "^[A-Za-z0-9][A-Za-z0-9]*$" >nul
if errorlevel 1 (
  echo [LOI] Mat khau chi duoc chua chu cai va chu so, khong co khoang trang.
  exit /b 1
)

echo.
echo [1/6] Tao CSDL, user va cap quyen...
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
  echo [LOI] Khong thiet lap duoc CSDL bang user root. Kiem tra MySQL da chay chua.
  del "%SQL%" >nul 2>&1
  exit /b 1
)
del "%SQL%" >nul 2>&1

echo [2/6] Tao file api\.env...
if exist api\.env (
  echo       api\.env da ton tai, giu nguyen. Neu DB_PASS khac %APP_PASS%, hay sua bang Notepad.
) else (
  (
    echo APP_ENV=local
    echo APP_URL=http://localhost:5173
    echo DB_HOST=127.0.0.1
    echo DB_PORT=3306
    echo DB_NAME=antoanso_dev
    echo DB_USER=antoanso
    echo DB_PASS=%APP_PASS%
    echo ADMIN_TOKEN=
    echo DELAYED_MIN_DAYS=28
    echo CLASS_CARD_LIMIT=300
  ) > api\.env
  echo       Da tao api\.env.
)
rem Tep .env cu co the thieu APP_ENV: bo sung de lenh tao tai khoan mac dinh chay duoc.
findstr /b /c:"APP_ENV=" api\.env >nul 2>&1
if errorlevel 1 echo APP_ENV=local>>api\.env

echo [3/6] Tao bang du lieu (migrate)...
"%PHP%" api\bin\migrate.php
if errorlevel 1 (
  echo [LOI] Tao bang that bai. Xem thong bao loi phia tren.
  exit /b 1
)

echo [4/6] Tao lop thu nghiem 8A1...
"%PHP%" api\bin\add_class.php 8A1 "Lop 8A1" "THCS Thu nghiem"
if errorlevel 1 (
  echo [LOI] Khong tao duoc lop. Kiem tra lai api\.env va CSDL.
  exit /b 1
)

echo [5/6] Tao tai khoan mac dinh (admin va giaovien1)...
"%PHP%" api\bin\seed_local.php
if errorlevel 1 (
  echo [LOI] Khong tao duoc tai khoan mac dinh. Kiem tra api\.env co dong APP_ENV=local.
  exit /b 1
)

echo [6/6] Chay bo kiem thu tren antoanso_test (se xoa du lieu trong CSDL test)...
set "DB_NAME=antoanso_test"
"%PHP%" api\tests\run.php
if errorlevel 1 (
  echo [LOI] Bo kiem thu co loi. Gui noi dung o tren de duoc ho tro.
  exit /b 1
)

echo.
echo [OK] Thiet lap xong.
echo   Tiep theo: cd web  roi  npm install  (chi lan dau), sau do chay .\scripts\chay-local.bat
exit /b 0
