<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'
import PriceTag from './PriceTag.vue'
import DetailRow from './DetailRow.vue'
import { sgeStatus } from '@/utils/marketHours'

const store = useGoldStore()

const status = computed(() => {
  store.countdown // 每秒更新一次作为响应式触发
  return sgeStatus()
})
</script>

<template>
  <div class="quote-card sge-card">
    <template v-if="store.loading && !store.sge">
      <div class="skeleton-header" />
      <div class="skeleton-price" />
      <div class="skeleton-rows" />
    </template>

    <template v-else-if="store.sge">
      <div class="card-header">
        <div class="card-title">
          <span class="name">{{ store.sge.name }}</span>
          <span class="badge">上海金交所</span>
        </div>
        <span class="tag">现货</span>
        <span class="market-status" :class="status">{{ status === 'open' ? '交易中' : '休市' }}</span>
      </div>

      <div class="price-block">
        <span class="price-cny-val">{{ store.sge.price.toFixed(2) }}</span>
        <span class="price-unit">元/克</span>
      </div>

      <PriceTag
        :price="store.sge.price"
        :change="store.sge.change"
        :change-pct="store.sge.changePct"
      />

      <div class="details">
        <DetailRow label="最高" :value="store.sge.high.toFixed(2)" />
        <DetailRow label="最低" :value="store.sge.low.toFixed(2)" />
        <DetailRow label="今开" :value="store.sge.open.toFixed(2)" />
        <DetailRow label="昨收" :value="store.sge.prevClose.toFixed(2)" />
      </div>
    </template>

    <div v-else class="error-state">上海金交所数据加载失败</div>
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
.sge-card {
  border-color: var(--gold-dark);
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
.price-cny-val {
  font-size: 28px;
  font-weight: 700;
  color: var(--gold-primary);
  font-variant-numeric: tabular-nums;
}
.price-unit {
  font-size: 13px;
  color: var(--text-muted);
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
