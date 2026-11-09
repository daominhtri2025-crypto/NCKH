<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Support\Database;

/**
 * Xuất dữ liệu nghiên cứu ẩn danh. Chỉ dùng mã giả danh và mã lớp; không có họ tên, email, số điện thoại,
 * thời điểm đồng ý, hay nội dung mật khẩu. Chuỗi cột được mã hóa ASCII để tránh lỗi font khi mở bằng Excel.
 */
final class AssessmentExportService
{
    public function __construct(private readonly AssessmentCatalog $catalog)
    {
    }

    /** Một dòng cho mỗi lần trả lời (dạng dài, phù hợp phân tích từng câu). */
    public function longCsv(): string
    {
        $rows = Database::pdo()->query(
            'SELECT p.code AS pseudonym, p.class_code, a.phase, a.item_id, a.instrument,
                    a.is_correct, a.answer_index, a.answer_value, a.response_ms, a.content_version, a.created_at
             FROM assessments_self a JOIN participants p ON p.id = a.participant_id
             ORDER BY p.id, FIELD(a.phase, "pre", "post", "delayed"), a.id'
        )->fetchAll();

        $lines = [['pseudonym', 'class_code', 'phase', 'item_id', 'instrument', 'is_correct', 'answer_index', 'answer_value', 'response_ms', 'content_version', 'answered_at']];
        foreach ($rows as $r) {
            $lines[] = [
                $r['pseudonym'], $r['class_code'], $r['phase'], $r['item_id'], $r['instrument'],
                $r['is_correct'] === null ? '' : (string) $r['is_correct'],
                $r['answer_index'] === null ? '' : (string) $r['answer_index'],
                $r['answer_value'] === null ? '' : (string) $r['answer_value'],
                $r['response_ms'] === null ? '' : (string) $r['response_ms'],
                $r['content_version'], $r['created_at'],
            ];
        }
        return $this->toCsv($lines);
    }

    /** Một dòng cho mỗi học sinh, các biến đã tổng hợp theo giai đoạn (dạng rộng, sẵn cho phân tích lặp đo). */
    public function wideCsv(): string
    {
        $items = $this->catalog->items();
        $knowledgeTotal = count(array_filter($items, static fn (array $i): bool => $i['instrument'] === 'knowledge'));
        $reverse = [];
        foreach ($items as $i) {
            if ($i['instrument'] === 'behavior') {
                $reverse[$i['id']] = (bool) $i['reverse'];
            }
        }

        $participants = Database::pdo()->query(
            "SELECT id, code, class_code FROM participants WHERE status = 'active' ORDER BY id"
        )->fetchAll();

        $answers = [];
        foreach (Database::pdo()->query(
            'SELECT participant_id, phase, item_id, instrument, is_correct, answer_value, response_ms FROM assessments_self'
        )->fetchAll() as $a) {
            $answers[(int) $a['participant_id']][$a['phase']][] = $a;
        }

        $moduleCounts = [];
        foreach (Database::pdo()->query(
            "SELECT participant_id,
                    COUNT(DISTINCT CASE WHEN module = 1 THEN item_id END) AS m1_answered,
                    COUNT(DISTINCT CASE WHEN module = 2 THEN item_id END) AS m2_answered,
                    COUNT(DISTINCT CASE WHEN module = 3 AND is_safe = 1 AND item_id <> 'lab-strength' THEN item_id END) AS m3_steps_passed,
                    MAX(CASE WHEN module = 3 AND item_id = 'lab-strength' AND is_safe = 1 THEN 1 ELSE 0 END) AS lab_passed
             FROM module_events GROUP BY participant_id"
        )->fetchAll() as $m) {
            $moduleCounts[(int) $m['participant_id']] = $m;
        }

        $header = ['pseudonym', 'class_code'];
        foreach (['pre', 'post', 'delayed'] as $phase) {
            array_push($header, "{$phase}_knowledge_correct", "{$phase}_knowledge_pct",
                "{$phase}_behavior_mean_adj", "{$phase}_mean_response_ms");
        }
        array_push($header, 'm1_items_answered', 'm2_items_answered', 'm3_steps_passed', 'm3_lab_passed');

        $lines = [$header];
        foreach ($participants as $p) {
            $pid = (int) $p['id'];
            $row = [$p['code'], $p['class_code']];
            foreach (['pre', 'post', 'delayed'] as $phase) {
                $rows = $answers[$pid][$phase] ?? [];
                $correct = 0;
                $behaviorValues = [];
                $times = [];
                foreach ($rows as $a) {
                    if ($a['instrument'] === 'knowledge') {
                        $correct += (int) $a['is_correct'];
                    } elseif ($a['instrument'] === 'behavior') {
                        $v = (int) $a['answer_value'];
                        $behaviorValues[] = ($reverse[$a['item_id']] ?? false) ? 5 - $v : $v;
                    }
                    if ($a['response_ms'] !== null) {
                        $times[] = (int) $a['response_ms'];
                    }
                }
                $hasRows = $rows !== [];
                $row[] = $hasRows ? (string) $correct : '';
                $row[] = $hasRows ? (string) round($correct * 100 / $knowledgeTotal, 1) : '';
                $row[] = $behaviorValues !== [] ? (string) round(array_sum($behaviorValues) / count($behaviorValues), 2) : '';
                $row[] = $times !== [] ? (string) (int) round(array_sum($times) / count($times)) : '';
            }
            $m = $moduleCounts[$pid] ?? null;
            $row[] = (string) ($m['m1_answered'] ?? 0);
            $row[] = (string) ($m['m2_answered'] ?? 0);
            $row[] = (string) ($m['m3_steps_passed'] ?? 0);
            $row[] = (string) ($m['lab_passed'] ?? 0);
            $lines[] = $row;
        }
        return $this->toCsv($lines);
    }

    /** @param list<list<string>> $lines */
    private function toCsv(array $lines): string
    {
        $fh = fopen('php://temp', 'r+');
        foreach ($lines as $line) {
            fputcsv($fh, $line, ',', '"', '\\');
        }
        rewind($fh);
        $out = stream_get_contents($fh);
        fclose($fh);
        return (string) $out;
    }
}
