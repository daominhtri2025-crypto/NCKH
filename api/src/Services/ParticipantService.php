<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Http\Request;
use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Support\HttpException;
use RuntimeException;

/**
 * Đăng ký và xác thực học sinh theo mã giả danh.
 *
 * Nguyên tắc nghiên cứu: không thu thập họ tên, email hay số điện thoại. Mã "XXXX-XXXX"
 * do hệ thống cấp là định danh duy nhất, học sinh giữ mã để đăng nhập lại và để nhóm
 * nghiên cứu nối kết quả trước/sau. Cookie phiên là token ngẫu nhiên 256 bit, chỉ lưu băm.
 */
final class ParticipantService
{
    public const CONSENT_VERSION = 'v1';
    public const SESSION_COOKIE = 'ats_session';
    public const SESSION_MAX_AGE = 86400;

    /** 32 ký tự, bỏ các ký tự dễ nhầm (0, O, 1, I, L). */
    private const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    private const CODE_PATTERN = '/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/';

    public function __construct(
        private readonly ParticipantRepository $participants,
        private readonly ClassRepository $classes,
    ) {
    }

    /**
     * @param array<string,mixed> $input
     * @return array{participant:array<string,mixed>, token:string}
     */
    public function register(array $input): array
    {
        $classCode = strtoupper(trim((string) ($input['class_code'] ?? '')));
        if (!preg_match('/^[A-Z0-9-]{2,40}$/', $classCode) || !$this->classes->exists($classCode)) {
            throw new HttpException(422, 'Mã lớp không hợp lệ. Vui lòng hỏi giáo viên phụ trách.');
        }
        if (($input['consent'] ?? false) !== true) {
            throw new HttpException(422, 'Cần đồng ý tham gia nghiên cứu để tiếp tục.');
        }
        if (($input['consent_version'] ?? '') !== self::CONSENT_VERSION) {
            throw new HttpException(422, 'Phiên bản phiếu đồng ý đã thay đổi. Vui lòng tải lại trang.');
        }

        $code = $this->uniqueCode();
        $token = $this->newToken();
        $this->participants->create($code, $classCode, self::CONSENT_VERSION, hash('sha256', $token));

        return [
            'participant' => ['code' => $code, 'class_code' => $classCode],
            'token' => $token,
        ];
    }

    /**
     * @param array<string,mixed> $input
     * @return array{participant:array<string,mixed>, token:string}
     */
    public function login(array $input): array
    {
        $code = $this->normalizeCode((string) ($input['code'] ?? ''));
        if (!preg_match(self::CODE_PATTERN, $code)) {
            throw new HttpException(422, 'Mã học sinh có dạng XXXX-XXXX.');
        }
        $row = $this->participants->findByCode($code);
        if ($row === null) {
            throw new HttpException(401, 'Mã học sinh không đúng.');
        }

        $token = $this->newToken();
        $this->participants->rotateToken((int) $row['id'], hash('sha256', $token));

        return ['participant' => ['code' => $row['code'], 'class_code' => $row['class_code']], 'token' => $token];
    }

    /** @return array<string,mixed> dòng CSDL của học sinh đang đăng nhập */
    public function authenticate(Request $request): array
    {
        $token = $request->cookie(self::SESSION_COOKIE);
        if ($token === null || $token === '') {
            throw new HttpException(401, 'Bạn cần nhập mã học sinh để tiếp tục.');
        }
        $row = $this->participants->findByTokenHash(hash('sha256', $token));
        if ($row === null) {
            throw new HttpException(401, 'Phiên làm việc đã hết hạn. Vui lòng nhập lại mã học sinh.');
        }
        return $row;
    }

    public function logout(Request $request): void
    {
        $token = $request->cookie(self::SESSION_COOKIE);
        if ($token === null || $token === '') {
            return;
        }
        $row = $this->participants->findByTokenHash(hash('sha256', $token));
        if ($row !== null) {
            $this->participants->clearToken((int) $row['id']);
        }
    }

    /** @param array<string,mixed> $row */
    public static function publicView(array $row): array
    {
        return ['code' => $row['code'], 'class_code' => $row['class_code']];
    }

    public static function sessionCookie(string $token, bool $secure, int $maxAge = self::SESSION_MAX_AGE): string
    {
        return sprintf(
            '%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax%s',
            self::SESSION_COOKIE,
            $token,
            $maxAge,
            $secure ? '; Secure' : ''
        );
    }

    public static function clearCookie(bool $secure): string
    {
        return self::sessionCookie('', $secure, 0);
    }

    private function uniqueCode(): string
    {
        for ($i = 0; $i < 5; $i++) {
            $code = $this->generateCode();
            if ($this->participants->findByCode($code) === null) {
                return $code;
            }
        }
        throw new RuntimeException('Không thể cấp mã học sinh mới.');
    }

    private function generateCode(): string
    {
        $max = strlen(self::CODE_ALPHABET) - 1;
        $raw = '';
        for ($i = 0; $i < 8; $i++) {
            $raw .= self::CODE_ALPHABET[random_int(0, $max)];
        }
        return substr($raw, 0, 4) . '-' . substr($raw, 4, 4);
    }

    private function normalizeCode(string $code): string
    {
        $clean = strtoupper((string) preg_replace('/[\s-]/', '', $code));
        if (strlen($clean) !== 8) {
            return $clean;
        }
        return substr($clean, 0, 4) . '-' . substr($clean, 4, 4);
    }

    private function newToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}
