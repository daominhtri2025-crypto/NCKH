<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use RuntimeException;

/**
 * Nạp và kiểm tra bộ câu hỏi khảo sát. Đáp án đúng của câu kiến thức không bao giờ được gửi về client.
 */
final class AssessmentCatalog
{
    public const PHASES = ['pre', 'post', 'delayed'];

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

    public function version(): string
    {
        return (string) $this->data['version'];
    }

    public function title(): string
    {
        return (string) $this->data['title'];
    }

    public function intro(): string
    {
        return (string) $this->data['intro'];
    }

    /** @return list<array<string,mixed>> */
    public function items(): array
    {
        return $this->data['items'];
    }

    /** @return list<string> */
    public function behaviorScale(): array
    {
        return $this->data['behavior_scale'];
    }

    /** @return array<string,mixed>|null */
    public function find(string $id): ?array
    {
        return $this->byId[$id] ?? null;
    }

    /**
     * Góc nhìn công khai: không có đáp án đúng, không có cờ đảo chiều.
     *
     * @param array<string,mixed> $item
     * @return array<string,mixed>
     */
    public static function publicItem(array $item): array
    {
        $view = [
            'id' => $item['id'],
            'instrument' => $item['instrument'],
            'question' => $item['question'],
        ];
        if ($item['instrument'] === 'knowledge') {
            $view['options'] = array_values($item['options']);
        }
        return $view;
    }

    /** @param array<string,mixed> $data */
    private function validate(array $data): void
    {
        foreach (['version', 'title', 'intro', 'behavior_scale', 'items'] as $field) {
            if (!isset($data[$field])) {
                throw new RuntimeException("Thiếu trường {$field}.");
            }
        }
        if (count($data['behavior_scale']) !== 4) {
            throw new RuntimeException('Thang đo hành vi phải có đúng 4 mức.');
        }
        $seen = [];
        $knowledge = 0;
        $behavior = 0;
        foreach ($data['items'] as $item) {
            $id = $item['id'] ?? '';
            if (!is_string($id) || !preg_match('/^[a-z0-9-]{3,60}$/', $id)) {
                throw new RuntimeException('Mã câu hỏi không hợp lệ.');
            }
            if (isset($seen[$id])) {
                throw new RuntimeException('Trùng mã câu hỏi: ' . $id);
            }
            $seen[$id] = true;
            if (!is_string($item['question'] ?? null) || trim($item['question']) === '') {
                throw new RuntimeException("Câu {$id} thiếu nội dung.");
            }
            if ($item['instrument'] === 'knowledge') {
                $knowledge++;
                if (!is_array($item['options'] ?? null) || count($item['options']) < 2 || count($item['options']) > 4) {
                    throw new RuntimeException("Câu {$id} phải có từ 2 đến 4 lựa chọn.");
                }
                if (!is_int($item['correct'] ?? null) || $item['correct'] < 0 || $item['correct'] >= count($item['options'])) {
                    throw new RuntimeException("Câu {$id} có đáp án đúng nằm ngoài phạm vi.");
                }
            } elseif ($item['instrument'] === 'behavior') {
                $behavior++;
                if (!is_bool($item['reverse'] ?? null)) {
                    throw new RuntimeException("Câu {$id} thiếu cờ reverse.");
                }
                if (array_key_exists('correct', $item)) {
                    throw new RuntimeException("Câu hành vi {$id} không được có đáp án đúng.");
                }
            } else {
                throw new RuntimeException("Câu {$id} có loại không hợp lệ.");
            }
        }
        if ($knowledge === 0 || $behavior === 0) {
            throw new RuntimeException('Bộ câu hỏi phải có cả câu kiến thức lẫn câu hành vi.');
        }
    }
}
