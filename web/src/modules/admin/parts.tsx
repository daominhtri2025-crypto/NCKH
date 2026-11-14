import type { ReactNode } from 'react';
import { Card } from '../../components/ui';

export const th = 'px-4 py-3 text-left text-xs font-bold tracking-wide whitespace-nowrap text-ink-soft uppercase';
export const td = 'px-4 py-3 align-middle';

/** Bảng dữ liệu có cuộn ngang trên màn hình nhỏ. */
export function DataTable({ head, children, minWidth = 560 }: { head: ReactNode; children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm" style={{ minWidth }}>
        <thead>
          <tr className="bg-canvas">{head}</tr>
        </thead>
        <tbody className="[&>tr]:border-t [&>tr]:border-line [&>tr:hover]:bg-brand-soft/40">{children}</tbody>
      </table>
    </div>
  );
}

/** Thẻ mục: tiêu đề, mô tả ngắn, vùng thao tác bên phải. */
export function Section({ title, hint, actions, children, padded = true }: { title: string; hint?: ReactNode; actions?: ReactNode; children: ReactNode; padded?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <h2 className="m-0 text-lg font-extrabold text-ink">{title}</h2>
          {hint && <p className="mt-1 mb-0 text-sm text-ink-soft">{hint}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className={padded ? 'p-5' : 'pt-4'}>{children}</div>
    </Card>
  );
}
