import type { AppId } from './store'

const COLORS: Record<AppId, [string, string]> = {
  terminal: ['#374151', '#030712'], files: ['#fbbf24', '#f59e0b'], music: ['#f472b6', '#9333ea'], settings: ['#94a3b8', '#475569'],
}
const S = { stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const
const GLYPH: Record<AppId, JSX.Element> = {
  terminal: <><path d="M8 11l5 5-5 5" {...S} stroke="#4ade80" strokeWidth={2.4} /><path d="M16 22h8" {...S} stroke="#4ade80" strokeWidth={2.4} /></>,
  files: <path d="M6 10a2 2 0 012-2h5l2 3h9a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="#fff" fillOpacity=".93" />,
  music: <><path d="M13 21V10l10-2v11" {...S} /><circle cx="11" cy="21" r="3" fill="#fff" /><circle cx="21" cy="19" r="3" fill="#fff" /></>,
  settings: <><circle cx="16" cy="16" r="4" {...S} /><path d="M16 5v4M16 23v4M5 16h4M23 16h4M8.2 8.2L11 11M21 21l2.8 2.8M23.8 8.2L21 11M11 21l-2.8 2.8" {...S} /></>,
}

export function AppIcon({ app, size = 28 }: { app: AppId; size?: number }) {
  const g = `g-${app}`, [a, b] = COLORS[app]
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <defs><linearGradient id={g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect width="32" height="32" rx="8" fill={`url(#${g})`} />{GLYPH[app]}
    </svg>
  )
}

export const FolderIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><path d="M3 9a2 2 0 012-2h7l3 3h12a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#fbbf24" /><path d="M3 14h26v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#f59e0b" /></svg>
)
export const FileIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><path d="M8 3h10l7 7v17a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#e5e7eb" /><path d="M18 3l7 7h-5a2 2 0 01-2-2z" fill="#9ca3af" /><path d="M10 16h12M10 20h12M10 24h8" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
const T = ({ d }: { d: JSX.Element }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">{d}</svg>
export const Prev = () => <T d={<path d="M6 5h2v14H6zM20 5v14L9 12z" />} />
export const Next = () => <T d={<path d="M16 5h2v14h-2zM4 5v14l11-7z" />} />
export const Play = () => <T d={<path d="M7 4v16l13-8z" />} />
export const Pause = () => <T d={<path d="M6 4h4v16H6zM14 4h4v16h-4z" />} />
export const Vol = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></svg>
)
