import { useRef, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Module2Item, Module2Result, Verdict } from '../../lib/types';
import ReadingBreakdown from './ReadingBreakdown';
import { TRICK_LABELS } from './labels';

interface Props {
  item: Module2Item;
  position: number;
  total: number;
  onAnswered: (item: Module2Item, result: Module2Result) => void;
  onNext: () => void;
}

/** Vị trí hai nút do máy chủ quyết định theo học sinh và mục, để tránh thiên lệch vị trí. */
function verdictButtons(order: Module2Item['button_order']): Verdict[] {
  return order === 'official_first' ? ['official', 'fake'] : ['fake', 'official'];
}

/**
 * Một lượt chơi: hiển thị URL, cho phép mở gợi ý "đọc từ phải sang trái", nhận phân loại,
 * rồi phản hồi kèm giải thích. Thời gian phản hồi đo từ lúc hiển thị lượt chơi.
 * Mỗi mục chỉ được phân loại một lần (máy chủ từ chối lần thứ hai).
 */
export default function DetectiveRound({ item, position, total, onAnswered, onNext }: Props) {
  const [hintOpen, setHintOpen] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Module2Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shownAt = useRef(Date.now());

  function toggleHint() {
    setHintOpen((open) => !open);
    setHintUsed(true);
  }

  async function classify(verdict: Verdict) {
    if (submitting || result) return;
    setSubmitting(true);
    setError(null);
    const responseMs = Math.min(Math.max(Date.now() - shownAt.current, 0), 3_600_000);
    try {
      const data = await api.post<Module2Result>(`/module2/items/${encodeURIComponent(item.id)}/answer`, {
        verdict,
        response_ms: responseMs,
        hint_used: hintUsed,
      });
      setResult(data);
      onAnswered(item, data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không gửi được. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="round" aria-labelledby="round-title">
      <div className="round-head">
        <h2 id="round-title">Mục {position}/{total}</h2>
        <div className="round-dots" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`dot ${i + 1 < position ? 'is-done' : i + 1 === position ? 'is-now' : ''}`} />
          ))}
        </div>
      </div>

      <p className="prompt">Đây là trang chính thức hay trang giả mạo?</p>

      <div className="url-card">
        <span className="url-label">Địa chỉ trang web</span>
        <code className="url-text">{item.url}</code>
      </div>

      <button
        type="button"
        className="btn btn-ghost hint-toggle"
        onClick={toggleHint}
        aria-expanded={hintOpen}
        disabled={result !== null}
      >
        {hintOpen ? 'Ẩn cách đọc' : 'Đọc từ phải sang trái'}
      </button>

      {hintOpen && result === null && (
        <div className="hint-panel">
          <ReadingBreakdown host={item.host} rootDomain={item.root_domain} />
          <p className="small">
            Phần gốc là <strong>{item.root_domain}</strong>. Hãy so với tên gốc chính thức ở thẻ hướng dẫn.
          </p>
        </div>
      )}

      {result === null && (
        <div className="verdicts">
          {verdictButtons(item.button_order).map((v) => (
            <button
              key={v}
              type="button"
              className={`btn btn-xl verdict verdict-${v}`}
              onClick={() => classify(v)}
              disabled={submitting}
            >
              {v === 'official' ? '✅ Chính thống' : '⚠️ Giả mạo'}
            </button>
          ))}
        </div>
      )}

      {error && <p className="alert" role="alert">{error}</p>}

      {result && (
        <section
          className={`feedback ${result.correct ? 'feedback-ok' : 'feedback-warn'}`}
          role="status"
          aria-live="polite"
        >
          <h3>{result.correct ? 'Chính xác! Thám tử giỏi 🕵️' : 'Chưa đúng, xem cách đọc nhé 🔎'}</h3>
          <p>
            Trang này là <strong>{result.is_official ? 'chính thống' : 'giả mạo'}</strong>.
            Thủ thuật: <strong>{TRICK_LABELS[result.trick] ?? result.trick}</strong>.
          </p>
          <ReadingBreakdown host={item.host} rootDomain={item.root_domain} />
          <p className="explanation">{result.explanation}</p>
          <div className="stack-row">
            <button type="button" className="btn btn-primary btn-xl" onClick={onNext}>
              {position < total ? 'Mục tiếp theo' : 'Xem kết quả'}
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
