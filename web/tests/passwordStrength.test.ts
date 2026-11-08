// Kiểm thử đơn vị cho bộ đánh giá mật khẩu cục bộ.
// Chạy: npm run test:unit   (Node 22+, loại bỏ kiểu TypeScript tại chạy)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzePassword,
  bestBand,
  crackSeconds,
  formatDuration,
  hasKeyboardWalk,
  longestRepeat,
  longestSequence,
  poolSizeOf,
} from '../src/modules/module3/passwordStrength.ts';

test('mật khẩu phổ biến bị xếp yếu và giới hạn entropy', () => {
  const a = analyzePassword('password');
  assert.equal(a.isCommon, true);
  assert.equal(a.band, 'weak');
  assert.ok(a.effectiveEntropyBits <= 6);
});

test('mật khẩu ngắn bị xếp yếu', () => {
  assert.equal(analyzePassword('Ab1!').band, 'weak');
});

test('mật khẩu dài, đa dạng ký tự được xếp mạnh', () => {
  const a = analyzePassword('Tr0ub4dor&3xyz');
  assert.equal(a.band, 'strong');
  assert.ok(a.rawEntropyBits > 90);
});

test('chuỗi liên tiếp và dãy phím bị trừ điểm', () => {
  const a = analyzePassword('abcd1234');
  assert.ok(a.longestSequence >= 4);
  assert.equal(a.hasKeyboardWalk, true);
  assert.equal(a.band, 'weak');
});

test('ký tự lặp dài bị trừ điểm mạnh hơn', () => {
  const a = analyzePassword('aaaaaaaa');
  assert.equal(a.longestRepeat, 8);
  assert.equal(a.band, 'weak');
});

test('năm sinh được phát hiện', () => {
  assert.equal(analyzePassword('Minh2012xyz').hasYearPattern, true);
});

test('kích thước bảng ký tự theo các lớp có mặt', () => {
  assert.equal(poolSizeOf('abc'), 26);
  assert.equal(poolSizeOf('aA1'), 26 + 26 + 10);
  assert.equal(poolSizeOf('a!'), 26 + 33);
  assert.equal(poolSizeOf(''), 0);
});

test('phát hiện chuỗi tăng và giảm', () => {
  assert.equal(longestSequence('abcd'), 4);
  assert.equal(longestSequence('4321'), 4);
  assert.equal(longestSequence('a1b2'), 1);
});

test('phát hiện ký tự lặp và dãy phím', () => {
  assert.equal(longestRepeat('abbbbc'), 4);
  assert.equal(hasKeyboardWalk('xqwerty'), true);
  assert.equal(hasKeyboardWalk('zebra'), false);
});

test('thời gian bẻ khóa tăng theo entropy', () => {
  assert.ok(crackSeconds(40, 1e10) < crackSeconds(60, 1e10));
  assert.ok(crackSeconds(60, 1e3) > crackSeconds(60, 1e10));
});

test('định dạng thời gian tiếng Việt', () => {
  assert.equal(formatDuration(0.5), 'dưới 1 giây');
  assert.equal(formatDuration(3600 * 5), 'khoảng 5 giờ');
  assert.equal(formatDuration(Infinity), 'không thể ước lượng');
});

test('kết quả phân tích không chứa chuỗi mật khẩu gốc', () => {
  const secret = 'Bi-Mat-2026!xyz';
  const result = analyzePassword(secret);
  assert.equal(JSON.stringify(result).includes(secret), false);
});

test('hỗ trợ chuỗi có dấu tiếng Việt và khoảng trắng', () => {
  assert.doesNotThrow(() => analyzePassword('mật khẩu của em'));
  assert.equal(analyzePassword('').band, 'weak');
});

test('xếp hạng mức đạt tốt nhất', () => {
  assert.equal(bestBand(null, 'fair'), 'fair');
  assert.equal(bestBand('fair', 'weak'), 'fair');
  assert.equal(bestBand('fair', 'strong'), 'strong');
});
