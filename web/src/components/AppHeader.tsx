import { PROJECT } from '../lib/project';
import Icon from './icons';

interface Props {
  /** Mã học sinh đang đăng nhập (nếu có). */
  code?: string;
  onLogout?: () => void;
  onHome?: () => void;
}

/** Thanh đầu trang dùng cho cổng học sinh và các màn hình đăng nhập. */
export default function AppHeader({ code, onLogout, onHome }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur no-print">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          disabled={!onHome}
          className="flex min-w-0 cursor-pointer items-center gap-2.5 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default"
        >
          <span className="grid grid-cols-1 size-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink shadow-card">
            <Icon name="shield" size={20} />
          </span>
          <span className="truncate text-base font-extrabold tracking-tight text-ink sm:text-lg">{PROJECT.name}</span>
        </button>

        {code && onLogout && (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand sm:inline-flex">
              <Icon name="idCard" size={16} />
              <span className="font-mono tracking-wider">{code}</span>
            </span>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Đăng xuất"
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-ink-soft transition hover:bg-brand-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Icon name="logout" size={16} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
