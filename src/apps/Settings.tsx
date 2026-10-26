import { ACCENTS, WALLS, beep, useCfg } from '../settings'

export function Settings() {
  const c = useCfg()
  const row = 'flex items-center justify-between'
  return (
    <div className="space-y-5 overflow-auto p-5 text-sm h-full">
      <section><h3 className="mb-2 font-semibold">Wallpaper</h3>
        <div className="grid grid-cols-5 gap-2">
          {WALLS.map((w, i) => <button key={i} onClick={() => c.patch({ wall: i })} style={{ background: w }}
            className={`h-14 rounded-lg border-2 ${c.wall === i ? 'border-white' : 'border-transparent'}`} />)}
        </div></section>
      <section><h3 className="mb-2 font-semibold">Accent color</h3>
        <div className="flex items-center gap-2">
          {ACCENTS.map((a) => <button key={a} onClick={() => { c.patch({ accent: a }); beep(740) }} style={{ background: a }}
            className={`h-8 w-8 rounded-full border-2 ${c.accent === a ? 'border-white' : 'border-transparent'}`} />)}
          <input type="color" value={c.accent} onChange={(e) => c.patch({ accent: e.target.value })} className="h-8 w-8 bg-transparent" />
        </div></section>
      <div className={row}><span>Dark theme</span><button className="rounded-full px-4 py-1 text-white" style={{ background: c.accent }} onClick={() => c.patch({ dark: !c.dark })}>{c.dark ? 'On' : 'Off'}</button></div>
      <div className={row}><span>UI sounds</span><button className="rounded-full px-4 py-1 text-white" style={{ background: c.accent }} onClick={() => { c.patch({ sound: !c.sound }); beep() }}>{c.sound ? 'On' : 'Off'}</button></div>
    </div>
  )
}
