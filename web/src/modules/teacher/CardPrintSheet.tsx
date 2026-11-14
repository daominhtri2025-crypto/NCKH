import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../components/icons';
import { Button } from '../../components/ui';
import StudentCard from './StudentCard';

interface Props {
  codes: string[];
  classCode: string;
  onClose: () => void;
}

const CARDS_PER_PAGE = 10;

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

/**
 * Trang xem trước và in thẻ học sinh. Vẽ qua portal ra ngoài #root để CSS in
 * (index.css) ẩn phần còn lại của ứng dụng và chỉ in các thẻ.
 * "Lưu PDF" dùng chính hộp thoại in của trình duyệt (chọn "Lưu dưới dạng PDF").
 */
export default function CardPrintSheet({ codes, classCode, onClose }: Props) {
  const pages = useMemo(() => chunk(codes, CARDS_PER_PAGE), [codes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Khóa cuộn nền trong lúc xem trước.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div className="sc-print-root fixed inset-0 z-[60] overflow-auto bg-slate-200 text-slate-900" role="dialog" aria-modal="true" aria-label="Xem trước thẻ học sinh">
      <div className="no-print sticky top-0 z-10 border-b border-slate-300 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="m-0 text-base font-extrabold">In thẻ học sinh · Lớp {classCode}</p>
            <p className="m-0 text-sm text-slate-600">
              {codes.length} thẻ · {pages.length} trang A4 (10 thẻ mỗi trang). Để lưu PDF, chọn <strong>“Lưu dưới dạng PDF”</strong> trong hộp thoại in.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" icon="x" onClick={onClose}>Đóng</Button>
            <Button variant="primary" icon="printer" onClick={() => window.print()}>In / Lưu PDF</Button>
          </div>
        </div>
      </div>

      {codes.length === 0 ? (
        <p className="no-print m-0 p-10 text-center text-slate-600">
          <Icon name="idCard" size={28} className="mx-auto mb-2" /> Chưa có thẻ nào để in.
        </p>
      ) : (
        <div className="mx-auto grid grid-cols-1 max-w-5xl gap-6 p-4 print:p-0">
          {pages.map((page, i) => (
            <section
              key={i}
              aria-label={`Trang ${i + 1}`}
              className="sc-section rounded-xl bg-white p-4 shadow-md print:rounded-none print:bg-transparent print:p-0 print:shadow-none"
            >
              <div className="sc-sheet-page">
                {page.map((code) => (
                  <StudentCard key={code} code={code} classCode={classCode} />
                ))}
              </div>
              <p className="no-print mt-3 mb-0 text-center text-xs text-slate-500">Trang {i + 1}/{pages.length}</p>
            </section>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}
