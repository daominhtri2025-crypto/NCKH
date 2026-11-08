import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { AssessmentItemView, AssessmentPhaseView, AssessmentStatus, PhaseName } from '../../lib/types';

interface Props {
  phase: PhaseName;
  scale: AssessmentStatus['behavior_scale'];
  onExit: () => void;
}

const PHASE_TITLE: Record<PhaseName, string> = {
  pre: 'Khảo sát đầu vào',
  post: 'Khảo sát sau can thiệp',
  delayed: 'Khảo sát theo dõi',
};

const SCALE_FACES = ['🙅', '🤔', '🙂', '😄'];

/**
 * Làm khảo sát từng câu. Không phản hồi đúng/sai để giữ tính khách quan của phép đo.
 * Thời gian phản hồi đo từ lúc hiển thị câu đến khi chọn.
 */
export default function AssessmentPage({ phase, scale, onExit }: Props) {
  const [view, setView] = useState<AssessmentPhaseView | null>(null);
  const [items, setItems] = useState<AssessmentItemView[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shownAt = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    api
      .get<AssessmentPhaseView>(`/assessments/${phase}`)
      .then((data) => {
        if (cancelled) return;
        setView(data);
        setItems(data.items);
        const firstOpen = data.items.findIndex((i) => !i.answered);
        setIndex(firstOpen === -1 ? data.items.length : firstOpen);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Không tải được khảo sát.');
      });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  useEffect(() => {
    shownAt.current = Date.now();
  }, [index]);

  const title = PHASE_TITLE[phase];

  if (error) {
    return (
      <section className="card">
        <p className="alert" role="alert">{error}</p>
        <button className="btn" onClick={onExit}>Quay lại</button>
      </section>
    );
  }
  if (!view) {
    return <p className="center muted">Đang tải khảo sát…</p>;
  }

  if (view.state.status === 'locked') {
    return (
      <section>
        <button className="link-btn" onClick={onExit}>← Trang chính</button>
        <h2>{title}</h2>
        <div className="card center">
          <p className="lock-icon" aria-hidden="true">🔒</p>
          <p className="lead">{view.state.locked_reason}</p>
          {view.state.available_at && (
            <p className="small muted">Có thể làm từ: {view.state.available_at.slice(0, 16).replace('T', ' ')}</p>
          )}
          <button className="btn btn-primary" onClick={onExit}>Quay lại</button>
        </div>
      </section>
    );
  }

  const total = items.length;
  const done = index >= total;

  if (!started && !done) {
    return (
      <section>
        <button className="link-btn" onClick={onExit}>← Trang chính</button>
        <h2>{title}</h2>
        <div className="card">
          <p className="lead">Khảo sát có {total} câu. {view.state.answered > 0 ? 'Em đã làm một phần, tiếp tục nhé.' : 'Em làm từng câu một.'}</p>
          <p className="small muted">Không có điểm đúng sai để chấm. Em cứ chọn đúng suy nghĩ của mình.</p>
          <button className="btn btn-primary btn-xl" onClick={() => setStarted(true)}>
            {view.state.answered > 0 ? 'Tiếp tục' : 'Bắt đầu'}
          </button>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section>
        <h2>{title}</h2>
        <div className="card center">
          <p className="score">🎉</p>
          <p className="lead">Em đã hoàn thành {title.toLowerCase()}. Cảm ơn em!</p>
          <button className="btn btn-primary btn-xl" onClick={onExit}>Về trang chính</button>
        </div>
      </section>
    );
  }

  const item = items[index];

  async function answer(body: { answer_index?: number; answer_value?: number }) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const responseMs = Math.min(Math.max(Date.now() - shownAt.current, 0), 3_600_000);
    try {
      await api.post(`/assessments/${phase}/items/${encodeURIComponent(item.id)}/answer`, {
        ...body,
        response_ms: responseMs,
      });
      setItems((prev) => prev.map((i, n) => (n === index ? { ...i, answered: true } : i)));
      setIndex((n) => n + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không gửi được. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="assess">
      <div className="round-head">
        <h2>{title}</h2>
        <span className="small muted">Câu {index + 1}/{total}</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
        <div style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className="card question-card">
        <p className="q-text">{item.question}</p>

        {item.instrument === 'knowledge' && item.options && (
          <div className="stack">
            {item.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                className="choice"
                onClick={() => answer({ answer_index: i })}
                disabled={submitting}
              >
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        )}

        {item.instrument === 'behavior' && (
          <div className="scale" role="group" aria-label="Mức độ">
            {scale.map((label, i) => (
              <button
                key={label}
                type="button"
                className="scale-btn"
                onClick={() => answer({ answer_value: i + 1 })}
                disabled={submitting}
              >
                <span className="scale-face" aria-hidden="true">{SCALE_FACES[i]}</span>
                <span className="scale-label">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="alert" role="alert">{error}</p>}
    </section>
  );
}
