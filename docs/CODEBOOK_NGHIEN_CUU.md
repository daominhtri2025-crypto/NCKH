# Mã hóa dữ liệu nghiên cứu (codebook)

Tài liệu này mô tả các cột trong tệp xuất `antoanso_long.csv` và `antoanso_wide.csv`, và cách tính các biến phân tích. Dùng kèm bộ câu hỏi phiên bản `a-v1`.

## 1. Giai đoạn đo lường

| Giai đoạn | Mã | Điều kiện mở |
|---|---|---|
| Tiền kiểm (pre-test) | `pre` | Luôn mở trước mọi hoạt động |
| Hậu kiểm (post-test) | `post` | Đã hoàn thành pre-test và cả 3 hoạt động |
| Theo dõi (delayed test) | `delayed` | Đã hoàn thành post-test và đã qua `DELAYED_MIN_DAYS` ngày (mặc định 28) |

## 2. Phạm vi xuất dữ liệu

- Chỉ học sinh đã kích hoạt thẻ (`status = active`) được đưa vào tệp xuất. Thẻ đã in nhưng chưa kích hoạt không xuất hiện.
- Tài khoản giáo viên không có trong tệp xuất và không có trường nào ghi người phát thẻ.

## 3. Bảo mật dữ liệu

- Mã định danh duy nhất là `pseudonym` (dạng XXXX-XXXX, do hệ thống cấp).
- Không xuất họ tên, email, số điện thoại, thời điểm đồng ý, hay bất kỳ nội dung mật khẩu nào.
- Đề nghị không công bố bảng kết quả theo lớp khi số học sinh trong lớp dưới 5 (nguy cơ suy luận lại danh tính).

## 4. Tệp dài: `antoanso_long.csv`

Một dòng cho mỗi lần trả lời câu khảo sát.

| Cột | Ý nghĩa |
|---|---|
| `pseudonym` | Mã giả danh |
| `class_code` | Mã lớp |
| `phase` | `pre`, `post`, hoặc `delayed` |
| `item_id` | Mã câu hỏi (xem mục 6) |
| `instrument` | `knowledge` hoặc `behavior` |
| `is_correct` | 1 đúng, 0 sai (chỉ với `knowledge`; trống với `behavior`) |
| `answer_index` | Lựa chọn 0-based (chỉ với `knowledge`) |
| `answer_value` | Mức 1–4 (chỉ với `behavior`, 1 = Không bao giờ, 4 = Luôn luôn) |
| `response_ms` | Thời gian phản hồi (mili giây) |
| `content_version` | Phiên bản bộ câu hỏi |
| `answered_at` | Thời điểm trả lời |

## 5. Tệp rộng: `antoanso_wide.csv`

Một dòng cho mỗi học sinh.

| Cột | Cách tính |
|---|---|
| `{phase}_knowledge_correct` | Số câu kiến thức đúng (0–10) |
| `{phase}_knowledge_pct` | `knowledge_correct / 10 × 100` |
| `{phase}_behavior_mean_adj` | Trung bình mức hành vi sau khi đảo chiều các câu có `reverse = true` (xem mục 6) |
| `{phase}_mean_response_ms` | Trung bình thời gian phản hồi của mọi câu trong giai đoạn |
| `m1_items_answered` | Số tình huống đã trả lời trong Module 1 (tối đa 5) |
| `m2_items_answered` | Số URL đã phân loại trong Module 2 (tối đa 12) |
| `m3_steps_passed` | Số bước checklist đạt trong Module 3 (tối đa 8) |
| `m3_lab_passed` | 1 nếu đạt mức mạnh trong phòng thí nghiệm mật khẩu, 0 nếu không |

Ô trống nghĩa là học sinh chưa làm giai đoạn đó.

## 6. Bộ câu hỏi (phiên bản `a-v1`)

| Mã | Loại | Module liên quan | Nội dung | Mã hóa |
|---|---|---|---|---|
| `k01-khoa-tai-khoan` | knowledge | m1 | Em nhận tin nhắn: "Tài khoản ngân hàng của bạn bị khóa, bấm link để mở lại". Em nên làm gì? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k02-shipper-otp` | knowledge | m1 | Một người gọi tự nhận là shipper và nói cần đọc mã OTP để "xác nhận nhận hàng". Em nên làm gì? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k03-mat-khau-ngan-hang` | knowledge | m1 | Ai trong các trường hợp sau có thể yêu cầu em cung cấp mật khẩu đăng nhập ngân hàng? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k04-wifi-cong-cong` | knowledge | m1 | Khi dùng Wifi công cộng không có mật khẩu, điều gì nên tránh? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k05-ten-mien-cuoi` | knowledge | m2 | Địa chỉ https://uubnd-mophong.io.vn.tra-cuu.test/ có phần gốc (tên do đơn vị đăng ký) là gì? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k06-thay-ky-tu` | knowledge | m2 | Tên miền "uubnd-m0phong.io.vn" khác "uubnd-mophong.io.vn" ở điểm nào? | Đáp án đúng: lựa chọn thứ 0 (0 = A) |
| `k07-ten-chinh-tren-duong-dan` | knowledge | m2 | Trang web có tên chính thức của cơ quan nằm trong đường dẫn (sau dấu /), còn tên miền thật là một tên khác. Trang này có đáng tin không? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k08-mat-khau-manh` | knowledge | m3 | Trong ba mật khẩu sau, mật khẩu nào khó đoán nhất? | Đáp án đúng: lựa chọn thứ 2 (0 = A) |
| `k09-dung-chung-mat-khau` | knowledge | m3 | Dùng cùng một mật khẩu cho nhiều tài khoản có rủi ro gì? | Đáp án đúng: lựa chọn thứ 1 (0 = A) |
| `k10-xac-thuc-hai-lop` | knowledge | m3 | Xác thực hai lớp (hai yếu tố) giúp bảo vệ tài khoản như thế nào? | Đáp án đúng: lựa chọn thứ 0 (0 = A) |
| `b01-xac-thuc-hai-lop` | behavior | m3 | Em có bật xác thực hai lớp cho tài khoản mạng xã hội hoặc Zalo không? | Không đảo chiều |
| `b02-mat-khau-rieng` | behavior | m3 | Em có dùng mật khẩu khác nhau cho các tài khoản quan trọng không? | Không đảo chiều |
| `b03-bam-link-la` | behavior | m1 | Khi nhận tin nhắn có đường link lạ, em có bấm vào xem không? | Đảo chiều (điểm = 5 − mức) |
| `b04-chia-se-otp` | behavior | m1 | Em có đọc mã OTP cho người khác qua điện thoại không? | Đảo chiều (điểm = 5 − mức) |
| `b05-quyen-rieng-tu` | behavior | m3 | Em có kiểm tra cài đặt quyền riêng tư của tài khoản mạng xã hội không? | Không đảo chiều |
| `b06-xac-minh-nguoi-quen` | behavior | m1 | Khi người quen nhờ chuyển tiền qua mạng, em có gọi điện xác minh trước không? | Không đảo chiều |

Lưu ý phân tích:
- Các câu kiến thức không hiển thị đáp án và không có phản hồi đúng/sai trong lúc làm, để không ảnh hưởng đến giai đoạn sau.
- Pre-test và post-test dùng cùng bộ câu hỏi, nên có thể xảy ra hiệu ứng luyện tập. Cần nêu trong phần hạn chế của đề tài. Có thể cân nhắc bộ câu song song nếu cần kiểm soát hiệu ứng này.
- Các câu hành vi là tự báo cáo, có thể sai lệch do mong muốn xã hội.

## 7. Cách xuất dữ liệu

- Qua HTTP (cần đặt `ADMIN_TOKEN` trong `api/.env`):
  ```bash
  curl -H "X-Admin-Token: <token>" -o antoanso_wide.csv https://<tên-miền>/api/admin/export/wide.csv
  ```
- Qua dòng lệnh trên máy chủ:
  ```bash
  php api/bin/export_assessments.php wide antoanso_wide.csv
  php api/bin/export_assessments.php long antoanso_long.csv
  ```

## 8. Dữ liệu không xuất

Bảng `audit_log` (nhật ký cấp lại thẻ và thao tác quản trị) và bảng tài khoản giáo viên không nằm trong tệp xuất nghiên cứu. Bảng `audit_log` chỉ phục vụ truy vết trách nhiệm nội bộ, không dùng cho phân tích.
