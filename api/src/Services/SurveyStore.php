<?php

declare(strict_types=1);

namespace AnToanSo\Services;

use AnToanSo\Support\Database;
use PDO;
use RuntimeException;
use Throwable;

/**
 * Kho bộ câu hỏi khảo sát theo phiên bản, lưu trong CSDL.
 *
 * Quy tắc ghim: học sinh đã trả lời câu nào thì mọi giai đoạn (pre, post, theo dõi) của họ
 * dùng đúng phiên bản đó. Học sinh chưa trả lời câu nào dùng phiên bản hiện hành.
 * Một phiên bản đã tạo không bao giờ bị sửa.
 */
final class SurveyStore
{
    private const SEED_FILE = 'assessment_items.json';

    /** @var array<string,AssessmentCatalog> */
    private array $cache = [];

    public function __construct(private readonly ?PDO $pdo = null)
    {
    }

    /** Lần đầu, nạp phiên bản trong tệp JSON làm phiên bản hiện hành. */
    public function ensureSeeded(): void
    {
        if ((int) $this->db()->query('SELECT COUNT(*) FROM survey_versions')->fetchColumn() > 0) {
            return;
        }
        $seed = AssessmentCatalog::fromFile(dirname(__DIR__, 2) . '/content/' . self::SEED_FILE);
        $this->insertVersion($seed, null, true);
    }

    public function active(): AssessmentCatalog
    {
        $this->ensureSeeded();
        $version = $this->db()->query('SELECT version FROM survey_versions WHERE is_active = 1 LIMIT 1')->fetchColumn();
        if ($version === false) {
            throw new RuntimeException('Chưa có phiên bản câu hỏi hiện hành.');
        }
        return $this->get((string) $version);
    }

    public function get(string $version): AssessmentCatalog
    {
        if (isset($this->cache[$version])) {
            return $this->cache[$version];
        }
        $head = $this->db()->prepare('SELECT version, title, intro, behavior_scale FROM survey_versions WHERE version = ?');
        $head->execute([$version]);
        $row = $head->fetch();
        if ($row === false) {
            throw new RuntimeException("Không có phiên bản câu hỏi {$version}.");
        }
        $items = $this->db()->prepare('SELECT data FROM survey_items WHERE version = ? ORDER BY position');
        $items->execute([$version]);
        $list = array_map(static fn (array $r): array => json_decode((string) $r['data'], true), $items->fetchAll());

        $catalog = AssessmentCatalog::fromArray([
            'version' => $row['version'],
            'title' => $row['title'],
            'intro' => $row['intro'],
            'behavior_scale' => json_decode((string) $row['behavior_scale'], true),
            'items' => $list,
        ]);
        return $this->cache[$version] = $catalog;
    }

    /** Phiên bản mà một học sinh đang làm: đã ghim theo câu đầu tiên, hoặc hiện hành nếu chưa làm. */
    public function forParticipant(int $pid): AssessmentCatalog
    {
        $stmt = $this->db()->prepare('SELECT content_version FROM assessments_self WHERE participant_id = ? LIMIT 1');
        $stmt->execute([$pid]);
        $pinned = $stmt->fetchColumn();
        return $pinned !== false ? $this->get((string) $pinned) : $this->active();
    }

    /** @return list<array<string,mixed>> */
    public function versions(): array
    {
        $this->ensureSeeded();
        return $this->db()->query(
            'SELECT v.version, v.created_at, v.is_active,
                    (SELECT COUNT(*) FROM survey_items i WHERE i.version = v.version) AS n_items
             FROM survey_versions v ORDER BY v.created_at, v.version'
        )->fetchAll();
    }

    public function nextVersionName(): string
    {
        $max = 0;
        foreach ($this->db()->query('SELECT version FROM survey_versions')->fetchAll(PDO::FETCH_COLUMN) as $v) {
            if (preg_match('/^a-v(\d+)$/', (string) $v, $m)) {
                $max = max($max, (int) $m[1]);
            }
        }
        return 'a-v' . ($max + 1);
    }

    /** Lưu một phiên bản mới rồi đặt làm hiện hành, trong một giao dịch. Phiên bản cũ giữ nguyên. */
    public function publish(AssessmentCatalog $catalog, ?int $actorId): void
    {
        $pdo = $this->db();
        $pdo->beginTransaction();
        try {
            $pdo->exec('UPDATE survey_versions SET is_active = 0 WHERE is_active = 1');
            $this->insertVersion($catalog, $actorId, true);
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
        $this->cache[$catalog->version()] = $catalog;
    }

    private function insertVersion(AssessmentCatalog $catalog, ?int $actorId, bool $active): void
    {
        $data = $catalog->toArray();
        $this->db()->prepare(
            'INSERT INTO survey_versions (version, title, intro, behavior_scale, is_active, created_at, created_by_teacher_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $data['version'], $data['title'], $data['intro'],
            json_encode($data['behavior_scale'], JSON_UNESCAPED_UNICODE),
            $active ? 1 : 0, date('Y-m-d H:i:s'), $actorId,
        ]);
        $stmt = $this->db()->prepare('INSERT INTO survey_items (version, item_id, position, data) VALUES (?, ?, ?, ?)');
        foreach (array_values($data['items']) as $position => $item) {
            $stmt->execute([$data['version'], $item['id'], $position, json_encode($item, JSON_UNESCAPED_UNICODE)]);
        }
    }

    private function db(): PDO
    {
        return $this->pdo ?? Database::pdo();
    }
}
