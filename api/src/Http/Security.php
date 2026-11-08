<?php

declare(strict_types=1);

namespace AnToanSo\Http;

use AnToanSo\Support\Env;
use AnToanSo\Support\HttpException;

/**
 * Lớp bảo vệ CSRF cho các phương thức ghi (kế thừa từ Sơn Trà Số, có điều chỉnh):
 *  1. Nếu có header Origin, phải thuộc danh sách nguồn được phép (APP_URL hoặc chính host hiện tại).
 *     So khớp đầy đủ chuỗi, không dùng str_contains (tránh lỗi evil-run.app.example.com).
 *  2. Thân yêu cầu ghi phải là application/json; trình duyệt không gửi JSON đa nguồn mà không qua preflight.
 * Cookie phiên dùng HttpOnly và SameSite=Lax làm lớp bảo vệ bổ sung.
 */
final class Security
{
    private const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

    public static function guard(Request $request): void
    {
        if (!in_array($request->method, self::WRITE_METHODS, true)) {
            return;
        }

        $origin = $request->header('origin');
        if ($origin !== null && !in_array(rtrim($origin, '/'), self::allowedOrigins($request), true)) {
            throw new HttpException(403, 'Nguồn yêu cầu không được phép (Origin).');
        }

        $contentType = strtolower((string) $request->header('content-type'));
        if (!str_starts_with($contentType, 'application/json')) {
            throw new HttpException(415, 'Yêu cầu ghi phải dùng Content-Type: application/json.');
        }
    }

    /** @return list<string> */
    public static function allowedOrigins(Request $request): array
    {
        $origins = [];
        $appUrl = rtrim(Env::get('APP_URL'), '/');
        if ($appUrl !== '') {
            $origins[] = $appUrl;
        }
        $host = $request->header('host');
        if ($host !== null && $host !== '') {
            $scheme = $request->isHttps() ? 'https' : 'http';
            $origins[] = $scheme . '://' . $host;
        }
        return array_values(array_unique($origins));
    }
}
