---
title: "An Toàn Số Học Đường"
subtitle: "Hệ thống web tương tác nâng cao nhận thức và hành vi an toàn thông tin cho học sinh trung học cơ sở"
lang: vi-VN
---

::: {custom-style="Cover Note"}
Hồ sơ dự thi Khoa học kỹ thuật cấp học dành cho học sinh trung học cơ sở
:::

<!--TOC-->

# TÓM TẮT

Nghiên cứu này thiết kế, xây dựng và kiểm chứng kỹ thuật một hệ thống web tương tác về an toàn thông tin dành cho học sinh trung học cơ sở, cùng mô hình đo lường nhận thức và hành vi theo ba giai đoạn: tiền kiểm, hậu kiểm và theo dõi sau 28 ngày. Hệ thống gồm ba hoạt động: sân chơi tình huống lừa đảo, nhận diện tên miền giả mạo bằng quy tắc đọc từ phải sang trái, và phòng thí nghiệm tài khoản gồm đánh giá mật khẩu cục bộ và checklist quyền riêng tư. Thiết kế bảo đảm ẩn danh bằng mã giả danh, không thu họ tên, email hay số điện thoại; mật khẩu thử nghiệm không rời trình duyệt.

Hệ thống đã hoàn thành các thành phần chức năng và đạt toàn bộ các kiểm thử tích hợp (183 kiểm tra), kiểm thử đơn vị (14 kiểm thử) và kiểm thử luồng người dùng (23 bước). Nghiên cứu chưa thu thập dữ liệu thực nghiệm; vì vậy báo cáo trình bày thiết kế, phương pháp và khung phân tích, không trình bày kết quả. Ba giả thuyết về sự gia tăng điểm nhận thức và hành vi sau can thiệp, cùng khả năng duy trì kết quả sau 28 ngày, sẽ được kiểm định khi có dữ liệu.

**Từ khóa:** an toàn thông tin; giáo dục an toàn số; học sinh trung học cơ sở; hệ thống web tương tác; đo lường tiền–hậu–theo dõi; quyền riêng tư theo thiết kế.

# DANH MỤC VIẾT TẮT

| Viết tắt | Nghĩa đầy đủ |
|---|---|
| ATTT | An toàn thông tin |
| API | Giao diện lập trình ứng dụng (Application Programming Interface) |
| CSDL | Cơ sở dữ liệu |
| CSRF | Giả mạo yêu cầu liên trang (Cross-Site Request Forgery) |
| CSV | Giá trị phân tách bằng dấu phẩy (Comma-Separated Values) |
| HTTP | Giao thức truyền tải siêu văn bản (HyperText Transfer Protocol) |
| NIST | Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ (National Institute of Standards and Technology) |
| OTP | Mật khẩu dùng một lần (One-Time Password) |
| OWASP | Dự án bảo mật ứng dụng web mở (Open Worldwide Application Security Project) |
| PDO | Đối tượng dữ liệu PHP (PHP Data Objects) |
| SHA-256 | Thuật toán băm an toàn 256 bit (Secure Hash Algorithm 256-bit) |
| SQL | Ngôn ngữ truy vấn dữ liệu có cấu trúc (Structured Query Language) |
| THCS | Trung học cơ sở |
| URL | Địa chỉ tài nguyên trên mạng (Uniform Resource Locator) |

# DANH MỤC BẢNG VÀ HÌNH

**Bảng**

- Bảng 1. Ba giai đoạn đo lường
- Bảng 2. Biến số nghiên cứu và cách đo
- Bảng 3. Các hoạt động của hệ thống
- Bảng 4. Kiểu đánh lừa trong hoạt động nhận diện tên miền
- Bảng 5. Kết quả kiểm chứng kỹ thuật
- Bảng 6. Cấu trúc các bảng dữ liệu chính
- Bảng 7. Giả thuyết, phép kiểm định và điều kiện kết luận
- Bảng 8. Khung ghi kết quả thực nghiệm (chưa có dữ liệu)
- Bảng 9. Giới hạn của nghiên cứu và biện pháp khắc phục

**Hình**

- Hình 1. Trình tự mở khóa các giai đoạn khảo sát
- Hình 2. Kiến trúc hệ thống
- Hình 3. Luồng dữ liệu và ranh giới quyền riêng tư

# MỞ ĐẦU

## 1. Lý do chọn đề tài

Học sinh trung học cơ sở sử dụng điện thoại thông minh và mạng xã hội thường xuyên từ sớm. Hành vi này đi kèm với các rủi ro lừa đảo qua tin nhắn và cuộc gọi, mạo danh người quen, đánh cắp mã xác thực và dẫn dắt người dùng vào trang web giả mạo. Theo Bộ Công an, trong tháng 8/2024 cả nước ghi nhận 815 vụ lừa đảo chiếm đoạt tài sản, quá nửa trong số đó diễn ra trên không gian mạng (Pháp luật TP.HCM, 2024). Số liệu này phản ánh quy mô tội phạm, không phản ánh tỷ lệ học sinh là nạn nhân; đề tài không suy diễn từ đó.

Học sinh ở độ tuổi này thường thành thạo thao tác trên thiết bị nhưng chưa có kiến thức có hệ thống về các dấu hiệu lừa đảo. Các nội dung cụ thể như đọc cấu trúc tên miền, nhận ra mã xác thực không được chia sẻ, hay cấu hình quyền riêng tư đòi hỏi hướng dẫn trực tiếp và thực hành. Nghiên cứu về giáo dục nhận diện lừa đảo cho trẻ em cho thấy can thiệp có thể cải thiện kết quả trong ngắn hạn, nhưng hiệu quả giảm sau khoảng bốn tuần (Lastdrager và cộng sự, 2017). Kết luận này đặt ra yêu cầu đo lường lặp lại theo thời gian, không chỉ đo ngay sau khi học.

Đề tài vì vậy tập trung vào một câu hỏi kỹ thuật và phương pháp: làm thế nào để xây dựng một công cụ thực hành có thể triển khai trong nhà trường, đồng thời đo được sự thay đổi nhận thức và hành vi qua ba thời điểm, mà không thu thập thông tin định danh học sinh.

## 2. Mục tiêu nghiên cứu

1. Thiết kế và xây dựng hệ thống web tương tác gồm ba hoạt động về an toàn thông tin cho học sinh trung học cơ sở.
2. Xây dựng bộ công cụ đo lường tách riêng nhận thức (câu có đáp án) và hành vi (tự báo cáo).
3. Thiết kế quy trình đo lường tiền–hậu–theo dõi với trình tự mở khóa được kiểm soát ở phía máy chủ.
4. Bảo đảm ẩn danh dữ liệu và quyền riêng tư của học sinh trong toàn bộ vòng đời nghiên cứu.
5. Xác định khung phân tích để kiểm định các giả thuyết khi có dữ liệu thực nghiệm.

## 3. Câu hỏi nghiên cứu và giả thuyết

**Câu hỏi nghiên cứu**

- **Q1.** Điểm nhận thức an toàn thông tin của học sinh có khác biệt giữa giai đoạn trước và sau can thiệp?
- **Q2.** Khác biệt này còn có ý nghĩa ở giai đoạn theo dõi sau 28 ngày?
- **Q3.** Điểm hành vi tự báo cáo có khác biệt giữa trước và sau can thiệp?
- **Q4.** Thời gian phản hồi và việc sử dụng gợi ý có liên quan đến độ chính xác phân loại không?

**Giả thuyết**

- **H1.** Điểm kiến thức sau can thiệp cao hơn điểm kiến thức trước can thiệp.
- **H2.** Điểm kiến thức ở giai đoạn theo dõi cao hơn điểm kiến thức trước can thiệp.
- **H3.** Điểm hành vi sau can thiệp cao hơn điểm hành vi trước can thiệp.
- **H4.** Học sinh sử dụng gợi ý đọc tên miền có tỷ lệ phân loại đúng cao hơn học sinh không sử dụng.

H1 đến H3 là giả thuyết có hướng, dựa trên mục đích can thiệp. H4 là mối liên hệ quan sát được, không phải kết quả của phân bổ ngẫu nhiên, nên chỉ được diễn giải như tương quan.

## 4. Đối tượng và phạm vi nghiên cứu

**Đối tượng.** Học sinh trung học cơ sở trong một đến hai lớp học do nhà trường lựa chọn, quy mô dự kiến 40 đến 100 học sinh. Tham gia là tự nguyện và có sự đồng ý của phụ huynh hoặc người giám hộ.

**Phạm vi không gian.** Một cơ sở giáo dục. Học sinh sử dụng thiết bị cá nhân hoặc thiết bị được nhà trường cung cấp.

**Phạm vi thời gian.** Khoảng sáu tuần, từ đo lường trước can thiệp đến đo lường theo dõi, trong đó có 28 ngày giữa hậu kiểm và theo dõi.

**Phạm vi nội dung.** Nhận diện lừa đảo qua điện thoại và tin nhắn; nhận diện tên miền giả mạo; quản lý mật khẩu, mã xác thực và quyền riêng tư trên ứng dụng nhắn tin và mạng xã hội.

**Giới hạn phạm vi.** Nghiên cứu không kiểm tra bất kỳ hệ thống của cơ quan, tổ chức hay doanh nghiệp nào; mọi tên miền trong nội dung là tên hư cấu; nghiên cứu không đánh giá tài khoản thật của học sinh.

## 5. Ý nghĩa khoa học và thực tiễn

**Ý nghĩa khoa học.** Đề tài đề xuất một thiết kế đo lường tách biến nhận thức và hành vi, có kiểm soát trình tự và ghi nhận thời gian phản hồi ở mức từng câu. Bộ mã hóa dữ liệu (codebook) và cấu trúc xuất dữ liệu hai định dạng được mô tả đầy đủ, có thể tái sử dụng cho các nghiên cứu sau. Đề tài cũng minh họa cách thiết kế một hệ thống nghiên cứu với dữ liệu tối giản, không chứa định danh.

**Ý nghĩa thực tiễn.** Hệ thống là học liệu tương tác có thể dùng trong giờ sinh hoạt hoặc ngoại khóa mà không cần thiết bị chuyên dụng. Nội dung kịch bản và checklist bám sát các hình thức lừa đảo và thao tác bảo mật phổ biến, có thể điều chỉnh cho các cơ sở khác. Nhà trường có thể dùng cùng quy trình đo lường để đánh giá chương trình của chính mình.

# CHƯƠNG 1. TỔNG QUAN TÀI LIỆU VÀ CƠ SỞ LÝ THUYẾT

## 1.1. Các khái niệm cơ bản

**An toàn thông tin** là việc bảo vệ tính bí mật, tính toàn vẹn và tính sẵn sàng của thông tin và hệ thống. Đề tài thu hẹp khái niệm vào hành vi cá nhân khi sử dụng thiết bị số: nhận diện lừa đảo, bảo vệ mã xác thực, quản lý mật khẩu và cấu hình quyền riêng tư.

**Lừa đảo trực tuyến** (phishing) là hành vi giả mạo một chủ thể đáng tin để dẫn người nhận đến việc cung cấp thông tin hoặc thực hiện một hành động. Đề tài phân loại bốn biến thể được đưa vào hệ thống: cuộc gọi hoặc tin nhắn mạo danh cơ quan và ngân hàng; yêu cầu đọc mã OTP; tin nhắn trúng thưởng kèm đường dẫn; trang web giả mạo qua tên miền hoặc đường dẫn.

**Cấu trúc tên miền.** Tên miền được đọc từ phải sang trái theo hệ thống phân cấp: đuôi miền ở cuối, phần gốc là tên do đơn vị đăng ký ngay trước đuôi, các nhãn còn lại là tên miền con. Phần gốc xác định chủ thể sở hữu địa chỉ; tên miền con và đường dẫn không xác định nguồn của trang. Đây là cơ sở kỹ thuật cho hoạt động nhận diện tên miền của hệ thống.

**Ẩn danh k-anonymity.** Một tập dữ liệu công bố đạt chuẩn k-anonymity khi mỗi bản ghi không thể phân biệt với ít nhất k − 1 bản ghi khác theo các thuộc tính có thể suy luận danh tính. Sweeney (2002) đề xuất mô hình này và chỉ ra rằng ẩn danh theo nhóm vẫn có thể bị tấn công tái định danh nếu không kèm chính sách kiểm soát. Đề tài áp dụng nguyên tắc tối thiểu hóa thuộc tính thay vì áp dụng k-anonymity hình thức, vì dữ liệu nghiên cứu không chứa thuộc tính định danh nào.

**Hành vi số** là các hành vi có thể quan sát khi sử dụng thiết bị và dịch vụ số. Đề tài đo hành vi bằng tự báo cáo về các thói quen cụ thể như bật xác thực hai lớp, bấm vào đường dẫn lạ và đọc mã xác thực cho người khác.

**Nhận thức và hành vi.** Nhận thức là hiểu biết về rủi ro và cách xử lý. Hành vi là việc thực hiện hay không thực hiện biện pháp bảo vệ. Đề tài xem nhận thức là điều kiện cần, không phải điều kiện đủ, để hành vi thay đổi; vì vậy hai biến được đo riêng.

**Quyền riêng tư theo thiết kế** (privacy by design) là nguyên tắc đưa yêu cầu bảo vệ dữ liệu vào ngay từ giai đoạn thiết kế, không bổ sung sau. Đề tài áp dụng nguyên tắc này ở các điểm được trình bày tại mục 2.5.

## 1.2. Cơ sở lý thuyết cho nghiên cứu hành vi và giáo dục trực tuyến

**Thiết kế đo lường tiền–hậu–theo dõi.** Đo lường trước can thiệp, sau can thiệp và theo dõi sau một khoảng thời gian là cách tiếp cận phổ biến để đánh giá hiệu quả và mức độ duy trì kết quả. Shadish, Cook và Campbell (2002) phân tích các đe dọa đối với suy luận nhân quả trong thiết kế không ngẫu nhiên, trong đó có trưởng thành tự nhiên, lịch sử và hiệu ứng của chính việc đo lường lặp lại. Các đe dọa này là giới hạn trực tiếp của thiết kế đề tài và được trình bày tại mục 3.5.

**Giáo dục nhận diện lừa đảo cho trẻ em.** Lastdrager và cộng sự (2017) đánh giá đào tạo nhận diện lừa đảo trên học sinh tiểu học. Theo tóm tắt công bố, nhóm tác giả ghi nhận mức cải thiện tổng thể khoảng 14% sau đào tạo; kết quả này không duy trì ở thời điểm bốn tuần sau can thiệp. Các tác giả kết luận rằng đào tạo có hiệu quả ngắn hạn, và trường học là môi trường thuận lợi để đào tạo trẻ em vì học sinh đến trường đều đặn. Kết luận này là căn cứ cho việc thiết kế đo lường theo dõi của đề tài.

**Học tập tương tác và phản hồi tức thì.** Hệ thống áp dụng nguyên tắc cung cấp giải thích cho từng lựa chọn và cho phép chọn lại sau khi sai. Ở hoạt động khảo sát, hệ thống không phản hồi đúng sai để tránh làm thay đổi kết quả đo của các giai đoạn sau. Hai thiết kế này có mục đích khác nhau: một cho học tập, một cho đo lường.

**Phương pháp kiểm định phi tham số.** Với mẫu nhỏ và dữ liệu thứ bậc hoặc phân phối không chuẩn, kiểm định Wilcoxon signed-rank cho dữ liệu lặp đo và kiểm định Friedman cho ba giai đoạn là lựa chọn thận trọng. Các kiểm định này không giả định phân phối chuẩn của hiệu số.

## 1.3. Tổng quan các giải pháp và tiêu chuẩn liên quan

**Tiêu chuẩn xác thực.** NIST (2025) ban hành SP 800-63B-4 về xác thực và quản lý bộ xác thực, thay thế phiên bản 2017. Tài liệu nêu các yêu cầu về mật khẩu, xác thực đa yếu tố và vòng đời bộ xác thực. Đề tài tham chiếu các nguyên tắc này để xây dựng nội dung về mật khẩu và xác thực hai lớp; đề tài không đánh giá hệ thống nào bằng tiêu chuẩn này.

**Rủi ro ứng dụng web.** OWASP (2021) xếp kiểm soát truy cập bị lỗi (Broken Access Control) ở vị trí đầu trong Top 10 rủi ro bảo mật ứng dụng web. Hệ thống áp dụng nguyên tắc từ chối mặc định cho các yêu cầu ghi, kiểm tra quyền ở phía máy chủ, và không dựa vào kiểm tra phía trình duyệt. Các kiểm thử bảo mật của dự án được thiết kế theo nguyên tắc này.

**Các giải pháp giáo dục hiện có.** Tài liệu hướng dẫn an toàn thông tin thường ở dạng tờ rơi, bài giảng hoặc video. Các dạng này ít có cơ chế đo lường trước và sau can thiệp, và hiếm khi tách đánh giá nhận thức khỏi đánh giá hành vi. Khoảng trống này là lý do đề tài tập trung vào thiết kế đo lường cùng với nội dung. Đề tài chưa tổng hợp đầy đủ các chương trình đã triển khai ở Việt Nam; đây là hạn chế về tổng quan tài liệu, được nêu tại mục 3.5.

**Kế thừa kiến trúc.** Hệ thống kế thừa cấu trúc tách biệt giữa giao diện và máy chủ từ một dự án web tiền thân. Trong quá trình kế thừa, đề tài loại bỏ các thành phần có rủi ro thiết kế đã được phân tích: đăng nhập dựa trên thông tin không được xác minh ở phía máy chủ, và lưu mật khẩu trong mã nguồn phía trình duyệt. Phân tích rủi ro này được ghi lại như bài học thiết kế.

# CHƯƠNG 2. PHƯƠNG PHÁP NGHIÊN CỨU

## 2.1. Thiết kế nghiên cứu

Nghiên cứu sử dụng thiết kế bán thực nghiệm, không ngẫu nhiên hóa, với một nhóm hoặc hai lớp học. Đo lường được thực hiện ở ba giai đoạn (Bảng 1). Cùng một bộ 16 câu hỏi được dùng ở cả ba giai đoạn để bảo đảm các điểm số có thể so sánh. Việc dùng chung bộ câu hỏi có thể làm tăng điểm do ghi nhớ; đây là hạn chế đã được ghi nhận và được xử lý bằng đề xuất bộ câu song song (mục 3.5).

**Bảng 1. Ba giai đoạn đo lường**

| Giai đoạn | Mã | Thời điểm | Điều kiện mở | Nội dung |
|---|---|---|---|---|
| Tiền kiểm | pre | Trước can thiệp | Đã kích hoạt thẻ | 16 câu: 10 kiến thức, 6 hành vi |
| Hậu kiểm | post | Sau khi hoàn thành ba hoạt động | Đã hoàn thành pre và ba hoạt động | Cùng bộ 16 câu |
| Theo dõi | delayed | 28 ngày sau hậu kiểm | Đã hoàn thành post và đủ 28 ngày | Cùng bộ 16 câu |

Trình tự mở khóa được bảo đảm ở cả giao diện và máy chủ (Hình 1). Máy chủ trả mã trạng thái 403 khi học sinh cố truy cập hoạt động trước khi hoàn thành khảo sát đầu vào, và từ chối khảo sát hậu kiểm khi chưa đủ điều kiện. Điều này bảo đảm mọi học sinh có dữ liệu đầu vào trước khi tham gia can thiệp.

![Hình 1. Trình tự mở khóa các giai đoạn khảo sát](hinh/hinh1_trinh_tu.png){width=80%}

## 2.2. Công cụ đo lường

### Cấu trúc bộ câu hỏi

Bộ câu hỏi gồm 16 câu, được lưu thành tệp có phiên bản (a-v1) và nạp từ tệp khi chạy.

- *Mười câu kiến thức* có một đáp án đúng, bao phủ ba nhóm nội dung: cuộc gọi và tin nhắn mạo danh; nhận diện tên miền và đường dẫn; mật khẩu và xác thực hai lớp. Đáp án không được gửi về trình duyệt trước khi học sinh trả lời.
- *Sáu câu hành vi* dùng thang bốn mức: không bao giờ, thỉnh thoảng, thường xuyên, luôn luôn. Ba câu được đánh dấu đảo chiều, gồm bấm đường dẫn lạ, đọc mã OTP cho người khác, và kiểm tra quyền riêng tư. Điểm hành vi được tính sau khi đảo chiều để mọi câu cùng hướng: giá trị cao phản ánh hành vi an toàn hơn.

**Biến số.**

**Bảng 2. Biến số nghiên cứu và cách đo**

| Biến | Loại | Cách đo | Đơn vị |
|---|---|---|---|
| Điểm kiến thức | Rời rạc | Số câu kiến thức đúng | 0–10 |
| Tỷ lệ kiến thức | Liên tục | Điểm kiến thức ÷ 10 × 100 | % |
| Điểm hành vi | Thứ bậc | Trung bình mức trả lời sau đảo chiều (điểm = 5 − mức với câu đảo) | 1–4 |
| Thời gian phản hồi | Liên tục | Từ khi hiển thị câu đến khi học sinh chọn | mili giây |
| Hoàn thành hoạt động | Nhị phân | Đạt điều kiện của từng hoạt động (mục 2.3) | 0 hoặc 1 |
| Sử dụng gợi ý | Nhị phân | Có mở chế độ đọc từ phải sang trái trước khi phân loại | 0 hoặc 1 |

Câu kiến thức ghi nhận đúng hoặc sai; câu hành vi ghi nhận mức trả lời. Hai loại được tách ở cấp cấu trúc dữ liệu để không lẫn trong phân tích.

**Độ tin cậy.** Hệ số tin cậy nội bộ của thang hành vi và chỉ số độ khó của từng câu kiến thức sẽ được tính sau thí điểm, vì hiện chưa có dữ liệu.

## 2.3. Hệ thống web tương tác

**Kiến trúc.** Hệ thống gồm giao diện web xây dựng bằng React 19 và TypeScript, và máy chủ API viết bằng PHP 8.1 trở lên với PDO MySQL (Hình 2). Giao diện và máy chủ giao tiếp qua HTTP trên đường dẫn `/api`. Nội dung kịch bản, câu hỏi và checklist được lưu trong tệp JSON có phiên bản, tách khỏi mã nguồn. Khi nạp, mỗi tệp nội dung được kiểm tra tính hợp lệ: đáp án nằm trong phạm vi, mỗi kịch bản có ít nhất một lựa chọn an toàn, và mọi tên miền thuộc danh sách được phép.

![Hình 2. Kiến trúc hệ thống](hinh/hinh2_kien_truc.png){width=85%}

**Bảng 3. Các hoạt động của hệ thống**

| Hoạt động | Nội dung | Ghi nhận | Phản hồi cho học sinh |
|---|---|---|---|
| Sân chơi tình huống | 5 kịch bản, mỗi kịch bản 4 lựa chọn | Mọi lần thử; điểm lấy từ lần đầu | Đúng hoặc sai, giải thích, dấu hiệu cảnh báo, cho chọn lại |
| Thám tử không gian mạng | 12 địa chỉ (5 chính thống, 7 giả mạo) | Mỗi địa chỉ một lần; cờ dùng gợi ý | Đúng hoặc sai, giải thích, kiểu đánh lừa |
| Phòng thí nghiệm tài khoản | Đánh giá mật khẩu và checklist 8 bước cho hai nền tảng | Mức đạt cao nhất; kết quả từng bước | Đánh giá cục bộ; câu kiểm tra có giải thích |

### Hoạt động 1. Sân chơi tình huống

Năm kịch bản mô phỏng: cuộc gọi tự xưng công an yêu cầu chuyển tiền vào tài khoản "an toàn"; yêu cầu đọc mã OTP với lý do xác minh; tin nhắn trúng thưởng có đường dẫn; tài khoản bạn bè nhờ chuyển tiền gấp; trang thanh toán dịch vụ công giả mạo. Học sinh chọn một cách xử lý. Thiết kế kịch bản tuân theo nguyên tắc: mỗi kịch bản có đúng các dấu hiệu nhận biết được liệt kê, và cách xử lý an toàn luôn là chuyển sang kênh đã biết trước, không tiếp tục trên kênh do đối phương mở.

### Hoạt động 2. Thám tử không gian mạng

Mười hai địa chỉ được phân loại là chính thống hoặc giả mạo (Bảng 4). Mỗi địa chỉ chỉ được phân loại một lần. Học sinh có thể mở chế độ đọc từ phải sang trái, trong đó các nhãn của tên miền được xếp từ phải sang trái và phần gốc được tô nổi bật. Các nút phân loại được đảo vị trí theo học sinh và mục, xác định bằng hàm băm của mã học sinh và mã mục; cách này ổn định khi tải lại trang và khác nhau giữa các học sinh, nhằm triệt tiêu thiên lệch vị trí nút mà không làm thay đổi đáp án.

**Bảng 4. Kiểu đánh lừa trong hoạt động nhận diện tên miền**

| Kiểu | Mô tả | Cách nhận diện |
|---|---|---|
| Thay ký tự | Một chữ cái bị thay bằng chữ số hoặc chữ cái gần giống | So từng ký tự của phần gốc với tên chính thức |
| Tên chính làm tên miền con | Tên đúng đứng giữa địa chỉ, phần gốc là tên khác | Đọc từ phải sang trái để tìm phần gốc |
| Đổi đuôi | Đuôi miền bị thay đổi | Đuôi không quyết định tính chính thống |
| Thêm từ | Thêm một từ như "đăng nhập" vào tên đúng | Phần gốc đã đổi |
| Tên chính trong đường dẫn | Tên đúng chỉ nằm sau dấu gạch chéo | Đường dẫn không quyết định nguồn trang |

Tất cả tên miền trong nội dung là tên hư cấu, dùng đuôi `.test`, `.example` hoặc `.io.vn` kèm dấu hiệu hư cấu trong tên gốc. Lớp kiểm tra nội dung từ chối tên miền thật khi nạp, nên không thể đưa địa chỉ thật vào học liệu do sai sót biên soạn.

### Hoạt động 3. Phòng thí nghiệm tài khoản

Gồm hai phần.

- *Đánh giá mật khẩu.* Học sinh nhập mật khẩu mẫu. Hệ thống tính entropy lý thuyết theo công thức độ dài × log₂(kích thước bảng ký tự), sau đó trừ điểm theo mẫu dễ đoán: chuỗi liên tiếp, ký tự lặp, dãy phím, năm sinh, và mật khẩu có trong danh sách mẫu. Thời gian bẻ khóa được ước lượng theo hai giả định tốc độ đoán, 10¹⁰ lần mỗi giây cho băm nhanh ngoại tuyến và 10³ lần mỗi giây cho trực tuyến có giới hạn. Các giá trị này là minh họa cho khái niệm, không phải số đo thực tế. Toàn bộ tính toán chạy trên trình duyệt.
- *Checklist quyền riêng tư.* Tám bước cho hai nền tảng nhắn tin và mạng xã hội. Mỗi bước có hướng dẫn, lý do, câu kiểm tra và ô xác nhận đã thực hành trên điện thoại. Nội dung ghi rõ tên mục trong menu có thể khác theo phiên bản ứng dụng.

## 2.4. Quy trình thực hiện

Quy trình gồm sáu bước. Giáo viên hướng dẫn trình tự và không tiếp cận dữ liệu của học sinh.

1. **Chuẩn bị.** Nhà trường thống nhất triển khai theo quy định của cơ sở. Nhóm nghiên cứu tạo lớp, in lô thẻ mã (mỗi thẻ một mã ngẫu nhiên, không ghi tên) và cấp tài khoản giáo viên. Giáo viên nhận thẻ và tài khoản của lớp mình.
2. **Kích hoạt thẻ.** Học sinh nhập mã trên thẻ, đọc phiếu đồng ý và tích đồng ý. Mỗi thẻ chỉ kích hoạt một lần. Mã không chứa họ tên, và học sinh không tự tạo mã.
3. **Khảo sát đầu vào.** Học sinh làm 16 câu, không có phản hồi đúng sai.
4. **Can thiệp.** Học sinh thực hiện ba hoạt động theo thứ tự tùy chọn.
5. **Hậu kiểm.** Sau khi hoàn thành ba hoạt động, học sinh làm lại 16 câu.
6. **Theo dõi.** Sau 28 ngày, khảo sát theo dõi mở và học sinh làm lại 16 câu.

Học sinh đăng nhập lại bằng mã trên thẻ; mã này là cách duy nhất để tiếp tục phiên làm việc. Học sinh làm mất thẻ đã kích hoạt được cấp thẻ mới với tiến độ được giữ nguyên, do giáo viên thực hiện đối chiếu sổ phát thẻ; việc này được ghi nhận trong dữ liệu (số lần cấp lại). Giáo viên xem được tiến độ lớp mình qua tài khoản được cấp, tự tạo thẻ mới cho lớp (có giới hạn số thẻ), nhưng không xem được câu trả lời. Nhóm kỹ thuật quản lý toàn bộ tài khoản giáo viên (thêm, sửa, khóa, khôi phục, xóa, đặt lại mật khẩu).

![Hình 3. Luồng dữ liệu và ranh giới quyền riêng tư](hinh/hinh3_quyen_rieng_tu.png){width=85%}

## 2.5. Quyền riêng tư theo thiết kế và đạo đức nghiên cứu

Thiết kế áp dụng sáu nguyên tắc sau, tương ứng với các điểm kiểm soát trong mã nguồn.

1. **Tối thiểu hóa dữ liệu.** Hệ thống không thu họ tên, email, số điện thoại, ảnh hay thông tin cá nhân khác. Thời điểm đồng ý và phiên bản phiếu được lưu trong CSDL để kiểm soát phiên bản, nhưng không xuất ra tệp nghiên cứu.
2. **Định danh giả.** Mã học sinh do hệ thống cấp ngẫu nhiên từ bảng ký tự 32 ký tự, loại bỏ các ký tự dễ nhầm lẫn; không gian mã khoảng 40 bit. Mã được kiểm tra trùng khi cấp và được in trên thẻ không ghi tên. Mã là định danh nghiên cứu, không phải mật khẩu.

**Ranh giới của tính ẩn danh.** Giáo viên phát thẻ trực tiếp nên có thể biết thẻ nào thuộc học sinh nào. Vì vậy dữ liệu ẩn danh đối với nhóm nghiên cứu và đối với tệp xuất, nhưng không ẩn danh đối với giáo viên phụ trách lớp. Ranh giới này được nêu trong phiếu đồng ý và được quản lý bằng sổ phát thẻ bảo quản riêng.
3. **Băm phiên đăng nhập.** Cơ sở dữ liệu chỉ lưu băm SHA-256 của token phiên. Đăng nhập lại làm vô hiệu token cũ.
4. **Mật khẩu không rời trình duyệt.** Máy chủ từ chối mọi yêu cầu có trường mật khẩu và chỉ nhận mức đánh giá tổng hợp (yếu, trung bình, mạnh).
5. **Không dùng dịch vụ bên ngoài để kiểm tra mật khẩu.** Tích hợp kiểm tra mật khẩu bị rò rỉ theo mô hình k-anonymity của một dịch vụ bên ngoài không được sử dụng trong hệ thống, vì ngay cả tiền tố băm cũng gắn với mật khẩu của học sinh.
6. **Tự nguyện và rút lui.** Phiếu đồng ý nêu rõ quyền dừng bất cứ lúc nào. Yêu cầu kích hoạt thẻ bị từ chối nếu phiên bản phiếu không khớp, và học sinh không thể kích hoạt lại một thẻ đã dùng.

### Đạo đức nghiên cứu

Đề tài cần được cơ sở giáo dục phê duyệt và có đồng ý của phụ huynh hoặc người giám hộ trước khi triển khai. Dữ liệu được lưu trữ an toàn, chỉ dùng cho mục đích nghiên cứu, và được xóa theo quy định khi kết thúc.

### Ẩn danh khi công bố

Khi kết quả được tổng hợp theo lớp, lớp có số học sinh quá ít có thể làm lộ danh tính. Quy tắc công bố: không công bố thống kê theo lớp khi số học sinh dưới 5. Quy tắc này hiện được thực hiện thủ công khi báo cáo, chưa được tự động hóa trong công cụ xuất dữ liệu.

## 2.6. Phương pháp phân tích dữ liệu

Kế hoạch phân tích được xác định trước khi thu dữ liệu, nhằm hạn chế lựa chọn kiểm định sau khi xem kết quả.

- **Mô tả.** Trung vị, khoảng tứ phân vị và tỷ lệ cho từng giai đoạn; số học sinh bỏ dở ở từng giai đoạn được báo cáo riêng.
- **So sánh trước–sau.** Kiểm định Wilcoxon signed-rank cho điểm kiến thức (H1) và điểm hành vi đã điều chỉnh (H3), với mức ý nghĩa α = 0,05.
- **So sánh ba giai đoạn.** Kiểm định Friedman cho điểm kiến thức ở cả ba giai đoạn, khi có dữ liệu đầy đủ; cặp trước–theo dõi được kiểm định bằng Wilcoxon (H2).
- **Kích thước hiệu ứng.** r = Z / √N cho kiểm định Wilcoxon, báo cáo cùng khoảng tin cậy khi có thể.
- **Liên hệ.** Hệ số tương quan Spearman giữa thời gian phản hồi, cờ dùng gợi ý và độ chính xác (H4). Kết quả chỉ được diễn giải như tương quan, không suy ra nhân quả.
- **Dữ liệu thiếu.** Không thay thế bằng giá trị ước lượng. Phân tích được thực hiện trên các cặp dữ liệu đầy đủ, và số lượng cặp được báo cáo.

# CHƯƠNG 3. KẾT QUẢ VÀ THẢO LUẬN

## 3.1. Sản phẩm và kết quả kiểm chứng kỹ thuật

Hệ thống đã hoàn thành các thành phần chức năng: kích hoạt thẻ mã và xác thực bằng mã, tài khoản giáo viên xem tiến độ lớp, ba hoạt động, khảo sát ba giai đoạn với trình tự mở khóa, và xuất dữ liệu. Các kết quả dưới đây là kiểm chứng kỹ thuật, không phải kết quả nghiên cứu.

**Bảng 5. Kết quả kiểm chứng kỹ thuật**

| Loại kiểm thử | Phạm vi | Kết quả |
|---|---|---|
| Tích hợp API | Kích hoạt thẻ, xác thực, tài khoản giáo viên, ba hoạt động, khảo sát, khóa trình tự, xuất dữ liệu, bảo mật | 183 kiểm tra, đạt toàn bộ |
| Đơn vị | Bộ đánh giá mật khẩu | 14 kiểm thử, đạt toàn bộ |
| Biên dịch và đóng gói giao diện | Kiểm tra kiểu nghiêm ngặt, đóng gói | Đạt |
| Luồng người dùng qua máy chủ trung gian | Từ kích hoạt thẻ đến khảo sát theo dõi | 23 bước, đạt toàn bộ |
| Trình duyệt | Luồng học sinh, khóa hoạt động, bố cục điện thoại và máy tính | Đạt |

Kiểm thử bảo mật xác nhận các hành vi sau: yêu cầu ghi từ nguồn không được phép bị từ chối; yêu cầu không đúng định dạng JSON bị từ chối; truy cập khi chưa đăng nhập bị từ chối; đáp án đúng không xuất hiện trong phản hồi khảo sát; và mật khẩu thử nghiệm không xuất hiện trong bất kỳ yêu cầu gửi đi nào. Các kiểm thử được chạy trong quá trình phát triển và cần chạy lại trước khi nộp.

## 3.2. Cấu trúc dữ liệu, codebook và định dạng xuất

### Cấu trúc cơ sở dữ liệu

Bốn bảng chính được mô tả trong Bảng 6.

**Bảng 6. Cấu trúc các bảng dữ liệu chính**

| Bảng | Trường chính | Mục đích |
|---|---|---|
| classes | Mã lớp, tên lớp, tên cơ sở, thời điểm tạo | Danh sách lớp tham gia |
| participants | Mã học sinh, mã lớp, trạng thái thẻ (đã phát hoặc đã kích hoạt), băm token phiên, phiên bản phiếu, thời điểm kích hoạt | Định danh giả và kiểm soát phiên |
| teachers | Tên đăng nhập, băm mật khẩu, lớp được gán, băm token phiên | Tài khoản giáo viên, chỉ xem tiến độ lớp được gán |
| module_events | Mã học sinh, hoạt động, mã mục, số lần thử, lựa chọn, đúng hoặc sai, thời gian phản hồi, cờ gợi ý, phiên bản nội dung | Nhật ký ba hoạt động |
| assessments_self | Mã học sinh, giai đoạn, mã câu, đáp án hoặc mức, đúng hoặc sai, thời gian phản hồi, phiên bản | Kết quả khảo sát ba giai đoạn |

Ràng buộc duy nhất trên `assessments_self` theo bộ ba (học sinh, giai đoạn, mã câu) bảo đảm mỗi câu chỉ được trả lời một lần trong một giai đoạn. Cột `is_safe` trong `module_events` mang nghĩa phân loại đúng (hoặc đạt yêu cầu) đối với các hoạt động.

### Codebook

Tài liệu mã hóa mô tả từng cột, từng câu hỏi, cách tính biến và cách xuất. Bảng câu hỏi trong codebook được sinh tự động từ tệp nội dung nguồn, nên không có khác biệt giữa câu hỏi trên hệ thống và tài liệu.

### Định dạng dài

Mỗi dòng là một lần trả lời khảo sát, gồm: mã học sinh, mã lớp, giai đoạn, mã câu, loại câu, đúng hoặc sai, chỉ số lựa chọn, mức hành vi, thời gian phản hồi, phiên bản nội dung và thời điểm trả lời. Định dạng này phục vụ phân tích từng câu.

### Định dạng rộng

Mỗi dòng là một học sinh, gồm: mã học sinh, mã lớp, số câu kiến thức đúng, tỷ lệ phần trăm, điểm hành vi đã điều chỉnh, thời gian phản hồi trung bình cho từng giai đoạn, và số hoạt động đã hoàn thành. Định dạng này phục vụ phân tích lặp đo.

Cả hai định dạng có mã hóa UTF-8 kèm BOM để tương thích với phần mềm bảng tính, và không chứa họ tên, email, số điện thoại, thời điểm đồng ý hay nội dung mật khẩu. Tên cột được kiểm tra tự động trong bộ kiểm thử.

**Ví dụ cấu trúc hàng dữ liệu (dạng minh họa, mã giả danh mẫu).**

| Trường | Ví dụ | Ghi chú |
|---|---|---|
| Mã học sinh | XXXX-XXXX | Do hệ thống cấp |
| Giai đoạn | pre | Một trong pre, post, delayed |
| Mã câu | k01 | Câu kiến thức |
| is_correct | 1 | 1 đúng, 0 sai |
| response_ms | 4300 | Mili giây |

## 3.3. Khung ghi kết quả thực nghiệm

**Bảng 7. Giả thuyết, phép kiểm định và điều kiện kết luận**

| Giả thuyết | Phép so sánh | Tiêu chí | Điều kiện để kết luận |
|---|---|---|---|
| H1 | Điểm kiến thức pre so với post | Wilcoxon, p < 0,05 | Có đủ cặp dữ liệu hai giai đoạn |
| H2 | Điểm kiến thức pre so với delayed | Wilcoxon, p < 0,05 | Tỷ lệ bỏ dở ở delayed được báo cáo |
| H3 | Điểm hành vi pre so với post | Wilcoxon sau điều chỉnh đảo chiều | Độ tin cậy của thang hành vi được báo cáo |
| H4 | Độ chính xác theo cờ gợi ý | Mann-Whitney hoặc Spearman | Diễn giải như tương quan |

Bảng dưới đây là khung để ghi kết quả khi có dữ liệu. Các ô để trống vì nghiên cứu chưa thu thập dữ liệu thực nghiệm; không điền giá trị giả định.

**Bảng 8. Khung ghi kết quả thực nghiệm (chưa có dữ liệu)**

| Chỉ số | Trước can thiệp (pre) | Sau can thiệp (post) | Theo dõi (delayed) | Kiểm định | p | r |
|---|---|---|---|---|---|---|
| Điểm kiến thức, trung vị [IQR] | | | | Wilcoxon / Friedman | | |
| Điểm hành vi đã điều chỉnh, trung vị [IQR] | | | | Wilcoxon | | |
| Thời gian phản hồi trung bình (ms) | | | | Mô tả | — | — |
| Số học sinh có đầy đủ dữ liệu | | | | — | — | — |

## 3.4. Thảo luận

**Về khả năng đáp ứng mục tiêu.** Thiết kế đáp ứng các mục tiêu 1, 2, 3 và 4 ở mức kỹ thuật: hệ thống được xây dựng, công cụ đo được tách biến, trình tự đo được kiểm soát, và dữ liệu được ẩn danh. Mục tiêu 5 đã có khung phân tích cụ thể. Mục tiêu đánh giá hiệu quả can thiệp chưa thể kết luận vì chưa có dữ liệu.

**Về việc diễn giải giả thuyết.** Mỗi giả thuyết có một hướng diễn giải được xác định trước:

- Nếu H1 và H2 được xác nhận, can thiệp có hiệu quả ngắn hạn và được duy trì trong khoảng theo dõi.
- Nếu H1 được xác nhận nhưng H2 không, kết quả phù hợp với nhận định về sự suy giảm sau can thiệp đã ghi nhận ở nghiên cứu trẻ em (Lastdrager và cộng sự, 2017).
- Nếu H1 không được xác nhận, cần xem xét hiệu ứng trần khi học sinh đã biết trước nội dung, và hiệu ứng luyện tập do dùng chung bộ câu hỏi.
- Nếu H3 không được xác nhận, cần xem xét giới hạn của tự báo cáo, vì học sinh có thể trả lời theo mong muốn xã hội.

**Về thiết kế đo lường.** Tách biến nhận thức và hành vi cho phép xác định trường hợp nhận thức thay đổi trong khi hành vi không thay đổi, và ngược lại. Đây là điểm mạnh về mặt diễn giải. Tuy nhiên, cùng một bộ câu hỏi cho ba giai đoạn làm giảm khả năng tách hiệu quả can thiệp khỏi hiệu ứng ghi nhớ.

**Về hệ thống.** Việc khóa trình tự bảo đảm mọi học sinh có dữ liệu đầu vào, nhưng cũng làm học sinh phải hoàn thành khảo sát trước khi bắt đầu hoạt động học tập. Trong triển khai, cần giải thích rõ lý do để học sinh không xem đây là rào cản.

**Về quyền riêng tư.** Thiết kế cho thấy có thể đo lường có cấu trúc mà không thu thập thông tin định danh. Việc giữ mật khẩu thử nghiệm trên trình duyệt có chi phí về kiến trúc, đổi lại loại bỏ rủi ro lớn nhất liên quan đến dữ liệu nhạy cảm.

**Về nội dung.** Nội dung được xây dựng từ các hình thức lừa đảo phổ biến và có cấu trúc kiểm tra rõ ràng. Tuy nhiên, nội dung chưa được hội đồng chuyên gia thẩm định, và đây là điều kiện cần hoàn thành trước khi thu dữ liệu chính thức.

## 3.5. Giới hạn của nghiên cứu

**Bảng 9. Giới hạn của nghiên cứu và biện pháp khắc phục**

| Mã | Giới hạn | Tác động | Biện pháp |
|---|---|---|---|
| G1 | Cùng một bộ câu hỏi cho ba giai đoạn | Điểm có thể tăng do ghi nhớ | Xây dựng bộ câu song song cho hậu kiểm và theo dõi |
| G2 | Nội dung chưa được chuyên gia thẩm định | Có thể không đo đúng khái niệm | Thẩm định trước khi thu dữ liệu chính thức |
| G3 | Độ tin cậy thang hành vi chưa được tính | Điểm hành vi có thể không ổn định | Thí điểm; tính hệ số tin cậy nội bộ |
| G4 | Hành vi là tự báo cáo | Sai lệch do mong muốn xã hội | Ghi nhận là hạn chế; cân nhắc đo khách quan ở nghiên cứu sau |
| G5 | Không có nhóm đối chứng ngẫu nhiên | Không quy kết hoàn toàn thay đổi cho can thiệp | Diễn giải thận trọng; cân nhắc nhóm đối chứng ở nghiên cứu sau |
| G6 | Ngưỡng quy mô khi công bố theo lớp chưa được tự động hóa | Nguy cơ suy luận danh tính | Kiểm tra thủ công trước khi công bố |
| G7 | Hệ thống chưa tự nhắc khảo sát theo dõi | Tỷ lệ quay lại có thể thấp | Giáo viên lên lịch nhắc; cân nhắc thông báo trong ứng dụng |
| G8 | Đăng nhập bằng mã chưa giới hạn tần suất | Mã có thể bị thử nhiều lần | Bổ sung giới hạn theo địa chỉ mạng trước khi triển khai rộng |
| G9 | Tên mục menu ứng dụng mạng xã hội thay đổi theo phiên bản | Hướng dẫn có thể lỗi thời | Đối chiếu với ứng dụng thực tế trước khi dùng |
| G10 | Chưa kiểm thử trên máy chủ lưu trữ thực tế | Chưa xác nhận hiệu năng triển khai | Kiểm thử trên máy chủ thực tế trước khi thu dữ liệu |
| G11 | Chưa có giao diện quản trị cho giáo viên | Phụ thuộc nhóm nghiên cứu để quản lý lớp | Phát triển giao diện quản trị đơn giản ở giai đoạn sau |
| G12 | Quy mô mẫu nhỏ | Độ mạnh thống kê hạn chế | Báo cáo kích thước hiệu ứng và khoảng tin cậy; không khái quát hóa |
| G13 | Giáo viên phát thẻ nên biết danh tính gắn với mã | Ẩn danh không đầy đủ đối với giáo viên | Quản lý sổ phát thẻ riêng; nêu trong phiếu đồng ý; hội đồng đạo đức phê duyệt |

Tổng quan tài liệu còn hạn chế về các chương trình giáo dục an toàn thông tin đã triển khai tại Việt Nam, và chưa có đánh giá về mức độ phổ biến của từng hình thức lừa đảo đối với học sinh. Hai điểm này cần được bổ sung khi có điều kiện tra cứu đầy đủ.

# KẾT LUẬN VÀ KHUYẾN NGHỊ

## Kết luận

Đề tài đã thiết kế và xây dựng một hệ thống web tương tác gồm ba hoạt động về an toàn thông tin cho học sinh trung học cơ sở, kèm theo mô hình đo lường tiền–hậu–theo dõi, cơ chế kiểm soát trình tự và công cụ xuất dữ liệu ẩn danh. Hệ thống đạt toàn bộ các kiểm thử kỹ thuật đã thực hiện.

Đề tài có ba đóng góp:

1. Một hệ thống có thể tái sử dụng, trong đó nội dung tách khỏi mã nguồn và được kiểm tra tự động trước khi sử dụng.
2. Một thiết kế đo lường tách biến nhận thức và hành vi, có ghi nhận thời gian phản hồi ở mức từng câu và có codebook đầy đủ.
3. Một mô hình quyền riêng tư theo thiết kế cho nghiên cứu có đối tượng là học sinh, trong đó mật khẩu không rời thiết bị và dữ liệu xuất không chứa định danh.

Đề tài chưa khẳng định hiệu quả của can thiệp. Mọi kết luận về hiệu quả phải chờ dữ liệu thu thập và phân tích theo kế hoạch đã nêu ở mục 2.6.

## Khuyến nghị

**Đối với nhà trường.** Đưa hoạt động vào giờ sinh hoạt hoặc ngoại khóa, có giáo viên hướng dẫn. Phân công một người làm đầu mối với nhóm nghiên cứu để quản lý mã lớp và nhắc khảo sát theo dõi.

**Đối với nhóm nghiên cứu.**

- Thẩm định nội dung bởi hội đồng chuyên gia trước khi thu dữ liệu chính thức.
- Thí điểm để tính độ tin cậy của thang hành vi và chỉ số độ khó của từng câu.
- Xây dựng bộ câu song song để kiểm soát hiệu ứng luyện tập ở hậu kiểm và theo dõi.
- Bổ sung kiểm tra ngưỡng quy mô tự động khi xuất dữ liệu theo lớp, và giới hạn tần suất đăng nhập bằng mã.
- Kiểm thử trên máy chủ thực tế trước khi thu dữ liệu.

**Hướng phát triển.**

1. Mở rộng nội dung sang các nền tảng và hình thức lừa đảo mới khi có số liệu về mức độ phổ biến.
2. Phát triển giao diện quản trị cho giáo viên, chỉ hiển thị tiến độ theo giai đoạn, không hiển thị dữ liệu cá nhân.
3. Thiết kế nghiên cứu có nhóm đối chứng ngẫu nhiên hóa ở cấp lớp để tăng khả năng suy luận nhân quả.
4. Nghiên cứu theo dõi dài hơn để đánh giá mức độ duy trì kết quả.

# TÀI LIỆU THAM KHẢO

Lastdrager, E., Gallardo, I. C., Hartel, P. H., & Junger, M. (2017). How effective is anti-phishing training for children? In *Proceedings of the Thirteenth Symposium on Usable Privacy and Security (SOUPS 2017)*. USENIX Association. https://www.usenix.org/conference/soups2017/technical-sessions/presentation/lastdrager

National Institute of Standards and Technology. (2025). *Digital identity guidelines: Authentication and authenticator management* (NIST Special Publication 800-63B-4). U.S. Department of Commerce. https://csrc.nist.gov/pubs/sp/800/63/B/4/final

OWASP Foundation. (2021). *OWASP Top 10:2021*. https://owasp.org/Top10/2021/

Pháp luật TP.HCM. (2024). *Tháng 8, cả nước có 815 vụ lừa đảo chiếm đoạt tài sản, đa phần là trên không gian mạng*. https://plo.vn/thang-8-ca-nuoc-co-815-vu-lua-dao-chiem-doat-tai-san-da-phan-la-tren-khong-gian-mang-post808991.html

Shadish, W. R., Cook, T. D., & Campbell, D. T. (2002). *Experimental and quasi-experimental designs for generalized causal inference*. Houghton Mifflin.

Sweeney, L. (2002). k-anonymity: A model for protecting privacy. *International Journal on Uncertainty, Fuzziness and Knowledge-Based Systems, 10*(5), 557–570. https://doi.org/10.1142/S0218488502001648

# PHỤ LỤC

## Phụ lục A. Bộ câu hỏi khảo sát (phiên bản a-v1)

**Phần kiến thức (10 câu, một đáp án đúng).**

1. Em nhận tin nhắn: "Tài khoản ngân hàng của bạn bị khóa, bấm link để mở lại". Em nên làm gì? Đáp án: không bấm link; gọi số trên thẻ hoặc mở ứng dụng ngân hàng để kiểm tra.
2. Một người gọi tự nhận là shipper và yêu cầu đọc mã OTP để "xác nhận nhận hàng". Em nên làm gì? Đáp án: không đọc mã.
3. Ai trong các trường hợp sau có thể yêu cầu em cung cấp mật khẩu đăng nhập ngân hàng? Đáp án: không ai có quyền yêu cầu.
4. Khi dùng Wi-Fi công cộng không có mật khẩu, điều gì nên tránh? Đáp án: đăng nhập tài khoản ngân hàng hoặc nhập mật khẩu quan trọng.
5. Địa chỉ `https://uubnd-mophong.io.vn.tra-cuu.test/` có phần gốc là gì? Đáp án: `tra-cuu.test`.
6. Tên miền `uubnd-m0phong.io.vn` khác `uubnd-mophong.io.vn` ở điểm nào? Đáp án: chữ o bị thay bằng số 0.
7. Trang web có tên chính thức nằm trong đường dẫn, còn tên miền thật là tên khác. Trang này có đáng tin không? Đáp án: không đáng tin.
8. Trong ba mật khẩu sau, mật khẩu nào khó đoán nhất? Đáp án: mật khẩu có nhiều loại ký tự và đủ dài.
9. Dùng cùng một mật khẩu cho nhiều tài khoản có rủi ro gì? Đáp án: một trang bị lộ có thể làm lộ các tài khoản khác.
10. Xác thực hai lớp giúp bảo vệ tài khoản như thế nào? Đáp án: cần thêm một bước xác nhận ngoài mật khẩu.

**Phần hành vi (6 câu, thang bốn mức: không bao giờ, thỉnh thoảng, thường xuyên, luôn luôn).**

11. Em có bật xác thực hai lớp cho tài khoản mạng xã hội hoặc ứng dụng nhắn tin không?
12. Em có dùng mật khẩu khác nhau cho các tài khoản quan trọng không?
13. Khi nhận tin nhắn có đường dẫn lạ, em có bấm vào xem không? *(Câu đảo chiều.)*
14. Em có đọc mã OTP cho người khác qua điện thoại không? *(Câu đảo chiều.)*
15. Em có kiểm tra cài đặt quyền riêng tư của tài khoản mạng xã hội không?
16. Khi người quen nhờ chuyển tiền qua mạng, em có gọi điện xác minh trước không?

## Phụ lục B. Mã hóa biến và quy ước xuất dữ liệu

**Bảng B1. Biến trong định dạng dài**

| Biến | Mã hóa |
|---|---|
| phase | pre, post, delayed |
| instrument | knowledge, behavior |
| is_correct | 1 đúng, 0 sai; để trống với câu hành vi |
| answer_index | Chỉ số lựa chọn, bắt đầu từ 0 (câu kiến thức) |
| answer_value | Mức 1 đến 4 (câu hành vi) |
| response_ms | Thời gian phản hồi, mili giây |

**Bảng B2. Biến trong định dạng rộng**

| Biến | Cách tính |
|---|---|
| {giai đoạn}_knowledge_correct | Số câu kiến thức đúng, từ 0 đến 10 |
| {giai đoạn}_knowledge_pct | Số câu đúng ÷ 10 × 100 |
| {giai đoạn}_behavior_mean_adj | Trung bình mức hành vi sau điều chỉnh đảo chiều |
| {giai đoạn}_mean_response_ms | Trung bình thời gian phản hồi của giai đoạn |
| m1_items_answered | Số tình huống đã trả lời, tối đa 5 |
| m2_items_answered | Số địa chỉ đã phân loại, tối đa 12 |
| m3_steps_passed | Số bước checklist đạt, tối đa 8 |
| m3_lab_passed | 1 nếu đạt mức mạnh trong phòng thí nghiệm, 0 nếu không |

## Phụ lục C. Trích đoạn mã minh họa

**Trích đoạn 1. Kiểm tra nguồn yêu cầu ghi (rút gọn).** Lớp bảo mật chỉ chấp nhận yêu cầu ghi có nguồn thuộc danh sách cho phép và có kiểu nội dung JSON.

```php
public static function guard(Request $request): void
{
    if (!in_array($request->method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        return;
    }
    $origin = $request->header('origin');
    if ($origin !== null && !in_array(rtrim($origin, '/'), self::allowedOrigins($request), true)) {
        throw new HttpException(403, 'Nguồn yêu cầu không được phép (Origin).');
    }
    $contentType = strtolower((string) $request->header('content-type'));
    if (!str_starts_with($contentType, 'application/json')) {
        throw new HttpException(415, 'Yêu cầu ghi phải dùng Content-Type: application/json.');
    }
}
```

**Trích đoạn 2. Mở khóa khảo sát theo dõi (rút gọn).** Giai đoạn theo dõi chỉ mở khi đã hoàn thành hậu kiểm và đã qua số ngày cấu hình.

```php
if ($phase === 'delayed') {
    $availableAt = $postDoneAt?->modify('+' . self::delayedDays() . ' days');
    $now = new DateTimeImmutable('now');
    if ($availableAt === null || $now < $availableAt) {
        return $base + ['status' => 'locked', 'available_at' => $availableAt?->format('Y-m-d H:i:s')];
    }
}
```

**Trích đoạn 3. Đánh giá entropy mật khẩu (rút gọn).** Hàm chạy trên trình duyệt, không gọi mạng và không lưu trữ.

```typescript
export function analyzePassword(password: string): PasswordAnalysis {
  const rawEntropyBits = password.length * Math.log2(poolSizeOf(password));
  let penalty = 0;
  if (longestSequence(password) >= 4) penalty += 10;
  if (longestRepeat(password) >= 3) penalty += Math.min(24, (longestRepeat(password) - 2) * 4);
  // Kiểm tra thêm: mật khẩu phổ biến, dãy phím, năm sinh
  const effective = Math.max(0, rawEntropyBits - penalty);
  return { /* ... */ effectiveEntropyBits: effective };
}
```

## Phụ lục D. Danh mục tệp nội dung và tài liệu kỹ thuật

| Tệp | Nội dung |
|---|---|
| api/content/assessment_items.json | Bộ câu hỏi khảo sát (a-v1) |
| api/content/module1_scenarios.json | Năm kịch bản (m1-v1) |
| api/content/module2_domains.json | Mười hai địa chỉ (m2-v2) |
| api/content/module3_checklist.json | Checklist tám bước (m3-v1) |
| api/database/schema.sql | Lược đồ cơ sở dữ liệu |
| docs/CODEBOOK_NGHIEN_CUU.md | Mã hóa dữ liệu và bộ câu hỏi |
| docs/TRIEN_KHAI_INET.md | Hướng dẫn triển khai |
| docs/CHAY_CUC_BO.md | Hướng dẫn chạy cục bộ |
