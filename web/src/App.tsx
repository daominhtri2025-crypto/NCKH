import { Suspense, lazy, useEffect, useState } from 'react';
import { api, ApiError } from './lib/api';
import type { AssessmentStatus, Participant, PhaseName } from './lib/types';
import Welcome from './components/Welcome';
import ClaimForm from './components/ClaimForm';
import LoginForm from './components/LoginForm';
import StudentDashboard from './components/StudentDashboard';
import AppHeader from './components/AppHeader';
import Footer from './components/Footer';
import { readCodeFromHash } from './lib/project';
import Module1Page from './modules/module1/Module1Page';
import Module2Page from './modules/module2/Module2Page';
import Module3Page from './modules/module3/Module3Page';
import AssessmentPage from './modules/assessment/AssessmentPage';
import TeacherLogin from './modules/teacher/TeacherLogin';
import TeacherDashboard from './modules/teacher/TeacherDashboard';
// Trang quản trị kéo theo thư viện biểu đồ (Recharts) nên chỉ tải khi quản trị viên đăng nhập.
const AdminDashboard = lazy(() => import('./modules/admin/AdminDashboard'));

type View =
  | { name: 'loading' }
  | { name: 'welcome' }
  | { name: 'claim' }
  | { name: 'login' }
  | { name: 'teacherLogin' }
  | { name: 'teacher' }
  | { name: 'admin' }
  | { name: 'hub' }
  | { name: 'module1' }
  | { name: 'module2' }
  | { name: 'module3' }
  | { name: 'assessment'; phase: PhaseName };

export default function App() {
  const [view, setView] = useState<View>({ name: 'loading' });
  const [mustChange, setMustChange] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [assessment, setAssessment] = useState<AssessmentStatus | null>(null);
  // Mã đọc từ mã QR trên thẻ (#code=…). Đọc một lần rồi xóa khỏi thanh địa chỉ.
  const [prefillCode, setPrefillCode] = useState<string | null>(() => readCodeFromHash(window.location.hash));

  async function refreshAssessment() {
    try {
      setAssessment(await api.get<AssessmentStatus>('/assessments'));
    } catch {
      setAssessment(null);
    }
  }

  function goHub() {
    void refreshAssessment();
    setView({ name: 'hub' });
  }

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    let cancelled = false;
    api
      .get<{ participant: Participant }>('/me')
      .then((data) => {
        if (cancelled) return;
        setParticipant(data.participant);
        void refreshAssessment();
        setView({ name: 'hub' });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // 401 nghĩa là chưa đăng nhập: hiển thị màn chào. Lỗi khác cũng đưa về màn chào để học sinh thử lại.
        if (!(err instanceof ApiError)) {
          console.error(err);
        }
        setView(prefillCode ? { name: 'claim' } : { name: 'welcome' });
      });
    return () => {
      cancelled = true;
    };
    // Chỉ chạy một lần khi mở ứng dụng; prefillCode đã được chụp ở lần render đầu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enter(p: Participant) {
    setPrefillCode(null);
    setParticipant(p);
    goHub();
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setParticipant(null);
      setAssessment(null);
      setView({ name: 'welcome' });
    }
  }

  // Giáo viên và quản trị viên dùng khung toàn màn hình riêng.
  if (view.name === 'teacher') {
    return (
      <TeacherDashboard
        onLogout={() => setView({ name: 'welcome' })}
        mustChange={mustChange}
        onPasswordChanged={() => setMustChange(false)}
      />
    );
  }
  if (view.name === 'admin') {
    return (
      <Suspense fallback={<p className="grid min-h-screen place-items-center bg-canvas text-ink-soft">Đang tải trang quản trị…</p>}>
        <AdminDashboard
          onLogout={() => setView({ name: 'welcome' })}
          mustChange={mustChange}
          onPasswordChanged={() => setMustChange(false)}
        />
      </Suspense>
    );
  }

  const inActivity = ['module1', 'module2', 'module3', 'assessment'].includes(view.name);
  const widthClass = inActivity ? 'max-w-3xl' : 'max-w-5xl';

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <AppHeader
        code={participant && view.name !== 'welcome' ? participant.code : undefined}
        onLogout={logout}
        onHome={participant ? goHub : view.name === 'welcome' ? undefined : () => setView({ name: 'welcome' })}
      />

      <main className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${widthClass}`}>
        {view.name === 'loading' && <p className="py-16 text-center text-ink-soft">Đang tải…</p>}

        {view.name === 'welcome' && (
          <Welcome
            onClaimCard={() => setView({ name: 'claim' })}
            onHaveCode={() => setView({ name: 'login' })}
            onTeacher={() => setView({ name: 'teacherLogin' })}
          />
        )}

        {view.name === 'claim' && (
          <ClaimForm
            initialCode={prefillCode ?? undefined}
            onActivated={enter}
            onBack={() => {
              setPrefillCode(null);
              setView({ name: 'welcome' });
            }}
          />
        )}

        {view.name === 'teacherLogin' && (
          <TeacherLogin
            onLoggedIn={(role, mustChange) => {
              setMustChange(mustChange);
              setView(role === 'admin' ? { name: 'admin' } : { name: 'teacher' });
            }}
            onBack={() => setView({ name: 'welcome' })}
          />
        )}

        {view.name === 'login' && (
          <LoginForm onLoggedIn={enter} onBack={() => setView({ name: 'welcome' })} />
        )}

        {view.name === 'hub' && participant && assessment && (
          <StudentDashboard
            participant={participant}
            status={assessment}
            onOpenPhase={(phase) => setView({ name: 'assessment', phase })}
            onOpenModule={(n) => setView(n === 1 ? { name: 'module1' } : n === 2 ? { name: 'module2' } : { name: 'module3' })}
          />
        )}
        {view.name === 'hub' && participant && !assessment && (
          <p className="py-16 text-center text-ink-soft">Đang tải tiến độ…</p>
        )}

        {view.name === 'assessment' && assessment && (
          <AssessmentPage
            key={view.phase}
            phase={view.phase}
            scale={assessment.behavior_scale}
            onExit={goHub}
          />
        )}

        {view.name === 'module1' && <Module1Page onBack={goHub} />}
        {view.name === 'module2' && <Module2Page onBack={goHub} />}
        {view.name === 'module3' && <Module3Page onBack={goHub} />}
      </main>

      <Footer />
    </div>
  );
}
