import type { GoldQuote } from '@/types/gold'
import { parseGtimgResponse } from '@/utils/parser'

export async function fetchGtimgGold(symbol: 'hf_XAU' | 'hf_GC'): Promise<GoldQuote> {
  const res = await fetch(`/api/q=${symbol}`)
  if (!res.ok) throw new Error(`gtimg 请求失败：${res.status}`)

  // 响应为 GBK 编码，使用 ArrayBuffer + TextDecoder 解码
  const buf = await res.arrayBuffer()
  const text = new TextDecoder('gbk').decode(buf)
  const key = symbol === 'hf_XAU' ? 'XAU' : 'GC'
  return parseGtimgResponse(text, key)
}
