import { FormEvent, useState } from 'react';
import { api, ApiError } from '../../lib/api';

interface Props {
  onLoggedIn: () => void;
  onBack: () => void;
}

/** Đăng nhập giáo viên. Tài khoản do nhóm kỹ thuật cấp. */
export default function TeacherLogin({ onLoggedIn, onBack }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/teacher/session', { username: username.trim(), password });
      onLoggedIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <button className="link-btn" onClick={onBack}>← Quay lại</button>
      <h2>Giáo viên đăng nhập</h2>
      <p className="lead">Tài khoản do nhóm nghiên cứu cấp. Chỉ xem được tiến độ của lớp được gán.</p>
      <form onSubmit={submit} className="stack">
        <label className="field">
          <span>Tên đăng nhập</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </label>
        <label className="field">
          <span>Mật khẩu</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-xl" type="submit" disabled={submitting || !username || !password}>
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </button>
      </form>
    </section>
  );
}
