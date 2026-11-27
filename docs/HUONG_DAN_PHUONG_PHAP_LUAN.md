# Hướng dẫn nắm vững phương pháp luận (dành cho giáo viên hướng dẫn và hai học sinh)

Tài liệu giải thích ba trụ cột: **cách nghiên cứu**, **cách xử lý số liệu**, **cách kiểm chứng**, và cuối cùng là bốn câu "kim chỉ nam" để trả lời hội đồng. Mọi chi tiết dưới đây đã được đối chiếu với mã nguồn (`api/`, `scripts/`) và báo cáo 13 trang. Chỗ nào là **kế hoạch (chưa làm)** thì ghi rõ.

---

## Trụ cột 1. Cách thức nghiên cứu

### 1.1. Quy trình vận hành từ đầu đến cuối

| Bước | Ai làm | Việc gì xảy ra |
|---|---|---|
| 0 | Nhóm / quản trị | Tạo lớp, tạo tài khoản giáo viên |
| 1 | Giáo viên | Tạo thẻ trong hệ thống (tối đa 20 thẻ mỗi lần), in thẻ (10 thẻ/trang A4), ghi **sổ phát thẻ riêng** |
| 2 | Học sinh | Nhập (hoặc quét) mã thẻ XXXX-XXXX, đọc phiếu đồng ý, tích đồng ý → thẻ **kích hoạt** (mỗi thẻ một lần) |
| 3 | Học sinh | **Khảo sát đầu vào (pre)**: 16 câu. Chưa làm xong thì máy chủ **khóa** ba hoạt động |
| 4 | Học sinh | Làm **ba hoạt động** (Sân chơi tình huống, Thám tử không gian mạng, Phòng thí nghiệm tài khoản) |
| 5 | Học sinh | **Khảo sát sau (post)**: cùng 16 câu. Chỉ mở khi đã xong pre và cả ba hoạt động |
| 6 | Học sinh | **Khảo sát theo dõi (delayed)**: cùng 16 câu, chỉ mở sau **28 ngày** kể từ khi xong post (máy chủ tính ngày, học sinh không "mở sớm" được) |
| 7 | Quản trị | Xuất dữ liệu ẩn danh (CSV) để phân tích |

Điều học sinh cần nói được: *"Mỗi em đi qua cùng một lộ trình, máy chủ kiểm soát thứ tự, nên em nào cũng có điểm xuất phát trước khi học."*

### 1.2. Vì sao đo ba thời điểm (Trước – Sau – 28 ngày sau)?

Hình dung việc đo cân nặng khi tập luyện: muốn biết có thay đổi, phải có **mốc ban đầu**; muốn biết hiệu quả có **còn giữ được** không, phải đo lại sau một thời gian.

- **Trước (pre):** điểm xuất phát của **chính từng em**. Mỗi học sinh tự là "đối chứng" của mình (so với bản thân, không so với bạn khác).
- **Sau (post):** thay đổi ngay sau khi học. Trả lời Q1 (kiến thức) và Q3 (hành vi).
- **28 ngày sau (delayed):** mức **duy trì**. Căn cứ: nghiên cứu ở trẻ em cho thấy kết quả đào tạo nhận diện lừa đảo có thể **giảm sau khoảng bốn tuần** (Lastdrager và cộng sự, 2017). Trả lời Q2.
- Chỉ đo "sau" mà không có "trước" thì không biết em đã biết sẵn hay mới học; chỉ đo ngay sau khi học thì không biết có nhớ lâu không.

### 1.3. Vì sao tách 10 câu kiến thức khỏi 6 câu hành vi?

Hai loại câu **đo hai thứ khác nhau** và có **cách chấm khác nhau**:

| | 10 câu kiến thức | 6 câu hành vi |
|---|---|---|
| Đo gì | Em **biết** cách xử lý đúng không? | Em **có làm** như vậy không? |
| Có đáp án đúng? | Có, một đáp án đúng trong ba lựa chọn | Không; em chọn mức thường xuyên của mình |
| Cách chấm | Số câu đúng, 0–10 | Trung bình mức trả lời (1–4: không bao giờ, thỉnh thoảng, thường xuyên, luôn luôn) |
| Chiều đảo | Không | Hai câu đảo chiều (bấm đường dẫn lạ, chia sẻ mã OTP): điểm = 5 − mức trả lời, để giá trị cao luôn là hành vi an toàn hơn |

Vì sao phải tách: **biết chưa chắc làm**. Nếu trộn chung, một em biết đúng nhưng vẫn bấm link lạ sẽ bị "che" mất. Tách riêng cho phép phát hiện trường hợp *kiến thức tăng mà hành vi chưa đổi*. Trong khảo sát, hệ thống **không báo đúng sai** để câu trả lời không bị ảnh hưởng bởi phản hồi.

### 1.4. Cơ chế gắn dữ liệu mà vẫn ẩn danh: hệ thống biết "cùng một em" bằng cách nào?

Chìa khóa: hệ thống **không cần biết em là ai**, chỉ cần biết **"đây là cùng một người"**.

1. Mỗi học sinh có **một hàng trong bảng `participants`** (hệ thống tự gán số nội bộ). Thẻ mang **mã thẻ** XXXX-XXXX; em đăng nhập bằng mã này ở cả ba mốc.
2. Mỗi câu trả lời được lưu trong bảng `assessments_self` kèm **số nội bộ của em, giai đoạn (pre/post/delayed) và mã câu hỏi**. Cơ sở dữ liệu có ràng buộc **duy nhất** cho bộ ba (em, giai đoạn, câu hỏi): mỗi câu chỉ được trả lời một lần ở mỗi giai đoạn.
3. Khi xuất dữ liệu, mỗi em hiện ra bằng **mã định danh nghiên cứu** (R + 9 ký tự ngẫu nhiên), **không phải mã thẻ**. Cùng một em thì **luôn cùng một mã R** ở cả ba mốc, nên ghép cặp được: dòng của em R7K… có `pre_`, `post_`, `delayed_` trên cùng một hàng (tệp dạng rộng).
4. Mã R **không đăng nhập được** và **không suy ra được** từ mã thẻ. Nếu em mất thẻ và được cấp thẻ mới, **mã R giữ nguyên**, nên dữ liệu ba mốc vẫn nối được.
5. Không có họ tên, email, số điện thoại ở bất kỳ bước nào.

**Ranh giới cần nói thật:** giáo viên phát thẻ biết thẻ nào của em nào, nhưng chỉ thấy mã thẻ, **không thấy mã R**; vì vậy giáo viên không đối chiếu được tệp dữ liệu với từng em. Dữ liệu ẩn danh với nhóm nghiên cứu và trong tệp xuất.

*Lưu ý:* tệp dạng rộng chỉ gồm học sinh đang hoạt động (đã kích hoạt thẻ).

---

## Trụ cột 2. Cách xử lý số liệu

### 2.1. Bộ số liệu khảo sát hiện có (Phiếu A, B, C; n = 100 mỗi phiếu)

Dữ liệu từ Google Form xuất ra CSV, rồi chạy chương trình `scripts/survey/phan_tich_khao_sat.py`. **Làm đúng những gì chương trình thực sự làm**, không nói hơn:

1. **Lọc phiếu hợp lệ:** chỉ giữ dòng có câu đồng ý = "Rồi, em và phụ huynh đã đồng ý" (học sinh) hoặc "Đồng ý" (giáo viên). Mỗi phiếu có **100 bản hợp lệ**. Các phản hồi thử do nhóm tạo không được tính.
2. **Không đọc cột định danh:** biểu mẫu vốn không hỏi họ tên, email, số điện thoại.
3. **Dữ liệu thiếu:** một câu để trống thì **bỏ qua riêng câu đó** khi tính, không điền giá trị thay thế.
4. **Về lọc trùng:** biểu mẫu **ẩn danh** (không có mã nhận diện) nên **không có cơ sở để phát hiện bản trùng**. Nếu hội đồng hỏi, trả lời đúng như vậy: ẩn danh là chủ đích để bảo vệ học sinh.
5. **Câu thang 1–5:** tính **trung bình** và **độ lệch chuẩn (SD)**. Chương trình dùng SD **tổng thể** (chia cho n), không phải SD mẫu (chia cho n − 1). Với n = 100 chênh lệch rất nhỏ (khoảng 0,5%; ví dụ 1,19 thành khoảng 1,20); báo cáo chưa ghi rõ loại SD, nên nếu bị hỏi, nói rõ đây là SD tổng thể.
6. **Câu chọn một:** đếm số người chọn, tỷ lệ = số người chọn ÷ 100.
7. **Câu chọn nhiều:** tách các lựa chọn, tỷ lệ tính trên **số người trả lời** (nên tổng có thể lớn hơn 100%).
8. **Dấu †:** lựa chọn có trong dữ liệu nhưng không còn trong biểu mẫu hiện hành được **giữ nguyên và đánh dấu**, tỷ lệ trình bày riêng.

Mục đích của các chỉ số này là **mô tả thực trạng và định hướng thiết kế**, không phải kiểm định giả thuyết.

### 2.2. Dữ liệu đo trên hệ thống (Trước – Sau – 28 ngày): quy trình xuất

- Quản trị viên tải hai tệp **CSV** (UTF-8, mở được bằng Excel): **dạng dài** (mỗi dòng một câu trả lời: mã R, lớp, giai đoạn, mã câu, đúng/sai, mức hành vi, thời gian phản hồi, thời điểm) và **dạng rộng** (mỗi dòng một học sinh: số câu kiến thức đúng, tỷ lệ %, điểm hành vi đã đảo chiều, thời gian phản hồi trung bình ở mỗi giai đoạn). Hệ thống chỉ xuất **CSV**, không có JSON.
- Tệp **không** chứa họ tên, email, số điện thoại, **mã thẻ**, thời điểm đồng ý hay mật khẩu.
- Đây là dữ liệu **thuộc giai đoạn thu thập tiếp theo**: kế hoạch phân tích dưới đây là kế hoạch, chưa thực hiện.

### 2.3. Vì sao dùng kiểm định phi tham số, và mỗi kiểm định trả lời câu nào?

**Lý do chọn phi tham số (nói đơn giản):** kiểm định tham số thông thường (như t-test) cần dữ liệu có hình dạng "hình chuông" gần chuẩn. Dữ liệu của đề tài **không đáp ứng tốt**: điểm kiến thức chỉ có 11 giá trị (0–10) và dễ dồn về điểm cao; điểm hành vi là **thang thứ bậc** (1–4); mẫu lớp học thường nhỏ. Kiểm định phi tham số **chỉ dùng thứ hạng**, không đòi hỏi hình dạng phân phối, nên an toàn hơn.

| Câu hỏi | Giả thuyết | So sánh gì | Kiểm định | Hiểu đơn giản |
|---|---|---|---|---|
| **Q1** Kiến thức trước–sau có khác? | H1 | Điểm kiến thức pre và post của **cùng em** | **Wilcoxon signed-rank** (cặp) | Xem hiệu số của từng em, xếp hạng độ lớn, kiểm tra thiên về tăng hay giảm |
| **Q2** Còn duy trì sau 28 ngày? | H2 | pre với delayed (và cả ba mốc) | **Wilcoxon** (pre–delayed); **Friedman** cho ba mốc | Friedman là "Wilcoxon mở rộng" cho 3 lần đo lặp |
| **Q3** Hành vi có thay đổi? | H3 | Điểm hành vi (sau đảo chiều) pre và post | **Wilcoxon** | Như Q1 nhưng với điểm hành vi |
| **Q4** Dùng gợi ý có liên quan đến chính xác? | H4 | Độ chính xác khi phân loại tên miền: nhóm dùng gợi ý và không | **Mann-Whitney** (hai nhóm độc lập) hoặc **Spearman** (tương quan thứ hạng) | Chỉ diễn giải là **tương quan**, không phải nhân quả |

Quy ước phân tích: mức ý nghĩa **α = 0,05**; kích thước hiệu ứng **r = Z/√N**; chỉ phân tích **các cặp đầy đủ**, không điền thay giá trị thiếu; báo cáo số cặp và tỷ lệ bỏ dở.

**Vì sao nói "định sẵn":** chọn kiểm định **trước khi** thấy kết quả để không bị nghi là chọn phép nào ra kết quả đẹp.

---

## Trụ cột 3. Cách kiểm chứng

### 3.1. Ba lớp bằng chứng

1. **Kiểm thử tự động** chạy lại được bất cứ lúc nào (kết quả có thể kiểm tra trực tiếp trước hội đồng).
2. **Ràng buộc cứng trong cơ sở dữ liệu và máy chủ** (không phụ thuộc vào việc "ai đó nhớ làm đúng").
3. **Tách bạch** giữa kiểm chứng kỹ thuật và kết quả nghiên cứu.

### 3.2. Giải thích từng con số

**(a) 321/321 kiểm tra tích hợp.** Chạy bằng `DB_NAME=antoanso_test php api/tests/run.php` trên một cơ sở dữ liệu **thử nghiệm riêng** (không dùng dữ liệu thật). "Tích hợp" nghĩa là gọi vào **API thật** như một người dùng thật và kiểm tra kết quả. Các nhóm chính (lấy từ chính chương trình):
- thẻ mã và kích hoạt; xác thực phiên;
- ba hoạt động (Sân chơi, Thám tử, Phòng thí nghiệm) và kiểm tra **nội dung** kịch bản/checklist (ví dụ mọi tên miền đều hư cấu, mỗi tình huống có lựa chọn an toàn);
- khảo sát tiền–hậu–theo dõi và **khóa trình tự**; xuất dữ liệu; tách mã định danh khỏi mã đăng nhập;
- giáo viên (xem tiến độ, **không lộ câu trả lời**, cách ly giữa các lớp); quản trị (phân quyền, chống SQL injection); cấp lại thẻ giữ tiến độ; bộ câu hỏi theo phiên bản.
Kết quả: **321 đạt, 0 lỗi**.

**14/14 kiểm thử đơn vị.** Kiểm tra **một hàm riêng lẻ**: bộ chấm độ mạnh mật khẩu (tệp `web/tests/passwordStrength.test.ts`): mật khẩu ngắn, chuỗi liên tiếp, lặp ký tự, năm sinh, mật khẩu thông dụng... có bị trừ điểm đúng không. Khác với tích hợp: đơn vị = một viên gạch, tích hợp = cả bức tường.

**(b) 23 bước luồng người dùng.** Tệp `scripts/smoke-test.mjs`: một "học sinh ảo" đi hết lộ trình qua đường HTTP như trình duyệt thật: kích hoạt thẻ → thử vào hoạt động khi chưa làm pre (phải bị **từ chối 403**) → làm đủ 16 câu pre → làm 5 tình huống, 12 địa chỉ, 8 bước phòng thí nghiệm → gửi thử trường mật khẩu (phải bị **từ chối 422**) → làm post → xác nhận khảo sát theo dõi **đang khóa** và có ngày mở dự kiến (28 ngày). Mỗi mục "đạt" là một điểm kiểm tra; tổng **23 đạt, 0 lỗi**. Hai bộ kiểm thử bổ trợ nhau: tích hợp kiểm tra **từng chức năng**, luồng kiểm tra **cả hành trình**.

**(c) Tách mã đăng nhập (XXXX-XXXX) và mã nghiên cứu (R…).** Bằng chứng:
- Hai cột riêng trong cơ sở dữ liệu, mỗi cột có ràng buộc **duy nhất**.
- Mã R sinh ngẫu nhiên độc lập, **không tính từ mã thẻ**.
- Có nhóm kiểm thử riêng "Tách mã định danh nghiên cứu khỏi mã đăng nhập", xác nhận **không mã thẻ nào xuất hiện trong hai tệp xuất** và mã R không dùng để đăng nhập được.
- Mã phiên trong cơ sở dữ liệu chỉ lưu dạng **băm SHA-256**.

**(d) Kiểm tra tính toàn vẹn của tệp xuất.** Nói đúng hiện trạng:
- Tệp xuất được **tạo trực tiếp từ cơ sở dữ liệu** bằng một đoạn mã cố định, có kiểm thử tự động xác nhận **nội dung và cấu trúc cột** (kể cả việc không chứa mã thẻ).
- Số liệu trong cơ sở dữ liệu **không thể ghi trùng**: ràng buộc duy nhất (em, giai đoạn, câu hỏi); thứ tự các giai đoạn bị máy chủ khóa; bộ câu hỏi có **phiên bản bất biến** nên mỗi em được chấm đúng bộ đã ghim.
- Hệ thống **chưa tự tạo mã kiểm tra (checksum)** cho tệp xuất. Cách làm thực tế nhóm nên áp dụng khi thu dữ liệu thật: lưu tệp gốc ngay khi xuất, ghi lại **mã SHA-256 của tệp** và **số dòng**, mọi chỉnh lý (nếu có) làm trên **bản sao** và ghi nhật ký. Đây là quy trình, không phải tính năng đã có; đừng nói là "hệ thống có sẵn chữ ký số".

### 3.3. "Số liệu không bị chỉnh sửa" được chứng minh thế nào?

- **Khảo sát Google Form:** số liệu trong báo cáo được **tính bằng chương trình** từ tệp CSV xuất ra, không nhập tay; ai có tệp gốc chạy lại sẽ ra cùng kết quả (tệp gốc không đưa vào kho mã vì lý do riêng tư).
- **Dữ liệu trên hệ thống:** do máy chủ ghi trực tiếp, học sinh không sửa được sau khi trả lời (một câu một lần mỗi giai đoạn).

---

## Trụ cột 4. Bốn câu "kim chỉ nam" để trả lời hội đồng

1. **"Chúng em đo mỗi học sinh ba lần, bằng đúng bộ 16 câu, và tách 'biết' khỏi 'làm', để thấy được cả thay đổi lẫn mức duy trì."**
2. **"Hệ thống chỉ cần biết đây là cùng một em, không cần biết em là ai: mã nghiên cứu ngẫu nhiên nối dữ liệu ba mốc, còn mã thẻ đăng nhập không bao giờ xuất hiện trong dữ liệu."**
3. **"Số liệu khảo sát được tính bằng chương trình từ tệp gốc; còn dữ liệu đo trên hệ thống sẽ được phân tích bằng kiểm định phi tham số đã chọn từ trước: Wilcoxon, Friedman, Mann-Whitney hoặc Spearman."**
4. **"Chúng em kiểm chứng ở ba mức: 321 kiểm tra tích hợp, 14 kiểm thử đơn vị và 23 bước luồng người dùng, kèm ràng buộc trong cơ sở dữ liệu; ai cũng chạy lại được."**

**Khi bị hỏi sâu mà chưa chắc:** "Phần này chúng em hiểu như sau…; chi tiết cụ thể nằm ở mục … của báo cáo, chúng em xin phép trả lời thêm sau." Không bịa; không nói hệ thống có tính năng mà thực tế chưa có (ví dụ chữ ký số cho tệp xuất, xuất JSON).
