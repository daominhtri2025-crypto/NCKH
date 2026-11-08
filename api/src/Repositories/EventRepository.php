<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;

final class EventRepository
{
    public function nextAttemptNo(int $participantId, string $itemId): int
    {
        $stmt = Database::pdo()->prepare(
            'SELECT COALESCE(MAX(attempt_no), 0) + 1 FROM module_events WHERE participant_id = ? AND item_id = ?'
        );
        $stmt->execute([$participantId, $itemId]);
        return (int) $stmt->fetchColumn();
    }

    public function insert(
        int $participantId,
        int $module,
        string $itemId,
        int $attemptNo,
        int $choiceIndex,
        bool $isSafe,
        ?int $responseMs,
        string $contentVersion,
    ): void {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO module_events
             (participant_id, module, item_id, attempt_no, choice_index, is_safe, response_ms, content_version, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $participantId, $module, $itemId, $attemptNo, $choiceIndex,
            $isSafe ? 1 : 0, $responseMs, $contentVersion, date('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Tổng hợp theo từng mục: số lần thử và kết quả của lần trả lời đầu tiên.
     *
     * @return array<string,array{attempts:int,first_is_safe:bool}>
     */
    public function summaryByItem(int $participantId, int $module): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT e.item_id, e.is_safe AS first_is_safe,
                    (SELECT COUNT(*) FROM module_events x
                      WHERE x.participant_id = e.participant_id AND x.item_id = e.item_id) AS attempts
             FROM module_events e
             WHERE e.participant_id = ? AND e.module = ? AND e.attempt_no = 1'
        );
        $stmt->execute([$participantId, $module]);
        $summary = [];
        foreach ($stmt->fetchAll() as $row) {
            $summary[$row['item_id']] = [
                'attempts' => (int) $row['attempts'],
                'first_is_safe' => (bool) $row['first_is_safe'],
            ];
        }
        return $summary;
    }
}
