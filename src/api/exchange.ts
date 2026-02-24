export async function fetchUsdCny(): Promise<number> {
  const res = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!res.ok) throw new Error(`汇率接口请求失败：${res.status}`)

  const json = await res.json()
  const rate = json?.rates?.CNY as number | undefined
  if (!rate) throw new Error('汇率接口返回数据异常')
  return rate
}
