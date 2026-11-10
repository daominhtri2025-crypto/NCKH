<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Http\Request;
use AnToanSo\Repositories\AuditRepository;
use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Support\Env;
use AnToanSo\Support\HttpException;
use RuntimeException;

/**
 * Tài khoản giáo viên: chỉ xem tiến độ lớp được gán.
 * Giáo viên không thấy câu trả lời, đáp án, mật khẩu thử nghiệm hay dữ liệu cá nhân.
 */
final class TeacherService
{
    public const COOKIE = 'ats_teacher';
    public const MAX_AGE = 28800; // 8 giờ
    public const CARDS_PER_REQUEST_MAX = 20;
    public const CLASS_CARD_LIMIT_DEFAULT = 300;

    /** @var array{items:int, scenarios:int, domains:int, steps:int} */
    private array $totals;

    public function __construct(private readonly TeacherRepository $teachers)
    {
        $root = dirname(__DIR__, 2) . '/content/';
        $items = json_decode((string) file_get_contents($root . 'assessment_items.json'), true)['items'];
        $m1 = json_decode((string) file_get_contents($root . 'module1_scenarios.json'), true)['scenarios'];
        $m2 = json_decode((string) file_get_contents($root . 'module2_domains.json'), true)['items'];
        $m3 = array_merge(...array_column(
            json_decode((string) file_get_contents($root . 'module3_checklist.json'), true)['platforms'],
            'steps'
        ));
        $this->totals = ['items' => count($items), 'scenarios' => count($m1), 'domains' => count($m2), 'steps' => count($m3)];
    }

    /**
     * Tạo tài khoản giáo viên. Mật khẩu ngẫu nhiên được trả về một lần để in cho giáo viên.
     * Dùng bởi bin/create_teacher.php.
     */
    public function createTeacher(string $username, string $classCode, bool $classExists): string
    {
        if (!preg_match('/^[a-z0-9_]{3,40}$/', $username)) {
            throw new RuntimeException('Tên đăng nhập chỉ gồm chữ thường, số và dấu gạch dưới (3 đến 40 ký tự).');
        }
        if (!$classExists) {
            throw new RuntimeException("Lớp {$classCode} chưa được tạo.");
        }
        if ($this->teachers->findByUsername($username) !== null) {
            throw new RuntimeException("Tên đăng nhập {$username} đã tồn tại.");
        }
        $password = $this->randomPassword();
        $this->teachers->create($username, password_hash($password, PASSWORD_DEFAULT), $classCode);
        return $password;
    }

    /**
     * Đặt lại mật khẩu cho giáo viên (nhóm kỹ thuật chạy trên máy chủ). Thu hồi mọi phiên đang mở.
     * Trả về mật khẩu mới để in một lần.
     */
    public function resetPassword(string $username): string
    {
        $row = $this->teachers->findByUsername(strtolower(trim($username)));
        if ($row === null) {
            throw new RuntimeException("Không có tài khoản giáo viên '{$username}'.");
        }
        $password = $this->randomPassword();
        $this->teachers->resetPassword((int) $row['id'], password_hash($password, PASSWORD_DEFAULT));
        return $password;
    }

    /** @return array{teacher:array<string,mixed>, token:string} */
    public function login(array $input): array
    {
        $username = strtolower(trim((string) ($input['username'] ?? '')));
        $password = (string) ($input['password'] ?? '');
        $row = $username === '' ? null : $this->teachers->findByUsername($username);
        // Băm giả khi không có tài khoản, để thời gian phản hồi không lộ tên đăng nhập tồn tại.
        $ok = $row !== null && $row['disabled_at'] === null && password_verify($password, (string) $row['password_hash']);
        if (!$ok) {
            if ($row === null) {
                password_verify($password, password_hash('dummy', PASSWORD_DEFAULT));
            }
            throw new HttpException(401, 'Tên đăng nhập hoặc mật khẩu không đúng.');
        }
        $token = bin2hex(random_bytes(32));
        $this->teachers->setToken((int) $row['id'], hash('sha256', $token));
        return [
            'teacher' => ['username' => $row['username'], 'class_code' => $row['class_code'], 'role' => $row['role']],
            'token' => $token,
        ];
    }

    public function authenticate(Request $request): array
    {
        $token = $request->cookie(self::COOKIE);
        if ($token === null || $token === '') {
            throw new HttpException(401, 'Giáo viên cần đăng nhập.');
        }
        $row = $this->teachers->findByTokenHash(hash('sha256', $token));
        if ($row === null) {
            throw new HttpException(401, 'Phiên đăng nhập đã hết hạn.');
        }
        return $row;
    }

    public function logout(Request $request): void
    {
        $token = $request->cookie(self::COOKIE);
        if ($token === null || $token === '') {
            return;
        }
        $row = $this->teachers->findByTokenHash(hash('sha256', $token));
        if ($row !== null) {
            $this->teachers->setToken((int) $row['id'], null);
        }
    }

    /**
     * Lớp của giáo viên. Tài khoản quản trị không gắn lớp nên bị từ chối ở mọi chức năng lớp.
     * Đây là chốt chặn để quản trị viên không cấp lại thẻ hay xem tiến độ của lớp bất kỳ.
     *
     * @param array<string,mixed> $teacher
     */
    public function requireClass(array $teacher): string
    {
        if (($teacher['role'] ?? 'teacher') !== 'teacher' || $teacher['class_code'] === null) {
            throw new HttpException(403, 'Tài khoản này không gắn lớp học.');
        }
        return (string) $teacher['class_code'];
    }

    /** @param array<string,mixed> $teacher */
    public function roster(array $teacher): array
    {
        $classCode = $this->requireClass($teacher);
        $itemsPerPhase = (new SurveyStore())->active()->itemCount();
        $students = [];
        $active = 0;
        foreach ($this->teachers->rosterCounts($classCode) as $r) {
            $isActive = $r['status'] === 'active';
            $active += $isActive ? 1 : 0;
            $students[] = [
                'code' => $r['code'],
                'status' => $r['status'],
                'claimed_at' => $r['claimed_at'],
                'last_seen_at' => $r['last_seen_at'],
                'phases' => [
                    'pre' => (int) $r['pre_n'],
                    'post' => (int) $r['post_n'],
                    'delayed' => (int) $r['delayed_n'],
                ],
                'modules' => [
                    'm1' => (int) $r['m1_n'],
                    'm2' => (int) $r['m2_n'],
                    'm3_steps' => (int) $r['m3_n'],
                    'lab' => (int) $r['lab_n'] > 0,
                ],
            ];
        }
        return [
            'class_code' => $classCode,
            'totals' => [
                'students' => count($students),
                'active' => $active,
                'items_per_phase' => $itemsPerPhase,
                'm1' => $this->totals['scenarios'],
                'm2' => $this->totals['domains'],
                'm3_steps' => $this->totals['steps'],
            ],
            'students' => $students,
        ];
    }

    /**
     * Giáo viên tạo thẻ mới cho lớp mình: học sinh mới tham gia, hoặc học sinh quên mã.
     * Thẻ mới không kế thừa tiến độ cũ. Số thẻ mỗi lần và tổng số thẻ mỗi lớp đều bị giới hạn.
     *
     * @param array<string,mixed> $teacher
     * @return list<string>
     */
    public function issueCardsForTeacher(array $teacher, int $count): array
    {
        if ($count < 1 || $count > self::CARDS_PER_REQUEST_MAX) {
            throw new HttpException(422, 'Mỗi lần chỉ tạo từ 1 đến ' . self::CARDS_PER_REQUEST_MAX . ' thẻ.');
        }
        $limit = (int) Env::get('CLASS_CARD_LIMIT', (string) self::CLASS_CARD_LIMIT_DEFAULT);
        try {
            return (new ParticipantService(new ParticipantRepository(), new ClassRepository()))
                ->issueCards($this->requireClass($teacher), $count, (int) $teacher['id'], $limit);
        } catch (RuntimeException $e) {
            throw new HttpException(422, $e->getMessage());
        }
    }

    // ----- Quản trị (role = 'admin'): mọi thao tác đều ghi nhật ký audit_log -----

    /** @param array<string,mixed> $actor */
    public function requireAdmin(array $actor): void
    {
        if (($actor['role'] ?? '') !== 'admin') {
            throw new HttpException(403, 'Chỉ quản trị viên được thực hiện thao tác này.');
        }
    }

    /** @return list<array<string,mixed>> */
    public function adminListTeachers(array $actor): array
    {
        $this->requireAdmin($actor);
        return array_map(static fn (array $r): array => [
            'id' => (int) $r['id'],
            'username' => $r['username'],
            'role' => $r['role'],
            'class_code' => $r['class_code'],
            'active' => $r['disabled_at'] === null,
            'created_at' => $r['created_at'],
            'last_login_at' => $r['last_login_at'],
        ], $this->teachers->listAll());
    }

    /**
     * Tạo tài khoản giáo viên hoặc quản trị viên. Trả về mật khẩu ngẫu nhiên, chỉ hiện một lần.
     * Tên đăng nhập và mã lớp được kiểm tra định dạng trước khi chạm CSDL (truy vấn đã dùng tham số hóa).
     */
    public function adminCreateTeacher(array $actor, mixed $username, mixed $classCode, mixed $role): string
    {
        $this->requireAdmin($actor);
        $username = is_string($username) ? strtolower(trim($username)) : '';
        if (!preg_match('/^[a-z0-9_]{3,40}$/', $username)) {
            throw new HttpException(422, 'Tên đăng nhập chỉ gồm chữ thường, số và dấu gạch dưới (3 đến 40 ký tự).');
        }
        if (!in_array($role, ['teacher', 'admin'], true)) {
            throw new HttpException(422, 'Vai trò phải là teacher hoặc admin.');
        }
        if ($this->teachers->findByUsername($username) !== null) {
            throw new HttpException(422, "Tên đăng nhập {$username} đã tồn tại.");
        }
        $class = null;
        if ($role === 'teacher') {
            $class = is_string($classCode) ? strtoupper(trim($classCode)) : '';
            if (!(new ClassRepository())->exists($class)) {
                throw new HttpException(422, 'Mã lớp không tồn tại. Nhóm kỹ thuật cần tạo lớp trước.');
            }
        }
        $password = $this->randomPassword();
        $this->teachers->create($username, password_hash($password, PASSWORD_DEFAULT), $class, $role);
        $newId = (int) $this->teachers->findByUsername($username)['id'];
        (new AuditRepository())->log('teacher', (int) $actor['id'], 'admin_create_teacher', null, null, null, null, $newId);
        return $password;
    }

    /** Đặt lại mật khẩu, thu hồi mọi phiên đang mở của tài khoản đó. Trả về mật khẩu mới một lần. */
    public function adminResetPassword(array $actor, string $username): string
    {
        $this->requireAdmin($actor);
        $target = $this->requireTeacherForAdmin($username);
        $password = $this->randomPassword();
        $this->teachers->resetPassword((int) $target['id'], password_hash($password, PASSWORD_DEFAULT));
        (new AuditRepository())->log('teacher', (int) $actor['id'], 'admin_reset_password', null, null, null, null, (int) $target['id']);
        return $password;
    }

    /**
     * Khóa hoặc mở khóa tài khoản. Quản trị viên không tự khóa chính mình,
     * và không khóa quản trị viên cuối cùng còn hoạt động (để hệ thống không mất quyền quản trị).
     */
    public function adminSetDisabled(array $actor, string $username, bool $disabled): void
    {
        $this->requireAdmin($actor);
        $target = $this->requireTeacherForAdmin($username);
        if ($disabled) {
            if ((int) $target['id'] === (int) $actor['id']) {
                throw new HttpException(422, 'Không thể tự khóa tài khoản đang đăng nhập.');
            }
            if (($target['role'] === 'admin') && $target['disabled_at'] === null && $this->teachers->countActiveAdmins() <= 1) {
                throw new HttpException(422, 'Không thể khóa quản trị viên cuối cùng còn hoạt động.');
            }
        }
        $this->teachers->setDisabled((int) $target['id'], $disabled);
        $action = $disabled ? 'admin_disable_teacher' : 'admin_enable_teacher';
        (new AuditRepository())->log('teacher', (int) $actor['id'], $action, null, null, null, null, (int) $target['id']);
    }

    /** @return array<string,mixed> */
    private function requireTeacherForAdmin(string $username): array
    {
        $username = strtolower(trim($username));
        if (!preg_match('/^[a-z0-9_]{3,40}$/', $username)) {
            throw new HttpException(422, 'Tên đăng nhập không hợp lệ.');
        }
        $row = $this->teachers->findByUsername($username);
        if ($row === null) {
            throw new HttpException(404, 'Không có tài khoản này.');
        }
        return $row;
    }

    /** Nhóm kỹ thuật: danh sách tài khoản giáo viên (không có mật khẩu). */
    public function listTeachers(): array
    {
        return $this->teachers->listAll();
    }

    /** Nhóm kỹ thuật: vô hiệu hóa (khóa mềm). Có thể khôi phục bằng enableTeacher. */
    public function disableTeacher(string $username): void
    {
        $this->setDisabled($username, true);
    }

    /** Nhóm kỹ thuật: khôi phục tài khoản đã vô hiệu hóa. */
    public function enableTeacher(string $username): void
    {
        $this->setDisabled($username, false);
    }

    /** Nhóm kỹ thuật: chuyển giáo viên sang lớp khác. */
    public function moveTeacher(string $username, string $classCode, bool $classExists): void
    {
        $row = $this->requireTeacher($username);
        if (!$classExists) {
            throw new RuntimeException("Lớp {$classCode} chưa được tạo.");
        }
        $this->teachers->setClass((int) $row['id'], $classCode);
    }

    /** Nhóm kỹ thuật: xóa hẳn tài khoản giáo viên. Thẻ đã phát vẫn giữ nguyên. */
    public function deleteTeacher(string $username): void
    {
        $row = $this->requireTeacher($username);
        $this->teachers->delete((int) $row['id']);
    }

    private function setDisabled(string $username, bool $disabled): void
    {
        $row = $this->requireTeacher($username);
        $this->teachers->setDisabled((int) $row['id'], $disabled);
    }

    /** @return array<string,mixed> */
    private function requireTeacher(string $username): array
    {
        $row = $this->teachers->findByUsername(strtolower(trim($username)));
        if ($row === null) {
            throw new RuntimeException("Không có tài khoản giáo viên '{$username}'.");
        }
        return $row;
    }

    private function randomPassword(): string
    {
        $alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
        $out = '';
        for ($i = 0; $i < 12; $i++) {
            $out .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        }
        return $out;
    }
}
