<?php

declare(strict_types=1);

// Tạo tài khoản quản trị viên (không gắn lớp). Mật khẩu ngẫu nhiên được in ra một lần.
// Cách dùng: php api/bin/create_admin.php <TÊN_ĐĂNG_NHẬP>
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Services\TeacherService;

if ($argc !== 2) {
    fwrite(STDERR, "Cách dùng: php api/bin/create_admin.php <TÊN_ĐĂNG_NHẬP>\n");
    exit(1);
}
$username = strtolower(trim($argv[1]));
$repo = new TeacherRepository();
try {
    if (!preg_match('/^[a-z0-9_]{3,40}$/', $username)) {
        throw new RuntimeException('Tên đăng nhập chỉ gồm chữ thường, số và dấu gạch dưới (3 đến 40 ký tự).');
    }
    if ($repo->findByUsername($username) !== null) {
        throw new RuntimeException("Tên đăng nhập {$username} đã tồn tại.");
    }
    $password = bin2hex(random_bytes(9));
    $repo->create($username, password_hash($password, PASSWORD_DEFAULT), null, 'admin', true);
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
echo "Đã tạo tài khoản quản trị '{$username}'.\n";
echo "Mật khẩu (chỉ hiện một lần, hãy ghi lại): {$password}\n";
