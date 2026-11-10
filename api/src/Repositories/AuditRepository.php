<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;

final class AuditRepository
{
    public function log(
        string $actorType,
        ?int $actorId,
        string $action,
        ?int $participantId,
        ?string $oldCode,
        ?string $newCode,
        ?bool $ledgerConfirmed,
        ?int $targetTeacherId = null,
        ?string $detail = null,
    ): void {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO audit_log (created_at, actor_type, actor_id, action, participant_id, old_code, new_code, ledger_confirmed, target_teacher_id, detail)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            date('Y-m-d H:i:s'), $actorType, $actorId, $action, $participantId, $oldCode, $newCode,
            $ledgerConfirmed === null ? null : ($ledgerConfirmed ? 1 : 0), $targetTeacherId, $detail,
        ]);
    }

    /** @return list<array<string,mixed>> */
    public function recent(int $limit = 100): array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT ' . max(1, min(500, $limit)));
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
