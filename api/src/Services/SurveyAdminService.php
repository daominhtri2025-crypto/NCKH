<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\AuditRepository;
use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Support\HttpException;
use RuntimeException;

/**
 * Quản lý câu hỏi khảo sát (chỉ quản trị viên).
 *
 * Mọi thay đổi tạo một phiên bản mới từ phiên bản hiện hành, kiểm tra toàn bộ bộ câu hỏi,
 * rồi đặt làm hiện hành. Học sinh đã làm khảo sát giữ phiên bản cũ (xem SurveyStore).
 * Mã câu hỏi không đổi được sau khi tạo, và loại câu (kiến thức/hành vi) không đổi được.
 */
final class SurveyAdminService
{
    private const TOPIC_PATTERN = '/^[a-z0-9-]{1,20}$/';
    private const ID_PATTERN = '/^[a-z0-9-]{3,60}$/';

    public function __construct(private readonly SurveyStore $store = new SurveyStore())
    {
    }

    /** @param array<string,mixed> $actor */
    public function view(array $actor): array
    {
        $this->requireAdmin($actor);
        $catalog = $this->store->active()->toArray();
        return [
            'version' => $catalog['version'],
            'title' => $catalog['title'],
            'intro' => $catalog['intro'],
            'behavior_scale' => $catalog['behavior_scale'],
            'items' => $catalog['items'],
            'versions' => array_map(static fn (array $v): array => [
                'version' => $v['version'],
                'created_at' => $v['created_at'],
                'active' => (bool) $v['is_active'],
                'items' => (int) $v['n_items'],
            ], $this->store->versions()),
            'note' => 'Cùng một bộ câu hỏi dùng cho khảo sát đầu vào, đầu ra và theo dõi. Mỗi lần sửa tạo phiên bản mới; học sinh đã làm dở giữ phiên bản cũ.',
        ];
    }

    /** @param array<string,mixed> $actor @return array<string,mixed> */
    public function addItem(array $actor, mixed $body): array
    {
        $item = $this->buildItem($body, null);
        $version = $this->mutate($actor, 'survey_add_item', $item['id'], static function (array $items) use ($item): array {
            foreach ($items as $existing) {
                if ($existing['id'] === $item['id']) {
                    throw new HttpException(422, "Mã câu hỏi {$item['id']} đã tồn tại.");
                }
            }
            $items[] = $item;
            return $items;
        });
        return ['version' => $version, 'item' => $item];
    }

    /** @param array<string,mixed> $actor @return array<string,mixed> */
    public function updateItem(array $actor, string $id, mixed $patch): array
    {
        $this->assertId($id);
        if (!is_array($patch)) {
            throw new HttpException(422, 'Dữ liệu sửa không hợp lệ.');
        }
        if (array_key_exists('id', $patch) && $patch['id'] !== $id) {
            throw new HttpException(422, 'Không đổi được mã câu hỏi sau khi tạo.');
        }
        if (array_key_exists('instrument', $patch) && $patch['instrument'] !== null) {
            $current = $this->findItem($this->store->active()->toArray()['items'], $id);
            if ($patch['instrument'] !== $current['instrument']) {
                throw new HttpException(422, 'Không đổi được loại câu hỏi (kiến thức/hành vi).');
            }
        }
        $version = $this->mutate($actor, 'survey_update_item', $id, function (array $items) use ($id, $patch): array {
            $current = $this->findItem($items, $id);
            $merged = array_merge($current, array_intersect_key($patch, array_flip(['topic', 'question', 'options', 'correct', 'reverse', 'instrument'])));
            $merged['id'] = $id;
            $item = $this->buildItem($merged, $id);
            return array_map(static fn (array $i): array => $i['id'] === $id ? $item : $i, $items);
        });
        return ['version' => $version, 'item_id' => $id];
    }

    /** @param array<string,mixed> $actor @return array<string,mixed> */
    public function deleteItem(array $actor, string $id): array
    {
        $this->assertId($id);
        $version = $this->mutate($actor, 'survey_delete_item', $id, function (array $items) use ($id): array {
            $this->findItem($items, $id);
            return array_values(array_filter($items, static fn (array $i): bool => $i['id'] !== $id));
        });
        return ['version' => $version, 'item_id' => $id];
    }

    /**
     * @param array<string,mixed> $actor
     * @param callable(list<array<string,mixed>>):list<array<string,mixed>> $change
     */
    private function mutate(array $actor, string $action, string $itemId, callable $change): string
    {
        $this->requireAdmin($actor);
        $base = $this->store->active()->toArray();
        $items = $change($base['items']);
        $version = $this->store->nextVersionName();
        try {
            $catalog = AssessmentCatalog::fromArray([
                'version' => $version,
                'title' => $base['title'],
                'intro' => $base['intro'],
                'behavior_scale' => $base['behavior_scale'],
                'items' => array_values($items),
            ]);
        } catch (RuntimeException $e) {
            throw new HttpException(422, $e->getMessage());
        }
        $this->store->publish($catalog, (int) $actor['id']);
        (new AuditRepository())->log('teacher', (int) $actor['id'], $action, null, null, null, null, null, "{$version}:{$itemId}");
        return $version;
    }

    /** @return array<string,mixed> */
    private function buildItem(mixed $in, ?string $fixedId): array
    {
        if (!is_array($in)) {
            throw new HttpException(422, 'Dữ liệu câu hỏi không hợp lệ.');
        }
        $id = $fixedId ?? (is_string($in['id'] ?? null) ? trim($in['id']) : '');
        $this->assertId($id);

        $instrument = $in['instrument'] ?? null;
        if (!in_array($instrument, ['knowledge', 'behavior'], true)) {
            throw new HttpException(422, 'Loại câu hỏi phải là knowledge hoặc behavior.');
        }
        $topic = is_string($in['topic'] ?? null) ? trim($in['topic']) : '';
        if (!preg_match(self::TOPIC_PATTERN, $topic)) {
            throw new HttpException(422, 'Chủ đề chỉ gồm chữ thường, số và dấu gạch ngang (tối đa 20 ký tự).');
        }
        $question = is_string($in['question'] ?? null) ? trim($in['question']) : '';
        if ($question === '' || mb_strlen($question) > 400) {
            throw new HttpException(422, 'Nội dung câu hỏi phải có từ 1 đến 400 ký tự.');
        }

        $item = ['id' => $id, 'instrument' => $instrument, 'topic' => $topic, 'question' => $question];
        if ($instrument === 'knowledge') {
            $options = $in['options'] ?? null;
            if (!is_array($options) || count($options) < 2 || count($options) > 4) {
                throw new HttpException(422, 'Câu kiến thức cần từ 2 đến 4 lựa chọn.');
            }
            $clean = [];
            foreach ($options as $o) {
                if (!is_string($o) || trim($o) === '' || mb_strlen(trim($o)) > 200) {
                    throw new HttpException(422, 'Mỗi lựa chọn phải có từ 1 đến 200 ký tự.');
                }
                $clean[] = trim($o);
            }
            $correct = $in['correct'] ?? null;
            if (!is_int($correct) || $correct < 0 || $correct >= count($clean)) {
                throw new HttpException(422, 'Đáp án đúng phải là số thứ tự một lựa chọn có trong danh sách.');
            }
            $item['options'] = $clean;
            $item['correct'] = $correct;
        } else {
            if (!is_bool($in['reverse'] ?? null)) {
                throw new HttpException(422, 'Câu hành vi cần cờ reverse (true hoặc false).');
            }
            if (array_key_exists('correct', $in) || array_key_exists('options', $in)) {
                throw new HttpException(422, 'Câu hành vi không có đáp án đúng hay lựa chọn.');
            }
            $item['reverse'] = $in['reverse'];
        }
        return $item;
    }

    /** @param list<array<string,mixed>> $items @return array<string,mixed> */
    private function findItem(array $items, string $id): array
    {
        foreach ($items as $item) {
            if ($item['id'] === $id) {
                return $item;
            }
        }
        throw new HttpException(404, 'Không tìm thấy câu hỏi này.');
    }

    private function assertId(string $id): void
    {
        if (!preg_match(self::ID_PATTERN, $id)) {
            throw new HttpException(422, 'Mã câu hỏi chỉ gồm chữ thường, số và dấu gạch ngang (3 đến 60 ký tự).');
        }
    }

    /** @param array<string,mixed> $actor */
    private function requireAdmin(array $actor): void
    {
        (new TeacherService(new TeacherRepository()))->requireAdmin($actor);
    }
}
