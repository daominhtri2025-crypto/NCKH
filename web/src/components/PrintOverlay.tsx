import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui';

interface Props {
  title: string;
  hint?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Lớp phủ xem trước tài liệu cần in (báo cáo). Vẽ qua portal ra ngoài #root để CSS in
 * ẩn phần còn lại của ứng dụng; thanh công cụ có lớp no-print nên không xuất hiện trên giấy.
 */
export default function PrintOverlay({ title, hint, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div className="sc-print-root fixed inset-0 z-[60] overflow-auto bg-slate-200 text-slate-900" role="dialog" aria-modal="true" aria-label={title}>
      <div className="no-print sticky top-0 z-10 border-b border-slate-300 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="m-0 text-base font-extrabold">{title}</p>
            {hint && <p className="m-0 text-sm text-slate-600">{hint}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" icon="x" onClick={onClose}>Đóng</Button>
            <Button variant="primary" icon="printer" onClick={() => window.print()}>In / Lưu PDF</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl p-4 print:max-w-none print:p-0">
        <article className="rounded-xl bg-white p-8 shadow-md print:rounded-none print:p-0 print:shadow-none">{children}</article>
      </div>
    </div>,
    document.body,
  );
}
