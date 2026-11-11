# Bộ khảo sát Google Form: An Toàn Số Học Đường

Bộ gồm ba phiếu, tạo bằng kịch bản `scripts/google-form/tao_khao_sat.gs`:

| Phiếu | Đối tượng | Thời điểm | Số câu |
|---|---|---|---|
| A. Phiếu nền | Học sinh | Trước can thiệp (cùng lúc với khảo sát đầu vào trong ứng dụng) | 10 (kể cả câu đồng ý) |
| B. Phiếu phản hồi | Học sinh | Sau khi hoàn thành ba hoạt động | 7 (kể cả câu đồng ý) |
| C. Phiếu giáo viên | Giáo viên hướng dẫn | Một lần, trước khi triển khai | 11 (kể cả câu đồng ý) |

## Nguyên tắc thiết kế

1. **Ẩn danh.** Không hỏi họ tên, email, số điện thoại, lớp cụ thể. Không bật "Thu thập địa chỉ email" và không giới hạn một lần trả lời theo tài khoản. Chỉ hỏi khối lớp.
2. **Không trùng bộ đo lường chính.** Bộ 16 câu khảo sát kiến thức và hành vi nằm trong ứng dụng, không đưa vào Google Form. Google Form chỉ thu bối cảnh, nhận thức và phản hồi, để không làm lệch đo lường trước–sau.
3. **Phiếu đồng ý đặt ở đầu.** Nếu học sinh chọn "Chưa", biểu mẫu kết thúc ngay và không ghi nhận câu trả lời nào khác. Đồng ý điện tử không thay phiếu IVd bằng văn bản (xem mục Lưu ý).
4. **Thang đo nhất quán.** Thang 1–5 có nhãn hai đầu, dùng chung cho các câu đánh giá.
5. **Liên hệ phỏng vấn tách riêng.** Học sinh muốn tham gia trao đổi thêm không để lại thông tin trong biểu mẫu. Người hướng dẫn liên hệ trực tiếp.

---

## Phiếu A. Học sinh: Phiếu nền (trước can thiệp)

**Tiêu đề:** Phiếu khảo sát nền: An Toàn Số Học Đường

**Mô tả:** Phiếu này dùng để tìm hiểu thói quen dùng điện thoại và kinh nghiệm gặp tin nhắn đáng ngờ của em. Không có câu trả lời đúng hay sai. Không ghi họ tên. Thời gian làm khoảng 5 phút.

**Phần 0. Đồng ý tham gia** (trang 1)

| # | Câu hỏi | Kiểu | Bắt buộc |
|---|---|---|---|
| 0 | Em và phụ huynh đã đọc thông tin nghiên cứu, và phụ huynh đã đồng ý bằng văn bản cho em tham gia chưa? | Trắc nghiệm: "Rồi, em và phụ huynh đã đồng ý" (tiếp tục) / "Chưa" (kết thúc) | Có |

**Phần 1. Thông tin chung** (trang 2)

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 1 | Em đang học khối lớp nào? | Trắc nghiệm | Lớp 6, Lớp 7, Lớp 8, Lớp 9 |
| 2 | Em thường dùng thiết bị nào để lên mạng? (chọn nhiều) | Hộp kiểm | Điện thoại thông minh, Máy tính bảng, Máy tính xách tay/để bàn |
| 3 | Mỗi ngày em dùng điện thoại hoặc máy tính khoảng bao lâu để lướt mạng và nhắn tin? | Trắc nghiệm | Dưới 1 giờ, Từ 1 đến 3 giờ, Trên 3 giờ |

**Phần 2. Kinh nghiệm gặp tin đáng ngờ**

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 4 | Em đã từng gặp loại tin hoặc cuộc gọi nào sau đây? (chọn nhiều) | Hộp kiểm | Tin nhắn báo trúng thưởng hoặc nhận quà; Cuộc gọi tự xưng nhân viên ngân hàng hoặc cơ quan; Đường link đòi đăng nhập hoặc cập nhật thông tin; Người lạ hỏi mã OTP hoặc mã xác thực; Lời mời việc làm hoặc đầu tư nhanh; Em chưa gặp loại nào |
| 5 | Khi gặp tin nhắn hoặc đường link đáng ngờ, em thường làm gì? (chọn nhiều) | Hộp kiểm | Bấm vào xem thử; Hỏi người lớn hoặc bạn bè; Không trả lời và xóa tin; Kiểm tra lại bằng số điện thoại hoặc ứng dụng chính thức; Báo cáo cho nền tảng; Em chưa biết nên làm gì |
| 6 | Người thân hoặc bạn bè của em đã từng bị lừa qua mạng chưa? | Trắc nghiệm | Có, Không, Em không biết |
| 7 | Em tự tin đến mức nào khi nhận ra một tin nhắn hoặc cuộc gọi lừa đảo? | Thang 1–5 | 1: Rất không tự tin; 5: Rất tự tin |

**Phần 3. Nhu cầu học tập**

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 8 | Theo em, việc học cách nhận diện lừa đảo mạng cần thiết đến mức nào? | Thang 1–5 | 1: Không cần thiết; 5: Rất cần thiết |
| 9 | Em thích học theo cách nào? (chọn nhiều) | Hộp kiểm | Tình huống có nhiều lựa chọn; Trò chơi hoặc đố vui; Video ngắn; Bài đọc có hướng dẫn; Thực hành trực tiếp trên thiết bị |

---

## Phiếu B. Học sinh: Phiếu phản hồi (sau can thiệp)

**Tiêu đề:** Phiếu phản hồi sau khi học: An Toàn Số Học Đường

**Mô tả:** Em vừa hoàn thành các hoạt động. Phiếu này lấy ý kiến để cải thiện bài học. Không có câu trả lời đúng hay sai. Không ghi họ tên.

**Phần 0. Đồng ý** (trang 1): cùng câu 0 như Phiếu A.

**Phần 1. Phản hồi** (trang 2)

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 1 | Hoạt động nào em thấy hữu ích nhất? | Trắc nghiệm | Sân chơi tình huống; Thám tử tên miền; Phòng thí nghiệm tài khoản; Em chưa thử hoạt động nào |
| 2 | Các hoạt động dễ sử dụng đến mức nào? | Thang 1–5 | 1: Rất khó; 5: Rất dễ |
| 3 | Phần giải thích sau mỗi lựa chọn rõ ràng đến mức nào? | Thang 1–5 | 1: Không rõ; 5: Rất rõ |
| 4 | Điều quan trọng nhất em học được là gì? | Đoạn văn (không bắt buộc) | — |
| 5 | Em có muốn trao đổi thêm về trải nghiệm của mình không? | Trắc nghiệm | Có: em sẽ liên hệ trực tiếp với người hướng dẫn, không ghi thông tin trong phiếu này; Không |
| 6 | Em có góp ý nào khác không? | Đoạn văn (không bắt buộc) | — |

---

## Phiếu C. Giáo viên hướng dẫn

**Tiêu đề:** Phiếu khảo sát giáo viên: An Toàn Số Học Đường

**Mô tả:** Phiếu này lấy ý kiến của thầy/cô về nhu cầu và điều kiện triển khai. Không ghi tên học sinh. Thời gian làm khoảng 5 phút.

**Phần 0. Đồng ý** (trang 1)

| # | Câu hỏi | Kiểu | Bắt buộc |
|---|---|---|---|
| 0 | Thầy/cô đã đọc thông tin nghiên cứu và đồng ý tham gia chưa? | Trắc nghiệm: "Đồng ý" (tiếp tục) / "Chưa" (kết thúc) | Có |

**Phần 1. Thông tin và thực tế lớp học** (trang 2)

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 1 | Thầy/cô đang dạy khối nào? (chọn nhiều) | Hộp kiểm | Khối 6, Khối 7, Khối 8, Khối 9 |
| 2 | Theo thầy/cô, học sinh gặp nguy cơ lừa đảo qua mạng ở mức nào? | Thang 1–5 | 1: Hầu như không; 5: Rất thường xuyên |
| 3 | Thầy/cô đã từng gặp trường hợp học sinh bị lừa qua mạng chưa? | Trắc nghiệm | Có, Không, Không chắc |
| 4 | Thầy/cô tự tin đến mức nào khi hướng dẫn học sinh về an toàn số? | Thang 1–5 | 1: Rất không tự tin; 5: Rất tự tin |

**Phần 2. Nội dung và hình thức** (trang 3)

| # | Câu hỏi | Kiểu | Lựa chọn |
|---|---|---|---|
| 5 | Nội dung nào cần ưu tiên nhất? (chọn nhiều) | Hộp kiểm | Nhận diện lừa đảo qua tin nhắn và cuộc gọi; Kiểm tra tên miền và đường link; Quản lý mật khẩu và mã xác thực; Quyền riêng tư trên mạng xã hội; Cách xử lý khi đã bị lừa |
| 6 | Hình thức tổ chức nào phù hợp nhất với lớp? (chọn nhiều) | Hộp kiểm | Tiết sinh hoạt; Hoạt động ngoại khóa; Học sinh tự làm trên thiết bị; Lồng ghép vào môn học |
| 7 | Rào cản lớn nhất khi triển khai? (chọn nhiều) | Hộp kiểm | Thiếu thời gian; Thiếu thiết bị; Thiếu tài liệu; Chưa được tập huấn; Phụ huynh chưa đồng ý; Khác |
| 8 | Thầy/cô có sẵn sàng giới thiệu học sinh sử dụng hệ thống này không? | Trắc nghiệm | Chắc chắn có, Có thể, Không |
| 9 | Thầy/cô lo ngại đến mức nào về quyền riêng tư dữ liệu của học sinh? | Trắc nghiệm | Rất lo ngại, Lo ngại ở mức trung bình, Không lo ngại lắm, Không lo ngại |
| 10 | Thầy/cô có góp ý nào khác không? | Đoạn văn (không bắt buộc) | — |

---

## Lưu ý trước khi triển khai

- **Phiếu đồng ý bằng văn bản vẫn cần thiết.** Quy chế yêu cầu đồng ý bằng văn bản của phụ huynh trước khi thu dữ liệu học sinh. Câu 0 chỉ là xác nhận điện tử bổ sung, không thay phiếu IVd.
- **Không thu tên.** Hai phiếu học sinh không có ô họ tên. Không gắn mã thẻ vào phiếu Google Form, để giữ tách biệt với dữ liệu ứng dụng.
- **Dữ liệu Google Form lưu trong tài khoản Google của người tạo.** Xuất sang bảng tính và xóa khi kết thúc theo quy định. Không đưa lên kho mã.
- **Phiếu tham khảo không được sao chép nguyên văn.** Cấu trúc được lấy làm mẫu, còn nội dung câu hỏi được viết lại theo đề tài này.
