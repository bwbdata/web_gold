import type { GoldQuote } from '@/types/gold'

/**
 * 解析 qt.gtimg.cn 返回的 GBK 文本
 * 格式：v_hf_XAU="f0,f1,f2,...,f13";
 * 字段：[0]当前价 [1]涨跌幅% [2]买价 [3]卖价 [4]最高 [5]最低 [6]时间 [7]昨收 [8]今开 [12]日期 [13]市场名
 */
export function parseGtimgResponse(raw: string, symbol: string): GoldQuote {
  const match = raw.match(/"([^"]+)"/)
  if (!match || !match[1]) throw new Error(`无法解析 gtimg 响应：${raw.slice(0, 80)}`)

  const parts = match[1].split(',')
  const get = (i: number): string => parts[i] ?? ''

  const price     = parseFloat(get(0))
  const changePct = parseFloat(get(1))
  const high      = parseFloat(get(4))
  const low       = parseFloat(get(5))
  const time      = get(6)
  const prevClose = parseFloat(get(7))
  const open      = parseFloat(get(8))
  const date      = get(12)
  const name      = get(13).trim() || symbol

  return {
    symbol,
    name,
    price,
    changePct,
    change: parseFloat((price - prevClose).toFixed(2)),
    high,
    low,
    open,
    prevClose,
    time,
    date,
  }
}
