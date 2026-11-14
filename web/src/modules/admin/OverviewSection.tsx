import { Alert, Badge, Button, Card, PageTitle, StatCard } from '../../components/ui';
import {
  CHART_COLORS,
  Donut,
  GroupedColumns,
  HorizontalBars,
  LabeledColumns,
  LegendDots,
} from '../../components/charts';
import { type AdminSection, type AdminTeacher, type AnalyticsOverview, PHASE_SHORT, cellValue, pct, sumClasses } from './types';
import { Section } from './parts';
import TimelinePanel from './TimelinePanel';

interface Props {
  analytics: AnalyticsOverview | null;
  teachers: AdminTeacher[] | null;
  error: string | null;
  onNavigate: (section: AdminSection) => void;
}

/** Tổng quan hệ thống: chỉ số chính và biểu đồ, tính từ /admin/analytics và /admin/teachers. */
export default function OverviewSection({ analytics, teachers, error, onNavigate }: Props) {
  if (error && !analytics) return <Alert>{error}</Alert>;
  if (!analytics) return <p className="py-16 text-center text-ink-soft">Đang tải số liệu tổng quan…</p>;

  const total = sumClasses(analytics.classes);
  const teacherAccounts = teachers?.filter((t) => t.role === 'teacher') ?? [];
  const activeTeachers = teacherAccounts.filter((t) => t.active).length;
  const lockedAccounts = teachers ? teachers.filter((t) => !t.active).length : 0;
  const admins = teachers ? teachers.filter((t) => t.role === 'admin').length : 0;

  const funnel = [
    { name: 'Đã phát thẻ', value: total.issued },
    { name: 'Đã kích hoạt', value: total.active },
    { name: 'Xong đầu vào', value: total.pre_done },
    { name: 'Xong sau can thiệp', value: total.post_done },
    { name: 'Xong theo dõi', value: total.delayed_done },
  ];

  const activation = [
    { name: 'Đã kích hoạt', value: total.active, color: 'var(--chart-3)' },
    { name: 'Chưa kích hoạt', value: Math.max(0, total.issued - total.active), color: 'var(--line)' },
  ];

  const knowledge = (['pre', 'post', 'delayed'] as const).map((p) => {
    const v = cellValue(analytics.phases[p].knowledge_pct_mean);
    return { name: PHASE_SHORT[p], value: v, label: v === null ? `ẩn (n=${analytics.phases[p].n})` : `${v.toFixed(1)}%` };
  });

  const byClass = analytics.classes.map((c) => ({
    name: c.class_code,
    active: c.active,
    pre: c.pre_done,
    post: c.post_done,
    delayed: c.delayed_done,
  }));

  const topics = analytics.topics.map((t) => ({
    name: t.topic.toUpperCase(),
    pre: t.pre.correct_pct,
    post: t.post.correct_pct,
    delayed: t.delayed.correct_pct,
  }));
  const hiddenTopicCells = analytics.topics.reduce(
    (n, t) => n + [t.pre, t.post, t.delayed].filter((c) => c.correct_pct === null).length,
    0,
  );
  const hiddenKnowledge = knowledge.filter((k) => k.value === null).length;

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle
        title="Tổng quan hệ thống"
        subtitle="Số liệu tổng hợp từ toàn bộ lớp tham gia. Ô có ít hơn 5 học sinh bị ẩn để bảo vệ ẩn danh."
        actions={
          <>
            <Button icon="printer" onClick={() => onNavigate('report')}>Báo cáo để in</Button>
            <Button variant="primary" icon="download" onClick={() => onNavigate('export')}>Xuất dữ liệu</Button>
          </>
        }
      />

      {error && <Alert>{error}</Alert>}

      <section aria-label="Chỉ số chính" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Học sinh (thẻ đã phát)"
          value={total.issued}
          sub={`${total.active} đã kích hoạt (${pct(total.active, total.issued)}%)`}
          icon="users"
        />
        <StatCard
          label="Giáo viên"
          value={teachers ? activeTeachers : '…'}
          sub={teachers ? `${admins} quản trị viên · ${lockedAccounts} tài khoản bị khóa` : 'Đang tải…'}
          icon="user"
          tone="info"
        />
        <StatCard
          label="Lớp tham gia"
          value={analytics.classes.length}
          sub="3 hoạt động học tập mỗi lớp"
          icon="target"
          tone="warn"
        />
        <StatCard
          label="Xong khảo sát sau can thiệp"
          value={`${pct(total.post_done, total.active)}%`}
          sub={`${total.post_done}/${total.active} học sinh đang hoạt động`}
          icon="circleCheck"
          tone="ok"
        />
      </section>

      <TimelinePanel />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Section title="Tiến trình theo các chặng nghiên cứu" hint="Số học sinh đi đến từng chặng, từ phát thẻ đến khảo sát theo dõi.">
          <HorizontalBars data={funnel} ariaLabel="Số học sinh theo từng chặng nghiên cứu" height={270} />
        </Section>

        <Section title="Tỷ lệ kích hoạt thẻ" hint="Thẻ đã được học sinh kích hoạt so với tổng thẻ đã phát.">
          <Donut
            slices={activation}
            centerValue={`${pct(total.active, total.issued)}%`}
            centerLabel="đã kích hoạt"
            ariaLabel={`Đã kích hoạt ${total.active} trên ${total.issued} thẻ`}
          />
          <LegendDots items={activation.map((s) => ({ name: s.name, value: s.value, color: s.color }))} />
        </Section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section
          title="Điểm kiến thức trung bình theo giai đoạn"
          hint="Tỷ lệ trả lời đúng trong 10 câu kiến thức, tính trên học sinh đã xong giai đoạn đó."
        >
          <LabeledColumns data={knowledge} ariaLabel="Điểm kiến thức trung bình theo giai đoạn" />
          {hiddenKnowledge > 0 && (
            <p className="mt-2 mb-0 text-xs text-ink-soft">
              <Badge tone="warn">Ẩn</Badge> {hiddenKnowledge} giai đoạn chưa đủ {analytics.min_cell} học sinh nên chưa hiển thị.
            </p>
          )}
        </Section>

        <Section title="Tiến độ theo lớp" hint="Số học sinh đang hoạt động và đã xong từng khảo sát, theo từng lớp.">
          {byClass.length === 0 ? (
            <p className="m-0 py-10 text-center text-ink-soft">Chưa có lớp nào.</p>
          ) : (
            <GroupedColumns
              data={byClass}
              ariaLabel="Tiến độ theo lớp"
              series={[
                { key: 'active', label: 'Đang hoạt động', color: CHART_COLORS[0] },
                { key: 'pre', label: 'Xong đầu vào', color: CHART_COLORS[1] },
                { key: 'post', label: 'Xong sau', color: CHART_COLORS[2] },
                { key: 'delayed', label: 'Xong theo dõi', color: CHART_COLORS[3] },
              ]}
            />
          )}
        </Section>
      </div>

      <Section
        title="Tỷ lệ đúng theo nhóm chủ đề"
        hint="M1: sân chơi tình huống · M2: thám tử tên miền · M3: phòng thí nghiệm tài khoản."
        actions={<Button size="sm" variant="ghost" onClick={() => onNavigate('analytics')}>Xem số liệu chi tiết</Button>}
      >
        <GroupedColumns
          data={topics}
          ariaLabel="Tỷ lệ trả lời đúng theo chủ đề và giai đoạn"
          unit="%"
          max={100}
          series={[
            { key: 'pre', label: PHASE_SHORT.pre, color: CHART_COLORS[0] },
            { key: 'post', label: PHASE_SHORT.post, color: CHART_COLORS[2] },
            { key: 'delayed', label: PHASE_SHORT.delayed, color: CHART_COLORS[3] },
          ]}
        />
        {hiddenTopicCells > 0 && (
          <p className="mt-2 mb-0 text-xs text-ink-soft">{hiddenTopicCells} ô chưa đủ {analytics.min_cell} học sinh nên không vẽ cột.</p>
        )}
      </Section>

      <Card className="p-5">
        <p className="m-0 text-sm text-ink-soft">
          Chỉ số trên là số tổng hợp mô tả, chưa phải kiểm định thống kê. {analytics.note}
        </p>
      </Card>
    </div>
  );
}
