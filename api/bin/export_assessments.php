<?php

declare(strict_types=1);

// Xuất dữ liệu nghiên cứu ẩn danh ra tệp CSV.
// Cách dùng: php api/bin/export_assessments.php long|wide <đường_dẫn_tệp>
// Ví dụ:     php api/bin/export_assessments.php wide /home/nckh/wide.csv
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Support\Container;

if ($argc !== 3 || !in_array($argv[1], ['long', 'wide'], true)) {
    fwrite(STDERR, "Cách dùng: php api/bin/export_assessments.php long|wide <tệp_đầu_ra>\n");
    exit(1);
}

$exporter = Container::exporter();
$csv = $argv[1] === 'long' ? $exporter->longCsv() : $exporter->wideCsv();
file_put_contents($argv[2], "\xEF\xBB\xBF" . $csv);
echo "Đã ghi " . strlen($csv) . " byte vào {$argv[2]}\n";
