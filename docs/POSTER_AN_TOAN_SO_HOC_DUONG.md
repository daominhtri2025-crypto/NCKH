# Poster điện tử 04 trang: An toàn số học đường

Tài liệu này là nội dung và bố cục để đưa vào PowerPoint hoặc Canva, xuất PDF dưới 10 MB. Mọi số liệu lấy từ báo cáo chính thức (`BAO_CAO_NCKH_ChinhThuc.md`); phần nào chưa có dữ liệu thì ghi rõ là chưa có, không điền số giả.

## 0. Quy cách chung

| Mục | Đề xuất |
|---|---|
| Khổ trang | 4 trang cùng khổ, nằm ngang 16:9 (1920 × 1080 px) hoặc A3 ngang; không trộn khổ |
| Phông chữ | Một họ phông không chân (Arial, Calibri hoặc Roboto), tối đa 2 cỡ tiêu đề + 1 cỡ nội dung |
| Cỡ chữ | Tiêu đề trang 40–48 pt; tiêu đề mục 28–32 pt; nội dung 20–24 pt; chú thích nguồn 14–16 pt |
| Màu | Nền trắng; xanh đậm (#142D5C) cho tiêu đề; một màu nhấn duy nhất (cam #E07B00) để tô từ khóa. Màu chỉ để phân cấp thông tin, không dùng họa tiết trang trí |
| Bố cục | Lưới 2–3 cột, lề đều 1,5 cm, mỗi trang không quá 6 khối nội dung; chừa trắng ≥ 25% |
| Xuất tệp | PDF, ảnh nén JPEG 150 dpi, nhúng phông; kiểm tra dung lượng < 10 MB |

**Nhãn nguồn dưới mọi hình, biểu đồ, sơ đồ** (chữ nghiêng, 14–16 pt). Dùng đúng một trong các mẫu sau:

- Ảnh chụp màn hình: *"Ảnh chụp màn hình sản phẩm (dữ liệu mẫu), do học sinh tự thực hiện."*
- Biểu đồ: *"Biểu đồ được tạo bằng phần mềm Microsoft Excel từ số liệu khảo sát, do học sinh tự thực hiện."*
- Sơ đồ: *"Sơ đồ do học sinh tự vẽ."*

## 1. Danh sách kiểm tra tuân thủ (đối chiếu trước khi xuất PDF)

- [ ] Không có tên trường, đơn vị, tên học sinh, tên giáo viên ở bất kỳ vị trí nào, kể cả tiêu đề phụ, chân trang, tên tệp trong ảnh chụp, siêu dữ liệu PDF (Author/Title).
- [ ] Không có đường dẫn, địa chỉ web, mã QR. Không ghi cả địa chỉ chạy thử như `localhost` trong ảnh chụp.
- [ ] Mọi hình có nhãn nguồn bên dưới.
- [ ] Không có ảnh chụp người hoặc rõ mặt người; không dùng ảnh đại diện (avatar) trong ảnh chụp màn hình.
- [ ] Không có logo và họa tiết trang trí; không dùng biểu tượng (icon) chỉ để trang trí.
- [ ] Ảnh chụp màn hình không lộ mã thẻ thật, tên đăng nhập thật, tên trường (kiểm tra góc trên và chân trang của giao diện).
- [ ] Số liệu khớp báo cáo; không viết điều chưa đo (hiệu quả học tập).
- [ ] PDF < 10 MB.

Lưu ý ảnh chụp màn hình: dùng ảnh từ bản chạy thử có dữ liệu mẫu. Các ảnh `hinh/hinh6_hoc_sinh_san_choi.png`, `hinh7_hoc_sinh_tham_tu.png`, `hinh8_hoc_sinh_mat_khau.png` và `hinh11_quan_tri_cau_hoi.png` phù hợp để dùng. Mở từng ảnh kiểm tra lần cuối trước khi dùng, vì tôi không thể cam đoan thay bạn rằng không còn dòng chữ nhận diện trong ảnh.

---

## Trang 1. Giới thiệu dự án, mục tiêu và phương pháp

**Tiêu đề lớn (căn giữa):**
# AN TOÀN SỐ HỌC ĐƯỜNG
**Phụ đề:** Hệ thống web thực hành nhận diện **lừa đảo trực tuyến** cho học sinh THCS
**Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục

### Khối trái: MỤC TIÊU

**Vấn đề thực tiễn.** Học sinh dùng điện thoại và mạng xã hội thường xuyên nhưng ít được **thực hành** nhận diện lừa đảo, và việc học hiếm khi được **đo** để biết có tiến bộ hay không.

**Câu hỏi nghiên cứu**
1. Điểm **kiến thức** có khác biệt giữa trước và sau khi học không?
2. Kết quả còn **duy trì sau 28 ngày** không?
3. Điểm **hành vi** an toàn có thay đổi không?

**Mục tiêu:** xây dựng công cụ **thực hành + đo lường** mà **không thu thông tin định danh** học sinh.

### Khối phải: PHƯƠNG PHÁP

- **Khảo sát thực trạng:** 3 phiếu (học sinh, giáo viên), 100 phiếu hợp lệ mỗi phiếu.
- **Xây dựng sản phẩm:** hệ thống web với **3 hoạt động** thực hành.
- **Đo lường 3 thời điểm:** trước – sau – **28 ngày** sau, cùng bộ **16 câu** (10 kiến thức, 6 hành vi).
- **Kiểm thử kỹ thuật tự động** và chạy thử trên máy tính khác.
- **Công nghệ:** giao diện React + TypeScript; máy chủ PHP; cơ sở dữ liệu MySQL/MariaDB.

**Hình gợi ý (dưới khối phương pháp):** sơ đồ *Trình tự mở khóa 3 giai đoạn* (vẽ lại từ `hinh/hinh1_trinh_tu.png`, đổi nhãn tiếng Việt, bỏ mọi chữ ngoài nội dung).
Nhãn: *"Sơ đồ do học sinh tự vẽ."*

---

## Trang 2. Quá trình thực hiện

**Tiêu đề trang:** QUÁ TRÌNH THỰC HIỆN: 4 BƯỚC

Bố cục: một **đường thời gian 4 bước nằm ngang**, mỗi bước một khối gồm tiêu đề + 2–3 gạch đầu dòng + 1 hình.

### Bước 1. Khảo sát thực trạng
- Thu thập ngày **01/11/2026 – 11/11/2026**, ẩn danh, 3 phiếu × **100** bản hợp lệ.
- Đo: mức **tự tin**, kinh nghiệm gặp tin lừa đảo, nhu cầu học, rào cản của giáo viên.

### Bước 2. Thiết kế giải pháp
- Rút **6 yêu cầu** từ khảo sát: học bằng tình huống, giải thích ngay, đo nhận thức và hành vi riêng, khóa trình tự ở máy chủ, không thu danh tính, chạy trên điện thoại.

### Bước 3. Xây dựng 3 hoạt động
| Hoạt động | Nội dung |
|---|---|
| **Sân chơi tình huống** | 5 tình huống: mạo danh, đòi mã **OTP**, trúng thưởng, nhờ chuyển tiền, trang giả |
| **Thám tử không gian mạng** | Phân loại **12 địa chỉ** (5 thật, 7 giả); chế độ đọc tên miền **từ phải sang trái** |
| **Phòng thí nghiệm tài khoản** | Thử **mật khẩu** ngay trên trình duyệt; checklist **quyền riêng tư** 8 bước |

*Hình:* ảnh chụp màn hình hoạt động Thám tử (`hinh7`). Nhãn: *"Ảnh chụp màn hình sản phẩm (dữ liệu mẫu), do học sinh tự thực hiện."*

### Bước 4. Kiểm thử và chạy thử
- **321** kiểm tra tích hợp, **14** kiểm thử đơn vị, **23** bước luồng người dùng: đều đạt.
- Chạy thử cài đặt trên một máy tính Windows khác theo hướng dẫn từng bước.

**Khung nhỏ "Bảo vệ quyền riêng tư" (cuối trang):** không thu họ tên/email/số điện thoại · **hai mã tách biệt** (mã đăng nhập ≠ mã trong dữ liệu nghiên cứu) · mật khẩu thử **không rời trình duyệt**.

---

## Trang 3. Kết quả

**Tiêu đề trang:** KẾT QUẢ

### Khối A: Khảo sát thực trạng (n = 100 mỗi phiếu; tự báo cáo)

Hiển thị 4 con số lớn (thẻ số liệu), không kèm biểu tượng trang trí:

| Con số | Ý nghĩa |
|---|---|
| **4,61 / 5** | Học sinh đánh giá việc học nhận diện lừa đảo là **rất cần thiết** |
| **3,06 / 5** | Mức **tự tin** của học sinh chỉ ở mức vừa phải |
| **52%** | Học sinh có **người thân hoặc bạn bè** từng bị lừa qua mạng |
| **47%** | Giáo viên từng gặp **học sinh bị lừa** qua mạng |

**Biểu đồ gợi ý 1 (cột ngang):** so sánh "mức cần thiết" 4,61 và "mức tự tin" 3,06 của học sinh; trục 1–5.
Nhãn: *"Biểu đồ được tạo bằng phần mềm Microsoft Excel từ số liệu khảo sát, do học sinh tự thực hiện."*

**Biểu đồ gợi ý 2 (cột ghép, thang 1–5):** giáo viên, mức nguy cơ 3,99 và mức tự tin khi hướng dẫn 3,39. Cùng nhãn nguồn như trên.

### Khối B: Sản phẩm đạt được
- Hệ thống hoàn chỉnh: **3 hoạt động**, **bộ 16 câu**, 3 vai trò (học sinh, giáo viên, quản trị), in thẻ đăng nhập không ghi tên.
- Kiểm thử kỹ thuật: **321 / 321**, **14 / 14**, **23 / 23** đạt.
- Học sinh đánh giá **dễ dùng 4,27/5** và giải thích **rõ 4,25/5**.

*Hình:* ảnh chụp màn hình trang quản trị (số liệu tổng hợp, không có tên). Cùng nhãn nguồn ảnh chụp.

### Khối C: Phải nói rõ (khung viền mảnh, chữ nhỏ hơn nhưng không giấu)
- Dữ liệu đo **trước – sau – 28 ngày** trong hệ thống **chưa được thu thập**, nên đề tài **chưa kết luận** hiệu quả học tập.
- Biểu mẫu khảo sát được sửa trong lúc thu thập, nên điểm dễ dùng/rõ ràng chỉ mang tính tham khảo.

> Giải thích cho hội đồng: nói rõ giới hạn làm kết quả đáng tin hơn, nên không nên bỏ khối C.

---

## Trang 4. Ý nghĩa, kết luận và hướng phát triển

**Tiêu đề trang:** Ý NGHĨA VÀ KẾT LUẬN

### Giá trị đóng góp
| Lĩnh vực | Nội dung |
|---|---|
| **Học tập** | Học sinh **thực hành** thay vì chỉ đọc; có giải thích ngay sau mỗi lựa chọn |
| **Đời sống** | Rèn thói quen: không đọc **OTP**, kiểm tra **tên miền**, dùng mật khẩu riêng |
| **Khoa học** | Mô hình đo **tách nhận thức và hành vi**, 3 thời điểm, có bộ mã hóa dữ liệu dùng lại được |
| **Quyền riêng tư** | Mô hình nghiên cứu với học sinh **không thu danh tính** |

### Kết luận (3 ý, mỗi ý một dòng)
1. Đã xây dựng được **công cụ thực hành và đo lường** hoàn chỉnh, đạt toàn bộ kiểm thử kỹ thuật.
2. Khảo sát cho thấy học sinh **cần học nhưng chưa tự tin**; giáo viên **cần học liệu hỗ trợ**.
3. **Hiệu quả học tập chưa được kiểm chứng**: bước tiếp theo là thu dữ liệu đo theo kế hoạch đã xác định trước.

### Hướng phát triển
- Thu dữ liệu **trước – sau – 28 ngày**, phân tích bằng kiểm định phi tham số.
- Thu lại **phản hồi học sinh** bằng biểu mẫu cố định sau khi dùng hệ thống.
- Bộ câu hỏi **song song** để giảm hiệu ứng làm lại.
- Nhân rộng sang **lớp và trường khác**, có nhóm đối chứng.

**Câu chốt (chữ lớn, căn giữa, màu nhấn):** *Học để nhận ra, thực hành để nhớ, đo lường để biết có tiến bộ.*

---

## 2. Hướng dẫn tạo biểu đồ trong Excel (số liệu thật)

| Biểu đồ | Dữ liệu |
|---|---|
| 1. Học sinh | Mức cần thiết = 4,61; mức tự tin = 3,06 (thang 1–5) |
| 2. Giáo viên | Mức nguy cơ = 3,99; mức tự tin khi hướng dẫn = 3,39 (thang 1–5) |

Quy tắc trình bày: trục thang cố định 0–5, ghi giá trị trên cột, **không** dùng hiệu ứng 3D, không dùng hình minh họa trang trí, mỗi biểu đồ có tiêu đề và nhãn nguồn như mục 0.

## 3. Những điều cần bạn xác nhận

1. **Phụ lục 8:** tôi chưa có nguyên văn Phụ lục 8; nội dung trên theo đúng các quy định bạn nêu. Nếu Phụ lục có yêu cầu thêm (khổ giấy, số chữ tối đa, cỡ chữ), hãy cho tôi biết để chỉnh.
2. **Số liệu "học sinh cần học nhưng chưa tự tin":** so sánh 4,61 và 3,06 là hai câu hỏi khác nhau, chỉ mang tính gợi ý, không phải phép kiểm định. Khi trình bày bằng lời, nên nói đúng như vậy.
3. **Dữ liệu khảo sát** nên được đối chiếu lần cuối với bảng gốc trước khi đưa lên poster (một số lựa chọn có số người chọn trùng nhau).
4. Chưa có dữ liệu trước–sau–theo dõi: nếu trước hạn nộp bạn thu được, thay khối C ở trang 3 bằng biểu đồ kết quả thật.
