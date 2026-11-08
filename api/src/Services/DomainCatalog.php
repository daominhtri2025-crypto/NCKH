<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use RuntimeException;

/**
 * Nạp và kiểm tra nội dung Module 2 (Thám tử không gian mạng).
 *
 * Chốt an toàn: mọi tên miền trong nội dung phải thuộc một trong các hậu tố sau:
 *  - .test, .example (dành riêng cho thử nghiệm theo RFC 2606);
 *  - .io.vn, chỉ khi tên gốc chứa dấu hiệu hư cấu "phong" (ví dụ uubnd-mophong.io.vn).
 * Tên gốc dưới .io.vn không có dấu hiệu hư cấu sẽ bị từ chối, để không vô tình dùng tên thật.
 * Nhãn "chính thống" phải nhất quán với danh sách tên gốc chính thức.
 */
final class DomainCatalog
{
    /** Hậu tố được phép. .io.vn yêu cầu thêm dấu hiệu hư cấu (xem assertSafeDomain). */
    public const SAFE_SUFFIXES = ['.test', '.example', '.io.vn'];
    public const FICTION_MARKER = 'phong';
    public const TRICKS = ['none', 'thay-ky-tu', 'ten-mien-con', 'doi-duoi', 'them-tu', 'duong-dan'];

    /** @var array<string,mixed> */
    private array $data;

    /** @var array<string,array<string,mixed>> */
    private array $byId = [];

    public function __construct(string $file)
    {
        if (!is_file($file)) {
            throw new RuntimeException('Không tìm thấy tệp nội dung: ' . $file);
        }
        $data = json_decode((string) file_get_contents($file), true);
        if (!is_array($data)) {
            throw new RuntimeException('Tệp nội dung không phải JSON hợp lệ: ' . $file);
        }
        $this->validate($data);
        $this->data = $data;
        foreach ($data['items'] as $item) {
            $this->byId[$item['id']] = $item;
        }
    }

    public function module(): int
    {
        return (int) $this->data['module'];
    }

    public function title(): string
    {
        return (string) $this->data['title'];
    }

    public function version(): string
    {
        return (string) $this->data['version'];
    }

    /** @return array<string,mixed> */
    public function rule(): array
    {
        return $this->data['rule'];
    }

    /** @return list<string> */
    public function officialRoots(): array
    {
        return $this->data['official_roots'];
    }

    public function referenceNote(): string
    {
        return (string) $this->data['reference_note'];
    }

    /** @return list<array<string,mixed>> */
    public function items(): array
    {
        return $this->data['items'];
    }

    /** @return array<string,mixed>|null */
    public function find(string $id): ?array
    {
        return $this->byId[$id] ?? null;
    }

    /**
     * Góc nhìn công khai của một mục: không có is_official và trick.
     * Tên gốc (root_domain) được cung cấp để học sinh áp dụng quy tắc đọc từ phải sang trái.
     *
     * @param array<string,mixed> $item
     * @return array<string,mixed>
     */
    public static function publicItem(array $item): array
    {
        $host = (string) parse_url((string) $item['url'], PHP_URL_HOST);
        return [
            'id' => $item['id'],
            'url' => $item['url'],
            'host' => $host,
            'root_domain' => $item['root_domain'],
        ];
    }

    /** @param array<string,mixed> $data */
    private function validate(array $data): void
    {
        if (!isset($data['module'], $data['version'], $data['title']) || !is_int($data['module'])) {
            throw new RuntimeException('Thiếu trường module, version hoặc title.');
        }
        foreach (['official_roots', 'items', 'rule', 'reference_note'] as $field) {
            if (!isset($data[$field])) {
                throw new RuntimeException("Thiếu trường {$field}.");
            }
        }
        if (!is_array($data['official_roots']) || $data['official_roots'] === []) {
            throw new RuntimeException('Danh sách tên gốc chính thức rỗng.');
        }
        foreach ($data['official_roots'] as $root) {
            $this->assertSafeDomain((string) $root, 'tên gốc chính thức');
        }
        if (!is_array($data['items']) || count($data['items']) < 2) {
            throw new RuntimeException('Cần ít nhất 2 mục.');
        }

        $seen = [];
        $officialCount = 0;
        foreach ($data['items'] as $item) {
            $id = $item['id'] ?? '';
            if (!is_string($id) || !preg_match('/^[a-z0-9-]{3,60}$/', $id)) {
                throw new RuntimeException('Mã mục không hợp lệ: ' . (is_string($id) ? $id : '?'));
            }
            if (isset($seen[$id])) {
                throw new RuntimeException('Trùng mã mục: ' . $id);
            }
            $seen[$id] = true;

            $url = (string) ($item['url'] ?? '');
            $host = parse_url($url, PHP_URL_HOST);
            if (!str_starts_with($url, 'https://') || !is_string($host)) {
                throw new RuntimeException("Mục {$id}: URL phải bắt đầu bằng https:// và có tên miền.");
            }
            $this->assertSafeDomain($host, "tên miền của mục {$id}");

            $root = (string) ($item['root_domain'] ?? '');
            $this->assertSafeDomain($root, "tên gốc của mục {$id}");
            if ($host !== $root && !str_ends_with($host, '.' . $root)) {
                throw new RuntimeException("Mục {$id}: tên gốc {$root} không nằm ở cuối tên miền {$host}.");
            }

            if (!is_bool($item['is_official'] ?? null)) {
                throw new RuntimeException("Mục {$id}: is_official phải là true hoặc false.");
            }
            $inList = in_array($root, $data['official_roots'], true);
            if ($item['is_official'] !== $inList) {
                throw new RuntimeException("Mục {$id}: nhãn is_official không khớp với danh sách tên gốc chính thức.");
            }
            if ($item['is_official']) {
                $officialCount++;
            }

            if (!in_array($item['trick'] ?? null, self::TRICKS, true)) {
                throw new RuntimeException("Mục {$id}: thủ thuật không hợp lệ.");
            }
            if (!is_string($item['explanation'] ?? null) || trim($item['explanation']) === '') {
                throw new RuntimeException("Mục {$id}: thiếu giải thích.");
            }
        }

        $fakeCount = count($data['items']) - $officialCount;
        if ($officialCount === 0 || $fakeCount === 0) {
            throw new RuntimeException('Phải có cả mục chính thống lẫn mục giả mạo.');
        }
    }

    private function assertSafeDomain(string $domain, string $what): void
    {
        $suffix = null;
        foreach (self::SAFE_SUFFIXES as $candidate) {
            if (str_ends_with($domain, $candidate) && strlen($domain) > strlen($candidate)) {
                $suffix = $candidate;
                break;
            }
        }
        $name = $suffix === null ? '' : substr($domain, 0, -strlen($suffix));
        // Với .io.vn, tên trước đuôi phải có dấu hiệu hư cấu; .test và .example luôn là hư cấu theo RFC 2606.
        $fictional = $suffix === '.io.vn' ? str_contains($name, self::FICTION_MARKER) : $suffix !== null;
        if ($suffix === null || !$fictional || $name === '') {
            throw new RuntimeException(
                "Không được dùng tên miền thật: {$what} '{$domain}'. Chỉ dùng .test, .example, hoặc .io.vn có dấu hiệu hư cấu."
            );
        }
    }
}
