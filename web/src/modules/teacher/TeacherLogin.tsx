import { FormEvent, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import AuthLayout from '../../components/AuthLayout';
import { Alert, Button, Field, TextInput } from '../../components/ui';

interface Props {
  onLoggedIn: (role: 'teacher' | 'admin', mustChange: boolean) => void;
  onBack: () => void;
}

/** Đăng nhập giáo viên / quản trị viên. Tài khoản do nhóm kỹ thuật cấp. */
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
      const data = await api.post<{ teacher: { role: 'teacher' | 'admin'; must_change_password: boolean } }>(
        '/teacher/session', { username: username.trim(), password }
      );
      onLoggedIn(data.teacher.role === 'admin' ? 'admin' : 'teacher', data.teacher.must_change_password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Giáo viên đăng nhập"
      lead="Tài khoản do nhóm nghiên cứu cấp. Giáo viên chỉ xem được tiến độ của lớp được gán."
      onBack={onBack}
    >
      <form onSubmit={submit} className="grid grid-cols-1 gap-4">
        <Field label="Tên đăng nhập">
          <TextInput value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
        </Field>
        <Field label="Mật khẩu">
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </Field>
        {error && <Alert>{error}</Alert>}
        <Button type="submit" variant="primary" size="lg" block disabled={submitting || !username || !password}>
          {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>
      </form>
    </AuthLayout>
  );
}
