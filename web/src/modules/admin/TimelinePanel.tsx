import { useEffect, useMemo, useState } from 'react';
import { CHART_COLORS, GroupedColumns, TrendLines } from '../../components/charts';
import { api, ApiError } from '../../lib/api';
import { Alert, cx } from '../../components/ui';
import { Section } from './parts';
import { TIMELINE_LABEL, type Timeline, type TimelineMetric } from './types';

interface Range {
  key: string;
  label: string;
  granularity: 'day' | 'month';
  span: number;
}

const RANGES: Range[] = [
  { key: 'd30', label: '30 ngày', granularity: 'day', span: 30 },
  { key: 'd90', label: '90 ngày', granularity: 'day', span: 90 },
  { key: 'm12', label: '12 tháng', granularity: 'month', span: 12 },
];

type Mode = 'cumulative' | 'new';

const METRICS: TimelineMetric[] = ['issued', 'activated', 'pre_done', 'post_done', 'delayed_done'];

function label(period: string, granularity: 'day' | 'month'): string {
  // 2026-11-14 -> 14/11 ; 2026-11 -> 11/2026
  if (granularity === 'day') return `${period.slice(8, 10)}/${period.slice(5, 7)}`;
  return `${period.slice(5, 7)}/${period.slice(0, 4)}`;
}

function Segmented<T extends string>({ value, options, onChange, name }: { value: T; options: Array<{ key: T; label: string }>; onChange: (v: T) => void; name: string }) {
  return (
    <div role="group" aria-label={name} className="inline-flex rounded-xl bg-line/50 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={cx(
            'min-h-8 cursor-pointer rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-brand',
            value === o.key ? 'bg-surface text-brand shadow-sm' : 'text-ink-soft hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Biểu đồ số học sinh theo thời gian, lấy từ endpoint /admin/analytics/timeline (dữ liệu thật, không tĩnh). */
export default function TimelinePanel() {
  const [rangeKey, setRangeKey] = useState('d30');
  const [mode, setMode] = useState<Mode>('cumulative');
  const [data, setData] = useState<Timeline | null>(null);
  const [error, setError] = useState<string | null>(null);

  const range = RANGES.find((r) => r.key === rangeKey) ?? RANGES[0];

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get<Timeline>(`/admin/analytics/timeline?granularity=${range.granularity}&span=${range.span}`)
      .then((d) => !cancelled && setData(d))
      .catch((err) => !cancelled && setError(err instanceof ApiError ? err.message : 'Không tải được dữ liệu theo thời gian.'));
    return () => {
      cancelled = true;
    };
  }, [range.granularity, range.span]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.points.map((p) => {
      const row: Record<string, string | number> = { name: label(p.period, data.granularity) };
      if (mode === 'cumulative') {
        for (const m of METRICS) row[m] = p.cumulative[m];
      } else {
        // Chế độ phát sinh mới gộp ba loại khảo sát thành một chuỗi để cột đủ rộng, dễ đọc.
        row.issued = p.new.issued;
        row.activated = p.new.activated;
        row.surveys = p.new.pre_done + p.new.post_done + p.new.delayed_done;
      }
      return row;
    });
  }, [data, mode]);

  const lineSeries = METRICS.map((m, i) => ({ key: m, label: TIMELINE_LABEL[m], color: CHART_COLORS[i % CHART_COLORS.length] }));
  const barSeries = [
    { key: 'issued', label: TIMELINE_LABEL.issued, color: CHART_COLORS[0] },
    { key: 'activated', label: TIMELINE_LABEL.activated, color: CHART_COLORS[1] },
    { key: 'surveys', label: 'Khảo sát vừa hoàn thành', color: CHART_COLORS[2] },
  ];
  const empty = data !== null && METRICS.every((m) => data.totals[m] === 0);

  return (
    <Section
      title="Số học sinh theo thời gian"
      hint={
        mode === 'cumulative'
          ? 'Số tích lũy tại cuối mỗi kỳ: thẻ đã phát, đã kích hoạt và đã xong từng khảo sát.'
          : 'Số phát sinh mới trong từng kỳ: thẻ phát ra, kích hoạt mới và khảo sát vừa hoàn thành.'
      }
      actions={
        <>
          <Segmented name="Khoảng thời gian" value={rangeKey} options={RANGES.map((r) => ({ key: r.key, label: r.label }))} onChange={setRangeKey} />
          <Segmented name="Kiểu hiển thị" value={mode} options={[{ key: 'cumulative', label: 'Tích lũy' }, { key: 'new', label: 'Phát sinh mới' }]} onChange={setMode} />
        </>
      }
    >
      {error && <Alert>{error}</Alert>}
      {!data && !error && <p className="m-0 py-16 text-center text-ink-soft">Đang tải…</p>}
      {data && empty && <p className="m-0 py-16 text-center text-ink-soft">Chưa có hoạt động nào trong khoảng thời gian này.</p>}
      {data && !empty && (
        <>
          {mode === 'cumulative' ? (
            <TrendLines data={chartData} series={lineSeries} ariaLabel="Số học sinh tích lũy theo thời gian" />
          ) : (
            <GroupedColumns data={chartData} series={barSeries} ariaLabel="Số học sinh phát sinh mới theo thời gian" height={300} />
          )}
          <p className="mt-2 mb-0 text-xs text-ink-soft">
            Từ {data.from} đến {data.to} · {data.granularity === 'day' ? 'theo ngày' : 'theo tháng'} · múi giờ máy chủ.
          </p>
        </>
      )}
    </Section>
  );
}
