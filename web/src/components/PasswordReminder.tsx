import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import Modal from './Modal';

interface Props {
  onChanged: () => void;
}

/** Nhắc đổi mật khẩu tạm / mặc định. Không chặn thao tác; người dùng có thể đổi ngay hoặc đổi sau. */
export default function PasswordReminder({ onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setBusy(true);
    try {
      await api.post('/teacher/password', { current, new: next });
      setOpen(false);
      setCurrent('');
      setNext('');
      setConfirm('');
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không đổi được mật khẩu.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="reminder" role="status">
        <p>Tài khoản đang dùng mật khẩu mặc định hoặc mật khẩu tạm. Hãy đổi mật khẩu để bảo vệ tài khoản.</p>
        <button className="btn btn-primary small-btn" onClick={() => setOpen(true)}>Đổi mật khẩu</button>
      </div>
      {open && (
        <Modal title="Đổi mật khẩu" confirmLabel="Lưu mật khẩu mới" busy={busy} onConfirm={() => submit()} onCancel={() => setOpen(false)}>
          <form className="stack" onSubmit={submit}>
            <label className="field">
              <span>Mật khẩu hiện tại</span>
              <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
            </label>
            <label className="field">
              <span>Mật khẩu mới (10 ký tự trở lên, có cả chữ và số)</span>
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
            </label>
            <label className="field">
              <span>Nhập lại mật khẩu mới</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </label>
            {error && <p className="alert" role="alert">{error}</p>}
          </form>
        </Modal>
      )}
    </>
  );
}
