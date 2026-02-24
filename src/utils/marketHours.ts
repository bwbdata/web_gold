/**
 * 各交易市场的开盘/休市判断
 * 使用 Intl.DateTimeFormat 获取各时区本地时间，自动处理夏令时
 */

export type MarketStatus = 'open' | 'closed'

function getZoneInfo(timezone: string): { day: number; min: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? 'Sun'
  const hour    = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0') % 24
  const minute  = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0')

  return {
    day: dayNames.indexOf(weekday), // 0=Sun 1=Mon … 6=Sat
    min: hour * 60 + minute,
  }
}

/**
 * 上海金交所 Au9999 现货（Asia/Shanghai，无夏令时）
 * 交易时段（CST）：
 *   早盘  09:00–11:30
 *   午盘  13:30–15:30
 *   夜盘  20:00–次日 02:30（周一夜–周六凌晨）
 */
export function sgeStatus(): MarketStatus {
  const { day, min } = getZoneInfo('Asia/Shanghai')

  if (day === 0) return 'closed' // 周日全天休市

  // 周六：仅周五夜盘延续的 00:00–02:30
  if (day === 6) return min < 150 ? 'open' : 'closed'

  // 周一–周五
  const morning    = min >= 540  && min < 690   // 09:00–11:30
  const afternoon  = min >= 810  && min < 930   // 13:30–15:30
  const nightStart = min >= 1200                // 20:00–23:59
  // 夜盘溢出（周二–周五凌晨），周一凌晨不算（周日无夜盘）
  const earlyMorn  = day >= 2 && min < 150

  return (morning || afternoon || nightStart || earlyMorn) ? 'open' : 'closed'
}

/**
 * 伦敦现货金 XAU/USD（Europe/London，自动处理 BST）
 * 伦敦核心交易时段：本地 08:00–17:00 周一至周五
 */
export function londonStatus(): MarketStatus {
  const { day, min } = getZoneInfo('Europe/London')
  if (day === 0 || day === 6) return 'closed'
  return (min >= 480 && min < 1020) ? 'open' : 'closed'
}

/**
 * COMEX 黄金期货 / CME Globex（America/New_York，自动处理 EDT/EST）
 * 周日 18:00 – 周五 17:00 ET，每日 17:00–18:00 维护暂停
 */
export function comexStatus(): MarketStatus {
  const { day, min } = getZoneInfo('America/New_York')

  if (day === 6) return 'closed'                              // 周六
  if (day === 0) return min >= 1080 ? 'open' : 'closed'      // 周日：18:00 后
  if (day === 5) return min < 1020 ? 'open' : 'closed'       // 周五：17:00 前收盘
  // 周一–周四：全天除 17:00–18:00 维护窗口
  return (min < 1020 || min >= 1080) ? 'open' : 'closed'
}
