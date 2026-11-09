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
        $stmt = $this->db()->prepare("SELECT * FROM participants WHERE token_hash = ? AND status = 'active' LIMIT 1");
        $stmt->execute([$tokenHash]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function insertIssued(string $code, string $classCode, ?int $issuedByTeacherId): void
    {
        $stmt = $this->db()->prepare(
            "INSERT INTO participants (code, class_code, status, created_at, issued_by_teacher_id)
             VALUES (?, ?, 'issued', ?, ?)"
        );
        $stmt->execute([$code, $classCode, date('Y-m-d H:i:s'), $issuedByTeacherId]);
    }

    /**
     * Đổi mã của học sinh đã kích hoạt (làm mất thẻ). Tiến độ không đổi vì được gắn theo id.
     * Mã cũ mất hiệu lực ngay; phiên đăng nhập cũ bị thu hồi. Chỉ đổi khi mã cũ thuộc đúng lớp (nếu có ràng buộc).
     */
    public function replaceCode(string $oldCode, string $newCode, ?string $classCode, ?int $teacherId): bool
    {
        $sql = "UPDATE participants SET code = ?, token_hash = NULL, card_reissues = card_reissues + 1,
                    card_reissued_at = ?, reissued_by_teacher_id = ?
                WHERE code = ? AND status = 'active'";
        $params = [$newCode, date('Y-m-d H:i:s'), $teacherId, $oldCode];
        if ($classCode !== null) {
            $sql .= ' AND class_code = ?';
            $params[] = $classCode;
        }
        $stmt = $this->db()->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() === 1;
    }

    /** Tổng số thẻ đã phát của lớp (kể cả chưa kích hoạt), dùng để giới hạn số thẻ mỗi lớp. */
    public function countInClass(string $classCode): int
    {
        $stmt = $this->db()->prepare('SELECT COUNT(*) FROM participants WHERE class_code = ?');
        $stmt->execute([$classCode]);
        return (int) $stmt->fetchColumn();
    }

    /** Kích hoạt thẻ: chỉ thành công khi thẻ còn ở trạng thái 'issued'. */
    public function activate(string $code, string $tokenHash, string $consentVersion): bool
    {
        $now = date('Y-m-d H:i:s');
        $stmt = $this->db()->prepare(
            "UPDATE participants SET status = 'active', token_hash = ?, consent_version = ?,
                    consented_at = ?, claimed_at = ?, last_seen_at = ?
             WHERE code = ? AND status = 'issued'"
        );
        $stmt->execute([$tokenHash, $consentVersion, $now, $now, $now, $code]);
        return $stmt->rowCount() === 1;
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
