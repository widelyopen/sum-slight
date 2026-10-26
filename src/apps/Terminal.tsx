import { useEffect, useRef, useState } from 'react'
import { getNode, resolve, Node } from '../fs'
import { APPS, AppId, useOS } from '../store'

const BOOT = Date.now()

function Matrix({ stop }: { stop: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!, x = c.getContext('2d')!
    c.width = c.offsetWidth; c.height = c.offsetHeight
    const drops: number[] = Array(Math.floor(c.width / 14)).fill(0)
    const t = setInterval(() => {
      x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(0, 0, c.width, c.height)
      x.fillStyle = '#0f0'; x.font = '14px monospace'
      drops.forEach((y, i) => {
        x.fillText(String.fromCharCode(0x30a0 + Math.random() * 96), i * 14, y * 14)
        drops[i] = y * 14 > c.height && Math.random() > 0.97 ? 0 : y + 1
      })
    }, 50)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && stop()
    addEventListener('keydown', esc)
    return () => { clearInterval(t); removeEventListener('keydown', esc) }
  }, [stop])
  return <canvas ref={ref} onClick={stop} className="absolute inset-0 z-10 h-full w-full bg-black" />
}

export function Terminal() {
  const [lines, setLines] = useState<string[]>(['FakeOS 1.0 — type "help"'])
  const [cwd, setCwd] = useState(['home', 'user'])
  const [inp, setInp] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const [rain, setRain] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => end.current?.scrollIntoView(), [lines])

  const home = cwd.length === 2 && cwd[0] === 'home' && cwd[1] === 'user'
  const prompt = `user@fakeos:${home ? '~' : '/' + cwd.join('/')}$`

  const run = (line: string): string[] => {
    const [c, ...a] = line.trim().split(/\s+/)
    const arg = a.join(' ')
    switch (c) {
      case '': return []
      case 'help': return ['help neofetch ls cd cat pwd date whoami echo clear open <app> matrix hack bsod', 'hint: there are secrets. try: sudo rm -rf /']
      case 'pwd': return ['/' + cwd.join('/')]
      case 'whoami': return ['user']
      case 'date': return [new Date().toString()]
      case 'echo': return [arg]
      case 'ls': {
        const n = getNode(resolve(cwd, arg || '.'))
        if (n === undefined) return [`ls: ${arg}: no such file or directory`]
        if (typeof n === 'string') return [arg]
        return [Object.keys(n).map((k) => (typeof (n as Node)[k] === 'object' ? k + '/' : k)).join('  ')]
      }
      case 'cd': {
        const p = resolve(cwd, arg || '~')
        if (typeof getNode(p) !== 'object') return [`cd: ${arg}: not a directory`]
        setCwd(p); return []
      }
      case 'cat': {
        const n = getNode(resolve(cwd, arg))
        return typeof n === 'string' ? n.split('\n') : [`cat: ${arg}: cannot read`]
      }
      case 'open': {
        if (!(arg in APPS)) return [`open: unknown app. available: ${Object.keys(APPS).join(', ')}`]
        useOS.getState().open(arg as AppId); return []
      }
      case 'neofetch': return [
        '   ___        user@fakeos', '  /   \\       -----------', ' | FOS |      OS: FakeOS 1.0 (browser)',
        '  \\___/       Kernel: react-18', '              Shell: fsh', `              Uptime: ${Math.floor((Date.now() - BOOT) / 60000)} min`,
        '              Memory: 640KB (should be enough)', '              Theme: ' + (document.documentElement.dataset.theme ?? 'dark'),
      ]
      case 'matrix': setRain(true); return []
      case 'hack': return ['[*] bypassing firewall...', '[*] downloading the internet... 100%', '[+] access granted. just kidding, this is a website.']
      case 'bsod': useOS.getState().setBsod(true); return []
      case 'sudo':
        if (arg.replace(/\s+/g, ' ') === 'rm -rf /') { useOS.getState().setBsod(true); return [] }
        return ['sudo: you are not in the sudoers file. this incident will be reported.']
      default: return [`${c}: command not found`]
    }
  }

  const exec = () => {
    const l = inp
    setInp(''); setHi(-1)
    if (l.trim()) setHist((h) => [l, ...h])
    if (l.trim() === 'clear') return setLines([])
    setLines((x) => [...x, `${prompt} ${l}`, ...run(l)])
  }

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') exec()
    else if (e.key === 'ArrowUp') { const i = Math.min(hi + 1, hist.length - 1); setHi(i); setInp(hist[i] ?? '') }
    else if (e.key === 'ArrowDown') { const i = Math.max(hi - 1, -1); setHi(i); setInp(hist[i] ?? '') }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]) }
  }

  return (
    <div className="relative h-full overflow-auto bg-black/80 p-3 font-mono text-sm text-green-400" onClick={() => document.getElementById('term-in')?.focus()}>
      {rain && <Matrix stop={() => setRain(false)} />}
      <pre className="whitespace-pre-wrap">{lines.join('\n')}</pre>
      <div className="flex gap-2"><span>{prompt}</span>
        <input id="term-in" autoFocus value={inp} onChange={(e) => setInp(e.target.value)} onKeyDown={key}
          className="flex-1 bg-transparent outline-none" spellCheck={false} autoComplete="off" /></div>
      <div ref={end} />
    </div>
  )
}
