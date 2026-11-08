<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use RuntimeException;

/**
 * Nạp và kiểm tra checklist quyền riêng tư của Module 3.
 * Đáp án đúng của câu kiểm tra nhanh không được gửi đến client trước khi học sinh trả lời.
 */
final class ChecklistCatalog
{
    /** @var array<string,mixed> */
    private array $data;

    /** @var array<string,array<string,mixed>> */
    private array $stepsById = [];

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
        foreach ($data['platforms'] as $platform) {
            foreach ($platform['steps'] as $step) {
                $this->stepsById[$step['id']] = $step;
            }
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

    public function disclaimer(): string
    {
        return (string) $this->data['disclaimer'];
    }

    /** @return list<array<string,mixed>> */
    public function platforms(): array
    {
        return $this->data['platforms'];
    }

    /** @return array<string,mixed>|null */
    public function findStep(string $id): ?array
    {
        return $this->stepsById[$id] ?? null;
    }

    /**
     * Góc nhìn công khai của một bước: không kèm đáp án đúng hay giải thích.
     *
     * @param array<string,mixed> $step
     * @return array<string,mixed>
     */
    public static function publicStep(array $step): array
    {
        return [
            'id' => $step['id'],
            'title' => $step['title'],
            'instruction' => $step['instruction'],
            'why' => $step['why'],
            'quiz' => [
                'question' => $step['quiz']['question'],
                'options' => array_values($step['quiz']['options']),
            ],
        ];
    }

    /** @param array<string,mixed> $data */
    private function validate(array $data): void
    {
        if (!isset($data['module'], $data['version'], $data['title'], $data['disclaimer']) || !is_int($data['module'])) {
            throw new RuntimeException('Thiếu trường module, version, title hoặc disclaimer.');
        }
        if (!is_array($data['platforms'] ?? null) || $data['platforms'] === []) {
            throw new RuntimeException('Danh sách nền tảng rỗng.');
        }

        $seen = [];
        foreach ($data['platforms'] as $platform) {
            if (!is_string($platform['id'] ?? null) || !is_string($platform['name'] ?? null)) {
                throw new RuntimeException('Nền tảng thiếu id hoặc name.');
            }
            if (!is_array($platform['steps'] ?? null) || $platform['steps'] === []) {
                throw new RuntimeException("Nền tảng {$platform['id']} không có bước nào.");
            }
            foreach ($platform['steps'] as $step) {
                $id = $step['id'] ?? '';
                if (!is_string($id) || !preg_match('/^[a-z0-9-]{3,80}$/', $id)) {
                    throw new RuntimeException('Mã bước không hợp lệ: ' . (is_string($id) ? $id : '?'));
                }
                if (isset($seen[$id])) {
                    throw new RuntimeException('Trùng mã bước: ' . $id);
                }
                $seen[$id] = true;

                foreach (['title', 'instruction', 'why'] as $field) {
                    if (!is_string($step[$field] ?? null) || trim($step[$field]) === '') {
                        throw new RuntimeException("Bước {$id} thiếu trường {$field}.");
                    }
                }
                $quiz = $step['quiz'] ?? null;
                if (!is_array($quiz) || !is_string($quiz['question'] ?? null) || !is_string($quiz['explanation'] ?? null)) {
                    throw new RuntimeException("Bước {$id} thiếu câu kiểm tra hoặc giải thích.");
                }
                if (!is_array($quiz['options'] ?? null) || count($quiz['options']) < 2 || count($quiz['options']) > 4) {
                    throw new RuntimeException("Bước {$id} phải có từ 2 đến 4 lựa chọn.");
                }
                if (!is_int($quiz['correct'] ?? null) || $quiz['correct'] < 0 || $quiz['correct'] >= count($quiz['options'])) {
                    throw new RuntimeException("Bước {$id} có đáp án đúng nằm ngoài phạm vi.");
                }
            }
        }
    }
}
