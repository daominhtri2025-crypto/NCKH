import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { Participant } from '../lib/types';

const CONSENT_VERSION = 'v1';

interface Props {
  onRegistered: (participant: Participant) => void;
  onBack: () => void;
}

interface RegisterResponse {
  participant: Participant;
}

export default function ConsentForm({ onRegistered, onBack }: Props) {
  const [classCode, setClassCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await api.post<RegisterResponse>('/participants', {
        class_code: classCode.trim(),
        consent: agreed,
        consent_version: CONSENT_VERSION,
      });
      onRegistered(data.participant);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không kết nối được máy chủ.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card">
      <button className="link-btn" onClick={onBack}>← Quay lại</button>
      <h2>Phiếu đồng ý tham gia nghiên cứu</h2>

      <div className="consent-box">
        <p><strong>Chúng tôi thu thập:</strong> mã học sinh do hệ thống cấp, mã lớp, và kết quả em trả lời trong các tình huống và bài kiểm tra.</p>
        <p><strong>Chúng tôi KHÔNG thu thập:</strong> họ tên, email, số điện thoại, ảnh, hay mật khẩu của em.</p>
        <p><strong>Quyền của em:</strong> tham gia là tự nguyện. Em có thể dừng bất cứ lúc nào mà không bị ảnh hưởng điểm số ở trường.</p>
        <p><strong>Kết quả:</strong> chỉ dùng để nghiên cứu, được báo cáo dưới dạng tổng hợp và không gắn với tên của em.</p>
      </div>

      <form onSubmit={submit} className="stack">
        <label className="field">
          <span>Mã lớp (giáo viên cung cấp)</span>
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Ví dụ: 8A1"
            autoComplete="off"
            required
            maxLength={40}
          />
        </label>

        <label className="checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>Em đã đọc và đồng ý tham gia nghiên cứu.</span>
        </label>

        {error && <p className="alert" role="alert">{error}</p>}

        <button className="btn btn-primary btn-xl" type="submit" disabled={!agreed || submitting || !classCode.trim()}>
          {submitting ? 'Đang tạo mã…' : 'Tạo mã và bắt đầu'}
        </button>
      </form>
    </section>
  );
}
