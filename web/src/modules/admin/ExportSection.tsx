import { PageTitle, Card } from '../../components/ui';
import Icon, { type IconName } from '../../components/icons';

interface Item {
  title: string;
  description: string;
  href: string;
  icon: IconName;
  filename: string;
}

const ITEMS: Item[] = [
  {
    title: 'CSV dạng long',
    description: 'Một dòng cho mỗi câu trả lời. Gồm giai đoạn, mã câu, đáp án, đúng/sai và thời gian phản hồi (mili giây).',
    href: '/api/admin/data/export/long',
    icon: 'fileText',
    filename: 'long.csv',
  },
  {
    title: 'CSV dạng wide',
    description: 'Một dòng cho mỗi học sinh, các giai đoạn trải ngang. Gồm điểm kiến thức, điểm hành vi và thời gian phản hồi trung bình theo từng giai đoạn, sẵn sàng cho kiểm định trước–sau.',
    href: '/api/admin/data/export/wide',
    icon: 'chart',
    filename: 'wide.csv',
  },
];

/**
 * Xuất dữ liệu nghiên cứu. Tệp chỉ gồm học sinh đang hoạt động và không có họ tên. Cột `pseudonym`
 * là mã định danh nghiên cứu ngẫu nhiên, KHÁC mã thẻ đăng nhập; mã thẻ không bao giờ có trong tệp.
 */
export default function ExportSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <PageTitle
        title="Xuất dữ liệu CSV"
        subtitle="Tệp gồm học sinh đang hoạt động. Không có họ tên và không có mã thẻ đăng nhập; mỗi học sinh được nhận diện bằng một mã định danh nghiên cứu ngẫu nhiên và mã lớp."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ITEMS.map((item) => (
          <Card key={item.href} className="flex flex-col gap-3 p-6 transition hover:-translate-y-0.5 hover:shadow-pop">
            <span className="grid grid-cols-1 size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Icon name={item.icon} size={24} />
            </span>
            <h2 className="m-0 text-lg font-extrabold text-ink">{item.title}</h2>
            <p className="m-0 flex-1 text-sm text-ink-soft">{item.description}</p>
            <a
              href={item.href}
              download={item.filename}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 font-semibold text-brand-ink no-underline shadow-card transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Icon name="download" size={18} /> Tải xuống
            </a>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <p className="m-0 text-sm text-ink-soft">
          <strong className="text-ink">Mã định danh nghiên cứu:</strong> cột <code>pseudonym</code> (dạng <code>R…</code>, 10 ký tự) là mã ngẫu nhiên, độc lập với mã thẻ
          và không dùng để đăng nhập; mã này giữ nguyên khi học sinh được cấp lại thẻ nên vẫn nối được dữ liệu các giai đoạn.
          Tệp vẫn có mã lớp, nên hãy lưu an toàn và không công bố dữ liệu từng học sinh khi chưa tổng hợp.
          Tệp wide chấm điểm theo đúng phiên bản bộ câu hỏi của từng học sinh.
        </p>
      </Card>
    </div>
  );
}
