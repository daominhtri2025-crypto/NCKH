<?php

declare(strict_types=1);

// In lô thẻ mã cho một lớp. Mỗi thẻ là một mã ngẫu nhiên, không gắn với tên học sinh.
// Cách dùng: php api/bin/issue_cards.php <MÃ_LỚP> <SỐ_THẺ> <tệp_đầu_ra.csv>
// Ví dụ:     php api/bin/issue_cards.php 8A1 40 D:\in_the\8A1.csv
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Services\ParticipantService;
use AnToanSo\Repositories\ParticipantRepository;

if ($argc !== 4 || !ctype_digit($argv[2])) {
    fwrite(STDERR, "Cách dùng: php api/bin/issue_cards.php <MÃ_LỚP> <SỐ_THẺ> <tệp_đầu_ra.csv>\n");
    exit(1);
}
$classCode = strtoupper(trim($argv[1]));
try {
    $codes = (new ParticipantService(new ParticipantRepository(), new ClassRepository()))
        ->issueCards($classCode, (int) $argv[2]);
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
$fh = fopen($argv[3], 'w');
fwrite($fh, "\xEF\xBB\xBF" . "ma_the,ma_lop\n");
foreach ($codes as $code) {
    fwrite($fh, "{$code},{$classCode}\n");
}
fclose($fh);
echo 'Đã tạo ' . count($codes) . " thẻ cho lớp {$classCode} trong {$argv[3]}\n";
echo "Lưu ý: tệp này chứa mã thẻ. Chỉ in và phát cho giáo viên phụ trách, không gửi qua kênh công khai.\n";
