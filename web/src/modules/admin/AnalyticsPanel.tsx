import { useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import BarChart, { Bar } from '../../components/BarChart';

interface Cell { n: number; suppressed: boolean; mean?: number; sd?: number; median?: number }
interface ClassRow { class_code: string; issued: number; active: number; pre_done: number; post_done: number; delayed_done: number }
interface PhaseSummary { n: number; knowledge_pct_mean: Cell; behavior_mean: Cell }
interface Paired { n: number; mean_difference: Cell }
interface TopicRow { topic: string; pre: { n: number; correct_pct: number | null }; post: { n: number; correct_pct: number | null }; delayed: { n: number; correct_pct: number | null } }
interface Overview {
  n_active: number;
  min_cell: number;
  classes: ClassRow[];
  phases: Record<'pre' | 'post' | 'delayed', PhaseSummary>;
  paired: { pre_post: Paired; pre_delayed: Paired };
  topics: TopicRow[];
  note: string;
}

const PHASE_LABEL = { pre: 'Đầu vào (trước can thiệp)', post: 'Sau can thiệp', delayed: 'Theo dõi (sau 28 ngày)' } as const;

function cellValue(c: Cell | undefined, digits = 1): number | null {
  return c && !c.suppressed && c.mean !== undefined ? Number(c.mean.toFixed(digits)) : null;
}

/** Bảng điều khiển số liệu đo lường cho quản trị viên. Chỉ hiển thị số tổng hợp. */
export default function AnalyticsPanel() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Overview>('/admin/analytics')
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Không tải được số liệu.'));
  }, []);

  if (error) return <section className="card"><p className="alert" role="alert">{error}</p></section>;
  if (!data) return <section className="card"><p>Đang tải số liệu…</p></section>;

  const knowledgeBars: Bar[] = (['pre', 'post', 'delayed'] as const).map((p) => ({
    label: PHASE_LABEL[p],
    value: cellValue(data.phases[p].knowledge_pct_mean),
    n: data.phases[p].n,
  }));

  return (
    <section className="analytics">
      <section className="card">
        <h3>Tải dữ liệu nghiên cứu</h3>
        <p className="fineprint">Tệp CSV gồm học sinh đang hoạt động, đã ẩn danh bằng mã ngẫu nhiên. Không có họ tên.</p>
        <div className="row-actions">
          <a className="btn btn-primary small-btn" href="/api/admin/data/export/long" download>Tải CSV dạng long (một dòng mỗi câu trả lời)</a>
          <a className="btn btn-ghost small-btn" href="/api/admin/data/export/wide" download>Tải CSV dạng wide (một dòng mỗi học sinh)</a>
        </div>
      </section>

      <section className="card">
        <h3>Tiến độ theo lớp</h3>
        <p className="fineprint">Tổng số học sinh đang hoạt động: {data.n_active}. Giai đoạn theo dõi chỉ mở sau 28 ngày kể từ khi hoàn thành khảo sát sau can thiệp.</p>
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Lớp</th><th>Đã phát thẻ</th><th>Đang hoạt động</th><th>Xong đầu vào</th><th>Xong sau can thiệp</th><th>Xong theo dõi</th></tr>
            </thead>
            <tbody>
              {data.classes.map((c) => (
                <tr key={c.class_code}>
                  <td data-label="Lớp">{c.class_code}</td>
                  <td data-label="Đã phát thẻ">{c.issued}</td>
                  <td data-label="Đang hoạt động">{c.active}</td>
                  <td data-label="Xong đầu vào">{c.pre_done}</td>
                  <td data-label="Xong sau can thiệp">{c.post_done}</td>
                  <td data-label="Xong theo dõi">{c.delayed_done}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Điểm kiến thức trung bình theo giai đoạn</h3>
        <p className="fineprint">Tỉ lệ câu trả lời đúng trong 10 câu kiến thức, tính trên học sinh đã làm xong giai đoạn đó. Ô có ít hơn {data.min_cell} học sinh bị ẩn.</p>
        <BarChart bars={knowledgeBars} max={100} ariaLabel="Điểm kiến thức trung bình theo giai đoạn" />
      </section>

      <section className="card">
        <h3>So sánh trước và sau can thiệp</h3>
        <table className="admin-table">
          <thead><tr><th>So sánh</th><th>Số học sinh cặp</th><th>Chênh lệch trung bình (điểm %)</th><th>Trung vị chênh lệch</th></tr></thead>
          <tbody>
            <tr>
              <td data-label="So sánh">Đầu vào → sau can thiệp</td>
              <td data-label="Số học sinh cặp">{data.paired.pre_post.n}</td>
              <td data-label="Chênh lệch trung bình">{cellValue(data.paired.pre_post.mean_difference) ?? 'ẩn'}</td>
              <td data-label="Trung vị chênh lệch">{data.paired.pre_post.mean_difference.suppressed ? 'ẩn' : data.paired.pre_post.mean_difference.median}</td>
            </tr>
            <tr>
              <td data-label="So sánh">Đầu vào → theo dõi</td>
              <td data-label="Số học sinh cặp">{data.paired.pre_delayed.n}</td>
              <td data-label="Chênh lệch trung bình">{cellValue(data.paired.pre_delayed.mean_difference) ?? 'ẩn'}</td>
              <td data-label="Trung vị chênh lệch">{data.paired.pre_delayed.mean_difference.suppressed ? 'ẩn' : data.paired.pre_delayed.mean_difference.median}</td>
            </tr>
          </tbody>
        </table>
        <p className="fineprint">Đây là mô tả, chưa phải kiểm định thống kê. Kiểm định Wilcoxon và Friedman được thực hiện theo kế hoạch phân tích của báo cáo.</p>
      </section>

      <section className="card">
        <h3>Hành vi tự báo cáo (thang 1–4, đã điều chỉnh câu đảo chiều)</h3>
        <table className="admin-table">
          <thead><tr><th>Giai đoạn</th><th>Số học sinh</th><th>Trung bình</th><th>Độ lệch chuẩn</th></tr></thead>
          <tbody>
            {(['pre', 'post', 'delayed'] as const).map((p) => {
              const c = data.phases[p].behavior_mean;
              return (
                <tr key={p}>
                  <td data-label="Giai đoạn">{PHASE_LABEL[p]}</td>
                  <td data-label="Số học sinh">{c.n}</td>
                  <td data-label="Trung bình">{c.suppressed ? 'ẩn' : c.mean?.toFixed(2)}</td>
                  <td data-label="Độ lệch chuẩn">{c.suppressed ? 'ẩn' : c.sd?.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Kiến thức theo nhóm chủ đề (m1, m2, m3)</h3>
        <p className="fineprint">m1: sân chơi tình huống. m2: thám tử tên miền. m3: phòng thí nghiệm tài khoản. Tỉ lệ đúng tính trên toàn bộ câu trả lời của nhóm.</p>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>Chủ đề</th><th>Đầu vào</th><th>Sau can thiệp</th><th>Theo dõi</th></tr></thead>
            <tbody>
              {data.topics.map((t) => (
                <tr key={t.topic}>
                  <td data-label="Chủ đề">{t.topic}</td>
                  <td data-label="Đầu vào">{t.pre.correct_pct === null ? `ẩn (n=${t.pre.n})` : `${t.pre.correct_pct}% (n=${t.pre.n})`}</td>
                  <td data-label="Sau can thiệp">{t.post.correct_pct === null ? `ẩn (n=${t.post.n})` : `${t.post.correct_pct}% (n=${t.post.n})`}</td>
                  <td data-label="Theo dõi">{t.delayed.correct_pct === null ? `ẩn (n=${t.delayed.n})` : `${t.delayed.correct_pct}% (n=${t.delayed.n})`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
