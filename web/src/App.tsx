import { useEffect, useState } from 'react';
import { api, ApiError } from './lib/api';
import type { Participant } from './lib/types';
import Welcome from './components/Welcome';
import ConsentForm from './components/ConsentForm';
import LoginForm from './components/LoginForm';
import CodeReveal from './components/CodeReveal';
import ModuleHub from './components/ModuleHub';
import Module1Page from './modules/module1/Module1Page';
import Module2Page from './modules/module2/Module2Page';

type View =
  | { name: 'loading' }
  | { name: 'welcome' }
  | { name: 'consent' }
  | { name: 'login' }
  | { name: 'reveal'; participant: Participant }
  | { name: 'hub' }
  | { name: 'module1' }
  | { name: 'module2' };

export default function App() {
  const [view, setView] = useState<View>({ name: 'loading' });
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ participant: Participant }>('/me')
      .then((data) => {
        if (cancelled) return;
        setParticipant(data.participant);
        setView({ name: 'hub' });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // 401 nghĩa là chưa đăng nhập: hiển thị màn chào. Lỗi khác cũng đưa về màn chào để học sinh thử lại.
        if (!(err instanceof ApiError)) {
          console.error(err);
        }
        setView({ name: 'welcome' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function enter(p: Participant) {
    setParticipant(p);
    setView({ name: 'hub' });
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      setParticipant(null);
      setView({ name: 'welcome' });
    }
  }

  if (view.name === 'loading') {
    return <main className="shell"><p className="center muted">Đang tải…</p></main>;
  }

  return (
    <main className="shell">
      <header className="topbar">
        <span className="brand">🛡️ An Toàn Số Học Đường</span>
        {participant && view.name !== 'welcome' && (
          <div className="topbar-right">
            <span className="muted small">Mã: <strong>{participant.code}</strong></span>
            <button className="link-btn" onClick={logout}>Đăng xuất</button>
          </div>
        )}
      </header>

      {view.name === 'welcome' && (
        <Welcome
          onNewParticipant={() => setView({ name: 'consent' })}
          onHaveCode={() => setView({ name: 'login' })}
        />
      )}

      {view.name === 'consent' && (
        <ConsentForm
          onRegistered={(p) => setView({ name: 'reveal', participant: p })}
          onBack={() => setView({ name: 'welcome' })}
        />
      )}

      {view.name === 'login' && (
        <LoginForm onLoggedIn={enter} onBack={() => setView({ name: 'welcome' })} />
      )}

      {view.name === 'reveal' && (
        <CodeReveal
          participant={view.participant}
          onContinue={() => enter(view.participant)}
        />
      )}

      {view.name === 'hub' && (
        <ModuleHub
          onOpenModule1={() => setView({ name: 'module1' })}
          onOpenModule2={() => setView({ name: 'module2' })}
        />
      )}

      {view.name === 'module1' && (
        <Module1Page onBack={() => setView({ name: 'hub' })} />
      )}

      {view.name === 'module2' && (
        <Module2Page onBack={() => setView({ name: 'hub' })} />
      )}
    </main>
  );
}
