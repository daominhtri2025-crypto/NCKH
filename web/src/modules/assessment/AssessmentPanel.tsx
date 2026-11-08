import type { AssessmentStatus, PhaseName, PhaseState } from '../../lib/types';

interface Props {
  status: AssessmentStatus;
  onOpen: (phase: PhaseName) => void;
}

const CARD: Record<PhaseName, { title: string; hint: string }> = {
  pre: { title: 'Khảo sát đầu vào', hint: 'Làm trước khi bắt đầu các hoạt động.' },
  post: { title: 'Khảo sát sau can thiệp', hint: 'Mở khi hoàn thành cả 3 hoạt động.' },
  delayed: { title: 'Khảo sát theo dõi', hint: 'Mở sau 4 tuần kể từ khảo sát sau can thiệp.' },
};

function label(state: PhaseState): string {
  switch (state.status) {
    case 'done':
      return '✓ Đã xong';
    case 'in_progress':
      return `Đang làm: ${state.answered}/${state.total}`;
    case 'open':
      return 'Sẵn sàng';
    case 'locked':
      return '🔒 Chưa mở';
  }
}

/** Bảng trình tự nghiên cứu: pre → 3 hoạt động → post → delayed. */
export default function AssessmentPanel({ status, onOpen }: Props) {
  const phases: PhaseName[] = ['pre', 'post', 'delayed'];
  const m = status.modules;
  return (
    <section className="assess-panel" aria-label="Tiến trình nghiên cứu">
      <div className="track">
        {phases.map((p, i) => {
          const state = status.phases[p];
          const clickable = state.status !== 'locked' && state.status !== 'done';
          return (
            <div key={p} className="track-step">
              <button
                type="button"
                className={`card track-card is-${state.status}`}
                onClick={() => clickable && onOpen(p)}
                disabled={!clickable}
                aria-label={`${CARD[p].title}: ${label(state)}`}
              >
                <span className="track-num">{i + 1}</span>
                <span className="track-title">{CARD[p].title}</span>
                <span className="track-status">{label(state)}</span>
                {state.status === 'locked' && state.locked_reason && (
                  <span className="track-hint small">{state.locked_reason}</span>
                )}
                {state.status === 'open' || state.status === 'in_progress' ? (
                  <span className="track-hint small">{CARD[p].hint}</span>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
      <p className="small muted">
        Hoạt động đã xong: {[m.m1, m.m2, m.m3].filter(Boolean).length}/3
        {status.phases.pre.status !== 'done' && ' · Hãy làm khảo sát đầu vào trước.'}
      </p>
    </section>
  );
}
