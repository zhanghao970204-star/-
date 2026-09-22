#!/usr/bin/env node
/**
 * Bulk Vue2 → Vue3 / Vant2 → Vant4 codemods for this project.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')

const VMODEL_FILES = new Set([
  'src/components/LuckyRoulette.vue',
  'src/components/LotteryDayHistory.vue',
  'src/components/Login.vue',
  'src/components/TreasureBoxPopup.vue',
  'src/components/LotteryOrder.vue',
  'src/components/FirstRechargePopup.vue',
  'src/components/CommonLang.vue',
  'src/components/ActivityPopup.vue',
  'src/components/RechargeCont.vue',
  'src/components/DatePickerPopup.vue',
  'src/components/ServicePopup.vue',
  'src/components/CommonPopup.vue'
])

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(vue|js)$/.test(entry.name)) out.push(full)
  }
  return out
}

function transformVModelComponent(content) {
  let next = content
  // props value → modelValue (boolean popup pattern)
  next = next.replace(
    /(\/\/[^\n]*\n\s*)?value:\s*\{\s*type:\s*Boolean,\s*default:\s*false\s*\}/g,
    'modelValue: {\n      type: Boolean,\n      default: false\n    }'
  )
  // watch value( → modelValue(
  next = next.replace(/value\(newVal\)/g, 'modelValue(newVal)')
  next = next.replace(/value\(newVal,\s*oldVal\)/g, 'modelValue(newVal, oldVal)')
  // this.value → this.modelValue
  next = next.replace(/this\.value\b/g, 'this.modelValue')
  // emit input → update:modelValue
  next = next.replace(/\$emit\(['"]input['"]/g, "$emit('update:modelValue'")
  next = next.replace(/@input="\$emit\('input'/g, "@input=\"$emit('update:modelValue'")
  next = next.replace(/@input="\$emit\(\"input\"/g, '@input="$emit("update:modelValue"')
  return next
}

function transform(content, filePath) {
  let next = content
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/')
  const isVue = filePath.endsWith('.vue')

  next = next.replace(/\bbeforeDestroy\b/g, 'beforeUnmount')
  next = next.replace(/\bdestroyed\b/g, 'unmounted')
  next = next.replace(/::v-deep/g, ':deep')
  next = next.replace(/\/deep\//g, ':deep')

  next = next.replace(/\$bus\.\$on\b/g, '$bus.on')
  next = next.replace(/\$bus\.\$off\b/g, '$bus.off')
  next = next.replace(/\$bus\.\$emit\b/g, '$bus.emit')
  next = next.replace(/\$bus\.\$once\b/g, '$bus.on')

  next = next.replace(
    /this\.\$set\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
    '($1)[$2] = $3'
  )
  next = next.replace(
    /Vue\.set\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g,
    '($1)[$2] = $3'
  )

  if (isVue) {
    next = next.replace(
      /<(van-popup|van-action-sheet|van-dialog|van-number-keyboard|van-overlay|van-share-sheet|van-calendar)\b([^>]*?)\bv-model="/g,
      '<$1$2v-model:show="'
    )
    next = next.replace(
      /<(van-popup|van-action-sheet|van-dialog|van-number-keyboard|van-overlay|van-share-sheet|van-calendar)\b([^>]*?)\bv-model='/g,
      "<$1$2v-model:show='"
    )
  }

  next = next.replace(
    /from\s+['"]vue-puzzle-vcode['"]/g,
    "from 'vue3-puzzle-vcode'"
  )
  next = next.replace(
    /import\s+VueQr\s+from\s+['"]vue-qr['"]/g,
    "import VueQr from 'qrcode.vue'"
  )
  // vue-qr :text → qrcode.vue :value
  next = next.replace(/(<vue-qr\b[^>]*?)\b:text="/g, '$1:value="')
  next = next.replace(/(<vue-qr\b[^>]*?)\btext="/g, '$1value="')

  if (VMODEL_FILES.has(rel)) {
    next = transformVModelComponent(next)
  }

  return next
}

const files = walk(SRC)
let changed = 0
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8')
  const after = transform(before, file)
  if (after !== before) {
    fs.writeFileSync(file, after)
    changed++
    console.log('updated', path.relative(ROOT, file))
  }
}
console.log(`\nDone. Updated ${changed}/${files.length} files.`)
