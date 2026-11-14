import Icon from './icons';
import { Button, Card } from './ui';

interface Props {
  onClaimCard: () => void;
  onHaveCode: () => void;
  onTeacher: () => void;
}

const SCENES = [
  { icon: 'message', title: 'Tin nhắn lạ', text: 'Trúng thưởng, mạo danh, đòi mã OTP.' },
  { icon: 'globe', title: 'Đường link đáng ngờ', text: 'Phân biệt tên miền thật và giả.' },
  { icon: 'lock', title: 'Tài khoản của em', text: 'Mật khẩu mạnh và quyền riêng tư.' },
] as const;

export default function Welcome({ onClaimCard, onHaveCode, onTeacher }: Props) {
  return (
    <div className="mx-auto grid grid-cols-1 max-w-5xl gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-violet-600 p-7 text-white shadow-pop sm:p-10">
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <p className="m-0 text-sm font-bold tracking-widest text-white/80 uppercase">Dự án nghiên cứu khoa học học đường</p>
        <h1 className="mt-3 mb-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
          Chào em, hãy cùng học cách giữ an toàn khi dùng điện thoại!
        </h1>
        <p className="m-0 max-w-xl text-lg text-white/90">
          Em sẽ gặp các tình huống giống thật. Em chọn cách xử lý, nhận giải thích ngay và rút ra bài học cho mình.
        </p>

        <ul className="mt-7 mb-0 grid grid-cols-1 list-none gap-3 p-0 sm:grid-cols-3">
          {SCENES.map((s) => (
            <li key={s.title} className="rounded-2xl bg-white/12 p-4 ring-1 ring-white/20 backdrop-blur">
              <Icon name={s.icon} size={22} />
              <p className="mt-2 mb-0.5 font-bold">{s.title}</p>
              <p className="m-0 text-sm text-white/80">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <Card className="grid grid-cols-1 gap-3 p-6">
          <h2 className="m-0 text-xl font-extrabold text-ink">Bắt đầu</h2>
          <Button variant="primary" size="lg" icon="idCard" block onClick={onClaimCard}>
            Em có thẻ mã từ giáo viên
          </Button>
          <Button variant="secondary" size="lg" icon="key" block onClick={onHaveCode}>
            Em đã kích hoạt, đăng nhập
          </Button>
          <p className="m-0 text-sm text-ink-soft">
            Chương trình chỉ dành cho học sinh tham gia nghiên cứu có phụ huynh và nhà trường đồng ý.
          </p>
        </Card>

        <Card className="grid grid-cols-1 gap-2 p-6">
          <h2 className="m-0 text-base font-bold text-ink">Dành cho giáo viên</h2>
          <p className="m-0 text-sm text-ink-soft">
            Đăng nhập bằng tài khoản do nhóm kỹ thuật cấp để xem tiến độ lớp, tạo và in thẻ cho học sinh.
          </p>
          <Button variant="soft" icon="users" onClick={onTeacher}>
            Giáo viên đăng nhập
          </Button>
        </Card>
      </div>
    </div>
  );
}
