import { useState } from 'react';
import type { Participant } from '../lib/types';

interface Props {
  participant: Participant;
  onContinue: () => void;
}

/** Hiển thị mã học sinh đúng một lần để học sinh ghi lại. */
export default function CodeReveal({ participant, onContinue }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(participant.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="card center">
      <h2>Mã học sinh của em</h2>
      <p className="code-display" aria-label={`Mã học sinh ${participant.code}`}>{participant.code}</p>
      <p className="lead">
        Hãy ghi mã này vào vở hoặc chụp màn hình. Khi đăng nhập lại, em cần nhập đúng mã này.
        Mã không chứa tên em.
      </p>
      <div className="stack">
        <button className="btn btn-ghost" onClick={copy}>
          {copied ? 'Đã sao chép' : 'Sao chép mã'}
        </button>
        <button className="btn btn-primary btn-xl" onClick={onContinue}>
          Em đã ghi lại mã, bắt đầu
        </button>
      </div>
    </section>
  );
}
