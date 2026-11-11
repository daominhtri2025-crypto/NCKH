**PHỤ LỤC II**

**CÁC BIỂU MẪU HỒ SƠ CUỘC THI KHKT CẤP PHƯỜNG**

**An Toàn Số Học Đường – Năm học 2026 – 2027**

# MẪU 01. KẾ HOẠCH NGHIÊN CỨU VÀ PHÊ DUYỆT CỦA NHÀ TRƯỜNG

*(Lập, phê duyệt trước khi nghiên cứu; lưu tại cơ sở giáo dục)*

## I. THÔNG TIN DỰ ÁN

1. **Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở
2. **Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục
3. **Học sinh thực hiện:**

| Họ và tên | Lớp | Nhiệm vụ dự kiến trong dự án |
|---|---|---|
| Trần Cảnh Phúc | 9/1 | …………………………… |
| Cù Hoàng Linh Trúc | 9/1 | …………………………… |

4. **Trường THCS:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng
5. **Người hướng dẫn nghiên cứu** (họ tên, chức vụ/chuyên môn): Hoàng Thị Bảo Oanh – ……………………………
6. **Chuyên gia hỗ trợ chuyên môn** (nếu có; ghi trình độ, đơn vị công tác, nội dung hỗ trợ): ……………………………………………………………………………
7. **Địa điểm nghiên cứu:** THCS Hoàng Sa, phân hiệu Lý Tự Trọng
8. **Thời gian dự kiến:** từ ngày …/…/2026 đến ngày …/…/2026

## II. NỘI DUNG KẾ HOẠCH NGHIÊN CỨU

**1. Vấn đề nghiên cứu, mục tiêu và kết quả dự kiến**

*Vấn đề nghiên cứu.* Học sinh trung học cơ sở sử dụng điện thoại và mạng xã hội thường xuyên, nhưng thường thiếu kiến thức có hệ thống để nhận diện lừa đảo qua tin nhắn, cuộc gọi, đường link và tên miền giả mạo, cũng như cách bảo vệ mã xác thực. Theo báo cáo của Pháp luật TP.HCM (2024), trong tháng 8/2024 cả nước ghi nhận 815 vụ lừa đảo chiếm đoạt tài sản, quá nửa diễn ra trên không gian mạng. Vấn đề đặt ra là làm thế nào để xây dựng một công cụ thực hành có thể triển khai trong nhà trường, đồng thời đo được sự thay đổi nhận thức và hành vi qua ba thời điểm, mà không thu thập thông tin định danh học sinh.

*Câu hỏi nghiên cứu.*

- Q1. Điểm nhận thức an toàn thông tin của học sinh có khác biệt giữa trước và sau can thiệp?
- Q2. Khác biệt này còn có ý nghĩa ở giai đoạn theo dõi sau 28 ngày?
- Q3. Điểm hành vi tự báo cáo có khác biệt giữa trước và sau can thiệp?
- Q4. Thời gian phản hồi và việc sử dụng gợi ý có liên quan đến độ chính xác phân loại không?

*Giả thuyết.*

- H1. Điểm kiến thức sau can thiệp cao hơn trước can thiệp.
- H2. Điểm kiến thức ở giai đoạn theo dõi cao hơn trước can thiệp.
- H3. Điểm hành vi sau can thiệp cao hơn trước can thiệp.
- H4. Học sinh sử dụng gợi ý đọc tên miền có tỉ lệ phân loại đúng cao hơn học sinh không sử dụng (mối liên hệ quan sát được, không suy ra nhân quả).

*Mục tiêu nghiên cứu.*

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

- *Thiết kế:* đo lường tiền–hậu–theo dõi trên một nhóm học sinh, không có nhóm đối chứng ngẫu nhiên. Kết quả chỉ được diễn giải theo hướng tương quan và có hướng, không suy luận nhân quả.
- *Can thiệp:* học sinh thực hiện ba hoạt động theo thứ tự tùy chọn.
  - *Sân chơi tình huống:* 5 kịch bản về cuộc gọi lạ, tin nhắn trúng thưởng, đường link đáng ngờ. Học sinh chọn cách xử lý và nhận giải thích ngay.
  - *Thám tử tên miền:* 12 tên miền hư cấu, học sinh phân loại an toàn hay đáng ngờ. Có gợi ý đọc tên miền từ phải sang trái.
  - *Phòng thí nghiệm tài khoản:* checklist 8 bước về mật khẩu, mã xác thực và quyền riêng tư. Mật khẩu không được gửi lên máy chủ.
- *Đo lường:* 16 câu khảo sát ở ba giai đoạn. Câu kiến thức có đáp án nhưng không phản hồi đúng sai trong khảo sát. Câu hành vi dùng thang 1–4.
- *Phân tích dự kiến:* kế hoạch phân tích được xác định trước khi thu dữ liệu, gồm mô tả; kiểm định Wilcoxon signed-rank cho H1 và H3; kiểm định Friedman và Wilcoxon cho H2; tương quan Spearman cho H4. Mức ý nghĩa α = 0,05.
- *Khảo sát bổ sung (Google Form, đã mở, chưa thu thập số liệu):* ba phiếu thu nhận thức, nhu cầu và phản hồi, không thay thế bộ đo 16 câu trong ứng dụng.
  - Phiếu A (học sinh, nền, trước can thiệp): 10 câu, gồm đồng ý tham gia, khối lớp, thiết bị, thời gian dùng mạng, kinh nghiệm gặp tin đáng ngờ, mức tự tin và nhu cầu học tập.
  - Phiếu B (học sinh, phản hồi, sau can thiệp): 7 câu, gồm hoạt động hữu ích nhất, mức dễ sử dụng, mức rõ ràng của giải thích và ý kiến mở.
  - Phiếu C (giáo viên): 11 câu, gồm nguy cơ học sinh gặp phải, nội dung và hình thức ưu tiên, rào cản triển khai và lo ngại về quyền riêng tư.
  - Phân tích dự kiến: thống kê mô tả theo khối lớp; số liệu sẽ được bổ sung khi thu thập xong.
- *Kiểm thử phần mềm (đã thực hiện):* bộ kiểm thử tích hợp tự động gồm 290 kiểm tra, đạt toàn bộ. Đây là kiểm chứng kỹ thuật, không phải kết quả nghiên cứu.

**3. Các giai đoạn thực hiện, cách thu thập, lưu trữ và xử lý dữ liệu**

| Giai đoạn | Nội dung | Thời gian | Ghi chú |
|---|---|---|---|
| 1. Chuẩn bị | Nhà trường phê duyệt kế hoạch; tạo lớp; in thẻ mã (không ghi tên); cấp tài khoản giáo viên | ……………… | Trước khi học sinh tham gia |
| 2. Kích hoạt thẻ, khảo sát đầu vào | Học sinh nhập mã, đọc và tích phiếu đồng ý; làm 16 câu | ……………… | Phiếu đồng ý bằng văn bản ký trước đó |
| 3. Can thiệp | Ba hoạt động | ……………… | Nhật ký nghiên cứu ghi hằng ngày |
| 4. Hậu kiểm | Làm lại 16 câu | ……………… | Sau khi hoàn thành ba hoạt động |
| 5. Theo dõi | Làm lại 16 câu sau 28 ngày | ……………… | Mở tự động sau 28 ngày |
| 6. Phân tích và báo cáo | Xuất dữ liệu ẩn danh; phân tích theo kế hoạch | ……………… | Không công bố số liệu lớp dưới 5 học sinh |

*Số liệu khảo sát bổ sung.* Chưa thu thập số liệu nghiên cứu. Ngày 11/11/2026, nhóm đã kiểm thử ba biểu mẫu bằng mỗi biểu mẫu một phản hồi thử. Các phản hồi thử này không được tính là số liệu nghiên cứu.

| Phiếu | Đối tượng | Số phản hồi thử (11/11/2026) | Số phiếu hợp lệ của nghiên cứu |
|---|---|---|---|
| A. Phiếu nền | Học sinh | 1 | …………… |
| B. Phiếu phản hồi | Học sinh | 1 | …………… |
| C. Phiếu giáo viên | Giáo viên | 1 | …………… |

*Lưu trữ và bảo mật.* Dữ liệu được lưu trên máy chủ của nhà trường hoặc hosting, cấu hình theo hướng dẫn triển khai của dự án. Mật khẩu chỉ lưu dạng băm. Sổ phát thẻ (học sinh nào nhận thẻ nào) được bảo quản riêng, không lưu trên hệ thống và không đưa vào kho mã. Người có quyền truy cập: ……………………………

**4. Tài liệu, nguồn tham khảo chính**

- Lastdrager, E., Gallardo, I. C., Hartel, P. H., & Junger, M. (2017). How effective is anti-phishing training for children? *Proceedings of the Thirteenth Symposium on Usable Privacy and Security (SOUPS 2017)*. USENIX Association. https://www.usenix.org/conference/soups2017/technical-sessions/presentation/lastdrager
- National Institute of Standards and Technology. (2025). *Digital identity guidelines: Authentication and authenticator management* (NIST SP 800-63B-4). U.S. Department of Commerce. https://csrc.nist.gov/pubs/sp/800/63/B/4/final
- OWASP Foundation. (2021). *OWASP Top 10:2021*. https://owasp.org/Top10/2021/
- Pháp luật TP.HCM. (2024). *Tháng 8, cả nước có 815 vụ lừa đảo chiếm đoạt tài sản, đa phần là trên không gian mạng*. https://plo.vn/

**5. Đánh giá rủi ro, bảo đảm an toàn và bảo vệ người tham gia nghiên cứu**

*Rủi ro và hạn chế.*

- Nội dung mô phỏng lừa đảo có thể gây lo lắng nhẹ nếu không được giải thích rõ. Mỗi kịch bản có giải thích ngay sau lựa chọn của học sinh.
- Tên miền trong hoạt động đều là tên hư cấu. Hệ thống không kiểm tra hay truy cập bất kỳ dịch vụ thật nào.
- Mẫu tự nguyện, thực hiện tại một cơ sở giáo dục, không có nhóm đối chứng. Kết quả không khái quát được ra toàn bộ học sinh.
- Có thể có học sinh bỏ dở ở giai đoạn sau. Số học sinh bỏ dở được báo cáo riêng và không được thay thế bằng giá trị ước lượng.

*Biện pháp bảo vệ.*

- Không thu họ tên, email, số điện thoại, ảnh hay thông tin cá nhân khác. Mã học sinh ngẫu nhiên, in trên thẻ không ghi tên.
- Tham gia tự nguyện. Phiếu đồng ý nêu rõ quyền dừng bất cứ lúc nào. Phụ huynh hoặc người giám hộ đồng ý bằng văn bản trước khi học sinh tham gia (phiếu IVd).
- Không công bố thống kê theo lớp khi số học sinh dưới 5.
- Dữ liệu chỉ dùng cho nghiên cứu và được xóa theo quy định khi kết thúc.

*Đánh giá mức độ an toàn của nhà trường:* ☐ Không có yếu tố rủi ro  ☐ Có yếu tố rủi ro (ý kiến chuyên gia đính kèm: ☐ Có ☐ Không)

**6. Dự kiến sử dụng công nghệ số, trí tuệ nhân tạo**

| Công cụ/phần mềm | Mục đích | Vai trò trong dự án |
|---|---|---|
| Trợ lý lập trình AI (Claude Code, Anthropic) | Hỗ trợ viết mã nguồn ứng dụng, kiểm thử và soạn tài liệu kỹ thuật | Trợ lý phát triển; không tham gia thu thập hay xử lý dữ liệu học sinh |

*Ứng dụng trong nghiên cứu.* Hệ thống không sử dụng mô hình AI để sinh nội dung, chấm điểm hay phản hồi học sinh. Các phản hồi trong hoạt động là nội dung soạn sẵn. Việc sử dụng AI được khai báo đầy đủ tại Mẫu 03, mục IV.

## III. CAM KẾT VÀ PHÊ DUYỆT

*Học sinh cam kết* tự thực hiện các nội dung nghiên cứu, ghi nhật ký và lưu giữ dữ liệu gốc trung thực; không sao chép hay giả mạo kết quả. *Người hướng dẫn cam kết* hướng dẫn, giám sát và xác nhận nhật ký định kỳ theo quy định.

| HỌC SINH THỰC HIỆN | CHA, MẸ HOẶC NGƯỜI GIÁM HỘ | NGƯỜI HƯỚNG DẪN |
|---|---|---|
| Ký, ghi rõ họ tên (từng học sinh) | Đồng ý cho học sinh tham gia dự án. Ký, ghi rõ họ tên | Ký, ghi rõ họ tên |
| | | |

**Ý kiến đề nghị của tổ chuyên môn:** ……………………………………………………………………………………………

**PHÊ DUYỆT CỦA HIỆU TRƯỞNG**

*Phê duyệt kế hoạch nghiên cứu và người hướng dẫn nêu trên; giao tổ chuyên môn theo dõi, kiểm tra quá trình thực hiện dự án, việc tuân thủ quy định an toàn và liêm chính khoa học.*

…………, ngày …… tháng …… năm 2026

**HIỆU TRƯỞNG**
*(Ký, ghi rõ họ tên và đóng dấu)*

# MẪU 02. BÁO CÁO TÓM TẮT KẾT QUẢ NGHIÊN CỨU

*(Không quá 300 chữ, không tính tên dự án và lĩnh vực)*

**Tên dự án:** An Toàn Số Học Đường: Xây dựng và đánh giá hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh trung học cơ sở

**Lĩnh vực dự thi:** Công nghệ thông tin – An toàn thông tin trong giáo dục

**Học sinh thực hiện (họ tên, lớp):** ……………………………………………

**Trường THCS:** ……………………………………………

**1. Vấn đề nghiên cứu hoặc vấn đề kỹ thuật cần giải quyết**

Học sinh THCS sử dụng điện thoại và mạng xã hội thường xuyên nhưng ít được hướng dẫn có hệ thống để nhận diện lừa đảo qua tin nhắn, cuộc gọi, đường link và tên miền giả mạo. Đề tài đặt câu hỏi: một hệ thống web thực hành có làm thay đổi nhận thức và hành vi an toàn thông tin của học sinh không, và có đo được sự thay đổi đó mà không thu thập thông tin định danh hay không?

**2. Thiết kế và phương pháp nghiên cứu**

Thiết kế đo lường trước, sau và theo dõi sau 28 ngày, với 16 câu khảo sát (10 kiến thức, 6 hành vi). Học sinh thực hiện ba hoạt động: sân chơi tình huống, thám tử tên miền và phòng thí nghiệm tài khoản. Dữ liệu được mã hóa ngẫu nhiên, không chứa thông tin cá nhân.

**3. Kết quả**

Hệ thống đã hoàn thành và đạt toàn bộ 290 kiểm tra tự động. Nghiên cứu chưa thu thập dữ liệu thực nghiệm; ba biểu mẫu khảo sát đã mở và chưa có số liệu. Vì vậy chưa có kết quả về hiệu quả can thiệp. Bốn giả thuyết sẽ được kiểm định khi có dữ liệu.

**4. Ý nghĩa**

Đề tài cung cấp một học liệu tương tác dùng được trong nhà trường mà không cần thiết bị chuyên dụng, và một thiết kế đo lường có thể tái sử dụng.

# MẪU 03. NHẬT KÝ NGHIÊN CỨU VÀ DANH MỤC MINH CHỨNG

**Tên dự án:** An Toàn Số Học Đường

**Học sinh thực hiện:** Trần Cảnh Phúc, Cù Hoàng Linh Trúc (lớp 9/1)

**Người hướng dẫn nghiên cứu:** Hoàng Thị Bảo Oanh

## I. NHẬT KÝ QUÁ TRÌNH NGHIÊN CỨU

*Ghi chép theo tiến độ thực tế; một dòng có thể dùng cho một buổi hoặc một giai đoạn, bảo đảm rõ vai trò từng học sinh.*

| Ngày/tháng | Công việc, phương pháp thực hiện | Kết quả; mã minh chứng | Người thực hiện, phần việc |
|---|---|---|---|
| …/…… | Xây dựng hệ thống web (ba hoạt động, bộ câu hỏi, giao diện giáo viên) | Mã nguồn và kiểm thử tự động: MC02 | …………………… |
| …/…… | Kiểm chứng kỹ thuật: 290 kiểm tra tự động; kiểm thử giao diện trên điện thoại và máy tính | MC03 | …………………… |
| …/…… | Triển khai ba biểu mẫu khảo sát trên Google Form; chưa thu thập số liệu | MC07–MC09 | …………………… |
| …/…… | Thu dữ liệu với học sinh (nếu có) | …………………… | …………………… |

## II. XÁC NHẬN ĐỊNH KỲ CỦA NGƯỜI HƯỚNG DẪN

*Người hướng dẫn kiểm tra, xác nhận vào nhật ký ít nhất 01 lần mỗi tháng trong thời gian thực hiện nghiên cứu.*

| Tháng/năm | Nội dung kiểm tra, nhận xét, hướng dẫn | Xác nhận người hướng dẫn |
|---|---|---|
| …/…… | …………………………………………………………… | …………………… |
| …/…… | …………………………………………………………… | …………………… |
| …/…… | …………………………………………………………… | …………………… |

## III. DANH MỤC MINH CHỨNG VÀ DỮ LIỆU GỐC

*Đính kèm tệp điện tử hoặc đường dẫn được cấp quyền truy cập cho Ban Tổ chức và Ban Giám khảo; đánh số minh chứng thống nhất với nhật ký.*

| Mã | Tên tài liệu/tệp, đường dẫn | Nội dung chứng minh | Thời điểm tạo |
|---|---|---|---|
| MC01 | Bộ câu hỏi khảo sát (phiên bản a-v1) | Nội dung 16 câu ba giai đoạn, đáp án và thang đo | …………… |
| MC02 | Mã nguồn hệ thống (nhánh claude/gifted-brown-mfv1i8) | Cài đặt ba hoạt động, kiểm soát trình tự và ẩn danh | …………… |
| MC03 | Kết quả kiểm thử tự động (290 kiểm tra, 0 lỗi) | Kiểm chứng kỹ thuật, không phải kết quả nghiên cứu | …………… |
| MC04 | Bộ mã hóa biến (codebook) và định dạng xuất dữ liệu | Mô tả từng cột và cách tính biến | …………… |
| MC05 | Phiếu đồng ý (IVd) và cam kết (IVb) đã ký | Đồng ý bằng văn bản trước khi thu dữ liệu | Lưu bản giấy tại trường |
| MC06 | Dữ liệu xuất ẩn danh (tệp dài và tệp rộng) | Dữ liệu gốc phục vụ phân tích | Sau khi thu thập |
| MC07 | Phiếu A (học sinh, nền): https://docs.google.com/forms/d/e/1FAIpQLSdSHtmj_NEydlD-ODTi3fBgUCU3Pcep0PmVD5VoNPt8TtC6hw/viewform | Cấu trúc 10 câu của phiếu nền | …………… |
| MC08 | Phiếu B (học sinh, phản hồi): https://docs.google.com/forms/d/e/1FAIpQLScsoMFOXiaGnzO1ORSLGEIOGmiq4Wea1TGuKDW_r3V9C3BXZQ/viewform | Cấu trúc 7 câu của phiếu phản hồi | …………… |
| MC09 | Phiếu C (giáo viên): https://docs.google.com/forms/d/e/1FAIpQLSeQCdnhanVYUdGP_21G0qas2oKCvlmRvpZlvhPBQTdXbE-K7g/viewform | Cấu trúc 11 câu của phiếu giáo viên | …………… |

## IV. KHAI BÁO VIỆC SỬ DỤNG CÔNG NGHỆ SỐ, TRÍ TUỆ NHÂN TẠO

*Ghi rõ công cụ đã sử dụng; mục đích, phạm vi và mức độ hỗ trợ; nêu rõ phần nội dung do học sinh trực tiếp thực hiện.*

| Công cụ/phần mềm | Mục đích, nội dung sử dụng | Phạm vi, mức độ hỗ trợ |
|---|---|---|
| Trợ lý lập trình AI (Claude Code, Anthropic) | Viết mã nguồn, gỡ lỗi, viết kiểm thử và soạn tài liệu kỹ thuật | Hỗ trợ phát triển phần mềm. Thiết kế nghiên cứu, lựa chọn câu hỏi, kịch bản và phân tích do học sinh và người hướng dẫn quyết định |

*Hệ thống không chứa mô hình AI trong quá trình học sinh sử dụng.*

# MẪU 04. XÁC NHẬN NGHIÊN CỨU TẠI CƠ SỞ NGOÀI NHÀ TRƯỜNG

Không áp dụng. Toàn bộ hoạt động nghiên cứu diễn ra tại THCS Hoàng Sa, phân hiệu Lý Tự Trọng.
