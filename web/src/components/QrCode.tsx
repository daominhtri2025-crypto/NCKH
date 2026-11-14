import { useMemo } from 'react';
import { encode } from 'uqr';

interface Props {
  value: string;
  /** Màu module QR; mặc định đen để in ra giấy quét được ổn định. */
  color?: string;
  className?: string;
  title?: string;
}

/**
 * Mã QR vẽ bằng một đường dẫn SVG duy nhất (nền trắng, vùng yên tĩnh 2 ô).
 * Sinh hoàn toàn trên trình duyệt: nội dung thẻ không rời khỏi máy.
 */
export default function QrCode({ value, color = '#000', className, title = 'Mã QR' }: Props) {
  const { size, path } = useMemo(() => {
    const { data: matrix, size: n } = encode(value, { ecc: 'M', border: 0 });
    let d = '';
    for (let y = 0; y < n; y++) {
      let x = 0;
      while (x < n) {
        if (!matrix[y][x]) {
          x++;
          continue;
        }
        const start = x;
        while (x < n && matrix[y][x]) x++;
        d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
      }
    }
    return { size: n, path: d };
  }, [value]);

  const quiet = 2;
  const total = size + quiet * 2;
  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      className={className}
      role="img"
      aria-label={title}
      shapeRendering="crispEdges"
    >
      <rect width={total} height={total} fill="#fff" />
      <path transform={`translate(${quiet} ${quiet})`} d={path} fill={color} />
    </svg>
  );
}
