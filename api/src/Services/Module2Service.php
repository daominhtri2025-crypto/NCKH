<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\EventRepository;
use AnToanSo\Support\HttpException;
use PDOException;

/**
 * Module 2 — Thám tử không gian mạng.
 * Mỗi URL chỉ được phân loại một lần để bảo toàn tính độc lập của từng mục trong phân tích.
 * Ghi nhận: lựa chọn (0 = chính thống, 1 = giả mạo), đúng/sai, thời gian phản hồi, có mở gợi ý hay không.
 */
final class Module2Service
{
    public const VERDICT_OFFICIAL = 'official';
    public const VERDICT_FAKE = 'fake';
    private const MAX_RESPONSE_MS = 3_600_000;

    public function __construct(
        private readonly DomainCatalog $catalog,
        private readonly EventRepository $events,
    ) {
    }

    /** @param array<string,mixed> $participant */
    public function overview(array $participant): array
    {
        $summary = $this->events->summaryByItem((int) $participant['id'], $this->catalog->module());

        $items = [];
        $answered = 0;
        $correct = 0;
        $totalMs = 0;
        $msCount = 0;
        foreach ($this->catalog->items() as $position => $item) {
            $state = $summary[$item['id']] ?? null;
            if ($state !== null) {
                $answered++;
                $correct += $state['first_is_safe'] ? 1 : 0;
            }
            $items[] = DomainCatalog::publicItem($item) + [
                'position' => $position + 1,
                'status' => $state === null ? 'new' : 'answered',
                'correct' => $state['first_is_safe'] ?? null,
                'button_order' => $this->buttonOrder((string) $participant['code'], (string) $item['id']),
            ];
        }

        $total = count($items);
        return [
            'module' => $this->catalog->module(),
            'title' => $this->catalog->title(),
            'content_version' => $this->catalog->version(),
            'rule' => $this->catalog->rule(),
            'official_roots' => $this->catalog->officialRoots(),
            'reference_note' => $this->catalog->referenceNote(),
            'items' => $items,
            'progress' => [
                'total' => $total,
                'answered' => $answered,
                'correct' => $correct,
                'accuracy_percent' => $answered > 0 ? (int) round($correct * 100 / $answered) : 0,
            ],
        ];
    }

    /**
     * Thứ tự hai nút đáp án cho từng (học sinh, mục). Xác định bằng băm nên ổn định khi tải lại trang,
     * không cần lưu trữ, và khác nhau giữa các học sinh để triệt tiêu thiên lệch vị trí nút.
     * Thứ tự câu hỏi vẫn cố định; chỉ vị trí hai nút thay đổi.
     */
    public function buttonOrder(string $participantCode, string $itemId): string
    {
        $digest = hash('sha256', $participantCode . '|' . $itemId, true);
        return (ord($digest[0]) % 2) === 0 ? 'official_first' : 'fake_first';
    }

    /**
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function answer(array $participant, string $itemId, mixed $verdict, mixed $responseMs, mixed $hintUsed): array
    {
        $item = $this->catalog->find($itemId);
        if ($item === null) {
            throw new HttpException(404, 'Không tìm thấy mục này.');
        }
        if ($verdict !== self::VERDICT_OFFICIAL && $verdict !== self::VERDICT_FAKE) {
            throw new HttpException(422, 'Hãy chọn "Chính thống" hoặc "Giả mạo".');
        }
        if ($responseMs !== null && (!is_int($responseMs) || $responseMs < 0 || $responseMs > self::MAX_RESPONSE_MS)) {
            throw new HttpException(422, 'Thời gian phản hồi không hợp lệ.');
        }
        if ($hintUsed !== null && !is_bool($hintUsed)) {
            throw new HttpException(422, 'Trường hint_used phải là true hoặc false.');
        }

        $participantId = (int) $participant['id'];
        $module = $this->catalog->module();
        $choiceIndex = $verdict === self::VERDICT_OFFICIAL ? 0 : 1;
        $isCorrect = $item['is_official'] === ($verdict === self::VERDICT_OFFICIAL);

        try {
            $this->events->insert(
                $participantId, $module, $itemId, 1, $choiceIndex, $isCorrect,
                $responseMs === null ? null : (int) $responseMs,
                $this->catalog->version(),
                $hintUsed,
            );
        } catch (PDOException $e) {
            if (($e->errorInfo[1] ?? null) === 1062) {
                throw new HttpException(409, 'Mục này đã được phân loại trước đó.');
            }
            throw $e;
        }

        return [
            'item_id' => $itemId,
            'verdict' => $verdict,
            'correct' => $isCorrect,
            'is_official' => $item['is_official'],
            'root_domain' => $item['root_domain'],
            'trick' => $item['trick'],
            'explanation' => $item['explanation'],
            'official_roots' => $this->catalog->officialRoots(),
        ];
    }
}
