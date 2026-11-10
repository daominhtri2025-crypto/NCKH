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
  options?: string[];
  correct?: number;
  reverse?: boolean;
}

interface VersionInfo {
  version: string;
  created_at: string;
  active: boolean;
  items: number;
}

interface QuestionSet {
  version: string;
  title: string;
  behavior_scale: string[];
  items: Question[];
  versions: VersionInfo[];
  note: string;
}

interface QuestionForm {
  id: string;
  instrument: 'knowledge' | 'behavior';
  topic: string;
  question: string;
  options: string[];
  correct: number;
  reverse: boolean;
}

const EMPTY_FORM: QuestionForm = {
  id: '', instrument: 'knowledge', topic: 'm1', question: '', options: ['', '', '', ''], correct: 0, reverse: false,
};

type Tab = 'teachers' | 'questions';
type Pending =
  | { kind: 'reset'; username: string }
  | { kind: 'toggle'; username: string; disable: boolean }
  | { kind: 'delete'; item: Question };

type QuestionDialog = { mode: 'add' } | { mode: 'edit'; item: Question };

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
  const [dialog, setDialog] = useState<QuestionDialog | null>(null);
  const [qForm, setQForm] = useState<QuestionForm>(EMPTY_FORM);
  const [qError, setQError] = useState<string | null>(null);

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

  const loadQuestions = useCallback(async () => {
    try {
      setQuestions(await api.get<QuestionSet>('/admin/questions'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tải được câu hỏi.');
    }
  }, []);

  useEffect(() => {
    if (tab === 'questions' && questions === null) loadQuestions();
  }, [tab, questions, loadQuestions]);

  function openAdd() {
    setQError(null);
    setQForm(EMPTY_FORM);
    setDialog({ mode: 'add' });
  }

  function openEdit(item: Question) {
    setQError(null);
    setQForm({
      id: item.id,
      instrument: item.instrument,
      topic: item.topic,
      question: item.question,
      options: item.options ?? ['', '', '', ''],
      correct: item.correct ?? 0,
      reverse: item.reverse ?? false,
    });
    setDialog({ mode: 'edit', item });
  }

  /** Gửi biểu mẫu. Mọi kiểm tra cuối cùng nằm ở máy chủ; giao diện chỉ gửi đúng trường của loại câu. */
  async function saveQuestion() {
    setQError(null);
    const body: Record<string, unknown> = { topic: qForm.topic.trim(), question: qForm.question.trim() };
    if (dialog?.mode === 'add') {
      body.id = qForm.id.trim();
      body.instrument = qForm.instrument;
    }
    if (qForm.instrument === 'knowledge') {
      body.options = qForm.options.map((o) => o.trim()).filter((o) => o !== '');
      body.correct = qForm.correct;
    } else {
      body.reverse = qForm.reverse;
    }
    setBusy(true);
    try {
      if (dialog?.mode === 'add') {
        await api.post('/admin/questions', body);
      } else if (dialog?.mode === 'edit') {
        const { id: _ignored, instrument: _kind, ...patch } = body;
        await api.put(`/admin/questions/${encodeURIComponent(dialog.item.id)}`, patch);
      }
      setDialog(null);
      await loadQuestions();
    } catch (err) {
      setQError(err instanceof ApiError ? err.message : 'Không lưu được câu hỏi.');
    } finally {
      setBusy(false);
    }
  }

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
      if (pending.kind === 'delete') {
        await api.delete(`/admin/questions/${encodeURIComponent(pending.item.id)}`);
        setPending(null);
        await loadQuestions();
        return;
      }
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
          <div className="admin-head">
            <h3>{questions ? `${questions.title}` : 'Câu hỏi khảo sát'}</h3>
            <button className="btn btn-primary small-btn" onClick={openAdd} disabled={!questions || busy}>Thêm câu hỏi</button>
          </div>
          {questions && (
            <>
              <p className="fineprint">Phiên bản hiện hành: <code>{questions.version}</code>. {questions.note}</p>
              <p className="fineprint">Mỗi thay đổi tạo một phiên bản mới. Học sinh đã làm dở giữ phiên bản cũ, nên dữ liệu đã thu thập vẫn so sánh được.</p>
              {(['knowledge', 'behavior'] as const).map((kind) => {
                const rows = questions.items.filter((i) => i.instrument === kind);
                return (
                  <div key={kind} className="table-wrap">
                    <h4>{kind === 'knowledge' ? 'Kiến thức' : 'Hành vi'} ({rows.length} câu)</h4>
                    <table className="admin-table">
                      <thead>
                        <tr><th>Mã</th><th>Chủ đề</th><th>Nội dung</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {rows.map((i) => (
                          <tr key={i.id}>
                            <td data-label="Mã"><code>{i.id}</code></td>
                            <td data-label="Chủ đề">{i.topic}</td>
                            <td data-label="Nội dung">
                              {i.question}
                              {i.options && (
                                <ul className="question-options">
                                  {i.options.map((o, idx) => <li key={idx}>{o}{i.correct === idx ? ' ✓' : ''}</li>)}
                                </ul>
                              )}
                            </td>
                            <td data-label="Thao tác" className="row-actions">
                              <button className="btn btn-ghost small-btn" onClick={() => openEdit(i)} disabled={busy}>Sửa</button>
                              <button className="btn btn-danger small-btn" onClick={() => setPending({ kind: 'delete', item: i })} disabled={busy}>Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
              <details>
                <summary>Lịch sử phiên bản ({questions.versions.length})</summary>
                <ul>
                  {questions.versions.map((v) => (
                    <li key={v.version}>
                      <code>{v.version}</code> · {v.items} câu · {v.created_at}{v.active ? ' · hiện hành' : ''}
                    </li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </section>
      )}

      {dialog && (
        <Modal
          title={dialog.mode === 'add' ? 'Thêm câu hỏi' : `Sửa câu ${dialog.item.id}`}
          confirmLabel={dialog.mode === 'add' ? 'Thêm' : 'Lưu thay đổi'}
          busy={busy}
          onConfirm={saveQuestion}
          onCancel={() => setDialog(null)}
        >
          <form className="stack" onSubmit={(e) => { e.preventDefault(); saveQuestion(); }}>
            {dialog.mode === 'add' ? (
              <>
                <label className="field">
                  <span>Mã câu (chữ thường, số, gạch ngang)</span>
                  <input value={qForm.id} onChange={(e) => setQForm({ ...qForm, id: e.target.value })} required maxLength={60} />
                </label>
                <label className="field">
                  <span>Loại câu</span>
                  <select value={qForm.instrument} onChange={(e) => setQForm({ ...qForm, instrument: e.target.value as 'knowledge' | 'behavior' })}>
                    <option value="knowledge">Kiến thức (có đáp án đúng)</option>
                    <option value="behavior">Hành vi (thang 1-4)</option>
                  </select>
                </label>
              </>
            ) : (
              <p className="fineprint">Mã và loại câu không đổi được sau khi tạo.</p>
            )}
            <label className="field">
              <span>Chủ đề (m1, m2, m3 hoặc chủ đề khác)</span>
              <input value={qForm.topic} onChange={(e) => setQForm({ ...qForm, topic: e.target.value })} required maxLength={20} />
            </label>
            <label className="field">
              <span>Nội dung câu hỏi</span>
              <textarea value={qForm.question} onChange={(e) => setQForm({ ...qForm, question: e.target.value })} required maxLength={400} rows={3} />
            </label>
            {qForm.instrument === 'knowledge' ? (
              <fieldset className="field">
                <legend>Lựa chọn (2 đến 4, đánh dấu đáp án đúng)</legend>
                {qForm.options.map((o, idx) => (
                  <label key={idx} className="check-row">
                    <input type="radio" name="correct" checked={qForm.correct === idx} onChange={() => setQForm({ ...qForm, correct: idx })} />
                    <input
                      aria-label={`Lựa chọn ${idx + 1}`}
                      value={o}
                      maxLength={200}
                      onChange={(e) => {
                        const next = [...qForm.options];
                        next[idx] = e.target.value;
                        setQForm({ ...qForm, options: next });
                      }}
                    />
                  </label>
                ))}
              </fieldset>
            ) : (
              <label className="check-row">
                <input type="checkbox" checked={qForm.reverse} onChange={(e) => setQForm({ ...qForm, reverse: e.target.checked })} />
                <span>Câu đảo chiều (điểm được tính 5 trừ mức trả lời)</span>
              </label>
            )}
            {qError && <p className="alert" role="alert">{qError}</p>}
          </form>
        </Modal>
      )}

      {pending?.kind === 'delete' && (
        <Modal
          title="Xóa câu hỏi?"
          confirmLabel="Xóa"
          danger
          busy={busy}
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        >
          <p>Câu <code>{pending.item.id}</code> sẽ bị bỏ khỏi phiên bản hiện hành. Các phiên bản cũ và dữ liệu đã thu thập vẫn được giữ.</p>
        </Modal>
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
