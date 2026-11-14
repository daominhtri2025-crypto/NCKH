/** Kiểu dữ liệu trả về bởi các endpoint quản trị hiện có (không đổi phía máy chủ). */

export interface Cell {
  n: number;
  suppressed: boolean;
  mean?: number;
  sd?: number;
  median?: number;
}

export interface ClassRow {
  class_code: string;
  issued: number;
  active: number;
  pre_done: number;
  post_done: number;
  delayed_done: number;
}

export interface PhaseSummary {
  n: number;
  knowledge_pct_mean: Cell;
  behavior_mean: Cell;
}

export interface Paired {
  n: number;
  mean_difference: Cell;
}

export interface TopicCell {
  n: number;
  correct_pct: number | null;
}

export interface TopicRow {
  topic: string;
  pre: TopicCell;
  post: TopicCell;
  delayed: TopicCell;
}

export interface AnalyticsOverview {
  n_active: number;
  min_cell: number;
  classes: ClassRow[];
  phases: Record<'pre' | 'post' | 'delayed', PhaseSummary>;
  paired: { pre_post: Paired; pre_delayed: Paired };
  topics: TopicRow[];
  note: string;
}

export interface AdminTeacher {
  id: number;
  username: string;
  role: 'teacher' | 'admin';
  class_code: string | null;
  active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export type AdminSection = 'overview' | 'teachers' | 'questions' | 'analytics' | 'export' | 'report';

export const PHASE_LABEL = {
  pre: 'Đầu vào (trước can thiệp)',
  post: 'Sau can thiệp',
  delayed: 'Theo dõi (sau 28 ngày)',
} as const;

export const PHASE_SHORT = { pre: 'Đầu vào', post: 'Sau can thiệp', delayed: 'Theo dõi' } as const;

export function cellValue(c: Cell | undefined, digits = 1): number | null {
  return c && !c.suppressed && c.mean !== undefined ? Number(c.mean.toFixed(digits)) : null;
}

/** Tổng hợp toàn trường từ bảng theo lớp. */
export function sumClasses(classes: ClassRow[]) {
  return classes.reduce(
    (acc, c) => ({
      issued: acc.issued + c.issued,
      active: acc.active + c.active,
      pre_done: acc.pre_done + c.pre_done,
      post_done: acc.post_done + c.post_done,
      delayed_done: acc.delayed_done + c.delayed_done,
    }),
    { issued: 0, active: 0, pre_done: 0, post_done: 0, delayed_done: 0 },
  );
}

export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

/** Số học sinh theo thời gian, từ GET /admin/analytics/timeline. */
export type TimelineMetric = 'issued' | 'activated' | 'pre_done' | 'post_done' | 'delayed_done';

export interface TimelinePoint {
  period: string;
  new: Record<TimelineMetric, number>;
  cumulative: Record<TimelineMetric, number>;
}

export interface Timeline {
  granularity: 'day' | 'month';
  span: number;
  from: string;
  to: string;
  points: TimelinePoint[];
  totals: Record<TimelineMetric, number>;
  note: string;
}

export const TIMELINE_LABEL: Record<TimelineMetric, string> = {
  issued: 'Đã phát thẻ',
  activated: 'Đã kích hoạt',
  pre_done: 'Xong đầu vào',
  post_done: 'Xong sau can thiệp',
  delayed_done: 'Xong theo dõi',
};
