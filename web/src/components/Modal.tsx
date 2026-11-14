import { ReactNode, useEffect, useRef } from 'react';
import { Button, Card } from './ui';

interface Props {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  /** Vô hiệu hóa nút xác nhận (ví dụ chưa tích ô xác nhận). */
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Hộp thoại xác nhận. Đóng bằng phím Esc; nút xác nhận nhận tiêu điểm khi mở. */
export default function Modal({ title, children, confirmLabel, cancelLabel = 'Hủy', danger = false, busy = false, confirmDisabled = false, onConfirm, onCancel }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 grid grid-cols-1 place-items-center overflow-y-auto bg-slate-900/55 p-4 backdrop-blur-sm no-print"
      onClick={() => !busy && onCancel()}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="grid grid-cols-1 w-full max-w-lg gap-4 p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="modal-title" className="m-0 text-xl font-extrabold text-ink">{title}</h3>
        <div className="text-ink">{children}</div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>{cancelLabel}</Button>
          <Button ref={confirmRef} variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy || confirmDisabled}>
            {busy ? 'Đang xử lý…' : confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
