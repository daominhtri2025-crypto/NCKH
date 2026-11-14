import type { SVGProps } from 'react';

/** Bộ biểu tượng nét 24×24, màu theo `currentColor`. Không phụ thuộc thư viện ngoài. */
const PATHS = {
  shield: ['M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6l8-3z', 'M9 12l2 2 4-4'],
  dashboard: ['M4 4h7v7H4z', 'M13 4h7v4h-7z', 'M13 10h7v10h-7z', 'M4 13h7v7H4z'],
  user: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6'],
  users: ['M9 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M2.5 20c0-3 2.9-5 6.5-5s6.5 2 6.5 5', 'M16 5.2a3.5 3.5 0 010 6.6', 'M18 15.4c2 .6 3.5 2 3.5 4.6'],
  help: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1.1-1.5 2.2', 'M12 17h.01'],
  chart: ['M5 21V11', 'M12 21V4', 'M19 21v-7'],
  download: ['M12 4v11', 'M7 11l5 5 5-5', 'M5 20h14'],
  printer: ['M7 8V3h10v5', 'M7 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2h-2', 'M7 14h10v7H7z'],
  logout: ['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  x: ['M6 6l12 12', 'M18 6L6 18'],
  search: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.3-4.3'],
  check: ['M5 12l5 5 9-10'],
  circleCheck: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M8 12l3 3 5-6'],
  lock: ['M6 11h12v9H6z', 'M8 11V8a4 4 0 118 0v3'],
  bell: ['M6 16v-5a6 6 0 1112 0v5l2 2H4l2-2z', 'M10 21h4'],
  flag: ['M5 21V4', 'M5 4h11l-2 4 2 4H5'],
  target: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 16a4 4 0 100-8 4 4 0 000 8z', 'M12 12h.01'],
  plus: ['M12 5v14', 'M5 12h14'],
  idCard: ['M3 6h18v12H3z', 'M7.5 11.5a1.8 1.8 0 103.6 0 1.8 1.8 0 00-3.6 0', 'M6.5 16c.6-1.3 1.7-1.8 2.8-1.8s2.2.5 2.8 1.8', 'M15 10h3', 'M15 13.5h3'],
  refresh: ['M20 11a8 8 0 10-2.3 5.7', 'M20 4v7h-7'],
  edit: ['M4 20h4L19 9l-4-4L4 16v4z'],
  trash: ['M5 7h14', 'M10 4h4', 'M7 7l1 13h8l1-13'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronRight: ['M9 6l6 6-6 6'],
  arrowLeft: ['M19 12H5', 'M11 6l-6 6 6 6'],
  clock: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 7v5l3 2'],
  key: ['M8 20a4 4 0 100-8 4 4 0 000 8z', 'M10.8 13.2L20 4', 'M16.5 7.5l2.5 2.5', 'M13.5 10.5l2 2'],
  globe: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M3 12h18', 'M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z'],
  message: ['M4 5h16v11H9l-5 4V5z'],
  fileText: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h6', 'M10 17h6'],
} as const;

export type IconName = keyof typeof PATHS;

interface Props extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 20, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
