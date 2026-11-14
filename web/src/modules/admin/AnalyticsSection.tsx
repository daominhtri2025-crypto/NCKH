import { Alert, Badge, PageTitle } from '../../components/ui';
import { type AnalyticsOverview, PHASE_LABEL, cellValue, pct, sumClasses } from './types';
import { DataTable, Section, td, th } from './parts';

function hiddenOr(value: string | number | null | undefined, n?: number): string {
  if (value === null || value === undefined) return n === undefined ? 'ẩn' : `ẩn (n=${n})`;
  return n === undefined ? String(value) : `${value} (n=${n})`;
}

/** Số liệu đo lường chi tiết dạng bảng. Chỉ hiển thị số tổng hợp, không có mã thẻ hay câu trả lời riêng lẻ. */
export default function AnalyticsSection({ analytics, error }: { analytics: AnalyticsOverview | null; error: string | null }) {
  if (error && !analytics) return <Alert>{error}</Alert>;
  if (!analytics) return <p className="py-16 text-center text-ink-soft">Đang tải số liệu…</p>;

  const total = sumClasses(analytics.classes);
  const cell = (c: { correct_pct: number | null; n: number }) => (c.correct_pct === null ? hiddenOr(null, c.n) : `${c.correct_pct}% (n=${c.n})`);

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle
        title="Số liệu đo lường"
        subtitle={`Tổng số học sinh đang hoạt động: ${analytics.n_active}. Khảo sát theo dõi chỉ mở sau 28 ngày kể từ khi xong khảo sát sau can thiệp.`}
      />

      <Section title="Tiến độ theo lớp" padded={false}>
        <DataTable
          head={
            <>
              <th className={th}>Lớp</th>
              <th className={th}>Đã phát thẻ</th>
              <th className={th}>Đang hoạt động</th>
              <th className={th}>Xong đầu vào</th>
              <th className={th}>Xong sau can thiệp</th>
              <th className={th}>Xong theo dõi</th>
            </>
          }
        >
          {analytics.classes.map((c) => (
            <tr key={c.class_code}>
              <td className={`${td} font-bold`}>{c.class_code}</td>
              <td className={td}>{c.issued}</td>
              <td className={td}>{c.active}</td>
              <td className={td}>{c.pre_done} <span className="text-ink-soft">({pct(c.pre_done, c.active)}%)</span></td>
              <td className={td}>{c.post_done} <span className="text-ink-soft">({pct(c.post_done, c.active)}%)</span></td>
              <td className={td}>{c.delayed_done} <span className="text-ink-soft">({pct(c.delayed_done, c.active)}%)</span></td>
            </tr>
          ))}
          <tr className="bg-canvas font-extrabold">
            <td className={td}>Toàn bộ</td>
            <td className={td}>{total.issued}</td>
            <td className={td}>{total.active}</td>
            <td className={td}>{total.pre_done}</td>
            <td className={td}>{total.post_done}</td>
            <td className={td}>{total.delayed_done}</td>
          </tr>
        </DataTable>
      </Section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section title="So sánh trước và sau can thiệp" hint="Điểm kiến thức (đơn vị: điểm phần trăm) trên các cặp học sinh làm cả hai giai đoạn." padded={false}>
          <DataTable
            minWidth={460}
            head={
              <>
                <th className={th}>So sánh</th>
                <th className={th}>Số cặp</th>
                <th className={th}>Chênh lệch TB</th>
                <th className={th}>Trung vị</th>
              </>
            }
          >
            {(
              [
                ['Đầu vào → sau can thiệp', analytics.paired.pre_post],
                ['Đầu vào → theo dõi', analytics.paired.pre_delayed],
              ] as const
            ).map(([label, p]) => (
              <tr key={label}>
                <td className={td}>{label}</td>
                <td className={td}>{p.n}</td>
                <td className={td}>{hiddenOr(cellValue(p.mean_difference))}</td>
                <td className={td}>{p.mean_difference.suppressed ? 'ẩn' : p.mean_difference.median}</td>
              </tr>
            ))}
          </DataTable>
          <p className="m-0 px-5 py-3 text-xs text-ink-soft">Đây là mô tả, chưa phải kiểm định thống kê. Kiểm định Wilcoxon và Friedman thực hiện theo kế hoạch phân tích của báo cáo.</p>
        </Section>

        <Section title="Hành vi tự báo cáo" hint="Thang 1–4, đã điều chỉnh câu đảo chiều." padded={false}>
          <DataTable
            minWidth={440}
            head={
              <>
                <th className={th}>Giai đoạn</th>
                <th className={th}>Số học sinh</th>
                <th className={th}>Trung bình</th>
                <th className={th}>Độ lệch chuẩn</th>
              </>
            }
          >
            {(['pre', 'post', 'delayed'] as const).map((p) => {
              const c = analytics.phases[p].behavior_mean;
              return (
                <tr key={p}>
                  <td className={td}>{PHASE_LABEL[p]}</td>
                  <td className={td}>{c.n}</td>
                  <td className={td}>{c.suppressed ? <Badge tone="warn">ẩn</Badge> : c.mean?.toFixed(2)}</td>
                  <td className={td}>{c.suppressed ? <Badge tone="warn">ẩn</Badge> : c.sd?.toFixed(2)}</td>
                </tr>
              );
            })}
          </DataTable>
        </Section>
      </div>

      <Section
        title="Kiến thức theo nhóm chủ đề"
        hint="M1: sân chơi tình huống · M2: thám tử tên miền · M3: phòng thí nghiệm tài khoản. Tỷ lệ đúng tính trên toàn bộ câu trả lời của nhóm."
        padded={false}
      >
        <DataTable
          minWidth={520}
          head={
            <>
              <th className={th}>Chủ đề</th>
              <th className={th}>Đầu vào</th>
              <th className={th}>Sau can thiệp</th>
              <th className={th}>Theo dõi</th>
            </>
          }
        >
          {analytics.topics.map((t) => (
            <tr key={t.topic}>
              <td className={`${td} font-bold`}>{t.topic.toUpperCase()}</td>
              <td className={td}>{cell(t.pre)}</td>
              <td className={td}>{cell(t.post)}</td>
              <td className={td}>{cell(t.delayed)}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
    </div>
  );
}
