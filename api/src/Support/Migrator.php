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
        return $count;
    }
}
