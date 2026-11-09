<?php

declare(strict_types=1);

// Quản lý tài khoản giáo viên (chỉ nhóm kỹ thuật, chạy trên máy chủ).
//   php api/bin/manage_teacher.php list
//   php api/bin/manage_teacher.php create <tên_đăng_nhập> <MÃ_LỚP>     (mật khẩu ngẫu nhiên, in một lần)
//   php api/bin/manage_teacher.php reset <tên_đăng_nhập>              (đặt mật khẩu mới, thu hồi phiên)
//   php api/bin/manage_teacher.php move <tên_đăng_nhập> <MÃ_LỚP>      (chuyển lớp)
//   php api/bin/manage_teacher.php disable <tên_đăng_nhập>            (vô hiệu hóa, không xóa dữ liệu)
//   php api/bin/manage_teacher.php enable <tên_đăng_nhập>             (khôi phục tài khoản đã vô hiệu hóa)
//   php api/bin/manage_teacher.php delete <tên_đăng_nhập>             (xóa hẳn tài khoản)
require dirname(__DIR__) . '/bootstrap.php';

use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\TeacherRepository;
use AnToanSo\Services\TeacherService;

$usage = "Cách dùng:\n  list\n  create <user> <LỚP>\n  reset <user>\n  move <user> <LỚP>\n  disable <user>\n  enable <user>\n  delete <user>\n";
if ($argc < 2) {
    fwrite(STDERR, $usage);
    exit(1);
}
$svc = new TeacherService(new TeacherRepository());
$classes = new ClassRepository();
$cmd = $argv[1];
try {
    switch ($cmd) {
        case 'list':
            printf("%-24s %-10s %-10s %s\n", 'TÊN ĐĂNG NHẬP', 'LỚP', 'TRẠNG THÁI', 'ĐĂNG NHẬP GẦN NHẤT');
            foreach ($svc->listTeachers() as $t) {
                printf("%-24s %-10s %-10s %s\n", $t['username'], $t['class_code'],
                    $t['disabled_at'] === null ? 'hoạt động' : 'đã khóa', $t['last_login_at'] ?? '-');
            }
            break;
        case 'create':
            requireArgs($argc, 4, $usage);
            $code = strtoupper(trim($argv[3]));
            $password = $svc->createTeacher(strtolower(trim($argv[2])), $code, $classes->exists($code));
            echo "Đã tạo '{$argv[2]}' cho lớp {$code}. Mật khẩu (một lần): {$password}\n";
            break;
        case 'reset':
            requireArgs($argc, 3, $usage);
            $password = $svc->resetPassword($argv[2]);
            echo "Đã đặt lại mật khẩu '{$argv[2]}'. Mật khẩu mới (một lần): {$password}\n";
            break;
        case 'move':
            requireArgs($argc, 4, $usage);
            $code = strtoupper(trim($argv[3]));
            $svc->moveTeacher($argv[2], $code, $classes->exists($code));
            echo "Đã chuyển '{$argv[2]}' sang lớp {$code}. Các phiên đang mở đã bị thu hồi.\n";
            break;
        case 'disable':
            requireArgs($argc, 3, $usage);
            $svc->disableTeacher($argv[2]);
            echo "Đã khóa '{$argv[2]}'. Dữ liệu không bị xóa; dùng 'enable' để khôi phục.\n";
            break;
        case 'enable':
            requireArgs($argc, 3, $usage);
            $svc->enableTeacher($argv[2]);
            echo "Đã khôi phục '{$argv[2]}'.\n";
            break;
        case 'delete':
            requireArgs($argc, 3, $usage);
            $svc->deleteTeacher($argv[2]);
            echo "Đã xóa tài khoản '{$argv[2]}'. Thẻ đã phát vẫn được giữ.\n";
            break;
        default:
            fwrite(STDERR, $usage);
            exit(1);
    }
} catch (RuntimeException $e) {
    fwrite(STDERR, 'Lỗi: ' . $e->getMessage() . "\n");
    exit(1);
}

function requireArgs(int $argc, int $expected, string $usage): void
{
    if ($argc !== $expected) {
        fwrite(STDERR, $usage);
        exit(1);
    }
}
