/**
 * Đánh giá độ mạnh mật khẩu hoàn toàn cục bộ. Không gọi mạng, không lưu trữ, không ghi log.
 *
 * Lưu ý khoa học (cần nêu rõ với học sinh):
 *  - Entropy lý thuyết = độ dài × log2(kích thước bảng ký tự) chỉ là CẬN TRÊN cho mật khẩu ngẫu nhiên.
 *    Mật khẩu do con người chọn thường dễ đoán hơn nhiều; hàm này trừ điểm khi phát hiện mẫu quen thuộc.
 *  - Thời gian bẻ khóa là MÔ PHỎNG MINH HỌA với giả định tốc độ đoán cố định, không phải số liệu đo được.
 */

/**
 * Mẫu mật khẩu rất phổ biến dùng cho giáo dục. Đây là danh sách tự biên soạn từ các mẫu nổi tiếng,
 * KHÔNG phải dữ liệu rò rỉ thật và không đại diện đầy đủ cho các danh sách thực tế.
 */
export const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  '123456', '1234567', '12345678', '123456789', '1234567890', '111111', '123123', '000000',
  'password', 'password1', 'passw0rd', 'qwerty', 'qwerty123', 'qwertyuiop', 'abc123', 'abcdef',
  'iloveyou', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'football', 'baseball',
  'matkhau', 'matkhau123', 'matkhau1', 'anh yeu em', 'trongcom', 'hanoi', 'danang', 'sontra',
  '1q2w3e', '1q2w3e4r', 'zxcvbnm', 'asdfgh', 'asdf1234', 'login', 'princess', 'sunshine',
]);

export type StrengthBand = 'weak' | 'fair' | 'strong';

export interface PasswordAnalysis {
  length: number;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  poolSize: number;
  rawEntropyBits: number;
  effectiveEntropyBits: number;
  isCommon: boolean;
  longestSequence: number;
  longestRepeat: number;
  hasKeyboardWalk: boolean;
  hasYearPattern: boolean;
  band: StrengthBand;
  reasons: string[];
  crackTime: {
    offlineFastHash: string;
    onlineThrottled: string;
  };
}

/** Tốc độ đoán giả định (minh họa): tấn công ngoại tuyến trên băm nhanh, và trực tuyến có giới hạn. */
export const GUESS_RATE_OFFLINE = 1e10;
export const GUESS_RATE_ONLINE = 1e3;

const KEYBOARD_WALKS = ['qwert', 'asdfg', 'zxcvb', '1234', '2345', '3456', '4567', '5678', '6789', '0123'];

function charClasses(password: string) {
  return {
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
  };
}

/** Kích thước bảng ký tự dựa trên các lớp ký tự có mặt. Dấu cách và ký tự Unicode tính là ký hiệu. */
export function poolSizeOf(password: string): number {
  const c = charClasses(password);
  let size = 0;
  if (c.hasLower) size += 26;
  if (c.hasUpper) size += 26;
  if (c.hasDigit) size += 10;
  if (c.hasSymbol) size += 33;
  return size;
}

/** Độ dài của chuỗi liên tiếp tăng/giảm đơn giản (abc, 321) trên chữ và số. */
export function longestSequence(password: string): number {
  const codes = [...password].map((ch) => ch.charCodeAt(0));
  let best = password.length > 0 ? 1 : 0;
  let run = 1;
  let dir = 0;
  for (let i = 1; i < codes.length; i++) {
    const diff = codes[i] - codes[i - 1];
    if ((diff === 1 || diff === -1) && (dir === 0 || Math.sign(diff) === dir)) {
      dir = Math.sign(diff);
      run++;
    } else if (diff === 1 || diff === -1) {
      dir = Math.sign(diff);
      run = 2;
    } else {
      dir = 0;
      run = 1;
    }
    best = Math.max(best, run);
  }
  return best;
}

/** Độ dài chuỗi ký tự lặp liên tiếp dài nhất (aaa, 1111). */
export function longestRepeat(password: string): number {
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const ch of password) {
    run = ch === prev ? run + 1 : 1;
    prev = ch;
    best = Math.max(best, run);
  }
  return best;
}

export function hasKeyboardWalk(password: string): boolean {
  const lower = password.toLowerCase();
  return KEYBOARD_WALKS.some((w) => lower.includes(w));
}

export function hasYearPattern(password: string): boolean {
  return /(19|20)\d{2}/.test(password);
}

/** Chuyển số giây thành mô tả tiếng Việt, có thang đo năm để tránh con số quá lớn. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'không thể ước lượng';
  if (seconds < 1) return 'dưới 1 giây';
  if (seconds < 60) return `khoảng ${Math.round(seconds)} giây`;
  if (seconds < 3600) return `khoảng ${Math.round(seconds / 60)} phút`;
  if (seconds < 86400) return `khoảng ${Math.round(seconds / 3600)} giờ`;
  if (seconds < 86400 * 365) return `khoảng ${Math.round(seconds / 86400)} ngày`;
  const years = seconds / (86400 * 365);
  if (years < 1e6) return `khoảng ${Math.round(years).toLocaleString('vi-VN')} năm`;
  return `hơn ${(1e6).toLocaleString('vi-VN')} năm`;
}

/** Thời gian trung bình để đoán trúng: một nửa không gian khóa, chia tốc độ đoán. */
export function crackSeconds(effectiveBits: number, guessesPerSecond: number): number {
  return Math.pow(2, effectiveBits - 1) / guessesPerSecond;
}

export function analyzePassword(password: string): PasswordAnalysis {
  const length = [...password].length;
  const classes = charClasses(password);
  const poolSize = poolSizeOf(password);
  const rawEntropyBits = poolSize > 0 && length > 0 ? length * Math.log2(poolSize) : 0;

  const isCommon = password.length > 0 && COMMON_PASSWORDS.has(password.toLowerCase());
  const sequence = longestSequence(password);
  const repeat = longestRepeat(password);
  const walk = hasKeyboardWalk(password);
  const year = hasYearPattern(password);

  // Trừ điểm theo mẫu quen thuộc: mỗi mẫu làm không gian đoán thực tế nhỏ đi.
  let penalty = 0;
  if (sequence >= 4) penalty += 10;
  if (repeat >= 3) penalty += Math.min(24, (repeat - 2) * 4);
  if (walk) penalty += 10;
  if (year) penalty += 6;
  let effective = Math.max(0, rawEntropyBits - penalty);
  if (isCommon) effective = Math.min(effective, 6);

  const reasons: string[] = [];
  if (length < 8) reasons.push('Mật khẩu ngắn hơn 8 ký tự.');
  if (isCommon) reasons.push('Đây là mật khẩu rất phổ biến; kẻ gian thử đầu tiên.');
  if (sequence >= 4) reasons.push('Có chuỗi ký tự liên tiếp như abcd hoặc 4567.');
  if (repeat >= 3) reasons.push('Có ký tự lặp lại liên tiếp.');
  if (walk) reasons.push('Có dãy phím gần nhau trên bàn phím như qwert hoặc 1234.');
  if (year) reasons.push('Có năm sinh hoặc năm quen thuộc.');
  if (!classes.hasUpper || !classes.hasSymbol) {
    if (length >= 8) reasons.push('Nên kết hợp chữ hoa, chữ thường, số và ký hiệu.');
  }

  let band: StrengthBand;
  if (length < 8 || isCommon || effective < 28) band = 'weak';
  else if (effective < 50) band = 'fair';
  else band = 'strong';

  if (band === 'strong' && reasons.length === 0) {
    reasons.push('Không phát hiện mẫu quen thuộc. Mật khẩu dài và đa dạng ký tự.');
  }

  return {
    length,
    ...classes,
    poolSize,
    rawEntropyBits: round1(rawEntropyBits),
    effectiveEntropyBits: round1(effective),
    isCommon,
    longestSequence: sequence,
    longestRepeat: repeat,
    hasKeyboardWalk: walk,
    hasYearPattern: year,
    band,
    reasons,
    crackTime: {
      offlineFastHash: formatDuration(crackSeconds(effective, GUESS_RATE_OFFLINE)),
      onlineThrottled: formatDuration(crackSeconds(effective, GUESS_RATE_ONLINE)),
    },
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export const BAND_RANK: Record<StrengthBand, number> = { weak: 0, fair: 1, strong: 2 };

export function bestBand(a: StrengthBand | null, b: StrengthBand): StrengthBand {
  if (a === null) return b;
  return BAND_RANK[b] > BAND_RANK[a] ? b : a;
}
