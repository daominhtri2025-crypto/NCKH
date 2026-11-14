import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/**
 * Biểu đồ dùng chung (Recharts). Màu lấy từ biến CSS (--chart-1…) và --ink/--line
 * nên tự đổi theo chế độ sáng/tối. Mọi biểu đồ có nhãn văn bản cho trình đọc màn hình.
 */

const AXIS = { fill: 'var(--ink-soft)', fontSize: 12 } as const;

const TOOLTIP = {
  contentStyle: {
    background: 'var(--surface)',
    border: '1px solid var(--line)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-pop)',
    color: 'var(--ink)',
    fontSize: 13,
  },
  labelStyle: { color: 'var(--ink)', fontWeight: 700 },
  cursor: { fill: 'var(--brand-soft)' },
} as const;

export const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'] as const;

function Frame({ height, ariaLabel, children }: { height: number; ariaLabel: string; children: React.ReactElement }) {
  return (
    <div role="img" aria-label={ariaLabel} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export interface SimpleDatum {
  name: string;
  value: number;
}

/** Cột ngang: dùng cho "phễu" các chặng nghiên cứu, nhãn dài vẫn đọc được trên điện thoại. */
export function HorizontalBars({ data, ariaLabel, height = 260 }: { data: SimpleDatum[]; ariaLabel: string; height?: number }) {
  return (
    <Frame height={height} ariaLabel={ariaLabel}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }}>
        <CartesianGrid horizontal={false} stroke="var(--line)" />
        <XAxis type="number" allowDecimals={false} tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={118} tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} formatter={(v) => [String(v), 'Học sinh']} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
          <LabelList dataKey="value" position="right" style={{ fill: 'var(--ink)', fontSize: 12, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </Frame>
  );
}

export interface Series {
  key: string;
  label: string;
  color: string;
}

/** Cột nhóm: so sánh nhiều chuỗi theo từng nhóm. Giá trị null (ô bị ẩn) không vẽ cột. */
export function GroupedColumns({
  data,
  series,
  ariaLabel,
  height = 280,
  unit = '',
  max,
}: {
  data: Array<Record<string, string | number | null>>;
  series: Series[];
  ariaLabel: string;
  height?: number;
  unit?: string;
  max?: number;
}) {
  return (
    <Frame height={height} ariaLabel={ariaLabel}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} domain={max ? [0, max] : undefined} />
        <Tooltip {...TOOLTIP} formatter={(v) => (v === null || v === undefined ? '—' : `${v}${unit}`)} />
        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--ink-soft)' }} iconType="circle" />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[6, 6, 0, 0]} maxBarSize={34} />
        ))}
      </BarChart>
    </Frame>
  );
}

export interface ColumnDatum {
  name: string;
  /** null = ô bị ẩn vì ít hơn ngưỡng tối thiểu; không vẽ cột. */
  value: number | null;
  label: string;
}

/** Một chuỗi cột đứng có nhãn trên đầu cột (dùng cho điểm theo giai đoạn). */
export function LabeledColumns({ data, ariaLabel, height = 260, max = 100 }: { data: ColumnDatum[]; ariaLabel: string; height?: number; max?: number }) {
  return (
    <Frame height={height} ariaLabel={ariaLabel}>
      <BarChart data={data} margin={{ top: 22, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={[0, max]} />
        <Tooltip {...TOOLTIP} formatter={(_v, _n, item) => [(item.payload as ColumnDatum).label, 'Giá trị']} />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
          <LabelList dataKey="label" position="top" style={{ fill: 'var(--ink)', fontSize: 12, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </Frame>
  );
}

export interface Slice {
  name: string;
  value: number;
  color: string;
}

/** Biểu đồ vành khuyên, hiển thị số/nhãn ở giữa. */
export function Donut({ slices, centerValue, centerLabel, ariaLabel, height = 220 }: { slices: Slice[]; centerValue: string; centerLabel: string; ariaLabel: string; height?: number }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const data = total > 0 ? slices : [{ name: 'Chưa có dữ liệu', value: 1, color: 'var(--line)' }];
  return (
    <div className="relative" style={{ height }}>
      <div role="img" aria-label={ariaLabel} style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="92%" paddingAngle={total > 0 ? 3 : 0} stroke="none" cornerRadius={6}>
              {data.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
            {total > 0 && <Tooltip {...TOOLTIP} formatter={(v, n) => [String(v), String(n)]} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pointer-events-none absolute inset-0 grid grid-cols-1 place-content-center text-center">
        <p className="m-0 text-3xl font-extrabold tracking-tight text-ink tabular-nums">{centerValue}</p>
        <p className="m-0 text-xs font-semibold text-ink-soft">{centerLabel}</p>
      </div>
    </div>
  );
}

export function LegendDots({ items }: { items: Array<{ name: string; value: number; color: string }> }) {
  return (
    <ul className="m-0 mt-2 flex list-none flex-wrap justify-center gap-x-4 gap-y-1 p-0 text-sm text-ink-soft">
      {items.map((i) => (
        <li key={i.name} className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: i.color }} aria-hidden="true" />
          {i.name}: <strong className="text-ink tabular-nums">{i.value}</strong>
        </li>
      ))}
    </ul>
  );
}
