<?php

declare(strict_types=1);

// Cấp lại thẻ cho học sinh đã kích hoạt (làm mất thẻ). Tiến độ được giữ nguyên; mã cũ mất hiệu lực.
// Cách dùng: php api/bin/reissue_card.php <MÃ_CŨ>
// Nhóm kỹ thuật có thể cấp lại cho bất kỳ lớp nào. Giáo viên làm việc này trên ứng dụng, chỉ trong lớp mình.
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Services\ParticipantService;
use AnToanSo\Support\HttpException;

if ($argc !== 2) {
    fwrite(STDERR, "Cách dùng: php api/bin/reissue_card.php <MÃ_CŨ>\n");
    exit(1);
}
try {
    $svc = new ParticipantService(new ParticipantRepository(), new ClassRepository());
    $newCode = $svc->reissueCard($argv[1], null, null);
} catch (HttpException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
echo "Mã mới: {$newCode}\n";
echo "Mã cũ ({$argv[1]}) đã mất hiệu lực. Tiến độ được giữ nguyên.\n";
echo "Ghi vào sổ phát thẻ và in thẻ mới cho học sinh.\n";
