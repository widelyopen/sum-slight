import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const WALLS = [
  '#1e2127',
  'linear-gradient(170deg,#2a2e35,#181a1e)',
  '#2b3532',
  '#30343c',
  '#34302d',
]
export const ACCENTS = ['#5b7fa6', '#7a9a7e', '#b08968', '#9a6f7a', '#8a8f98', '#6b8f9c']

interface Cfg { wall: number; accent: string; dark: boolean; sound: boolean; patch: (p: Partial<Cfg>) => void }
export const useCfg = create<Cfg>()(persist(
  (set) => ({ wall: 0, accent: ACCENTS[0], dark: true, sound: true, patch: (p) => set(p) }),
  { name: 'fakeos-settings-v2' },
))

let ctx: AudioContext | null = null
export const beep = (f = 520) => {
  if (!useCfg.getState().sound) return
  try {
    ctx ??= new AudioContext()
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.value = f; g.gain.value = 0.04
    o.connect(g); g.connect(ctx.destination)
    o.start(); o.stop(ctx.currentTime + 0.08)
  } catch { /* audio blocked */ }
}
