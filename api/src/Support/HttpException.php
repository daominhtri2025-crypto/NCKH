<?php

declare(strict_types=1);

namespace AnToanSo\Support;

use RuntimeException;

/**
 * Lỗi nghiệp vụ có mã HTTP. Thông điệp hiển thị cho người dùng bằng tiếng Việt.
 */
final class HttpException extends RuntimeException
{
    public function __construct(public readonly int $status, string $message)
    {
        parent::__construct($message);
    }
}
