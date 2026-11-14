<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Support\Database;
use AnToanSo\Support\HttpException;
use DateTimeImmutable;

/**
 * Tổng hợp số liệu đo lường cho trang quản trị. Chỉ trả về số tổng hợp, không trả về câu trả lời từng học sinh.
 *
 * Quy tắc công bố (theo báo cáo, mục 2.5): ô có ít hơn MIN_CELL học sinh được ẩn (null) và đánh dấu.
 * Hành vi đã điều chỉnh: câu đảo chiều được đổi 5 − mức trả lời trước khi lấy trung bình.
 */
final class AdminAnalyticsService
{
    public const MIN_CELL = 5;
    private const PHASES = ['pre', 'post', 'delayed'];

    public function __construct(private readonly SurveyStore $store = new SurveyStore())
    {
    }

    /** @return array<string,mixed> */
    public function overview(): array
    {
        $pdo = Database::pdo();

        $classes = [];
        foreach ($pdo->query('SELECT class_code, COUNT(*) AS issued, SUM(status = "active") AS active FROM participants GROUP BY class_code ORDER BY class_code')->fetchAll() as $r) {
            $classes[$r['class_code']] = ['class_code' => $r['class_code'], 'issued' => (int) $r['issued'], 'active' => (int) $r['active'],
                'pre_done' => 0, 'post_done' => 0, 'delayed_done' => 0];
        }

        $active = $pdo->query("SELECT id, class_code FROM participants WHERE status = 'active'")->fetchAll();
        $answers = [];
        foreach ($pdo->query('SELECT participant_id, phase, item_id, instrument, is_correct, answer_value, content_version FROM assessments_self')->fetchAll() as $a) {
            $answers[(int) $a['participant_id']][$a['phase']][] = $a;
        }

        // Với mỗi học sinh đang hoạt động: điểm từng giai đoạn nếu đã làm xong.
        $person = [];
        foreach ($active as $p) {
            $pid = (int) $p['id'];
            $row = ['class' => $p['class_code'], 'phase' => []];
            foreach (self::PHASES as $phase) {
                $rows = $answers[$pid][$phase] ?? [];
                if ($rows === []) {
                    continue;
                }
                $version = $rows[0]['content_version'];
                $catalog = $this->store->get($version);
                $total = $catalog->itemCount();
                if (count($rows) < $total) {
                    continue; // Chưa làm xong giai đoạn này.
                }
                $row['phase'][$phase] = $this->scores($rows, $catalog);
                if (isset($classes[$p['class_code']])) {
                    $classes[$p['class_code']][$phase . '_done']++;
                }
            }
            $person[$pid] = $row;
        }

        return [
            'n_active' => count($active),
            'min_cell' => self::MIN_CELL,
            'classes' => array_values($classes),
            'phases' => $this->phaseSummary($person),
            'paired' => [
                'pre_post' => $this->paired($person, 'pre', 'post'),
                'pre_delayed' => $this->paired($person, 'pre', 'delayed'),
            ],
            'topics' => $this->topics($answers),
            'note' => 'Số liệu tổng hợp. Ô có dưới ' . self::MIN_CELL . ' học sinh được ẩn để không lộ danh tính.',
        ];
    }

    public const TIMELINE_METRICS = ['issued', 'activated', 'pre_done', 'post_done', 'delayed_done'];

    /**
     * Số học sinh theo thời gian (ngày hoặc tháng), dùng cho biểu đồ của quản trị viên.
     *
     * Mỗi chỉ số được đếm theo thời điểm xảy ra sự kiện:
     *  - issued: thẻ được phát (participants.created_at)
     *  - activated: học sinh kích hoạt thẻ (participants.claimed_at)
     *  - pre_done / post_done / delayed_done: lần trả lời cuối cùng của giai đoạn, chỉ khi đã trả lời đủ
     *    mọi câu của đúng phiên bản bộ câu hỏi đã ghim (cùng định nghĩa "xong" với overview()).
     * Chỉ tính học sinh đang hoạt động cho ba chỉ số khảo sát. Chỉ trả về số đếm, không có mã hay câu trả lời.
     * Thời gian lấy theo múi giờ của máy chủ (cùng múi giờ đã dùng khi ghi dữ liệu).
     *
     * @return array<string,mixed>
     */
    public function timeline(string $granularity = 'day', int $span = 30, ?DateTimeImmutable $now = null): array
    {
        $max = ['day' => 366, 'month' => 36];
        if (!isset($max[$granularity])) {
            throw new HttpException(422, 'Đơn vị thời gian phải là day hoặc month.');
        }
        if ($span < 1 || $span > $max[$granularity]) {
            throw new HttpException(422, "Khoảng thời gian phải từ 1 đến {$max[$granularity]}.");
        }

        $now ??= new DateTimeImmutable('now');
        $isDay = $granularity === 'day';
        $keyLen = $isDay ? 10 : 7;
        $fmt = $isDay ? 'Y-m-d' : 'Y-m';
        $first = $isDay
            ? $now->modify('-' . ($span - 1) . ' days')
            : $now->modify('first day of this month')->modify('-' . ($span - 1) . ' months');

        $points = [];
        for ($i = 0; $i < $span; $i++) {
            $key = $first->modify('+' . $i . ($isDay ? ' days' : ' months'))->format($fmt);
            $points[$key] = ['period' => $key, 'new' => array_fill_keys(self::TIMELINE_METRICS, 0)];
        }
        $firstKey = (string) array_key_first($points);
        $lastKey = (string) array_key_last($points);
        $before = array_fill_keys(self::TIMELINE_METRICS, 0); // sự kiện trước cửa sổ: nền của số tích lũy

        $add = static function (string $metric, ?string $when) use (&$points, &$before, $firstKey, $lastKey, $keyLen): void {
            if ($when === null || $when === '') {
                return;
            }
            $key = substr($when, 0, $keyLen);
            if ($key < $firstKey) {
                $before[$metric]++;
            } elseif ($key <= $lastKey) {
                $points[$key]['new'][$metric]++;
            }
        };

        $pdo = Database::pdo();
        foreach ($pdo->query('SELECT created_at, claimed_at FROM participants')->fetchAll() as $r) {
            $add('issued', $r['created_at']);
            $add('activated', $r['claimed_at']);
        }

        $totals = [];
        $rows = $pdo->query(
            "SELECT a.phase, a.content_version, COUNT(*) AS n, MAX(a.created_at) AS last_at
             FROM assessments_self a JOIN participants p ON p.id = a.participant_id
             WHERE p.status = 'active'
             GROUP BY a.participant_id, a.phase, a.content_version"
        )->fetchAll();
        foreach ($rows as $r) {
            $version = (string) $r['content_version'];
            $totals[$version] ??= $this->store->get($version)->itemCount();
            if ((int) $r['n'] >= $totals[$version]) {
                $add($r['phase'] . '_done', $r['last_at']);
            }
        }

        $running = $before;
        $out = [];
        foreach ($points as $point) {
            foreach (self::TIMELINE_METRICS as $m) {
                $running[$m] += $point['new'][$m];
            }
            $out[] = $point + ['cumulative' => $running];
        }

        return [
            'granularity' => $granularity,
            'span' => $span,
            'from' => $firstKey,
            'to' => $lastKey,
            'points' => $out,
            'totals' => $running,
            'note' => 'Số đếm theo thời điểm xảy ra sự kiện, múi giờ máy chủ. Không chứa mã thẻ hay câu trả lời từng học sinh.',
        ];
    }

    /**
     * @param list<array<string,mixed>> $rows
     * @return array{knowledge_pct:float,behavior_mean:?float}
     */
    private function scores(array $rows, AssessmentCatalog $catalog): array
    {
        $knowTotal = 0;
        $reverse = [];
        foreach ($catalog->items() as $item) {
            if ($item['instrument'] === 'knowledge') {
                $knowTotal++;
            } else {
                $reverse[$item['id']] = (bool) ($item['reverse'] ?? false);
            }
        }
        $correct = 0;
        $behavior = [];
        foreach ($rows as $r) {
            if ($r['instrument'] === 'knowledge') {
                $correct += (int) $r['is_correct'];
            } elseif ($r['answer_value'] !== null) {
                $v = (int) $r['answer_value'];
                $behavior[] = ($reverse[$r['item_id']] ?? false) ? 5 - $v : $v;
            }
        }
        return [
            'knowledge_pct' => $knowTotal > 0 ? 100 * $correct / $knowTotal : 0.0,
            'behavior_mean' => $behavior !== [] ? array_sum($behavior) / count($behavior) : null,
        ];
    }

    /** @param array<int,array<string,mixed>> $person */
    private function phaseSummary(array $person): array
    {
        $out = [];
        foreach (self::PHASES as $phase) {
            $k = []; $b = [];
            foreach ($person as $p) {
                if (isset($p['phase'][$phase])) {
                    $k[] = $p['phase'][$phase]['knowledge_pct'];
                    if ($p['phase'][$phase]['behavior_mean'] !== null) {
                        $b[] = $p['phase'][$phase]['behavior_mean'];
                    }
                }
            }
            $n = count($k);
            $out[$phase] = [
                'n' => $n,
                'knowledge_pct_mean' => $this->cell($n, $k),
                'behavior_mean' => $this->cell(count($b), $b),
            ];
        }
        return $out;
    }

    /** @param array<int,array<string,mixed>> $person */
    private function paired(array $person, string $a, string $b): array
    {
        $diffs = []; $pa = []; $pb = [];
        foreach ($person as $p) {
            if (isset($p['phase'][$a], $p['phase'][$b])) {
                $pa[] = $p['phase'][$a]['knowledge_pct'];
                $pb[] = $p['phase'][$b]['knowledge_pct'];
                $diffs[] = $p['phase'][$b]['knowledge_pct'] - $p['phase'][$a]['knowledge_pct'];
            }
        }
        $n = count($diffs);
        return [
            'n' => $n,
            'knowledge_pct_' . $a => $this->cell($n, $pa),
            'knowledge_pct_' . $b => $this->cell($n, $pb),
            'mean_difference' => $this->cell($n, $diffs),
        ];
    }

    /** @param array<int,array<int,array<string,mixed>>> $answers */
    private function topics(array $answers): array
    {
        $agg = [];
        foreach ($answers as $byPhase) {
            foreach ($byPhase as $phase => $rows) {
                foreach ($rows as $r) {
                    if ($r['instrument'] !== 'knowledge') {
                        continue;
                    }
                    $item = $this->store->get($r['content_version'])->find($r['item_id']);
                    $topic = $item['topic'] ?? '?';
                    $agg[$topic][$phase]['correct'] = ($agg[$topic][$phase]['correct'] ?? 0) + (int) $r['is_correct'];
                    $agg[$topic][$phase]['n'] = ($agg[$topic][$phase]['n'] ?? 0) + 1;
                }
            }
        }
        ksort($agg);
        $out = [];
        foreach ($agg as $topic => $phases) {
            $line = ['topic' => $topic];
            foreach (self::PHASES as $phase) {
                $n = $phases[$phase]['n'] ?? 0;
                $c = $phases[$phase]['correct'] ?? 0;
                $line[$phase] = ['n' => $n, 'correct_pct' => $n >= self::MIN_CELL ? round(100 * $c / $n, 1) : null];
            }
            $out[] = $line;
        }
        return $out;
    }

    /** Trả về mean/median/SD hoặc null nếu ô nhỏ hơn MIN_CELL. */
    private function cell(int $n, array $values): ?array
    {
        if ($n < self::MIN_CELL) {
            return ['n' => $n, 'suppressed' => true];
        }
        sort($values);
        $mean = array_sum($values) / $n;
        $var = $n > 1 ? array_sum(array_map(static fn ($v) => ($v - $mean) ** 2, $values)) / ($n - 1) : 0.0;
        $mid = intdiv($n, 2);
        $median = $n % 2 ? $values[$mid] : ($values[$mid - 1] + $values[$mid]) / 2;
        return ['n' => $n, 'suppressed' => false, 'mean' => round($mean, 2), 'sd' => round(sqrt($var), 2), 'median' => round($median, 2)];
    }
}
