import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../lib/api';
import Icon, { type IconName } from '../../components/icons';
import PasswordReminder from '../../components/PasswordReminder';
import { cx } from '../../components/ui';
import { PROJECT } from '../../lib/project';
import AnalyticsSection from './AnalyticsSection';
import ExportSection from './ExportSection';
import OverviewSection from './OverviewSection';
import QuestionsSection from './QuestionsSection';
import ReportSection from './ReportSection';
import TeachersSection from './TeachersSection';
import type { AdminSection, AdminTeacher, AnalyticsOverview } from './types';

interface Props {
  onLogout: () => void;
  mustChange: boolean;
  onPasswordChanged: () => void;
}

interface NavItem {
  key: AdminSection;
  label: string;
  icon: IconName;
}

interface NavGroup {
  label: string | null;
  items: NavItem[];
}

/** Menu chia theo nhóm chức năng để thao tác nhanh, tránh rối mắt. */
const NAV: NavGroup[] = [
  { label: null, items: [{ key: 'overview', label: 'Tổng quan', icon: 'dashboard' }] },
  {
    label: 'Quản lý đào tạo',
    items: [
      { key: 'teachers', label: 'Tài khoản giáo viên', icon: 'users' },
      { key: 'questions', label: 'Bộ câu hỏi khảo sát', icon: 'help' },
    ],
  },
  { label: 'Thống kê', items: [{ key: 'analytics', label: 'Số liệu đo lường', icon: 'chart' }] },
  {
    label: 'In ấn & Xuất dữ liệu',
    items: [
      { key: 'export', label: 'Xuất dữ liệu CSV', icon: 'download' },
      { key: 'report', label: 'Báo cáo tổng hợp (in)', icon: 'printer' },
    ],
  },
];

/** Trang quản trị: chỉ tài khoản role = admin mới vào được. Máy chủ kiểm tra lại mọi thao tác. */
export default function AdminDashboard({ onLogout, mustChange, onPasswordChanged }: Props) {
  const [section, setSection] = useState<AdminSection>('overview');
  const [drawer, setDrawer] = useState(false);
  const [teachers, setTeachers] = useState<AdminTeacher[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const loadTeachers = useCallback(async () => {
    try {
      const data = await api.get<{ teachers: AdminTeacher[] }>('/admin/teachers');
      setTeachers(data.teachers);
      setTeacherError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onLogout();
      setTeacherError(err instanceof ApiError ? err.message : 'Không tải được danh sách giáo viên.');
    }
  }, [onLogout]);

  const loadAnalytics = useCallback(async () => {
    try {
      setAnalytics(await api.get<AnalyticsOverview>('/admin/analytics'));
      setAnalyticsError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return onLogout();
      setAnalyticsError(err instanceof ApiError ? err.message : 'Không tải được số liệu.');
    }
  }, [onLogout]);

  useEffect(() => {
    void loadTeachers();
    void loadAnalytics();
  }, [loadTeachers, loadAnalytics]);

  function go(next: AdminSection) {
    setSection(next);
    setDrawer(false);
    window.scrollTo({ top: 0 });
  }

  async function logout() {
    try {
      await api.logoutTeacher();
    } finally {
      onLogout();
    }
  }

  const current = NAV.flatMap((g) => g.items).find((i) => i.key === section);

  const sidebar = (
    <nav aria-label="Chức năng quản trị" className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="grid grid-cols-1 size-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-ink shadow-card">
          <Icon name="shield" size={22} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="m-0 text-[15px] font-extrabold tracking-tight text-ink">{PROJECT.name}</p>
          <p className="m-0 text-xs font-semibold text-ink-soft">Quản trị hệ thống</p>
        </div>
      </div>

      <div className="grid grid-cols-1 flex-1 content-start gap-5">
        {NAV.map((group, gi) => (
          <div key={gi} className="grid grid-cols-1 gap-1">
            {group.label && (
              <p className="m-0 px-3 pb-1 text-[11px] font-bold tracking-widest text-ink-soft uppercase">{group.label}</p>
            )}
            {group.items.map((item) => {
              const active = item.key === section;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => go(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition',
                    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand',
                    active ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-canvas hover:text-ink',
                  )}
                >
                  <Icon name={item.icon} size={19} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={logout}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-line px-3 text-left text-sm font-semibold text-ink-soft transition hover:border-danger hover:bg-danger-bg hover:text-danger focus-visible:outline-2 focus-visible:outline-brand"
      >
        <Icon name="logout" size={19} />
        Đăng xuất
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
      {/* Thanh bên cố định trên màn hình rộng */}
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-surface lg:block no-print">{sidebar}</aside>

      {/* Thanh trên + ngăn kéo cho điện thoại */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-2.5 backdrop-blur lg:hidden no-print">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Mở menu"
          aria-expanded={drawer}
          className="grid grid-cols-1 size-10 cursor-pointer place-items-center rounded-xl text-ink transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Icon name="menu" size={22} />
        </button>
        <p className="m-0 truncate text-base font-extrabold text-ink">{current?.label}</p>
        <span className="size-10" aria-hidden="true" />
      </header>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden no-print" role="dialog" aria-modal="true" aria-label="Menu quản trị">
          <button type="button" aria-label="Đóng menu" className="absolute inset-0 cursor-default bg-slate-900/55 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="relative h-full w-72 max-w-[85%] bg-surface shadow-pop">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Đóng menu"
              className="absolute top-3 right-3 grid grid-cols-1 size-9 cursor-pointer place-items-center rounded-lg text-ink-soft hover:bg-canvas"
            >
              <Icon name="x" size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto grid grid-cols-1 max-w-6xl gap-6">
          {mustChange && <PasswordReminder onChanged={onPasswordChanged} />}

          {section === 'overview' && <OverviewSection analytics={analytics} teachers={teachers} error={analyticsError ?? teacherError} onNavigate={go} />}
          {section === 'teachers' && <TeachersSection teachers={teachers} onChanged={async () => { await loadTeachers(); }} />}
          {section === 'questions' && <QuestionsSection />}
          {section === 'analytics' && <AnalyticsSection analytics={analytics} error={analyticsError} />}
          {section === 'export' && <ExportSection />}
          {section === 'report' && <ReportSection analytics={analytics} teachers={teachers} error={analyticsError} />}
        </div>
      </main>
    </div>
  );
}
