<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Http\Request;
use AnToanSo\Repositories\AuditRepository;
use AnToanSo\Repositories\ClassRepository;
use AnToanSo\Repositories\ParticipantRepository;
use AnToanSo\Support\Database;
use AnToanSo\Support\HttpException;
use RuntimeException;

/**
 * Thẻ mã và đăng nhập học sinh.
 *
 * Luồng: nhóm kỹ thuật in lô thẻ (issueCards) → giáo viên phát thẻ → học sinh kích hoạt thẻ bằng cách
 * nhập mã và đồng ý tham gia (claim) → đăng nhập lại bằng mã (login). Học sinh không tự tạo mã.
 * Mã không gắn với tên; cookie phiên là token ngẫu nhiên 256 bit, chỉ lưu băm.
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
     * Phát hành n thẻ mới cho lớp. Dùng bởi bin/issue_cards.php (nhóm kỹ thuật, $teacherId = null)
     * và bởi giáo viên qua API (có $teacherId và giới hạn tổng số thẻ mỗi lớp).
     *
     * @return list<string>
     */
    public function issueCards(string $classCode, int $count, ?int $teacherId = null, ?int $maxPerClass = null): array
    {
        if ($count < 1 || $count > 500) {
            throw new RuntimeException('Số thẻ mỗi lần in phải từ 1 đến 500.');
        }
        if (!$this->classes->exists($classCode)) {
            throw new RuntimeException("Lớp {$classCode} chưa được tạo.");
        }
        if ($maxPerClass !== null && $this->participants->countInClass($classCode) + $count > $maxPerClass) {
            throw new RuntimeException("Lớp {$classCode} đã đạt giới hạn {$maxPerClass} thẻ. Liên hệ nhóm kỹ thuật.");
        }
        $codes = [];
        for ($i = 0; $i < $count; $i++) {
            $code = $this->uniqueCode();
            $this->participants->insertIssued($code, $classCode, $teacherId);
            $codes[] = $code;
        }
        return $codes;
    }

    /**
     * Cấp lại thẻ cho học sinh đã kích hoạt (làm mất thẻ). Tiến độ được giữ nguyên.
     *
     * Bắt buộc $ledgerConfirmed === true: người thực hiện xác nhận đã đối chiếu mã cũ với sổ phát thẻ.
     * Mọi lần cấp lại được ghi vào nhật ký kiểm toán (người thực hiện, mã cũ, mã mới, thời điểm).
     * Nếu $classCode khác null, chỉ đổi khi mã cũ thuộc lớp đó.
     */
    public function reissueCard(string $oldCode, ?string $classCode, string $actorType, ?int $actorId, mixed $ledgerConfirmed): string
    {
        if ($ledgerConfirmed !== true) {
            throw new HttpException(422, 'Cần xác nhận đã đối chiếu mã cũ với sổ phát thẻ trước khi cấp lại.');
        }
        $oldCode = $this->normalizeCode($oldCode);
        if (!preg_match(self::CODE_PATTERN, $oldCode)) {
            throw new HttpException(422, 'Mã cũ không đúng định dạng XXXX-XXXX.');
        }
        $row = $this->participants->findByCode($oldCode);
        if ($row === null || $row['status'] !== 'active' || ($classCode !== null && $row['class_code'] !== $classCode)) {
            throw new HttpException(404, 'Không tìm thấy học sinh đã kích hoạt với mã này trong phạm vi của bạn.');
        }
        $newCode = $this->uniqueCode();
        $teacherId = $actorType === 'teacher' ? $actorId : null;
        if (!$this->participants->replaceCode($oldCode, $newCode, $classCode, $teacherId)) {
            throw new HttpException(409, 'Không cấp lại được thẻ. Thử lại sau.');
        }
        (new AuditRepository())->log($actorType, $actorId, 'reissue_card', (int) $row['id'], $oldCode, $newCode, true);
        return $newCode;
    }

    /**
     * @param array<string,mixed> $input
     * @return array{participant:array<string,mixed>, token:string}
     */
    public function claim(array $input): array
    {
        $code = $this->normalizeCode((string) ($input['code'] ?? ''));
        if (!preg_match(self::CODE_PATTERN, $code)) {
            throw new HttpException(422, 'Mã trên thẻ có dạng XXXX-XXXX.');
        }
        if (($input['consent'] ?? false) !== true) {
            throw new HttpException(422, 'Cần đồng ý tham gia nghiên cứu để tiếp tục.');
        }
        if (($input['consent_version'] ?? '') !== self::CONSENT_VERSION) {
            throw new HttpException(422, 'Phiên bản phiếu đồng ý đã thay đổi. Vui lòng tải lại trang.');
        }

        $token = $this->newToken();
        // Thông điệp chung cho mã không tồn tại và mã đã kích hoạt, để không lộ trạng thái thẻ.
        if (!$this->participants->activate($code, hash('sha256', $token), self::CONSENT_VERSION)) {
            throw new HttpException(422, 'Mã không hợp lệ hoặc thẻ đã được kích hoạt.');
        }
        $row = $this->participants->findByCode($code);
        return ['participant' => self::publicView($row ?? ['code' => $code, 'class_code' => '']), 'token' => $token];
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
        if ($row['status'] !== 'active') {
            throw new HttpException(403, 'Thẻ này chưa được kích hoạt. Hãy chọn "Em có thẻ mã" và nhập mã trên thẻ.');
        }

        $token = $this->newToken();
        $this->participants->rotateToken((int) $row['id'], hash('sha256', $token));
        return ['participant' => self::publicView($row), 'token' => $token];
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
        throw new RuntimeException('Không thể cấp mã mới sau nhiều lần thử.');
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
