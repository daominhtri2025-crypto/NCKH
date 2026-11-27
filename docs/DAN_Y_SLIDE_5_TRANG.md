# Dàn ý slide thuyết trình (5 trang)

Dự án: **An toàn số học đường** – hệ thống web thực hành nhận diện lừa đảo trực tuyến cho học sinh THCS. Không ghi tên trường, tên học sinh, tên giáo viên, logo, đường dẫn hay mã QR trên slide.

---

## Slide 1. Giá trị của hệ thống

**Tiêu đề:** Học bằng thực hành, đo được, bảo vệ quyền riêng tư

- **Vấn đề:** học sinh dùng mạng thường xuyên nhưng ít được **thực hành** nhận diện lừa đảo (mạo danh, đòi mã OTP, tin trúng thưởng, trang web giả).
- **Nhu cầu từ khảo sát (n = 100 mỗi phiếu):** học sinh đánh giá việc học này **rất cần thiết 4,61/5**, mức tự tin **3,06/5**; 52% có người quen từng bị lừa qua mạng; 47% giáo viên từng gặp học sinh bị lừa.
- **Giải pháp:** hệ thống web với **3 hoạt động thực hành**, **bộ 16 câu** đo kiến thức và hành vi, **không thu thông tin định danh**.
- *Gợi ý hình:* bốn thẻ số liệu lớn (4,61 · 3,06 · 52% · 47%).

## Slide 2. Tính năng và vai trò

**Tiêu đề:** Ba hoạt động, ba vai trò

| Hoạt động | Nội dung |
|---|---|
| **Sân chơi tình huống** | 5 kịch bản; giải thích và dấu hiệu cảnh báo sau mỗi lựa chọn |
| **Thám tử không gian mạng** | 12 địa chỉ (5 thật, 7 giả); đọc tên miền từ phải sang trái |
| **Phòng thí nghiệm tài khoản** | Thử mật khẩu trên trình duyệt; checklist quyền riêng tư 8 bước |

- **Học sinh:** kích hoạt thẻ, làm khảo sát đầu vào, học, khảo sát sau, khảo sát theo dõi sau 28 ngày.
- **Giáo viên:** tạo, in thẻ 85,6 × 54 mm, cấp lại thẻ có đối chiếu sổ, theo dõi tiến độ lớp.
- **Quản trị viên:** quản lý tài khoản giáo viên, bộ câu hỏi theo phiên bản, xuất dữ liệu ẩn danh.
- *Gợi ý hình:* ảnh chụp màn hình một tình huống (dữ liệu mẫu), kèm nhãn nguồn.

## Slide 3. Kiến trúc kỹ thuật và kiểm chứng

**Tiêu đề:** Kiến trúc rõ ràng, kiểm thử tự động

- **Giao diện:** React 19, TypeScript, Tailwind CSS. **Máy chủ:** PHP 8.1+. **Cơ sở dữ liệu:** MySQL/MariaDB.
- **Nội dung tách khỏi mã nguồn:** kịch bản, câu hỏi nằm trong tệp JSON có phiên bản, được kiểm tra khi nạp; mọi tên miền trong học liệu là tên hư cấu.
- **Khóa trình tự ở máy chủ:** khảo sát đầu vào, ba hoạt động, khảo sát sau, khảo sát theo dõi (đủ 28 ngày).
- **Kiểm chứng:** **321/321** kiểm tra tích hợp · **14/14** kiểm thử đơn vị · **23 bước** luồng người dùng · biên dịch nghiêm ngặt · bố cục điện thoại và máy tính.
- **Chạy thử** trên một máy tính Windows khác theo hướng dẫn từng bước.
- *Gợi ý hình:* Hình 1 của báo cáo (sơ đồ kiến trúc), có nhãn nguồn.

## Slide 4. Bảo mật và quyền riêng tư

**Tiêu đề:** Quyền riêng tư theo thiết kế

- **Tối thiểu hóa dữ liệu:** không thu họ tên, email, số điện thoại, ảnh.
- **Hai mã tách biệt:**
  - **Mã thẻ** (XXXX-XXXX, ngẫu nhiên, khoảng 40 bit): chỉ để đăng nhập, in trên thẻ không ghi tên.
  - **Mã định danh nghiên cứu** (R + 9 ký tự): chỉ có trong dữ liệu, **không đăng nhập được**, giữ nguyên khi cấp lại thẻ.
- **Mật khẩu thử không rời trình duyệt;** máy chủ từ chối mọi yêu cầu có trường mật khẩu.
- **Mã phiên chỉ lưu dạng băm SHA-256;** phân quyền kiểm tra ở máy chủ cho mọi thao tác.
- **Ranh giới ẩn danh:** dữ liệu ẩn danh với nhóm nghiên cứu và trong tệp xuất; giáo viên phát thẻ biết thẻ nào của học sinh nào nhưng không thấy mã nghiên cứu.
- *Gợi ý hình:* Hình 3 của báo cáo (luồng dữ liệu).

## Slide 5. Kết quả khảo sát và hướng phát triển

**Tiêu đề:** Từ nhu cầu thực tế đến mở rộng quy mô

- **Kết quả khảo sát:**
  - Giáo viên: nguy cơ 3,99/5; tự tin khi hướng dẫn 3,39/5; rào cản: thiếu tài liệu 42%, thiếu thời gian 40%, chưa được tập huấn 32%.
  - Học sinh đánh giá hoạt động dễ dùng 4,27/5, giải thích rõ 4,25/5.
- **Đóng góp:** hệ thống thực hành tái sử dụng được · thiết kế đo tách nhận thức và hành vi · mô hình quyền riêng tư cho nghiên cứu có học sinh.
- **Hướng phát triển:**
  1. Dữ liệu đo trước – sau – theo dõi sẽ được thu thập và phân tích ở giai đoạn mở rộng.
  2. Mở rộng quy mô khảo sát; chuẩn hóa quy trình thử nghiệm; nhóm đối chứng ở cấp lớp.
  3. Kết hợp bài kiểm tra tình huống và đo lường trên hệ thống; bộ câu hỏi song song.
  4. Hoàn thiện kỹ thuật: giới hạn số lần đăng nhập, kiểm thử trên máy chủ thực tế; duy trì tách biệt mã nghiên cứu với mã đăng nhập.
- **Câu chốt:** *Học để nhận ra, thực hành để nhớ, đo lường để biết có tiến bộ.*
