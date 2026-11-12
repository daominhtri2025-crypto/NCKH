export interface Bar {
  label: string;
  value: number | null; // null = ô bị ẩn (ít hơn 5 học sinh)
  n: number;
}

interface Props {
  bars: Bar[];
  max?: number;
  unit?: string;
  ariaLabel: string;
}

/** Biểu đồ cột ngang bằng HTML/CSS, co theo chiều rộng màn hình. Ô bị ẩn hiển thị nhãn thay vì cột. */
export default function BarChart({ bars, max = 100, unit = '%', ariaLabel }: Props) {
  return (
    <ul className="bar-chart" aria-label={ariaLabel}>
      {bars.map((b) => {
        const pct = b.value === null ? 0 : Math.max(0, Math.min(100, (b.value / max) * 100));
        return (
          <li key={b.label} className="bar-row">
            <div className="bar-head">
              <span className="bar-label">{b.label}</span>
              <span className="bar-value">
                {b.value === null ? `ẩn (n=${b.n})` : `${b.value.toFixed(1)}${unit} (n=${b.n})`}
              </span>
            </div>
            <div className="bar-track" role="presentation">
              {b.value !== null && <div className="bar-fill" style={{ width: `${pct}%` }} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
