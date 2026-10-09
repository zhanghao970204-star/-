import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { transformWithEsbuild } from 'vite'

// pure removes unused log calls but preserves effects in their arguments.
// drop: ['console'] would also remove e.g. saveOrder() inside console.log().
export const productionEsbuild = {
  legalComments: 'none',
  drop: ['debugger'],
  pure: [
    'log', 'debug', 'info', 'warn', 'error', 'trace', 'dir', 'dirxml',
    'table', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeLog',
    'timeEnd', 'count', 'countReset', 'assert', 'clear', 'profile',
    'profileEnd', 'timeStamp',
  ].map(method => `console.${method}`),
}

async function minifyScript(source, name) {
  const result = await transformWithEsbuild(source, name, {
    ...productionEsbuild,
    loader: 'js',
    target: 'es2015',
    minify: true,
  })
  return result.code
}

export function productionOutput() {
  let root
  return {
    name: 'production-output',
    apply: 'build',
    configResolved(config) { root = config.root },
    transformIndexHtml: {
      order: 'post',
      async handler(html) {
        const cleaned = html.replace(/<!--[\s\S]*?-->/g, '')
        const scripts = [...cleaned.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
        let result = cleaned
        // Process backwards so offsets remain stable. External scripts are unchanged.
        for (const match of scripts.reverse()) {
          const [, attributes, source] = match
          if (/\bsrc\s*=/.test(attributes) || !source.trim()) continue
          const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]
          if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue
          const code = await minifyScript(source, 'inline.js')
          const replacement = `<script${attributes}>${code}</script>`
          result = result.slice(0, match.index) + replacement + result.slice(match.index + match[0].length)
        }
        return result
      },
    },
    async generateBundle() {
      // Public files bypass Vite's normal JS transform. Emit the optimized SW too.
      const source = await readFile(path.join(root, 'public/service-worker.js'), 'utf8')
      this.emitFile({
        type: 'asset',
        fileName: 'service-worker.js',
        source: await minifyScript(source, 'service-worker.js'),
      })
    },
  }
}
