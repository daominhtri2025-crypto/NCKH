<?php

declare(strict_types=1);

namespace AnToanSo\Repositories;

use AnToanSo\Support\Database;

final class ClassRepository
{
    public function exists(string $code): bool
    {
        $stmt = Database::pdo()->prepare('SELECT 1 FROM classes WHERE code = ? LIMIT 1');
        $stmt->execute([$code]);
        return $stmt->fetchColumn() !== false;
    }

    public function create(string $code, string $name, string $school): void
    {
        $stmt = Database::pdo()->prepare('INSERT INTO classes (code, name, school, created_at) VALUES (?, ?, ?, ?)');
        $stmt->execute([$code, $name, $school, date('Y-m-d H:i:s')]);
    }
}
