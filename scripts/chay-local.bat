@echo off
chcp 65001 >nul
rem ============================================================
rem  Chay An Toan So Hoc Duong tren may ca nhan (Windows + XAMPP) bang MOT lenh:
rem      .\scripts\chay-local.bat
rem  Tu dong: bat MySQL (neu chua chay), mo cua so API, mo cua so giao dien, mo trinh duyet.
rem  De dung: dong 2 cua so "API PHP" va "Giao dien Vite", roi chay:
rem      C:\xampp\mysql\bin\mysqladmin.exe -u root shutdown
rem ============================================================

cd /d "%~dp0\.."
set "ROOT=%CD%"
set "XAMPP=C:\xampp"

if not exist "%XAMPP%\php\php.exe" (
  echo [LOI] Khong tim thay %XAMPP%\php\php.exe. Kiem tra lai XAMPP da cai o C:\xampp chua.
  pause
  exit /b 1
)
if not exist "%ROOT%\api\.env" (
  echo [LOI] Chua co api\.env. Hay chay truoc: .\scripts\setup-windows.bat
  pause
  exit /b 1
)
if not exist "%ROOT%\web\node_modules" (
  echo [LOI] Chua cai goi giao dien. Hay chay truoc: cd web  roi  npm install
  pause
  exit /b 1
)

"%XAMPP%\mysql\bin\mysqladmin.exe" -u root status >nul 2>&1
if errorlevel 1 (
  echo Dang khoi dong MySQL...
  start "MySQL (khong dong cua so nay)" /min "%XAMPP%\mysql\bin\mysqld.exe" --defaults-file="%XAMPP%\mysql\bin\my.ini" --standalone
  timeout /t 8 /nobreak >nul
) else (
  echo MySQL da chay san.
)

echo Dang mo API PHP o cong 8000...
start "API PHP (khong dong cua so nay)" /d "%ROOT%" cmd /k ""%XAMPP%\php\php.exe" -S 127.0.0.1:8000 -t api api\router.php"

echo Dang mo giao dien Vite o cong 5173...
start "Giao dien Vite (khong dong cua so nay)" /d "%ROOT%\web" cmd /k "npm run dev"

timeout /t 8 /nobreak >nul
start "" http://localhost:5173
echo.
echo Da mo trinh duyet tai http://localhost:5173
echo Neu trang trong, doi vai giay roi bam F5.
exit /b 0
