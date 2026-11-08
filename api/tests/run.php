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

echo "Module 2: thám tử không gian mạng\n";
$t2 = sessionTokenFrom(call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => true, 'consent_version' => 'v1']));
$t2Cookie = ['ats_session' => (string) $t2];

$m2Anon = call('GET', '/api/module2');
check('Module 2 yêu cầu đăng nhập (401)', $m2Anon->status === 401);

$m2 = call('GET', '/api/module2', null, $t2Cookie);
check('Tổng quan Module 2 (200)', $m2->status === 200);
$items = $m2->body['items'] ?? [];
check('Có 12 mục phân loại', count($items) === 12, (string) count($items));
$m2Json = (string) json_encode($m2->body);
check('Tổng quan không lộ is_official hay thủ thuật', !str_contains($m2Json, 'is_official') && !str_contains($m2Json, '"trick"'));
check('Tổng quan có danh sách tên gốc chính thức', count($m2->body['official_roots'] ?? []) === 2);
check('Quy tắc đọc có 3 bước', count($m2->body['rule']['steps'] ?? []) === 3);
check('Mỗi mục có host và root_domain để hiển thị cách đọc', isset($items[0]['host'], $items[0]['root_domain']));

$allSafe = true;
foreach ($items as $it) {
    $host = (string) parse_url($it['url'], PHP_URL_HOST);
    $ok = str_ends_with($host, '.test') || str_ends_with($host, '.example')
        || (str_ends_with($host, '.io.vn') && str_contains($host, 'phong'));
    if (!$ok) {
        $allSafe = false;
    }
}
check('Mọi tên miền trong Module 2 là hư cấu (.test, .example, hoặc .io.vn có dấu hiệu hư cấu)', $allSafe);

$orders = array_column($items, 'button_order');
check('Mỗi mục có thứ tự nút đáp án hợp lệ', count(array_filter($orders, fn ($o) => in_array($o, ['official_first', 'fake_first'], true))) === 12);
check('Thứ tự nút ngẫu nhiên giữa các mục (có cả hai kiểu)', in_array('official_first', $orders, true) && in_array('fake_first', $orders, true));
$again = call('GET', '/api/module2', null, $t2Cookie);
check('Thứ tự nút ổn định khi tải lại trang', array_column($again->body['items'], 'button_order') === $orders);
$otherStudent = sessionTokenFrom(call('POST', '/api/participants', ['class_code' => '8A1', 'consent' => true, 'consent_version' => 'v1']));
$otherOrders = array_column(call('GET', '/api/module2', null, ['ats_session' => (string) $otherStudent])->body['items'], 'button_order');
check('Thứ tự nút khác nhau giữa các học sinh', $otherOrders !== $orders);

$badVerdict = call('POST', '/api/module2/items/m2-06-thay-ky-tu-o-thanh-0/answer', ['verdict' => 'maybe'], $t2Cookie);
check('Phân loại không hợp lệ bị từ chối (422)', $badVerdict->status === 422);

$badHint = call('POST', '/api/module2/items/m2-06-thay-ky-tu-o-thanh-0/answer', ['verdict' => 'fake', 'hint_used' => 'yes'], $t2Cookie);
check('hint_used không phải boolean bị từ chối (422)', $badHint->status === 422);

$unknown = call('POST', '/api/module2/items/khong-co/answer', ['verdict' => 'fake'], $t2Cookie);
check('Mục không tồn tại (404)', $unknown->status === 404);

$ansFake = call('POST', '/api/module2/items/m2-06-thay-ky-tu-o-thanh-0/answer',
    ['verdict' => 'fake', 'response_ms' => 3100, 'hint_used' => true], $t2Cookie);
check('Phân loại đúng mục giả mạo (201)', $ansFake->status === 201);
check('Kết quả: đúng, is_official = false, có giải thích', $ansFake->body['correct'] === true
    && $ansFake->body['is_official'] === false && $ansFake->body['explanation'] !== '');

$dup = call('POST', '/api/module2/items/m2-06-thay-ky-tu-o-thanh-0/answer', ['verdict' => 'official'], $t2Cookie);
check('Không được phân loại lại cùng một mục (409)', $dup->status === 409);

$ansWrong = call('POST', '/api/module2/items/m2-01-cong-chinh-tra-cuu/answer',
    ['verdict' => 'fake', 'response_ms' => 5000, 'hint_used' => false], $t2Cookie);
check('Phân loại sai mục chính thống: correct = false', $ansWrong->status === 201 && $ansWrong->body['correct'] === false);

$m2After = call('GET', '/api/module2', null, $t2Cookie);
check('Tiến độ Module 2: 2 đã làm, 1 đúng, độ chính xác 50%',
    $m2After->body['progress']['answered'] === 2
    && $m2After->body['progress']['correct'] === 1
    && $m2After->body['progress']['accuracy_percent'] === 50);
$row6 = null;
foreach ($m2After->body['items'] as $it) {
    if ($it['id'] === 'm2-06-thay-ky-tu-o-thanh-0') {
        $row6 = $it;
    }
}
check('Mục đã làm hiển thị trạng thái answered và kết quả', $row6 !== null && $row6['status'] === 'answered' && $row6['correct'] === true);

$evt = $pdo->query("SELECT item_id, choice_index, is_safe, hint_used, response_ms FROM module_events WHERE module = 2 ORDER BY id")->fetchAll();
check('Ghi đúng 2 dòng module_events cho Module 2', count($evt) === 2, (string) count($evt));
check('Mục giả mạo: choice_index = 1, is_safe = 1, hint_used = 1, response_ms = 3100',
    isset($evt[0]) && (int) $evt[0]['choice_index'] === 1 && (int) $evt[0]['is_safe'] === 1
    && (int) $evt[0]['hint_used'] === 1 && (int) $evt[0]['response_ms'] === 3100);
check('Mục chính thống trả lời sai: choice_index = 1, is_safe = 0, hint_used = 0',
    isset($evt[1]) && (int) $evt[1]['choice_index'] === 1 && (int) $evt[1]['is_safe'] === 0
    && (int) $evt[1]['hint_used'] === 0);

$m1Hint = (int) $pdo->query("SELECT COUNT(*) FROM module_events WHERE module = 1 AND hint_used IS NULL")->fetchColumn();
check('Module 1 không ghi hint_used (NULL)', $m1Hint === (int) $pdo->query("SELECT COUNT(*) FROM module_events WHERE module = 1")->fetchColumn());

echo "Kiểm tra nội dung Module 2 (chốt an toàn)\n";
function domainCatalogFrom(callable $mutate): string
{
    $data = json_decode((string) file_get_contents(dirname(__DIR__) . '/content/module2_domains.json'), true);
    $mutate($data);
    $file = tempnam(sys_get_temp_dir(), 'dom');
    file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE));
    return $file;
}
function expectRejected(string $name, callable $mutate, string $needle): void
{
    $file = domainCatalogFrom($mutate);
    $message = '';
    try {
        new AnToanSo\Services\DomainCatalog($file);
    } catch (RuntimeException $e) {
        $message = $e->getMessage();
    }
    unlink($file);
    check($name, str_contains($message, $needle), $message);
}
$ok = new AnToanSo\Services\DomainCatalog(dirname(__DIR__) . '/content/module2_domains.json');
check('Nội dung Module 2 hợp lệ (12 mục)', count($ok->items()) === 12);
expectRejected('Từ chối tên miền thật (.gov.vn)', function (array &$d): void {
    $d['items'][0]['url'] = 'https://sontra.danang.gov.vn/';
    $d['items'][0]['root_domain'] = 'danang.gov.vn';
}, 'Không được dùng tên miền thật');
expectRejected('Từ chối tên gốc chính thức không có dấu hiệu hư cấu (.io.vn)', function (array &$d): void {
    $d['official_roots'][] = 'ten-that.io.vn';
}, 'Không được dùng tên miền thật');
expectRejected('Từ chối tên miền thật (.com) trong tên gốc chính thức', function (array &$d): void {
    $d['official_roots'][] = 'example.com';
}, 'Không được dùng tên miền thật');
expectRejected('Từ chối nhãn is_official sai so với danh sách gốc', function (array &$d): void {
    $d['items'][5]['is_official'] = true;
}, 'không khớp với danh sách');
expectRejected('Từ chối tên gốc không nằm cuối tên miền', function (array &$d): void {
    $d['items'][0]['root_domain'] = 'ngan-hang-mophong.example';
}, 'không nằm ở cuối');
expectRejected('Từ chối thủ thuật không hợp lệ', function (array &$d): void {
    $d['items'][0]['trick'] = 'khac';
}, 'thủ thuật không hợp lệ');

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
