<?php

declare(strict_types=1);

// Đặt lại mật khẩu giáo viên khi quên. Mọi phiên đăng nhập của giáo viên đó bị thu hồi.
// Cách dùng: php api/bin/reset_teacher_password.php <TÊN_ĐĂNG_NHẬP>
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Services\TeacherService;

if ($argc !== 2) {
    fwrite(STDERR, "Cách dùng: php api/bin/reset_teacher_password.php <TÊN_ĐĂNG_NHẬP>\n");
    exit(1);
}
try {
    $password = (new TeacherService(new TeacherRepository()))->resetPassword($argv[1]);
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
echo "Đã đặt lại mật khẩu cho '{$argv[1]}'. Mật khẩu mới (chỉ hiện một lần): {$password}\n";
