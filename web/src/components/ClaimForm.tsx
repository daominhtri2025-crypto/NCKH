import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Participant } from '../lib/types';
import AuthLayout from './AuthLayout';
import Icon from './icons';
import { Alert, Button, Field, TextInput } from './ui';

const CONSENT_VERSION = 'v1';

interface Props {
  onActivated: (participant: Participant) => void;
  onBack: () => void;
  /** Mã điền sẵn khi học sinh quét mã QR trên thẻ. */
  initialCode?: string;
}

/** Kích hoạt thẻ mã đã được giáo viên phát: nhập mã trên thẻ và đồng ý tham gia. */
export default function ClaimForm({ onActivated, onBack, initialCode = '' }: Props) {
  const [code, setCode] = useState(initialCode);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post<{ participant: Participant }>('/participants/claim', {
        code: code.trim().toUpperCase(),
        consent: agreed,
        consent_version: CONSENT_VERSION,
      });
      onActivated(data.participant);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Kích hoạt thẻ mã" lead="Nhập mã ghi trên thẻ do giáo viên phát. Mã có dạng XXXX-XXXX." onBack={onBack}>
      {initialCode && (
        <p className="mt-0 mb-4 inline-flex items-center gap-2 rounded-xl bg-ok-bg px-3 py-2 text-sm font-semibold text-ok">
          <Icon name="circleCheck" size={18} /> Đã nhận mã từ thẻ của em. Hãy đọc thông tin rồi đồng ý để bắt đầu.
        </p>
      )}

      <div className="mb-5 grid grid-cols-1 gap-2 rounded-2xl bg-brand-soft p-4 text-sm text-ink">
        <p className="m-0">
          <strong>Chúng tôi thu thập:</strong> mã trên thẻ, và kết quả em trả lời trong các hoạt động và khảo sát.
        </p>
        <p className="m-0">
          <strong>Chúng tôi KHÔNG thu thập:</strong> họ tên, email, số điện thoại, ảnh, hay mật khẩu của em.
        </p>
        <p className="m-0">
          <strong>Quyền của em:</strong> tham gia là tự nguyện. Em có thể dừng bất cứ lúc nào.
        </p>
        <p className="m-0">
          <strong>Kết quả:</strong> chỉ dùng cho nghiên cứu, báo cáo dưới dạng tổng hợp.
        </p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 gap-4">
        <Field label="Mã trên thẻ">
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

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 transition hover:border-brand">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]"
          />
          <span className="text-sm font-semibold text-ink">Em đã đọc và đồng ý tham gia nghiên cứu.</span>
        </label>

        {error && <Alert>{error}</Alert>}

        <Button type="submit" variant="primary" size="lg" block disabled={!agreed || submitting || !code.trim()}>
          {submitting ? 'Đang kích hoạt…' : 'Kích hoạt và bắt đầu'}
        </Button>
      </form>
    </AuthLayout>
  );
}
