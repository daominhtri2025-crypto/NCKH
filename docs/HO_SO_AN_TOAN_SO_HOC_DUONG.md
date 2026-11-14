# HỒ SƠ DỰ ÁN – AN TOÀN SỐ HỌC ĐƯỜNG

*Nội dung soạn theo cấu trúc Bộ mẫu hồ sơ chính (Kế hoạch nghiên cứu và phê duyệt dự án, Phụ lục 5, Phụ lục 6), Năm học 2026 – 2027.*

> **Quy ước trong tài liệu.** Mục có ký hiệu **[Cần bổ sung]** là thông tin mà tài liệu hiện có chưa cung cấp; không được điền thay bằng giả định. Mọi số liệu được ghi chú **(Thực nghiệm)** là kết quả đo đếm từ dữ liệu thô; mọi nhận định được ghi chú **(Suy luận)** và chỉ có giá trị trong phạm vi nghiên cứu này.

---

## Phần I. THÔNG TIN DỰ ÁN

1. **Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở.
2. **Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục.
3. **Học sinh thực hiện:**

| Họ và tên | Lớp | Vai trò | Nhiệm vụ chính |
|---|---|---|---|
| Trần Cảnh Phúc | 9/1 | [Cần xác nhận: trưởng nhóm hoặc thành viên] | [Cần bổ sung] |
| Cù Hoàng Linh Trúc | 9/1 | [Cần xác nhận: trưởng nhóm hoặc thành viên] | [Cần bổ sung] |

4. **Trường THCS:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng.
5. **Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh – [Cần bổ sung: chức vụ, chuyên môn, số điện thoại, email].
6. **Chuyên gia hỗ trợ chuyên môn:** [Cần bổ sung nếu có; xem mục Phần II.5 về ý kiến chuyên môn bằng văn bản].
7. **Địa điểm nghiên cứu:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng.
8. **Thời gian dự kiến:** từ ngày [Cần bổ sung]/…/2026 đến ngày [Cần bổ sung]/…/2026.

---

## Phần II. NỘI DUNG KẾ HOẠCH NGHIÊN CỨU

### 1. Vấn đề nghiên cứu, mục tiêu và kết quả dự kiến

**Bối cảnh.** Học sinh trung học cơ sở sử dụng điện thoại và mạng xã hội thường xuyên, nhưng thường thiếu kiến thức có hệ thống để nhận diện lừa đảo qua tin nhắn, cuộc gọi, đường liên kết và tên miền giả mạo, cũng như cách bảo vệ mã xác thực. Số liệu thống kê về tội phạm lừa đảo trong Mẫu 01 cần được đối chiếu với nguồn chính thức trước khi nộp: **[Cần bổ sung nguồn xác thực: báo cáo nêu 815 vụ lừa đảo chiếm đoạt tài sản trong tháng 8/2024; hiện chỉ dẫn qua một báo chí, chưa có tham chiếu gốc].**

**Câu hỏi nghiên cứu.**

- Q1. Điểm kiến thức an toàn thông tin của học sinh có khác biệt giữa trước và sau can thiệp hay không?
- Q2. Khác biệt này có còn ở giai đoạn theo dõi sau 28 ngày hay không?
- Q3. Điểm hành vi tự báo cáo có khác biệt giữa trước và sau can thiệp hay không?
- Q4. Thời gian phản hồi và việc sử dụng gợi ý có liên quan đến độ chính xác khi phân loại tên miền hay không?

**Giả thuyết.**

- **H1.** Điểm kiến thức sau can thiệp cao hơn điểm kiến thức trước can thiệp.
- **H2.** Điểm kiến thức ở giai đoạn theo dõi cao hơn điểm kiến thức trước can thiệp.
- **H3.** Điểm hành vi sau can thiệp cao hơn điểm hành vi trước can thiệp.
- **H4.** Học sinh sử dụng gợi ý đọc tên miền có tỷ lệ phân loại đúng cao hơn học sinh không sử dụng. Đây là mối liên hệ quan sát được, không phải kết quả của phân bổ ngẫu nhiên, nên chỉ diễn giải như tương quan.

**Mục tiêu nghiên cứu.**

1. Thiết kế và xây dựng hệ thống web tương tác gồm ba hoạt động về an toàn thông tin.
2. Xây dựng bộ công cụ đo lường tách riêng kiến thức (câu có đáp án) và hành vi (tự báo cáo).
3. Thiết kế quy trình đo lường trước, sau và theo dõi, có kiểm soát trình tự mở khóa ở máy chủ.
4. Bảo đảm ẩn danh dữ liệu và quyền riêng tư của học sinh trong toàn bộ quá trình.

**Kết quả dự kiến.**

| Hạng mục | Kết quả dự kiến |
|---|---|
| Hệ thống web | Chạy trên điện thoại và máy tính không cần cài đặt; ba hoạt động hoàn chỉnh |
| Bộ đo lường | 16 câu (10 kiến thức có đáp án, 6 hành vi tự báo cáo) dùng chung cho ba giai đoạn |
| Dữ liệu đo lường | Cặp dữ liệu trước–sau và trước–theo dõi, ẩn danh, có ngưỡng ẩn ô nhỏ |
| Khảo sát nhu cầu | Thực trạng, mức độ hài lòng và nhu cầu của học sinh, giáo viên |

### 2. Thiết kế, phương pháp nghiên cứu hoặc giải pháp kỹ thuật

**2.1. Phương pháp.** Nghiên cứu theo hướng thiết kế kết hợp khảo sát định lượng và đo lường trước–sau có nhóm đơn (không có nhóm đối chứng).

- Khảo sát nhu cầu bằng ba phiếu trên biểu mẫu trực tuyến: phiếu A (học sinh, trước khi học), phiếu B (học sinh, sau khi học) và phiếu C (giáo viên).
- Đo lường trong ứng dụng ở ba giai đoạn: đầu vào (pre), hậu kiểm (post) và theo dõi (delayed, tối thiểu 28 ngày sau hậu kiểm).
- Phân tích số liệu: thống kê mô tả, kiểm định Wilcoxon cho cặp trước–sau, kiểm định Friedman khi đủ dữ liệu ba giai đoạn, và tương quan Spearman cho H4.

**2.2. Hệ thống web.** Ứng dụng gồm ba hoạt động:

- **Hoạt động 1 – Sân chơi tình huống:** năm kịch bản, mỗi kịch bản bốn lựa chọn.
- **Hoạt động 2 – Thám tử tên miền:** 12 địa chỉ, trong đó 5 địa chỉ chính thống và 7 địa chỉ giả mạo. Toàn bộ tên miền là hư cấu, dùng các hậu tố dành riêng như `.test`, `.example`, `.io.vn`; không dẫn đến trang thật.
- **Hoạt động 3 – Phòng thí nghiệm tài khoản:** danh mục kiểm tra tám bước cho tài khoản Zalo và Facebook. Mật khẩu không được gửi lên máy chủ; máy chủ từ chối mọi yêu cầu có trường `password`.

**2.3. Bảo vệ quyền riêng tư và xác thực.**

- Học sinh đăng nhập bằng mã thẻ `XXXX-XXXX` do giáo viên cấp. Mã được băm SHA-256 khi lưu, phiên đăng nhập ở cookie HttpOnly.
- Giáo viên xem được tiến độ lớp (số lượng, trạng thái), không xem được nội dung câu trả lời của học sinh.
- Cấp lại thẻ giữ nguyên tiến độ, bắt buộc giáo viên xác nhận đã đối chiếu sổ phát thẻ; mọi thao tác được ghi nhật ký kiểm toán (`audit_log`).
- Xuất dữ liệu nghiên cứu dùng **mã định danh nghiên cứu** ngẫu nhiên, tách biệt với mã thẻ đăng nhập: tệp không có họ tên và không có mã thẻ (có mã lớp), nên người có tệp không đăng nhập thay học sinh được.

**2.4. Bộ câu hỏi đo lường.** `content/assessment_items.json`, phiên bản a-v1, 16 câu: 10 câu kiến thức có đáp án và 6 câu hành vi thang 1–4. Hai câu hành vi (b03, b04) được đảo chiều khi tính điểm (5 − v). Bộ câu hỏi được quản lý theo phiên bản; học sinh đã làm bài được chấm theo đúng phiên bản của mình.

**2.5. Kiểm thử.** (Thực nghiệm)

- Kiểm thử máy chủ: 321 kiểm tra, 0 lỗi, chạy trên cơ sở dữ liệu thử nghiệm riêng.
- Kiểm thử giao diện: kiểm tra kiểu dữ liệu (`tsc`), biên dịch (`build`), và 14 kiểm tra đơn vị.
- Kiểm thử thủ công trên điện thoại và máy tính: **[Cần bổ sung: ngày, người thực hiện, kết quả]**.
- Chưa thử trên máy chủ lưu trữ thật; chưa có giới hạn số lần đăng nhập sai (xem Phần II.5).

**2.6. Ứng dụng không gọi mô hình AI khi chạy.** Nội dung hoạt động là dữ liệu tĩnh trong thư mục `content/`. Việc sử dụng AI trong quá trình phát triển được khai báo tại Phụ lục 7 (PL07).

### 3. Các giai đoạn thực hiện; phương pháp thu thập và xử lý dữ liệu

| Giai đoạn | Nội dung | Thời gian | Minh chứng |
|---|---|---|---|
| 1. Khảo sát nhu cầu | Phiếu A (học sinh), phiếu B (sau học), phiếu C (giáo viên) | [Cần bổ sung] | Bảng phản hồi biểu mẫu trực tuyến |
| 2. Phát triển ứng dụng | Thiết kế, lập trình, kiểm thử ba hoạt động | [Cần bổ sung] | Mã nguồn, nhật ký commit |
| 3. Đo lường trước | Khảo sát đầu vào trong ứng dụng | [Cần bổ sung] | Xuất `assessments_self`, phiên bản a-v1 |
| 4. Can thiệp | Học sinh hoàn thành ba hoạt động | [Cần bổ sung] | Tiến độ lớp |
| 5. Đo lường sau | Khảo sát hậu kiểm | [Cần bổ sung] | Xuất `assessments_self` |
| 6. Theo dõi | Khảo sát delayed, tối thiểu 28 ngày sau hậu kiểm | [Cần bổ sung] | Xuất `assessments_self` |
| 7. Phân tích và viết báo cáo | Kiểm định H1–H4 | [Cần bổ sung] | Bảng kết quả, tệp xuất |

**Thu thập dữ liệu.** Dữ liệu khảo sát nhu cầu được thu qua Google Form. Dữ liệu đo lường được ghi trong cơ sở dữ liệu của ứng dụng và xuất qua trang quản trị (mục "Xuất dữ liệu CSV") hoặc công cụ dòng lệnh `bin/export_assessments.php`.

**Xử lý dữ liệu.**

- Chỉ phiếu có đồng ý tham gia được đưa vào phân tích. Lựa chọn ngoài biểu mẫu được giữ nguyên và đánh dấu †.
- Ô thống kê có dưới 5 người được ẩn (`suppressed`) để bảo vệ ẩn danh.
- Phiếu thử nghiệm không được tính vào số liệu. Các bản ghi thử ngày 11/11/2026 đã được loại khỏi phân tích.

#### 3.1. Số liệu khảo sát nhu cầu (Thực nghiệm)

Số liệu dưới đây được tính từ 100 phiếu thu thập cho mỗi phiếu. Phần diễn giải tách riêng ở mục 3.2.

**Phiếu A – học sinh trước khi học (n = 100):**

- Tự tin nhận diện lừa đảo: trung bình 3,06 (SD 1,19), thang 1–5.
- Mức độ cần thiết của kiến thức: trung bình 4,61 (SD 0,58), thang 1–5.
- 52% học sinh cho biết có người thân từng bị lừa.

**Phiếu B – học sinh sau khi học (n = 100):**

- Mức độ dễ sử dụng: trung bình 4,27 (SD 0,88), thang 1–5.
- Mức độ giải thích rõ: trung bình 4,25 (SD 0,83), thang 1–5.
- 43% học sinh chọn "Sân chơi tình huống" là hoạt động hữu ích nhất.
- 20% học sinh mong muốn được trao đổi thêm.

**Phiếu C – giáo viên (n = 100):**

- Mức độ nhận thức nguy cơ: trung bình 3,99 (SD 1,02), thang 1–5.
- Tự tin hướng dẫn học sinh: trung bình 3,39 (SD 1,04), thang 1–5.
- 47% giáo viên cho biết đã gặp học sinh bị lừa.

**Lưu ý về phương pháp.** Biểu mẫu khảo sát đã được chỉnh sửa trong quá trình thu thập để bổ sung một số lựa chọn; **[Cần bổ sung: thời điểm chỉnh sửa, và danh sách lựa chọn trước và sau khi chỉnh]**. Điều này ảnh hưởng đến khả năng so sánh các câu đã chỉnh.

#### 3.2. Phân tách dữ liệu và suy luận

| Nội dung | Loại | Ghi chú |
|---|---|---|
| Số phiếu, trung bình, SD, tỷ lệ trong mục 3.1 | **Thực nghiệm** | Đo đếm trực tiếp từ dữ liệu thô |
| Phiếu A cho thấy học sinh đánh giá cao tính cần thiết (4,61) nhưng tự tin thấp (3,06) | **Suy luận** | Khoảng cách này gợi ý nhu cầu học thực hành, cần kiểm chứng thêm |
| Phiếu B cho thấy học sinh đánh giá dễ sử dụng và giải thích rõ | **Suy luận** | Chỉ là đánh giá tự báo cáo sau một lần sử dụng, không đo được hiệu quả học tập |
| Điểm kiến thức tăng sau can thiệp (H1) | **Chưa kiểm định** | Cần dữ liệu đo lường pre–post từ ứng dụng |

### 4. Tài liệu, nguồn tham khảo chính

**Trong nước.**

- Bộ Giáo dục và Đào tạo. (2018). *Chương trình giáo dục phổ thông* [Cần bổ sung: tên văn bản và số hiệu đúng cho môn/lĩnh vực liên quan đến an toàn thông tin]. [Cần bổ sung nguồn]

**Quốc tế (cần bổ sung và kiểm chứng trước khi nộp).**

- [Cần bổ sung nguồn: nghiên cứu về nhận diện lừa đảo trực tuyến ở học sinh trung học cơ sở]
- [Cần bổ sung nguồn: nghiên cứu về thiết kế học tập thực hành an toàn thông tin]
- [Cần bổ sung nguồn: thang đo khả năng sử dụng SUS, nếu được sử dụng]. Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & I. L. McClelland (Eds.), *Usability evaluation in industry* (pp. 189–194). Taylor & Francis. *(Ghi chú: cần đối chiếu lại thông tin trang trước khi nộp.)*

*Không có DOI nào được cung cấp trong tài liệu này; nếu cần bổ sung, phải tra cứu từ nguồn xác thực.*

### 5. Đánh giá rủi ro, biện pháp bảo đảm an toàn và bảo vệ người tham gia

| Rủi ro | Biện pháp | Trạng thái |
|---|---|---|
| Dữ liệu cá nhân của học sinh vị thành niên | Không thu họ tên, số điện thoại; mã thẻ băm khi lưu; xuất dữ liệu chỉ có mã nghiên cứu ngẫu nhiên, không có mã thẻ | Đã triển khai trong mã nguồn |
| Mật khẩu tài khoản của học sinh | Không gửi lên máy chủ; máy chủ từ chối trường `password` | Đã triển khai; có kiểm thử |
| Nội dung lừa đảo bị lạm dụng | Tên miền hư cấu, dùng hậu tố dành riêng, không dẫn đến trang thật | Đã triển khai |
| Đoán mã thẻ bằng cách thử liên tiếp | Mã có 8 ký tự từ bảng 31 ký tự; **chưa có giới hạn số lần đăng nhập sai** | Hạn chế, cần khắc phục trước khi mở rộng |
| Giáo viên xem được thông tin đọc trái phép | Giáo viên chỉ xem số lượng và trạng thái tiến độ | Đã triển khai |
| Thao tác cấp lại thẻ sai hoặc lạm dụng | Yêu cầu xác nhận đối chiếu sổ; ghi nhật ký kiểm toán | Đã triển khai; **chưa có màn hình xem nhật ký** |
| Mật khẩu tạm của giáo viên không được đổi | Cờ nhắc đổi mật khẩu; không chặn đăng nhập (chủ đích, theo bản triển khai cục bộ) | Hạn chế, cần đánh giá trước khi triển khai thật |
| Số liệu của nhóm nhỏ bị suy ra được | Ẩn ô có dưới 5 người | Đã triển khai |
| Ý kiến chuyên môn trước khi thu thập dữ liệu | **[Cần bổ sung: ý kiến bằng văn bản của người có chuyên môn không phải người hướng dẫn, hoàn thành trước khi thu thập]** | Chưa có |
| Đồng ý của phụ huynh | **[Cần bổ sung: Phiếu IVd đã ký, cho học sinh và phụ huynh]** | Chưa có |

**Hạn chế nghiên cứu.**

- Dữ liệu khảo sát là tự báo cáo, thực hiện tại một trường, và không có nhóm đối chứng; không suy ra được quan hệ nhân quả.
- Biểu mẫu khảo sát đã được chỉnh sửa trong quá trình thu thập (mục 3.1).
- Đến thời điểm soạn hồ sơ, chưa có dữ liệu đo lường pre–post từ ứng dụng; H1–H4 chưa được kiểm định.
- Chưa thử trên máy chủ lưu trữ thật và chưa có giới hạn số lần đăng nhập sai.

### 6. Dự kiến sử dụng công nghệ số, trí tuệ nhân tạo

**Ứng dụng.** Hệ thống web không gọi mô hình AI khi học sinh sử dụng. Công nghệ sử dụng gồm: React 19, TypeScript, Vite (giao diện); PHP 8.1 và MariaDB/MySQL (máy chủ, cơ sở dữ liệu).

**Sử dụng AI trong quá trình phát triển.** Nhóm sử dụng Claude Code (Anthropic) để hỗ trợ viết mã, gỡ lỗi và soạn thảo tài liệu; chi tiết tại PL07. Mọi nội dung do AI đề xuất đều được nhóm kiểm tra và chịu trách nhiệm trước khi đưa vào dự án.

**Kê khai:** Thuộc diện **Mục 4.b** của Phụ lục 5 (được phép sử dụng nhưng phải khai báo). Chi tiết tại PL07.

---

## Phần III. ĐỀ NGHỊ VÀ PHÊ DUYỆT

**Ý kiến đề nghị của tổ chuyên môn:** [Cần bổ sung]

........, ngày ...... tháng ...... năm 2026

**HIỆU TRƯỞNG**
*(Ký, ghi rõ họ tên và đóng dấu)*

---

## Phụ lục 5 (Phần tóm tắt cho dự án này)

### IVa. Phê duyệt và đánh giá rủi ro của cơ sở giáo dục

1. **a. Học sinh/nhóm trưởng:** Trần Cảnh Phúc, ngày sinh [Cần bổ sung], lớp 9/1, số ĐDCN [Cần bổ sung], email [Cần bổ sung], điện thoại [Cần bổ sung].
   **b. Thành viên:** Cù Hoàng Linh Trúc, ngày sinh [Cần bổ sung], lớp 9/1, số ĐDCN [Cần bổ sung], email [Cần bổ sung], điện thoại [Cần bổ sung].
2. **Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở.
3. **Trường:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng. Điện thoại [Cần bổ sung]. Địa chỉ [Cần bổ sung]. Đơn vị dự thi [Cần bổ sung].
4. **a. Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh, điện thoại/email [Cần bổ sung].
5. **Thời gian thu thập dữ liệu:** Ngày bắt đầu [Cần bổ sung], ngày kết thúc [Cần bổ sung].
6. **Địa điểm:** ☒ Trường học ☐ Cơ quan nghiên cứu ☐ Thực địa ☐ Tại nhà ☐ Nơi khác. (Học sinh tham gia ứng dụng trên thiết bị cá nhân, tại nơi học sinh tự chọn; **[Cần xác nhận: có tham gia tại nhà hay không]**.)
7. **Nơi làm việc ngoài nhà trường:** Không có.
8. **Đánh giá rủi ro:** Dự án có yếu tố rủi ro theo mục 2 và mục 5 của Phần II: **Có ☒** (có thu thập dữ liệu từ học sinh vị thành niên; cần phiếu đồng ý). Nếu đánh dấu Có, học sinh kê khai đầy đủ trong Phụ lục 6.

### IVb. Cam kết của học sinh và người hướng dẫn nghiên cứu

1. **Học sinh và phụ huynh:** Chữ ký học sinh [Cần bổ sung], ngày [Cần bổ sung]; chữ ký phụ huynh [Cần bổ sung], họ và tên [Cần bổ sung].
2. **Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh, ngày [Cần bổ sung], chữ ký [Cần bổ sung].

*Lưu ý: Cam kết phải được ký trước khi tiến hành nghiên cứu.*

### Hồ sơ theo mục V của Mẫu 01

- ☐ 1) Ý kiến bằng văn bản của người có chuyên môn phù hợp: **[Cần bổ sung]**, hoàn thành trước khi thu thập dữ liệu.
- ☒ 2) Thu thập dữ liệu từ con người: cần **Phiếu IVd** có chữ ký học sinh và phụ huynh. **[Cần bổ sung: phiếu đã ký]**.
- ☐ 3) Không áp dụng (không sử dụng vi sinh vật, hóa chất nguy hiểm, nguồn phóng xạ).
- ☒ 4.b) Được phép sử dụng nhưng phải khai báo: xem Phụ lục 7 (PL07).

---

## Phụ lục 6. Nhật ký nghiên cứu và minh chứng dữ liệu

*(Bắt buộc với công việc thực hiện sau ngày 30/9/2026. Các hoạt động trước ngày này cần cung cấp nhật ký và minh chứng hiện có.)*

### I. Thông tin chung

- **Tên dự án:** An Toàn Số Học Đường
- **Lĩnh vực:** Công nghệ thông tin – An toàn thông tin trong giáo dục
- **Học sinh/nhóm trưởng:** Trần Cảnh Phúc [Cần xác nhận]
- **Thành viên:** Cù Hoàng Linh Trúc
- **Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh
- **Cơ sở giáo dục:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng
- **Thời gian thực hiện:** [Cần bổ sung]

### II. Nhật ký thực hiện

| TT | Ngày | Nội dung | Địa điểm | Người thực hiện | Minh chứng | Kết quả | Xác nhận của GVHD |
|---|---|---|---|---|---|---|---|
| 1 | [Cần bổ sung] | Khảo sát học sinh (phiếu A) | Trường | [Cần bổ sung] | Biểu mẫu trực tuyến, bảng phản hồi | 100 phiếu (dữ liệu sạch) | [Cần bổ sung] |
| 2 | [Cần bổ sung] | Khảo sát học sinh sau học (phiếu B) | Trường | [Cần bổ sung] | Biểu mẫu trực tuyến, bảng phản hồi | 100 phiếu (dữ liệu sạch) | [Cần bổ sung] |
| 3 | [Cần bổ sung] | Khảo sát giáo viên (phiếu C) | Trường | [Cần bổ sung] | Biểu mẫu trực tuyến, bảng phản hồi | 100 phiếu (dữ liệu sạch) | [Cần bổ sung] |
| 4 | [Cần bổ sung] | Phát triển và kiểm thử ứng dụng | [Cần bổ sung] | [Cần bổ sung] | Mã nguồn, kết quả kiểm thử (321 kiểm tra máy chủ, 14 kiểm tra giao diện) | Ứng dụng chạy được | [Cần bổ sung] |
| 5 | [Cần bổ sung] | Đo lường trước, can thiệp, sau, theo dõi | [Cần bổ sung] | [Cần bổ sung] | Tệp xuất dữ liệu | [Cần bổ sung] | [Cần bổ sung] |

*Lưu ý: Người hướng dẫn xác nhận ít nhất một lần mỗi tháng.*

### III. Kê khai công việc

| Học sinh | Nội dung công việc | Chi tiết | Minh chứng |
|---|---|---|---|
| Trần Cảnh Phúc | Khảo sát, phân tích kết quả | [Cần bổ sung] | Tệp dữ liệu, bảng tính |
| Trần Cảnh Phúc | Xây dựng ứng dụng | [Cần bổ sung] | Mã nguồn |
| Cù Hoàng Linh Trúc | Khảo sát, phân tích kết quả | [Cần bổ sung] | Tệp dữ liệu, bảng tính |
| Cù Hoàng Linh Trúc | Xây dựng ứng dụng | [Cần bổ sung] | Mã nguồn |

*Chỉ ghi công việc do chính học sinh thực hiện; phân công cụ thể do nhóm và người hướng dẫn xác nhận.*

### IV. Dữ liệu nghiên cứu

Học sinh lưu trữ: (1) hồ sơ dự án; (2) mã nguồn ứng dụng (kho GitHub `daominhtri2025-crypto/NCKH`); (3) video học sinh tham gia thực hiện (**[Cần bổ sung nếu có]**). Dữ liệu thô của khảo sát và tệp xuất đo lường được lưu trữ riêng, không đưa vào hồ sơ công khai.

### V. Kê khai hồ sơ

- ☐ 1) Ý kiến chuyên môn bằng văn bản: [Cần bổ sung]
- ☒ 2) Phiếu IVd: [Cần bổ sung]
- ☐ 3) Không áp dụng
- ☒ 4.b) PL07 đính kèm

---

*Ghi chú cho nhóm trước khi nộp.* Các mục **[Cần bổ sung]** gồm: họ tên và thông tin cá nhân học sinh, ngày khảo sát và ngày triển khai, ý kiến chuyên môn bằng văn bản, Phiếu IVd đã ký, nguồn tài liệu quốc tế, và thời điểm chỉnh sửa biểu mẫu khảo sát. Không điền thay bằng dữ liệu của dự án khác.
