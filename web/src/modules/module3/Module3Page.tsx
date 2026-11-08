import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Module3Overview } from '../../lib/types';
import type { StrengthBand } from './passwordStrength';
import PasswordLab from './PasswordLab';
import PrivacyChecklist from './PrivacyChecklist';

interface Props {
  onBack: () => void;
}

type Tab = 'lab' | 'checklist';

/** Module 3: phòng thí nghiệm mật khẩu (cục bộ) và checklist quyền riêng tư (có ghi nhận). */
export default function Module3Page({ onBack }: Props) {
  const [overview, setOverview] = useState<Module3Overview | null>(null);
  const [tab, setTab] = useState<Tab>('lab');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setOverview(await api.get<Module3Overview>('/module3'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tải được nội dung.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function completeLab(band: StrengthBand) {
    await api.post('/module3/lab', { best_band: band });
    await load();
  }

  if (error) {
    return (
      <section className="card">
        <p className="alert" role="alert">{error}</p>
        <button className="btn" onClick={onBack}>Quay lại</button>
      </section>
    );
  }
  if (!overview) {
    return <p className="center muted">Đang tải phòng thí nghiệm…</p>;
  }

  const { progress } = overview;
  return (
    <section>
      <button className="link-btn" onClick={onBack}>← Các hoạt động</button>
      <h2>{overview.title}</h2>

      <div className="card progress-card">
        <div className="progress-row">
          <span>Checklist: <strong>{progress.passed_steps}/{progress.total_steps}</strong> bước</span>
          <span>Phòng thí nghiệm: <strong>{overview.lab.passed ? 'Hoàn thành' : 'Chưa xong'}</strong></span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.score_percent}>
          <div style={{ width: `${progress.score_percent}%` }} />
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="Phần của phòng thí nghiệm">
        <button role="tab" aria-selected={tab === 'lab'} className={`tab ${tab === 'lab' ? 'is-active' : ''}`} onClick={() => setTab('lab')}>
          Kiểm tra mật khẩu
        </button>
        <button role="tab" aria-selected={tab === 'checklist'} className={`tab ${tab === 'checklist' ? 'is-active' : ''}`} onClick={() => setTab('checklist')}>
          Cài đặt quyền riêng tư
        </button>
      </div>

      {tab === 'lab' ? (
        <PasswordLab onComplete={completeLab} completed={overview.lab.passed} />
      ) : (
        <PrivacyChecklist platforms={overview.platforms} disclaimer={overview.disclaimer} onProgress={() => void load()} />
      )}
    </section>
  );
}
