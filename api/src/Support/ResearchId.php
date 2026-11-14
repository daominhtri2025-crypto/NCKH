<?php

declare(strict_types=1);

namespace AnToanSo\Support;

/**
 * Mã định danh nghiên cứu (ẩn danh) của học sinh, ví dụ R7K2MQX9HB.
 *
 * Được sinh ngẫu nhiên, độc lập hoàn toàn với mã thẻ (`code`): không thể suy ra mã thẻ từ mã này
 * và ngược lại. Có 10 ký tự, không có dấu gạch nên máy chủ không bao giờ chấp nhận nó làm mã đăng nhập
 * (mã thẻ có dạng XXXX-XXXX).
 */
final class ResearchId
{
    private const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    public const PATTERN = '/^R[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{9}$/';

    public static function generate(): string
    {
        $max = strlen(self::ALPHABET) - 1;
        $id = 'R';
        for ($i = 0; $i < 9; $i++) {
            $id .= self::ALPHABET[random_int(0, $max)];
        }
        return $id;
    }
}
