<script setup lang="ts">
import { computed } from 'vue'
import { useGoldStore } from '@/stores/gold'

const store = useGoldStore()

const lastTime = computed(() => {
  if (!store.lastUpdated) return '—'
  return store.lastUpdated.toLocaleTimeString('zh-CN', { hour12: false })
})

// 进度条宽度百分比（30s 倒计时，从 100% → 0%）
const progress = computed(() => `${(store.countdown / 30) * 100}%`)

function onRefresh() {
  store.fetchAll()
}
</script>

<template>
  <div class="refresh-bar">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progress }" />
    </div>
    <div class="bar-content">
      <span class="last-update">更新于 {{ lastTime }}</span>
      <button class="refresh-btn" :class="{ spinning: store.loading }" @click="onRefresh" :disabled="store.loading">
        ↻ {{ store.countdown > 0 ? `${store.countdown}s` : '刷新' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.refresh-bar {
  position: sticky;
  bottom: 56px; /* tab 栏高度 */
  background: var(--bg-page);
  border-top: 1px solid var(--border-color);
  z-index: 10;
}
.progress-track {
  height: 2px;
  background: var(--border-color);
}
.progress-fill {
  height: 100%;
  background: var(--gold-primary);
  transition: width 1s linear;
}
.bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
}
.last-update {
  font-size: 12px;
  color: var(--text-muted);
}
.refresh-btn {
  font-size: 13px;
  color: var(--gold-primary);
  background: transparent;
  border: 1px solid var(--gold-dark);
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.refresh-btn.spinning {
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
