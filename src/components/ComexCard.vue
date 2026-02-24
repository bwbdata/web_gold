<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'
import PriceTag from './PriceTag.vue'
import DetailRow from './DetailRow.vue'
import { comexStatus } from '@/utils/marketHours'

const store = useGoldStore()

// CNY/g 换算（COMEX USD/oz → CNY/g）
const cnyPerGram = computed(() => {
  if (!store.comex || !store.usdCny) return null
  return (store.comex.price * store.usdCny / 31.1035).toFixed(2)
})

const status = computed(() => {
  store.countdown // 每秒更新一次作为响应式触发
  return comexStatus()
})
</script>

<template>
  <div class="quote-card comex-card">
    <template v-if="store.loading && !store.comex">
      <div class="skeleton-header" />
      <div class="skeleton-price" />
      <div class="skeleton-rows" />
    </template>

    <template v-else-if="store.comex">
      <div class="card-header">
        <div class="card-title">
          <span class="name">国际暗金 · COMEX 隔夜黄金</span>
          <span class="badge">CME Globex</span>
        </div>
        <span class="tag">24H 电子盘</span>
        <span class="market-status" :class="status">{{ status === 'open' ? '交易中' : '休市' }}</span>
      </div>

      <div class="price-block">
        <span class="price-val">{{ store.comex.price.toFixed(1) }}</span>
        <span class="price-unit">USD/oz</span>
      </div>

      <div v-if="cnyPerGram" class="price-cny">
        ≈ <strong>{{ Number(cnyPerGram).toLocaleString() }}</strong> 元/克
      </div>

      <PriceTag
        :price="store.comex.price"
        :change="store.comex.change"
        :change-pct="store.comex.changePct"
      />

      <div class="details">
        <DetailRow label="最高" :value="store.comex.high.toFixed(1)" />
        <DetailRow label="最低" :value="store.comex.low.toFixed(1)" />
        <DetailRow label="今开" :value="store.comex.open.toFixed(1)" />
        <DetailRow label="昨收" :value="store.comex.prevClose.toFixed(1)" />
      </div>
    </template>

    <div v-else class="error-state">COMEX 隔夜黄金数据加载失败</div>
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
.comex-card {
  border-color: #3A2A00;
  background: linear-gradient(135deg, #1A1A1A 0%, #1E1600 100%);
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
  background: #3A2A00;
  color: #C8962A;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}
.tag {
  font-size: 11px;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 1px 6px;
  border-radius: 4px;
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
.price-val {
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
