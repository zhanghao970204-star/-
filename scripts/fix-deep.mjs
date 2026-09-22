#!/usr/bin/env node
/**
 * Convert deprecated `:deep .foo` combinator to `:deep(.foo)`.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.resolve(__dirname, '../src')

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(vue|less|css|scss)$/.test(entry.name)) out.push(full)
  }
  return out
}

function transform(content) {
  // Skip already-functional :deep(...)
  // Convert `:deep selector {` → `:deep(selector) {`
  // Also handle indented / commented lines carefully
  return content.replace(/:deep(?!\()(\s+)([^{\n]+?)\s*\{/g, (match, space, selector) => {
    const trimmed = selector.trim()
    // leave empty or broken alone
    if (!trimmed) return match
    return `:deep(${trimmed}) {`
  })
}

let changed = 0
for (const file of walk(SRC)) {
  const before = fs.readFileSync(file, 'utf8')
  const after = transform(before)
  if (after !== before) {
    fs.writeFileSync(file, after)
    changed++
    console.log('updated', path.relative(path.resolve(SRC, '..'), file))
  }
}
console.log(`\nDone. Updated ${changed} files.`)
