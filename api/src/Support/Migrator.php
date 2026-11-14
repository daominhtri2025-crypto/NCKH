<?php

declare(strict_types=1);

namespace AnToanSo\Support;

use PDO;
use RuntimeException;

/**
 * Chạy lược đồ SQL. Lược đồ dùng CREATE TABLE IF NOT EXISTS nên chạy lại an toàn.
 */
final class Migrator
{
    public static function run(PDO $pdo, string $file): int
    {
        if (!is_file($file)) {
            throw new RuntimeException('Không tìm thấy lược đồ: ' . $file);
        }
        $lines = [];
        foreach (explode("\n", (string) file_get_contents($file)) as $line) {
            if (!str_starts_with(trim($line), '--')) {
                $lines[] = $line;
            }
        }
        $count = 0;
        foreach (explode(';', implode("\n", $lines)) as $statement) {
            $statement = trim($statement);
            if ($statement === '') {
                continue;
            }
            $pdo->exec($statement);
            $count++;
        }
        self::upgrade($pdo);
        return $count;
    }

    /**
     * Nâng cấp CSDL đã có từ phiên bản cũ. Mỗi bước kiểm tra trước nên chạy lại nhiều lần vẫn an toàn.
     * CREATE TABLE IF NOT EXISTS không thêm cột vào bảng đã tồn tại, nên cột mới phải được thêm ở đây.
     *
     * @return int số học sinh được cấp mã định danh nghiên cứu bổ sung
     */
    public static function upgrade(PDO $pdo): int
    {
        $hasColumn = static function (string $column) use ($pdo): bool {
            $stmt = $pdo->prepare(
                'SELECT COUNT(*) FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
            );
            $stmt->execute(['participants', $column]);
            return (int) $stmt->fetchColumn() > 0;
        };

        if (!$hasColumn('research_id')) {
            $pdo->exec('ALTER TABLE participants ADD COLUMN research_id CHAR(10) NULL AFTER code');
            $pdo->exec('ALTER TABLE participants ADD UNIQUE KEY uq_participants_research (research_id)');
        }

        // Cấp mã cho các hàng chưa có (hàng cũ trước khi có cột này).
        $ids = $pdo->query('SELECT id FROM participants WHERE research_id IS NULL ORDER BY id')->fetchAll(PDO::FETCH_COLUMN);
        $update = $pdo->prepare('UPDATE participants SET research_id = ? WHERE id = ? AND research_id IS NULL');
        foreach ($ids as $id) {
            for ($attempt = 0; $attempt < 8; $attempt++) {
                try {
                    $update->execute([ResearchId::generate(), $id]);
                    break;
                } catch (\PDOException $e) {
                    if ($attempt === 7 || !str_contains($e->getMessage(), 'uq_participants_research')) {
                        throw $e;
                    }
                }
            }
        }
        return count($ids);
    }
}
