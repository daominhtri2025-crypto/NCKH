interface Props {
  host: string;
  rootDomain: string;
}

/**
 * Minh họa quy tắc "đọc từ phải sang trái": các nhãn của tên miền được xếp từ phải sang trái,
 * phần gốc (root_domain) được tô nổi bật, phần tên miền con được làm mờ.
 */
export default function ReadingBreakdown({ host, rootDomain }: Props) {
  const labels = host.split('.');
  const rootCount = rootDomain.split('.').length;
  const fromRight = labels.map((label, index) => ({
    label,
    isRoot: index >= labels.length - rootCount,
    isTld: index === labels.length - 1,
  })).reverse();

  return (
    <div className="reading" aria-label={`Đọc tên miền ${host} từ phải sang trái`}>
      <div className="reading-chips">
        {fromRight.map((chip, i) => (
          <span key={`${chip.label}-${i}`} className="reading-item">
            <span
              className={[
                'reading-chip',
                chip.isRoot ? 'is-root' : 'is-sub',
                chip.isTld ? 'is-tld' : '',
              ].filter(Boolean).join(' ')}
            >
              {chip.label}
            </span>
            {i < fromRight.length - 1 && <span className="reading-arrow" aria-hidden="true">←</span>}
          </span>
        ))}
      </div>
      <p className="reading-legend small">
        <span className="legend-swatch is-tld" /> đuôi miền &nbsp;
        <span className="legend-swatch is-root" /> phần gốc (tên đăng ký) &nbsp;
        <span className="legend-swatch is-sub" /> tên miền con
      </p>
    </div>
  );
}
