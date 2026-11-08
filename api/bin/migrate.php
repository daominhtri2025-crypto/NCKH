<?php

declare(strict_types=1);

// Cách dùng: php api/bin/migrate.php
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Support\Database;
use AnToanSo\Support\Migrator;

$count = Migrator::run(Database::pdo(), dirname(__DIR__) . '/database/schema.sql');
echo "Đã chạy {$count} câu lệnh SQL thành công.\n";
