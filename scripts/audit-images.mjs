// Dry-run by default. --apply backs up confirmed candidates before removing them.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}
const sources = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'public')),
  path.join(root, 'index.html'), path.join(root, 'vite.config.js')]
  .filter(file => /\.(vue|js|ts|json|html|css|less|scss|svg)$/.test(file))
const texts = sources.map(file => fs.readFileSync(file, 'utf8'))
// Keep commented references as well; they may be restored by the product team.
const corpus = texts.join('\n')
const dynamicDirs = new Set()
for (const text of texts) {
  for (const match of text.matchAll(/['"`]([^'"`\n]*assets\/[^'"`\n]*)['"`]/g)) {
    const value = match[1]
    const marker = value.search(/\$\{|\*/)
    if (marker < 0) continue
    const prefix = value.slice(value.indexOf('assets/'), marker)
    dynamicDirs.add('src/' + prefix.slice(0, prefix.lastIndexOf('/') + 1))
  }
}
const images = walk(path.join(root, 'src/assets'))
  .filter(file => /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i.test(file))
const unused = images.filter(file => {
  const relative = path.relative(root, file)
  if ([...dynamicDirs].some(dir => relative.startsWith(dir))) return false
  const name = path.basename(file)
  // Stem matching also protects names assembled with an extension at runtime.
  return !corpus.includes(name) && !corpus.includes(path.parse(name).name)
}).map(file => ({ path: path.relative(root, file), bytes: fs.statSync(file).size }))
const report = {
  scanned: images.length,
  dynamicDirectories: [...dynamicDirs].sort(),
  publicImages: 'Preserved: public URLs may also be used outside this repository.',
  unused,
  removableBytes: unused.reduce((sum, item) => sum + item.bytes, 0),
}
if (process.argv.includes('--apply') && unused.length) {
  const backup = fs.mkdtempSync(path.join(os.tmpdir(), 'lz-unused-images-'))
  // Complete all backups before deleting any originals.
  for (const item of unused) {
    const target = path.join(backup, item.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(path.join(root, item.path), target)
  }
  fs.writeFileSync(path.join(backup, 'manifest.json'), JSON.stringify(report, null, 2))
  for (const item of unused) fs.unlinkSync(path.join(root, item.path))
  report.backup = backup
}
console.log(JSON.stringify(report, null, 2))
