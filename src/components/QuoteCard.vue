<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'
import PriceTag from './PriceTag.vue'
import DetailRow from './DetailRow.vue'
import { londonStatus, comexStatus } from '@/utils/marketHours'

const props = defineProps<{ symbol: 'XAU' | 'GC' }>()
const store = useGoldStore()

const data = computed(() => props.symbol === 'XAU' ? store.xau : store.gc)

// CNY/g 换算：USD/oz × 汇率 ÷ 31.1035
const cnyPerGram = computed(() => {
  if (!data.value || !store.usdCny) return null
  return (data.value.price * store.usdCny / 31.1035).toFixed(2)
})

const label = computed(() => props.symbol === 'XAU' ? '伦敦现货金' : '纽约黄金期货')

const status = computed(() => {
  store.countdown // 每秒更新一次作为响应式触发
  return props.symbol === 'XAU' ? londonStatus() : comexStatus()
})
</script>

<template>
  <div class="quote-card">
    <!-- 加载中骨架 -->
    <template v-if="store.loading && !data">
      <div class="skeleton-header" />
      <div class="skeleton-price" />
      <div class="skeleton-rows" />
    </template>

    <!-- 有数据 -->
    <template v-else-if="data">
      <div class="card-header">
        <div class="card-title">
          <span class="name">{{ data.name }}</span>
          <span class="badge">{{ symbol }}</span>
        </div>
        <span class="time">{{ data.date }} {{ data.time }}</span>
        <span class="market-status" :class="status">{{ status === 'open' ? '交易中' : '休市' }}</span>
      </div>

      <div class="price-block">
        <span class="price-usd">{{ data.price.toLocaleString() }}</span>
        <span class="price-unit">USD/oz</span>
      </div>

      <div v-if="cnyPerGram" class="price-cny">
        ≈ <strong>{{ Number(cnyPerGram).toLocaleString() }}</strong> 元/克
      </div>

      <PriceTag :price="data.price" :change="data.change" :change-pct="data.changePct" />

      <div class="details">
        <DetailRow label="最高" :value="data.high.toLocaleString()" />
        <DetailRow label="最低" :value="data.low.toLocaleString()" />
        <DetailRow label="今开" :value="data.open.toLocaleString()" />
        <DetailRow label="昨收" :value="data.prevClose.toLocaleString()" />
      </div>
    </template>

    <!-- 错误 -->
    <div v-else class="error-state">
      <span>{{ label }} 数据加载失败</span>
    </div>
  </div>
</template>

<style scoped>
.quote-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.name {
  font-size: 14px;
  color: var(--text-muted);
}
.badge {
  font-size: 11px;
  background: var(--gold-dark);
  color: var(--gold-light);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.time {
  font-size: 11px;
  color: var(--text-muted);
}
.market-status {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.market-status.open   { color: #4CAF50; background: rgba(76,175,80,0.12); }
.market-status.closed { color: var(--text-muted); background: transparent; }
.price-block {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 4px;
}
.price-usd {
  font-size: 28px;
  font-weight: 700;
  color: var(--gold-primary);
  font-variant-numeric: tabular-nums;
}
.price-unit {
  font-size: 13px;
  color: var(--text-muted);
}
.price-cny {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}
.price-cny strong {
  color: var(--text-primary);
}
.details {
  margin-top: 10px;
}
.error-state {
  text-align: center;
  color: var(--text-muted);
  padding: 20px 0;
  font-size: 14px;
}

/* 骨架屏 */
.skeleton-header,
.skeleton-price,
.skeleton-rows {
  background: var(--skeleton-color);
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}
.skeleton-header { height: 20px; width: 60%; margin-bottom: 12px; }
.skeleton-price  { height: 36px; width: 50%; margin-bottom: 12px; }
.skeleton-rows   { height: 80px; }
@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.8; }
}
</style>
