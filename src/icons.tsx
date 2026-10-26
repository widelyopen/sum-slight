import type { AppId } from './store'

const S = { stroke: '#d5d8dd', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const
const GLYPH: Record<AppId, JSX.Element> = {
  terminal: <><path d="M8 11l5 5-5 5" {...S} /><path d="M16 22h8" {...S} /></>,
  files: <path d="M6 10a2 2 0 012-2h5l2 3h9a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2z" {...S} />,
  music: <><path d="M13 21V10l10-2v11" {...S} /><circle cx="11" cy="21" r="3" fill="#d5d8dd" /><circle cx="21" cy="19" r="3" fill="#d5d8dd" /></>,
  settings: <><circle cx="16" cy="16" r="4" {...S} /><path d="M16 5v4M16 23v4M5 16h4M23 16h4M8.2 8.2L11 11M21 21l2.8 2.8M23.8 8.2L21 11M11 21l-2.8 2.8" {...S} /></>,
}

export function AppIcon({ app, size = 28 }: { app: AppId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="shrink-0">
      <rect x=".5" y=".5" width="31" height="31" rx="6" fill="#33373d" stroke="#4a4f57" />{GLYPH[app]}
    </svg>
  )
}

export const FolderIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><path d="M3 9a2 2 0 012-2h7l3 3h12a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#a08857" /><path d="M3 14h26v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="#b59b6a" /></svg>
)
export const FileIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32"><path d="M8 3h10l7 7v17a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#cfd2d6" /><path d="M18 3l7 7h-5a2 2 0 01-2-2z" fill="#9a9fa6" /><path d="M10 16h12M10 20h12M10 24h8" stroke="#9a9fa6" strokeWidth="1.6" strokeLinecap="round" /></svg>
)
const T = ({ d }: { d: JSX.Element }) => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">{d}</svg>
export const Prev = () => <T d={<path d="M6 5h2v14H6zM20 5v14L9 12z" />} />
export const Next = () => <T d={<path d="M16 5h2v14h-2zM4 5v14l11-7z" />} />
export const Play = () => <T d={<path d="M7 4v16l13-8z" />} />
export const Pause = () => <T d={<path d="M6 4h4v16H6zM14 4h4v16h-4z" />} />
export const Vol = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></svg>
)
