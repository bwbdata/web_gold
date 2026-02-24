<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  highlight?: boolean
}>()
</script>

<template>
  <div class="detail-row">
    <span class="label">{{ label }}</span>
    <span class="value" :class="{ highlight }">{{ value }}</span>
  </div>
</template>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--border-color);
}
.detail-row:last-child {
  border-bottom: none;
}
.label {
  color: var(--text-muted);
}
.value {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.value.highlight {
  color: var(--gold-primary);
  font-weight: 600;
}
</style>
