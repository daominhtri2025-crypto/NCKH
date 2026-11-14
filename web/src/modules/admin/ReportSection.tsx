import { useState } from 'react';
import PrintOverlay from '../../components/PrintOverlay';
import { Alert, Button, Card, PageTitle } from '../../components/ui';
import Icon from '../../components/icons';
import { type AdminTeacher, type AnalyticsOverview, PHASE_LABEL, cellValue, pct, sumClasses } from './types';

interface Props {
  analytics: AnalyticsOverview | null;
  teachers: AdminTeacher[] | null;
  error: string | null;
}

const cellCls = 'border border-slate-300 px-2.5 py-1.5 text-left align-top text-[10.5pt]';
const headCls = `${cellCls} bg-slate-100 font-bold`;

/** Báo cáo tổng hợp để in hoặc lưu PDF: chỉ số liệu tổng hợp, không có mã thẻ hay câu trả lời riêng lẻ. */
export default function ReportSection({ analytics, teachers, error }: Props) {
  const [open, setOpen] = useState(false);

  if (error && !analytics) return <Alert>{error}</Alert>;
  if (!analytics) return <p className="py-16 text-center text-ink-soft">Đang tải số liệu…</p>;

  const total = sumClasses(analytics.classes);
  const today = new Date().toLocaleDateString('vi-VN');
  const teacherCount = teachers ? teachers.filter((t) => t.role === 'teacher' && t.active).length : null;

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle title="Báo cáo tổng hợp" subtitle="Bản in khổ A4 gồm chỉ số chính, tiến độ theo lớp và điểm theo giai đoạn." />
      <Card className="flex flex-col items-start gap-4 p-6">
        <span className="grid grid-cols-1 size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Icon name="printer" size={24} />
        </span>
        <p className="m-0 text-ink-soft">
          Xem trước báo cáo trên màn hình rồi in, hoặc chọn <strong className="text-ink">“Lưu dưới dạng PDF”</strong> trong hộp thoại in của trình duyệt để lưu thành tệp.
          Báo cáo chỉ gồm số liệu tổng hợp, ô có ít hơn {analytics.min_cell} học sinh được ẩn.
        </p>
        <Button variant="primary" icon="fileText" onClick={() => setOpen(true)}>Xem trước và in báo cáo</Button>
      </Card>

      {open && (
        <PrintOverlay title="Báo cáo tổng hợp An Toàn Số Học Đường" hint={`Ngày lập: ${today}`} onClose={() => setOpen(false)}>
          <div className="text-slate-900">
            <h1 className="m-0 text-center text-[16pt] font-extrabold uppercase">Báo cáo tổng hợp số liệu</h1>
            <p className="m-0 mb-5 text-center text-[11pt] text-slate-600">Đề tài An Toàn Số Học Đường · Ngày lập: {today}</p>

            <h2 className="mt-4 mb-1.5 text-[12pt] font-extrabold">1. Chỉ số chính</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr><th className={headCls}>Thẻ đã phát</th><td className={cellCls}>{total.issued}</td><th className={headCls}>Đã kích hoạt</th><td className={cellCls}>{total.active} ({pct(total.active, total.issued)}%)</td></tr>
                <tr><th className={headCls}>Số lớp tham gia</th><td className={cellCls}>{analytics.classes.length}</td><th className={headCls}>Giáo viên đang hoạt động</th><td className={cellCls}>{teacherCount ?? '—'}</td></tr>
                <tr><th className={headCls}>Xong đầu vào</th><td className={cellCls}>{total.pre_done} ({pct(total.pre_done, total.active)}%)</td><th className={headCls}>Xong sau can thiệp</th><td className={cellCls}>{total.post_done} ({pct(total.post_done, total.active)}%)</td></tr>
                <tr><th className={headCls}>Xong theo dõi</th><td className={cellCls}>{total.delayed_done} ({pct(total.delayed_done, total.active)}%)</td><th className={headCls}>Học sinh đang hoạt động</th><td className={cellCls}>{analytics.n_active}</td></tr>
              </tbody>
            </table>

            <h2 className="mt-5 mb-1.5 text-[12pt] font-extrabold">2. Tiến độ theo lớp</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>{['Lớp', 'Đã phát thẻ', 'Đang hoạt động', 'Xong đầu vào', 'Xong sau can thiệp', 'Xong theo dõi'].map((h) => <th key={h} className={headCls}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {analytics.classes.map((c) => (
                  <tr key={c.class_code}>
                    <td className={cellCls}>{c.class_code}</td><td className={cellCls}>{c.issued}</td><td className={cellCls}>{c.active}</td>
                    <td className={cellCls}>{c.pre_done}</td><td className={cellCls}>{c.post_done}</td><td className={cellCls}>{c.delayed_done}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="mt-5 mb-1.5 text-[12pt] font-extrabold">3. Điểm theo giai đoạn</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>{['Giai đoạn', 'Số học sinh', 'Kiến thức đúng (TB, %)', 'Hành vi (TB, thang 1–4)'].map((h) => <th key={h} className={headCls}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {(['pre', 'post', 'delayed'] as const).map((p) => {
                  const ph = analytics.phases[p];
                  const k = cellValue(ph.knowledge_pct_mean);
                  const b = ph.behavior_mean;
                  return (
                    <tr key={p}>
                      <td className={cellCls}>{PHASE_LABEL[p]}</td>
                      <td className={cellCls}>{ph.n}</td>
                      <td className={cellCls}>{k === null ? 'ẩn' : k.toFixed(1)}</td>
                      <td className={cellCls}>{b.suppressed ? 'ẩn' : b.mean?.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h2 className="mt-5 mb-1.5 text-[12pt] font-extrabold">4. Tỷ lệ đúng theo nhóm chủ đề</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>{['Chủ đề', 'Đầu vào', 'Sau can thiệp', 'Theo dõi'].map((h) => <th key={h} className={headCls}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {analytics.topics.map((t) => (
                  <tr key={t.topic}>
                    <td className={cellCls}>{t.topic.toUpperCase()}</td>
                    {[t.pre, t.post, t.delayed].map((c, i) => (
                      <td key={i} className={cellCls}>{c.correct_pct === null ? `ẩn (n=${c.n})` : `${c.correct_pct}% (n=${c.n})`}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 mb-0 text-[10pt] text-slate-600">
              Ghi chú: số liệu mô tả, chưa phải kiểm định thống kê. Ô có ít hơn {analytics.min_cell} học sinh được ẩn để bảo vệ ẩn danh. {analytics.note}
            </p>
          </div>
        </PrintOverlay>
      )}
    </div>
  );
}
