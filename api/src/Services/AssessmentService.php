<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Repositories\AssessmentRepository;
use AnToanSo\Support\Env;
use AnToanSo\Support\HttpException;
use DateTimeImmutable;
use PDOException;

/**
 * Khảo sát tiền–hậu–theo dõi và trình tự mở khóa:
 *  - pre:     luôn mở; phải hoàn thành trước khi vào bất kỳ module học tập nào.
 *  - post:    mở khi đã hoàn thành pre VÀ đủ 3 module.
 *  - delayed: mở khi đã hoàn thành post VÀ đã qua DELAYED_MIN_DAYS ngày (mặc định 28, tức 4 tuần).
 *
 * Câu kiến thức ghi is_correct. Câu hành vi ghi mức 1-4 (không có đúng/sai).
 * Không phản hồi đúng/sai ngay trong khảo sát, để không làm thay đổi kết quả đo của các giai đoạn sau.
 */
final class AssessmentService
{
    public const DEFAULT_DELAYED_DAYS = 28;

    /** Bộ câu hỏi của học sinh đang xử lý (được gắn ở đầu mỗi thao tác, theo phiên bản đã ghim). */
    private AssessmentCatalog $catalog;

    public function __construct(
        private readonly SurveyStore $store,
        private readonly AssessmentRepository $repo,
        private readonly Module1Service $module1,
        private readonly Module2Service $module2,
        private readonly Module3Service $module3,
    ) {
    }

    /** Dùng trong kiểm thử để thay đổi thời điểm hiện tại. */
    public static function delayedDays(): int
    {
        return (int) Env::get('DELAYED_MIN_DAYS', (string) self::DEFAULT_DELAYED_DAYS);
    }

    /** @param array<string,mixed> $participant */
    public function status(array $participant): array
    {
        $this->bind($participant);
        $pid = (int) $participant['id'];
        $modules = $this->modulesCompleted($participant);
        $pre = $this->phaseState($pid, 'pre', $modules, true);
        $post = $this->phaseState($pid, 'post', $modules, $pre['status'] === 'done');
        $postDone = $post['status'] === 'done';
        $delayed = $this->phaseState($pid, 'delayed', $modules, $postDone, $this->postCompletedAt($pid));

        return [
            'title' => $this->catalog->title(),
            'intro' => $this->catalog->intro(),
            'content_version' => $this->catalog->version(),
            'behavior_scale' => $this->catalog->behaviorScale(),
            'phases' => ['pre' => $pre, 'post' => $post, 'delayed' => $delayed],
            'modules' => $modules,
        ];
    }

    /** @param array<string,mixed> $participant */
    public function assertPreDone(array $participant): void
    {
        $this->bind($participant);
        $state = $this->phaseState((int) $participant['id'], 'pre', [], true);
        if ($state['status'] !== 'done') {
            throw new HttpException(403, 'Hãy hoàn thành khảo sát đầu vào trước khi vào các hoạt động học tập.');
        }
    }

    /**
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function phaseView(array $participant, string $phase): array
    {
        $this->requirePhase($phase);
        $this->bind($participant);
        $pid = (int) $participant['id'];
        $modules = $this->modulesCompleted($participant);
        $state = $this->phaseStateFor($pid, $phase, $modules);
        $answers = $this->repo->answersFor($pid, $phase);

        $items = [];
        foreach ($this->catalog->items() as $item) {
            $items[] = AssessmentCatalog::publicItem($item) + ['answered' => isset($answers[$item['id']])];
        }
        return ['phase' => $phase, 'state' => $state, 'items' => $items];
    }

    /**
     * @param array<string,mixed> $participant
     * @return array<string,mixed>
     */
    public function answer(array $participant, string $phase, string $itemId, mixed $answerIndex, mixed $answerValue, mixed $responseMs): array
    {
        $this->requirePhase($phase);
        $this->bind($participant);
        $item = $this->catalog->find($itemId);
        if ($item === null) {
            throw new HttpException(404, 'Không tìm thấy câu hỏi này.');
        }
        $pid = (int) $participant['id'];
        $state = $this->phaseStateFor($pid, $phase, $this->modulesCompleted($participant));
        if ($state['status'] === 'locked') {
            throw new HttpException(403, (string) $state['locked_reason']);
        }
        if (isset($this->repo->answersFor($pid, $phase)[$itemId])) {
            throw new HttpException(409, 'Em đã trả lời câu này rồi.');
        }
        if ($responseMs !== null && (!is_int($responseMs) || $responseMs < 0 || $responseMs > 3_600_000)) {
            throw new HttpException(422, 'Thời gian phản hồi không hợp lệ.');
        }

        $index = null;
        $value = null;
        $isCorrect = null;
        if ($item['instrument'] === 'knowledge') {
            if (!is_int($answerIndex) || $answerIndex < 0 || $answerIndex >= count($item['options'])) {
                throw new HttpException(422, 'Hãy chọn một đáp án.');
            }
            $index = $answerIndex;
            $isCorrect = $answerIndex === (int) $item['correct'];
        } else {
            if (!is_int($answerValue) || $answerValue < 1 || $answerValue > 4) {
                throw new HttpException(422, 'Hãy chọn một mức từ 1 đến 4.');
            }
            $value = $answerValue;
        }

        try {
            $this->repo->insert($pid, $phase, $itemId, (string) $item['instrument'], $index, $value, $isCorrect,
                $responseMs === null ? null : (int) $responseMs, $this->catalog->version());
        } catch (PDOException $e) {
            if (($e->errorInfo[1] ?? null) === 1062) {
                throw new HttpException(409, 'Em đã trả lời câu này rồi.');
            }
            throw $e;
        }

        $answered = count($this->repo->answersFor($pid, $phase));
        return [
            'item_id' => $itemId,
            'phase' => $phase,
            'recorded' => true,
            'progress' => ['answered' => $answered, 'total' => count($this->catalog->items())],
        ];
    }

    /**
     * @param array<string,mixed> $participant
     * @return array{m1:bool,m2:bool,m3:bool,all:bool}
     */
    public function modulesCompleted(array $participant): array
    {
        $m1 = $this->module1->overview($participant)['progress'];
        $m2 = $this->module2->overview($participant)['progress'];
        $m3 = $this->module3->overview($participant);
        $m1Done = $m1['answered'] === $m1['total'];
        $m2Done = $m2['answered'] === $m2['total'];
        $m3Done = $m3['progress']['passed_steps'] === $m3['progress']['total_steps'] && $m3['lab']['passed'];
        return ['m1' => $m1Done, 'm2' => $m2Done, 'm3' => $m3Done, 'all' => $m1Done && $m2Done && $m3Done];
    }

    /**
     * @param array{m1:bool,m2:bool,m3:bool,all:bool} $modules
     * @return array<string,mixed>
     */
    private function phaseStateFor(int $pid, string $phase, array $modules): array
    {
        return match ($phase) {
            'pre' => $this->phaseState($pid, 'pre', $modules, true),
            'post' => $this->phaseState($pid, 'post', $modules, $this->isDone($pid, 'pre')),
            'delayed' => $this->phaseState($pid, 'delayed', $modules, $this->isDone($pid, 'post'), $this->postCompletedAt($pid)),
        };
    }

    /**
     * @param array{m1:bool,m2:bool,m3:bool,all:bool} $modules
     * @return array<string,mixed>
     */
    private function phaseState(int $pid, string $phase, array $modules, bool $prerequisite, ?DateTimeImmutable $postDoneAt = null): array
    {
        $total = count($this->catalog->items());
        $answers = $this->repo->answersFor($pid, $phase);
        $answered = count($answers);
        $base = ['phase' => $phase, 'answered' => $answered, 'total' => $total];

        if ($answered >= $total) {
            return $base + ['status' => 'done', 'locked_reason' => null, 'available_at' => null];
        }
        if (!$prerequisite) {
            $reason = match ($phase) {
                'post' => 'Hãy hoàn thành khảo sát đầu vào trước.',
                default => 'Hãy hoàn thành khảo sát sau can thiệp trước.',
            };
            return $base + ['status' => 'locked', 'locked_reason' => $reason, 'available_at' => null];
        }
        if ($phase === 'post' && !$modules['all']) {
            return $base + ['status' => 'locked', 'locked_reason' => 'Hoàn thành cả 3 hoạt động trước khi làm khảo sát sau can thiệp.', 'available_at' => null];
        }
        if ($phase === 'delayed') {
            $availableAt = $postDoneAt?->modify('+' . self::delayedDays() . ' days');
            $now = new DateTimeImmutable('now');
            if ($availableAt === null || $now < $availableAt) {
                return $base + [
                    'status' => 'locked',
                    'locked_reason' => 'Khảo sát theo dõi sẽ mở sau ' . self::delayedDays() . ' ngày kể từ khi hoàn thành khảo sát sau can thiệp.',
                    'available_at' => $availableAt?->format('Y-m-d H:i:s'),
                ];
            }
        }
        $status = $answered > 0 ? 'in_progress' : 'open';
        return $base + ['status' => $status, 'locked_reason' => null, 'available_at' => null];
    }

    private function isDone(int $pid, string $phase): bool
    {
        return count($this->repo->answersFor($pid, $phase)) >= count($this->catalog->items());
    }

    private function postCompletedAt(int $pid): ?DateTimeImmutable
    {
        if (!$this->isDone($pid, 'post')) {
            return null;
        }
        $at = $this->repo->lastAnsweredAt($pid, 'post');
        return $at === null ? null : new DateTimeImmutable($at);
    }

    /** @param array<string,mixed> $participant */
    private function bind(array $participant): void
    {
        $this->catalog = $this->store->forParticipant((int) $participant['id']);
    }

    private function requirePhase(string $phase): void
    {
        if (!in_array($phase, AssessmentCatalog::PHASES, true)) {
            throw new HttpException(404, 'Không tìm thấy giai đoạn khảo sát.');
        }
    }
}
