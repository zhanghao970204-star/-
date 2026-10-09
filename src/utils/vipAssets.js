import { createAssetResolver } from './assetResolver'

const vipModules = import.meta.glob(
  '@/assets/img/vip/*.{png,jpg,jpeg,gif,webp,svg}',
  { eager: true, import: 'default' }
)

const resolveVip = createAssetResolver(vipModules)

export function vipImg(name) {
  const fileName = String(name).includes('.') ? String(name) : `${name}.png`
  return resolveVip(fileName)
}
