/**
 * Tạo ba phiếu khảo sát Google Form cho dự án An Toàn Số Học Đường.
 *
 * Cách dùng:
 * 1. Mở https://script.google.com bằng tài khoản Google của nhóm.
 * 2. Tạo dự án mới, dán toàn bộ nội dung tệp này vào, lưu lại.
 * 3. Chọn hàm taoTatCaKhaoSat rồi bấm Chạy, cấp quyền khi được hỏi.
 * 4. Xem liên kết các phiếu trong Nhật ký thực thi (Execution log).
 *
 * Chi tiết câu hỏi và lý do thiết kế: docs/KHAO_SAT_GOOGLE_FORM.md
 */

const KHAO_SAT_LOI_CAM_ON = 'Cảm ơn em (thầy/cô) đã tham gia. Phản hồi của bạn được lưu ẩn danh và chỉ dùng cho nghiên cứu.';

function taoTatCaKhaoSat() {
  const phieuA = taoPhieuHocSinhNen();
  const phieuB = taoPhieuHocSinhPhanHoi();
  const phieuC = taoPhieuGiaoVien();
  Logger.log('Phiếu A (nền, học sinh): ' + phieuA.getPublishedUrl());
  Logger.log('Phiếu B (phản hồi, học sinh): ' + phieuB.getPublishedUrl());
  Logger.log('Phiếu C (giáo viên): ' + phieuC.getPublishedUrl());
  return { phieuA: phieuA.getPublishedUrl(), phieuB: phieuB.getPublishedUrl(), phieuC: phieuC.getPublishedUrl() };
}

/* ---------- Các hàm tiện ích ---------- */

function caiDatChung(form, tieuDe, moTa) {
  form.setTitle(tieuDe);
  form.setDescription(moTa);
  // Các thiết lập dưới đây không dùng được với tài khoản Google cá nhân (không phải Workspace).
  // Bỏ qua lỗi để không dừng cả kịch bản. Mặc định của Form đã không thu email.
  thuBoQua(function () { form.setCollectEmail(false); });
  thuBoQua(function () { form.setRequireLogin(false); });
  thuBoQua(function () { form.setLimitOneResponsePerUser(false); });
  thuBoQua(function () { form.setShowLinkToRespondAgain(false); });
  thuBoQua(function () { form.setProgressBar(true); });
  form.setConfirmationMessage(KHAO_SAT_LOI_CAM_ON);
}

/** Chạy một thiết lập tùy chọn; nếu lỗi thì ghi nhật ký và tiếp tục. */
function thuBoQua(fn) {
  try {
    fn();
  } catch (e) {
    Logger.log('Bỏ qua thiết lập không hỗ trợ: ' + e.message);
  }
}

/** Câu đồng ý: "Chưa" kết thúc biểu mẫu ngay. Đặt ở trang 1. */
function themCauDongY(form, cauHoi, luaChonDongY) {
  const item = form.addMultipleChoiceItem();
  item.setTitle(cauHoi).setRequired(true);
  item.setChoices([
    item.createChoice(luaChonDongY, FormApp.PageNavigationType.CONTINUE),
    item.createChoice('Chưa', FormApp.PageNavigationType.SUBMIT)
  ]);
  return item;
}

function themTrac(form, tieu, luaChon, batBuoc) {
  form.addMultipleChoiceItem().setTitle(tieu).setChoiceValues(luaChon).setRequired(batBuoc !== false);
}

function themHopKiem(form, tieu, luaChon, batBuoc) {
  form.addCheckboxItem().setTitle(tieu).setChoiceValues(luaChon).setRequired(batBuoc === true);
}

function themThang(form, tieu, nhanTrai, nhanPhai, batBuoc) {
  form.addScaleItem()
    .setTitle(tieu)
    .setBounds(1, 5)
    .setLabels(nhanTrai, nhanPhai)
    .setRequired(batBuoc !== false);
}

function themDoanVan(form, tieu, batBuoc) {
  form.addParagraphTextItem().setTitle(tieu).setRequired(batBuoc === true);
}

function themPhan(form, tieu, moTa) {
  form.addSectionHeaderItem().setTitle(tieu).setHelpText(moTa || '');
}

/* ---------- Phiếu A: học sinh, nền ---------- */

function taoPhieuHocSinhNen() {
  const form = FormApp.create('Phiếu khảo sát nền: An Toàn Số Học Đường (học sinh)');
  caiDatChung(form,
    'Phiếu khảo sát nền: An Toàn Số Học Đường',
    'Phiếu này tìm hiểu thói quen dùng điện thoại và kinh nghiệm gặp tin nhắn đáng ngờ của em. Không có câu trả lời đúng hay sai. Không ghi họ tên. Thời gian làm khoảng 5 phút.');

  themCauDongY(form,
    'Em và phụ huynh đã đọc thông tin nghiên cứu, và phụ huynh đã đồng ý bằng văn bản cho em tham gia chưa?',
    'Rồi, em và phụ huynh đã đồng ý');

  form.addPageBreakItem().setTitle('Phần 1. Thông tin chung');
  themTrac(form, 'Em đang học khối lớp nào?', ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']);
  themHopKiem(form, 'Em thường dùng thiết bị nào để lên mạng? (chọn nhiều)',
    ['Điện thoại thông minh', 'Máy tính bảng', 'Máy tính xách tay hoặc để bàn']);
  themTrac(form, 'Mỗi ngày em dùng điện thoại hoặc máy tính khoảng bao lâu để lướt mạng và nhắn tin?',
    ['Dưới 1 giờ', 'Từ 1 đến 3 giờ', 'Trên 3 giờ']);

  form.addPageBreakItem().setTitle('Phần 2. Kinh nghiệm gặp tin đáng ngờ');
  themHopKiem(form, 'Em đã từng gặp loại tin hoặc cuộc gọi nào sau đây? (chọn nhiều)', [
    'Tin nhắn báo trúng thưởng hoặc nhận quà',
    'Cuộc gọi tự xưng nhân viên ngân hàng hoặc cơ quan',
    'Đường link đòi đăng nhập hoặc cập nhật thông tin',
    'Người lạ hỏi mã OTP hoặc mã xác thực',
    'Lời mời việc làm hoặc đầu tư nhanh',
    'Em chưa gặp loại nào'
  ]);
  themHopKiem(form, 'Khi gặp tin nhắn hoặc đường link đáng ngờ, em thường làm gì? (chọn nhiều)', [
    'Bấm vào xem thử',
    'Hỏi người lớn hoặc bạn bè',
    'Không trả lời và xóa tin',
    'Kiểm tra lại bằng số điện thoại hoặc ứng dụng chính thức',
    'Báo cáo cho nền tảng',
    'Em chưa biết nên làm gì'
  ]);
  themTrac(form, 'Người thân hoặc bạn bè của em đã từng bị lừa qua mạng chưa?',
    ['Có', 'Không', 'Em không biết']);
  themThang(form, 'Em tự tin đến mức nào khi nhận ra một tin nhắn hoặc cuộc gọi lừa đảo?',
    'Rất không tự tin', 'Rất tự tin');

  form.addPageBreakItem().setTitle('Phần 3. Nhu cầu học tập');
  themThang(form, 'Theo em, việc học cách nhận diện lừa đảo mạng cần thiết đến mức nào?',
    'Không cần thiết', 'Rất cần thiết');
  themHopKiem(form, 'Em thích học theo cách nào? (chọn nhiều)', [
    'Tình huống có nhiều lựa chọn',
    'Trò chơi hoặc đố vui',
    'Video ngắn',
    'Bài đọc có hướng dẫn',
    'Thực hành trực tiếp trên thiết bị'
  ]);
  return form;
}

/* ---------- Phiếu B: học sinh, phản hồi ---------- */

function taoPhieuHocSinhPhanHoi() {
  const form = FormApp.create('Phiếu phản hồi sau khi học: An Toàn Số Học Đường (học sinh)');
  caiDatChung(form,
    'Phiếu phản hồi sau khi học: An Toàn Số Học Đường',
    'Em vừa hoàn thành các hoạt động. Phiếu này lấy ý kiến để cải thiện bài học. Không có câu trả lời đúng hay sai. Không ghi họ tên.');

  themCauDongY(form,
    'Em và phụ huynh đã đọc thông tin nghiên cứu, và phụ huynh đã đồng ý bằng văn bản cho em tham gia chưa?',
    'Rồi, em và phụ huynh đã đồng ý');

  form.addPageBreakItem().setTitle('Phần 1. Phản hồi');
  themTrac(form, 'Hoạt động nào em thấy hữu ích nhất?', [
    'Sân chơi tình huống',
    'Thám tử tên miền',
    'Phòng thí nghiệm tài khoản',
    'Em chưa thử hoạt động nào'
  ]);
  themThang(form, 'Các hoạt động dễ sử dụng đến mức nào?', 'Rất khó', 'Rất dễ');
  themThang(form, 'Phần giải thích sau mỗi lựa chọn rõ ràng đến mức nào?', 'Không rõ', 'Rất rõ');
  themDoanVan(form, 'Điều quan trọng nhất em học được là gì? (không bắt buộc)', false);
  themTrac(form, 'Em có muốn trao đổi thêm về trải nghiệm của mình không?', [
    'Có: em sẽ liên hệ trực tiếp với người hướng dẫn, không ghi thông tin trong phiếu này',
    'Không'
  ]);
  themDoanVan(form, 'Em có góp ý nào khác không? (không bắt buộc)', false);
  return form;
}

/* ---------- Phiếu C: giáo viên ---------- */

function taoPhieuGiaoVien() {
  const form = FormApp.create('Phiếu khảo sát giáo viên: An Toàn Số Học Đường');
  caiDatChung(form,
    'Phiếu khảo sát giáo viên: An Toàn Số Học Đường',
    'Phiếu này lấy ý kiến của thầy/cô về nhu cầu và điều kiện triển khai. Không ghi tên học sinh. Thời gian làm khoảng 5 phút.');

  themCauDongY(form,
    'Thầy/cô đã đọc thông tin nghiên cứu và đồng ý tham gia chưa?',
    'Đồng ý');

  form.addPageBreakItem().setTitle('Phần 1. Thông tin và thực tế lớp học');
  themHopKiem(form, 'Thầy/cô đang dạy khối nào? (chọn nhiều)', ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9']);
  themThang(form, 'Theo thầy/cô, học sinh gặp nguy cơ lừa đảo qua mạng ở mức nào?',
    'Hầu như không', 'Rất thường xuyên');
  themTrac(form, 'Thầy/cô đã từng gặp trường hợp học sinh bị lừa qua mạng chưa?',
    ['Có', 'Không', 'Không chắc']);
  themThang(form, 'Thầy/cô tự tin đến mức nào khi hướng dẫn học sinh về an toàn số?',
    'Rất không tự tin', 'Rất tự tin');

  form.addPageBreakItem().setTitle('Phần 2. Nội dung và hình thức triển khai');
  themHopKiem(form, 'Nội dung nào cần ưu tiên nhất? (chọn nhiều)', [
    'Nhận diện lừa đảo qua tin nhắn và cuộc gọi',
    'Kiểm tra tên miền và đường link',
    'Quản lý mật khẩu và mã xác thực',
    'Quyền riêng tư trên mạng xã hội',
    'Cách xử lý khi đã bị lừa'
  ]);
  themHopKiem(form, 'Hình thức tổ chức nào phù hợp nhất với lớp? (chọn nhiều)', [
    'Tiết sinh hoạt',
    'Hoạt động ngoại khóa',
    'Học sinh tự làm trên thiết bị',
    'Lồng ghép vào môn học'
  ]);
  themHopKiem(form, 'Rào cản lớn nhất khi triển khai? (chọn nhiều)', [
    'Thiếu thời gian',
    'Thiếu thiết bị',
    'Thiếu tài liệu',
    'Chưa được tập huấn',
    'Phụ huynh chưa đồng ý',
    'Khác'
  ]);
  themTrac(form, 'Thầy/cô có sẵn sàng giới thiệu hệ thống cho học sinh sử dụng không?',
    ['Chắc chắn có', 'Có thể', 'Không']);
  themTrac(form, 'Thầy/cô lo ngại đến mức nào về quyền riêng tư dữ liệu của học sinh?',
    ['Rất lo ngại', 'Lo ngại ở mức trung bình', 'Không lo ngại lắm', 'Không lo ngại']);
  themDoanVan(form, 'Thầy/cô có góp ý nào khác không? (không bắt buộc)', false);
  return form;
}
