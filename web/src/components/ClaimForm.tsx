import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Participant } from '../lib/types';

const CONSENT_VERSION = 'v1';

interface Props {
  onActivated: (participant: Participant) => void;
  onBack: () => void;
}

/** Kích hoạt thẻ mã đã được giáo viên phát: nhập mã trên thẻ và đồng ý tham gia. */
export default function ClaimForm({ onActivated, onBack }: Props) {
  const [code, setCode] = useState('');
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
    <section className="card">
      <button className="link-btn" onClick={onBack}>← Quay lại</button>
      <h2>Kích hoạt thẻ mã</h2>
      <p className="lead">Nhập mã ghi trên thẻ do giáo viên phát. Mã có dạng XXXX-XXXX.</p>

      <div className="consent-box">
        <p><strong>Chúng tôi thu thập:</strong> mã trên thẻ, và kết quả em trả lời trong các hoạt động và khảo sát.</p>
        <p><strong>Chúng tôi KHÔNG thu thập:</strong> họ tên, email, số điện thoại, ảnh, hay mật khẩu của em.</p>
        <p><strong>Quyền của em:</strong> tham gia là tự nguyện. Em có thể dừng bất cứ lúc nào.</p>
        <p><strong>Kết quả:</strong> chỉ dùng cho nghiên cứu, báo cáo dưới dạng tổng hợp.</p>
      </div>

      <form onSubmit={submit} className="stack">
        <label className="field">
          <span>Mã trên thẻ</span>
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

        <label className="checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>Em đã đọc và đồng ý tham gia nghiên cứu.</span>
        </label>

        {error && <p className="alert" role="alert">{error}</p>}

        <button className="btn btn-primary btn-xl" type="submit" disabled={!agreed || submitting || !code.trim()}>
          {submitting ? 'Đang kích hoạt…' : 'Kích hoạt và bắt đầu'}
        </button>
      </form>
    </section>
  );
}
