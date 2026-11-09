<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;
use PDO;

final class TeacherRepository
{
    private function db(): PDO
    {
        return Database::pdo();
    }

    /** @return array<string,mixed>|null */
    public function findByUsername(string $username): ?array
    {
        $stmt = $this->db()->prepare('SELECT * FROM teachers WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    /** @return array<string,mixed>|null */
    public function findByTokenHash(string $tokenHash): ?array
    {
        $stmt = $this->db()->prepare('SELECT * FROM teachers WHERE token_hash = ? AND disabled_at IS NULL LIMIT 1');
        $stmt->execute([$tokenHash]);
        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }

    public function create(string $username, string $passwordHash, string $classCode): void
    {
        $stmt = $this->db()->prepare(
            'INSERT INTO teachers (username, password_hash, class_code, created_at) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$username, $passwordHash, $classCode, date('Y-m-d H:i:s')]);
    }

    /** @return list<array<string,mixed>> */
    public function listAll(): array
    {
        return $this->db()->query('SELECT id, username, class_code, created_at, last_login_at, disabled_at FROM teachers ORDER BY username')->fetchAll();
    }

    /** Vô hiệu hóa (khóa mềm) hoặc khôi phục; khi vô hiệu hóa, thu hồi mọi phiên đang mở. */
    public function setDisabled(int $id, bool $disabled): void
    {
        $stmt = $this->db()->prepare('UPDATE teachers SET disabled_at = ?, token_hash = NULL WHERE id = ?');
        $stmt->execute([$disabled ? date('Y-m-d H:i:s') : null, $id]);
    }

    public function setClass(int $id, string $classCode): void
    {
        $stmt = $this->db()->prepare('UPDATE teachers SET class_code = ?, token_hash = NULL WHERE id = ?');
        $stmt->execute([$classCode, $id]);
    }

    /** Xóa hẳn tài khoản. Thẻ đã phát bởi giáo viên này vẫn giữ, chỉ bỏ liên kết người phát. */
    public function delete(int $id): void
    {
        $stmt = $this->db()->prepare('DELETE FROM teachers WHERE id = ?');
        $stmt->execute([$id]);
    }

    /** Đặt mật khẩu mới và thu hồi mọi phiên đăng nhập hiện có của giáo viên. */
    public function resetPassword(int $id, string $passwordHash): void
    {
        $stmt = $this->db()->prepare('UPDATE teachers SET password_hash = ?, token_hash = NULL WHERE id = ?');
        $stmt->execute([$passwordHash, $id]);
    }

    public function setToken(int $id, ?string $tokenHash): void
    {
        $stmt = $this->db()->prepare('UPDATE teachers SET token_hash = ?, last_login_at = ? WHERE id = ?');
        $stmt->execute([$tokenHash, $tokenHash === null ? null : date('Y-m-d H:i:s'), $id]);
    }

    /**
     * Tiến độ theo học sinh của một lớp. Chỉ trả về số lượng và trạng thái, không trả về nội dung câu trả lời.
     *
     * @return list<array<string,mixed>>
     */
    public function rosterCounts(string $classCode): array
    {
        $stmt = $this->db()->prepare(
            "SELECT p.code, p.status, p.claimed_at, p.last_seen_at,
                (SELECT COUNT(*) FROM assessments_self a WHERE a.participant_id = p.id AND a.phase = 'pre') AS pre_n,
                (SELECT COUNT(*) FROM assessments_self a WHERE a.participant_id = p.id AND a.phase = 'post') AS post_n,
                (SELECT COUNT(*) FROM assessments_self a WHERE a.participant_id = p.id AND a.phase = 'delayed') AS delayed_n,
                (SELECT COUNT(DISTINCT e.item_id) FROM module_events e WHERE e.participant_id = p.id AND e.module = 1) AS m1_n,
                (SELECT COUNT(DISTINCT e.item_id) FROM module_events e WHERE e.participant_id = p.id AND e.module = 2) AS m2_n,
                (SELECT COUNT(DISTINCT e.item_id) FROM module_events e
                  WHERE e.participant_id = p.id AND e.module = 3 AND e.is_safe = 1 AND e.item_id <> 'lab-strength') AS m3_n,
                (SELECT COUNT(*) FROM module_events e
                  WHERE e.participant_id = p.id AND e.item_id = 'lab-strength' AND e.is_safe = 1) AS lab_n
             FROM participants p WHERE p.class_code = ? ORDER BY p.code"
        );
        $stmt->execute([$classCode]);
        return $stmt->fetchAll();
    }
}
