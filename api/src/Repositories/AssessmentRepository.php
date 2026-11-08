<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;

final class AssessmentRepository
{
    /** @return array<string,array<string,mixed>> khóa là item_id */
    public function answersFor(int $participantId, string $phase): array
    {
        $stmt = Database::pdo()->prepare(
            'SELECT item_id, instrument, answer_index, answer_value, is_correct, response_ms, created_at
             FROM assessments_self WHERE participant_id = ? AND phase = ?'
        );
        $stmt->execute([$participantId, $phase]);
        $out = [];
        foreach ($stmt->fetchAll() as $row) {
            $out[$row['item_id']] = $row;
        }
        return $out;
    }

    public function lastAnsweredAt(int $participantId, string $phase): ?string
    {
        $stmt = Database::pdo()->prepare(
            'SELECT MAX(created_at) FROM assessments_self WHERE participant_id = ? AND phase = ?'
        );
        $stmt->execute([$participantId, $phase]);
        $value = $stmt->fetchColumn();
        return $value === false || $value === null ? null : (string) $value;
    }

    public function insert(
        int $participantId,
        string $phase,
        string $itemId,
        string $instrument,
        ?int $answerIndex,
        ?int $answerValue,
        ?bool $isCorrect,
        ?int $responseMs,
        string $contentVersion,
    ): void {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO assessments_self
             (participant_id, phase, item_id, instrument, answer_index, answer_value, is_correct, response_ms, content_version, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $participantId, $phase, $itemId, $instrument, $answerIndex, $answerValue,
            $isCorrect === null ? null : ($isCorrect ? 1 : 0), $responseMs, $contentVersion, date('Y-m-d H:i:s'),
        ]);
    }
}
