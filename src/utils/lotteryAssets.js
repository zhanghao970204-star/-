const lotteryModules = import.meta.glob(
  '@/assets/img/lottery/*.{png,jpg,jpeg,gif,webp,svg}',
  { eager: true, import: 'default' }
)

function resolveFromGlob(modules, fileName) {
  const target = String(fileName)
  const entry = Object.entries(modules).find(([key]) =>
    key.endsWith(`/${target}`)
  )
  return entry ? entry[1] : ''
}

export function lotteryImg(name) {
  const fileName = String(name).includes('.') ? String(name) : `${name}.png`
  return resolveFromGlob(lotteryModules, fileName)
}
