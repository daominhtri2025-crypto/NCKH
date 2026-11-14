import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import Icon from '../../components/icons';
import Modal from '../../components/Modal';
import PasswordReminder from '../../components/PasswordReminder';
import PortalHeader from '../../components/PortalHeader';
import { Alert, Badge, Button, Card, Field, PageTitle, ProgressBar, StatCard, TextInput, cx } from '../../components/ui';
import CardPrintSheet from './CardPrintSheet';

interface Student {
  code: string;
  status: 'issued' | 'active';
  claimed_at: string | null;
  last_seen_at: string | null;
  phases: { pre: number; post: number; delayed: number };
  modules: { m1: number; m2: number; m3_steps: number; lab: boolean };
}

interface Totals {
  students: number;
  active: number;
  items_per_phase: number;
  m1: number;
  m2: number;
  m3_steps: number;
}

interface Roster {
  class_code: string;
  totals: Totals;
  students: Student[];
}

interface Props {
  onLogout: () => void;
  mustChange?: boolean;
  onPasswordChanged?: () => void;
}

type Filter = 'all' | 'active' | 'issued';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đã kích hoạt' },
  { key: 'issued', label: 'Chưa kích hoạt' },
];

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
}

const isPreDone = (s: Student, t: Totals) => t.items_per_phase > 0 && s.phases.pre >= t.items_per_phase;
const isPostDone = (s: Student, t: Totals) => t.items_per_phase > 0 && s.phases.post >= t.items_per_phase;
const isModulesDone = (s: Student, t: Totals) => s.modules.m1 >= t.m1 && s.modules.m2 >= t.m2 && s.modules.m3_steps >= t.m3_steps && t.m1 + t.m2 + t.m3_steps > 0;

/** Tiến độ lớp. Chỉ hiển thị số lượng và trạng thái; không có câu trả lời của học sinh. */
export default function TeacherDashboard({ onLogout, mustChange = false, onPasswordChanged = () => {} }: Props) {
  const [roster, setRoster] = useState<Roster | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [printCodes, setPrintCodes] = useState<string[] | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [cardCount, setCardCount] = useState(5);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [reissued, setReissued] = useState<{ old: string; next: string } | null>(null);
  const [reissueTarget, setReissueTarget] = useState<string | null>(null);
  const [ledgerChecked, setLedgerChecked] = useState(false);
  const [reissuing, setReissuing] = useState(false);

  const loadRoster = useCallback(async () => {
    try {
      setRoster(await api.get<Roster>('/teacher/roster'));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onLogout();
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Không tải được danh sách.');
    }
  }, [onLogout]);

  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  const students = roster?.students ?? [];
  const totals = roster?.totals;

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase().replace(/[\s-]/g, '');
    return students.filter((s) => {
      if (filter !== 'all' && s.status !== filter) return false;
      return q === '' || s.code.replace(/-/g, '').includes(q);
    });
  }, [students, query, filter]);

  const kpi = useMemo(() => {
    if (!totals) return null;
    return {
      pre: students.filter((s) => isPreDone(s, totals)).length,
      modules: students.filter((s) => isModulesDone(s, totals)).length,
      post: students.filter((s) => isPostDone(s, totals)).length,
    };
  }, [students, totals]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((s) => selected.has(s.code));

  function toggleOne(code: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filtered.forEach((s) => next.delete(s.code));
      else filtered.forEach((s) => next.add(s.code));
      return next;
    });
  }

  function openPrint() {
    const codes = selected.size > 0 ? students.filter((s) => selected.has(s.code)).map((s) => s.code) : filtered.map((s) => s.code);
    setPrintCodes(codes);
  }

  function openCreate() {
    setNewCodes(null);
    setCardError(null);
    setCreateOpen(true);
  }

  async function createCards(event?: FormEvent) {
    event?.preventDefault();
    setCardError(null);
    setCreating(true);
    try {
      const data = await api.post<{ codes: string[] }>('/teacher/cards', { count: cardCount });
      setNewCodes(data.codes);
      void loadRoster();
    } catch (err) {
      setCardError(err instanceof ApiError ? err.message : 'Không tạo được thẻ.');
    } finally {
      setCreating(false);
    }
  }

  function openReissue(code: string) {
    setReissueTarget(code);
    setLedgerChecked(false);
  }

  function closeReissue() {
    setReissueTarget(null);
    setLedgerChecked(false);
  }

  /** Chỉ gửi yêu cầu khi giáo viên đã tích xác nhận đối chiếu mã cũ với sổ phát thẻ. Hệ thống ghi nhật ký thao tác. */
  async function reissue(code: string) {
    if (!ledgerChecked) return;
    setReissuing(true);
    try {
      const data = await api.post<{ new_code: string }>(
        `/teacher/students/${encodeURIComponent(code)}/reissue`,
        { ledger_confirmed: true },
      );
      setReissued({ old: code, next: data.new_code });
      closeReissue();
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
      setRoster(null);
      void loadRoster();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không cấp lại được thẻ.');
      closeReissue();
    } finally {
      setReissuing(false);
    }
  }

  async function logout() {
    try {
      await api.logoutTeacher();
    } finally {
      onLogout();
    }
  }

  const header = <PortalHeader roleLabel="Giáo viên" subtitle={roster ? `Lớp ${roster.class_code}` : undefined} onLogout={logout} />;

  if (error && !roster) {
    return (
      <div className="min-h-screen bg-canvas">
        {header}
        <main className="mx-auto max-w-3xl p-6"><Alert>{error}</Alert></main>
      </div>
    );
  }
  if (!roster || !totals || !kpi) {
    return (
      <div className="min-h-screen bg-canvas">
        {header}
        <p className="py-20 text-center text-ink-soft">Đang tải tiến độ lớp…</p>
      </div>
    );
  }

  const activePct = totals.students > 0 ? Math.round((totals.active / totals.students) * 100) : 0;
  const pctOf = (n: number) => (totals.active > 0 ? Math.round((n / totals.active) * 100) : 0);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {header}

      <main className="mx-auto grid grid-cols-1 max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {mustChange && <PasswordReminder onChanged={onPasswordChanged} />}

        <PageTitle
          title={`Lớp ${roster.class_code}`}
          subtitle="Trang này chỉ hiển thị tiến độ, không hiển thị nội dung câu trả lời của học sinh."
          actions={
            <>
              <Button icon="printer" onClick={openPrint} disabled={filtered.length === 0}>
                {selected.size > 0 ? `In ${selected.size} thẻ đã chọn` : 'In thẻ học sinh'}
              </Button>
              <Button variant="primary" icon="plus" onClick={openCreate}>Tạo thẻ mới</Button>
            </>
          }
        />

        {error && <Alert>{error}</Alert>}

        {reissued && (
          <Card className="flex flex-wrap items-center justify-between gap-3 border-ok/30 bg-ok-bg p-4">
            <p className="m-0 text-sm text-ok">
              <strong>Đã cấp thẻ mới.</strong> Thẻ cũ <code className="font-mono">{reissued.old}</code> không còn dùng được. Mã mới:{' '}
              <code className="rounded-md bg-surface px-2 py-0.5 font-mono font-bold text-ink">{reissued.next}</code>
            </p>
            <div className="flex gap-2">
              <Button size="sm" icon="printer" onClick={() => setPrintCodes([reissued.next])}>In thẻ mới</Button>
              <Button size="sm" variant="ghost" onClick={() => setReissued(null)}>Đóng</Button>
            </div>
          </Card>
        )}

        {/* KPI lớp */}
        <section aria-label="Tổng quan lớp" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <StatCard label="Thẻ đã cấp" value={totals.students} sub={`${totals.active} đã kích hoạt (${activePct}%)`} icon="idCard" />
          <StatCard label="Xong khảo sát đầu vào" value={kpi.pre} sub={`${pctOf(kpi.pre)}% học sinh đã kích hoạt`} icon="circleCheck" tone="ok" />
          <StatCard label="Xong 3 hoạt động" value={kpi.modules} sub={`${pctOf(kpi.modules)}% học sinh đã kích hoạt`} icon="target" tone="info" />
          <StatCard label="Xong khảo sát sau" value={kpi.post} sub={`${pctOf(kpi.post)}% học sinh đã kích hoạt`} icon="flag" tone="warn" />
        </section>

        {/* Danh sách học sinh */}
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
            <div className="relative min-w-52 flex-1">
              <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" />
              <TextInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo mã thẻ…"
                aria-label="Tìm theo mã thẻ"
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Lọc theo trạng thái">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={filter === f.key}
                  className={cx(
                    'min-h-9 cursor-pointer rounded-full px-3.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand',
                    filter === f.key ? 'bg-brand text-brand-ink' : 'bg-line/60 text-ink-soft hover:bg-brand-soft hover:text-brand',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-brand-soft px-4 py-2.5 text-sm font-semibold text-brand">
              <span>Đã chọn {selected.size} thẻ</span>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" icon="printer" onClick={openPrint}>In thẻ đã chọn</Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Bỏ chọn</Button>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="grid grid-cols-1 place-items-center gap-2 p-12 text-center text-ink-soft">
              <Icon name="users" size={32} />
              <p className="m-0 font-semibold text-ink">
                {students.length === 0 ? 'Lớp chưa có thẻ nào.' : 'Không có học sinh khớp bộ lọc.'}
              </p>
              {students.length === 0 && <Button variant="primary" icon="plus" onClick={openCreate}>Tạo thẻ đầu tiên</Button>}
            </div>
          ) : (
            <>
              {/* Bảng (màn hình rộng) */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-canvas text-left text-xs font-bold tracking-wide text-ink-soft uppercase">
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox" checked={allFilteredSelected} onChange={toggleAll} aria-label="Chọn tất cả" className="size-4 accent-[var(--brand)]" />
                      </th>
                      <th className="px-3 py-3">Mã thẻ</th>
                      <th className="px-3 py-3">Trạng thái</th>
                      <th className="px-3 py-3">Đầu vào</th>
                      <th className="px-3 py-3">Sân chơi</th>
                      <th className="px-3 py-3">Thám tử</th>
                      <th className="px-3 py-3">Phòng TN</th>
                      <th className="px-3 py-3">Sau / Theo dõi</th>
                      <th className="hidden px-3 py-3 xl:table-cell">Gần nhất</th>
                      <th className="px-3 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s.code} className="border-t border-line transition hover:bg-brand-soft/50">
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selected.has(s.code)} onChange={() => toggleOne(s.code)} aria-label={`Chọn thẻ ${s.code}`} className="size-4 accent-[var(--brand)]" />
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap"><code className="rounded-md bg-brand-soft px-2 py-1 font-mono font-bold text-brand">{s.code}</code></td>
                        <td className="px-3 py-3"><StatusBadge status={s.status} /></td>
                        <ProgressCell active={s.status === 'active'} value={s.phases.pre} max={totals.items_per_phase} />
                        <ProgressCell active={s.status === 'active'} value={s.modules.m1} max={totals.m1} />
                        <ProgressCell active={s.status === 'active'} value={s.modules.m2} max={totals.m2} />
                        <ProgressCell active={s.status === 'active'} value={s.modules.m3_steps} max={totals.m3_steps} badge={s.modules.lab ? 'Đạt' : undefined} />
                        <td className="px-3 py-3 whitespace-nowrap text-ink-soft">
                          {s.status === 'active' ? `${s.phases.post}/${totals.items_per_phase} · ${s.phases.delayed}/${totals.items_per_phase}` : '—'}
                        </td>
                        <td className="hidden px-3 py-3 whitespace-nowrap text-ink-soft xl:table-cell">{shortDate(s.last_seen_at)}</td>
                        <td className="px-3 py-3">
                          <RowActions student={s} nowrap onPrint={() => setPrintCodes([s.code])} onReissue={() => openReissue(s.code)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Thẻ (điện thoại, máy tính bảng) */}
              <ul className="m-0 grid grid-cols-1 list-none gap-3 p-3 sm:grid-cols-2 lg:hidden">
                {filtered.map((s) => (
                  <li key={s.code} className="grid grid-cols-1 gap-3 rounded-2xl border border-line bg-surface p-4">
                    <div className="flex items-center justify-between gap-2">
                      <label className="flex min-w-0 cursor-pointer items-center gap-2.5">
                        <input type="checkbox" checked={selected.has(s.code)} onChange={() => toggleOne(s.code)} aria-label={`Chọn thẻ ${s.code}`} className="size-5 accent-[var(--brand)]" />
                        <code className="rounded-md bg-brand-soft px-2 py-1 font-mono font-bold text-brand">{s.code}</code>
                      </label>
                      <StatusBadge status={s.status} />
                    </div>
                    {s.status === 'active' && (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Metric label="Đầu vào" value={s.phases.pre} max={totals.items_per_phase} />
                        <Metric label="Sân chơi tình huống" value={s.modules.m1} max={totals.m1} />
                        <Metric label="Thám tử tên miền" value={s.modules.m2} max={totals.m2} />
                        <Metric label="Phòng thí nghiệm" value={s.modules.m3_steps} max={totals.m3_steps} note={s.modules.lab ? 'Đạt' : undefined} />
                        <p className="col-span-2 m-0 text-xs text-ink-soft">
                          Sau: {s.phases.post}/{totals.items_per_phase} · Theo dõi: {s.phases.delayed}/{totals.items_per_phase} · Gần nhất: {shortDate(s.last_seen_at)}
                        </p>
                      </div>
                    )}
                    <RowActions student={s} onPrint={() => setPrintCodes([s.code])} onReissue={() => openReissue(s.code)} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </main>

      {/* Tạo thẻ mới */}
      {createOpen && (
        <Modal
          title={newCodes ? 'Đã tạo thẻ mới' : 'Tạo thẻ mới'}
          confirmLabel={newCodes ? 'In các thẻ này' : 'Tạo thẻ'}
          cancelLabel={newCodes ? 'Đóng' : 'Hủy'}
          busy={creating}
          onConfirm={() => {
            if (newCodes) {
              setPrintCodes(newCodes);
              setCreateOpen(false);
            } else {
              void createCards();
            }
          }}
          onCancel={() => setCreateOpen(false)}
        >
          {newCodes ? (
            <div className="grid grid-cols-1 gap-3">
              <p className="m-0 text-sm text-ink-soft">Mã chỉ hiển thị ở đây và trong danh sách lớp. Hãy in thẻ và phát cho học sinh, rồi ghi vào sổ phát thẻ.</p>
              <ul className="m-0 grid max-h-56 list-none grid-cols-2 gap-2 overflow-auto p-0">
                {newCodes.map((c) => (
                  <li key={c} className="rounded-lg bg-brand-soft px-2 py-1.5 text-center font-mono text-sm font-bold text-brand">{c}</li>
                ))}
              </ul>
            </div>
          ) : (
            <form onSubmit={createCards} className="grid grid-cols-1 gap-3">
              <p className="m-0 text-sm text-ink-soft">
                Dùng cho học sinh mới tham gia lớp, hoặc học sinh quên mã. Thẻ mới không kế thừa tiến độ cũ. Mỗi lần tạo tối đa 20 thẻ.
                Thẻ được ghi nhận là do tài khoản của thầy/cô tạo.
              </p>
              <Field label="Số thẻ cần tạo">
                <TextInput type="number" min={1} max={20} value={cardCount} onChange={(e) => setCardCount(Number(e.target.value))} required />
              </Field>
              {cardError && <Alert>{cardError}</Alert>}
            </form>
          )}
        </Modal>
      )}

      {/* Cấp lại thẻ (giữ tiến độ) */}
      {reissueTarget && (
        <Modal
          title="Cấp thẻ mới cho học sinh"
          confirmLabel="Xác nhận cấp thẻ mới"
          busy={reissuing}
          confirmDisabled={!ledgerChecked}
          onConfirm={() => void reissue(reissueTarget)}
          onCancel={closeReissue}
        >
          <div className="grid grid-cols-1 gap-3">
            <p className="m-0 text-sm">
              Cấp thẻ mới cho học sinh có mã <code className="rounded-md bg-brand-soft px-1.5 py-0.5 font-mono font-bold text-brand">{reissueTarget}</code>.
              Mã cũ sẽ không còn dùng được; tiến độ được giữ nguyên.
            </p>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-warn/40 bg-warn-bg p-3">
              <input type="checkbox" checked={ledgerChecked} onChange={(e) => setLedgerChecked(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" />
              <span className="text-sm font-semibold text-warn">Tôi đã đối chiếu mã cũ với sổ phát thẻ</span>
            </label>
            <p className="m-0 text-xs text-ink-soft">Thao tác được ghi nhật ký để truy vết trách nhiệm.</p>
          </div>
        </Modal>
      )}

      {printCodes && <CardPrintSheet codes={printCodes} classCode={roster.class_code} onClose={() => setPrintCodes(null)} />}
    </div>
  );
}

function StatusBadge({ status }: { status: Student['status'] }) {
  return status === 'active' ? <Badge tone="ok">Đã kích hoạt</Badge> : <Badge>Chưa kích hoạt</Badge>;
}

function ProgressCell({ active, value, max, badge }: { active: boolean; value: number; max: number; badge?: string }) {
  if (!active) return <td className="px-3 py-3 text-ink-soft">—</td>;
  return (
    <td className="min-w-20 px-3 py-3">
      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold text-ink tabular-nums">
        <span>{value}/{max}</span>
        {badge && <Badge tone="ok">{badge}</Badge>}
      </div>
      <ProgressBar value={value} max={max} tone={max > 0 && value >= max ? 'ok' : 'brand'} />
    </td>
  );
}

function Metric({ label, value, max, note }: { label: string; value: number; max: number; note?: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate text-ink-soft">{label}</span>
        <strong className="whitespace-nowrap text-ink tabular-nums">{value}/{max}{note ? ` · ${note}` : ''}</strong>
      </div>
      <ProgressBar value={value} max={max} tone={max > 0 && value >= max ? 'ok' : 'brand'} />
    </div>
  );
}

function RowActions({ student, nowrap = false, onPrint, onReissue }: { student: Student; nowrap?: boolean; onPrint: () => void; onReissue: () => void }) {
  return (
    <div className={cx('flex justify-end gap-1.5', nowrap ? 'flex-nowrap whitespace-nowrap' : 'flex-wrap')}>
      <Button size="sm" variant="secondary" icon="printer" onClick={onPrint}>In thẻ</Button>
      {student.status === 'active' && (
        <Button size="sm" variant="ghost" icon="refresh" onClick={onReissue} title="Cấp thẻ mới khi học sinh làm mất thẻ">Cấp lại</Button>
      )}
    </div>
  );
}
