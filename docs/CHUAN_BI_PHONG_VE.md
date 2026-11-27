# Bộ tài liệu chuẩn bị phòng vệ: "An toàn số học đường"

Tài liệu này đóng vai Hội đồng giám khảo, đặt câu hỏi phản biện và gợi ý trả lời, khớp với báo cáo 13 trang, poster 4 trang và kịch bản thuyết trình hai học sinh. Nguyên tắc: **trả lời thẳng, có bằng chứng, trung thực và nêu hướng phát triển**. Mọi con số lấy từ báo cáo. Không nhắc tên trường, học sinh hay giáo viên.

**Cách dùng:** đọc câu hỏi, tự trả lời thành tiếng 30–45 giây, rồi so với gợi ý. Nhớ **ý chính in đậm**, nói bằng lời của mình.

---

## Phần 1. Mười câu hỏi phản biện và gợi ý trả lời

### Câu 1. "Dự án đóng góp điều gì, và đã chứng minh được gì?"
**Gợi ý:** Dự án có **ba đóng góp có bằng chứng**: **(1)** một **hệ thống thực hành tái sử dụng được** (ba hoạt động, ba vai trò), kiểm thử **321/321** tích hợp, **14/14** đơn vị, **23 bước** luồng người dùng; **(2)** một **thiết kế đo tách nhận thức và hành vi** ở ba thời điểm, có khung phân tích định sẵn (Wilcoxon, Friedman); **(3)** một **mô hình quyền riêng tư** cho nghiên cứu có học sinh. Về hiệu quả học tập, chúng em **chưa kết luận**: dữ liệu đo trước–sau–28 ngày sẽ được thu thập ở giai đoạn mở rộng.

### Câu 2. "Mã thẻ chỉ 8 ký tự, có dễ bị đoán không? Hai mã tách biệt an toàn hơn ở chỗ nào?"
**Gợi ý:** Mã dạng XXXX-XXXX dùng bảng **31 ký tự** bỏ các ký tự dễ nhầm, sinh ngẫu nhiên, khoảng **8,5 trăm tỷ tổ hợp (khoảng 40 bit)**, phù hợp phạm vi lớp học với dữ liệu không chứa thông tin định danh. Trước khi triển khai rộng, chúng em sẽ **bổ sung giới hạn số lần đăng nhập** và kiểm thử trên máy chủ thực tế. **Hai mã tách biệt** nghĩa là mã trong tệp dữ liệu **không đăng nhập được** và không suy ra từ mã thẻ: nếu tệp bị lộ, người khác **không đăng nhập thay học sinh**.

### Câu 3. "Giáo viên phát thẻ thì biết thẻ nào của học sinh nào. Vậy dữ liệu có ẩn danh không?"
**Gợi ý:** Dữ liệu **ẩn danh với nhóm nghiên cứu và trong tệp xuất**. Giáo viên phát thẻ chỉ thấy **mã thẻ**, **không thấy mã nghiên cứu**, nên không đối chiếu được tệp dữ liệu với từng em. Ranh giới này nêu trong phiếu đồng ý; sổ phát thẻ giữ riêng; khi công bố theo lớp không công bố nhóm dưới 5 học sinh.

### Câu 4. "Vì sao thiết kế đo ở ba thời điểm, vì sao 28 ngày?"
**Gợi ý:** Đo **trước và sau** để thấy thay đổi, đo thêm **sau 28 ngày** để xem mức duy trì, vì nghiên cứu ở trẻ em cho thấy hiệu quả đào tạo có thể giảm sau khoảng bốn tuần (Lastdrager và cộng sự, 2017). Máy chủ **khóa trình tự** nên mọi học sinh đều có dữ liệu đầu vào. Dùng **kiểm định phi tham số** vì mẫu nhỏ, không giả định phân phối chuẩn.

### Câu 5. "Khác gì video, tờ rơi hay ứng dụng có sẵn?"
**Gợi ý:** Chúng em nêu khác biệt về **cách tiếp cận**, không nói "hơn": **(1)** học sinh **thực hành** thay vì chỉ xem; **(2)** **đo ba thời điểm**, tách nhận thức và hành vi; **(3)** **không thu thông tin định danh**, mật khẩu thử chỉ xử lý trên trình duyệt.

### Câu 6. "Em có dùng AI không? Phần nào do em tự làm?"
**Gợi ý:** Có, và nhóm đã **khai báo ở Phụ lục D** của báo cáo: dùng công cụ lập trình AI (Claude Code) để hỗ trợ viết mã, gỡ lỗi, soạn tài liệu, vẽ sơ đồ. **Hệ thống không gọi AI khi học sinh dùng**. **Số liệu khảo sát tính trực tiếp từ dữ liệu thu thập.** Phần chúng em giải thích được: câu hỏi nghiên cứu, thiết kế đo ba thời điểm, vì sao tách hai mã, luồng kích hoạt thẻ. *(Chuẩn bị bắt buộc: cả nhóm đọc lại và tự giải thích được từng phần; chỉ nói "tự làm" ở phần thật sự hiểu.)*

### Câu 7. "Mẫu n = 100 có đại diện không? Số liệu có đáng tin?"
**Gợi ý:** Số liệu khảo sát dùng để **mô tả thực trạng và định hướng thiết kế**, trên tập mẫu của đề tài (ba phiếu, mỗi phiếu 100 bản hợp lệ, thu 01/11–11/11/2026), không dùng để ước lượng cho tổng thể rộng hơn. Ở giai đoạn mở rộng, chúng em **mở rộng quy mô khảo sát** sang nhiều lớp, nhiều trường.

### Câu 8. "Hành vi đo bằng tự kê khai và dùng cùng bộ câu hỏi ba lần, có chính xác không?"
**Gợi ý:** Chúng em **tách câu kiến thức (có đáp án) khỏi câu hành vi**, **đảo chiều hai câu hành vi**, và **không báo đúng sai trong khảo sát**. Dùng cùng bộ câu để **so sánh được điểm số**; ở giai đoạn mở rộng, chúng em **xây bộ câu song song** và **kết hợp bài kiểm tra tình huống** trên hệ thống để đo khách quan hơn.

### Câu 9. "Triển khai diện rộng có khả thi không?"
**Gợi ý:** Hệ thống **chạy trên trình duyệt**, không cài phần mềm; giáo viên **tự tạo và in thẻ**; đã **cài và chạy thử trên một máy tính khác** theo hướng dẫn từng bước. Trước khi nhân rộng, chúng em **chuẩn hóa quy trình thử nghiệm**, kiểm thử trên máy chủ thực tế và **tập huấn ngắn** cho giáo viên (32% giáo viên khảo sát chọn "chưa được tập huấn" là rào cản).

### Câu 10. "Dữ liệu trẻ em nhạy cảm. Đạo đức nghiên cứu và mật khẩu thử được xử lý thế nào?"
**Gợi ý:** **Không thu** họ tên, email, số điện thoại, ảnh; tham gia **tự nguyện**, dừng bất cứ lúc nào, cần **đồng ý bằng văn bản của phụ huynh**. Mật khẩu thử chỉ là **mật khẩu mẫu, xử lý ngay trên trình duyệt**; máy chủ **từ chối** mọi yêu cầu có trường mật khẩu và có kiểm thử tự động xác nhận điều này.

---

## Phần 2. Câu hỏi nhanh (trả lời 1–2 câu)

| Câu hỏi | Ý chính |
|---|---|
| Vì sao 16 câu? | Đủ ngắn để làm hết; 10 kiến thức, 6 hành vi |
| Công nghệ dùng là gì? | React, TypeScript, PHP, MySQL/MariaDB |
| Tên miền trong hoạt động có thật không? | Toàn bộ là tên **hư cấu**; hệ thống từ chối tên miền thật khi nạp nội dung |
| Vì sao 31 ký tự? | Bỏ ký tự dễ nhầm (0, O, 1, I, L) để học sinh nhập đúng |
| Giáo viên mất thẻ của học sinh thì sao? | Cấp lại thẻ có xác nhận đối chiếu sổ phát thẻ, giữ nguyên tiến độ, có nhật ký |
| Sản phẩm giúp được gì cho nhà trường? | Học liệu thực hành dùng trong giờ sinh hoạt; quy trình đo tái sử dụng |

---

## Phần 3. Mẹo ứng xử trong phòng bảo vệ

- **Trước khi vào:** tập nói thành tiếng ít nhất 3 lần với kịch bản; thống nhất ai trả lời câu kỹ thuật, ai trả lời câu về phương pháp; nhớ 6 con số: **100**, **4,61**, **3,06**, **52%**, **47%**, **321**.
- **Khi nhận câu hỏi:** hít một hơi, nhắc lại ý câu hỏi; trả lời theo ba bước (kết luận, bằng chứng, hướng phát triển); mỗi câu 30–45 giây; nhìn lần lượt các thành viên hội đồng.
- **Câu hóc búa:** không biết thì nói thật ("phần này chúng em chưa nghiên cứu sâu, theo hiểu biết hiện tại là…"); câu nhiều ý thì xin phép chia nhỏ; câu ngoài phạm vi thì đưa về phạm vi đề tài.
- **Tuyệt đối không:** bịa số liệu; khẳng định điều dự án chưa làm; tranh lời với bạn cùng nhóm.
- **Thái độ:** đứng thẳng, giọng rõ, mỉm cười; khi bị phản biện thì ghi nhận ("chúng em xin ghi nhận để hoàn thiện").

## Phần 4. Việc nên làm trước ngày bảo vệ

- [ ] Đối chiếu số liệu khảo sát với bảng gốc.
- [ ] Cả nhóm đọc lại báo cáo, Phụ lục D và tự giải thích được luồng hoạt động (Câu 6).
- [ ] Mở thử slide trên đúng thiết bị sẽ dùng; chuẩn bị bản PDF dự phòng.
- [ ] Kiểm tra slide và poster không có tên trường, tên người, đường dẫn hay mã QR.
