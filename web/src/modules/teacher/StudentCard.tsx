import Icon from '../../components/icons';
import QrCode from '../../components/QrCode';
import { PROJECT, appOrigin, cardLink } from '../../lib/project';

interface Props {
  code: string;
  classCode: string;
}

/**
 * Một thẻ học sinh (85,6 × 54 mm). Cố ý KHÔNG có họ tên hay ảnh: dự án giữ ẩn danh học sinh,
 * danh tính chỉ nằm trong sổ phát thẻ của giáo viên. Màu cố định để bản in đồng nhất.
 */
export default function StudentCard({ code, classCode }: Props) {
  const host = appOrigin().replace(/^https?:\/\//, '');
  return (
    <article
      className="sc-card relative flex flex-col overflow-hidden rounded-[3mm] border border-slate-300 bg-white text-slate-900 shadow-sm"
      aria-label={`Thẻ học sinh ${code}`}
    >
      <header className="flex h-[10mm] shrink-0 items-center gap-[2mm] bg-gradient-to-r from-indigo-600 to-violet-600 px-[4mm] text-white">
        <span className="grid grid-cols-1 size-[6mm] place-items-center rounded-[1.5mm] bg-white/20">
          <Icon name="shield" size={14} />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="m-0 truncate text-[7.5pt] font-extrabold tracking-wide uppercase">{PROJECT.name}</p>
          <p className="m-0 truncate text-[5pt] text-white/85">Thẻ học sinh tham gia nghiên cứu</p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-between gap-[3mm] px-[4mm]">
        <div className="min-w-0">
          <p className="m-0 text-[5.5pt] font-bold tracking-widest text-slate-500 uppercase">Lớp</p>
          <p className="m-0 mb-[1.5mm] text-[10pt] leading-tight font-extrabold">{classCode}</p>
          <p className="m-0 text-[5.5pt] font-bold tracking-widest text-slate-500 uppercase">Mã kích hoạt</p>
          <p className="m-0 rounded-[1.5mm] bg-indigo-50 px-[2mm] py-[0.8mm] font-mono text-[14pt] leading-tight font-extrabold tracking-[0.12em] whitespace-nowrap text-indigo-700">
            {code}
          </p>
        </div>
        <div className="shrink-0 rounded-[1.5mm] border border-slate-200 bg-white p-[0.8mm]">
          <QrCode value={cardLink(code)} className="block size-[23mm]" title={`Mã QR kích hoạt thẻ ${code}`} />
        </div>
      </div>

      <footer className="shrink-0 border-t border-slate-200 bg-slate-50 px-[4mm] py-[1.2mm] text-[5.5pt] leading-snug text-slate-600">
        <p className="m-0 truncate">
          Quét mã QR hoặc vào <strong className="text-slate-800">{host}</strong> và nhập mã. Giữ kín mã, không chia sẻ.
        </p>
        <p className="m-0 truncate">{PROJECT.school}</p>
      </footer>
    </article>
  );
}
