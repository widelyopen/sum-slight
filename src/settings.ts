import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const WALLS = [
  'linear-gradient(135deg,#0f172a,#312e81,#7c3aed)',
  'linear-gradient(135deg,#022c22,#0f766e,#84cc16)',
  'linear-gradient(135deg,#1c1917,#9a3412,#fbbf24)',
  'linear-gradient(135deg,#020617,#0c4a6e,#22d3ee)',
  'radial-gradient(circle at 30% 20%,#f472b6,#4c1d95 60%,#0b0b1a)',
]
export const ACCENTS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']

interface Cfg { wall: number; accent: string; dark: boolean; sound: boolean; patch: (p: Partial<Cfg>) => void }
export const useCfg = create<Cfg>()(persist(
  (set) => ({ wall: 0, accent: ACCENTS[0], dark: true, sound: true, patch: (p) => set(p) }),
  { name: 'fakeos-settings' },
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
