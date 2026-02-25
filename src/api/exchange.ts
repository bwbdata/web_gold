export interface ExchangeRates {
  usdCny: number   // 1 USD = ? CNY
  jpyCny: number   // 1 JPY = ? CNY
}

export async function fetchRates(): Promise<ExchangeRates> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!res.ok) throw new Error(`汇率接口请求失败：${res.status}`)

  const json = await res.json()
  const cny = json?.rates?.CNY as number | undefined
  const jpy = json?.rates?.JPY as number | undefined
  if (!cny || !jpy) throw new Error('汇率接口返回数据异常')

  return {
    usdCny: cny,
    jpyCny: cny / jpy,  // 1 JPY = CNY/JPY per USD
  }
}
