import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';

interface Student {
  code: string;
  status: 'issued' | 'active';
  claimed_at: string | null;
  last_seen_at: string | null;
  phases: { pre: number; post: number; delayed: number };
  modules: { m1: number; m2: number; m3_steps: number; lab: boolean };
}

interface Roster {
  class_code: string;
  totals: { students: number; active: number; items_per_phase: number; m1: number; m2: number; m3_steps: number };
  students: Student[];
}

interface Props {
  onLogout: () => void;
}

function bar(n: number, total: number) {
  const pct = total > 0 ? Math.round((n / total) * 100) : 0;
  return (
    <div className="mini-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={n}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Tiến độ lớp. Chỉ hiển thị số lượng và trạng thái; không có câu trả lời của học sinh. */
export default function TeacherDashboard({ onLogout }: Props) {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardCount, setCardCount] = useState(1);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [reissued, setReissued] = useState<{ old: string; next: string } | null>(null);

  async function reissue(code: string) {
    const ok = window.confirm(
      `Cấp thẻ mới cho học sinh có mã ${code}?\n\nMã cũ sẽ không còn dùng được. Tiến độ của học sinh được giữ nguyên.\nĐối chiếu với sổ phát thẻ trước khi xác nhận.`
    );
    if (!ok) return;
    try {
      const data = await api.post<{ new_code: string }>(`/teacher/students/${encodeURIComponent(code)}/reissue`, {});
      setReissued({ old: code, next: data.new_code });
      setRoster(null);
      api.get<Roster>('/teacher/roster').then(setRoster);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không cấp lại được thẻ.');
    }
  }

  async function createCards(event: FormEvent) {
    event.preventDefault();
    setCardError(null);
    setCreating(true);
    try {
      const data = await api.post<{ codes: string[] }>('/teacher/cards', { count: cardCount });
      setNewCodes(data.codes);
    } catch (err) {
      setCardError(err instanceof ApiError ? err.message : 'Không tạo được thẻ.');
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    api
      .get<Roster>('/teacher/roster')
      .then(setRoster)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          onLogout();
          return;
        }
        setError(err instanceof ApiError ? err.message : 'Không tải được danh sách.');
      });
  }, [onLogout]);

  async function logout() {
    try {
      await api.logoutTeacher();
    } finally {
      onLogout();
    }
  }

  if (error) {
    return <section className="card"><p className="alert" role="alert">{error}</p></section>;
  }
  if (!roster) {
    return <p className="center muted">Đang tải tiến độ lớp…</p>;
  }

  const t = roster.totals;
  return (
    <section>
      <div className="round-head">
        <h2>Lớp {roster.class_code}</h2>
        <button className="link-btn" onClick={logout}>Đăng xuất</button>
      </div>
      <p className="small muted">
        Đã cấp {t.students} thẻ · đã kích hoạt {t.active}. Trang này chỉ hiển thị tiến độ, không hiển thị nội dung câu trả lời.
      </p>

      <section className="card card-new-cards" aria-labelledby="new-cards-title">
        <h3 id="new-cards-title">Tạo thẻ mới</h3>
        <p className="small muted">
          Dùng cho học sinh mới tham gia lớp, hoặc học sinh quên mã. Thẻ mới không kế thừa tiến độ cũ.
          Mỗi lần tạo tối đa 20 thẻ. Thẻ được ghi nhận là do tài khoản của em tạo.
        </p>
        <form onSubmit={createCards} className="stack-row">
          <label className="field">
            <span>Số thẻ</span>
            <input type="number" min={1} max={20} value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))} required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={creating}>
            {creating ? 'Đang tạo…' : 'Tạo thẻ'}
          </button>
        </form>
        {cardError && <p className="alert" role="alert">{cardError}</p>}
        {reissued && (
          <div className="new-codes">
            <p><strong>Đã cấp thẻ mới.</strong> Thẻ cũ {reissued.old} không còn dùng được. Mã mới để in và phát:</p>
            <p><code className="code-chip">{reissued.next}</code></p>
          </div>
        )}
        {newCodes && (
          <div className="new-codes">
            <p><strong>Mã thẻ mới (in và phát cho học sinh):</strong></p>
            <ul className="code-list">
              {newCodes.map((c) => <li key={c}><code>{c}</code></li>)}
            </ul>
            <button className="btn" onClick={() => window.print()}>In danh sách</button>
          </div>
        )}
      </section>

      <ul className="student-list">
        {roster.students.map((s) => (
          <li key={s.code} className="card student-card">
            <div className="student-head">
              <code className="code-chip">{s.code}</code>
              <span className={`status ${s.status === 'active' ? 'status-answered' : 'status-new'}`}>
                {s.status === 'active' ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
              </span>
            </div>
            {s.status === 'active' && (
              <>
                <button className="btn btn-ghost small-btn" onClick={() => reissue(s.code)}>Cấp thẻ mới (học sinh làm mất thẻ)</button>
                <div className="metric"><span>Khảo sát đầu vào</span><strong>{s.phases.pre}/{t.items_per_phase}</strong>{bar(s.phases.pre, t.items_per_phase)}</div>
                <div className="metric"><span>Sân chơi tình huống</span><strong>{s.modules.m1}/{t.m1}</strong>{bar(s.modules.m1, t.m1)}</div>
                <div className="metric"><span>Thám tử tên miền</span><strong>{s.modules.m2}/{t.m2}</strong>{bar(s.modules.m2, t.m2)}</div>
                <div className="metric"><span>Phòng thí nghiệm (checklist)</span><strong>{s.modules.m3_steps}/{t.m3_steps}{s.modules.lab ? ' · đạt' : ''}</strong>{bar(s.modules.m3_steps, t.m3_steps)}</div>
                <div className="metric"><span>Hậu kiểm / Theo dõi</span><strong>{s.phases.post}/{t.items_per_phase} · {s.phases.delayed}/{t.items_per_phase}</strong></div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
