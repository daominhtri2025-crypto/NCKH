<?php

declare(strict_types=1);

// Đăng ký lớp học trước khi học sinh tham gia.
// Cách dùng: php api/bin/add_class.php <MÃ_LỚP> "<Tên lớp>" "<Tên trường>"
// Ví dụ:     php api/bin/add_class.php 8A1 "Lớp 8A1" "THCS Ví dụ"
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\ClassRepository;

if ($argc !== 4) {
    fwrite(STDERR, "Cách dùng: php api/bin/add_class.php <MÃ_LỚP> \"<Tên lớp>\" \"<Tên trường>\"\n");
    exit(1);
}

$code = strtoupper(trim($argv[1]));
if (!preg_match('/^[A-Z0-9-]{2,40}$/', $code)) {
    fwrite(STDERR, "Mã lớp chỉ gồm chữ không dấu, số và dấu gạch ngang (2 đến 40 ký tự).\n");
    exit(1);
}

(new ClassRepository())->create($code, trim($argv[2]), trim($argv[3]));
echo "Đã tạo lớp {$code}.\n";
