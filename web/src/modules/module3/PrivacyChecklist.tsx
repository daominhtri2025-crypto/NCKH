import { FormEvent, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Module3Overview, Module3Step, Module3StepResult } from '../../lib/types';

interface Props {
  platforms: Module3Overview['platforms'];
  disclaimer: string;
  onProgress: () => void;
}

/** Checklist theo nền tảng. Mỗi bước: hướng dẫn, lý do, câu kiểm tra và xác nhận đã thực hành. */
export default function PrivacyChecklist({ platforms, disclaimer, onProgress }: Props) {
  const [active, setActive] = useState(platforms[0]?.id ?? '');
  const current = platforms.find((p) => p.id === active) ?? platforms[0];

  return (
    <section>
      <p className="disclaimer small">⚠️ {disclaimer}</p>

      <div className="tabs" role="tablist" aria-label="Chọn nền tảng">
        {platforms.map((p) => (
          <button
            key={p.id}
            role="tab"
            aria-selected={p.id === current?.id}
            className={`tab ${p.id === current?.id ? 'is-active' : ''}`}
            onClick={() => setActive(p.id)}
          >
            {p.name}
            <span className="tab-count">
              {p.steps.filter((s) => s.status === 'passed').length}/{p.steps.length}
            </span>
          </button>
        ))}
      </div>

      <ol className="steps">
        {current?.steps.map((step, i) => (
          <li key={step.id}>
            <StepCard step={step} number={i + 1} onProgress={onProgress} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function StepCard({ step, number, onProgress }: { step: Module3Step; number: number; onProgress: () => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [practiced, setPracticed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Module3StepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [passed, setPassed] = useState(step.status === 'passed');
  const [open, setOpen] = useState(!passed);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (choice === null) return;
    setSubmitting(true);
    setError(null);
    try {
      const data = await api.post<Module3StepResult>(`/module3/steps/${encodeURIComponent(step.id)}/complete`, {
        quiz_choice: choice,
        practiced,
      });
      setResult(data);
      if (data.passed) {
        setPassed(true);
        onProgress();
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không gửi được. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setChoice(null);
  }

  return (
    <article className={`card step ${passed ? 'is-passed' : ''}`}>
      <button className="step-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="step-num">{number}</span>
        <span className="step-title">{step.title}</span>
        <span className={`status ${passed ? 'status-answered' : 'status-new'}`}>
          {passed ? '✓ Đã hoàn thành' : 'Chưa xong'}
        </span>
      </button>

      {open && (
        <div className="step-body">
          <p><strong>Thực hành:</strong> {step.instruction}</p>
          <p className="small"><strong>Vì sao quan trọng:</strong> {step.why}</p>

          {!passed && (
            <form onSubmit={submit} className="quiz">
              <fieldset disabled={submitting || result?.passed === true}>
                <legend><strong>Kiểm tra hiểu bài:</strong> {step.quiz.question}</legend>
                {step.quiz.options.map((opt, idx) => (
                  <label key={opt} className={`option ${choice === idx ? 'is-selected' : ''}`}>
                    <input
                      type="radio"
                      name={`q-${step.id}`}
                      checked={choice === idx}
                      onChange={() => setChoice(idx)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </fieldset>

              <label className="checkbox">
                <input type="checkbox" checked={practiced} onChange={(e) => setPracticed(e.target.checked)} />
                <span>Em đã thực hành các thao tác này trên điện thoại của mình.</span>
              </label>

              {error && <p className="alert" role="alert">{error}</p>}

              {result === null || !result.passed ? (
                <div className="stack-row">
                  <button type="submit" className="btn btn-primary" disabled={choice === null || !practiced || submitting}>
                    {submitting ? 'Đang gửi…' : 'Xác nhận'}
                  </button>
                  {result && !result.passed && (
                    <button type="button" className="btn" onClick={retry}>Chọn lại</button>
                  )}
                </div>
              ) : null}
            </form>
          )}

          {result && (
            <div className={`feedback ${result.passed ? 'feedback-ok' : 'feedback-warn'}`} role="status">
              <p><strong>{result.passed ? 'Đúng rồi!' : 'Chưa đúng.'}</strong> {result.explanation}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
