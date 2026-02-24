<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'

const store = useGoldStore()

// 去重：同一品牌只保留最新一条
const brandList = computed(() => {
  const seen = new Set<string>()
  return store.brands.filter((b: typeof store.brands[0]) => {
    if (seen.has(b.brand)) return false
    seen.add(b.brand)
    return true
  })
})

function fmt(val: string) {
  return val === '-' || val === '' ? '—' : val
}
</script>

<template>
  <div class="section">
    <h3 class="section-title">品牌零售金价 <span class="unit">元/克</span></h3>
    <div v-if="store.loading && !brandList.length" class="skeleton-block" />
    <div v-else-if="brandList.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>品牌</th>
            <th>黄金饰品</th>
            <th>金条</th>
            <th>铂金</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in brandList" :key="b.brand">
            <td class="brand-name">{{ b.brand }}</td>
            <td class="price-cell">{{ fmt(b.gold_price) }}</td>
            <td class="price-cell">{{ fmt(b.bullion_price) }}</td>
            <td class="price-cell dim">{{ fmt(b.platinum_price) }}</td>
          </tr>
        </tbody>
      </table>
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
.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 280px;
}
thead tr {
  background: var(--bg-header);
}
th {
  padding: 10px 12px;
  text-align: right;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
}
th:first-child { text-align: left; }
td {
  padding: 9px 12px;
  text-align: right;
  border-top: 1px solid var(--border-color);
  color: var(--text-primary);
}
td.brand-name {
  text-align: left;
  color: var(--text-secondary);
  white-space: nowrap;
}
td.price-cell { font-variant-numeric: tabular-nums; }
td.dim { color: var(--text-muted); }
.empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  padding: 20px 0;
}
.skeleton-block {
  height: 200px;
  border-radius: 10px;
  background: var(--skeleton-color);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.8; }
}
</style>
