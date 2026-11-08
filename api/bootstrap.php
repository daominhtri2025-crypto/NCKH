<?php

declare(strict_types=1);

use AnToanSo\Support\Env;

date_default_timezone_set('Asia/Ho_Chi_Minh');

spl_autoload_register(static function (string $class): void {
    $prefix = 'AnToanSo\\';
    if (strncmp($class, $prefix, strlen($prefix)) !== 0) {
        return;
    }
    $file = __DIR__ . '/src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

Env::load(__DIR__ . '/.env');
