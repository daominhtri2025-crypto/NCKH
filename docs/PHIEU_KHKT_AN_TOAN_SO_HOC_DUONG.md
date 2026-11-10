# Bộ biểu mẫu hồ sơ dự thi: An Toàn Số Học Đường

*Lập theo Phụ lục II (Các biểu mẫu hồ sơ Cuộc thi KHKT cấp phường, năm học 2026–2027). Tệp này là bản điền nháp để nhóm rà soát; các mục ghi [Cần bổ sung] phải được người hướng dẫn và nhà trường xác nhận trước khi nộp.*

> **Ghi chú cho người điền**
> - **Dữ liệu thực tế (từ mã nguồn và báo cáo):** số kịch bản, tên miền, bước checklist, số câu khảo sát, số kiểm thử tự động, trạng thái dữ liệu (chưa thu thập).
> - **Suy luận và dự kiến:** kết quả mong đợi, kế hoạch thời gian, đánh giá rủi ro. Các nội dung này cần được nhà trường thẩm định.
> - **Hai điểm khác biệt cần xác nhận trước khi nộp:** (1) Phụ lục II ghi "cấp phường", trong khi Công văn 6068/SGDĐT-GDTrH&HSSV ghi "cấp thành phố" và có biểu mẫu khác (Phụ lục 1–8). Cần xác nhận cuộc thi áp dụng. (2) Mẫu 02 yêu cầu ghi họ tên học sinh và trường, nhưng Công văn cấp thành phố cấm ghi các thông tin này trong báo cáo tóm tắt. Bản này để trống ở Mẫu 02 theo nguyên tắc ẩn danh.

---

## MẪU 01. KẾ HOẠCH NGHIÊN CỨU VÀ PHÊ DUYỆT CỦA NHÀ TRƯỜNG

*(Lập, phê duyệt trước khi nghiên cứu; lưu tại cơ sở giáo dục)*

### I. THÔNG TIN DỰ ÁN

1. **Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở
2. **Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục
3. **Học sinh thực hiện:**

| Họ và tên | Lớp | Nhiệm vụ dự kiến trong dự án |
|---|---|---|
| Trần Cảnh Phúc | 9/1 | [Cần bổ sung] |
| Cù Hoàng Linh Trúc | 9/1 | [Cần bổ sung] |

4. **Trường THCS:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng
5. **Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh. Chức vụ/chuyên môn: [Cần bổ sung]
6. **Chuyên gia hỗ trợ chuyên môn:** [Cần bổ sung nếu có. Bắt buộc có ý kiến chuyên gia nếu nhà trường đánh giá dự án có yếu tố rủi ro, xem mục II.5]
7. **Địa điểm nghiên cứu:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng
8. **Thời gian dự kiến:** [Cần bổ sung]. Gồm đo lường trước can thiệp, can thiệp, hậu kiểm và theo dõi sau 28 ngày. Thời điểm bắt đầu phải sau khi kế hoạch được phê duyệt.

### II. NỘI DUNG KẾ HOẠCH NGHIÊN CỨU

**1. Vấn đề nghiên cứu, mục tiêu và kết quả dự kiến**

*Vấn đề.* Học sinh trung học cơ sở sử dụng điện thoại và mạng xã hội thường xuyên, nhưng thường thiếu kiến thức có hệ thống để nhận diện lừa đảo qua tin nhắn, cuộc gọi, đường link và tên miền giả mạo, cũng như cách bảo vệ mã xác thực. Theo báo cáo của Pháp luật TP.HCM (2024), trong tháng 8/2024 cả nước ghi nhận 815 vụ lừa đảo chiếm đoạt tài sản, quá nửa diễn ra trên không gian mạng. Vấn đề cần giải quyết là làm thế nào để xây dựng một công cụ thực hành có thể triển khai trong nhà trường, đồng thời đo được sự thay đổi nhận thức và hành vi qua ba thời điểm, mà không thu thập thông tin định danh học sinh.

*Câu hỏi nghiên cứu.*
- Q1. Điểm nhận thức an toàn thông tin của học sinh có khác biệt giữa trước và sau can thiệp?
- Q2. Khác biệt này còn có ý nghĩa ở giai đoạn theo dõi sau 28 ngày?
- Q3. Điểm hành vi tự báo cáo có khác biệt giữa trước và sau can thiệp?
- Q4. Thời gian phản hồi và việc sử dụng gợi ý có liên quan đến độ chính xác phân loại không?

*Giả thuyết.* H1: điểm kiến thức sau can thiệp cao hơn trước can thiệp. H2: điểm kiến thức ở giai đoạn theo dõi cao hơn trước can thiệp. H3: điểm hành vi sau can thiệp cao hơn trước can thiệp. H4: học sinh sử dụng gợi ý đọc tên miền có tỉ lệ phân loại đúng cao hơn học sinh không sử dụng (mối liên hệ quan sát được, không suy ra nhân quả).

*Mục tiêu.*
1. Thiết kế và xây dựng hệ thống web tương tác gồm ba hoạt động về an toàn thông tin.
2. Xây dựng bộ công cụ đo lường tách riêng kiến thức (câu có đáp án) và hành vi (tự báo cáo).
3. Thiết kế quy trình đo lường trước, sau và theo dõi, với trình tự mở khóa kiểm soát ở máy chủ.
4. Bảo đảm ẩn danh dữ liệu và quyền riêng tư của học sinh trong toàn bộ quá trình.

*Kết quả dự kiến.*

| Hạng mục | Kết quả dự kiến |
|---|---|
| Hệ thống web | Chạy trên điện thoại và máy tính không cần cài đặt; ba hoạt động hoàn chỉnh |
| Bộ đo lường | 16 câu (10 kiến thức có đáp án, 6 hành vi tự báo cáo) dùng chung cho ba giai đoạn |
| Dữ liệu | Hai tệp xuất (dạng dài và dạng rộng) đã ẩn danh, kèm bộ mã hóa biến (codebook) |
| Kết luận | Đánh giá mức thay đổi nhận thức và hành vi, kèm kích thước hiệu ứng và khoảng tin cậy |

**2. Thiết kế, phương pháp nghiên cứu (hoặc giải pháp kỹ thuật)**

- *Thiết kế:* đo lường tiền–hậu–theo dõi trên một nhóm học sinh, không có nhóm đối chứng ngẫu nhiên. Vì vậy kết quả chỉ được diễn giải theo hướng tương quan và có hướng, không suy luận nhân quả.
- *Can thiệp:* học sinh thực hiện ba hoạt động theo thứ tự tùy chọn.
  - *Sân chơi tình huống:* 5 kịch bản về cuộc gọi lạ, tin nhắn trúng thưởng, đường link đáng ngờ. Học sinh chọn cách xử lý và nhận giải thích ngay.
  - *Thám tử tên miền:* 12 tên miền hư cấu, học sinh phân loại an toàn hay đáng ngờ. Có gợi ý đọc tên miền từ phải sang trái.
  - *Phòng thí nghiệm tài khoản:* checklist 8 bước về mật khẩu, mã xác thực và quyền riêng tư. Mật khẩu không được gửi lên máy chủ.
- *Đo lường:* 16 câu khảo sát ở ba giai đoạn. Câu kiến thức có đáp án nhưng không phản hồi đúng sai trong khảo sát. Câu hành vi dùng thang 1–4.
- *Phân tích dự kiến:* kế hoạch phân tích được xác định trước khi thu dữ liệu, gồm mô tả, kiểm định Wilcoxon signed-rank cho H1 và H3, kiểm định Friedman và Wilcoxon cho H2, tương quan Spearman cho H4. Mức ý nghĩa α = 0,05. Chi tiết trong mục 2.6 của báo cáo.
- *Kiểm thử phần mềm (đã thực hiện):* bộ kiểm thử tích hợp tự động gồm 290 kiểm tra, đạt toàn bộ. Kiểm thử này kiểm chứng kỹ thuật, không phải kết quả nghiên cứu.

**3. Các giai đoạn thực hiện, cách thu thập, lưu trữ và xử lý dữ liệu**

| Giai đoạn | Nội dung | Thời gian | Ghi chú |
|---|---|---|---|
| 1. Chuẩn bị | Nhà trường phê duyệt kế hoạch; tạo lớp; in thẻ mã (không ghi tên); cấp tài khoản giáo viên | [Cần bổ sung] | Trước khi học sinh tham gia |
| 2. Kích hoạt thẻ, khảo sát đầu vào | Học sinh nhập mã, đọc và tích phiếu đồng ý; làm 16 câu | [Cần bổ sung] | Phiếu đồng ý giấy (IVd) ký trước đó |
| 3. Can thiệp | Ba hoạt động | [Cần bổ sung] | Nhật ký nghiên cứu ghi hằng ngày |
| 4. Hậu kiểm | Làm lại 16 câu | [Cần bổ sung] | Sau khi hoàn thành ba hoạt động |
| 5. Theo dõi | Làm lại 16 câu sau 28 ngày | [Cần bổ sung] | Mở tự động sau 28 ngày |
| 6. Phân tích và báo cáo | Xuất dữ liệu ẩn danh; phân tích theo kế hoạch | [Cần bổ sung] | Không công bố số liệu lớp dưới 5 học sinh |

*Lưu trữ và bảo mật.* Dữ liệu sẽ lưu trên máy chủ của nhà trường hoặc hosting, cấu hình theo hướng dẫn triển khai (chưa thử nghiệm trên hosting thực tế). Mật khẩu chỉ lưu dạng băm. Sổ phát thẻ (ai nhận thẻ nào) được bảo quản riêng, không lưu trên hệ thống và không đưa vào kho mã. [Cần bổ sung: nơi lưu trữ thực tế và người có quyền truy cập].

**4. Tài liệu, nguồn tham khảo chính**

- Lastdrager, E., Gallardo, I. C., Hartel, P. H., & Junger, M. (2017). How effective is anti-phishing training for children? *Proceedings of the Thirteenth Symposium on Usable Privacy and Security (SOUPS 2017)*. USENIX Association. https://www.usenix.org/conference/soups2017/technical-sessions/presentation/lastdrager
- National Institute of Standards and Technology. (2025). *Digital identity guidelines: Authentication and authenticator management* (NIST SP 800-63B-4). U.S. Department of Commerce. https://csrc.nist.gov/pubs/sp/800/63/B/4/final
- OWASP Foundation. (2021). *OWASP Top 10:2021*. https://owasp.org/Top10/2021/
- Pháp luật TP.HCM. (2024). *Tháng 8, cả nước có 815 vụ lừa đảo chiếm đoạt tài sản, đa phần là trên không gian mạng*. https://plo.vn/

*Tài liệu bổ sung:* [Cần bổ sung nguồn về tỉ lệ lừa đảo, hiệu quả huấn luyện nhận diện lừa đảo cho học sinh và thang đo hành vi an toàn thông tin. Chưa có nguồn xác thực trong bản này.]

**5. Đánh giá rủi ro, bảo đảm an toàn và bảo vệ người tham gia**

*Rủi ro và hạn chế đã biết:*
- Nội dung mô phỏng lừa đảo có thể gây lo lắng nhẹ cho học sinh nếu không được giải thích rõ. Mỗi kịch bản đều có giải thích ngay sau lựa chọn.
- Tên miền trong hoạt động đều là tên hư cấu. Hệ thống không kiểm tra hay truy cập bất kỳ dịch vụ thật nào.
- Mẫu tự nguyện, một cơ sở giáo dục, không có nhóm đối chứng. Kết quả không khái quát được ra toàn bộ học sinh.
- Có thể có học sinh bỏ dở ở giai đoạn sau. Số bỏ dở sẽ được báo cáo riêng và không được thay thế bằng giá trị ước lượng.

*Biện pháp bảo vệ:*
- Không thu họ tên, email, số điện thoại, ảnh hay thông tin cá nhân khác. Mã học sinh ngẫu nhiên, in trên thẻ không ghi tên.
- Tham gia tự nguyện. Phiếu đồng ý nêu rõ quyền dừng bất cứ lúc nào. Phụ huynh hoặc người giám hộ đồng ý bằng văn bản trước khi học sinh tham gia (phiếu IVd).
- Không công bố thống kê theo lớp khi số học sinh dưới 5.
- Dữ liệu chỉ dùng cho nghiên cứu và được xóa theo quy định khi kết thúc.

*Đánh giá mức độ an toàn:* [Cần bổ sung: người đứng đầu cơ sở giáo dục đánh giá sơ bộ và ghi rõ có hay không yếu tố rủi ro. Nếu có, phải có ý kiến bằng văn bản của ít nhất một người có chuyên môn phù hợp không phải người hướng dẫn, hoàn thành trước khi học sinh thu thập dữ liệu.]

**6. Dự kiến sử dụng công nghệ số, trí tuệ nhân tạo**

| Công cụ/phần mềm | Mục đích | Vai trò trong dự án |
|---|---|---|
| Trợ lý lập trình AI (Claude Code, Anthropic) | Hỗ trợ viết mã nguồn ứng dụng, kiểm thử và soạn tài liệu kỹ thuật | Trợ lý phát triển, không tham gia thu thập hay xử lý dữ liệu học sinh |

*Ứng dụng trong nghiên cứu.* Hệ thống không sử dụng mô hình AI để sinh nội dung, chấm điểm hay phản hồi học sinh. Các phản hồi trong hoạt động là nội dung soạn sẵn. [Cần xác nhận: các kịch bản và câu hỏi có được soạn với sự hỗ trợ AI hay không.]

Việc sử dụng AI được khai báo đầy đủ tại Mẫu 03, mục IV.

### III. CAM KẾT VÀ PHÊ DUYỆT

*Học sinh cam kết* tự thực hiện các nội dung nghiên cứu, ghi nhật ký và lưu giữ dữ liệu gốc trung thực; không sao chép hay giả mạo kết quả. *Người hướng dẫn cam kết* hướng dẫn, giám sát và xác nhận nhật ký định kỳ theo quy định.

| HỌC SINH THỰC HIỆN | CHA, MẸ HOẶC NGƯỜI GIÁM HỘ | NGƯỜI HƯỚNG DẪN |
|---|---|---|
| Ký, ghi rõ họ tên (từng học sinh) | Đồng ý cho học sinh tham gia dự án. Ký, ghi rõ họ tên | Ký, ghi rõ họ tên |
| | | |

**Ý kiến đề nghị của tổ chuyên môn:** [Cần bổ sung]

**PHÊ DUYỆT CỦA HIỆU TRƯỞNG** *(để trống, do nhà trường điền)*

*Phê duyệt kế hoạch nghiên cứu và người hướng dẫn nêu trên; giao tổ chuyên môn theo dõi, kiểm tra quá trình thực hiện dự án, việc tuân thủ quy định an toàn và liêm chính khoa học.*

……………, ngày …… tháng …… năm 2026

**HIỆU TRƯỞNG**
*(Ký, ghi rõ họ tên và đóng dấu)*

---

## MẪU 02. BÁO CÁO TÓM TẮT KẾT QUẢ NGHIÊN CỨU

*(Không quá 300 chữ, không tính tên dự án và lĩnh vực. Bản nộp không ghi họ tên học sinh, tên trường, tên giáo viên.)*

**Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở
**Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục

**1. Vấn đề nghiên cứu**

Học sinh THCS sử dụng điện thoại và mạng xã hội thường xuyên nhưng ít được hướng dẫn có hệ thống để nhận diện lừa đảo qua tin nhắn, cuộc gọi, đường link và tên miền giả mạo. Đề tài đặt câu hỏi: một hệ thống web thực hành có làm thay đổi nhận thức và hành vi an toàn thông tin của học sinh không, và có đo được sự thay đổi đó mà không thu thập thông tin định danh hay không?

**2. Phương pháp**

Thiết kế đo lường trước, sau và theo dõi sau 28 ngày, với 16 câu khảo sát (10 kiến thức, 6 hành vi). Học sinh thực hiện ba hoạt động: sân chơi tình huống, thám tử tên miền và phòng thí nghiệm tài khoản. Dữ liệu được mã hóa ngẫu nhiên, không chứa thông tin cá nhân.

**3. Kết quả**

Hệ thống đã hoàn thành và đạt toàn bộ 290 kiểm tra tự động. Nghiên cứu chưa thu thập dữ liệu thực nghiệm, nên chưa có kết quả về hiệu quả can thiệp. Bốn giả thuyết sẽ được kiểm định khi có dữ liệu.

**4. Ý nghĩa**

Đề tài cung cấp một học liệu tương tác dùng được trong nhà trường mà không cần thiết bị chuyên dụng, và một thiết kế đo lường có thể tái sử dụng.

*Số chữ của Mẫu 02 (không tính tiêu đề và tên dự án): [được đếm ở bước kiểm tra cuối].*

---

## MẪU 03. NHẬT KÝ NGHIÊN CỨU VÀ DANH MỤC MINH CHỨNG

**Tên dự án:** An Toàn Số Học Đường
**Học sinh thực hiện:** Trần Cảnh Phúc, Cù Hoàng Linh Trúc (lớp 9/1)
**Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh

### I. NHẬT KÝ QUÁ TRÌNH NGHIÊN CỨU

*Ghi theo tiến độ thực tế. Mỗi dòng là một buổi hoặc một giai đoạn, nêu rõ vai trò từng học sinh.*

| Ngày/tháng | Công việc, phương pháp thực hiện | Kết quả; mã minh chứng | Người thực hiện, phần việc |
|---|---|---|---|
| [Cần bổ sung] | Xây dựng hệ thống web (ba hoạt động, bộ câu hỏi, giao diện giáo viên) | Mã nguồn và kiểm thử tự động: MC02 | [Cần bổ sung] |
| [Cần bổ sung] | Kiểm chứng kỹ thuật: 290 kiểm tra tự động, kiểm thử giao diện trên điện thoại và máy tính | MC03 | [Cần bổ sung] |
| [Cần bổ sung] | Thu dữ liệu với học sinh (nếu đã thực hiện) | [Cần bổ sung] | [Cần bổ sung] |

### II. XÁC NHẬN ĐỊNH KỲ CỦA NGƯỜI HƯỚNG DẪN

*Người hướng dẫn kiểm tra và xác nhận nhật ký ít nhất 01 lần mỗi tháng.*

| Tháng/năm | Nội dung kiểm tra, nhận xét, hướng dẫn | Xác nhận người hướng dẫn |
|---|---|---|
| …/…… | [Cần bổ sung] | |
| …/…… | [Cần bổ sung] | |

### III. DANH MỤC MINH CHỨNG VÀ DỮ LIỆU GỐC

*Đánh số thống nhất với nhật ký. Các tệp không chứa thông tin định danh học sinh.*

| Mã | Tên tài liệu/tệp | Nội dung chứng minh | Thời điểm tạo |
|---|---|---|---|
| MC01 | Bộ câu hỏi khảo sát (`api/content/assessment_items.json`, phiên bản a-v1) | Nội dung 16 câu ba giai đoạn, đáp án và thang đo | [Cần bổ sung] |
| MC02 | Mã nguồn hệ thống (nhánh `claude/gifted-brown-mfv1i8`) | Cài đặt ba hoạt động, kiểm soát trình tự và ẩn danh | [Cần bổ sung] |
| MC03 | Kết quả kiểm thử tự động (290 kiểm tra, 0 lỗi) | Kiểm chứng kỹ thuật, không phải kết quả nghiên cứu | [Cần bổ sung] |
| MC04 | Bộ mã hóa biến (codebook) và định dạng xuất dữ liệu | Mô tả từng cột và cách tính biến | [Cần bổ sung] |
| MC05 | Phiếu đồng ý (IVd) và cam kết (IVb) đã ký | Đồng ý bằng văn bản trước khi thu dữ liệu | [Cần bổ sung: bản giấy lưu tại trường] |
| MC06 | Dữ liệu xuất ẩn danh (tệp dài và rộng) | Dữ liệu gốc phục vụ phân tích | [Cần bổ sung: sau khi thu thập] |

### IV. KHAI BÁO VIỆC SỬ DỤNG CÔNG NGHỆ SỐ, AI

*Ghi rõ công cụ đã dùng, mục đích, phạm vi và mức độ hỗ trợ. Nêu rõ phần nội dung do học sinh trực tiếp thực hiện.*

| Công cụ/phần mềm | Mục đích, nội dung sử dụng | Phạm vi, mức độ hỗ trợ |
|---|---|---|
| Trợ lý lập trình AI (Claude Code, Anthropic) | Viết mã nguồn, gỡ lỗi, viết kiểm thử và soạn tài liệu kỹ thuật | Hỗ trợ phát triển phần mềm. Thiết kế nghiên cứu, lựa chọn câu hỏi, kịch bản và phân tích do học sinh và người hướng dẫn quyết định. [Cần xác nhận mức độ hỗ trợ theo thực tế] |

*Hệ thống không chứa mô hình AI trong quá trình học sinh sử dụng.*

---

## MẪU 04. XÁC NHẬN NGHIÊN CỨU TẠI CƠ SỞ NGOÀI NHÀ TRƯỜNG

*Không áp dụng. Toàn bộ hoạt động nghiên cứu diễn ra tại THCS Hoàng Sa, phân hiệu Lý Tự Trọng. Nếu sau này có hoạt động ngoài trường, cần lập biểu mẫu này.*

---

## HƯỚNG DẪN POSTER (01 tệp PDF)

*Phụ lục II quy định 03 mặt. Công văn 6068 (cấp thành phố) quy định poster điện tử 04 trang và dưới 10 MB. Cần xác nhận quy định áp dụng.*

- **Mặt 1:** tên dự án, lĩnh vực, học sinh thực hiện và trường (theo quy định về ẩn danh của cuộc thi), vấn đề cần giải quyết, mục tiêu nghiên cứu.
- **Mặt 2:** thiết kế, phương pháp, quá trình thực hiện; sơ đồ ba hoạt động; ảnh chụp màn hình không có người rõ mặt và không có thông tin định danh.
- **Mặt 3:** kết quả (hiện là kiểm chứng kỹ thuật, dữ liệu thực nghiệm sẽ bổ sung khi có), kết luận, điểm mới và khả năng ứng dụng.

*Lưu ý:* poster phải thống nhất với báo cáo tóm tắt và nhật ký. Không chèn link hoặc mã QR. Mọi hình vẽ tự tạo cần ghi rõ phần mềm tạo ra (ví dụ: "Đồ thị được tạo bởi phần mềm Python và do học sinh tự thực hiện").

---

## VIỆC CẦN XÁC NHẬN TRƯỚC KHI NỘP

1. Cuộc thi áp dụng là cấp phường hay cấp thành phố (hai văn bản khác nhau về biểu mẫu và số trang poster).
2. Thời gian thực hiện và lịch thu dữ liệu, và trạng thái thu dữ liệu hiện tại.
3. Phần việc cụ thể của từng học sinh trong Mẫu 01 và Mẫu 03.
4. Người đánh giá mức độ an toàn và có cần ý kiến chuyên gia hay không.
5. Phiếu đồng ý IVd và cam kết IVb đã ký trước khi thu dữ liệu.
6. Mức độ hỗ trợ của AI trong Mẫu 03, mục IV.
7. Nguồn bổ sung cho các mục ghi [Cần bổ sung nguồn]. Không dùng nguồn chưa xác thực.
