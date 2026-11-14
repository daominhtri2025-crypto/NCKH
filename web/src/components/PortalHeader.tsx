import { PROJECT } from '../lib/project';
import Icon from './icons';
import { Badge } from './ui';

interface Props {
  roleLabel: string;
  subtitle?: string;
  onLogout: () => void;
}

/** Thanh đầu trang cho giáo viên (quản trị viên có thanh bên riêng). */
export default function PortalHeader({ roleLabel, subtitle, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur no-print">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink shadow-card">
            <Icon name="shield" size={20} />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="m-0 truncate text-base font-extrabold tracking-tight text-ink">{PROJECT.name}</p>
            <p className="m-0 flex items-center gap-2 truncate text-xs text-ink-soft">
              <Badge tone="brand">{roleLabel}</Badge>
              {subtitle && <span className="truncate">{subtitle}</span>}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Icon name="logout" size={16} />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
