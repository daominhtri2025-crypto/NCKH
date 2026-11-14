# Bộ tài liệu chuẩn bị phòng vệ: "An toàn số học đường"

Tài liệu đóng vai Hội đồng giám khảo, đặt câu hỏi phản biện và gợi ý trả lời. **Nguyên tắc xuyên suốt: trả lời đúng sự thật, nhận giới hạn trước khi bị hỏi.** Hội đồng đánh giá cao học sinh hiểu rõ điểm yếu của đề tài hơn là học sinh né tránh. Mọi con số trong các câu trả lời lấy từ báo cáo chính thức. Không nhắc tên trường, học sinh hay giáo viên khi trả lời.

**Cách dùng:** đọc câu hỏi, tự trả lời thành tiếng trong 30–45 giây, rồi so với gợi ý. Không học thuộc nguyên văn; nhớ **ý chính (in đậm)** và nói bằng lời của mình.

---

## Phần 1. Mười câu hỏi phản biện và gợi ý trả lời

### Câu 1. "Chưa có dữ liệu đo trước–sau, vậy dự án chứng minh được điều gì?" (câu khó nhất, gần như chắc chắn bị hỏi)

**Gợi ý trả lời:**
Thưa hội đồng, chúng em **chưa chứng minh hiệu quả học tập**, và chúng em nói rõ điều đó ngay trên poster. Dự án đã làm được ba việc có bằng chứng: **(1)** khảo sát thực trạng 3 phiếu, mỗi phiếu 100 bản, cho thấy học sinh cần học nhưng chưa tự tin; **(2)** xây dựng xong hệ thống và **kiểm thử đạt 321 kiểm tra tích hợp, 14 kiểm thử đơn vị**; **(3)** thiết kế sẵn **kế hoạch phân tích xác định trước** (kiểm định Wilcoxon, Friedman) để khi có dữ liệu thì phân tích ngay, không chọn phương pháp theo kết quả. Câu hỏi nghiên cứu vẫn còn mở, và đó là bước tiếp theo của chúng em.

*Điểm cần tránh:* nói "hệ thống hiệu quả" hay "học sinh đã tiến bộ".

### Câu 2. "Mã thẻ chỉ 8 ký tự, có dễ bị đoán không? Hai mã tách biệt thực sự bảo mật hơn ở chỗ nào?"

**Gợi ý trả lời:**
Mã thẻ dạng XXXX-XXXX dùng bảng **31 ký tự** (bỏ các ký tự dễ nhầm như 0, O, 1, I), nên có khoảng **8,5 trăm tỷ tổ hợp, tương đương khoảng 40 bit**, sinh ngẫu nhiên. Với dữ liệu chỉ gồm các câu trả lời khảo sát, không có thông tin định danh, mức này phù hợp phạm vi trường học. Chúng em cũng **nhìn nhận đây là hạn chế**: hệ thống **chưa giới hạn số lần thử đăng nhập**, nên trước khi triển khai rộng cần bổ sung. Còn **hai mã tách biệt** giải quyết một việc cụ thể: **mã trong tệp dữ liệu nghiên cứu không dùng để đăng nhập được** và không suy ra từ mã thẻ. Nếu tệp dữ liệu bị lộ, người khác **không thể đăng nhập thay học sinh**.

### Câu 3. "Giáo viên phát thẻ thì biết thẻ nào của em nào. Vậy dữ liệu có thật sự ẩn danh không?"

**Gợi ý trả lời:**
Thưa hội đồng, **ẩn danh ở đây có ranh giới**, và chúng em đã ghi rõ trong báo cáo. Dữ liệu **ẩn danh với nhóm nghiên cứu và trong tệp xuất**, nhưng **không ẩn danh với giáo viên trực tiếp phát thẻ**. Giáo viên chỉ thấy mã thẻ, **không thấy mã định danh nghiên cứu**, nên không đối chiếu được tệp dữ liệu với học sinh. Ranh giới này được nêu trong phiếu đồng ý, và sổ phát thẻ do giáo viên giữ riêng. Khi công bố theo lớp, chúng em không công bố nhóm dưới 5 học sinh.

### Câu 4. "Số liệu khảo sát có đáng tin không? Mẫu chọn thế nào, có khái quát được không?"

**Gợi ý trả lời:**
Chúng em dùng số liệu này **chỉ để mô tả thực trạng và định hướng thiết kế**, không để khái quát cho toàn bộ học sinh. Có **hai hạn chế chúng em đã ghi trong báo cáo**: thứ nhất, biểu mẫu **được sửa trong lúc thu thập**, nên một số lựa chọn trả lời cũ và mới không so sánh được; thứ hai, **cách chọn mẫu** (lớp nào, trường nào) chưa được mô tả đầy đủ. Vì vậy phiếu phản hồi sau học, chúng em **chỉ dùng tham khảo**, và sẽ thu lại bằng biểu mẫu cố định. Với các con số 4,61, 3,06, 52%, 47%, chúng em xem đó là **gợi ý về nhu cầu**, không phải kết luận.

*Chuẩn bị:* nắm số mẫu từng phiếu (100/100/100) và ngày thu thập (01/11 – 11/11/2026). Nếu hỏi thêm về chọn mẫu mà bạn chưa có thông tin, **hãy trả lời đúng như thực tế**, đừng bịa.

### Câu 5. "Đã có nhiều video, tờ rơi, ứng dụng về an toàn mạng. Điểm khác biệt của em là gì?"

**Gợi ý trả lời:**
Chúng em **không khẳng định tốt hơn**, chỉ nêu **ba điểm khác biệt về cách tiếp cận**: **(1) thực hành** tình huống và nhận diện tên miền giả, không chỉ xem; **(2) đo ở ba thời điểm**, gồm cả **28 ngày sau**, vì nghiên cứu về trẻ em cho thấy hiệu quả đào tạo có thể giảm sau khoảng bốn tuần (Lastdrager và cộng sự, 2017); **(3) không thu thông tin định danh** học sinh. Chúng em cũng thừa nhận **chưa tổng hợp đầy đủ** các chương trình đã triển khai ở Việt Nam, nên đây là hạn chế của phần tổng quan tài liệu.

### Câu 6. "Hành vi đo bằng tự báo cáo thì không khách quan. Và dùng cùng một bộ câu hỏi 3 lần thì học sinh nhớ đáp án?"

**Gợi ý trả lời:**
Cả hai đều là **hạn chế thật**. Với tự báo cáo, học sinh có thể trả lời theo điều mình cho là "nên làm". Để giảm sai lệch, chúng em **tách riêng câu kiến thức (có đáp án) và câu hành vi**, **đảo chiều hai câu hành vi** để tránh trả lời theo quán tính, và **không phản hồi đúng sai trong khảo sát**. Về việc dùng cùng bộ câu hỏi: cách này giúp **so sánh được điểm số**, nhưng có thể **tăng điểm do nhớ**. Hướng khắc phục là **xây bộ câu song song**, đã ghi trong khuyến nghị.

### Câu 7. "Không có nhóm đối chứng, làm sao biết thay đổi là do hệ thống?"

**Gợi ý trả lời:**
Đúng vậy, thiết kế trước–sau không có nhóm đối chứng **không cho phép kết luận nhân quả**; điểm có thể thay đổi do học sinh lớn lên, do sự kiện bên ngoài hoặc do làm bài lặp lại (Shadish, Cook và Campbell, 2002). Vì vậy chúng em **sẽ diễn giải thận trọng**, chỉ báo cáo "có sự thay đổi" chứ không nói "nhờ hệ thống". Khuyến nghị của chúng em là **thiết kế nhóm đối chứng ở cấp lớp** ở giai đoạn sau. Giả thuyết H4 (dùng gợi ý và độ chính xác) cũng chỉ được diễn giải là **tương quan**.

### Câu 8. "Triển khai trên diện rộng có khả thi không? Chi phí, máy chủ, giáo viên không rành công nghệ?"

**Gợi ý trả lời:**
Hệ thống **chạy trên trình duyệt, không cài phần mềm** cho học sinh; giáo viên **tự tạo và in thẻ** bằng giao diện có sẵn, không cần tài khoản cá nhân của học sinh. Chúng em đã **chạy thử cài đặt trên một máy tính Windows khác** theo hướng dẫn từng bước. Nhưng chúng em nói thẳng **những việc chưa làm**: **chưa kiểm thử trên máy chủ thực tế**, chưa có giới hạn đăng nhập, việc tạo lớp còn dùng dòng lệnh. Vì vậy chúng em đề xuất **thí điểm ở quy mô nhỏ trước**, bổ sung các việc này rồi mới nhân rộng. Giáo viên cũng cần được **tập huấn ngắn**: 32% giáo viên trong khảo sát nói "chưa được tập huấn" là rào cản.

### Câu 9. "Em có dùng AI để làm dự án không? Phần nào do em tự làm?"

**Gợi ý trả lời:**
Có, và chúng em đã **khai báo trung thực** trong báo cáo (Phụ lục G) và phiếu khai báo công nghệ số: nhóm dùng công cụ **Claude Code** để hỗ trợ viết mã, gỡ lỗi và soạn tài liệu. Quan trọng là **hệ thống không gọi AI khi học sinh sử dụng**, nội dung hoạt động là dữ liệu tĩnh do nhóm soạn. **Số liệu khảo sát được tính trực tiếp từ dữ liệu thu thập**, không lấy từ AI. Các phần chúng em có thể giải thích tới nơi tới chốn gồm: câu hỏi nghiên cứu, thiết kế đo ba thời điểm, vì sao tách hai mã, và các hạn chế.

*Chuẩn bị bắt buộc:* trước ngày thi, **cả nhóm đọc lại và tự giải thích được** từng phần: luồng kích hoạt thẻ, ba hoạt động, hai mã, cách đo. Nếu không giải thích được phần nào, hãy nói thật và tập trung vào phần mình hiểu. Chỉ trả lời "do nhóm tự làm" khi đúng sự thật.

### Câu 10. "Dữ liệu của trẻ em nhạy cảm. Em xử lý đạo đức nghiên cứu thế nào? Mật khẩu em cho học sinh thử có bị lưu không?"

**Gợi ý trả lời:**
Về dữ liệu: **không thu họ tên, email, số điện thoại**; chỉ thu câu trả lời khảo sát và hoạt động. Tham gia **tự nguyện, có thể dừng bất cứ lúc nào**, và cần **đồng ý bằng văn bản của phụ huynh** trước khi thu dữ liệu học sinh; đồng ý điện tử chỉ bổ sung, không thay phiếu giấy. Về mật khẩu: học sinh chỉ thử **mật khẩu mẫu**, việc đánh giá chạy **ngay trên trình duyệt**; máy chủ **từ chối mọi yêu cầu có trường mật khẩu**, và có kiểm thử tự động xác nhận điều này. Chúng em cũng không dùng dịch vụ bên ngoài để kiểm tra mật khẩu.

---

## Phần 2. Câu hỏi nhanh có thể gặp (trả lời 1–2 câu)

| Câu hỏi | Ý chính để trả lời |
|---|---|
| Vì sao chọn 28 ngày? | Căn cứ nghiên cứu về trẻ em cho thấy hiệu quả có thể giảm sau khoảng 4 tuần (Lastdrager và cộng sự, 2017) |
| Vì sao 16 câu? | Đủ ngắn để học sinh làm hết, gồm 10 kiến thức và 6 hành vi; sẽ thẩm định thêm với chuyên gia |
| Công nghệ dùng là gì? | Giao diện React và TypeScript, máy chủ PHP, cơ sở dữ liệu MySQL/MariaDB |
| Vì sao dùng kiểm định phi tham số? | Mẫu nhỏ, không giả định phân phối chuẩn; Wilcoxon cho cặp trước–sau, Friedman cho ba thời điểm |
| Tên miền trong hoạt động có thật không? | Toàn bộ là tên **hư cấu**; hệ thống từ chối tên miền thật khi nạp nội dung |
| Nội dung đã được chuyên gia thẩm định chưa? | Chưa; đây là hạn chế đã nêu và là việc làm trước khi thu dữ liệu chính thức |
| Em dự định làm gì tiếp? | Thu dữ liệu trước–sau–theo dõi, bộ câu song song, nhóm đối chứng, thí điểm lớp khác |
| Sản phẩm này giúp được gì cho nhà trường? | Học liệu thực hành dùng trong giờ sinh hoạt; quy trình đo để nhà trường tự đánh giá |

---

## Phần 3. Mẹo ứng xử tâm lý trong phòng bảo vệ

### Trước khi vào phòng
1. **Tập nói thành tiếng** ít nhất 3 lần với kịch bản 3 phút, có người đóng vai giám khảo hỏi ngắt ngang.
2. **Thống nhất phân vai** trả lời: ai trả lời câu kỹ thuật, ai trả lời câu về phương pháp. Quy ước tín hiệu: bạn nào chưa trả lời thì chuyển lời, không giành nhau.
3. **Nhớ 6 con số** thật chắc: 100 bản/phiếu, 4,61, 3,06, 52%, 47%, 321 kiểm tra; và 3 thời điểm đo (trước, sau, 28 ngày).
4. **Kiểm tra lần cuối** poster không có tên trường, tên học sinh, link hay mã QR.

### Khi nhận câu hỏi
1. **Hít một hơi, nghe hết câu**, rồi nhắc lại ý chính: "Thầy cô hỏi về…, đúng không ạ?" Cách này cho thêm vài giây suy nghĩ và tránh trả lời lạc đề.
2. **Cấu trúc 3 bước:** (1) trả lời thẳng vào câu hỏi, (2) nêu bằng chứng hoặc con số, (3) nhận giới hạn và nói hướng khắc phục.
3. **Nói ngắn:** mỗi câu khoảng 30–45 giây. Nói xong thì dừng, đừng lấp khoảng im lặng.
4. **Nhìn lần lượt các thành viên hội đồng**, không chỉ người hỏi.

### Khi gặp câu hóc búa hoặc ngoài dự kiến
1. **Không biết thì nói thật:** "Phần này chúng em chưa nghiên cứu sâu. Theo hiểu biết hiện tại, chúng em nghĩ là…; nếu cần chúng em sẽ tìm hiểu và bổ sung." Hội đồng đánh giá cao sự trung thực hơn câu trả lời bịa.
2. **Câu hỏi nêu đúng điểm yếu:** đừng phòng thủ. Nói: "Thầy cô nói đúng, đây là hạn chế chúng em đã ghi ở báo cáo…" rồi chuyển sang hướng khắc phục.
3. **Câu hỏi gắt, nhiều ý:** xin phép chia nhỏ: "Chúng em xin trả lời từng ý ạ. Ý thứ nhất…"
4. **Câu hỏi chưa rõ:** hỏi lại lịch sự: "Thầy cô có thể nói rõ hơn phần … được không ạ?"
5. **Bị hỏi ngoài phạm vi** (ví dụ luật pháp, ngân hàng): đưa về phạm vi đề tài: "Phần này nằm ngoài phạm vi chúng em nghiên cứu; trong đề tài, chúng em tập trung vào…"
6. **Tuyệt đối không** bịa số liệu, không nói "chúng em đã chứng minh hiệu quả", không nói dự án có dữ liệu mà thực tế chưa có.

### Thái độ và ngôn ngữ cơ thể
- Đứng thẳng, giọng rõ, tốc độ vừa phải, **mỉm cười** khi bắt đầu và kết thúc.
- Khi giám khảo phê bình, **gật đầu ghi nhận**, không ngắt lời.
- Kết thúc mỗi câu trả lời bằng ý tích cực: "Chúng em xin ghi nhận góp ý này để hoàn thiện dự án."
- Nếu run: nhìn vào poster, chỉ tay vào khối đang nói; việc chỉ tay giúp bình tĩnh lại và dẫn hội đồng theo dõi.

---

## Phần 4. Các việc nên làm trước ngày bảo vệ

- [ ] Đối chiếu số liệu khảo sát với bảng gốc (một số lựa chọn có số người chọn trùng nhau).
- [ ] Bổ sung thông tin cách chọn mẫu và thời điểm sửa biểu mẫu để trả lời Câu 4 chắc chắn.
- [ ] Nếu kịp, thu dữ liệu thử nhỏ để có ít nhất bản mô tả trước–sau (chỉ báo cáo mô tả, không kết luận).
- [ ] Cả nhóm đọc lại báo cáo, Phụ lục G, và thử giải thích mã nguồn/luồng hoạt động bằng lời của mình (Câu 9).
- [ ] Mở thử bản trình chiếu poster trên đúng thiết bị sẽ dùng khi thi; chuẩn bị bản dự phòng.
