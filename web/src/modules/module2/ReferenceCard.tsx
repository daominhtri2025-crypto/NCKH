import type { Module2Overview } from '../../lib/types';

interface Props {
  overview: Pick<Module2Overview, 'rule' | 'official_roots' | 'reference_note'>;
}

/** Thẻ tham chiếu: tên gốc chính thức và ba bước đọc tên miền. */
export default function ReferenceCard({ overview }: Props) {
  return (
    <section className="card reference">
      <h3>Tên gốc chính thức cần nhớ</h3>
      <ul className="root-list">
        {overview.official_roots.map((root) => (
          <li key={root}><code>{root}</code></li>
        ))}
      </ul>

      <h3>{overview.rule.name}</h3>
      <ol className="rule-steps">
        {overview.rule.steps.map((step) => (
          <li key={step}>{step.replace(/^Bước \d+: /, '')}</li>
        ))}
      </ol>

      <p className="fineprint">{overview.reference_note}</p>
    </section>
  );
}
