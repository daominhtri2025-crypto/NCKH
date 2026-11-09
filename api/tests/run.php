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
foreach (['assessments_self', 'module_events', 'participants', 'teachers', 'classes'] as $table) {
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

/** Cấp một thẻ mã mới cho lớp (giống bin/issue_cards.php). */
function issueCard(string $classCode = '8A1'): string
{
    $svc = new AnToanSo\Services\ParticipantService(new AnToanSo\Repositories\ParticipantRepository(), new AnToanSo\Repositories\ClassRepository());
    return $svc->issueCards($classCode, 1)[0];
}

/** Kích hoạt thẻ bằng API. */
function claimCard(string $code, bool $consent = true, string $version = 'v1', array $headers = []): Response
{
    return call('POST', '/api/participants/claim', ['code' => $code, 'consent' => $consent, 'consent_version' => $version], [], $headers);
}

/** Học sinh mới: cấp thẻ rồi kích hoạt. */
function newStudent(): Response
{
    return claimCard(issueCard('8A1'));
}

/** Lấy token cookie ats_teacher từ phản hồi đăng nhập giáo viên. */
function teacherTokenFrom(Response $response): ?string
{
    foreach ($response->headers() as $line) {
        if (preg_match('/^Set-Cookie: ats_teacher=([^;]*)/', $line, $m)) {
            return $m[1] === '' ? null : $m[1];
        }
    }
    return null;
}

echo "Kiểm thử thẻ mã và kích hoạt\n";
$card = issueCard('8A1');
check('In thẻ: mã đúng định dạng XXXX-XXXX', (bool) preg_match('/^[23456789A-HJKMNP-Z]{4}-[23456789A-HJKMNP-Z]{4}$/', $card), $card);
check('Thẻ mới ở trạng thái issued', $pdo->query("SELECT status FROM participants WHERE code = '{$card}'")->fetchColumn() === 'issued');
$earlyLogin = call('POST', '/api/session', ['code' => $card]);
check('Thẻ chưa kích hoạt không đăng nhập được (403)', $earlyLogin->status === 403, (string) $earlyLogin->status);
check('Từ chối kích hoạt khi chưa đồng ý (422)', claimCard($card, false)->status === 422);
check('Từ chối phiên bản phiếu đồng ý cũ (422)', claimCard($card, true, 'v0')->status === 422);
check('Từ chối mã không tồn tại (422, thông điệp chung)', claimCard('ZZZZ-ZZZZ')->status === 422);

$reg = claimCard($card);
check('Kích hoạt thẻ thành công (201)', $reg->status === 201, (string) $reg->status);
$code = $card;
$token = sessionTokenFrom($reg);
check('Cookie phiên được cấp khi kích hoạt', $token !== null && strlen($token) === 64);
$row = $pdo->query("SELECT token_hash, status, consent_version, claimed_at FROM participants WHERE code = '{$code}'")->fetch();
check('CSDL: trạng thái active, phiên bản phiếu v1, có thời điểm kích hoạt', $row['status'] === 'active' && $row['consent_version'] === 'v1' && $row['claimed_at'] !== null);
check('CSDL chỉ lưu băm của token, không lưu token gốc', $row['token_hash'] === hash('sha256', (string) $token) && $row['token_hash'] !== $token);
check('Phản hồi kích hoạt không chứa token', $token === null || !str_contains((string) json_encode($reg->body), $token));
check('Kích hoạt lại cùng thẻ bị từ chối (422)', claimCard($card)->status === 422);

echo "Xác thực phiên\n";
$anon = call('GET', '/api/module1');
check('Truy cập Module 1 khi chưa đăng nhập bị từ chối (401)', $anon->status === 401);

$me = call('GET', '/api/me', null, ['ats_session' => (string) $token]);
check('GET /api/me với cookie hợp lệ (200)', $me->status === 200 && $me->body['participant']['code'] === $code);

$badLogin = call('POST', '/api/session', ['code' => 'ZZZZ-ZZZZ']);
check('Đăng nhập sai mã (401)', $badLogin->status === 401);

$csrf = claimCard(issueCard('8A1'), true, 'v1', ['origin' => 'https://evil-run.app.example.com']);
check('Chặn Origin lạ (403)', $csrf->status === 403, (string) $csrf->status);

$notJson = claimCard(issueCard('8A1'), true, 'v1', ['content-type' => 'text/plain']);
check('Chặn ghi không phải JSON (415)', $notJson->status === 415, (string) $notJson->status);

$login = call('POST', '/api/session', ['code' => strtolower(substr($code, 0, 4) . substr($code, 5))]);
check('Đăng nhập lại bằng mã (không phân biệt hoa thường, bỏ gạch)', $login->status === 200);
$newToken = sessionTokenFrom($login);
$oldStillWorks = call('GET', '/api/me', null, ['ats_session' => (string) $token]);
check('Token cũ bị vô hiệu sau khi đăng nhập lại (401)', $oldStillWorks->status === 401);
$token = $newToken;
completePhase((string) $token, 'pre');


/** Hoàn thành một giai đoạn khảo sát: đáp án đúng cho câu kiến thức, mức 2 cho câu hành vi (bỏ qua câu đã trả lời). */
function completePhase(string $token, string $phase): void
{
    $cookie = ['ats_session' => $token];
    $catalog = new AnToanSo\Services\AssessmentCatalog(dirname(__DIR__) . '/content/assessment_items.json');
    foreach ($catalog->items() as $item) {
        $body = $item['instrument'] === 'knowledge' ? ['answer_index' => $item['correct']] : ['answer_value' => 2];
        call('POST', "/api/assessments/{$phase}/items/{$item['id']}/answer", $body, $cookie);
    }
}

/** Hoàn thành cả ba module bằng đáp án đúng (dữ liệu lấy từ nội dung). */
function completeModules(string $token): void
{
    $cookie = ['ats_session' => $token];
    $m1 = new AnToanSo\Services\ScenarioCatalog(dirname(__DIR__) . '/content/module1_scenarios.json');
    foreach ($m1->scenarios() as $sc) {
        $safe = array_search(true, array_column($sc['choices'], 'is_safe'), true);
        call('POST', "/api/module1/scenarios/{$sc['id']}/answer", ['choice_index' => $safe], $cookie);
    }
    $m2 = new AnToanSo\Services\DomainCatalog(dirname(__DIR__) . '/content/module2_domains.json');
    foreach ($m2->items() as $it) {
        call('POST', "/api/module2/items/{$it['id']}/answer", ['verdict' => $it['is_official'] ? 'official' : 'fake'], $cookie);
    }
    $m3 = new AnToanSo\Services\ChecklistCatalog(dirname(__DIR__) . '/content/module3_checklist.json');
    foreach (array_merge(...array_column($m3->platforms(), 'steps')) as $st) {
        call('POST', "/api/module3/steps/{$st['id']}/complete", ['quiz_choice' => $st['quiz']['correct'], 'practiced' => true], $cookie);
    }
    call('POST', '/api/module3/lab', ['best_band' => 'strong'], $cookie);
}

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

echo "Khảo sát tiền–hậu–theo dõi và mở khóa\n";
$ta = sessionTokenFrom(newStudent());
$taCookie = ['ats_session' => (string) $ta];
$taCode = (string) call('GET', '/api/me', null, $taCookie)->body['participant']['code'];

check('Chưa làm khảo sát đầu vào: Module 1 bị khóa (403)', call('GET', '/api/module1', null, $taCookie)->status === 403);
check('Khóa Module 2 và Module 3 khi chưa làm pre-test', call('GET', '/api/module2', null, $taCookie)->status === 403
    && call('GET', '/api/module3', null, $taCookie)->status === 403);
$status0 = call('GET', '/api/assessments', null, $taCookie);
check('Trạng thái: pre mở, post và delayed khóa', $status0->body['phases']['pre']['status'] === 'open'
    && $status0->body['phases']['post']['status'] === 'locked' && $status0->body['phases']['delayed']['status'] === 'locked');
$preView = call('GET', '/api/assessments/pre', null, $taCookie);
check('Pre-test có 16 câu (10 kiến thức, 6 hành vi)', count($preView->body['items']) === 16);
$preJson = (string) json_encode($preView->body);
check('Câu hỏi không lộ đáp án đúng hay cờ đảo chiều', !str_contains($preJson, '"correct"') && !str_contains($preJson, 'reverse'));
check('Câu hành vi không có lựa chọn đáp án', (function () use ($preView) {
    foreach ($preView->body['items'] as $it) {
        if ($it['instrument'] === 'behavior' && array_key_exists('options', $it)) return false;
    }
    return true;
})());
check('Giai đoạn không tồn tại (404)', call('GET', '/api/assessments/giua-ky', null, $taCookie)->status === 404);
check('Post-test khóa khi chưa làm pre-test (403)', call('POST', '/api/assessments/post/items/k01-khoa-tai-khoan/answer', ['answer_index' => 0], $taCookie)->status === 403);

$k1 = call('POST', '/api/assessments/pre/items/k01-khoa-tai-khoan/answer', ['answer_index' => 9], $taCookie);
check('Đáp án kiến thức ngoài phạm vi (422)', $k1->status === 422);
$k1ok = call('POST', '/api/assessments/pre/items/k01-khoa-tai-khoan/answer', ['answer_index' => 1, 'response_ms' => 4300], $taCookie);
check('Ghi nhận câu kiến thức (201), không phản hồi đúng/sai', $k1ok->status === 201 && !array_key_exists('is_correct', $k1ok->body) && !array_key_exists('is_safe', $k1ok->body));
check('Tiến độ pre sau 1 câu: 1/16', $k1ok->body['progress']['answered'] === 1 && $k1ok->body['progress']['total'] === 16);
check('Câu hành vi: mức 5 bị từ chối (422)', call('POST', '/api/assessments/pre/items/b01-xac-thuc-hai-lop/answer', ['answer_value' => 5], $taCookie)->status === 422);
check('Câu hành vi: mức 3 được ghi nhận', call('POST', '/api/assessments/pre/items/b01-xac-thuc-hai-lop/answer', ['answer_value' => 3], $taCookie)->status === 201);
check('Trả lời lại cùng câu bị từ chối (409)', call('POST', '/api/assessments/pre/items/k01-khoa-tai-khoan/answer', ['answer_index' => 0], $taCookie)->status === 409);
check('Câu không tồn tại (404)', call('POST', '/api/assessments/pre/items/khong-co/answer', ['answer_index' => 0], $taCookie)->status === 404);

completePhase((string) $ta, 'pre');
$preDone = call('GET', '/api/assessments', null, $taCookie);
check('Hoàn thành pre-test: trạng thái done', $preDone->body['phases']['pre']['status'] === 'done');
check('Sau pre-test: Module 1 mở (200)', call('GET', '/api/module1', null, $taCookie)->status === 200);

$postBlocked = call('POST', '/api/assessments/post/items/k02-shipper-otp/answer', ['answer_index' => 0], $taCookie);
check('Post-test vẫn khóa khi chưa hoàn thành 3 module (403)', $postBlocked->status === 403
    && str_contains((string) $postBlocked->body['error'], '3 hoạt động'));

completeModules((string) $ta);
$modulesDone = call('GET', '/api/assessments', null, $taCookie)->body;
check('Trạng thái: cả 3 module đã hoàn thành', $modulesDone['modules']['all'] === true);
check('Post-test mở sau khi hoàn thành đủ 3 module', $modulesDone['phases']['post']['status'] === 'open');
$delayedLocked = $modulesDone['phases']['delayed'];
check('Delayed khóa, có thời điểm mở (theo DELAYED_MIN_DAYS = 28)', $delayedLocked['status'] === 'locked' && $delayedLocked['available_at'] === null);

$postWrong = call('POST', '/api/assessments/post/items/k02-shipper-otp/answer', ['answer_index' => 0], $taCookie);
check('Post-test: câu kiến thức sai được ghi nhận (201)', $postWrong->status === 201);
completePhase((string) $ta, 'post');
check('Hoàn thành post-test', call('GET', '/api/assessments', null, $taCookie)->body['phases']['post']['status'] === 'done');

$delayedTooSoon = call('POST', '/api/assessments/delayed/items/k01-khoa-tai-khoan/answer', ['answer_index' => 1], $taCookie);
check('Delayed chưa đủ 28 ngày: từ chối (403)', $delayedTooSoon->status === 403);
$delayedState = call('GET', '/api/assessments', null, $taCookie)->body['phases']['delayed'];
check('Delayed có available_at trong tương lai', $delayedState['available_at'] !== null && $delayedState['available_at'] > date('Y-m-d H:i:s'));

AnToanSo\Support\Env::set('DELAYED_MIN_DAYS', '0');
$delayedOpen = call('POST', '/api/assessments/delayed/items/k01-khoa-tai-khoan/answer', ['answer_index' => 1, 'response_ms' => 3900], $taCookie);
check('Cấu hình DELAYED_MIN_DAYS = 0: delayed mở và nhận câu trả lời (201)', $delayedOpen->status === 201);
completePhase((string) $ta, 'delayed');
check('Hoàn thành delayed-test', call('GET', '/api/assessments', null, $taCookie)->body['phases']['delayed']['status'] === 'done');
AnToanSo\Support\Env::set('DELAYED_MIN_DAYS', '28');

$knowRows = $pdo->prepare("SELECT phase, item_id, is_correct, answer_index, answer_value, response_ms FROM assessments_self WHERE participant_id = (SELECT id FROM participants WHERE code = ?) ORDER BY id");
$knowRows->execute([$taCode]);
$allRows = $knowRows->fetchAll();
$wrongPost = array_values(array_filter($allRows, fn ($r) => $r['phase'] === 'post' && $r['item_id'] === 'k02-shipper-otp'));
check('CSDL: câu kiến thức sai có is_correct = 0', count($wrongPost) === 1 && (int) $wrongPost[0]['is_correct'] === 0);
$rightPre = array_values(array_filter($allRows, fn ($r) => $r['phase'] === 'pre' && $r['item_id'] === 'k01-khoa-tai-khoan'));
check('CSDL: câu kiến thức đúng có is_correct = 1 và response_ms', (int) $rightPre[0]['is_correct'] === 1 && (int) $rightPre[0]['response_ms'] === 4300);
$behRow = array_values(array_filter($allRows, fn ($r) => $r['phase'] === 'pre' && $r['item_id'] === 'b01-xac-thuc-hai-lop'));
check('CSDL: câu hành vi lưu answer_value và is_correct = NULL', (int) $behRow[0]['answer_value'] === 3 && $behRow[0]['is_correct'] === null);

echo "Xuất dữ liệu nghiên cứu\n";
Env::set('ADMIN_TOKEN', '');
check('Xuất dữ liệu bị tắt khi chưa đặt ADMIN_TOKEN (503)', call('GET', '/api/admin/export/wide.csv')->status === 503);
Env::set('ADMIN_TOKEN', 'token-quan-tri-thu-nghiem');
check('Xuất dữ liệu không có token (401)', call('GET', '/api/admin/export/wide.csv')->status === 401);
check('Xuất dữ liệu sai token (401)', call('GET', '/api/admin/export/wide.csv', null, [], ['x-admin-token' => 'sai'])->status === 401);

$wide = call('GET', '/api/admin/export/wide.csv', null, [], ['x-admin-token' => 'token-quan-tri-thu-nghiem']);
check('Xuất wide CSV thành công (200, dạng tệp đính kèm)', $wide->status === 200 && $wide->rawBody() !== null
    && str_contains(implode(' ', $wide->headers()), 'attachment'));
$wideLines = array_values(array_filter(explode("\n", (string) $wide->rawBody())));
$header = str_getcsv(ltrim($wideLines[0], "\xEF\xBB\xBF"));
check('Wide CSV: tiêu đề có các cột lặp đo', in_array('pre_knowledge_correct', $header) && in_array('delayed_mean_response_ms', $header) && in_array('m3_lab_passed', $header));
check('Wide CSV không có cột định danh thật (họ tên, email, số điện thoại, ngày đồng ý)', !preg_match('/name|email|phone|consent|sdt|ho_ten/i', $wideLines[0]));
$taRow = null;
foreach ($wideLines as $line) {
    $cells = str_getcsv($line);
    if (($cells[0] ?? '') === $taCode) {
        $taRow = array_combine($header, $cells);
    }
}
check('Wide CSV: học sinh thử nghiệm xuất hiện với mã giả danh', $taRow !== null);
check('Pre: 10/10 câu kiến thức đúng', $taRow !== null && (int) $taRow['pre_knowledge_correct'] === 10 && (float) $taRow['pre_knowledge_pct'] === 100.0);
check('Post: 9/10 câu kiến thức đúng (một câu sai có chủ đích)', $taRow !== null && (int) $taRow['post_knowledge_correct'] === 9);
check('Hành vi có đảo chiều: trung bình điều chỉnh pre = 2.5',
    $taRow !== null && abs((float) $taRow['pre_behavior_mean_adj'] - 2.5) < 0.01, (string) ($taRow['pre_behavior_mean_adj'] ?? '?'));
check('Wide CSV: module 1 đã trả lời đủ 5, module 2 đủ 12, module 3 đủ 8 bước, lab đạt',
    $taRow !== null && $taRow['m1_items_answered'] === '5' && $taRow['m2_items_answered'] === '12'
    && $taRow['m3_steps_passed'] === '8' && $taRow['m3_lab_passed'] === '1');

$long = call('GET', '/api/admin/export/long.csv', null, [], ['x-admin-token' => 'token-quan-tri-thu-nghiem']);
$longText = (string) $long->rawBody();
check('Long CSV: đủ 16 dòng pre cho học sinh thử nghiệm', substr_count($longText, "{$taCode},8A1,pre,") === 16);
check('Long CSV: có dòng câu kiến thức sai với is_correct = 0', str_contains($longText, "{$taCode},8A1,post,k02-shipper-otp,knowledge,0,"));
check('Long CSV không có cột định danh thật', !preg_match('/^pseudonym,class_code,phase,item_id,instrument,is_correct,answer_index,answer_value,response_ms,content_version,answered_at\r?\n/m', '') && !str_contains(explode("\n", $longText)[0], 'email'));

echo "Module 2: thám tử không gian mạng\n";
$t2 = sessionTokenFrom(newStudent());
$t2Cookie = ['ats_session' => (string) $t2];
$call2Code = (string) call('GET', '/api/me', null, $t2Cookie)->body['participant']['code'];
completePhase((string) $t2, 'pre');

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
$otherStudent = sessionTokenFrom(newStudent());
completePhase((string) $otherStudent, 'pre');
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

$t2Pid = (int) $pdo->query("SELECT id FROM participants WHERE code = '" . $call2Code . "'")->fetchColumn();
$evt = $pdo->query("SELECT item_id, choice_index, is_safe, hint_used, response_ms FROM module_events WHERE module = 2 AND participant_id = {$t2Pid} ORDER BY id")->fetchAll();
check('Ghi đúng 2 dòng module_events cho Module 2', count($evt) === 2, (string) count($evt));
check('Mục giả mạo: choice_index = 1, is_safe = 1, hint_used = 1, response_ms = 3100',
    isset($evt[0]) && (int) $evt[0]['choice_index'] === 1 && (int) $evt[0]['is_safe'] === 1
    && (int) $evt[0]['hint_used'] === 1 && (int) $evt[0]['response_ms'] === 3100);
check('Mục chính thống trả lời sai: choice_index = 1, is_safe = 0, hint_used = 0',
    isset($evt[1]) && (int) $evt[1]['choice_index'] === 1 && (int) $evt[1]['is_safe'] === 0
    && (int) $evt[1]['hint_used'] === 0);

$m1Hint = (int) $pdo->query("SELECT COUNT(*) FROM module_events WHERE module = 1 AND hint_used IS NULL")->fetchColumn();
check('Module 1 không ghi hint_used (NULL)', $m1Hint === (int) $pdo->query("SELECT COUNT(*) FROM module_events WHERE module = 1")->fetchColumn());

echo "Module 3: phòng thí nghiệm bảo mật tài khoản\n";
$t3 = sessionTokenFrom(newStudent());
$t3Cookie = ['ats_session' => (string) $t3];
completePhase((string) $t3, 'pre');
check('Module 3 yêu cầu đăng nhập (401)', call('GET', '/api/module3')->status === 401);

$m3 = call('GET', '/api/module3', null, $t3Cookie);
check('Tổng quan Module 3 (200)', $m3->status === 200);
$platforms = $m3->body['platforms'] ?? [];
check('Có 2 nền tảng (Zalo, Facebook)', count($platforms) === 2);
$allSteps = array_merge(...array_column($platforms, 'steps'));
check('Tổng cộng 8 bước checklist', count($allSteps) === 8, (string) count($allSteps));
$m3Json = (string) json_encode($m3->body, JSON_UNESCAPED_UNICODE);
check('Tổng quan không lộ đáp án đúng hay giải thích', !str_contains($m3Json, 'correct_choice') && !str_contains($m3Json, 'explanation') && !str_contains($m3Json, '"correct"'));
check('Tổng quan có cảnh báo về tính cập nhật của menu', $m3->body['disclaimer'] !== '');
check('Ban đầu chưa có bước nào đạt', $m3->body['progress']['passed_steps'] === 0);

$stepId = $allSteps[0]['id'];
check('Từ chối khi chưa xác nhận đã thực hành (422)',
    call('POST', "/api/module3/steps/{$stepId}/complete", ['quiz_choice' => 0, 'practiced' => false], $t3Cookie)->status === 422);
check('Từ chối chỉ số đáp án ngoài phạm vi (422)',
    call('POST', "/api/module3/steps/{$stepId}/complete", ['quiz_choice' => 9, 'practiced' => true], $t3Cookie)->status === 422);
check('Bước không tồn tại (404)',
    call('POST', '/api/module3/steps/khong-co/complete', ['quiz_choice' => 0, 'practiced' => true], $t3Cookie)->status === 404);

$wrong = call('POST', "/api/module3/steps/{$stepId}/complete", ['quiz_choice' => 1, 'practiced' => true, 'response_ms' => 8000], $t3Cookie);
check('Trả lời sai câu kiểm tra: passed = false, attempt 1', $wrong->status === 201 && $wrong->body['passed'] === false && $wrong->body['attempt_no'] === 1);
check('Phản hồi có đáp án đúng và giải thích sau khi trả lời', isset($wrong->body['correct_choice']) && $wrong->body['explanation'] !== '');
$right = call('POST', "/api/module3/steps/{$stepId}/complete", ['quiz_choice' => (int) $wrong->body['correct_choice'], 'practiced' => true], $t3Cookie);
check('Thử lại đúng: passed = true, attempt 2', $right->body['passed'] === true && $right->body['attempt_no'] === 2 && $right->body['is_first_attempt'] === false);

$m3b = call('GET', '/api/module3', null, $t3Cookie);
$firstStep = $m3b->body['platforms'][0]['steps'][0];
check('Bước đã đạt hiển thị trạng thái passed', $firstStep['status'] === 'passed' && $firstStep['attempts'] === 2);
check('Tiến độ: 1/8 bước đạt (13%)', $m3b->body['progress']['passed_steps'] === 1 && $m3b->body['progress']['score_percent'] === 13);

$lastStep = $allSteps[7]['id'];
call('POST', "/api/module3/steps/{$lastStep}/complete", ['quiz_choice' => 0, 'practiced' => true], $t3Cookie);

check('Phòng thí nghiệm: từ chối trường password (422)',
    call('POST', '/api/module3/lab', ['best_band' => 'strong', 'password' => 'Abc!2345'], $t3Cookie)->status === 422);
check('Phòng thí nghiệm: từ chối mức đạt không hợp lệ (422)',
    call('POST', '/api/module3/lab', ['best_band' => 'mega'], $t3Cookie)->status === 422);
$lab = call('POST', '/api/module3/lab', ['best_band' => 'strong'], $t3Cookie);
check('Phòng thí nghiệm: mức mạnh được ghi nhận đạt (201)', $lab->status === 201 && $lab->body['passed'] === true);
$m3c = call('GET', '/api/module3', null, $t3Cookie);
check('Tổng quan phản ánh phòng thí nghiệm đã đạt', $m3c->body['lab']['passed'] === true);

$t3Code = (string) call('GET', '/api/me', null, $t3Cookie)->body['participant']['code'];
$t3Pid = (int) $pdo->query("SELECT id FROM participants WHERE code = '" . $t3Code . "'")->fetchColumn();
$m3Rows = $pdo->query("SELECT item_id, choice_index, is_safe, attempt_no, response_ms FROM module_events WHERE module = 3 AND participant_id = {$t3Pid} ORDER BY id")->fetchAll();
check('Ghi nhật ký Module 3: 2 lần thử bước đầu + 1 bước cuối + 1 phòng thí nghiệm = 4 dòng',
    count($m3Rows) === 4, (string) count($m3Rows));
check('Lần thử sai: is_safe = 0; lần đúng: is_safe = 1',
    (int) $m3Rows[0]['is_safe'] === 0 && (int) $m3Rows[1]['is_safe'] === 1);
check('Phòng thí nghiệm: is_safe = 1 khi mạnh (choice_index = 2)',
    $m3Rows[3]['item_id'] === 'lab-strength' && (int) $m3Rows[3]['is_safe'] === 1 && (int) $m3Rows[3]['choice_index'] === 2);
check('Nhật ký Module 3 không chứa nội dung mật khẩu (cột chỉ có số và mã)',
    !str_contains((string) json_encode($m3Rows), 'Abc!2345'));

echo "Kiểm tra nội dung checklist Module 3\n";
$badChecklist = tempnam(sys_get_temp_dir(), 'ckl');
file_put_contents($badChecklist, json_encode(['module' => 3, 'version' => 'x', 'title' => 'x', 'disclaimer' => 'd', 'platforms' => [[
    'id' => 'p', 'name' => 'P', 'steps' => [[
        'id' => 'bad-step', 'title' => 'T', 'instruction' => 'I', 'why' => 'W',
        'quiz' => ['question' => 'Q', 'explanation' => 'E', 'options' => ['a', 'b'], 'correct' => 5],
    ]],
]]]));
$rejectedCkl = false;
try {
    new AnToanSo\Services\ChecklistCatalog($badChecklist);
} catch (RuntimeException $e) {
    $rejectedCkl = str_contains($e->getMessage(), 'nằm ngoài phạm vi');
}
unlink($badChecklist);
check('Từ chối checklist có đáp án đúng nằm ngoài phạm vi', $rejectedCkl);

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

echo "Giáo viên: tiến độ lớp, không lộ câu trả lời, cách ly giữa các lớp\n";
(new AnToanSo\Repositories\ClassRepository())->create('8B1', 'Lớp 8B1', 'THCS Thử nghiệm');
$teacherSvc = new AnToanSo\Services\TeacherService(new AnToanSo\Repositories\TeacherRepository());
$tPass = $teacherSvc->createTeacher('gv_thu_nghiem', '8A1', true);
check('Tạo tài khoản giáo viên với mật khẩu ngẫu nhiên 12 ký tự', strlen($tPass) === 12);
check('Không tạo trùng tên đăng nhập', (function () use ($teacherSvc) {
    try { $teacherSvc->createTeacher('gv_thu_nghiem', '8A1', true); return false; } catch (RuntimeException $e) { return true; }
})());
check('Đăng nhập giáo viên sai mật khẩu (401)', call('POST', '/api/teacher/session', ['username' => 'gv_thu_nghiem', 'password' => 'sai'])->status === 401);
check('Đăng nhập tên không tồn tại (401, cùng thông điệp)', call('POST', '/api/teacher/session', ['username' => 'khong_co', 'password' => 'x'])->status === 401);
check('Xem danh sách khi chưa đăng nhập (401)', call('GET', '/api/teacher/roster')->status === 401);
$tLogin = call('POST', '/api/teacher/session', ['username' => 'gv_thu_nghiem', 'password' => $tPass]);
check('Đăng nhập giáo viên thành công (200)', $tLogin->status === 200);
$tTok = teacherTokenFrom($tLogin);
check('Cookie ats_teacher được cấp', $tTok !== null && strlen($tTok) === 64);
check('CSDL chỉ lưu băm token giáo viên', $pdo->query("SELECT token_hash FROM teachers WHERE username = 'gv_thu_nghiem'")->fetchColumn() === hash('sha256', (string) $tTok));

$unclaimed = issueCard('8A1');
$otherClassCard = issueCard('8B1');
$roster = call('GET', '/api/teacher/roster', null, ['ats_teacher' => (string) $tTok]);
check('Danh sách lớp (200)', $roster->status === 200);
check('Danh sách đúng lớp được gán', $roster->body['class_code'] === '8A1');
$byCode = [];
foreach ($roster->body['students'] as $st) { $byCode[$st['code']] = $st; }
check('Thẻ chưa kích hoạt hiển thị trạng thái issued', ($byCode[$unclaimed]['status'] ?? '') === 'issued');
check('Học sinh đã làm đủ ba giai đoạn hiển thị 16/16/16', isset($byCode[$taCode])
    && $byCode[$taCode]['phases'] === ['pre' => 16, 'post' => 16, 'delayed' => 16], json_encode($byCode[$taCode]['phases'] ?? null));
check('Học sinh đã hoàn thành ba hoạt động hiển thị đủ số liệu', isset($byCode[$taCode])
    && $byCode[$taCode]['modules'] === ['m1' => 5, 'm2' => 12, 'm3_steps' => 8, 'lab' => true]);
check('Không hiển thị thẻ của lớp khác', !isset($byCode[$otherClassCard]));
$rosterJson = (string) json_encode($roster->body, JSON_UNESCAPED_UNICODE);
check('Danh sách không lộ đáp án, lựa chọn hay nội dung câu trả lời',
    !preg_match('/is_correct|answer_index|answer_value|choice_index|is_safe|verdict|explanation|"correct"/', $rosterJson));
check('Danh sách không lộ mật khẩu hay token', !str_contains($rosterJson, $tPass) && !str_contains($rosterJson, (string) $tTok));
call('DELETE', '/api/teacher/session', null, ['ats_teacher' => (string) $tTok]);
$newPass = $teacherSvc->resetPassword('gv_thu_nghiem');
check('Đặt lại mật khẩu giáo viên: mật khẩu cũ không còn dùng được (401)', call('POST', '/api/teacher/session', ['username' => 'gv_thu_nghiem', 'password' => $tPass])->status === 401);
check('Đặt lại mật khẩu giáo viên: mật khẩu mới đăng nhập được (200)', call('POST', '/api/teacher/session', ['username' => 'gv_thu_nghiem', 'password' => $newPass])->status === 200);

check('Đăng xuất giáo viên: danh sách không còn truy cập (401)', call('GET', '/api/teacher/roster', null, ['ats_teacher' => (string) $tTok])->status === 401);

echo "\nKết quả: {$passed} đạt, {$failed} lỗi.\n";
exit($failed === 0 ? 0 : 1);
