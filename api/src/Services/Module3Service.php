<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\EventRepository;
use AnToanSo\Support\HttpException;
use PDOException;

/**
 * Module 3 — Phòng thí nghiệm bảo mật tài khoản.
 *
 * Quyền riêng tư: phòng thí nghiệm mật khẩu chạy hoàn toàn trên trình duyệt. Máy chủ KHÔNG nhận
 * chuỗi mật khẩu. Máy chủ chỉ nhận: (a) kết quả hoàn thành từng bước checklist, (b) mức độ đạt
 * cao nhất của phòng thí nghiệm (yếu / trung bình / mạnh), không kèm nội dung mật khẩu.
 *
 * Quy ước: is_safe = hoàn thành/đạt yêu cầu. Với bước checklist: trả lời đúng câu kiểm tra và xác nhận đã thực hành.
 * Với phòng thí nghiệm: mức đạt là "mạnh".
 */
final class Module3Service
{
    public const LAB_ITEM_ID = 'lab-strength';
    /** @var list<string> */
    public const LAB_BANDS = ['weak', 'fair', 'strong'];

    public function __construct(
        private readonly ChecklistCatalog $catalog,
        private readonly EventRepository $events,
    ) {
    }

    /** @param array<string,mixed> $participant */
    public function overview(array $participant): array
    {
        $participantId = (int) $participant['id'];
        $module = $this->catalog->module();
        $summary = $this->events->summaryByItem($participantId, $module);
        $passed = $this->events->passedItemIds($participantId, $module);
        $labSummary = $summary[self::LAB_ITEM_ID] ?? null;

        $platforms = [];
        $totalSteps = 0;
        $passedSteps = 0;
        foreach ($this->catalog->platforms() as $platform) {
            $steps = [];
            foreach ($platform['steps'] as $step) {
                $totalSteps++;
                $isPassed = in_array($step['id'], $passed, true);
                $passedSteps += $isPassed ? 1 : 0;
                $steps[] = ChecklistCatalog::publicStep($step) + [
                    'status' => $isPassed ? 'passed' : 'open',
                    'attempts' => $summary[$step['id']]['attempts'] ?? 0,
                ];
            }
            $platforms[] = ['id' => $platform['id'], 'name' => $platform['name'], 'steps' => $steps];
        }

        return [
            'module' => $module,
            'title' => $this->catalog->title(),
            'content_version' => $this->catalog->version(),
            'disclaimer' => $this->catalog->disclaimer(),
            'platforms' => $platforms,
            'progress' => [
                'total_steps' => $totalSteps,
                'passed_steps' => $passedSteps,
                'score_percent' => $totalSteps > 0 ? (int) round($passedSteps * 100 / $totalSteps) : 0,
            ],
            'lab' => [
                'passed' => $labSummary !== null && $labSummary['first_is_safe'] === true,
                'attempts' => $labSummary['attempts'] ?? 0,
            ],
        ];
    }

    /**
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function completeStep(array $participant, string $stepId, mixed $quizChoice, mixed $practiced, mixed $responseMs): array
    {
        $step = $this->catalog->findStep($stepId);
        if ($step === null) {
            throw new HttpException(404, 'Không tìm thấy bước này.');
        }
        $options = $step['quiz']['options'];
        if (!is_int($quizChoice) || $quizChoice < 0 || $quizChoice >= count($options)) {
            throw new HttpException(422, 'Hãy chọn một đáp án.');
        }
        if ($practiced !== true) {
            throw new HttpException(422, 'Hãy xác nhận em đã thực hành các thao tác trên điện thoại.');
        }
        if ($responseMs !== null && (!is_int($responseMs) || $responseMs < 0 || $responseMs > 3_600_000)) {
            throw new HttpException(422, 'Thời gian phản hồi không hợp lệ.');
        }

        $isPassed = $quizChoice === (int) $step['quiz']['correct'];
        $attemptNo = $this->record((int) $participant['id'], $stepId, $quizChoice, $isPassed, $responseMs);

        return [
            'item_id' => $stepId,
            'attempt_no' => $attemptNo,
            'is_first_attempt' => $attemptNo === 1,
            'passed' => $isPassed,
            'correct_choice' => (int) $step['quiz']['correct'],
            'explanation' => $step['quiz']['explanation'],
        ];
    }

    /**
     * Ghi nhận mức đạt cao nhất của phòng thí nghiệm mật khẩu. Không nhận nội dung mật khẩu.
     *
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function recordLab(array $participant, mixed $bestBand): array
    {
        if (!is_string($bestBand) || !in_array($bestBand, self::LAB_BANDS, true)) {
            throw new HttpException(422, 'Mức đạt không hợp lệ.');
        }
        $choice = array_search($bestBand, self::LAB_BANDS, true);
        $isPassed = $bestBand === 'strong';
        $attemptNo = $this->record((int) $participant['id'], self::LAB_ITEM_ID, (int) $choice, $isPassed, null);

        return ['item_id' => self::LAB_ITEM_ID, 'attempt_no' => $attemptNo, 'passed' => $isPassed, 'band' => $bestBand];
    }

    /** Lặp tối đa 3 lần nếu hai yêu cầu cùng giành một số thứ tự lần thử. */
    private function record(int $participantId, string $itemId, int $choice, bool $isPassed, ?int $responseMs): int
    {
        for ($try = 0; $try < 3; $try++) {
            $attemptNo = $this->events->nextAttemptNo($participantId, $itemId);
            try {
                $this->events->insert(
                    $participantId, $this->catalog->module(), $itemId, $attemptNo, $choice, $isPassed,
                    $responseMs, $this->catalog->version()
                );
                return $attemptNo;
            } catch (PDOException $e) {
                if (($e->errorInfo[1] ?? null) !== 1062) {
                    throw $e;
                }
            }
        }
        throw new HttpException(409, 'Yêu cầu bị trùng. Vui lòng thử lại.');
    }
}
