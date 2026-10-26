import { useState } from 'react'
import { getNode, Node } from '../fs'
import { FileIcon, FolderIcon } from '../icons'

export function Files() {
  const [p, setP] = useState(['home', 'user'])
  const [sel, setSel] = useState<string | null>(null)
  const n = getNode(p) as Node
  const names = Object.keys(n).sort((a, b) => Number(typeof n[a] !== 'object') - Number(typeof n[b] !== 'object') || a.localeCompare(b))
  const content = sel !== null && typeof n[sel] === 'string' ? (n[sel] as string) : null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 p-2 text-sm">
        <button className="rounded px-2 py-1 hover:bg-white/10" disabled={!p.length} onClick={() => { setP(p.slice(0, -1)); setSel(null) }}>↑</button>
        <span className="font-mono opacity-70">/{p.join('/')}</span>
      </div>
      <div className="grid flex-1 content-start grid-cols-[repeat(auto-fill,88px)] gap-2 overflow-auto p-3">
        {names.map((k) => {
          const dir = typeof n[k] === 'object'
          return (
            <button key={k} onClick={() => setSel(k)} onDoubleClick={() => { if (dir) { setP([...p, k]); setSel(null) } }}
              className={`flex flex-col items-center gap-1 rounded p-2 text-xs hover:bg-white/10 ${sel === k ? 'bg-white/15' : ''}`}>
              {dir ? <FolderIcon /> : <FileIcon />}<span className="w-full truncate">{k}</span>
            </button>
          )
        })}
        {!names.length && <span className="col-span-full text-sm opacity-50">empty folder</span>}
      </div>
      {content !== null && <pre className="max-h-32 overflow-auto border-t border-white/10 p-3 font-mono text-xs whitespace-pre-wrap">{content}</pre>}
    </div>
  )
}
