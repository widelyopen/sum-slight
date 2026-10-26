import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { APPS, AppId, TASKBAR, Win, useOS } from './store'
import { WALLS, beep, useCfg } from './settings'
import { Terminal } from './apps/Terminal'
import { Files } from './apps/Files'
import { Music } from './apps/Music'
import { Settings } from './apps/Settings'
import { AppIcon } from './icons'

const VIEW: Record<AppId, () => JSX.Element> = { terminal: Terminal, files: Files, music: Music, settings: Settings }
const ids = Object.keys(APPS) as AppId[]

function Window({ w }: { w: Win }) {
  const { focus, close, minimize, toggleMax, set, snap, focused } = useOS()
  const { dark } = useCfg()
  const View = VIEW[w.app]
  useEffect(() => { beep(660); return () => beep(330) }, [])

  const drag = (e: React.PointerEvent) => {
    focus(w.id)
    if (w.max || (e.target as HTMLElement).closest('button')) return
    const ox = e.clientX - w.x, oy = e.clientY - w.y
    const mv = (m: PointerEvent) => set(w.id, { x: m.clientX - ox, y: Math.max(0, m.clientY - oy) })
    const up = (m: PointerEvent) => {
      removeEventListener('pointermove', mv); removeEventListener('pointerup', up)
      if (m.clientY < 6) snap(w.id, 'max'); else if (m.clientX < 6) snap(w.id, 'l'); else if (m.clientX > innerWidth - 6) snap(w.id, 'r')
    }
    addEventListener('pointermove', mv); addEventListener('pointerup', up)
  }
  const resize = (e: React.PointerEvent) => {
    e.stopPropagation()
    const sx = e.clientX, sy = e.clientY, { w: ow, h: oh } = w
    const mv = (m: PointerEvent) => set(w.id, { w: Math.max(300, ow + m.clientX - sx), h: Math.max(200, oh + m.clientY - sy) })
    const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up) }
    addEventListener('pointermove', mv); addEventListener('pointerup', up)
  }
  const on = focused === w.id

  return (
    <motion.div onPointerDown={() => focus(w.id)}
      style={{ left: w.x, top: w.y, width: w.w, height: w.h, zIndex: w.z, pointerEvents: w.min ? 'none' : 'auto' }}
      initial={{ opacity: 0, scale: 0.92 }} animate={w.min ? { opacity: 0, scale: 0.85, y: 120 } : { opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.15 }}
      className={`absolute flex flex-col overflow-clip rounded-md border ${on ? 'shadow-xl shadow-black/40' : 'shadow shadow-black/30'} ${dark ? 'border-[#383c43] bg-[#23262b] text-zinc-200' : 'border-zinc-300 bg-[#f2f2f0] text-zinc-800'}`}>
      <div onPointerDown={drag} onDoubleClick={() => toggleMax(w.id)} className={`flex h-8 shrink-0 items-center gap-2 px-3 text-[13px] ${on ? '' : 'opacity-60'}`} style={{ borderBottom: '1px solid color-mix(in srgb, currentColor 14%, transparent)' }}>
        <AppIcon app={w.app} size={18} /><span className="flex-1 truncate">{APPS[w.app].title}</span>
        <button className="px-2 hover:opacity-60" onClick={() => minimize(w.id)}>–</button>
        <button className="px-2 hover:opacity-60" onClick={() => toggleMax(w.id)}>{w.max ? '❐' : '□'}</button>
        <button className="px-2 hover:text-red-400" onClick={() => close(w.id)}>✕</button>
      </div>
      <div className="relative min-h-0 flex-1"><View /></div>
      {!w.max && <div onPointerDown={resize} className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize" />}
    </motion.div>
  )
}

function Bsod() {
  const setBsod = useOS((s) => s.setBsod)
  useEffect(() => { const t = setTimeout(() => setBsod(false), 6000); return () => clearTimeout(t) }, [setBsod])
  return (
    <div onClick={() => setBsod(false)} className="fixed inset-0 z-[99999] flex flex-col justify-center gap-4 bg-[#0078d7] p-[8vw] font-sans text-white">
      <div className="text-8xl">:(</div>
      <p className="text-2xl">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
      <p className="text-sm opacity-80">Stop code: SUDO_RM_RF_SLASH — click anywhere to reboot</p>
    </div>
  )
}

function Taskbar() {
  const { wins, focused, focus, minimize, start, setStart } = useOS()
  const accent = useCfg((s) => s.accent)
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  return (
    <div style={{ height: TASKBAR, zIndex: 9000 }} className="absolute inset-x-0 bottom-0 flex items-center gap-1 border-t border-[#2e3136] bg-[#1b1d21] px-2 text-zinc-200">
      <button onPointerDown={(e) => e.stopPropagation()} onClick={() => setStart(!start)} className="rounded-lg px-3 py-2 hover:bg-white/10" style={start ? { background: accent } : {}}><svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor"><rect width="8" height="8" rx="2" /><rect x="10" width="8" height="8" rx="2" /><rect y="10" width="8" height="8" rx="2" /><rect x="10" y="10" width="8" height="8" rx="2" /></svg></button>
      {wins.map((w) => (
        <button key={w.id} onClick={() => (focused === w.id && !w.min ? minimize(w.id) : focus(w.id))}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-white/10" style={{ borderBottom: `2px solid ${w.min ? 'transparent' : accent}` }}>
          <AppIcon app={w.app} size={20} /><span className="hidden sm:inline">{APPS[w.app].title}</span></button>
      ))}
      <div className="ml-auto px-3 text-xs">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br />{now.toLocaleDateString()}</div>
    </div>
  )
}

export default function App() {
  const { wins, start, bsod, open, setStart, setBsod } = useOS()
  const { wall, accent, dark } = useCfg()
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light' }, [dark])
  // konami-ish easter egg: press "b" 3 times fast
  useEffect(() => {
    let n = 0, t = 0
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key === 'b') { n = Date.now() - t < 600 ? n + 1 : 1; t = Date.now(); if (n >= 3) setBsod(true) }
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [setBsod])

  return (
    <div className="relative h-full w-full overflow-clip" style={{ background: WALLS[wall] }} onPointerDown={() => setStart(false)}>
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {ids.map((a) => (
          <button key={a} onDoubleClick={() => open(a)} className="flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-xs text-white hover:bg-white/15">
            <AppIcon app={a} size={44} />{APPS[a].title}</button>
        ))}
      </div>
      <AnimatePresence>{wins.map((w) => <Window key={w.id} w={w} />)}</AnimatePresence>
      <AnimatePresence>
        {start && (
          <motion.div onPointerDown={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ bottom: TASKBAR + 8, zIndex: 9500 }} className="absolute left-2 w-64 rounded-md border border-[#383c43] bg-[#23262b] p-2 text-zinc-200">
            {ids.map((a) => <button key={a} onClick={() => open(a)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"><AppIcon app={a} size={22} /> {APPS[a].title}</button>)}
            <button onClick={() => { setStart(false); setBsod(true) }} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10" style={{ color: accent }}>⏻ Restart</button>
          </motion.div>
        )}
      </AnimatePresence>
      <Taskbar />
      {bsod && <Bsod />}
    </div>
  )
}
