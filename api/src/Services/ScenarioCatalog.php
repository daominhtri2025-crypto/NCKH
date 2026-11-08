<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use RuntimeException;

/**
 * Nạp và kiểm tra nội dung kịch bản từ tệp JSON (có phiên bản để đảm bảo tính nhất quán dữ liệu nghiên cứu).
 * Đáp án (is_safe) không bao giờ được trả về cho client trước khi học sinh trả lời.
 */
final class ScenarioCatalog
{
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
        foreach ($data['scenarios'] as $scenario) {
            $this->byId[$scenario['id']] = $scenario;
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

    /** @return list<array<string,mixed>> */
    public function scenarios(): array
    {
        return $this->data['scenarios'];
    }

    /** @return array<string,mixed>|null */
    public function find(string $id): ?array
    {
        return $this->byId[$id] ?? null;
    }

    /**
     * Góc nhìn công khai của một kịch bản: không kèm đáp án đúng.
     *
     * @param array<string,mixed> $scenario
     * @return array<string,mixed>
     */
    public static function publicView(array $scenario): array
    {
        $choices = [];
        foreach ($scenario['choices'] as $index => $choice) {
            $choices[] = ['index' => $index, 'text' => $choice['text']];
        }
        return [
            'id' => $scenario['id'],
            'title' => $scenario['title'],
            'summary' => $scenario['summary'],
            'messages' => $scenario['messages'],
            'question' => $scenario['question'],
            'choices' => $choices,
        ];
    }

    /** @param array<string,mixed> $data */
    private function validate(array $data): void
    {
        if (!isset($data['module'], $data['version'], $data['title']) || !is_int($data['module'])) {
            throw new RuntimeException('Thiếu trường module, version hoặc title.');
        }
        if (!isset($data['scenarios']) || !is_array($data['scenarios']) || $data['scenarios'] === []) {
            throw new RuntimeException('Danh sách kịch bản rỗng.');
        }

        $seen = [];
        foreach ($data['scenarios'] as $s) {
            $id = $s['id'] ?? '';
            if (!is_string($id) || !preg_match('/^[a-z0-9-]{3,60}$/', $id)) {
                throw new RuntimeException('Mã kịch bản không hợp lệ: ' . (is_string($id) ? $id : '?'));
            }
            if (isset($seen[$id])) {
                throw new RuntimeException('Trùng mã kịch bản: ' . $id);
            }
            $seen[$id] = true;

            foreach (['title', 'summary', 'question', 'takeaway'] as $field) {
                if (!is_string($s[$field] ?? null) || trim($s[$field]) === '') {
                    throw new RuntimeException("Kịch bản {$id} thiếu trường {$field}.");
                }
            }
            if (!is_array($s['messages'] ?? null) || $s['messages'] === []) {
                throw new RuntimeException("Kịch bản {$id} thiếu messages.");
            }
            if (!is_array($s['choices'] ?? null) || count($s['choices']) < 2 || count($s['choices']) > 4) {
                throw new RuntimeException("Kịch bản {$id} phải có từ 2 đến 4 lựa chọn.");
            }

            $hasSafe = false;
            foreach ($s['choices'] as $choice) {
                if (!is_string($choice['text'] ?? null) || !is_string($choice['feedback'] ?? null) || !is_bool($choice['is_safe'] ?? null)) {
                    throw new RuntimeException("Lựa chọn của {$id} thiếu text, feedback hoặc is_safe.");
                }
                $hasSafe = $hasSafe || $choice['is_safe'];
            }
            if (!$hasSafe) {
                throw new RuntimeException("Kịch bản {$id} không có lựa chọn an toàn.");
            }
        }
    }
}
