import type { SgeQuote, ComexQuote } from '@/types/gold'

const SGE_URL =
  'https://push2.eastmoney.com/api/qt/stock/get' +
  '?secid=118.AU9999' +
  '&fields=f43,f44,f45,f46,f57,f58,f60,f169,f170' +
  '&ut=fa5fd1943c7b386f172d6893dbfba10b'

const COMEX_URL =
  'https://push2.eastmoney.com/api/qt/stock/get' +
  '?secid=101.GC00Y' +
  '&fields=f43,f44,f45,f46,f57,f58,f60,f169,f170' +
  '&ut=fa5fd1943c7b386f172d6893dbfba10b'

export async function fetchSgeGold(): Promise<SgeQuote> {
  const res = await fetch(SGE_URL)
  if (!res.ok) throw new Error(`东方财富请求失败：${res.status}`)

  const json = await res.json()
  const d = json.data
  if (!d) throw new Error('东方财富返回数据为空')

  // 所有价格字段需 ÷100
  return {
    code:      d.f57 as string,
    name:      d.f58 as string,
    price:     d.f43 / 100,
    high:      d.f44 / 100,
    low:       d.f45 / 100,
    open:      d.f46 / 100,
    prevClose: d.f60 / 100,
    change:    d.f169 / 100,
    changePct: d.f170 / 100,
  }
}

export async function fetchComexGold(): Promise<ComexQuote> {
  const res = await fetch(COMEX_URL)
  if (!res.ok) throw new Error(`东方财富 COMEX 请求失败：${res.status}`)

  const json = await res.json()
  const d = json.data
  if (!d) throw new Error('东方财富 COMEX 返回数据为空')

  // COMEX 价格字段需 ÷10（精度到 0.1 USD/oz），涨跌幅 f170 需 ÷100
  return {
    code:      d.f57 as string,
    name:      d.f58 as string,
    price:     d.f43 / 10,
    high:      d.f44 / 10,
    low:       d.f45 / 10,
    open:      d.f46 / 10,
    prevClose: d.f60 / 10,
    change:    d.f169 / 10,
    changePct: d.f170 / 100,
  }
}
