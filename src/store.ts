import { create } from 'zustand'

export type AppId = 'terminal' | 'files' | 'music' | 'settings'
export type Rect = { x: number; y: number; w: number; h: number }
export type Win = Rect & { id: string; app: AppId; z: number; min: boolean; max: boolean; prev?: Rect }

export const TASKBAR = 44
export const APPS: Record<AppId, { title: string; icon: string; w: number; h: number }> = {
  terminal: { title: 'Terminal', icon: '💻', w: 640, h: 400 },
  files: { title: 'Files', icon: '📁', w: 640, h: 420 },
  music: { title: 'Music', icon: '🎵', w: 380, h: 340 },
  settings: { title: 'Settings', icon: '⚙️', w: 520, h: 420 },
}
const full = (): Rect => ({ x: 0, y: 0, w: innerWidth, h: innerHeight - TASKBAR })
const half = (left: boolean): Rect => ({ x: left ? 0 : innerWidth / 2, y: 0, w: innerWidth / 2, h: innerHeight - TASKBAR })

interface OS {
  wins: Win[]; focused: string | null; z: number; start: boolean; bsod: boolean
  open: (a: AppId) => void; close: (id: string) => void; focus: (id: string) => void
  minimize: (id: string) => void; toggleMax: (id: string) => void
  set: (id: string, r: Partial<Rect>) => void; snap: (id: string, side: 'l' | 'r' | 'max') => void
  setStart: (v: boolean) => void; setBsod: (v: boolean) => void
}
const map = (s: OS, id: string, f: (w: Win) => Partial<Win>) => s.wins.map((w) => (w.id === id ? { ...w, ...f(w) } : w))

export const useOS = create<OS>((set) => ({
  wins: [], focused: null, z: 1, start: false, bsod: false,
  open: (a) => set((s) => {
    const id = crypto.randomUUID(), n = (s.wins.length % 6) * 28, { w, h } = APPS[a]
    return { wins: [...s.wins, { id, app: a, x: 80 + n, y: 50 + n, w, h, z: s.z + 1, min: false, max: false }], z: s.z + 1, focused: id, start: false }
  }),
  close: (id) => set((s) => ({ wins: s.wins.filter((w) => w.id !== id) })),
  focus: (id) => set((s) => ({ z: s.z + 1, focused: id, wins: map(s, id, () => ({ z: s.z + 1, min: false })) })),
  minimize: (id) => set((s) => ({ focused: null, wins: map(s, id, () => ({ min: true })) })),
  toggleMax: (id) => set((s) => ({
    wins: map(s, id, (w) => (w.max ? { ...w.prev, max: false, prev: undefined } : { prev: { x: w.x, y: w.y, w: w.w, h: w.h }, ...full(), max: true })),
  })),
  set: (id, r) => set((s) => ({ wins: map(s, id, () => r) })),
  snap: (id, side) => set((s) => ({
    wins: map(s, id, (w) => ({
      prev: w.prev ?? { x: w.x, y: w.y, w: w.w, h: w.h },
      ...(side === 'max' ? full() : half(side === 'l')), max: side === 'max',
    })),
  })),
  setStart: (v) => set({ start: v }),
  setBsod: (v) => set({ bsod: v }),
}))
