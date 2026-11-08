interface Props {
  /** Chưa làm khảo sát đầu vào: các hoạt động bị khóa và học sinh được dẫn tới pre-test. */
  preDone: boolean;
  onOpenPre: () => void;
  onOpenModule1: () => void;
  onOpenModule2: () => void;
  onOpenModule3: () => void;
}

interface ModuleCard {
  key: string;
  title: string;
  description: string;
  icon: string;
  onOpen: () => void;
}

export default function ModuleHub({ preDone, onOpenPre, onOpenModule1, onOpenModule2, onOpenModule3 }: Props) {
  const modules: ModuleCard[] = [
    {
      key: 'm1',
      title: 'Sân chơi tình huống',
      description: 'Xử lý cuộc gọi lạ, mã OTP, tin nhắn trúng thưởng và tin nhắn mạo danh.',
      icon: '🎯',
      onOpen: onOpenModule1,
    },
    {
      key: 'm2',
      title: 'Thám tử không gian mạng',
      description: 'Phân biệt tên miền thật và giả mạo bằng cách đọc địa chỉ trang web.',
      icon: '🔍',
      onOpen: onOpenModule2,
    },
    {
      key: 'm3',
      title: 'Phòng thí nghiệm tài khoản',
      description: 'Kiểm tra độ mạnh mật khẩu và cài đặt quyền riêng tư.',
      icon: '🔐',
      onOpen: onOpenModule3,
    },
  ];

  return (
    <section>
      <h2>Chọn một hoạt động</h2>
      {!preDone && (
        <div className="card lock-banner">
          <p>🔒 Em cần làm <strong>khảo sát đầu vào</strong> trước khi bắt đầu các hoạt động.</p>
          <button className="btn btn-primary" onClick={onOpenPre}>Làm khảo sát đầu vào</button>
        </div>
      )}
      <div className="module-grid">
        {modules.map((m) => (
          <article key={m.key} className={`card module-card ${preDone ? '' : 'is-locked'}`}>
            <div className="module-icon" aria-hidden="true">{preDone ? m.icon : '🔒'}</div>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            {preDone ? (
              <button className="btn btn-primary" onClick={m.onOpen}>Bắt đầu</button>
            ) : (
              <span className="badge">Sau khảo sát đầu vào</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
