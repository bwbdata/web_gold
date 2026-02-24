<script setup lang="ts">
import { useGoldStore } from '@/stores/gold'

const store = useGoldStore()
</script>

<template>
  <div class="section">
    <h3 class="section-title">银行金条价 <span class="unit">元/克</span></h3>
    <div v-if="store.loading && !store.bankBars.length" class="skeleton-block" />
    <div v-else-if="store.bankBars.length" class="list">
      <div v-for="(item, i) in store.bankBars" :key="i" class="list-item">
        <span class="bank-name">{{ item.bank }}</span>
        <span class="bank-price">{{ item.price }}</span>
      </div>
    </div>
    <p v-else class="empty">暂无数据</p>
  </div>
</template>

<style scoped>
.section { margin-bottom: 16px; }
.section-title {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.unit {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 400;
}
.list {
  border-radius: 10px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 14px;
  font-size: 13px;
  border-bottom: 1px solid var(--border-color);
}
.list-item:last-child { border-bottom: none; }
.bank-name { color: var(--text-secondary); }
.bank-price {
  color: var(--gold-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  padding: 20px 0;
}
.skeleton-block {
  height: 160px;
  border-radius: 10px;
  background: var(--skeleton-color);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.8; }
}
</style>
