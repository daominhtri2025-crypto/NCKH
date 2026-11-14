<?php

declare(strict_types=1);

// API trả JSON: không để cảnh báo hoặc thông báo "lỗi thời" của PHP in vào nội dung phản hồi
// (thường gặp khi chạy trên phiên bản PHP mới hơn). Lỗi vẫn được ghi ra nhật ký/cửa sổ máy chủ.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

require __DIR__ . '/bootstrap.php';

use AnToanSo\Http\Request;
use AnToanSo\Http\Routes;

Routes::build()->handle(Request::fromGlobals())->send();
