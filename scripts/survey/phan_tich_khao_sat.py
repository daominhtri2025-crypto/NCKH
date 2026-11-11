#!/usr/bin/env python3
"""Tính bảng số liệu từ tệp CSV xuất từ Google Sheets (Responses → Link to Sheets → Tải xuống .csv).

Cách dùng:
  python3 scripts/survey/phan_tich_khao_sat.py <phieu> <file.csv> [--demo]
  <phieu> là A, B hoặc C. Thêm --demo khi chạy trên dữ liệu minh họa để báo cáo có nhãn rõ ràng.

Chỉ tính trên các phiếu có câu đồng ý = "Rồi..." (học sinh) hoặc "Đồng ý" (giáo viên).
Không đọc, không xuất cột định danh (nếu có).
"""
import csv
import statistics
import sys
from collections import Counter

CONSENT_YES = {'A': 'Rồi, em và phụ huynh đã đồng ý', 'B': 'Rồi, em và phụ huynh đã đồng ý', 'C': 'Đồng ý'}
CONSENT_Q = {
    'A': 'Em và phụ huynh đã đọc thông tin nghiên cứu, và phụ huynh đã đồng ý bằng văn bản cho em tham gia chưa?',
    'B': 'Em và phụ huynh đã đọc thông tin nghiên cứu, và phụ huynh đã đồng ý bằng văn bản cho em tham gia chưa?',
    'C': 'Thầy/cô đã đọc thông tin nghiên cứu và đồng ý tham gia chưa?',
}

# Đặc tả câu hỏi: (kiểu, tiêu đề, lựa chọn). Kiểu: 'tn' trắc nghiệm, 'hk' hộp kiểm, 'thang' 1–5, 'doan' đoạn văn.
SPEC = {
    'A': [
        ('tn', 'Em đang học khối lớp nào?', ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9']),
        ('hk', 'Em thường dùng thiết bị nào để lên mạng? (chọn nhiều)', ['Điện thoại thông minh', 'Máy tính bảng', 'Máy tính xách tay hoặc để bàn']),
        ('tn', 'Mỗi ngày em dùng điện thoại hoặc máy tính khoảng bao lâu để lướt mạng và nhắn tin?', ['Dưới 1 giờ', 'Từ 1 đến 3 giờ', 'Trên 3 giờ']),
        ('hk', 'Em đã từng gặp loại tin hoặc cuộc gọi nào sau đây? (chọn nhiều)', ['Tin nhắn báo trúng thưởng hoặc nhận quà', 'Cuộc gọi tự xưng nhân viên ngân hàng hoặc cơ quan', 'Đường link đòi đăng nhập hoặc cập nhật thông tin', 'Người lạ hỏi mã OTP hoặc mã xác thực', 'Lời mời việc làm hoặc đầu tư nhanh', 'Em chưa gặp loại nào']),
        ('hk', 'Khi gặp tin nhắn hoặc đường link đáng ngờ, em thường làm gì? (chọn nhiều)', ['Bấm vào xem thử', 'Hỏi người lớn hoặc bạn bè', 'Không trả lời và xóa tin', 'Kiểm tra lại bằng số điện thoại hoặc ứng dụng chính thức', 'Báo cáo cho nền tảng', 'Em chưa biết nên làm gì']),
        ('tn', 'Người thân hoặc bạn bè của em đã từng bị lừa qua mạng chưa?', ['Có', 'Không', 'Em không biết']),
        ('thang', 'Em tự tin đến mức nào khi nhận ra một tin nhắn hoặc cuộc gọi lừa đảo?', None),
        ('thang', 'Theo em, việc học cách nhận diện lừa đảo mạng cần thiết đến mức nào?', None),
        ('hk', 'Em thích học theo cách nào? (chọn nhiều)', ['Tình huống có nhiều lựa chọn', 'Trò chơi hoặc đố vui', 'Video ngắn', 'Bài đọc có hướng dẫn', 'Thực hành trực tiếp trên thiết bị']),
    ],
    'B': [
        ('tn', 'Hoạt động nào em thấy hữu ích nhất?', ['Sân chơi tình huống', 'Thám tử tên miền', 'Phòng thí nghiệm tài khoản', 'Em chưa thử hoạt động nào']),
        ('thang', 'Các hoạt động dễ sử dụng đến mức nào?', None),
        ('thang', 'Phần giải thích sau mỗi lựa chọn rõ ràng đến mức nào?', None),
        ('tn', 'Em có muốn trao đổi thêm về trải nghiệm của mình không?', ['Có: em sẽ liên hệ trực tiếp với người hướng dẫn, không ghi thông tin trong phiếu này', 'Không']),
    ],
    'C': [
        ('hk', 'Thầy/cô đang dạy khối nào? (chọn nhiều)', ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9']),
        ('thang', 'Theo thầy/cô, học sinh gặp nguy cơ lừa đảo qua mạng ở mức nào?', None),
        ('tn', 'Thầy/cô đã từng gặp trường hợp học sinh bị lừa qua mạng chưa?', ['Có', 'Không', 'Không chắc']),
        ('thang', 'Thầy/cô tự tin đến mức nào khi hướng dẫn học sinh về an toàn số?', None),
        ('hk', 'Nội dung nào cần ưu tiên nhất? (chọn nhiều)', ['Nhận diện lừa đảo qua tin nhắn và cuộc gọi', 'Kiểm tra tên miền và đường link', 'Quản lý mật khẩu và mã xác thực', 'Quyền riêng tư trên mạng xã hội', 'Cách xử lý khi đã bị lừa']),
        ('hk', 'Hình thức tổ chức nào phù hợp nhất với lớp? (chọn nhiều)', ['Tiết sinh hoạt', 'Hoạt động ngoại khóa', 'Học sinh tự làm trên thiết bị', 'Lồng ghép vào môn học']),
        ('hk', 'Rào cản lớn nhất khi triển khai? (chọn nhiều)', ['Thiếu thời gian', 'Thiếu thiết bị', 'Thiếu tài liệu', 'Chưa được tập huấn', 'Phụ huynh chưa đồng ý', 'Khác']),
        ('tn', 'Thầy/cô có sẵn sàng giới thiệu hệ thống cho học sinh sử dụng không?', ['Chắc chắn có', 'Có thể', 'Không']),
        ('tn', 'Thầy/cô lo ngại đến mức nào về quyền riêng tư dữ liệu của học sinh?', ['Rất lo ngại', 'Lo ngại ở mức trung bình', 'Không lo ngại lắm', 'Không lo ngại']),
    ],
}

def cot_tu_form(headers, tieu_de):
    """Tìm cột theo tiêu đề câu hỏi (Google Sheets dùng nguyên văn tiêu đề làm tên cột)."""
    for i, h in enumerate(headers):
        if h.strip() == tieu_de:
            return i
    return None

def tom_tat(phieu, duong_dan, demo):
    with open(duong_dan, encoding='utf-8-sig', newline='') as f:
        rows = list(csv.reader(f))
    headers, data = rows[0], rows[1:]
    ci_consent = cot_tu_form(headers, CONSENT_Q[phieu])
    if ci_consent is None:
        raise SystemExit('Không tìm thấy cột câu đồng ý. Kiểm tra lại tệp xuất.')
    hop_le = [r for r in data if len(r) > ci_consent and r[ci_consent].strip() == CONSENT_YES[phieu]]
    n_tong, n = len(data), len(hop_le)

    out = []
    if demo:
        out.append('> **DỮ LIỆU MINH HỌA, KHÔNG DÙNG CHO HỒ SƠ DỰ THI.** Các số dưới đây chỉ để kiểm tra cách tạo báo cáo.\n')
    out.append(f'## Phiếu {phieu}\n')
    out.append('† Lựa chọn quan sát được trong dữ liệu nhưng không có trong biểu mẫu hiện tại (biểu mẫu đã được sửa trong lúc thu thập).\n')
    out.append(f'- Tổng số dòng phản hồi: {n_tong}')
    out.append(f'- Phiếu hợp lệ (đã đồng ý tham gia): {n}\n')

    for kieu, tieu_de, lua_chon in SPEC[phieu]:
        ci = cot_tu_form(headers, tieu_de)
        out.append(f'### {tieu_de}\n')
        if ci is None:
            out.append('*Không có cột tương ứng trong tệp.*\n')
            continue
        gia_tri = [r[ci].strip() for r in hop_le if len(r) > ci and r[ci].strip()]
        if kieu == 'thang':
            so = [int(v) for v in gia_tri if v.isdigit() and 1 <= int(v) <= 5]
            if so:
                out.append(f'- Số trả lời: {len(so)}; trung bình {statistics.mean(so):.2f}; độ lệch chuẩn {statistics.pstdev(so):.2f}\n')
            else:
                out.append('*Chưa có trả lời.*\n')
        elif kieu == 'hk':
            tokens = [t.strip() for v in gia_tri for t in v.split(';') if t.strip()]
            dem = Counter(tokens)
            # Lựa chọn quan sát được nhưng không có trong biểu mẫu hiện tại được giữ và đánh dấu.
            extra = sorted(set(dem) - set(lua_chon))
            out.append('| Lựa chọn | Số em chọn | Tỉ lệ (%) |\n|---|---|---|')
            for opt in list(lua_chon) + extra:
                k = dem.get(opt, 0)
                ghi = '' if opt in lua_chon else ' †'
                out.append(f'| {opt}{ghi} | {k} | {100 * k / max(n, 1):.1f} |')
            out.append('')
        elif kieu == 'tn':
            dem = Counter(gia_tri)
            extra = sorted(set(dem) - set(lua_chon))
            out.append('| Lựa chọn | Số em chọn | Tỉ lệ (%) |\n|---|---|---|')
            for opt in list(lua_chon) + extra:
                k = dem.get(opt, 0)
                ghi = '' if opt in lua_chon else ' †'
                out.append(f'| {opt}{ghi} | {k} | {100 * k / max(n, 1):.1f} |')
            out.append('')
    return '\n'.join(out)

if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in SPEC:
        raise SystemExit(__doc__)
    print(tom_tat(sys.argv[1], sys.argv[2], '--demo' in sys.argv))
