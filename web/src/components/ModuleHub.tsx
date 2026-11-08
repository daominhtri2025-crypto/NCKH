interface Props {
  onOpenModule1: () => void;
  onOpenModule2: () => void;
}

interface ModuleCard {
  key: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
  onOpen?: () => void;
}

export default function ModuleHub({ onOpenModule1, onOpenModule2 }: Props) {
  const modules: ModuleCard[] = [
    {
      key: 'm1',
      title: 'Sân chơi tình huống',
      description: 'Xử lý cuộc gọi lạ, mã OTP, tin nhắn trúng thưởng và tin nhắn mạo danh.',
      icon: '🎯',
      available: true,
      onOpen: onOpenModule1,
    },
    {
      key: 'm2',
      title: 'Thám tử không gian mạng',
      description: 'Phân biệt tên miền thật và giả mạo bằng cách đọc địa chỉ trang web.',
      icon: '🔍',
      available: true,
      onOpen: onOpenModule2,
    },
    {
      key: 'm3',
      title: 'Phòng thí nghiệm tài khoản',
      description: 'Kiểm tra độ mạnh mật khẩu và cài đặt quyền riêng tư.',
      icon: '🔐',
      available: false,
    },
  ];

  return (
    <section>
      <h2>Chọn một hoạt động</h2>
      <div className="module-grid">
        {modules.map((m) => (
          <article key={m.key} className={`card module-card ${m.available ? '' : 'is-locked'}`}>
            <div className="module-icon" aria-hidden="true">{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            {m.available && m.onOpen ? (
              <button className="btn btn-primary" onClick={m.onOpen}>Bắt đầu</button>
            ) : (
              <span className="badge">Sắp mở</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
