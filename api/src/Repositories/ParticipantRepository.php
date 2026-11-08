<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;
use PDO;

final class ParticipantRepository
{
    private function db(): PDO
    {
        return Database::pdo();
    }

    /** @return array<string,mixed>|null */
    public function findByCode(string $code): ?array
    {
        $stmt = $this->db()->prepare('SELECT * FROM participants WHERE code = ? LIMIT 1');
        $stmt->execute([$code]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    /** @return array<string,mixed>|null */
    public function findByTokenHash(string $tokenHash): ?array
    {
        $stmt = $this->db()->prepare('SELECT * FROM participants WHERE token_hash = ? LIMIT 1');
        $stmt->execute([$tokenHash]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function create(string $code, string $classCode, string $consentVersion, string $tokenHash): int
    {
        $now = date('Y-m-d H:i:s');
        $stmt = $this->db()->prepare(
            'INSERT INTO participants (code, class_code, token_hash, consent_version, consented_at, created_at, last_seen_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$code, $classCode, $tokenHash, $consentVersion, $now, $now, $now]);
        return (int) $this->db()->lastInsertId();
    }

    public function rotateToken(int $id, string $tokenHash): void
    {
        $stmt = $this->db()->prepare('UPDATE participants SET token_hash = ?, last_seen_at = ? WHERE id = ?');
        $stmt->execute([$tokenHash, date('Y-m-d H:i:s'), $id]);
    }

    public function clearToken(int $id): void
    {
        $stmt = $this->db()->prepare('UPDATE participants SET token_hash = NULL WHERE id = ?');
        $stmt->execute([$id]);
    }
}
