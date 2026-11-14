<?php

declare(strict_types=1);

namespace AnToanSo\Http;

use AnToanSo\Support\HttpException;

/**
 * Yêu cầu HTTP đã chuẩn hóa. Tách khỏi biến toàn cục để kiểm thử được.
 */
final class Request
{
    /**
     * @param array<string,string> $headers  khóa là tên header viết thường
     * @param array<string,string> $cookies
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        private readonly array $headers = [],
        private readonly string $rawBody = '',
        private readonly array $cookies = [],
        /** @var array<string,string> tham số chuỗi truy vấn (?a=b) */
        private readonly array $query = [],
    ) {
    }

    public static function fromGlobals(): self
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $headers[strtolower(str_replace('_', '-', substr($key, 5)))] = (string) $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE'])) {
            $headers['content-type'] = (string) $_SERVER['CONTENT_TYPE'];
        }
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
            $headers['x-forwarded-proto'] = 'https';
        }

        $uriPath = parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH) ?: '/';
        $path = preg_replace('#^/api(?=/|$)#', '', $uriPath) ?? $uriPath;

        return new self(
            strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')),
            $path === '' ? '/' : $path,
            $headers,
            (string) file_get_contents('php://input'),
            $_COOKIE,
            array_map('strval', array_filter($_GET, 'is_scalar')),
        );
    }

    /** Giá trị tham số chuỗi truy vấn, hoặc null nếu không có. */
    public function query(string $name): ?string
    {
        return $this->query[$name] ?? null;
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    public function isHttps(): bool
    {
        return $this->header('x-forwarded-proto') === 'https';
    }

    public function cookie(string $name): ?string
    {
        return $this->cookies[$name] ?? null;
    }

    /** @return array<string,mixed> */
    public function json(): array
    {
        if (trim($this->rawBody) === '') {
            return [];
        }
        $data = json_decode($this->rawBody, true);
        if (!is_array($data)) {
            throw new HttpException(400, 'Dữ liệu gửi lên không đúng định dạng JSON.');
        }
        return $data;
    }
}
