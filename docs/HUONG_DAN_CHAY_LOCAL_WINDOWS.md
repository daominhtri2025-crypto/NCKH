# Hướng dẫn chạy "An Toàn Số Học Đường" trên máy Windows mới

**Phạm vi.** Máy Windows 10 hoặc 11 chỉ có ổ **C**, chưa cài gì. Thư mục dự án nằm ngoài **Desktop**: `Desktop\NCKH`. Chỉ cần sao chép từng khối lệnh, dán vào PowerShell và nhấn Enter.

**Thời gian.** Khoảng 15 đến 25 phút cho lần cài đầu. Các lần sau chỉ cần một lệnh (mục "Chạy lại mỗi ngày").

**Kết quả cuối.** Mở được `http://localhost:5173` trên máy này, đăng nhập được tài khoản giáo viên và quản trị, tạo được thẻ học sinh.

**Yêu cầu.** Kết nối Internet. Tài khoản Windows có quyền cài phần mềm (Windows sẽ hỏi xác nhận vài lần, bấm **Yes**).

---

## Cách dùng tài liệu này

1. **Mở PowerShell:** bấm nút Start, gõ `PowerShell`, nhấn Enter. Không cần chọn "Run as administrator".
2. **Chuyển bộ gõ sang tiếng Anh (EN)** trước khi dán hoặc gõ lệnh. Bộ gõ tiếng Việt có thể làm hỏng ký tự.
3. Sao chép **nguyên khối lệnh**, bấm chuột phải trong cửa sổ PowerShell để dán, rồi nhấn Enter. Nếu khối có nhiều dòng, PowerShell chạy lần lượt từng dòng.
4. Sau mỗi bước, so kết quả với dòng **Kết quả đúng**. Nếu khác, xem mục **Xử lý sự cố** ở cuối.

---

## Bước 1. Cho phép PowerShell chạy `npm`

Windows mới thường chặn tập lệnh của `npm`. Chạy một lần:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

**Kết quả đúng:** không hiện lỗi.

---

## Bước 2. Cài Git, Node.js và XAMPP

Ba phần mềm: **Git** (lấy mã nguồn), **Node.js** (chạy giao diện), **XAMPP** (cung cấp PHP và MySQL). Dán lần lượt từng lệnh, chờ xong lệnh này mới dán lệnh sau:

```powershell
winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
```

```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
```

```powershell
winget install --id ApacheFriends.Xampp.8.2 -e --source winget --accept-package-agreements --accept-source-agreements
```

Lưu ý khi cài **XAMPP**:

- Nếu hiện cửa sổ cài đặt, bấm **Next** đến hết, **giữ nguyên thư mục `C:\xampp`** (các script sau này dùng đúng đường dẫn này).
- Nếu Windows Firewall hỏi, chọn **Allow access**.
- Không cần mở XAMPP Control Panel.

**Rất quan trọng:** Windows chỉ cập nhật danh sách đường dẫn (PATH) cho cửa sổ **mới mở**. Cách nhanh nhất là làm mới ngay trong cửa sổ hiện tại bằng lệnh sau (cách khác: đóng hẳn PowerShell rồi mở lại):

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Bước kiểm tra A: ba phần mềm đã được cài vào máy chưa:

```powershell
Test-Path "C:\Program Files\Git\cmd\git.exe"
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\xampp\php\php.exe"
```

**Kết quả đúng:** cả ba dòng đều hiện `True`. Dòng nào hiện `False` nghĩa là phần mềm đó **chưa được cài**: chạy lại đúng lệnh `winget` của phần mềm đó ở trên (đọc kỹ thông báo; nếu Windows hiện hộp thoại xác nhận thì bấm **Yes**), hoặc cài tay theo ghi chú bên dưới.

Bước kiểm tra B: PowerShell đã nhận ra các lệnh chưa:

```powershell
git --version
node -v
npm -v
& "C:\xampp\php\php.exe" -v
```

**Kết quả đúng:** hiện số phiên bản của cả bốn lệnh, ví dụ `git version 2.x`, `v22.x` hoặc `v24.x`, một số phiên bản `npm`, và `PHP 8.x` (từ 8.2 trở lên). Bản PHP mới như 8.5 dùng được; nếu gặp lỗi lạ chỉ xảy ra trên PHP mới, cài XAMPP 8.2 để đối chiếu.

> **Nếu ở bước kiểm tra A hiện `True` nhưng `git` vẫn báo không tìm thấy:** chạy thẳng bằng đường dẫn đầy đủ để tiếp tục, không cần chờ sửa PATH:
>
> ```powershell
> & "C:\Program Files\Git\cmd\git.exe" --version
> ```
>
> Ở Bước 3, thay chữ `git` trong lệnh `git clone` bằng `& "C:\Program Files\Git\cmd\git.exe"`. Về sau, đóng hẳn PowerShell (hoặc khởi động lại máy) thì lệnh `git` sẽ chạy bình thường.

> **Thông báo `command not found`** (thay vì `is not recognized`) là thông báo của cửa sổ dòng lệnh kiểu Linux (Git Bash, WSL, hoặc Terminal của VS Code đang chọn bash). Hướng dẫn này chỉ dùng **Windows PowerShell**: mở bằng Start, gõ `PowerShell`. Trong VS Code, chọn `PowerShell` ở danh sách bên cạnh dấu `+` của Terminal.

> **Nếu `winget` báo không nhận ra lệnh** (thường gặp trên Windows 10 cũ, không phải lỗi): bỏ qua ba lệnh `winget` và cài tay ba phần mềm từ trang chủ, mỗi phần mềm chọn mặc định ("Next" đến hết, XAMPP vẫn ở `C:\xampp`): [git-scm.com](https://git-scm.com/download/win), [nodejs.org](https://nodejs.org) (bản **LTS**), [apachefriends.org](https://www.apachefriends.org) (XAMPP bản có **PHP 8.2 trở lên**). Sau đó đóng và mở lại PowerShell, rồi chạy khối kiểm tra ở trên.

---

## Bước 3. Lấy mã nguồn về `Desktop\NCKH`

```powershell
cd "$([Environment]::GetFolderPath('Desktop'))"
git clone -b claude/gifted-brown-mfv1i8 https://github.com/daominhtri2025-crypto/NCKH.git
cd NCKH
```

**Kết quả đúng:** trên Desktop có thư mục **NCKH**; dòng lệnh đang ở trong thư mục đó. Nếu hiện cửa sổ đăng nhập GitHub, đăng nhập bằng tài khoản có quyền xem kho mã.

> **Nếu đã có sẵn thư mục NCKH trên Desktop** (chép từ máy khác): bỏ qua lệnh `git clone`, và xóa các tệp riêng của máy cũ để tránh sai mật khẩu hoặc gói cũ:
>
> ```powershell
> cd "$([Environment]::GetFolderPath('Desktop'))\NCKH"
> Remove-Item api\.env -ErrorAction SilentlyContinue
> Remove-Item web\node_modules -Recurse -Force -ErrorAction SilentlyContinue
> ```

---

## Bước 4. Bật MySQL

Từ thư mục `NCKH`, chạy:

```powershell
Start-Process -WindowStyle Hidden "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList '--defaults-file=C:\xampp\mysql\bin\my.ini','--standalone'
Start-Sleep -Seconds 8
& "C:\xampp\mysql\bin\mysqladmin.exe" -u root status
```

Nếu Windows Firewall hỏi, chọn **Allow access**.

**Kết quả đúng:** một dòng dạng `Uptime: 8  Threads: 1  Questions: 1 ...`. Nếu hiện `connect to server ... failed`, chờ thêm 10 giây rồi chạy lại riêng lệnh `mysqladmin` (dòng cuối).

---

## Bước 5. Tạo cơ sở dữ liệu, tài khoản và chạy kiểm thử

Lệnh này làm tất cả trong một lần: tạo CSDL và người dùng, tạo tệp cấu hình `api\.env`, tạo các bảng dữ liệu, tạo lớp thử `8A1`, tạo hai tài khoản mặc định, rồi chạy bộ kiểm thử tự động.

```powershell
.\scripts\setup-windows.bat
```

Mật khẩu CSDL mặc định là `Antoanso2026` (chỉ dùng cho máy cá nhân, được lưu trong `api\.env`).

**Kết quả đúng:** chạy mất 1 đến 3 phút, có các dòng từ `[1/6]` đến `[6/6]`, tiếp theo là dòng `Kết quả: ... đạt, 0 lỗi.` và cuối cùng là `[OK] Thiet lap xong.` Chữ tiếng Việt có dấu trong cửa sổ có thể hiển thị méo do bảng mã của Windows; không sao, chỉ cần thấy số **0** ngay trước chữ "lỗi" và dòng `[OK]` ở cuối.

---

## Bước 6. Cài gói cho giao diện

```powershell
cd web
npm install
cd ..
```

**Kết quả đúng:** chạy 1 đến 3 phút, cuối có dòng `found 0 vulnerabilities`. Các dòng cảnh báo (`npm warn`) có thể bỏ qua.

---

## Bước 7. Chạy ứng dụng

```powershell
.\scripts\chay-local.bat
```

Lệnh này tự mở **hai cửa sổ đen** (`API PHP` và `Giao dien Vite`) và mở trình duyệt tại `http://localhost:5173`.

**Kết quả đúng:** trình duyệt hiện trang chủ "Chào em, hãy cùng học cách giữ an toàn khi dùng điện thoại!". Nếu trang trắng, chờ vài giây rồi nhấn **F5**.

**Giữ nguyên hai cửa sổ đen** trong lúc dùng ứng dụng. Đóng chúng là dừng ứng dụng.

> **Luôn mở bằng đúng địa chỉ `http://localhost:5173`.** Không dùng `127.0.0.1` hay địa chỉ IP của máy, vì ứng dụng chỉ chấp nhận yêu cầu đến từ địa chỉ này (chống giả mạo yêu cầu).

---

## Bước 8. Đăng nhập thử

Tài khoản mặc định (chỉ để thử trên máy cá nhân):

| Vai trò | Tên đăng nhập | Mật khẩu |
|---|---|---|
| Quản trị viên | `admin` | `Admin@12345` |
| Giáo viên (lớp 8A1) | `giaovien1` | `Giaovien@12345` |

1. Ở trang chủ, trong khối **Dành cho giáo viên**, bấm **Giáo viên đăng nhập**.
2. Nhập `giaovien1` và `Giaovien@12345`, bấm **Đăng nhập**.
3. Bấm **Tạo thẻ mới**, nhập `3`, bấm **Tạo thẻ**. Ba mã thẻ dạng `XXXX-XXXX` hiện ra. Ghi lại một mã.
4. Bấm **Đăng xuất**. Ở trang chủ, bấm **Em có thẻ mã từ giáo viên**, nhập mã vừa ghi, tích ô đồng ý, bấm **Kích hoạt và bắt đầu**. Bảng học tập của học sinh hiện ra.
5. Muốn xem trang quản trị: đăng xuất, đăng nhập bằng `admin` / `Admin@12345`.

Khi đăng nhập lần đầu, ứng dụng nhắc đổi mật khẩu. Có thể bỏ qua khi thử trên máy cá nhân.

---

## Chạy lại mỗi ngày

Không cần làm lại các bước 1 đến 6. Mở PowerShell và chạy:

```powershell
cd "$([Environment]::GetFolderPath('Desktop'))\NCKH"
.\scripts\chay-local.bat
```

Lệnh tự bật MySQL nếu chưa chạy, rồi mở API, giao diện và trình duyệt. Dữ liệu đã tạo lần trước (thẻ, tài khoản, kết quả) vẫn còn.

### Dừng ứng dụng

1. Đóng hai cửa sổ đen `API PHP` và `Giao dien Vite`.
2. Tắt MySQL:

```powershell
& "C:\xampp\mysql\bin\mysqladmin.exe" -u root shutdown
```

---

## Cập nhật khi có bản mới

```powershell
cd "$([Environment]::GetFolderPath('Desktop'))\NCKH"
git pull origin claude/gifted-brown-mfv1i8
cd web
npm install
cd ..
& "C:\xampp\php\php.exe" api\bin\migrate.php
```

Chạy `migrate.php` là an toàn, không xóa dữ liệu. Sau đó chạy lại ứng dụng như mục trên. Nếu `git pull` báo có tệp bị sửa trên máy, chạy `git stash` rồi `git pull` lại.

---

## Kiểm tra nhanh (tùy chọn)

**Máy chủ có chạy không?** (sau khi đã chạy ứng dụng)

```powershell
curl.exe http://127.0.0.1:8000/api/health
```

**Kết quả đúng:** `{"ok":true}`

**Chạy lại bộ kiểm thử tự động** (chỉ xóa dữ liệu của CSDL kiểm thử, không ảnh hưởng dữ liệu thật):

```powershell
$env:DB_NAME = "antoanso_test"
& "C:\xampp\php\php.exe" api\tests\run.php
Remove-Item Env:DB_NAME
```

**Kết quả đúng:** dòng cuối có `0 lỗi`.

---

## Xử lý sự cố

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `npm : File ... cannot be loaded because running scripts is disabled` | PowerShell chặn tập lệnh | Chạy lại **Bước 1**, đóng và mở lại PowerShell |
| `git`, `node` hoặc `npm`: `is not recognized` hoặc `command not found` | Cửa sổ chưa nhận phần mềm vừa cài, phần mềm chưa cài được, hoặc đang dùng nhầm Git Bash/WSL | Làm theo **Bước 2** (làm mới PATH, kiểm tra A và B). Dùng đúng cửa sổ Windows PowerShell. Nếu vẫn lỗi, khởi động lại máy |
| `[LOI] Khong thiet lap duoc CSDL bang user root` | MySQL chưa chạy | Chạy lại **Bước 4**, rồi chạy lại `.\scripts\setup-windows.bat` |
| `Access denied for user 'root'` | `root` của MySQL đã có mật khẩu (XAMPP mặc định không có) | Gỡ mật khẩu: `& "C:\xampp\mysql\bin\mysqladmin.exe" -u root -pMATKHAUCU password ""`, rồi chạy lại script |
| `Access denied for user 'antoanso'` | `api\.env` có mật khẩu khác với mật khẩu đã đặt | `Remove-Item api\.env` rồi chạy lại `.\scripts\setup-windows.bat` |
| MySQL không lên, báo cổng 3306 đang dùng | Máy đã có một MySQL khác chạy | Xem dịch vụ: `Get-Service *mysql*`. Tắt dịch vụ đó (ví dụ `Stop-Service MySQL80`, chạy PowerShell bằng quyền Administrator), rồi làm lại **Bước 4** |
| Cửa sổ Vite báo cổng 5173 đang bị dùng, hoặc API báo cổng 8000 | Lần chạy trước chưa tắt hẳn | Tìm tiến trình: `Get-NetTCPConnection -LocalPort 5173,8000 \| Select-Object LocalPort,OwningProcess`, rồi `Stop-Process -Id <số OwningProcess> -Force`, rồi chạy lại |
| Trang hiện nhưng đăng nhập báo "Không kết nối được máy chủ" | Cửa sổ `API PHP` đã đóng, hoặc MySQL đã tắt | Chạy `curl.exe http://127.0.0.1:8000/api/health`. Nếu không ra `{"ok":true}`, chạy lại `.\scripts\chay-local.bat` |
| Đăng nhập báo lỗi về địa chỉ hoặc nguồn yêu cầu | Mở bằng `127.0.0.1` hoặc IP thay vì `localhost` | Mở đúng `http://localhost:5173` |
| `[LOI] Chua cai goi giao dien` khi chạy `chay-local.bat` | Chưa chạy `npm install` | Làm **Bước 6** |
| Trình duyệt hiện lỗi 401 trong cửa sổ Console (F12) | Bình thường: ứng dụng kiểm tra phiên khi chưa đăng nhập | Bỏ qua |
| Muốn làm lại từ đầu, xóa sạch dữ liệu thử | | `& "C:\xampp\mysql\bin\mysql.exe" -u root -e "DROP DATABASE antoanso_dev; DROP DATABASE antoanso_test;"` rồi `Remove-Item api\.env` rồi `.\scripts\setup-windows.bat` |

---

## Ghi chú an toàn

- Hai tài khoản mặc định và mật khẩu CSDL mặc định **chỉ dành cho máy cá nhân**. Không dùng lại trên hosting thật; hướng dẫn triển khai nằm ở `docs/TRIEN_KHAI_INET.md`.
- Tệp `api\.env` chứa mật khẩu CSDL và không được đưa lên Git (đã nằm trong `.gitignore`).
- Dữ liệu thử trên máy này không phải dữ liệu nghiên cứu.
- Tài liệu chi tiết hơn (macOS, Linux, cấu hình thủ công): `docs/CHAY_CUC_BO.md`.
