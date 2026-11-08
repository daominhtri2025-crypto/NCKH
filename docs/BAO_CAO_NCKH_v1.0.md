# Nghiên cứu thiết kế và đánh giá hệ thống web tương tác nhằm nâng cao nhận thức và hành vi an toàn thông tin cho học sinh trung học cơ sở

**Phiên bản:** v1.0 (bản thảo)
**Trạng thái:** Chưa có dữ liệu thực nghiệm. Mọi nội dung liên quan đến kết quả là **kết quả dự kiến**, không phải phát hiện của nghiên cứu.
**Đơn vị thực hiện:** [Cần bổ sung: tên trường, phân hiệu]
**Học sinh thực hiện:** [Cần bổ sung: họ tên đầy đủ theo hồ sơ đề tài] — lớp 9/1
**Giáo viên hướng dẫn:** Hoàng Thị Bảo Oanh

> **Ghi chú về ký hiệu:** [Thực nghiệm] là nội dung đã kiểm chứng bằng chạy mã hoặc kiểm thử. [Đọc mã] là nội dung suy ra từ mã nguồn và tài liệu của dự án. [Thiết kế] là quyết định phương pháp, chưa được thực hiện. [Cần bổ sung nguồn] là chỗ cần tra cứu tài liệu học thuật.

---

## Tóm tắt

**Đặt vấn đề.** Học sinh trung học cơ sở ngày càng sử dụng điện thoại thông minh và mạng xã hội, đồng thời là đối tượng dễ bị tác động bởi các hình thức lừa đảo trực tuyến. Nhiều chương trình giáo dục an toàn thông tin hiện nay có nội dung hướng dẫn một chiều và ít đo lường được hiệu quả sau can thiệp [Cần bổ sung nguồn về thực trạng và các chương trình hiện có].

**Mục tiêu.** Thiết kế và xây dựng một hệ thống web tương tác gồm ba hoạt động, đồng thời đánh giá mức thay đổi về nhận thức và hành vi an toàn thông tin của học sinh THCS theo mô hình tiền–hậu–theo dõi.

**Phương pháp.** Nghiên cứu thử nghiệm bán thực nghiệm (quasi-experimental) với đo lường trước can thiệp, sau can thiệp và theo dõi sau bốn tuần, trên một đến hai lớp học, quy mô dự kiến 40–100 học sinh. Hệ thống được thiết kế theo nguyên tắc quyền riêng tư từ đầu, không thu thập họ tên, email hay số điện thoại. Dữ liệu được phân tích bằng các kiểm định phi tham số và kích thước hiệu ứng.

**Kết quả dự kiến.** Điểm kiến thức và điểm hành vi sau can thiệp cao hơn trước can thiệp; mức duy trì ở khảo sát theo dõi được ghi nhận riêng. **Đây là giả thuyết cần kiểm chứng, chưa phải kết quả.**

**Ý nghĩa.** Hệ thống và bộ công cụ đo lường được cung cấp dưới dạng có thể tái sử dụng, cho phép nhà trường và giáo viên tiến hành can thiệp tương tự với đo lường có cấu trúc.

**Từ khóa:** an toàn thông tin; giáo dục an toàn số; học sinh trung học cơ sở; hệ thống web tương tác; thiết kế tiền–hậu–theo dõi; quyền riêng tư theo thiết kế.

---

## 1. Đặt vấn đề và mục tiêu nghiên cứu

### 1.1. Bối cảnh

Việc sử dụng thiết bị số và mạng xã hội của học sinh ngày càng sớm. Đi kèm với đó là nguy cơ lừa đảo trực tuyến, mạo danh cơ quan và người thân, đánh cắp tài khoản và mã xác thực [Cần bổ sung nguồn về số liệu thống kê hiện hành về lừa đảo trực tuyến ở Việt Nam và độ tuổi học sinh]. Học sinh THCS thường có kỹ năng số tốt nhưng hiểu biết về rủi ro còn hạn chế, đặc biệt ở các nội dung như nhận diện tên miền giả mạo, quản lý mã xác thực và cài đặt quyền riêng tư [Cần bổ sung nguồn].

### 1.2. Thực trạng và khoảng trống nghiên cứu

Các tài liệu hướng dẫn an toàn thông tin phổ biến thường ở dạng tờ rơi hoặc bài giảng một chiều. Phần lớn không có cơ chế đo lường trước và sau can thiệp, và hiếm khi tách riêng đánh giá nhận thức khỏi đánh giá hành vi [Cần bổ sung nguồn về các nghiên cứu đánh giá chương trình giáo dục an toàn thông tin]. Đây là khoảng trống mà đề tài hướng tới.

### 1.3. Mục tiêu nghiên cứu

1. Thiết kế và xây dựng một hệ thống web tương tác gồm ba hoạt động về an toàn thông tin cho học sinh THCS.
2. Đánh giá mức thay đổi về nhận thức an toàn thông tin của học sinh sau can thiệp và sau bốn tuần.
3. Đánh giá mức thay đổi về hành vi an toàn thông tin tự báo cáo của học sinh.
4. Bảo đảm quyền riêng tư và an toàn dữ liệu của học sinh trong toàn bộ quá trình nghiên cứu.

### 1.4. Câu hỏi nghiên cứu

- **Q1.** Điểm nhận thức an toàn thông tin của học sinh có tăng sau can thiệp so với trước can thiệp không?
- **Q2.** Mức tăng này có được duy trì ở khảo sát theo dõi sau bốn tuần không?
- **Q3.** Điểm hành vi tự báo cáo có thay đổi sau can thiệp không?
- **Q4.** Thời gian phản hồi và việc sử dụng gợi ý có liên quan đến độ chính xác trong các hoạt động không?

---

## 2. Cơ sở lý thuyết và phương pháp nghiên cứu

### 2.1. Cơ sở lý thuyết

Đề tài dựa trên giả định rằng nhận thức về rủi ro là điều kiện cần cho thay đổi hành vi, nhưng không đủ. Vì vậy đề tài tách đo lường thành hai nhóm: nhận thức (kiến thức có đáp án đúng) và hành vi tự báo cáo [Thiết kế]. Cách tiếp cận này phù hợp với các khung đánh giá chương trình giáo dục sức khỏe và an toàn nói chung [Cần bổ sung nguồn về lý thuyết thay đổi hành vi, ví dụ mô hình tiền thân về nhận thức–hành vi].

Về an toàn thông tin, đề tài tham chiếu các nguyên tắc bảo mật phổ biến như xác thực đa yếu tố, bảo vệ mật khẩu và nhận diện đường dẫn đáng ngờ. Phần tham chiếu kỹ thuật dựa trên OWASP Foundation (2021) và NIST (Grassi et al., 2017), cần được xác minh phiên bản và đường dẫn chính thức trước khi nộp [Cần bổ sung nguồn: xác minh URL và phiên bản].

### 2.2. Thiết kế nghiên cứu: mô hình tiền–hậu–theo dõi

| Giai đoạn | Mã | Thời điểm | Mở khi | Nội dung |
|---|---|---|---|---|
| Tiền kiểm | `pre` | Trước can thiệp | Đăng ký xong | 16 câu: 10 kiến thức, 6 hành vi |
| Hậu kiểm | `post` | Sau khi xong cả ba hoạt động | Đã làm pre và đủ 3 hoạt động | Cùng bộ 16 câu |
| Theo dõi | `delayed` | Sau 28 ngày kể từ hậu kiểm | Đã làm post và đã qua 28 ngày | Cùng bộ 16 câu |

Thiết kế là bán thực nghiệm không ngẫu nhiên, một nhóm hoặc hai lớp [Thiết kế]. Thiết kế không có nhóm đối chứng ngẫu nhiên, nên không thể loại trừ hoàn toàn các yếu tố thay thế như trưởng thành tự nhiên hay tác động của các bài học khác [Cần bổ sung nguồn về hạn chế của thiết kế bán thực nghiệm; xem Shadish et al., 2002].

**Biến số.**

| Biến | Loại | Cách đo |
|---|---|---|
| Điểm kiến thức | Liên tục (0–10) | Số câu đúng trong 10 câu kiến thức |
| Tỷ lệ kiến thức | Liên tục (0–100%) | Điểm kiến thức chia 10 |
| Điểm hành vi | Thứ bậc, trung bình 1–4 | Trung bình các câu hành vi, đã đảo chiều ba câu có cờ đảo |
| Thời gian phản hồi | Liên tục (ms) | Từ lúc hiển thị câu đến khi chọn |
| Hoàn thành hoạt động | Nhị phân | Module 1: 5/5; Module 2: 12/12; Module 3: 8/8 bước và phòng thí nghiệm đạt |
| Sử dụng gợi ý | Nhị phân | Có mở "Đọc từ phải sang trái" trước khi phân loại (Module 2) |

Ba câu hành vi có cờ đảo chiều (b03 bấm link lạ, b04 đọc mã OTP, cùng một câu khác trong bộ) được tính theo công thức điều chỉnh: điểm = 5 − mức trả lời [Đọc mã: `api/content/assessment_items.json`].

### 2.3. Thiết kế hệ thống web tương tác

Hệ thống gồm ba hoạt động, được triển khai theo nguyên tắc tách nội dung khỏi mã (nội dung lưu trong tệp JSON có phiên bản).

**Hoạt động 1: Sân chơi tình huống.** Năm kịch bản mô phỏng cuộc gọi tự xưng công an, yêu cầu đọc mã OTP, tin nhắn trúng thưởng, tài khoản bạn bè nhờ chuyển tiền và trang thanh toán giả mạo. Học sinh chọn cách xử lý, nhận phản hồi đúng sai kèm giải thích và có thể chọn lại [Đọc mã: `api/content/module1_scenarios.json`].

**Hoạt động 2: Thám tử không gian mạng.** Mười hai địa chỉ web được phân loại là chính thống hoặc giả mạo. Có năm kiểu đánh lừa: thay ký tự, tên chính làm tên miền con, đổi đuôi, thêm từ vào tên, và tên chính nằm trong đường dẫn. Học sinh có thể mở gợi ý "đọc từ phải sang trái", trong đó phần gốc của tên miền được làm nổi bật. Để bảo đảm an toàn, mọi tên miền trong nội dung chỉ dùng đuôi `.test`, `.example`, hoặc `.io.vn` có dấu hiệu hư cấu; lớp kiểm tra nội dung từ chối tên miền thật khi nạp dữ liệu [Thực nghiệm: kiểm thử từ chối tên miền `.gov.vn`].

**Hoạt động 3: Phòng thí nghiệm tài khoản.** Gồm hai phần. Phần thứ nhất là trình đánh giá mật khẩu cục bộ: tính entropy lý thuyết, entropy sau khi trừ các mẫu quen thuộc và thời gian bẻ khóa mô phỏng; mọi tính toán thực hiện trên trình duyệt. Phần thứ hai là checklist tám bước về quyền riêng tư cho Zalo và Facebook, mỗi bước có câu kiểm tra và xác nhận đã thực hành.

### 2.4. Đạo đức nghiên cứu và quyền riêng tư theo thiết kế

Đề tài áp dụng nguyên tắc quyền riêng tư từ thiết kế (privacy by design) ở các cấp sau:

1. **Tối thiểu hóa dữ liệu.** Không thu thập họ tên, email, số điện thoại, ảnh hay thời điểm đồng ý trong bộ xuất dữ liệu. Thông tin đồng ý chỉ lưu trong CSDL để kiểm soát phiên bản phiếu.
2. **Định danh giả.** Học sinh nhận mã dạng `XXXX-XXXX` do hệ thống cấp. Mã dùng để đăng nhập lại và nối kết quả trước và sau, không chứa thông tin cá nhân.
3. **Mật khẩu không rời trình duyệt.** Phòng thí nghiệm mật khẩu tính toán cục bộ. Máy chủ từ chối mọi yêu cầu có trường `password`, và chỉ nhận mức đánh giá cao nhất. Kiểm tra trên trình duyệt xác nhận chuỗi thử nghiệm không xuất hiện trong bất kỳ yêu cầu gửi đi, URL hay bộ nhớ cục bộ [Thực nghiệm].
4. **Không dùng dịch vụ bên ngoài để kiểm tra mật khẩu.** Tích hợp kiểm tra mật khẩu bị rò rỉ theo k-anonymity đã được giữ trong mã nguồn kế thừa nhưng không dùng trong hệ thống này, vì ngay cả tiền tố băm cũng là dữ liệu liên quan đến mật khẩu thật của học sinh [Đọc mã].
5. **Tự nguyện và rút lui.** Phiếu đồng ý ghi rõ quyền dừng bất cứ lúc nào. Phiên bản phiếu (`consent_version`) được kiểm tra phía máy chủ.
6. **Bảo vệ dữ liệu xuất.** Tệp xuất yêu cầu token quản trị hoặc quyền truy cập máy chủ, không công khai.

Đề tài cần được nhà trường phê duyệt và có sự đồng ý của phụ huynh trước khi triển khai [Thiết kế: phiếu đồng ý và văn bản phê duyệt sẽ bổ sung khi có quyết định của nhà trường].

### 2.5. Phương pháp phân tích dữ liệu (dự kiến)

- **Mô tả:** trung vị, khoảng tứ phân vị và tỷ lệ cho từng giai đoạn.
- **So sánh trước–sau:** kiểm định Wilcoxon signed-rank cho điểm kiến thức và điểm hành vi, vì mẫu nhỏ và phân phối có thể không chuẩn.
- **So sánh giữa các giai đoạn:** kiểm định Friedman cho ba giai đoạn nếu đủ dữ liệu cho cả ba điểm đo.
- **Kích thước hiệu ứng:** r = Z/√N cho kiểm định Wilcoxon.
- **Mối liên quan:** tương quan Spearman giữa thời gian phản hồi, sử dụng gợi ý và độ chính xác.
- **Dữ liệu thiếu:** báo cáo số học sinh bỏ dở ở từng giai đoạn; không thay thế bằng giá trị ước lượng trong bản v1.0.
- **Ngưỡng ý nghĩa:** α = 0,05, báo cáo kèm khoảng tin cậy khi có thể.

[Cần bổ sung nguồn về lựa chọn kiểm định phi tham số cho thiết kế lặp đo nhỏ.]

---

## 3. Nội dung triển khai và giải pháp kỹ thuật

### 3.1. Kiến trúc hệ thống

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Giao diện | React 19, TypeScript, Vite | Trình bày các hoạt động và khảo sát, tính toán mật khẩu cục bộ |
| API | PHP 8.1+, PDO MySQL, không framework | Xác thực mã, kiểm soát trình tự, ghi nhận kết quả, xuất dữ liệu |
| Cơ sở dữ liệu | MySQL 8.0 hoặc MariaDB 10.6+ | Lưu học sinh, lớp, nhật ký hoạt động, khảo sát |
| Nội dung | Tệp JSON có phiên bản | Kịch bản, câu hỏi, checklist |

[Đọc mã: `api/`, `web/`, `api/database/schema.sql`]

Lược đồ CSDL gồm bốn bảng chính:
- `classes`: mã lớp, tên lớp, tên trường.
- `participants`: mã học sinh, mã lớp, băm của phiên đăng nhập, phiên bản phiếu đồng ý, thời điểm đồng ý.
- `module_events`: mọi lần trả lời trong ba hoạt động, kèm số lần thử, đúng/sai, thời gian phản hồi, cờ sử dụng gợi ý.
- `assessments_self`: kết quả khảo sát theo giai đoạn, có ràng buộc duy nhất theo (học sinh, giai đoạn, câu).

Cơ sở dữ liệu lưu băm SHA-256 của phiên đăng nhập, không lưu giá trị gốc.

### 3.2. Phân phối mã lớp và quản lý học sinh

**Mã lớp.** Nhóm kỹ thuật tạo lớp bằng công cụ dòng lệnh (`php api/bin/add_class.php`). Giáo viên cung cấp mã lớp cho học sinh; học sinh nhập mã khi đăng ký. Mã lớp không hợp lệ bị từ chối.

**Mã học sinh.** Được tạo ngẫu nhiên từ bảng chữ cái loại bỏ các ký tự dễ nhầm (0, O, 1, I, L), 32 ký tự, tổng 40 bit. Hệ thống kiểm tra trùng lặp khi tạo.

**Tính chất định danh.** Đây là định danh nghiên cứu, không phải mật khẩu. Với 40 bit, không gian mã đủ lớn cho quy mô lớp học, nhưng hệ thống **chưa có giới hạn tần suất cho đăng nhập bằng mã**. Đây là điểm hạn chế được nêu ở mục 6.

**Phiên đăng nhập.** Cookie HttpOnly, SameSite=Lax, có thời hạn 24 giờ. Đăng nhập lại làm vô hiệu phiên cũ.

### 3.3. Quy trình tham gia của học sinh

1. **Đăng ký.** Nhập mã lớp, đọc phiếu đồng ý, tích đồng ý, nhận mã học sinh. Nút tạo mã chỉ bật khi có đủ hai điều kiện.
2. **Khảo sát đầu vào.** Làm 16 câu, không có phản hồi đúng sai. Bắt buộc hoàn thành trước mọi hoạt động; API trả 403 nếu chưa làm.
3. **Ba hoạt động.** Học sinh làm theo thứ tự tùy chọn. Hệ thống theo dõi tiến độ từng hoạt động.
4. **Khảo sát sau can thiệp.** Mở khi đã hoàn thành đủ ba hoạt động.
5. **Khảo sát theo dõi.** Mở sau 28 ngày kể từ khi hoàn thành khảo sát sau can thiệp. Thời hạn cấu hình được qua biến môi trường.

[Thực nghiệm: kiểm thử tích hợp xác nhận trình tự khóa và mở khóa, kể cả trường hợp thời gian chưa đủ.]

### 3.4. Vai trò của giáo viên hướng dẫn

Giáo viên không có tài khoản trong hệ thống. Vai trò của giáo viên gồm:

- **Trước khi triển khai:** thống nhất với nhà trường và phụ huynh; đề nghị nhóm kỹ thuật tạo mã lớp; chuẩn bị thiết bị.
- **Trong giờ học:** hướng dẫn trình tự làm việc; nhắc học sinh ghi mã vào vở, không ghi trên giấy có tên; khi học sinh quên mã, chuyển cho nhóm kỹ thuật.
- **Sau khi hoàn thành:** nhắc học sinh làm khảo sát sau can thiệp; lên lịch nhắc khảo sát theo dõi, vì hệ thống chưa tự nhắc.
- **Giới hạn:** không yêu cầu học sinh nhập thông tin thật vào hệ thống; không chia sẻ mã học sinh; không truy cập hay sửa dữ liệu CSDL.

### 3.5. Quản lý và xuất dữ liệu nghiên cứu

**Codebook.** Mã hóa mọi cột và mọi câu hỏi trong tài liệu `docs/CODEBOOK_NGHIEN_CUU.md`, được sinh tự động từ nội dung để tránh sai lệch.

**Hai định dạng xuất.**
- **Định dạng rộng:** một dòng mỗi học sinh, gồm điểm kiến thức, tỷ lệ, điểm hành vi đã điều chỉnh, thời gian phản hồi trung bình cho từng giai đoạn, và tiến độ ba hoạt động. Phù hợp cho phân tích lặp đo.
- **Định dạng dài:** một dòng mỗi lần trả lời, kèm thời gian và phiên bản nội dung. Phù hợp cho phân tích từng câu.

Cả hai định dạng chỉ chứa mã giả danh và mã lớp, không chứa họ tên, email, số điện thoại, thời điểm đồng ý hay nội dung mật khẩu [Thực nghiệm: kiểm thử kiểm tra cột tiêu đề và các dòng dữ liệu].

**Cách xuất.** Qua dòng lệnh trên máy chủ, hoặc qua HTTP với header `X-Admin-Token`. Nếu `ADMIN_TOKEN` để trống, chức năng HTTP bị tắt.

### 3.6. Kiểm thử và đảm bảo chất lượng

| Loại kiểm thử | Phạm vi | Kết quả lần xác nhận gần nhất |
|---|---|---|
| Tích hợp API | Đăng ký, xác thực, ba hoạt động, khảo sát, khóa trình tự, xuất dữ liệu, bảo mật | 142/142 đạt |
| Đơn vị | Bộ đánh giá mật khẩu | 14/14 đạt |
| Biên dịch và build giao diện | TypeScript strict, Vite | Đạt |
| Smoke test luồng học sinh | Đăng ký đến khảo sát theo dõi, qua proxy Vite | 26/26 đạt |
| Trình duyệt | Luồng học sinh, khóa module, bố cục điện thoại và máy tính | Đạt |

[Thực nghiệm: kết quả từ các lần chạy trong quá trình phát triển. Bộ kiểm thử API được xác nhận lần cuối trước khi chuyển sang môi trường Windows; cần chạy lại trước khi nộp.]

---

## 4. Kết quả dự kiến

Phần này **không chứa kết quả thực nghiệm**. Nêu các giả thuyết và tiêu chí để đánh giá khi có dữ liệu.

| Giả thuyết | Nội dung | Tiêu chí dự kiến |
|---|---|---|
| H1 | Điểm kiến thức sau can thiệp cao hơn trước can thiệp | Wilcoxon, p < 0,05, r có ý nghĩa thực tiễn |
| H2 | Điểm kiến thức ở theo dõi vẫn cao hơn trước can thiệp | Wilcoxon, cùng cặp so sánh |
| H3 | Điểm hành vi sau can thiệp cao hơn trước can thiệp | Wilcoxon sau điều chỉnh đảo chiều |
| H4 | Sử dụng gợi ý liên quan đến độ chính xác cao hơn ở Module 2 | Mann-Whitney hoặc tương quan, cần thận trọng vì gợi ý không ngẫu nhiên |

Nếu kết quả không thỏa mãn H1 hoặc H3, báo cáo sẽ trình bày trung thực và phân tích nguyên nhân có thể, gồm hiệu ứng trần khi học sinh đã biết trước, và tác động của bộ câu hỏi dùng chung.

---

## 5. Thảo luận

### 5.1. Giá trị của đề tài

**Về khoa học.** Đề tài cung cấp một thiết kế đo lường tách biến nhận thức và hành vi, có cơ chế kiểm soát trình tự và ghi nhận thời gian phản hồi. Cách tiếp cận này có thể được các nghiên cứu sau áp dụng và mở rộng.

**Về thực tiễn.** Hệ thống cung cấp học liệu có cấu trúc, dùng được trong giờ sinh hoạt hoặc ngoại khóa. Các hoạt động bám sát hình thức lừa đảo và thao tác thực tế trên điện thoại của học sinh.

**Về quyền riêng tư.** Đề tài cho thấy có thể thiết kế một hệ thống nghiên cứu với dữ liệu tối giản và không chứa thông tin định danh, đồng thời vẫn đo được kết quả có ý nghĩa.

### 5.2. Liên hệ với các nghiên cứu trước

[Cần bổ sung nguồn: so sánh với các nghiên cứu về giáo dục an toàn thông tin cho học sinh, đặc biệt các nghiên cứu có đo lường trước và sau can thiệp. Bản v1.0 chưa tra cứu được tài liệu nên chưa thể so sánh cụ thể.]

---

## 6. Giới hạn và hướng phát triển

### 6.1. Giới hạn hiện tại

| Mã | Giới hạn | Tác động | Biện pháp dự kiến |
|---|---|---|---|
| G1 | Hiệu ứng luyện tập: pre, post, delayed dùng cùng một bộ câu hỏi | Có thể làm tăng điểm do học sinh nhớ câu hỏi, không phải do hiểu biết | Thiết kế bộ câu song song; báo cáo nêu rõ trong kết luận |
| G2 | Tính hợp lệ nội dung của câu hỏi chưa được chuyên gia thẩm định | Có thể không đo đúng khái niệm | Thẩm định bởi hội đồng chuyên gia trước khi thu dữ liệu chính thức |
| G3 | Độ tin cậy và tính cấu trúc của thang hành vi chưa được kiểm định | Điểm hành vi có thể không ổn định | Thử nghiệm thí điểm; tính hệ số tin cậy nội bộ khi đủ dữ liệu |
| G4 | Câu hành vi là tự báo cáo | Có thể sai lệch do mong muốn xã hội | Ghi nhận điều này là hạn chế; có thể bổ sung đo lường khách quan trong nghiên cứu sau |
| G5 | Thiết kế không có nhóm đối chứng ngẫu nhiên | Không thể quy kết hoàn toàn thay đổi cho can thiệp | Nêu rõ trong diễn giải; cân nhắc nhóm đối chứng ở nghiên cứu tiếp theo |
| G6 | Ngưỡng ẩn danh cho lớp nhỏ chưa được thực thi trong mã | Nguy cơ suy luận lại danh tính khi công bố kết quả theo lớp | Bổ sung kiểm tra quy mô tối thiểu trước khi công bố; hiện chỉ khuyến nghị trong codebook |
| G7 | Không có cơ chế nhắc khảo sát theo dõi | Tỷ lệ quay lại có thể thấp | Giáo viên lên lịch nhắc; cân nhắc thông báo trong ứng dụng |
| G8 | Đăng nhập bằng mã chưa có giới hạn tần suất | Mã có thể bị thử nhiều lần | Bổ sung giới hạn theo địa chỉ IP trước khi triển khai rộng |
| G9 | Nội dung mục menu Zalo và Facebook có thể khác theo phiên bản ứng dụng | Hướng dẫn có thể lỗi thời | Đối chiếu với ứng dụng thực tế trước khi dùng; ghi cảnh báo trên giao diện |
| G10 | Chưa thử nghiệm trên máy chủ thực tế (iNET) | Chưa xác nhận hiệu năng và cấu hình hosting | Chạy smoke test trên máy chủ thật trước khi thu dữ liệu |
| G11 | Chưa có giao diện quản trị cho giáo viên | Giáo viên phụ thuộc nhóm kỹ thuật để quản lý lớp và xuất dữ liệu | Phát triển giao diện quản trị đơn giản trong giai đoạn sau |
| G12 | Quy mô mẫu nhỏ dự kiến | Độ mạnh thống kê hạn chế | Báo cáo kích thước hiệu ứng và khoảng tin cậy; không khái quát hóa ngoài mẫu |

### 6.2. Hướng phát triển

1. Thẩm định nội dung bởi hội đồng chuyên gia và thử nghiệm thí điểm trên nhóm nhỏ.
2. Xây dựng bộ câu hỏi song song cho post-test và delayed test để kiểm soát hiệu ứng luyện tập.
3. Bổ sung kiểm tra ngưỡng ẩn danh và giới hạn tần suất đăng nhập.
4. Phát triển giao diện quản trị cho giáo viên: danh sách lớp, tiến độ theo giai đoạn không chứa dữ liệu cá nhân, xuất dữ liệu.
5. Thiết kế nghiên cứu có nhóm đối chứng ngẫu nhiên hóa ở cấp lớp.
6. Mở rộng nội dung sang các nền tảng khác và các hình thức lừa đảo mới.

---

## 7. Kết luận

Đề tài đã thiết kế và xây dựng một hệ thống web tương tác gồm ba hoạt động về an toàn thông tin cho học sinh trung học cơ sở, đi kèm mô hình đo lường tiền–hậu–theo dõi, cơ chế kiểm soát trình tự và bộ công cụ xuất dữ liệu ẩn danh. Hệ thống đã được kiểm thử ở mức tích hợp, đơn vị, và luồng học sinh trên trình duyệt.

**Đóng góp chính:**
1. Một hệ thống có thể tái sử dụng, với nội dung tách khỏi mã và có kiểm tra an toàn nội dung.
2. Một thiết kế đo lường tách biến nhận thức và hành vi, có ghi nhận thời gian phản hồi và codebook.
3. Một mô hình bảo vệ quyền riêng tư từ thiết kế cho nghiên cứu với đối tượng là học sinh.

**Điều chưa khẳng định được:** hiệu quả của can thiệp. Đề tài chưa có dữ liệu thực nghiệm. Mọi kết luận về hiệu quả phải chờ kết quả thu thập và phân tích, và cần đọc cùng các giới hạn ở mục 6.

---

## Tài liệu tham khảo

*Các mục dưới đây là bản thảo. Các nguồn cần được tra cứu, xác minh và định dạng lại theo APA 7 trước khi nộp.*

Grassi, P. A., Garcia, M. E., & Fenton, J. L. (2017). *Digital identity guidelines: Authentication and lifecycle management* (NIST Special Publication 800-63B). National Institute of Standards and Technology. [Cần xác minh phiên bản và đường dẫn chính thức.]

OWASP Foundation. (2021). *OWASP Top Ten*. [Cần xác minh đường dẫn chính thức.]

Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton Mifflin. [Cần xác minh thông tin xuất bản.]

Sweeney, L. (2002). k-anonymity: A model for protecting privacy. *International Journal of Uncertainty, Fuzziness and Knowledge-Based Systems, 10*(5), 557–570. [Cần xác minh DOI.]

[Cần bổ sung nguồn: thống kê về lừa đảo trực tuyến và nguy cơ với học sinh ở Việt Nam.]

[Cần bổ sung nguồn: các nghiên cứu giáo dục an toàn thông tin cho học sinh THCS có đo lường trước và sau can thiệp.]

[Cần bổ sung nguồn: lý thuyết thay đổi hành vi trong giáo dục sức khỏe và an toàn.]

[Cần bổ sung nguồn: phương pháp phân tích phi tham số cho thiết kế lặp đo quy mô nhỏ.]

Nhóm nghiên cứu. (2026). *An Toàn Số Học Đường* [Mã nguồn]. GitHub. https://github.com/daominhtri2025-crypto/NCKH

---

## Phụ lục A: Danh mục mã nguồn và tài liệu liên quan

| Tệp | Nội dung |
|---|---|
| `api/content/assessment_items.json` | Bộ câu hỏi khảo sát, phiên bản a-v1 |
| `api/content/module1_scenarios.json` | Năm kịch bản, phiên bản m1-v1 |
| `api/content/module2_domains.json` | Mười hai địa chỉ web, phiên bản m2-v2 |
| `api/content/module3_checklist.json` | Checklist tám bước, phiên bản m3-v1 |
| `api/database/schema.sql` | Lược đồ CSDL |
| `docs/CODEBOOK_NGHIEN_CUU.md` | Mã hóa dữ liệu và bộ câu hỏi |
| `docs/PHAN_TICH_DU_AN.md` | Phân tích dự án và sơ đồ tư duy |
| `docs/TRIEN_KHAI_INET.md` | Hướng dẫn triển khai |
| `docs/CHAY_CUC_BO.md` | Hướng dẫn chạy cục bộ |
| `docs/HUONG_DAN_SU_DUNG_THEO_VAI_TRO.md` | Hướng dẫn theo vai trò |
