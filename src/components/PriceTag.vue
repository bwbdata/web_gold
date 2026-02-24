<script setup lang="ts">
defineProps<{
  price: number
  change: number
  changePct: number
  unit?: string
}>()
</script>

<template>
  <div class="price-tag" :class="change > 0 ? 'up' : change < 0 ? 'down' : 'flat'">
    <span class="arrow">{{ change > 0 ? '▲' : change < 0 ? '▼' : '—' }}</span>
    <span class="change-amt">{{ change > 0 ? '+' : '' }}{{ change.toFixed(2) }}</span>
    <span class="change-pct">({{ changePct > 0 ? '+' : '' }}{{ changePct.toFixed(2) }}%)</span>
  </div>
</template>

<style scoped>
.price-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
}
.up   { color: var(--up-color); }
.down { color: var(--down-color); }
.flat { color: var(--flat-color); }
.arrow { font-size: 11px; }
</style>
