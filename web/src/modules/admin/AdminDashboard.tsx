import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import Modal from '../../components/Modal';

interface Props {
  onLogout: () => void;
}

interface AdminTeacher {
  id: number;
  username: string;
  role: 'teacher' | 'admin';
  class_code: string | null;
  active: boolean;
  created_at: string;
  last_login_at: string | null;
}

interface Question {
  id: string;
  instrument: 'knowledge' | 'behavior';
  topic: string;
  question: string;
  options: string[] | null;
  correct: number | null;
}

interface QuestionSet {
  version: string;
  title: string;
  behavior_scale: string[];
  items: Question[];
  note: string;
}

type Tab = 'teachers' | 'questions';
type Pending =
  | { kind: 'reset'; username: string }
  | { kind: 'toggle'; username: string; disable: boolean };

/** Trang quản trị: chỉ tài khoản role = admin mới vào được. Máy chủ kiểm tra lại mọi thao tác. */
export default function AdminDashboard({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('teachers');
  const [teachers, setTeachers] = useState<AdminTeacher[] | null>(null);
  const [questions, setQuestions] = useState<QuestionSet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ username: string; password: string; created: boolean } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ username: '', class_code: '', role: 'teacher' as 'teacher' | 'admin' });

  const loadTeachers = useCallback(async () => {
    try {
      const data = await api.get<{ teachers: AdminTeacher[] }>('/admin/teachers');
      setTeachers(data.teachers);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onLogout();
      setError(err instanceof ApiError ? err.message : 'Không tải được danh sách giáo viên.');
    }
  }, [onLogout]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  useEffect(() => {
    if (tab !== 'questions' || questions) return;
    api.get<QuestionSet>('/admin/questions')
      .then(setQuestions)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Không tải được câu hỏi.'));
  }, [tab, questions]);

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const body: Record<string, string> = { username: form.username.trim(), role: form.role };
      if (form.role === 'teacher') body.class_code = form.class_code.trim().toUpperCase();
      const data = await api.post<{ username: string; password: string }>('/admin/teachers', body);
      setNotice({ username: data.username, password: data.password, created: true });
      setForm({ username: '', class_code: '', role: 'teacher' });
      await loadTeachers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tạo được tài khoản.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmPending() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      if (pending.kind === 'reset') {
        const data = await api.put<{ username: string; password: string }>(
          `/admin/teachers/${encodeURIComponent(pending.username)}/password`, {}
        );
        setNotice({ username: data.username, password: data.password, created: false });
      } else {
        await api.put(`/admin/teachers/${encodeURIComponent(pending.username)}/status`, { disabled: pending.disable });
      }
      setPending(null);
      await loadTeachers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Thao tác không thành công.');
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await api.logoutTeacher();
    } finally {
      onLogout();
    }
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-head">
        <h2>Quản trị hệ thống</h2>
        <button className="btn btn-ghost small-btn" onClick={logout}>Đăng xuất</button>
      </header>

      <nav className="tabs" role="tablist" aria-label="Chức năng quản trị">
        <button role="tab" aria-selected={tab === 'teachers'} className={`tab ${tab === 'teachers' ? 'active' : ''}`} onClick={() => setTab('teachers')}>
          Giáo viên
        </button>
        <button role="tab" aria-selected={tab === 'questions'} className={`tab ${tab === 'questions' ? 'active' : ''}`} onClick={() => setTab('questions')}>
          Câu hỏi khảo sát
        </button>
      </nav>

      {error && <p className="alert" role="alert">{error}</p>}

      {notice && (
        <div className="new-codes" role="status">
          <p>
            <strong>{notice.created ? 'Đã tạo tài khoản' : 'Đã đặt mật khẩu mới'} cho </strong>
            <code>{notice.username}</code>. Mật khẩu chỉ hiện một lần, hãy trao cho người dùng qua kênh trực tiếp:
          </p>
          <p><code className="code-chip">{notice.password}</code></p>
          <button className="btn btn-ghost small-btn" onClick={() => setNotice(null)}>Đã ghi lại</button>
        </div>
      )}

      {tab === 'teachers' && (
        <>
          <section className="card">
            <h3>Thêm tài khoản</h3>
            <form className="stack" onSubmit={createAccount}>
              <label className="field">
                <span>Tên đăng nhập (chữ thường, số, gạch dưới)</span>
                <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required maxLength={40} />
              </label>
              <label className="field">
                <span>Vai trò</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'teacher' | 'admin' })}>
                  <option value="teacher">Giáo viên (gắn lớp)</option>
                  <option value="admin">Quản trị viên (không gắn lớp)</option>
                </select>
              </label>
              {form.role === 'teacher' && (
                <label className="field">
                  <span>Mã lớp (lớp phải đã được tạo)</span>
                  <input value={form.class_code} onChange={(e) => setForm({ ...form, class_code: e.target.value })} required maxLength={40} />
                </label>
              )}
              <button className="btn btn-primary" type="submit" disabled={busy}>Tạo tài khoản</button>
            </form>
          </section>

          <section className="card">
            <h3>Danh sách tài khoản</h3>
            {teachers === null ? <p>Đang tải…</p> : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Tên đăng nhập</th><th>Vai trò</th><th>Lớp</th><th>Trạng thái</th><th>Thao tác</th></tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id}>
                        <td data-label="Tên đăng nhập"><code>{t.username}</code></td>
                        <td data-label="Vai trò">{t.role === 'admin' ? 'Quản trị' : 'Giáo viên'}</td>
                        <td data-label="Lớp">{t.class_code ?? '—'}</td>
                        <td data-label="Trạng thái"><span className={`status ${t.active ? 'status-answered' : 'status-new'}`}>{t.active ? 'Đang hoạt động' : 'Đã khóa'}</span></td>
                        <td data-label="Thao tác" className="row-actions">
                          <button className="btn btn-ghost small-btn" onClick={() => setPending({ kind: 'reset', username: t.username })} disabled={busy}>
                            Cấp mật khẩu mới
                          </button>
                          <button
                            className={`btn ${t.active ? 'btn-danger' : 'btn-primary'} small-btn`}
                            onClick={() => setPending({ kind: 'toggle', username: t.username, disable: t.active })}
                            disabled={busy}
                          >
                            {t.active ? 'Khóa' : 'Mở khóa'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {tab === 'questions' && (
        <section className="card">
          <h3>{questions ? `${questions.title} (phiên bản ${questions.version})` : 'Câu hỏi khảo sát'}</h3>
          {questions && (
            <>
              <p className="fineprint">{questions.note}</p>
              <p className="fineprint">
                Hiện chỉ xem. Thêm, sửa, xóa câu hỏi cần cơ chế phiên bản để không làm sai lệch dữ liệu đã thu thập.
              </p>
              {(['knowledge', 'behavior'] as const).map((kind) => (
                <div key={kind}>
                  <h4>{kind === 'knowledge' ? 'Kiến thức' : 'Hành vi'} ({questions.items.filter((i) => i.instrument === kind).length} câu)</h4>
                  <ol className="question-list">
                    {questions.items.filter((i) => i.instrument === kind).map((i) => (
                      <li key={i.id}>
                        <p><code>{i.id}</code> · {i.topic} — {i.question}</p>
                        {i.options && (
                          <ul>{i.options.map((o, idx) => <li key={idx}>{o}{i.correct === idx ? ' ✓' : ''}</li>)}</ul>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </>
          )}
        </section>
      )}

      {pending?.kind === 'reset' && (
        <Modal
          title="Cấp mật khẩu mới?"
          confirmLabel="Cấp mật khẩu mới"
          busy={busy}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        >
          <p>Mật khẩu của <code>{pending.username}</code> sẽ được thay bằng mật khẩu mới và mọi phiên đang mở bị đăng xuất.</p>
        </Modal>
      )}

      {pending?.kind === 'toggle' && (
        <Modal
          title={pending.disable ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
          confirmLabel={pending.disable ? 'Khóa' : 'Mở khóa'}
          danger={pending.disable}
          busy={busy}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        >
          <p>
            {pending.disable
              ? <>Tài khoản <code>{pending.username}</code> sẽ không đăng nhập được cho đến khi được mở khóa. Dữ liệu được giữ nguyên.</>
              : <>Tài khoản <code>{pending.username}</code> sẽ đăng nhập lại được.</>}
          </p>
        </Modal>
      )}
    </section>
  );
}
