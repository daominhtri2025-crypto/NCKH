<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Support\Env;
use RuntimeException;

/**
 * Tạo tài khoản mặc định cho môi trường thử nghiệm cục bộ.
 *
 * An toàn: chỉ chạy khi APP_ENV=local VÀ APP_URL trỏ về localhost. Mật khẩu mặc định được công bố
 * trong tài liệu, nên không được phép tồn tại trên hosting. Hai tài khoản đều có cờ bắt buộc đổi mật khẩu.
 */
final class LocalSeeder
{
    public const CLASS_CODE = '8A1';

    /** @var list<string> Mật khẩu mặc định đã công bố. Không được dùng làm mật khẩu mới. */
    public const PUBLIC_DEFAULT_PASSWORDS = ['Admin@12345', 'Giaovien@12345'];

    public function __construct(
        private readonly TeacherRepository $teachers = new TeacherRepository(),
        private readonly ClassRepository $classes = new ClassRepository(),
    ) {
    }

    /** @return list<string> tên các tài khoản vừa tạo (tài khoản đã có sẵn được giữ nguyên) */
    public function run(): array
    {
        self::assertLocal();
        if (!$this->classes->exists(self::CLASS_CODE)) {
            $this->classes->create(self::CLASS_CODE, 'Lớp 8A1', 'THCS Thử nghiệm');
        }
        $created = [];
        foreach ([
            ['username' => 'admin', 'password' => 'Admin@12345', 'role' => 'admin', 'class' => null],
            ['username' => 'giaovien1', 'password' => 'Giaovien@12345', 'role' => 'teacher', 'class' => self::CLASS_CODE],
        ] as $account) {
            if ($this->teachers->findByUsername($account['username']) !== null) {
                continue;
            }
            $this->teachers->create(
                $account['username'],
                password_hash($account['password'], PASSWORD_DEFAULT),
                $account['class'],
                $account['role'],
                true,
            );
            $created[] = $account['username'];
        }
        return $created;
    }

    public static function assertLocal(): void
    {
        $env = Env::get('APP_ENV');
        if ($env !== 'local') {
            throw new RuntimeException("Chỉ chạy khi APP_ENV=local (hiện là '{$env}'). Không tạo tài khoản mặc định ngoài máy cục bộ.");
        }
        $host = (string) parse_url(Env::get('APP_URL'), PHP_URL_HOST);
        if (!in_array($host, ['localhost', '127.0.0.1'], true)) {
            throw new RuntimeException("APP_URL phải trỏ về localhost hoặc 127.0.0.1 (hiện là '{$host}').");
        }
    }
}
