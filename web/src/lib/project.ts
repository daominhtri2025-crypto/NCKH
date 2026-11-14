/** Thông tin đề tài dùng chung cho chân trang và thẻ học sinh (một nguồn duy nhất). */
export const PROJECT = {
  name: 'An Toàn Số Học Đường',
  school: 'THCS Hoàng Sa, phân hiệu Lý Tự Trọng',
  students: ['Trần Cảnh Phúc', 'Cù Hoàng Linh Trúc'],
  grade: '9/1',
  advisor: 'Hoàng Thị Bảo Oanh',
} as const;

/** Địa chỉ gốc của ứng dụng đang chạy, dùng để sinh mã QR trên thẻ học sinh. */
export function appOrigin(): string {
  return window.location.origin;
}

/**
 * Nội dung mã QR trên thẻ: địa chỉ ứng dụng kèm mã thẻ trong phần fragment (#code=…).
 * Fragment không bao giờ được trình duyệt gửi tới máy chủ nên mã không lọt vào nhật ký truy cập.
 */
export function cardLink(code: string): string {
  return `${appOrigin()}/#code=${encodeURIComponent(code)}`;
}

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // trùng bảng ký tự của máy chủ
const CODE_PATTERN = new RegExp(`^[${ALPHABET}]{4}-[${ALPHABET}]{4}$`);

/** Đọc mã thẻ từ fragment của địa chỉ hiện tại; trả về null nếu không có hoặc sai định dạng. */
export function readCodeFromHash(hash: string): string | null {
  const match = /^#code=([^&]+)/.exec(hash);
  if (!match) return null;
  try {
    const code = decodeURIComponent(match[1]).trim().toUpperCase();
    return CODE_PATTERN.test(code) ? code : null;
  } catch {
    return null;
  }
}
