<?php

declare(strict_types=1);

// Bộ định tuyến cho máy chủ PHP tích hợp khi phát triển cục bộ:
//   php -S 127.0.0.1:8000 -t api api/router.php
// Tệp tĩnh tồn tại thì phục vụ trực tiếp; còn lại chuyển về index.php.
if (is_file(__DIR__ . parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH))) {
    return false;
}
require __DIR__ . '/index.php';
