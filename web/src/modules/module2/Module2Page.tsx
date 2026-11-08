import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import type { Module2Item, Module2Overview, Module2Result } from '../../lib/types';
import ReferenceCard from './ReferenceCard';
import DetectiveRound from './DetectiveRound';
import { TRICK_LABELS } from './labels';

interface Props {
  onBack: () => void;
}

type Phase = 'intro' | 'playing' | 'done';

/** Trò chơi "Thám tử phân biệt tên miền": giới thiệu, lần lượt phân loại, tổng kết. */
export default function Module2Page({ onBack }: Props) {
  const [overview, setOverview] = useState<Module2Overview | null>(null);
  const [items, setItems] = useState<Module2Item[]>([]);
  const [results, setResults] = useState<Record<string, Module2Result>>({});
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await api.get<Module2Overview>('/module2');
      setOverview(data);
      setItems(data.items);
      setResults({});
      setPhase(data.items.every((i) => i.status === 'answered') ? 'done' : 'intro');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không tải được trò chơi.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const total = items.length;
  const correctCount = useMemo(() => items.filter((i) => i.correct === true).length, [items]);
  const answeredCount = useMemo(() => items.filter((i) => i.status === 'answered').length, [items]);

  function start() {
    const firstOpen = items.findIndex((i) => i.status === 'new');
    setIndex(firstOpen === -1 ? 0 : firstOpen);
    setPhase(firstOpen === -1 ? 'done' : 'playing');
  }

  function handleAnswered(item: Module2Item, result: Module2Result) {
    setResults((prev) => ({ ...prev, [item.id]: result }));
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'answered', correct: result.correct } : i)),
    );
  }

  function next() {
    // Bỏ qua các mục đã làm (nếu có) để tiếp tục đúng vị trí.
    let nextIndex = index + 1;
    while (nextIndex < items.length && items[nextIndex].status === 'answered') {
      nextIndex++;
    }
    if (nextIndex >= items.length) {
      setPhase('done');
    } else {
      setIndex(nextIndex);
    }
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
    return <p className="center muted">Đang tải trò chơi…</p>;
  }

  if (phase === 'intro') {
    return (
      <section>
        <button className="link-btn" onClick={onBack}>← Các hoạt động</button>
        <h2>{overview.title}</h2>
        <div className="card">
          <p className="lead">
            Mỗi lượt, em sẽ thấy một địa chỉ trang web. Hãy quyết định trang đó là <strong>chính thống</strong> hay{' '}
            <strong>giả mạo</strong>. Nếu chưa chắc, bấm “Đọc từ phải sang trái” để xem cách tách tên miền.
          </p>
          <p className="small muted">Tổng cộng {total} mục. Mỗi mục chỉ được phân loại một lần.</p>
          <button className="btn btn-primary btn-xl" onClick={start} disabled={total === 0}>
            {answeredCount > 0 ? 'Tiếp tục chơi' : 'Bắt đầu chơi'}
          </button>
        </div>
        <ReferenceCard overview={overview} />
      </section>
    );
  }

  if (phase === 'done') {
    const accuracy = total > 0 ? Math.round((correctCount * 100) / total) : 0;
    return (
      <section>
        <button className="link-btn" onClick={onBack}>← Các hoạt động</button>
        <h2>Kết quả thám tử</h2>
        <div className="card center">
          <p className="score">{correctCount}/{total}</p>
          <p className="lead">Độ chính xác {accuracy}% ngay từ lần phân loại đầu tiên.</p>
        </div>

        <ul className="result-list">
          {items.map((i) => {
            const r = results[i.id];
            return (
              <li key={i.id} className={`result-item ${i.correct ? 'is-ok' : 'is-bad'}`}>
                <span className="result-mark">{i.correct ? '✓' : '✗'}</span>
                <span className="result-body">
                  <code className="small">{i.host}</code>
                  {r && <span className="small muted"> · {TRICK_LABELS[r.trick] ?? r.trick}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const current = items[index];
  if (!current) {
    return <p className="center muted">Đang chuẩn bị mục tiếp theo…</p>;
  }

  return (
    <section>
      <button className="link-btn" onClick={onBack}>← Các hoạt động</button>
      <DetectiveRound
        key={current.id}
        item={current}
        position={index + 1}
        total={total}
        onAnswered={handleAnswered}
        onNext={next}
      />
    </section>
  );
}
