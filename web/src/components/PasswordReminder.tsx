import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import Icon from './icons';
import Modal from './Modal';
import { Alert, Button, Field, TextInput } from './ui';

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
      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warn/30 bg-warn-bg px-4 py-3 no-print">
        <p className="m-0 flex items-start gap-2 text-sm font-semibold text-warn">
          <Icon name="key" size={18} className="mt-0.5 shrink-0" />
          Tài khoản đang dùng mật khẩu mặc định hoặc mật khẩu tạm. Hãy đổi mật khẩu để bảo vệ tài khoản.
        </p>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>Đổi mật khẩu</Button>
      </div>
      {open && (
        <Modal title="Đổi mật khẩu" confirmLabel="Lưu mật khẩu mới" busy={busy} onConfirm={() => submit()} onCancel={() => setOpen(false)}>
          <form className="grid grid-cols-1 gap-3" onSubmit={submit}>
            <Field label="Mật khẩu hiện tại">
              <TextInput type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
            </Field>
            <Field label="Mật khẩu mới" hint="10 ký tự trở lên, có cả chữ và số.">
              <TextInput type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
            </Field>
            <Field label="Nhập lại mật khẩu mới">
              <TextInput type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </Field>
            {error && <Alert>{error}</Alert>}
          </form>
        </Modal>
      )}
    </>
  );
}
