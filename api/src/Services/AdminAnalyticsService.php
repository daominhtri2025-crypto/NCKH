<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Support\Database;

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
