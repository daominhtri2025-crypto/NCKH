<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\EventRepository;
use AnToanSo\Support\HttpException;
use PDOException;

/**
 * Module 1 — Sân chơi tình huống.
 * Ghi nhận mọi lần trả lời; điểm nghiên cứu chỉ dựa trên lần trả lời đầu tiên của mỗi tình huống.
 */
final class Module1Service
{
    private const MAX_RESPONSE_MS = 3_600_000;

    public function __construct(
        private readonly ScenarioCatalog $catalog,
        private readonly EventRepository $events,
    ) {
    }

    /** @param array<string,mixed> $participant */
    public function overview(array $participant): array
    {
        $summary = $this->events->summaryByItem((int) $participant['id'], $this->catalog->module());

        $items = [];
        $answered = 0;
        $firstTrySafe = 0;
        foreach ($this->catalog->scenarios() as $scenario) {
            $state = $summary[$scenario['id']] ?? null;
            if ($state !== null) {
                $answered++;
                $firstTrySafe += $state['first_is_safe'] ? 1 : 0;
            }
            $items[] = [
                'id' => $scenario['id'],
                'title' => $scenario['title'],
                'summary' => $scenario['summary'],
                'status' => $state === null ? 'new' : 'answered',
                'attempts' => $state['attempts'] ?? 0,
                'first_try_safe' => $state['first_is_safe'] ?? null,
            ];
        }

        $total = count($items);
        return [
            'module' => $this->catalog->module(),
            'title' => $this->catalog->title(),
            'content_version' => $this->catalog->version(),
            'scenarios' => $items,
            'progress' => [
                'total' => $total,
                'answered' => $answered,
                'first_try_safe' => $firstTrySafe,
                'score_percent' => $total > 0 ? (int) round($firstTrySafe * 100 / $total) : 0,
            ],
        ];
    }

    /** @return array<string,mixed> */
    public function show(string $scenarioId): array
    {
        $scenario = $this->requireScenario($scenarioId);
        return [
            'content_version' => $this->catalog->version(),
            'scenario' => ScenarioCatalog::publicView($scenario),
        ];
    }

    /**
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function answer(array $participant, string $scenarioId, mixed $choiceIndex, mixed $responseMs): array
    {
        $scenario = $this->requireScenario($scenarioId);
        $choices = $scenario['choices'];

        if (!is_int($choiceIndex) || $choiceIndex < 0 || $choiceIndex >= count($choices)) {
            throw new HttpException(422, 'Lựa chọn không hợp lệ.');
        }
        if ($responseMs !== null && (!is_int($responseMs) || $responseMs < 0 || $responseMs > self::MAX_RESPONSE_MS)) {
            throw new HttpException(422, 'Thời gian phản hồi không hợp lệ.');
        }

        $participantId = (int) $participant['id'];
        $module = $this->catalog->module();
        $isSafe = (bool) $choices[$choiceIndex]['is_safe'];

        $attemptNo = $this->recordAttempt($participantId, $module, $scenarioId, $choiceIndex, $isSafe, $responseMs);

        $bestIndex = null;
        foreach ($choices as $index => $choice) {
            if ($choice['is_safe']) {
                $bestIndex = $index;
                break;
            }
        }

        return [
            'attempt_no' => $attemptNo,
            'is_first_attempt' => $attemptNo === 1,
            'choice_index' => $choiceIndex,
            'is_safe' => $isSafe,
            'feedback' => $choices[$choiceIndex]['feedback'],
            'best_choice_index' => $bestIndex,
            'red_flags' => $scenario['red_flags'],
            'takeaway' => $scenario['takeaway'],
        ];
    }

    /** Lặp lại tối đa 3 lần nếu hai yêu cầu đồng thời cùng giành một số thứ tự lần thử. */
    private function recordAttempt(
        int $participantId,
        int $module,
        string $scenarioId,
        int $choiceIndex,
        bool $isSafe,
        mixed $responseMs,
    ): int {
        $ms = $responseMs === null ? null : (int) $responseMs;
        for ($try = 0; $try < 3; $try++) {
            $attemptNo = $this->events->nextAttemptNo($participantId, $scenarioId);
            try {
                $this->events->insert(
                    $participantId, $module, $scenarioId, $attemptNo, $choiceIndex, $isSafe, $ms,
                    $this->catalog->version()
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

    /** @return array<string,mixed> */
    private function requireScenario(string $scenarioId): array
    {
        $scenario = $this->catalog->find($scenarioId);
        if ($scenario === null) {
            throw new HttpException(404, 'Không tìm thấy tình huống.');
        }
        return $scenario;
    }
}
