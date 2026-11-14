import type { ReactNode } from 'react';
import { Card } from './ui';
import Icon from './icons';

interface Props {
  title: string;
  lead?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
}

/** Khung dùng chung cho các màn nhập mã / đăng nhập: thẻ giữa trang, có nút quay lại. */
export default function AuthLayout({ title, lead, onBack, children }: Props) {
  return (
    <section className="mx-auto w-full max-w-md">
      <Card className="p-6 sm:p-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg text-sm font-semibold text-ink-soft transition hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
          >
            <Icon name="arrowLeft" size={16} />
            Quay lại
          </button>
        )}
        <h2 className="m-0 text-2xl font-extrabold tracking-tight text-ink">{title}</h2>
        {lead && <p className="mt-2 mb-5 text-ink-soft">{lead}</p>}
        {children}
      </Card>
    </section>
  );
}
