import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Hộp thoại xác nhận. Đóng bằng phím Esc; nút xác nhận nhận tiêu điểm khi mở. */
export default function Modal({ title, children, confirmLabel, danger = false, busy = false, onConfirm, onCancel }: Props) {
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
    <div className="modal-backdrop" onClick={() => !busy && onCancel()}>
      <div className="modal card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="modal-title">{title}</h3>
        <div className="modal-body">{children}</div>
        <div className="row-actions">
          <button ref={confirmRef} className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={busy}>
            {busy ? 'Đang xử lý…' : confirmLabel}
          </button>
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>Hủy</button>
        </div>
      </div>
    </div>
  );
}
