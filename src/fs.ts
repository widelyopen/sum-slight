export type Node = { [name: string]: Node | string }

export const ROOT: Node = {
  home: { user: {
    'readme.txt': 'Welcome to FakeOS.\nEverything here is simulated, nothing leaves your browser.',
    'notes.md': '# Notes\n- drag windows to screen edges to snap\n- double-click titlebars to maximize\n- do NOT run sudo rm -rf /',
    Documents: { 'todo.txt': '[x] build an OS\n[ ] touch grass', 'secret.txt': 'the cake is a lie' },
    Music: { 'drop-your-mp3s-in-the-Music-app.txt': 'Open the Music app and add audio files.' },
    Pictures: {},
  } },
  etc: { 'os-release': 'NAME=FakeOS\nVERSION=1.0 (Browser Edition)' },
  bin: { 'sh': '<binary>' },
}

export const getNode = (p: string[]) =>
  p.reduce<Node | string | undefined>((n, k) => (typeof n === 'object' ? n[k] : undefined), ROOT)

export const resolve = (cwd: string[], arg: string) => {
  const out = arg.startsWith('/') ? [] : [...cwd]
  for (const s of arg.split('/')) {
    if (!s || s === '.') continue
    if (s === '..') out.pop()
    else if (s === '~') out.splice(0, out.length, 'home', 'user')
    else out.push(s)
  }
  return out
}
