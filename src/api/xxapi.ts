import type { BankBarPrice, BrandPrice, RecyclePrice } from '@/types/gold'

interface XxapiResult {
  bankBars: BankBarPrice[]
  brands: BrandPrice[]
  recycles: RecyclePrice[]
}

export async function fetchXxapiGold(): Promise<XxapiResult> {
  const res = await fetch('https://v2.xxapi.cn/api/goldprice')
  if (!res.ok) throw new Error(`xxapi 请求失败：${res.status}`)

  const json = await res.json()
  if (json.code !== 200) throw new Error(`xxapi 返回错误：${json.msg}`)

  return {
    bankBars: json.data.bank_gold_bar_price as BankBarPrice[],
    brands:   json.data.precious_metal_price as BrandPrice[],
    recycles: json.data.gold_recycle_price as RecyclePrice[],
  }
}
