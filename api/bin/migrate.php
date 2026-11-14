<?php

declare(strict_types=1);

// Cách dùng: php api/bin/migrate.php
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Support\Database;
use AnToanSo\Support\Migrator;

$count = Migrator::run(Database::pdo(), dirname(__DIR__) . '/database/schema.sql');
echo "Đã chạy {$count} câu lệnh SQL thành công.\n";
echo "Đã kiểm tra và nâng cấp CSDL cũ (bổ sung mã định danh nghiên cứu nếu còn thiếu). Chạy lại nhiều lần vẫn an toàn.\n";
