import type { ComponentProps, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import Icon, { type IconName } from './icons';

/** Thư viện thành phần giao diện dùng chung cho ba phân hệ (Tailwind + biến màu ở styles.css). */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* ---------- Nút ---------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
type Size = 'sm' | 'md' | 'lg';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-brand text-brand-ink shadow-[0_6px_16px_-6px_color-mix(in_srgb,var(--brand)_70%,transparent)] hover:bg-brand-strong',
  secondary: 'bg-surface text-ink border border-line shadow-sm hover:border-brand hover:text-brand hover:bg-brand-soft',
  ghost: 'bg-transparent text-ink-soft hover:bg-brand-soft hover:text-brand',
  soft: 'bg-brand-soft text-brand hover:bg-brand hover:text-brand-ink',
  danger: 'bg-danger text-surface hover:brightness-110',
};

const SIZE: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-sm gap-1.5',
  md: 'min-h-11 px-4 text-[0.95rem] gap-2',
  lg: 'min-h-14 px-6 text-lg gap-2.5',
};

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  block?: boolean;
}

export function Button({ variant = 'secondary', size = 'md', icon, block, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex cursor-pointer items-center justify-center rounded-xl font-semibold transition',
        'active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        VARIANT[variant],
        SIZE[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
}

/* ---------- Thẻ, huy hiệu, cảnh báo ---------- */

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('rounded-2xl border border-line bg-surface shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}

type Tone = 'neutral' | 'brand' | 'ok' | 'warn' | 'danger';

const TONE: Record<Tone, string> = {
  neutral: 'bg-line/60 text-ink-soft',
  brand: 'bg-brand-soft text-brand',
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  danger: 'bg-danger-bg text-danger',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap', TONE[tone], className)}>
      {children}
    </span>
  );
}

export function Alert({ tone = 'danger', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <p role={tone === 'danger' ? 'alert' : 'status'} className={cx('rounded-xl px-4 py-3 text-sm font-semibold', TONE[tone])}>
      {children}
    </p>
  );
}

/* ---------- Tiến độ ---------- */

export function ProgressBar({ value, max, tone = 'brand', label, className }: { value: number; max: number; tone?: 'brand' | 'ok'; label?: string; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cx('h-2 w-full overflow-hidden rounded-full bg-line', className)}
    >
      <div
        className={cx('h-full rounded-full transition-[width] duration-500', tone === 'ok' ? 'bg-ok' : 'bg-brand')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Vòng tiến độ (SVG) hiển thị phần trăm ở giữa. */
export function ProgressRing({ percent, size = 96, label }: { percent: number; size?: number; label: string }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${clamped}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * clamped) / 100}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span className="absolute inset-0 grid grid-cols-1 place-items-center text-lg font-extrabold text-ink">{clamped}%</span>
    </div>
  );
}

/* ---------- Thẻ chỉ số (KPI) ---------- */

export function StatCard({ label, value, sub, icon, tone = 'brand' }: { label: string; value: ReactNode; sub?: ReactNode; icon: IconName; tone?: 'brand' | 'ok' | 'warn' | 'info' }) {
  const iconTone = {
    brand: 'bg-brand-soft text-brand',
    ok: 'bg-ok-bg text-ok',
    warn: 'bg-warn-bg text-warn',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  }[tone];
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-soft">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink tabular-nums">{value}</p>
          {sub && <p className="mt-1 text-sm text-ink-soft">{sub}</p>}
        </div>
        <span className={cx('grid size-11 shrink-0 place-items-center rounded-xl', iconTone)}>
          <Icon name={icon} size={22} />
        </span>
      </div>
    </Card>
  );
}

/* ---------- Biểu mẫu ---------- */

export const inputClass =
  'w-full min-h-11 rounded-xl border border-line bg-surface px-3.5 py-2 text-base text-ink placeholder:text-ink-soft/70 ' +
  'transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 disabled:opacity-60';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputClass, props.className)} />;
}

/* ---------- Tiêu đề trang ---------- */

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="m-0 text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
