import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { AnswerResult, ScenarioDetail } from '../../lib/types';

interface Props {
  scenarioId: string;
  onExit: () => void;
}

/**
 * Trình chơi một tình huống: hiển thị hội thoại, nhận lựa chọn, phản hồi ngay.
 * Thời gian phản hồi đo từ lúc hiển thị lựa chọn (hoặc từ lần thử lại) đến khi bấm.
 */
export default function ScenarioPlayer({ scenarioId, onExit }: Props) {
  const [detail, setDetail] = useState<ScenarioDetail | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shownAt = useRef<number>(Date.now());

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setResult(null);
    setSelected(null);
    api
      .get<{ scenario: ScenarioDetail }>(`/module1/scenarios/${encodeURIComponent(scenarioId)}`)
      .then((data) => {
        if (!cancelled) {
          setDetail(data.scenario);
          shownAt.current = Date.now();
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Không tải được tình huống.');
      });
    return () => {
      cancelled = true;
    };
  }, [scenarioId]);

  async function choose(index: number) {
    if (submitting || result) return;
    setSubmitting(true);
    setError(null);
    setSelected(index);
    const responseMs = Math.min(Math.max(Date.now() - shownAt.current, 0), 3_600_000);
    try {
      const data = await api.post<AnswerResult>(
        `/module1/scenarios/${encodeURIComponent(scenarioId)}/answer`,
        { choice_index: index, response_ms: responseMs },
      );
      setResult(data);
    } catch (err) {
      setSelected(null);
      setError(err instanceof ApiError ? err.message : 'Không gửi được lựa chọn. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setSelected(null);
    shownAt.current = Date.now();
  }

  if (error && !detail) {
    return (
      <section className="card">
        <p className="alert" role="alert">{error}</p>
        <button className="btn" onClick={onExit}>Quay lại danh sách</button>
      </section>
    );
  }
  if (!detail) {
    return <p className="center muted">Đang tải tình huống…</p>;
  }

  return (
    <section className="player">
      <button className="link-btn" onClick={onExit}>← Danh sách tình huống</button>
      <h2>{detail.title}</h2>

      <div className="chat" aria-label="Nội dung tình huống">
        {detail.messages.map((m, i) => (
          <div key={i} className="bubble">
            <span className="bubble-from">{m.from}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <h3 className="question">{detail.question}</h3>

      <ul className="choices">
        {detail.choices.map((c) => {
          const isSelected = selected === c.index;
          const isBest = result !== null && result.best_choice_index === c.index;
          let cls = 'choice';
          if (result && isSelected) cls += result.is_safe ? ' choice-correct' : ' choice-wrong';
          if (result && isBest && !result.is_safe) cls += ' choice-hint';
          return (
            <li key={c.index}>
              <button
                className={cls}
                onClick={() => choose(c.index)}
                disabled={submitting || result !== null}
              >
                <span className="choice-letter">{String.fromCharCode(65 + c.index)}</span>
                <span>{c.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {error && detail && <p className="alert" role="alert">{error}</p>}

      {result && (
        <section
          className={`feedback ${result.is_safe ? 'feedback-ok' : 'feedback-warn'}`}
          role="status"
          aria-live="polite"
        >
          <h3>{result.is_safe ? 'Đúng rồi! 🎉' : 'Chưa đúng, hãy thử lại nhé 🤔'}</h3>
          <p>{result.feedback}</p>

          {!result.is_safe && result.red_flags.length > 0 && (
            <>
              <p className="feedback-label">Dấu hiệu cần để ý:</p>
              <ul className="flags">
                {result.red_flags.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </>
          )}

          <p className="takeaway"><strong>Bài học:</strong> {result.takeaway}</p>

          <div className="stack-row">
            {!result.is_safe && (
              <button className="btn" onClick={retry}>Chọn lại</button>
            )}
            <button className="btn btn-primary" onClick={onExit}>Xong, về danh sách</button>
          </div>
        </section>
      )}
    </section>
  );
}
