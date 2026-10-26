import { useRef, useState } from 'react'
import { useCfg } from '../settings'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function Music() {
  const [tr, setTr] = useState<{ name: string; url: string }[]>([])
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const [t, setT] = useState(0)
  const [d, setD] = useState(0)
  const [vol, setVol] = useState(0.8)
  const au = useRef<HTMLAudioElement>(null)
  const accent = useCfg((s) => s.accent)
  const cur = tr[i]

  const add = (f: FileList | null) => f && setTr((x) => [...x, ...Array.from(f).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))])
  const toggle = () => { const a = au.current; if (a && cur) a.paused ? a.play() : a.pause() }
  const go = (n: number) => tr.length && setI((i + n + tr.length) % tr.length)

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <audio ref={au} src={cur?.url} autoPlay={play} onPlay={() => setPlay(true)} onPause={() => setPlay(false)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => { setD(e.currentTarget.duration); e.currentTarget.volume = vol }} onEnded={() => go(1)} />
      <div className="flex h-24 items-center justify-center rounded-xl text-5xl" style={{ background: `linear-gradient(135deg,${accent},#0000)` }}>🎵</div>
      <div className="truncate text-center text-sm">{cur?.name ?? 'No track — add some audio files'}</div>
      <input type="range" min={0} max={d || 1} step={0.1} value={t} onChange={(e) => { if (au.current) au.current.currentTime = +e.target.value }} style={{ accentColor: accent }} />
      <div className="flex justify-between text-xs opacity-60"><span>{fmt(t)}</span><span>{fmt(d || 0)}</span></div>
      <div className="flex items-center justify-center gap-4 text-2xl">
        <button onClick={() => go(-1)}>⏮</button><button onClick={toggle}>{play ? '⏸' : '▶️'}</button><button onClick={() => go(1)}>⏭</button>
      </div>
      <div className="flex items-center gap-2 text-xs">🔊
        <input className="flex-1" type="range" min={0} max={1} step={0.01} value={vol} style={{ accentColor: accent }}
          onChange={(e) => { setVol(+e.target.value); if (au.current) au.current.volume = +e.target.value }} /></div>
      <ul className="min-h-0 flex-1 overflow-auto text-xs">
        {tr.map((x, k) => <li key={x.url}><button onClick={() => { setI(k); setPlay(true) }} className={`w-full truncate rounded px-2 py-1 text-left hover:bg-white/10 ${k === i ? 'bg-white/15' : ''}`}>{x.name}</button></li>)}
      </ul>
      <label className="cursor-pointer rounded-lg py-2 text-center text-sm text-white" style={{ background: accent }}>
        + Add audio files<input type="file" accept="audio/*" multiple hidden onChange={(e) => add(e.target.files)} />
      </label>
    </div>
  )
}
