import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Module1Overview } from '../../lib/types';
import ScenarioPlayer from './ScenarioPlayer';

interface Props {
  onBack: () => void;
}

/** Danh sách tình huống của Module 1 kèm tiến độ. */
export default function Module1Page({ onBack }: Props) {
  const [overview, setOverview] = useState<Module1Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setOverview(await api.get<Module1Overview>('/module1'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tải được tình huống.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (activeId) {
    return (
      <ScenarioPlayer
        scenarioId={activeId}
        onExit={() => {
          // Xóa số liệu cũ để không hiển thị tiến độ trước khi làm bài.
          setOverview(null);
          setActiveId(null);
          void load();
        }}
      />
    );
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
    return <p className="center muted">Đang tải tình huống…</p>;
  }

  const { progress } = overview;
  return (
    <section>
      <button className="link-btn" onClick={onBack}>← Các hoạt động</button>
      <h2>{overview.title}</h2>

      <div className="card progress-card">
        <div className="progress-row">
          <span>Đã trả lời <strong>{progress.answered}/{progress.total}</strong> tình huống</span>
          <span>Đúng ngay lần đầu: <strong>{progress.first_try_safe}</strong></span>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.score_percent}>
          <div style={{ width: `${(progress.answered / progress.total) * 100}%` }} />
        </div>
      </div>

      <ul className="scenario-list">
        {overview.scenarios.map((s, i) => (
          <li key={s.id}>
            <button className="scenario-item" onClick={() => setActiveId(s.id)}>
              <span className="scenario-num">{i + 1}</span>
              <span className="scenario-text">
                <strong>{s.title}</strong>
                <span className="muted small">{s.summary}</span>
              </span>
              <span className={`status status-${s.status}`}>
                {s.status === 'new' ? 'Chưa làm' : s.first_try_safe ? 'Đúng ✓' : 'Đã làm'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
