import { createAssetResolver } from './assetResolver'

const lotteryModules = import.meta.glob(
  '@/assets/img/lottery/*.{png,jpg,jpeg,gif,webp,svg}',
  { eager: true, import: 'default' }
)

const resolveLottery = createAssetResolver(lotteryModules)

export function lotteryImg(name) {
  const fileName = String(name).includes('.') ? String(name) : `${name}.png`
  return resolveLottery(fileName)
}
