<?php

declare(strict_types=1);

// Tạo tài khoản mặc định cho thử nghiệm cục bộ: admin và giaovien1.
// Chỉ chạy khi APP_ENV=local và APP_URL trỏ về localhost. Cách dùng: php api/bin/seed_local.php
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Services\LocalSeeder;

try {
    $created = (new LocalSeeder())->run();
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}
if ($created === []) {
    echo "Tài khoản mặc định đã có sẵn, không tạo thêm.\n";
} else {
    echo 'Đã tạo: ' . implode(', ', $created) . "\n";
}
echo "Đăng nhập lần đầu sẽ yêu cầu đổi mật khẩu.\n";
echo "  admin      / Admin@12345     (quản trị)\n";
echo "  giaovien1  / Giaovien@12345  (giáo viên, lớp 8A1)\n";
