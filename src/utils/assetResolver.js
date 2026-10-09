// Build the index once, rather than scanning a glob on every component render.
export function createAssetResolver(modules) {
  const entries = Object.entries(modules)
  const byName = new Map()
  for (const [key, value] of entries) {
    const name = key.slice(key.lastIndexOf('/') + 1)
    if (!byName.has(name)) byName.set(name, value)
  }
  return fileName => {
    const target = String(fileName)
    // Preserve the previous suffix matching for callers passing a relative path.
    if (target.includes('/')) {
      const entry = entries.find(([key]) => key.endsWith(`/${target}`))
      return entry ? entry[1] : ''
    }
    return byName.get(target) || ''
  }
}
