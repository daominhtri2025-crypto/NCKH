import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Participant } from '../lib/types';

interface Props {
  onLoggedIn: (participant: Participant) => void;
  onBack: () => void;
}

export default function LoginForm({ onLoggedIn, onBack }: Props) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post<{ participant: Participant }>('/session', { code });
      onLoggedIn(data.participant);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <button className="link-btn" onClick={onBack}>← Quay lại</button>
      <h2>Nhập mã học sinh</h2>
      <p className="lead">Mã có dạng XXXX-XXXX. Em đã ghi mã này khi tạo tài khoản.</p>

      <form onSubmit={submit} className="stack">
        <label className="field">
          <span>Mã học sinh</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            required
            maxLength={12}
          />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-xl" type="submit" disabled={submitting || !code.trim()}>
          {submitting ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
      </form>
    </section>
  );
}
