import type { ReactNode, SVGProps } from 'react';

/* Drawn for Sudoku Master: open corners, nine-cell grids and pencil marks. */
const drawings: Record<string, ReactNode> = {
  home: <><path d="M4 10V4h6M14 4h6v6M20 14v6h-6M10 20H4v-6" /><path d="M9 9h6v6H9z" /><path d="M12 9v6M9 12h6" opacity=".4" /></>,
  play: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><path d="m10 8 6 4-6 4z" /></>,
  daily: <><path d="M4 7h16v13H4zM8 3v5M16 3v5M4 11h16" /><path d="M8 15h3v3H8z" fill="currentColor" stroke="none" /><path d="M15 15h1M15 18h1" /></>,
  stats: <><path d="M4 4v16h16M8 16v-4M12 16V8M16 16v-6" /><path d="M7 4h2M15 4h5" opacity=".4" /></>,
  collection: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" /><path d="m17 13 4 4-4 4-4-4z" fill="currentColor" fillOpacity=".15" /></>,
  settings: <><path d="M4 7h5M13 7h7M4 17h9M17 17h3" /><path d="M9 4h4v6H9zM13 14h4v6h-4z" fill="currentColor" fillOpacity=".12" /></>,
  next: <><path d="M4 12h15m-5-5 5 5-5 5" /><path d="M4 8v8" opacity=".4" /></>,
  outward: <><path d="M5 19 19 5M11 5h8v8" /><path d="M5 10v9h9" opacity=".35" /></>,
  back: <><path d="M20 12H5m5-5-5 5 5 5" /><path d="M20 8v8" opacity=".4" /></>,
  pause: <><path d="M5 5h5v14H5zM14 5h5v14h-5z" /><path d="M7.5 9v6M16.5 9v6" opacity=".4" /></>,
  notes: <><path d="M4 4h7M4 4v16h16v-7" /><path d="m9 15 1-4 8-8 3 3-8 8zM16 5l3 3" /><path d="M7 17h5" opacity=".4" /></>,
  erase: <><path d="M4 4h6M4 4v6M20 14v6h-6" /><path d="m7 13 6-7 6 5-6 7H9zM10 10l6 5" /><path d="M7 20h4" opacity=".4" /></>,
  undo: <><path d="M4 4v6h6M5 9h9a6 6 0 0 1 0 12h-3" /><path d="M4 17v4h4" opacity=".4" /></>,
  hint: <><path d="M4 4h6M4 4v6M14 4h6v6M20 14v6h-6M10 20H4v-6" /><path d="M10 10h4v4h-4z" fill="currentColor" fillOpacity=".2" /><path d="m8 16 2-2m4-4 2-2" /></>,
  streak: <><path d="M4 18V6h4v12h4V6h4v12h4" /><path d="M4 21h4M12 21h4" opacity=".4" /></>,
  win: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><path d="m7 12 3 3 7-7M7 18h10" /></>,
  perfect: <><path d="M4 4h16v16H4zM4 12h4m8 0h4M12 4v4m0 8v4" /><path d="m9 12 2 2 4-4" /></>,
  speed: <><path d="M3 8h7M3 12h5M3 16h7M14 4h6v16h-6" /><path d="M14 8h3M14 16h3" /></>,
  challenge: <><path d="M4 20v-5h5v-5h5V5h6v15z" /><path d="M4 6h5M6.5 3.5v5" opacity=".4" /></>,
  time: <><path d="M5 4h14M5 20h14M7 4v5l5 3 5-3V4M7 20v-5l5-3 5 3v5" /><path d="M10 17h4" /></>,
  error: <><path d="M4 4h16v16H4z" /><path d="m9 9 6 6m0-6-6 6" /></>,
  check: <><path d="M4 12v8h16v-4" opacity=".5" /><path d="m6 10 5 5L21 5" /></>,
  locked: <><path d="M5 10h14v10H5zM8 10V5h8v5" /><path d="M11 14h2v3h-2z" fill="currentColor" stroke="none" /></>,
  xp: <><path d="m12 3 9 9-9 9-9-9z" /><path d="M8 12h8M12 8v8" /><path d="m5 5 2 2m10 10 2 2" opacity=".35" /></>,
  search: <><path d="M4 4h12v12H4zM16 16l5 5M8 8h4v4H8z" /><path d="M8 4v3M4 8h3" opacity=".4" /></>,
  global: <><path d="M4 4h16v16H4zM4 12h16M12 4v16" /><path d="m4 4 16 16m0-16L4 20" opacity=".3" /></>,
  dark: <><path d="M4 4h16v16H4z" /><path d="M12 4v16H4V4z" fill="currentColor" fillOpacity=".2" stroke="none" /><path d="M16 8h1M16 12h1M16 16h1" /></>,
  light: <><path d="M7 7h10v10H7zM10 10h4v4h-4zM3 3h3M3 3v3M18 3h3v3M21 18v3h-3M6 21H3v-3" /></>,
  appearance: <><path d="M4 4h16v16H4zM4 12h16M12 4v16" /><path d="M4 4h8v8H4zM12 12h8v8h-8z" fill="currentColor" fillOpacity=".15" stroke="none" /></>,
  audio: <><path d="M4 9h4v6H4zM8 9l5-5v16l-5-5M17 8v8M21 5v14" /></>,
  accessibility: <><path d="M4 4h7v7H4zM15 4h5v5h-5zM4 15h5v5H4zM13 13h7v7h-7z" /><path d="M6 7h3M16 16h2v2h-2z" /></>,
  close: <><path d="m7 7 10 10M17 7 7 17" /><path d="M4 8V4h4M16 20h4v-4" opacity=".4" /></>,
  easy: <><path d="M4 20h16M7 16v-5h4v5M13 16V6h4v10" /><path d="M4 4h4" opacity=".4" /></>,
  mind: <><path d="M4 4h16v16H4zM8 4v8h8v8M4 16h8V8h8" /><path d="M4 8h4M16 16h4" opacity=".4" /></>,
  master: <><path d="M4 4h16v16H4zM8 8h8v8H8zM4 12h4m8 0h4M12 4v4m0 8v4" /><path d="M11 11h2v2h-2z" fill="currentColor" stroke="none" /></>,
  night: <><path d="M4 4h16v16H4zM4 16h16" /><path d="M13 7h3v3h-3z" fill="currentColor" fillOpacity=".25" /><path d="M7 7h1M7 11h1" /></>,
  purist: <><path d="M4 4h16v16H4zM8 8h8v8H8z" /><path d="M12 10v4" /></>,
};

const badgeFamilies: Record<string, [string, number]> = {
  first_win: ['win', 1], easy_master: ['easy', 2], no_mistakes: ['perfect', 1], speed_demon: ['speed', 1],
  streak_3: ['streak', 1], streak_7: ['streak', 2], streak_30: ['streak', 3], streak_100: ['streak', 4],
  hard_first: ['challenge', 1], expert_first: ['mind', 1], master_first: ['master', 1], master_10: ['master', 2],
  daily_first: ['daily', 1], daily_7: ['daily', 2], daily_30: ['daily', 3],
  games_10: ['home', 1], games_50: ['home', 2], games_100: ['home', 3], games_500: ['home', 4],
  xp_1000: ['xp', 1], xp_10000: ['xp', 2], xp_100000: ['xp', 3],
  no_hints: ['purist', 1], speedrun_sub2: ['speed', 2], comeback: ['undo', 1], night_owl: ['night', 1],
  bronze: ['collection', 1], silver: ['collection', 2], gold: ['collection', 3], platinum: ['master', 1], diamond: ['master', 2], master_rank: ['master', 3],
};
const aliases: Record<string, string> = { m1: 'daily', m2: 'perfect', m3: 'speed', m4: 'challenge', gameplay: 'play', weekly: 'stats', all: 'collection', unlocked: 'check', rare: 'collection', common: 'home', epic: 'master', legendary: 'xp' };

type IconProps = SVGProps<SVGSVGElement> & { name: string; size?: number | string; title?: string };
export function Icon({ name, size = '1em', title, className = '', ...props }: IconProps) {
  const badge = badgeFamilies[name];
  const drawing = drawings[badge?.[0] ?? aliases[name] ?? name] ?? drawings.home;
  return <svg {...props} className={`puzzle-icon ${className}`} width={size} height={size} viewBox={badge ? '0 0 24 28' : '0 0 24 24'} fill="none" stroke="currentColor" strokeWidth={1.35} strokeLinecap="square" strokeLinejoin="miter" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} focusable="false">
    {title && <title>{title}</title>}{drawing}
    {badge && Array.from({ length: badge[1] }, (_, i) => <path key={i} d={`M${8 - (badge[1] - 1) * 2 + i * 4} 25h2`} strokeWidth={1.6} />)}
  </svg>;
}

/* Stable miniature tile compositions replace stock animal avatars. */
export function GridAvatar({ seed, size = '1em' }: { seed: string; size?: number | string }) {
  const hash = Array.from(seed).reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return <svg className="puzzle-icon grid-avatar" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={2 + (i % 3) * 7} y={2 + Math.floor(i / 3) * 7} width="5" height="5" rx={(hash >>> i) & 1 ? 2.5 : .5} opacity={i === 4 || (hash >>> (i + 9)) & 1 ? .85 : .18} />)}
  </svg>;
}
