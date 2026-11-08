<?php

declare(strict_types=1);

// Kiểm thử tích hợp Module 1 và lớp bảo mật.
// Cách dùng: DB_NAME=antoanso_test php api/tests/run.php
// Cảnh báo: bộ kiểm thử XÓA SẠCH dữ liệu trong CSDL. Tên CSDL bắt buộc kết thúc bằng _test.

require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Http\Request;
use AnToanSo\Http\Response;
use AnToanSo\Http\Routes;
use AnToanSo\Support\Container;
use AnToanSo\Support\Database;
use AnToanSo\Support\Env;
use AnToanSo\Support\Migrator;

$dbName = Env::get('DB_NAME');
if (!str_ends_with($dbName, '_test')) {
    fwrite(STDERR, "Từ chối chạy: DB_NAME='{$dbName}' phải kết thúc bằng _test.\n");
    exit(2);
}

Env::set('APP_URL', 'http://localhost:5173');
$pdo = Database::pdo();
foreach (['module_events', 'participants', 'classes'] as $table) {
    $pdo->exec("DROP TABLE IF EXISTS {$table}");
}
Migrator::run($pdo, dirname(__DIR__) . '/database/schema.sql');
$pdo->exec("INSERT INTO classes (code, name, school, created_at) VALUES ('8A1', 'Lớp 8A1', 'THCS Thử nghiệm', NOW())");

$passed = 0;
$failed = 0;

function check(string $name, bool $condition, string $detail = ''): void
{
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo "  [ok]   {$name}\n";
    } else {
        $failed++;
        echo "  [FAIL] {$name}" . ($detail !== '' ? " — {$detail}" : '') . "\n";
    }
}

/**
 * @param array<string,string> $cookies
 * @param array<string,mixed>|null $body
 */
function call(string $method, string $path, ?array $body = null, array $cookies = [], array $headers = []): Response
{
    $defaults = [
        'host' => 'localhost:5173',
        'origin' => 'http://localhost:5173',
        'content-type' => 'application/json',
    ];
    $request = new Request(
        $method,
        (string) preg_replace('#^/api(?=/|$)#', '', $path), // fromGlobals() cũng bỏ tiền tố /api
        array_merge($defaults, $headers),
        $body === null ? '' : json_encode($body, JSON_UNESCAPED_UNICODE),
        $cookies,
    );
    return Routes::build()->handle($request);
}

/** Lấy giá trị cookie phiên từ header Set-Cookie của phản hồi. */
function sessionTokenFrom(Response $response): ?string
{
    foreach ($response->headers() as $line) {
        if (preg_match('/^Set-Cookie: ats_session=([^;]*)/', $line, $m)) {
            return $m[1] === '' ? null : $m[1];
        }
    }
    return null;
}

echo "Kiểm thử đăng ký và đồng ý\n";
$noConsent = call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => false, 'consent_version' => 'v1']);
check('Từ chối đăng ký khi chưa đồng ý (422)', $noConsent->status === 422, (string) $noConsent->status);

$badClass = call('POST', '/api/participants', ['class_code' => 'KHONGCO', 'consent' => true, 'consent_version' => 'v1']);
check('Từ chối mã lớp không tồn tại (422)', $badClass->status === 422);

$badVersion = call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => true, 'consent_version' => 'v0']);
check('Từ chối phiên bản phiếu đồng ý cũ (422)', $badVersion->status === 422);

$reg = call('POST', '/api/participants', ['class_code' => '8a1', 'consent' => true, 'consent_version' => 'v1']);
check('Đăng ký thành công (201)', $reg->status === 201, (string) $reg->status);
$code = $reg->body['participant']['code'] ?? '';
check('Mã học sinh đúng định dạng XXXX-XXXX', (bool) preg_match('/^[23456789A-HJKMNP-Z]{4}-[23456789A-HJKMNP-Z]{4}$/', $code), $code);
$token = sessionTokenFrom($reg);
check('Cookie phiên được cấp', $token !== null && strlen($token) === 64);
$stored = $pdo->query("SELECT token_hash FROM participants WHERE code = '{$code}'")->fetchColumn();
check('CSDL chỉ lưu băm của token, không lưu token gốc', $stored === hash('sha256', (string) $token) && $stored !== $token);
$regResponse = json_encode($reg->body, JSON_UNESCAPED_UNICODE);
check('Phản hồi đăng ký không chứa token', $token === null || !str_contains((string) $regResponse, $token));

echo "Xác thực phiên\n";
$anon = call('GET', '/api/module1');
check('Truy cập Module 1 khi chưa đăng nhập bị từ chối (401)', $anon->status === 401);

$me = call('GET', '/api/me', null, ['ats_session' => (string) $token]);
check('GET /api/me với cookie hợp lệ (200)', $me->status === 200 && $me->body['participant']['code'] === $code);

$badLogin = call('POST', '/api/session', ['code' => 'ZZZZ-ZZZZ']);
check('Đăng nhập sai mã (401)', $badLogin->status === 401);

$csrf = call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => true, 'consent_version' => 'v1'], [], ['origin' => 'https://evil-run.app.example.com']);
check('Chặn Origin lạ (403)', $csrf->status === 403, (string) $csrf->status);

$notJson = call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => true, 'consent_version' => 'v1'], [], ['content-type' => 'text/plain']);
check('Chặn ghi không phải JSON (415)', $notJson->status === 415, (string) $notJson->status);

$login = call('POST', '/api/session', ['code' => strtolower(substr($code, 0, 4) . substr($code, 5))]);
check('Đăng nhập lại bằng mã (không phân biệt hoa thường, bỏ gạch)', $login->status === 200);
$newToken = sessionTokenFrom($login);
$oldStillWorks = call('GET', '/api/me', null, ['ats_session' => (string) $token]);
check('Token cũ bị vô hiệu sau khi đăng nhập lại (401)', $oldStillWorks->status === 401);
$token = $newToken;

echo "Module 1: sân chơi tình huống\n";
$overview = call('GET', '/api/module1', null, ['ats_session' => (string) $token]);
check('Tổng quan Module 1 (200)', $overview->status === 200);
$scenarios = $overview->body['scenarios'] ?? [];
check('Có 5 tình huống', count($scenarios) === 5, (string) count($scenarios));
check('Tổng quan không lộ đáp án (is_safe)', !str_contains((string) json_encode($overview->body), 'is_safe'));
check('Ban đầu chưa trả lời câu nào', ($overview->body['progress']['answered'] ?? -1) === 0);

$detail = call('GET', '/api/module1/scenarios/m1-01-cuoc-goi-cong-an', null, ['ats_session' => (string) $token]);
check('Chi tiết tình huống (200)', $detail->status === 200);
check('Chi tiết tình huống không lộ đáp án', !str_contains((string) json_encode($detail->body), 'is_safe'));
check('Chi tiết tình huống có 4 lựa chọn', count($detail->body['scenario']['choices'] ?? []) === 4);

$missing = call('GET', '/api/module1/scenarios/khong-co', null, ['ats_session' => (string) $token]);
check('Tình huống không tồn tại (404)', $missing->status === 404);

$answerUnsafe = call('POST', '/api/module1/scenarios/m1-01-cuoc-goi-cong-an/answer',
    ['choice_index' => 0, 'response_ms' => 4200], ['ats_session' => (string) $token]);
check('Trả lời sai ghi nhận (201)', $answerUnsafe->status === 201);
check('Phản hồi sai: is_safe = false, có giải thích', $answerUnsafe->body['is_safe'] === false && $answerUnsafe->body['feedback'] !== '');
check('Phản hồi có best_choice_index đúng (1)', $answerUnsafe->body['best_choice_index'] === 1);
check('Lần đầu được đánh dấu attempt_no = 1', $answerUnsafe->body['attempt_no'] === 1 && $answerUnsafe->body['is_first_attempt'] === true);

$retry = call('POST', '/api/module1/scenarios/m1-01-cuoc-goi-cong-an/answer',
    ['choice_index' => 1], ['ats_session' => (string) $token]);
check('Thử lại được ghi nhận như lần 2', $retry->body['attempt_no'] === 2 && $retry->body['is_first_attempt'] === false);

$answerSafe = call('POST', '/api/module1/scenarios/m1-02-ma-otp/answer',
    ['choice_index' => 1], ['ats_session' => (string) $token]);
check('Trả lời đúng ở tình huống OTP', $answerSafe->body['is_safe'] === true);

call('POST', '/api/module1/scenarios/m1-03-trung-thuong/answer', ['choice_index' => 2], ['ats_session' => (string) $token]);

$badIndex = call('POST', '/api/module1/scenarios/m1-03-trung-thuong/answer',
    ['choice_index' => 9], ['ats_session' => (string) $token]);
check('Chỉ số lựa chọn ngoài phạm vi (422)', $badIndex->status === 422);

$stringIndex = call('POST', '/api/module1/scenarios/m1-03-trung-thuong/answer',
    ['choice_index' => '1'], ['ats_session' => (string) $token]);
check('Chỉ số kiểu chuỗi bị từ chối (422)', $stringIndex->status === 422);

$badTime = call('POST', '/api/module1/scenarios/m1-03-trung-thuong/answer',
    ['choice_index' => 1, 'response_ms' => -5], ['ats_session' => (string) $token]);
check('Thời gian phản hồi âm bị từ chối (422)', $badTime->status === 422);

$after = call('GET', '/api/module1', null, ['ats_session' => (string) $token]);
$s01 = null;
foreach ($after->body['scenarios'] as $s) {
    if ($s['id'] === 'm1-01-cuoc-goi-cong-an') {
        $s01 = $s;
    }
}
check('Điểm lần đầu của tình huống 1 là không an toàn', $s01 !== null && $s01['first_try_safe'] === false && $s01['attempts'] === 2);
check('Tiến độ: 3 tình huống đã trả lời', $after->body['progress']['answered'] === 3, (string) ($after->body['progress']['answered'] ?? '?'));
check('Tiến độ: 1 tình huống đúng ngay từ lần đầu (OTP)', $after->body['progress']['first_try_safe'] === 1);
check('Tỷ lệ điểm nghiên cứu = 20% (1/5)', $after->body['progress']['score_percent'] === 20);

$rows = (int) $pdo->query("SELECT COUNT(*) FROM module_events")->fetchColumn();
check('Mọi lần trả lời được ghi vào module_events (4 dòng hợp lệ)', $rows === 4, (string) $rows);
$firstAttemptOnly = (int) $pdo->query("SELECT COUNT(*) FROM module_events WHERE attempt_no = 1")->fetchColumn();
check('Số lần thử đầu tiên = số tình huống đã trả lời (3)', $firstAttemptOnly === 3, (string) $firstAttemptOnly);

$logout = call('DELETE', '/api/session', [], ['ats_session' => (string) $token]);
check('Đăng xuất (200)', $logout->status === 200);
$afterLogout = call('GET', '/api/me', null, ['ats_session' => (string) $token]);
check('Sau đăng xuất, token không còn hiệu lực (401)', $afterLogout->status === 401);

echo "Kiểm tra nội dung kịch bản\n";
$catalog = new AnToanSo\Services\ScenarioCatalog(dirname(__DIR__) . '/content/module1_scenarios.json');
check('Tệp nội dung Module 1 hợp lệ', count($catalog->scenarios()) === 5);
$invalid = tempnam(sys_get_temp_dir(), 'scn');
file_put_contents($invalid, json_encode(['module' => 1, 'version' => 'x', 'title' => 'x', 'scenarios' => [[
    'id' => 'bad-one', 'title' => 'T', 'summary' => 'S', 'question' => 'Q', 'takeaway' => 'K',
    'messages' => [['from' => 'a', 'text' => 'b']],
    'choices' => [
        ['text' => 'a', 'feedback' => 'f', 'is_safe' => false],
        ['text' => 'b', 'feedback' => 'f', 'is_safe' => false],
    ],
]]]));
$rejected = false;
try {
    new AnToanSo\Services\ScenarioCatalog($invalid);
} catch (RuntimeException $e) {
    $rejected = str_contains($e->getMessage(), 'không có lựa chọn an toàn');
}
check('Từ chối tình huống không có lựa chọn an toàn', $rejected);
unlink($invalid);

echo "\nKết quả: {$passed} đạt, {$failed} lỗi.\n";
exit($failed === 0 ? 0 : 1);
