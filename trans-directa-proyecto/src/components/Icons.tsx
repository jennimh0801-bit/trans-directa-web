import type { SVGProps } from "react";

const paths: Record<string, React.ReactNode> = {
  route: (
    <>
      <circle cx="6" cy="18" r="2.6" />
      <circle cx="18" cy="6" r="2.6" />
      <path d="M8.6 18h5.2a3.6 3.6 0 0 0 0-7.2h-3.6a3.6 3.6 0 0 1 0-7.2h5.2" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 9.5v4l2.6 1.8M9.5 2.5h5" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.6" />
      <path d="M12 12 19 7" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  signature: (
    <>
      <path d="M3 17.5c3.4 0 3.6-11 6.4-11 1.9 0 1.2 7.4 3.4 7.4 1.6 0 1.7-4.2 3.3-4.2 1.3 0 1.2 3 2.6 3 .9 0 1.5-.6 2.3-1.6" />
      <path d="M3 21h18" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.5 6v6c0 4.4 3.1 8.2 7.5 9.3 4.4-1.1 7.5-4.9 7.5-9.3V6z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </>
  ),
  code: (
    <>
      <path d="m8.5 8-4.5 4 4.5 4M15.5 8l4.5 4-4.5 4M13.6 4.5l-3.2 15" />
    </>
  ),
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8m9 0v9" />,
  arrowDown: <path d="M12 4v15m6-6-6 6-6-6" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  phone: (
    <path d="M6.2 3.5h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.4 6.4l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.8 7 7.1 5.3a2 2 0 0 0 2.2 0L20.2 7" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  star: (
    <path
      d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.8l5.9-.9z"
      fill="currentColor"
      stroke="none"
    />
  ),
  chevronDown: <path d="m6 9.5 6 6 6-6" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  package: (
    <>
      <path d="M20.5 7.8v8.4a1.8 1.8 0 0 1-.95 1.6l-6.7 3.6a1.8 1.8 0 0 1-1.7 0l-6.7-3.6a1.8 1.8 0 0 1-.95-1.6V7.8" />
      <path d="m3.9 6.6 7.25-3.9a1.8 1.8 0 0 1 1.7 0l7.25 3.9-8.1 4.4z" />
      <path d="M12 11v10" />
    </>
  ),
  car: (
    <>
      <path d="M4.5 16.5v2.2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V12l2.4-5.3A2 2 0 0 1 5.7 5.5h9.6a2 2 0 0 1 1.8 1.2L19.5 12v6.7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2.2" />
      <path d="M1.5 12h18M5 16.5h11.5" />
      <circle cx="6" cy="14" r="0.6" fill="currentColor" />
      <circle cx="15" cy="14" r="0.6" fill="currentColor" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.9 7-11a7 7 0 1 0-14 0c0 5.1 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </>
  ),
  bolt: <path d="M13.4 2.5 4.8 13.2h6L10.2 21.5l8.8-10.8h-6.2z" />,
  leaf: (
    <>
      <path d="M20 4c-9.4-1-15.5 3-15.5 9.4A6.6 6.6 0 0 0 11 20c6.2 0 9-6.1 9-16Z" />
      <path d="M4.5 20c2.4-5 6.2-8.6 11-11" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.4" />
      <path d="M15.5 5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
    </>
  ),
  building: (
    <>
      <path d="M3.5 21h17M5.5 21V5.2a1.7 1.7 0 0 1 1.2-1.6l7-2.1a1.7 1.7 0 0 1 2.2 1.6V21" />
      <path d="M15.9 9.5h2.9a1.7 1.7 0 0 1 1.7 1.7V21M9 8h3M9 12h3M9 16h3" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 17v-5M12.5 17V7.5M17 17v-8" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.4" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  spark: (
    <path d="M12 2.8 13.9 9l6.2 1.9-6.2 1.9L12 19l-1.9-6.2L3.9 11 10.1 9zM19 3.2l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" />
  ),
  quote: (
    <path
      d="M9.6 5.5C6.3 7 4.5 9.7 4.5 13.4c0 3.1 1.7 5.1 4.2 5.1 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.3-3.4-.4 0-.8 0-1 .2.4-1.8 1.7-3.3 3.6-4.3Zm9.4 0c-3.3 1.5-5.1 4.2-5.1 7.9 0 3.1 1.7 5.1 4.2 5.1 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.3-3.4-.4 0-.8 0-1 .2.4-1.8 1.7-3.3 3.6-4.3Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 7.6v.1M12 16v-3.2a2 2 0 0 1 4 0V16" />
    </>
  ),
  twitter: <path d="M4 4h3.8l4.3 5.9L17.4 4H20l-6.5 7.4L20.5 20h-3.8l-4.6-6.3L6.3 20H4l6.9-7.9z" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7v.1" />
    </>
  ),
  download: <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16v.1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <rect x="2.8" y="13.5" width="4" height="6" rx="1.8" />
      <rect x="17.2" y="13.5" width="4" height="6" rx="1.8" />
      <path d="M19.5 19.5v.6a2.6 2.6 0 0 1-2.6 2.6H13" />
    </>
  ),
  euro: (
    <>
      <path d="M17.5 6.4a6.6 6.6 0 0 0-9.9 2.2c-1.6 3.2-.7 7.2 2 9a6.6 6.6 0 0 0 7.9-.6" />
      <path d="M4.8 10.4h8M4.8 13.8h8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.6L12 12.2 3.5 7.6z" />
      <path d="m4 12.4 8 4.3 8-4.3M4 16.6l8 4.3 8-4.3" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.6,
  ...rest
}: { name: string; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}

export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-[11px] bg-gradient-to-br from-signal-400 via-signal-500 to-flare-500 shadow-[0_8px_24px_-8px_rgba(255,181,36,0.8)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-950" aria-hidden="true">
          <path
            d="M4 15.5 10.5 5h4.2l-2.3 5.2h5.1L11 20l1.6-6.2H4z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span
        className={`whitespace-nowrap font-display text-[1.15rem] font-extrabold tracking-tight sm:text-[1.35rem] ${
          light ? "text-ink-900" : "text-bone-50"
        }`}
      >
        Trans Directa
        <span className="text-signal-500">.</span>
      </span>
    </span>
  );
}