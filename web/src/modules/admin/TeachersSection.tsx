import { FormEvent, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import Modal from '../../components/Modal';
import { Alert, Badge, Button, Card, Field, PageTitle, TextInput, inputClass } from '../../components/ui';
import type { AdminTeacher } from './types';
import { DataTable, Section, td, th } from './parts';

interface Props {
  teachers: AdminTeacher[] | null;
  onChanged: () => Promise<void>;
}

type Pending = { kind: 'reset'; username: string } | { kind: 'toggle'; username: string; disable: boolean };

function shortDate(iso: string | null): string {
  if (!iso) return 'Chưa đăng nhập';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
}

/** Quản lý tài khoản giáo viên và quản trị viên. Mọi thao tác được máy chủ kiểm tra lại quyền. */
export default function TeachersSection({ teachers, onChanged }: Props) {
  const [form, setForm] = useState({ username: '', class_code: '', role: 'teacher' as 'teacher' | 'admin' });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ username: string; password: string; created: boolean } | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);

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
      await onChanged();
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
          `/admin/teachers/${encodeURIComponent(pending.username)}/password`, {},
        );
        setNotice({ username: data.username, password: data.password, created: false });
      } else {
        await api.put(`/admin/teachers/${encodeURIComponent(pending.username)}/status`, { disabled: pending.disable });
      }
      setPending(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Thao tác không thành công.');
      setPending(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle title="Tài khoản giáo viên" subtitle="Tạo tài khoản, cấp lại mật khẩu và khóa hoặc mở khóa quyền truy cập." />

      {error && <Alert>{error}</Alert>}

      {notice && (
        <Card className="grid grid-cols-1 gap-3 border-ok/30 bg-ok-bg p-5" role="status">
          <p className="m-0 text-sm text-ok">
            <strong>{notice.created ? 'Đã tạo tài khoản' : 'Đã đặt mật khẩu mới'} cho </strong>
            <code className="font-mono font-bold">{notice.username}</code>. Mật khẩu chỉ hiện một lần, hãy trao cho người dùng qua kênh trực tiếp:
          </p>
          <p className="m-0">
            <code className="inline-block rounded-lg bg-surface px-3 py-2 font-mono text-lg font-extrabold tracking-wider text-ink select-all">{notice.password}</code>
          </p>
          <div><Button size="sm" onClick={() => setNotice(null)}>Đã ghi lại</Button></div>
        </Card>
      )}

      <Section title="Thêm tài khoản">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end" onSubmit={createAccount}>
          <Field label="Tên đăng nhập" hint="Chữ thường, số, gạch dưới.">
            <TextInput value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required maxLength={40} />
          </Field>
          <Field label="Vai trò">
            <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'teacher' | 'admin' })}>
              <option value="teacher">Giáo viên (gắn lớp)</option>
              <option value="admin">Quản trị viên (không gắn lớp)</option>
            </select>
          </Field>
          {form.role === 'teacher' ? (
            <Field label="Mã lớp" hint="Lớp phải đã được tạo.">
              <TextInput value={form.class_code} onChange={(e) => setForm({ ...form, class_code: e.target.value })} required maxLength={40} />
            </Field>
          ) : (
            <div className="hidden md:block" />
          )}
          <Button type="submit" variant="primary" icon="plus" disabled={busy}>Tạo tài khoản</Button>
        </form>
      </Section>

      <Section title="Danh sách tài khoản" hint={teachers ? `${teachers.length} tài khoản` : undefined} padded={false}>
        {teachers === null ? (
          <p className="m-0 p-8 text-center text-ink-soft">Đang tải…</p>
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                head={
                  <>
                    <th className={th}>Tên đăng nhập</th>
                    <th className={th}>Vai trò</th>
                    <th className={th}>Lớp</th>
                    <th className={th}>Đăng nhập gần nhất</th>
                    <th className={th}>Trạng thái</th>
                    <th className={`${th} text-right`}>Thao tác</th>
                  </>
                }
              >
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td className={td}><code className="font-mono font-bold">{t.username}</code></td>
                    <td className={td}>{t.role === 'admin' ? <Badge tone="brand">Quản trị</Badge> : <Badge>Giáo viên</Badge>}</td>
                    <td className={td}>{t.class_code ?? '—'}</td>
                    <td className={`${td} text-ink-soft`}>{shortDate(t.last_login_at)}</td>
                    <td className={td}>{t.active ? <Badge tone="ok">Đang hoạt động</Badge> : <Badge tone="danger">Đã khóa</Badge>}</td>
                    <td className={td}>
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="secondary" icon="key" disabled={busy} onClick={() => setPending({ kind: 'reset', username: t.username })}>Cấp mật khẩu mới</Button>
                        <Button size="sm" variant={t.active ? 'danger' : 'primary'} icon={t.active ? 'lock' : 'check'} disabled={busy} onClick={() => setPending({ kind: 'toggle', username: t.username, disable: t.active })}>
                          {t.active ? 'Khóa' : 'Mở khóa'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </div>

            <ul className="m-0 grid grid-cols-1 list-none gap-3 p-4 md:hidden">
              {teachers.map((t) => (
                <li key={t.id} className="grid grid-cols-1 gap-3 rounded-2xl border border-line p-4">
                  <div className="flex items-center justify-between gap-2">
                    <code className="font-mono font-bold">{t.username}</code>
                    {t.active ? <Badge tone="ok">Đang hoạt động</Badge> : <Badge tone="danger">Đã khóa</Badge>}
                  </div>
                  <p className="m-0 text-sm text-ink-soft">
                    {t.role === 'admin' ? 'Quản trị viên' : `Giáo viên · Lớp ${t.class_code ?? '—'}`} · {shortDate(t.last_login_at)}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary" icon="key" disabled={busy} onClick={() => setPending({ kind: 'reset', username: t.username })}>Mật khẩu mới</Button>
                    <Button size="sm" variant={t.active ? 'danger' : 'primary'} disabled={busy} onClick={() => setPending({ kind: 'toggle', username: t.username, disable: t.active })}>
                      {t.active ? 'Khóa' : 'Mở khóa'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {pending?.kind === 'reset' && (
        <Modal title="Cấp mật khẩu mới?" confirmLabel="Cấp mật khẩu mới" busy={busy} onConfirm={confirmPending} onCancel={() => setPending(null)}>
          <p className="m-0">Mật khẩu của <code className="font-mono font-bold">{pending.username}</code> sẽ được thay bằng mật khẩu mới và mọi phiên đang mở bị đăng xuất.</p>
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
          <p className="m-0">
            {pending.disable
              ? <>Tài khoản <code className="font-mono font-bold">{pending.username}</code> sẽ không đăng nhập được cho đến khi được mở khóa. Dữ liệu được giữ nguyên.</>
              : <>Tài khoản <code className="font-mono font-bold">{pending.username}</code> sẽ đăng nhập lại được.</>}
          </p>
        </Modal>
      )}
    </div>
  );
}
