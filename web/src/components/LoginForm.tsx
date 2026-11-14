import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Participant } from '../lib/types';
import AuthLayout from './AuthLayout';
import { Alert, Button, Field, TextInput } from './ui';

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
    <AuthLayout title="Nhập mã học sinh" lead="Mã có dạng XXXX-XXXX. Em đã ghi mã này khi tạo tài khoản." onBack={onBack}>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4">
        <Field label="Mã học sinh">
          <TextInput
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            required
            maxLength={12}
            className="text-center font-mono text-xl tracking-[0.2em]"
          />
        </Field>
        {error && <Alert>{error}</Alert>}
        <Button type="submit" variant="primary" size="lg" block disabled={submitting || !code.trim()}>
          {submitting ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </Button>
      </form>
    </AuthLayout>
  );
}
