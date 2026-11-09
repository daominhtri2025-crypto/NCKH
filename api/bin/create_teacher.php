<?php

declare(strict_types=1);

// Tạo tài khoản giáo viên gắn với một lớp. Mật khẩu ngẫu nhiên được in ra một lần.
// Cách dùng: php api/bin/create_teacher.php <TÊN_ĐĂNG_NHẬP> <MÃ_LỚP>
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Services\TeacherService;

if ($argc !== 3) {
    fwrite(STDERR, "Cách dùng: php api/bin/create_teacher.php <TÊN_ĐĂNG_NHẬP> <MÃ_LỚP>\n");
    exit(1);
}
$classCode = strtoupper(trim($argv[2]));
try {
    $password = (new TeacherService(new TeacherRepository()))
        ->createTeacher(strtolower(trim($argv[1])), $classCode, (new ClassRepository())->exists($classCode));
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
echo "Đã tạo tài khoản giáo viên '{$argv[1]}' cho lớp {$classCode}.\n";
echo "Mật khẩu (chỉ hiện một lần, hãy ghi lại và trao cho giáo viên): {$password}\n";
