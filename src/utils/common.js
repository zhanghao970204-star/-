// 千分位
export function formatNumberWithCommas(value) {
  if (this.getCurrency !== 'BRL') {
    // 如果值为NaN，返回空字符串
    if (isNaN(value)) {
      return ''
    }
    // 将数字转换为字符串
    let num = value.toString()
    // 判断是否包含小数点
    let [integer, decimal] = num.split('.')
    // 对整数部分进行千分位逗号分隔
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    // 拼接整数和小数部分
    return decimal ? `${integer}.${decimal.slice(0, 2)}` : integer
  } else {
    if (!value && value !== 0) return '' // 如果值无效，返回空字符串

    // 将数字转换为字符串
    let stringValue = value.toString()

    // 判断是否为负数
    let isNegative = stringValue.startsWith('-')
    if (isNegative) {
      stringValue = stringValue.slice(1) // 去掉负号
    }

    // 拆分整数部分和小数部分
    let [integerPart, decimalPart = '00'] = stringValue.split('.')
    decimalPart = decimalPart.padEnd(2, '0').slice(0, 2) // 确保小数部分保留两位

    // 添加千分位分隔符
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    // 如果小数部分是“00”，则不显示小数部分
    let result
    if (decimalPart === '00') {
      result = integerPart
    } else {
      result = `${integerPart},${decimalPart}`
    }

    // 如果是负数，添加负号
    if (isNegative) {
      result = `-${result}`
    }

    return result
  }
}
//uuid
export function generateUUID() {
  // 创建一个 16 字节的数组
  const buffer = new Uint8Array(16)
  // 使用 crypto.getRandomValues 填充随机值
  crypto.getRandomValues(buffer)

  // 转换为字符串并插入 UUID 的格式分隔符
  const [a, b, c, d] = buffer
  return [
    (a ^ 0x40).toString(16).padStart(2, '0'), // 版本号为 4，即 UUID v4
    (b ^ 0x80).toString(16).padStart(2, '0'), // 时钟序列
    (c ^ 0x80).toString(16).padStart(2, '0'), // 时钟序列
    d.toString(16).padStart(2, '0'),
    buffer.slice(4).join('').padStart(32, '0')
  ]
    .join('')
    .replace(/(.8{})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
}
//指纹uuid
const FP_CACHE_KEY = 'ot_fp_vid'

export async function getFingerprint() {
  try {
    const cached = localStorage.getItem(FP_CACHE_KEY)
    if (cached) return cached

    const { default: FingerprintJS } = await import(
      '@fingerprintjs/fingerprintjs'
    )
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    if (result && result.visitorId) {
      localStorage.setItem(FP_CACHE_KEY, result.visitorId)
      return result.visitorId
    }
    return null
  } catch (error) {
    console.error(error)
    return null
  }
}
// 获取当天范围
export function getTodayRange() {
  return (
    this.$dayjs().startOf('day').format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs().endOf('day').format('YYYY-MM-DD 23:59:59')
  )
}
// 获取昨天范围
export function getYesterdayRange() {
  return (
    this.$dayjs()
      .subtract(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DD 23:59:59')
  )
}
// 获取这周范围
export function getThisWeekRange() {
  return (
    this.$dayjs().startOf('week').format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs().endOf('week').format('YYYY-MM-DD 23:59:59')
  )
}
// 获取上周范围
export function getLastWeekRange() {
  return (
    this.$dayjs()
      .subtract(1, 'week')
      .startOf('week')
      .format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs()
      .subtract(1, 'week')
      .endOf('week')
      .format('YYYY-MM-DD 23:59:59')
  )
}
// 获取这个月范围
export function getThisMonthRange() {
  return (
    this.$dayjs().startOf('month').format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs().endOf('month').format('YYYY-MM-DD 23:59:59')
  )
}
// 获取上个月范围
// 上报活动面板的打开/关闭事件
// promoType: sign_daily / lucky_roulette / new_player_giftpack / treasure_box
//            task_newbie / task_daily / task_weekly / red_packet
// eventType: 1=打开面板, 2=关闭面板
export async function reportPromoPanel(promoType, eventType) {
  if (!promoType || !eventType) return
  if (!localStorage.getItem('token')) return
  try {
    const { ReportPromoPanelEvent } = await import('@/api/common')
    await ReportPromoPanelEvent({ promoType, eventType })
  } catch (e) {
    // 静默失败，不影响业务
  }
}

export function getLastMonthRange() {
  return (
    this.$dayjs()
      .subtract(1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD 00:00:00') +
    '&' +
    this.$dayjs()
      .subtract(1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD 23:59:59')
  )
}
