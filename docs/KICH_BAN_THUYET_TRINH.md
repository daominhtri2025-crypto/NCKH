# Kịch bản thuyết trình 5 slide (khoảng 4 phút 30 giây, hai học sinh luân phiên)

Quy ước: **HS A** và **HS B** là hai học sinh trình bày. Chữ thường là **lời nói**; chữ nghiêng trong ngoặc vuông là *[chỉ dẫn thao tác]*, không đọc thành tiếng. Không nhắc tên trường, tên người, đường dẫn hay mã QR. Kịch bản khớp với báo cáo 13 trang và dàn ý slide 5 trang.

| Slide | Nội dung | Người nói | Thời gian |
|---|---|---|---|
| 1 | Giá trị và tính cấp thiết | HS A | 0:00 – 0:45 |
| 2 | Ba hoạt động, ba vai trò | HS B | 0:45 – 1:35 |
| 3 | Kiến trúc kỹ thuật và kiểm chứng | HS A | 1:35 – 2:15 |
| 4 | Bảo mật và quyền riêng tư | HS B | 2:15 – 3:00 |
| 5 | Kết quả và hướng phát triển | HS A rồi HS B | 3:00 – 4:30 |

---

## Slide 1. Giá trị và tính cấp thiết (HS A, 0:00 – 0:45)

*[Đứng thẳng, nhìn hội đồng, mỉm cười. HS B đứng bên phải, sẵn sàng cầm điều khiển.]*

**HS A:** Kính chào hội đồng giám khảo. Chúng em xin trình bày dự án **"An toàn số học đường"**: hệ thống web thực hành nhận diện **lừa đảo trực tuyến** cho học sinh trung học cơ sở.

*[Chỉ vào thẻ số liệu "52%".]*

Qua khảo sát ba phiếu, mỗi phiếu **100 bản hợp lệ**, có **52%** học sinh có người thân hoặc bạn bè từng bị lừa qua mạng, và **47%** giáo viên từng gặp học sinh bị lừa.

*[Chỉ vào thẻ "4,61".]*

Học sinh đánh giá việc học này **rất cần thiết, 4,61 trên 5**, nhưng mức tự tin chỉ **3,06**. Từ khoảng cách đó, chúng em xây dựng một hệ thống để học sinh **vừa thực hành, vừa được đo**, mà **không thu thông tin định danh**.

*[Quay sang HS B, chuyển lời.]*

## Slide 2. Ba hoạt động, ba vai trò (HS B, 0:45 – 1:35)

*[HS B bước lên nửa bước, chỉ vào bảng ba hoạt động.]*

**HS B:** Hệ thống có **ba hoạt động thực hành**. *Sân chơi tình huống* gồm năm kịch bản như cuộc gọi mạo danh, đòi mã OTP. *Thám tử không gian mạng* cho phân loại **mười hai địa chỉ** bằng cách **đọc tên miền từ phải sang trái**. *Phòng thí nghiệm tài khoản* cho thử mật khẩu và làm checklist quyền riêng tư.

*[Chỉ vào ảnh chụp màn hình tình huống.]*

Học sinh nhận phản hồi ngay nên học bằng cách **làm**.

*[Giơ tay ba nhịp khi nói ba vai trò.]*

Hệ thống có **ba vai trò**. **Học sinh** kích hoạt thẻ rồi học theo trình tự. **Giáo viên** tạo, in thẻ không ghi tên và theo dõi lớp. **Quản trị viên** quản lý bộ câu hỏi và xuất dữ liệu ẩn danh.

*[Chuyển lời cho HS A.]*

## Slide 3. Kiến trúc kỹ thuật và kiểm chứng (HS A, 1:35 – 2:15)

*[HS A chỉ vào sơ đồ kiến trúc.]*

**HS A:** Về kỹ thuật, giao diện dùng **React và TypeScript**, máy chủ **PHP**, cơ sở dữ liệu **MySQL**. Nội dung nằm trong tệp có phiên bản, **được kiểm tra tự động khi nạp**. Máy chủ **khóa trình tự**: phải làm khảo sát đầu vào trước khi học, khảo sát theo dõi chỉ mở sau **28 ngày**.

*[Nhấn mạnh con số, dừng một nhịp.]*

Hệ thống đạt **321 trên 321** kiểm tra tích hợp, **14 trên 14** kiểm thử đơn vị và **23 bước** luồng người dùng từ kích hoạt thẻ đến khảo sát theo dõi. Hệ thống cũng đã được cài và chạy thử trên một máy tính khác.

*[Chuyển lời cho HS B.]*

## Slide 4. Bảo mật và quyền riêng tư (HS B, 2:15 – 3:00)

*[HS B chỉ vào sơ đồ luồng dữ liệu.]*

**HS B:** Điểm chúng em tâm đắc nhất là **hai mã tách biệt**. **Mã thẻ** chỉ để đăng nhập, in trên thẻ không ghi tên. **Mã định danh nghiên cứu** là mã ngẫu nhiên khác, chỉ có trong dữ liệu, **không đăng nhập được**. Vì vậy ai có tệp dữ liệu cũng **không thể đăng nhập thay học sinh**.

*[Giơ ba ngón tay.]*

Thêm nữa: **mật khẩu thử không rời trình duyệt** và mã phiên chỉ lưu dạng **băm SHA-256**.

Dữ liệu ẩn danh với nhóm nghiên cứu; giáo viên phát thẻ không thấy mã nghiên cứu nên không đối chiếu được tệp dữ liệu với từng em.

*[Chuyển lời cho HS A.]*

## Slide 5. Kết quả và hướng phát triển (HS A rồi HS B, 3:00 – 4:30)

*[HS A chỉ vào số liệu giáo viên.]*

**HS A:** Về kết quả khảo sát, giáo viên đánh giá nguy cơ **3,99 trên 5**, và chọn rào cản lớn nhất là **thiếu tài liệu 42%**, **thiếu thời gian 40%**. Học sinh phản hồi hoạt động **dễ dùng 4,27** và giải thích **rõ 4,25**. Đóng góp của đề tài: một **hệ thống thực hành tái sử dụng được**, một **thiết kế đo tách nhận thức và hành vi**, và một **mô hình quyền riêng tư**.

*[Chuyển lời cho HS B.]*

**HS B:** Hệ thống **dùng ngay được trong giờ sinh hoạt**: chạy trên trình duyệt, giáo viên tự tạo và in thẻ. Hướng phát triển gồm ba việc. Một là **mở rộng quy mô khảo sát**, nhân rộng sang lớp, trường khác, có nhóm đối chứng. Hai là **kết hợp bài kiểm tra tình huống**. Ba là **hoàn thiện kỹ thuật**: giới hạn số lần đăng nhập, kiểm thử trên máy chủ thực tế. Và ở giai đoạn mở rộng, dữ liệu đo **trước, sau và 28 ngày sau** sẽ được thu thập và phân tích theo kế hoạch đã xác định.

*[Cả hai nhìn hội đồng, nói đồng thanh hoặc lần lượt hai nửa câu.]*

**HS A:** *Học để nhận ra,* **HS B:** *thực hành để nhớ, đo lường để biết có tiến bộ.* Chúng em xin cảm ơn hội đồng và sẵn sàng trả lời câu hỏi.

*[Cúi đầu nhẹ, mỉm cười, đứng sẵn tại chỗ để nhận câu hỏi.]*

---

## Phụ lục. Phòng vệ nhanh: 10 câu hỏi và câu trả lời mẫu (30–45 giây)

Quy tắc: nhắc lại ý câu hỏi, trả lời thẳng, nêu bằng chứng hoặc con số, rồi nêu hướng hoàn thiện. Người nào am hiểu phần đó thì trả lời, người kia bổ sung một câu.

| # | Câu hỏi của hội đồng | Câu trả lời mẫu |
|---|---|---|
| 1 | **Hai mã tách biệt để làm gì? Có thật sự an toàn hơn không?** | Mã thẻ chỉ để đăng nhập; mã nghiên cứu chỉ có trong dữ liệu, sinh ngẫu nhiên riêng và không suy ra được từ mã thẻ. Nhờ đó nếu tệp dữ liệu bị lộ, người khác **không đăng nhập thay học sinh được**. Mã nghiên cứu còn giữ nguyên khi cấp lại thẻ, nên dữ liệu các giai đoạn vẫn nối được. |
| 2 | **Mã thẻ 8 ký tự có bị đoán được không?** | Mã dạng XXXX-XXXX dùng bảng 31 ký tự bỏ các ký tự dễ nhầm, sinh ngẫu nhiên, khoảng 8,5 trăm tỷ tổ hợp, tương đương khoảng 40 bit. Với dữ liệu chỉ gồm câu trả lời, không có thông tin định danh, mức này phù hợp phạm vi lớp học. Trước khi triển khai rộng, chúng em sẽ **bổ sung giới hạn số lần đăng nhập** và kiểm thử trên máy chủ thực tế. |
| 3 | **Giáo viên phát thẻ thì biết học sinh nào là thẻ nào. Vậy ẩn danh ở đâu?** | Dữ liệu **ẩn danh với nhóm nghiên cứu và trong tệp xuất**. Giáo viên phát thẻ nên biết thẻ nào của em nào, nhưng chỉ thấy mã thẻ, **không thấy mã nghiên cứu**, nên không đối chiếu được tệp dữ liệu. Ranh giới này nêu trong phiếu đồng ý, sổ phát thẻ giữ riêng, và không công bố thống kê lớp dưới 5 học sinh. |
| 4 | **Vì sao đo ở ba thời điểm, vì sao 28 ngày?** | Đo trước và sau để thấy thay đổi, đo thêm sau 28 ngày để xem mức duy trì, vì nghiên cứu ở trẻ em cho thấy hiệu quả đào tạo có thể giảm sau khoảng bốn tuần (Lastdrager và cộng sự, 2017). Máy chủ khóa trình tự nên mọi học sinh đều có dữ liệu đầu vào. Kế hoạch phân tích định sẵn: Wilcoxon cho cặp trước–sau, Friedman cho ba giai đoạn. |
| 5 | **Em đã chứng minh được hiệu quả chưa?** | Chúng em **chưa kết luận về hiệu quả học tập**: dữ liệu đo ba thời điểm sẽ được thu thập ở giai đoạn mở rộng. Điều đề tài đã hoàn thành là công cụ thực hành và đo lường, kiểm thử 321/321 và 14/14, cùng khung phân tích định sẵn cho bốn giả thuyết. |
| 6 | **Khác gì video, tờ rơi hay ứng dụng có sẵn?** | Chúng em nêu khác biệt về cách tiếp cận, không nói "hơn": học sinh **thực hành** tình huống thay vì chỉ xem; **đo ba thời điểm**; **không thu thông tin định danh**; mật khẩu thử chỉ xử lý trên trình duyệt. |
| 7 | **Phần nào em tự làm, phần nào có AI hỗ trợ?** | Nhóm có dùng công cụ lập trình AI (Claude Code) để hỗ trợ viết mã, gỡ lỗi, soạn tài liệu, và đã **khai báo ở Phụ lục D**. Hệ thống **không gọi AI khi học sinh dùng**. Số liệu khảo sát tính trực tiếp từ dữ liệu thu thập. Phần chúng em tự giải thích được: câu hỏi nghiên cứu, thiết kế đo ba thời điểm, vì sao tách hai mã, luồng kích hoạt thẻ. *(Chỉ trả lời đúng với phần mình thật sự hiểu.)* |
| 8 | **Mẫu n = 100 có đủ đại diện không?** | Số liệu khảo sát dùng để **mô tả thực trạng và định hướng thiết kế** sản phẩm, trên tập mẫu của đề tài, không dùng để ước lượng cho tổng thể rộng hơn. Ở giai đoạn mở rộng, chúng em sẽ **mở rộng quy mô khảo sát** và nhân rộng sang nhiều lớp, trường. |
| 9 | **Triển khai diện rộng có khả thi không?** | Hệ thống chạy trên trình duyệt, không cài phần mềm; giáo viên tự tạo và in thẻ; đã chạy thử trên một máy tính khác theo hướng dẫn từng bước. Trước khi nhân rộng, chúng em sẽ **chuẩn hóa quy trình thử nghiệm**, kiểm thử trên máy chủ thực tế và tập huấn ngắn cho giáo viên (32% giáo viên khảo sát chọn "chưa được tập huấn" là rào cản). |
| 10 | **Dữ liệu của học sinh được bảo vệ và xin phép thế nào? Mật khẩu em cho thử có bị lưu không?** | Không thu họ tên, email, số điện thoại, ảnh; tham gia tự nguyện, có thể dừng bất cứ lúc nào, cần **đồng ý bằng văn bản của phụ huynh**. Mật khẩu thử chỉ là **mật khẩu mẫu, xử lý ngay trên trình duyệt**; máy chủ từ chối mọi yêu cầu có trường mật khẩu và có kiểm thử tự động xác nhận điều này. |

**Mẹo xử lý câu ngoài dự kiến:** nhắc lại câu hỏi để có thêm vài giây; nếu chưa chắc, nói "phần này chúng em chưa nghiên cứu sâu, theo hiểu biết hiện tại là…"; không bịa số liệu; câu nào đúng phần mình hiểu thì nhận trả lời, không tranh lời với bạn.
