<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'

const store = useGoldStore()

// 按日期分组
const grouped = computed(() => {
  const map = new Map<string, typeof store.recycles>()
  for (const item of store.recycles) {
    const list = map.get(item.updated_date) ?? []
    list.push(item)
    map.set(item.updated_date, list)
  }
  // 日期从新到旧排序
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})
</script>

<template>
  <div class="section">
    <h3 class="section-title">黄金回收参考价 <span class="unit">元/克</span></h3>
    <div v-if="store.loading && !store.recycles.length" class="skeleton-block" />
    <div v-else-if="grouped.length">
      <div v-for="([date, items]) in grouped" :key="date" class="group">
        <div class="group-date">{{ date }}</div>
        <div class="list">
          <div v-for="(item, i) in items" :key="i" class="list-item">
            <span class="type-name">{{ item.gold_type }}</span>
            <span class="recycle-price">{{ item.recycle_price }}</span>
          </div>
        </div>
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
.group { margin-bottom: 12px; }
.group-date {
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px 0 6px;
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
.type-name { color: var(--text-secondary); }
.recycle-price {
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
