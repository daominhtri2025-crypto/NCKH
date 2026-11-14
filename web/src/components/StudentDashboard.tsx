import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type {
  AssessmentStatus,
  Module1Overview,
  Module2Overview,
  Module3Overview,
  Participant,
  PhaseName,
} from '../lib/types';
import Icon, { type IconName } from './icons';
import { Badge, Button, Card, ProgressBar, ProgressRing, cx } from './ui';

interface Props {
  participant: Participant;
  status: AssessmentStatus;
  onOpenPhase: (phase: PhaseName) => void;
  onOpenModule: (module: 1 | 2 | 3) => void;
}

interface Overviews {
  m1: Module1Overview | null;
  m2: Module2Overview | null;
  m3: Module3Overview | null;
}

interface Lesson {
  key: string;
  title: string;
  done: boolean;
}

interface ModuleView {
  n: 1 | 2 | 3;
  title: string;
  description: string;
  icon: IconName;
  done: boolean;
  /** null khi chưa tải được số liệu chi tiết. */
  progress: { value: number; total: number; unit: string } | null;
  lessons: Lesson[];
}

const PHASE_TITLE: Record<PhaseName, string> = {
  pre: 'Khảo sát đầu vào',
  post: 'Khảo sát sau can thiệp',
  delayed: 'Khảo sát theo dõi',
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('vi-VN');
}

function buildModules(status: AssessmentStatus, o: Overviews): ModuleView[] {
  const m1 = o.m1;
  const m2 = o.m2;
  const m3 = o.m3;
  return [
    {
      n: 1,
      title: 'Sân chơi tình huống',
      description: 'Xử lý cuộc gọi lạ, mã OTP, tin nhắn trúng thưởng và tin nhắn mạo danh.',
      icon: 'message',
      done: status.modules.m1,
      progress: m1 ? { value: m1.progress.answered, total: m1.progress.total, unit: 'tình huống' } : null,
      lessons: (m1?.scenarios ?? []).map((s) => ({ key: s.id, title: s.title, done: s.status === 'answered' })),
    },
    {
      n: 2,
      title: 'Thám tử không gian mạng',
      description: 'Phân biệt tên miền thật và giả mạo bằng cách đọc địa chỉ trang web.',
      icon: 'search',
      done: status.modules.m2,
      progress: m2 ? { value: m2.progress.answered, total: m2.progress.total, unit: 'địa chỉ' } : null,
      lessons: (m2?.items ?? []).map((i) => ({ key: i.id, title: `Địa chỉ số ${i.position}`, done: i.status === 'answered' })),
    },
    {
      n: 3,
      title: 'Phòng thí nghiệm tài khoản',
      description: 'Kiểm tra độ mạnh mật khẩu và cài đặt quyền riêng tư cho tài khoản.',
      icon: 'lock',
      done: status.modules.m3,
      progress: m3 ? { value: m3.progress.passed_steps, total: m3.progress.total_steps, unit: 'bước' } : null,
      lessons: (m3?.platforms ?? []).flatMap((p) =>
        p.steps.map((s) => ({ key: `${p.id}-${s.id}`, title: `${p.name}: ${s.title}`, done: s.status === 'passed' })),
      ),
    },
  ];
}

interface Notice {
  tone: 'brand' | 'ok' | 'warn';
  icon: IconName;
  text: string;
}

/** Thông báo suy ra từ trạng thái khảo sát hiện có; không cần dữ liệu riêng từ máy chủ. */
function buildNotices(status: AssessmentStatus): Notice[] {
  const { pre, post, delayed } = status.phases;
  const notices: Notice[] = [];
  if (pre.status !== 'done') {
    notices.push({ tone: 'warn', icon: 'lock', text: 'Em cần làm khảo sát đầu vào để mở các hoạt động.' });
  }
  if (pre.status === 'done' && !status.modules.all) {
    notices.push({ tone: 'brand', icon: 'flag', text: 'Hoàn thành cả 3 hoạt động để mở khảo sát sau can thiệp.' });
  }
  if (post.status === 'open' || post.status === 'in_progress') {
    notices.push({ tone: 'ok', icon: 'bell', text: 'Khảo sát sau can thiệp đã mở. Em hãy làm ngay nhé!' });
  }
  if (post.status === 'done' && delayed.status === 'locked') {
    const when = formatDate(delayed.available_at);
    notices.push({
      tone: 'brand',
      icon: 'clock',
      text: when ? `Khảo sát theo dõi sẽ mở vào ngày ${when}.` : (delayed.locked_reason ?? 'Khảo sát theo dõi sẽ mở sau 4 tuần.'),
    });
  }
  if (delayed.status === 'open' || delayed.status === 'in_progress') {
    notices.push({ tone: 'ok', icon: 'bell', text: 'Khảo sát theo dõi đã mở. Em hãy hoàn thành để kết thúc chương trình.' });
  }
  if (pre.status === 'done' && post.status === 'done' && delayed.status === 'done' && status.modules.all) {
    notices.push({ tone: 'ok', icon: 'circleCheck', text: 'Em đã hoàn thành toàn bộ chương trình. Cảm ơn em đã tham gia!' });
  }
  return notices;
}

const NOTICE_TONE = {
  brand: 'bg-brand-soft text-brand',
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
} as const;

/**
 * Bảng học tập của học sinh: tiến độ tổng, hoạt động, hành trình nghiên cứu, thông báo.
 * Chỉ dùng các endpoint hiện có của học sinh (/assessments, /module1..3).
 */
export default function StudentDashboard({ participant, status, onOpenPhase, onOpenModule }: Props) {
  const preDone = status.phases.pre.status === 'done';
  const [overviews, setOverviews] = useState<Overviews>({ m1: null, m2: null, m3: null });

  useEffect(() => {
    if (!preDone) return;
    let cancelled = false;
    Promise.allSettled([
      api.get<Module1Overview>('/module1'),
      api.get<Module2Overview>('/module2'),
      api.get<Module3Overview>('/module3'),
    ]).then(([a, b, c]) => {
      if (cancelled) return;
      setOverviews({
        m1: a.status === 'fulfilled' ? a.value : null,
        m2: b.status === 'fulfilled' ? b.value : null,
        m3: c.status === 'fulfilled' ? c.value : null,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [preDone, status.modules.m1, status.modules.m2, status.modules.m3]);

  const modules = buildModules(status, overviews);
  const steps = [
    { key: 'pre', title: PHASE_TITLE.pre, done: preDone, state: status.phases.pre.status },
    ...modules.map((m) => ({ key: `m${m.n}`, title: m.title, done: m.done, state: preDone ? (m.done ? 'done' : 'open') : 'locked' })),
    { key: 'post', title: PHASE_TITLE.post, done: status.phases.post.status === 'done', state: status.phases.post.status },
    { key: 'delayed', title: PHASE_TITLE.delayed, done: status.phases.delayed.status === 'done', state: status.phases.delayed.status },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  const nextModule = modules.find((m) => !m.done);
  let next: { label: string; run: () => void } | null = null;
  if (!preDone) next = { label: 'Làm khảo sát đầu vào', run: () => onOpenPhase('pre') };
  else if (nextModule) next = { label: `Tiếp tục: ${nextModule.title}`, run: () => onOpenModule(nextModule.n) };
  else if (['open', 'in_progress'].includes(status.phases.post.status)) next = { label: 'Làm khảo sát sau can thiệp', run: () => onOpenPhase('post') };
  else if (['open', 'in_progress'].includes(status.phases.delayed.status)) next = { label: 'Làm khảo sát theo dõi', run: () => onOpenPhase('delayed') };

  const notices = buildNotices(status);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Tổng quan */}
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
        <ProgressRing percent={percent} size={104} label="Tiến độ chương trình" />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-sm font-semibold text-ink-soft">Lớp {participant.class_code}</p>
          <h1 className="mt-0.5 mb-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Chào em, tiếp tục hành trình nhé!</h1>
          <p className="m-0 text-ink-soft">
            Em đã hoàn thành <strong className="text-ink">{doneCount}/{steps.length}</strong> chặng của chương trình.
          </p>
        </div>
        {next && (
          <Button variant="primary" size="lg" onClick={next.run} className="w-full sm:w-auto">
            {next.label}
            <Icon name="chevronRight" size={18} />
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Hoạt động */}
        <section aria-labelledby="activities-title" className="grid grid-cols-1 gap-4">
          <h2 id="activities-title" className="m-0 text-xl font-extrabold text-ink">Hoạt động học tập</h2>

          {!preDone && (
            <Card className="flex flex-wrap items-center justify-between gap-3 border-warn/30 bg-warn-bg p-4">
              <p className="m-0 flex items-center gap-2 font-semibold text-warn">
                <Icon name="lock" size={18} /> Em cần làm <strong>khảo sát đầu vào</strong> trước khi bắt đầu các hoạt động.
              </p>
              <Button variant="primary" onClick={() => onOpenPhase('pre')}>Làm khảo sát đầu vào</Button>
            </Card>
          )}

          {modules.map((m) => {
            const pct = m.progress && m.progress.total > 0 ? Math.round((m.progress.value / m.progress.total) * 100) : 0;
            const started = (m.progress?.value ?? 0) > 0;
            return (
              <Card key={m.n} className={cx('p-5 transition', preDone ? 'hover:-translate-y-0.5 hover:shadow-pop' : 'opacity-75')}>
                <div className="flex items-start gap-4">
                  <span className={cx('grid size-12 shrink-0 place-items-center rounded-2xl', m.done ? 'bg-ok-bg text-ok' : 'bg-brand-soft text-brand')}>
                    <Icon name={preDone ? (m.done ? 'circleCheck' : m.icon) : 'lock'} size={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="m-0 text-lg font-bold text-ink">{m.title}</h3>
                      {!preDone ? <Badge>Sau khảo sát đầu vào</Badge> : m.done ? <Badge tone="ok">Đã hoàn thành</Badge> : started ? <Badge tone="brand">Đang làm</Badge> : <Badge>Chưa bắt đầu</Badge>}
                    </div>
                    <p className="mt-1 mb-3 text-sm text-ink-soft">{m.description}</p>

                    {preDone && m.progress && (
                      <div className="mb-3">
                        <div className="mb-1 flex justify-between text-xs font-semibold text-ink-soft">
                          <span>{m.progress.value}/{m.progress.total} {m.progress.unit}</span>
                          <span>{pct}%</span>
                        </div>
                        <ProgressBar value={m.progress.value} max={m.progress.total} tone={m.done ? 'ok' : 'brand'} label={`Tiến độ ${m.title}`} />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {preDone ? (
                        <Button variant={m.done ? 'secondary' : 'primary'} size="sm" onClick={() => onOpenModule(m.n)}>
                          {m.done ? 'Ôn lại' : started ? 'Tiếp tục' : 'Bắt đầu'}
                        </Button>
                      ) : null}
                    </div>

                    {preDone && m.lessons.length > 0 && (
                      <details className="group mt-3">
                        <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-brand select-none focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                          Danh sách bài học ({m.lessons.filter((l) => l.done).length}/{m.lessons.length})
                          <Icon name="chevronDown" size={16} className="transition group-open:rotate-180" />
                        </summary>
                        <ul className="mt-2 mb-0 grid grid-cols-1 list-none gap-1 p-0 sm:grid-cols-2">
                          {m.lessons.map((l) => (
                            <li key={l.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink">
                              <span className={cx('grid size-5 shrink-0 place-items-center rounded-full', l.done ? 'bg-ok text-surface' : 'border border-line text-transparent')}>
                                <Icon name="check" size={12} strokeWidth={3} />
                              </span>
                              <span className={cx('min-w-0 truncate', l.done && 'text-ink-soft')} title={l.title}>{l.title}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Cột phụ: hành trình + thông báo */}
        <aside className="grid grid-cols-1 gap-4">
          {notices.length > 0 && (
            <Card className="p-5" aria-labelledby="notices-title">
              <h2 id="notices-title" className="m-0 mb-3 flex items-center gap-2 text-base font-extrabold text-ink">
                <Icon name="bell" size={18} /> Thông báo
              </h2>
              <ul className="m-0 grid grid-cols-1 list-none gap-2 p-0">
                {notices.map((n, i) => (
                  <li key={i} className={cx('flex items-start gap-2.5 rounded-xl p-3 text-sm font-medium', NOTICE_TONE[n.tone])}>
                    <Icon name={n.icon} size={18} className="mt-0.5 shrink-0" />
                    <span>{n.text}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-5" aria-labelledby="journey-title">
            <h2 id="journey-title" className="m-0 mb-4 flex items-center gap-2 text-base font-extrabold text-ink">
              <Icon name="flag" size={18} /> Hành trình của em
            </h2>
            <ol className="m-0 grid grid-cols-1 list-none gap-0 p-0">
              {steps.map((s, i) => {
                const last = i === steps.length - 1;
                const open = !s.done && (s.state === 'open' || s.state === 'in_progress');
                return (
                  <li key={s.key} className="relative flex gap-3 pb-4 last:pb-0">
                    {!last && <span className={cx('absolute top-6 left-3 h-[calc(100%-1.25rem)] w-0.5', s.done ? 'bg-ok' : 'bg-line')} aria-hidden="true" />}
                    <span
                      className={cx(
                        'relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold',
                        s.done ? 'bg-ok text-surface' : open ? 'bg-brand text-brand-ink ring-4 ring-brand/20' : 'bg-line text-ink-soft',
                      )}
                    >
                      {s.done ? <Icon name="check" size={13} strokeWidth={3} /> : i + 1}
                    </span>
                    <div className="min-w-0 pt-px">
                      <p className={cx('m-0 text-sm leading-6 font-semibold', s.done ? 'text-ink-soft' : 'text-ink')}>{s.title}</p>
                      <p className="m-0 text-xs text-ink-soft">
                        {s.done ? 'Đã hoàn thành' : s.state === 'locked' ? 'Chưa mở' : s.state === 'in_progress' ? 'Đang làm' : 'Sẵn sàng'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="p-5" aria-labelledby="results-title">
            <h2 id="results-title" className="m-0 mb-3 flex items-center gap-2 text-base font-extrabold text-ink">
              <Icon name="target" size={18} /> Kết quả của em
            </h2>
            <dl className="m-0 grid grid-cols-1 gap-2.5 text-sm">
              <ResultRow label="Tình huống chọn an toàn ngay lần đầu" value={overviews.m1 ? `${overviews.m1.progress.first_try_safe}/${overviews.m1.progress.total}` : '—'} />
              <ResultRow label="Độ chính xác khi đọc tên miền" value={overviews.m2 && overviews.m2.progress.answered > 0 ? `${Math.round(overviews.m2.progress.accuracy_percent)}%` : '—'} />
              <ResultRow label="Bước bảo mật đã đạt" value={overviews.m3 ? `${overviews.m3.progress.passed_steps}/${overviews.m3.progress.total_steps}` : '—'} />
              <ResultRow label="Thử thách mật khẩu" value={overviews.m3 ? (overviews.m3.lab.passed ? 'Đã đạt' : 'Chưa đạt') : '—'} />
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="m-0 font-extrabold text-ink tabular-nums">{value}</dd>
    </div>
  );
}
