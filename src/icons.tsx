/**
 * The study's own icons on a 24-unit grid. None is copied from the reference.
 * `Icon` draws a line in the text colour; the reaction glyphs are small
 * filled discs in each reaction's own colour, drawn for the study.
 */
const PATHS = {
  home: "M3.5 11 12 4l8.5 7M6 9.5V20h4.5v-5h3v5H18V9.5",
  people: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6.5 6.5 0 0 1 3.5 6",
  briefcase: "M3 8h18v11H3zM8.5 8V5.5h7V8M3 13h18",
  message: "M4 5h16v11H9l-5 4z",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 18.5a2 2 0 0 0 4 0",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 21 21",
  grid: "M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z",
  chevron: "M6 9l6 6 6-6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  like: "M7 11v9H4v-9zM7 11l4-7c1.5 0 2.5 1 2 3l-1 3h6a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17 20H7",
  comment: "M4 5h16v11H9l-5 4z",
  repost: "M7 7h11l-3-3M18 7v4M17 17H6l3 3M6 17v-4",
  send: "M21 3 3 10.5l7 2.5 2.5 7z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  plus: "M12 5v14M5 12h14",
  pencil: "M4 20l1-4L16 5l3 3L8 19zM14 7l3 3",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9.5h.01",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  bookmark: "M6 4h12v17l-6-4-6 4z",
  eye: "M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  gear: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
  shield: "M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6z",
  lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  user: "M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20a7 7 0 0 1 14 0",
  ad: "M3 6h18v12H3zM7 15l2.5-6 2.5 6M7.8 13h3.4M15 9v6h1.5a3 3 0 0 0 0-6z",
  trash: "M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13",
  up: "M12 19V5M6 11l6-6 6 6",
  down: "M12 5v14M6 13l6 6 6-6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  badge: "M12 3l2.5 2 3.2-.3.8 3.1 2.6 1.9-1.4 2.9.5 3.2-3.1 1-1.7 2.7-3.4-.9-3.4.9-1.7-2.7-3.1-1 .5-3.2-1.4-2.9 2.6-1.9.8-3.1 3.2.3z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  premium: "M4 18h16M5 8l3.5 4L12 6l3.5 6L19 8l-1.5 10h-11z",
  hiring: "M4 8h16v11H4zM9 8V5.5h6V8",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5h.01",
  reel: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM16 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  hat: "M3 15c3 2 15 2 18 0M6 15c0-5 1.5-9 3-9 1 0 1.5 1.5 3 1.5S14 6 15 6c1.5 0 3 4 3 9",
  plane: "M2.5 13.5 21 7l-2 3-6 2.5-2.5 6.5-2-1 .5-4.5-5 2z",
  cup: "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 2 2 2 2 4M12 3c0 2 2 2 2 4",
  car: "M3 15V12l2-4.5h10L18 12l3 1v2M3 15h18M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
} as const;
export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 24, className, filled, stroke = 1.8 }: { name: IconName; size?: number; className?: string; filled?: boolean; stroke?: number }) {
  return (
    <svg className={`icon${className ? ` ${className}` : ""}`} viewBox="0 0 24 24" width={size} height={size} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** A reaction's glyph: a disc in its colour with a white mark, drawn for the study. */
const GLYPH: Record<string, string> = {
  like: "M9 12v5H7v-5zM9 12l2.5-4c1 0 1.5.6 1.2 1.8l-.5 1.7H16a1 1 0 0 1 1 1.2l-.6 3.2a1 1 0 0 1-1 .8H9",
  celebrate: "M8 17l2-8 6 6zM12 7l1-2M15 9l2-1M16 12h2",
  support: "M12 16.5s-4.5-2.7-4.5-6A2.4 2.4 0 0 1 12 9a2.4 2.4 0 0 1 4.5 1.5c0 3.3-4.5 6-4.5 6z",
  love: "M12 17s-5-3-5-6.5A2.7 2.7 0 0 1 12 9a2.7 2.7 0 0 1 5 1.5C17 14 12 17 12 17z",
  insightful: "M10 15h4M10.5 17.5h3M12 6a4 4 0 0 0-2.5 7.1V15h5v-1.9A4 4 0 0 0 12 6z",
  funny: "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM9 11h.01M15 11h.01M9 13.5c1.5 2 4.5 2 6 0",
};
export function ReactionGlyph({ id, color, size = 16 }: { id: string; color: string; size?: number }) {
  return (
    <svg className="glyph" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill={color} stroke="var(--card)" strokeWidth="1.5" />
      <path d={GLYPH[id]} fill={id === "support" || id === "love" ? "#fff" : "none"} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
