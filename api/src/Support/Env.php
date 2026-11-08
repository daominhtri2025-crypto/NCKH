<?php

declare(strict_types=1);

namespace AnToanSo\Support;

/**
 * Đọc cấu hình từ tệp .env (định dạng KEY=VALUE). Không ghi đè biến môi trường đã có sẵn.
 */
final class Env
{
    /** @var array<string,string> giá trị từ tệp .env */
    private static array $vars = [];

    /** @var array<string,string> giá trị gán trực tiếp trong mã (kiểm thử) */
    private static array $overrides = [];

    /** Thứ tự ưu tiên: gán trực tiếp > biến môi trường của tiến trình > tệp .env. */
    public static function load(string $file): void
    {
        if (!is_file($file)) {
            return;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
                continue;
            }
            [$key, $value] = array_map('trim', explode('=', $line, 2));
            self::$vars[$key] = trim($value, "\"'");
        }
    }

    public static function set(string $key, string $value): void
    {
        self::$overrides[$key] = $value;
    }

    public static function get(string $key, string $default = ''): string
    {
        if (array_key_exists($key, self::$overrides)) {
            return self::$overrides[$key];
        }
        $fromProcess = getenv($key);
        if ($fromProcess !== false) {
            return (string) $fromProcess;
        }
        return self::$vars[$key] ?? $default;
    }

    public static function bool(string $key, bool $default): bool
    {
        $value = strtolower(self::get($key, $default ? 'true' : 'false'));
        return in_array($value, ['1', 'true', 'yes', 'on'], true);
    }
}
