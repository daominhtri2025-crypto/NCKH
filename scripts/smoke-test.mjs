// Kiểm thử nhanh (smoke test) luồng học sinh đầy đủ qua HTTP, chạy trên máy đang bật API và Vite.
//
// Cách dùng (sau khi đã bật php -S 127.0.0.1:8000 và npm run dev):
//   node scripts/smoke-test.mjs
// Tùy chọn (biến môi trường):
//   SMOKE_BASE=http://localhost:5173   địa chỉ đi qua proxy Vite (mặc định), hoặc http://127.0.0.1:8000 để gọi thẳng API
//   SMOKE_CLASS=8A1                    mã lớp đã tạo bằng bin/add_class.php
//   SMOKE_ADMIN_TOKEN=...              nếu có, kiểm tra thêm chức năng xuất CSV
//
// Yêu cầu: Node.js 18 trở lên (có sẵn fetch). Không cần thư viện ngoài.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const content = (name) => JSON.parse(readFileSync(join(here, '..', 'api', 'content', name), 'utf8'));

const BASE = (process.env.SMOKE_BASE || 'http://localhost:5173').replace(/\/$/, '');
const CLASS = process.env.SMOKE_CLASS || '8A1';
const ADMIN_TOKEN = process.env.SMOKE_ADMIN_TOKEN || '';

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

/** Gọi API. Trả về {status, body, token}; token là giá trị cookie ats_session nếu có trong Set-Cookie. */
async function call(method, path, { body, token, headers = {} } = {}) {
  const init = {
    method,
    headers: {
      Accept: 'application/json',
      ...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Cookie: `ats_session=${token}` } : {}),
      ...headers,
    },
  };
  if (method !== 'GET') init.body = JSON.stringify(body ?? {});
  const res = await fetch(`${BASE}/api${path}`, init);
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }
  const setCookie = res.headers.get('set-cookie') || '';
  const m = setCookie.match(/ats_session=([^;]*)/);
  return { status: res.status, body: parsed, token: m && m[1] !== '' ? m[1] : null };
}

function section(title) {
  console.log(`\n${title}`);
}

async function main() {
  console.log(`Kiểm thử nhanh trên ${BASE} (lớp ${CLASS})`);

  section('1. Kết nối');
  const health = await call('GET', '/health');
  check('API phản hồi /api/health', health.status === 200 && health.body?.ok === true,
    `HTTP ${health.status}. Kiểm tra php -S 127.0.0.1:8000 và npm run dev.`);
  if (health.status !== 200) {
    throw new Error('Không kết nối được API. Dừng kiểm thử.');
  }

  section('2. Đăng ký bằng mã giả danh (đồng ý tham gia)');
  const reg = await call('POST', '/participants', {
    body: { class_code: CLASS, consent: true, consent_version: 'v1' },
  });
  check('Đăng ký thành công (201)', reg.status === 201,
    `HTTP ${reg.status}: ${reg.body?.error ?? ''}. Nếu báo mã lớp không hợp lệ, hãy chạy: php api/bin/add_class.php ${CLASS} "Lớp ${CLASS}" "THCS thử nghiệm"`);
  const code = reg.body?.participant?.code;
  check('Mã học sinh đúng định dạng XXXX-XXXX', /^[23456789A-HJKMNP-Z]{4}-[23456789A-HJKMNP-Z]{4}$/.test(code ?? ''), String(code));
  let token = reg.token;
  check('Cấp cookie phiên', !!token);
  if (!token) {
    throw new Error('Không đăng ký được học sinh thử nghiệm, dừng kiểm thử. Kiểm tra lớp và cấu hình CSDL.');
  }
  const bodyText = JSON.stringify(reg.body);
  check('Phản hồi đăng ký không chứa cookie phiên', !token || !bodyText.includes(token));

  section('3. Khóa trình tự: module bị chặn trước pre-test');
  const lockedM1 = await call('GET', '/module1', { token });
  check('Module 1 bị khóa khi chưa làm pre-test (403)', lockedM1.status === 403);

  section('4. Pre-test (16 câu)');
  const items = content('assessment_items.json').items;
  const pre = await call('GET', '/assessments/pre', { token });
  check('Tải được pre-test với 16 câu', pre.status === 200 && pre.body.items.length === 16);
  check('Câu hỏi không lộ đáp án đúng', !JSON.stringify(pre.body).includes('"correct"'));
  let preAnswered = 0;
  for (const it of items) {
    const payload = it.instrument === 'knowledge' ? { answer_index: it.correct } : { answer_value: 2 };
    const r = await call('POST', `/assessments/pre/items/${it.id}/answer`, { token, body: { ...payload, response_ms: 3000 } });
    if (r.status === 201) preAnswered++;
  }
  check('Trả lời đủ 16 câu pre-test', preAnswered === 16, `thành công ${preAnswered}/16`);
  const afterPre = await call('GET', '/assessments', { token });
  check('Trạng thái pre-test: done', afterPre.body?.phases?.pre?.status === 'done');
  check('Sau pre-test, Module 1 mở (200)', (await call('GET', '/module1', { token })).status === 200);

  section('5. Đăng nhập lại bằng mã giả danh (phiên mới)');
  const login = await call('POST', '/session', { token, body: { code: code.toLowerCase() } });
  check('Đăng nhập lại bằng mã (không phân biệt hoa thường)', login.status === 200 && !!login.token);
  const oldStillValid = (await call('GET', '/me', { token })).status;
  check('Phiên cũ bị vô hiệu sau khi đăng nhập lại (401)', oldStillValid === 401);
  token = login.token;
  check('Phiên mới xem được thông tin học sinh', (await call('GET', '/me', { token })).status === 200);

  section('6. Module 1: sân chơi tình huống');
  const m1 = content('module1_scenarios.json').scenarios;
  for (const sc of m1) {
    const safe = sc.choices.findIndex((c) => c.is_safe);
    await call('POST', `/module1/scenarios/${sc.id}/answer`, { token, body: { choice_index: safe, response_ms: 5000 } });
  }
  const o1 = await call('GET', '/module1', { token });
  check('Module 1 hoàn thành 5/5', o1.body?.progress?.answered === 5);

  section('7. Module 2: thám tử tên miền');
  const m2 = content('module2_domains.json').items;
  for (const it of m2) {
    await call('POST', `/module2/items/${it.id}/answer`, {
      token,
      body: { verdict: it.is_official ? 'official' : 'fake', response_ms: 4000, hint_used: false },
    });
  }
  const o2 = await call('GET', '/module2', { token });
  check('Module 2 hoàn thành 12/12 và độ chính xác 100%',
    o2.body?.progress?.answered === 12 && o2.body?.progress?.correct === 12, JSON.stringify(o2.body?.progress));

  section('8. Module 3: checklist và phòng thí nghiệm');
  const m3 = content('module3_checklist.json').platforms.flatMap((p) => p.steps);
  for (const st of m3) {
    await call('POST', `/module3/steps/${st.id}/complete`, {
      token,
      body: { quiz_choice: st.quiz.correct, practiced: true, response_ms: 6000 },
    });
  }
  const lab = await call('POST', '/module3/lab', { token, body: { best_band: 'strong' } });
  check('Ghi nhận phòng thí nghiệm mức mạnh (201)', lab.status === 201);
  const o3 = await call('GET', '/module3', { token });
  check('Module 3 hoàn thành 8/8 bước và phòng thí nghiệm đạt',
    o3.body?.progress?.passed_steps === 8 && o3.body?.lab?.passed === true);
  const rejectPassword = await call('POST', '/module3/lab', { token, body: { best_band: 'strong', password: 'x' } });
  check('Máy chủ từ chối mọi yêu cầu có trường mật khẩu (422)', rejectPassword.status === 422);

  section('9. Post-test sau can thiệp');
  const status = await call('GET', '/assessments', { token });
  check('Cả 3 module đã hoàn thành', status.body?.modules?.all === true);
  check('Post-test mở', status.body?.phases?.post?.status === 'open');
  for (const it of items) {
    const payload = it.instrument === 'knowledge' ? { answer_index: it.correct } : { answer_value: 3 };
    await call('POST', `/assessments/post/items/${it.id}/answer`, { token, body: { ...payload, response_ms: 2500 } });
  }
  const postDone = await call('GET', '/assessments', { token });
  check('Post-test hoàn thành 16/16', postDone.body?.phases?.post?.status === 'done');

  section('10. Delayed-test (kiểm tra khóa theo thời gian)');
  const delayed = postDone.body?.phases?.delayed;
  check('Delayed-test khóa và có ngày mở dự kiến (mặc định 28 ngày)',
    delayed?.status === 'locked' && !!delayed?.available_at, JSON.stringify(delayed));

  if (ADMIN_TOKEN) {
    section('11. Xuất dữ liệu nghiên cứu (CSV)');
    const csv = await call('GET', '/admin/export/wide.csv', { headers: { 'X-Admin-Token': ADMIN_TOKEN } });
    check('Xuất wide CSV bằng token quản trị (200)', csv.status === 200);
    check('CSV có dòng của học sinh thử nghiệm', typeof csv.body === 'string' && csv.body.includes(code));
    check('CSV không chứa cột định danh thật', typeof csv.body === 'string' && !/email|phone|ho_ten/i.test(csv.body.split('\n')[0]));
  } else {
    section('11. Xuất dữ liệu (bỏ qua)');
    console.log('  - Đặt SMOKE_ADMIN_TOKEN để kiểm tra chức năng xuất CSV.');
  }

  console.log(`\nKết quả: ${passed} đạt, ${failed} lỗi.`);
  if (failed > 0) {
    console.log('Các mục lỗi:\n  - ' + failures.join('\n  - '));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('\nLỗi không mong đợi:', err.message);
  process.exitCode = 1;
});
