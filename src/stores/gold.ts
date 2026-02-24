import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GoldQuote, SgeQuote, ComexQuote, BankBarPrice, BrandPrice, RecyclePrice } from '@/types/gold'
import { fetchGtimgGold } from '@/api/gtimg'
import { fetchSgeGold, fetchComexGold } from '@/api/eastmoney'
import { fetchXxapiGold } from '@/api/xxapi'
import { fetchUsdCny } from '@/api/exchange'

export const useGoldStore = defineStore('gold', () => {
  const xau        = ref<GoldQuote | null>(null)
  const gc         = ref<GoldQuote | null>(null)
  const sge        = ref<SgeQuote | null>(null)
  const comex      = ref<ComexQuote | null>(null)
  const usdCny     = ref<number>(0)
  const bankBars   = ref<BankBarPrice[]>([])
  const brands     = ref<BrandPrice[]>([])
  const recycles   = ref<RecyclePrice[]>([])
  const loading    = ref(false)
  const error      = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const countdown  = ref(0)

  let timer: ReturnType<typeof setInterval> | null = null

  async function fetchAll() {
    loading.value = true
    error.value = null

    const results = await Promise.allSettled([
      fetchGtimgGold('hf_XAU'),
      fetchGtimgGold('hf_GC'),
      fetchSgeGold(),
      fetchComexGold(),
      fetchUsdCny(),
      fetchXxapiGold(),
    ])

    const [xauRes, gcRes, sgeRes, comexRes, rateRes, xxapiRes] = results

    if (xauRes.status === 'fulfilled')   xau.value    = xauRes.value
    if (gcRes.status === 'fulfilled')    gc.value     = gcRes.value
    if (sgeRes.status === 'fulfilled')   sge.value    = sgeRes.value
    if (comexRes.status === 'fulfilled') comex.value  = comexRes.value
    if (rateRes.status === 'fulfilled')  usdCny.value = rateRes.value
    if (xxapiRes.status === 'fulfilled') {
      bankBars.value = xxapiRes.value.bankBars
      brands.value   = xxapiRes.value.brands
      recycles.value = xxapiRes.value.recycles
    }

    // 若全部失败才报错，单个失败不阻断显示
    const allFailed = results.every(r => r.status === 'rejected')
    if (allFailed) {
      error.value = '数据加载失败，请检查网络后重试'
    }

    lastUpdated.value = new Date()
    countdown.value = 60
    loading.value = false
  }

  function startAutoRefresh() {
    if (timer) return
    timer = setInterval(() => {
      if (countdown.value <= 1) {
        fetchAll()
      } else {
        countdown.value--
      }
    }, 1000)
  }

  function stopAutoRefresh() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    xau, gc, sge, comex, usdCny,
    bankBars, brands, recycles,
    loading, error, lastUpdated, countdown,
    fetchAll, startAutoRefresh, stopAutoRefresh,
  }
})
