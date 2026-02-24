<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGoldStore } from '@/stores/gold'
import QuoteCard from '@/components/QuoteCard.vue'
import SgeCard from '@/components/SgeCard.vue'
import BrandPriceTable from '@/components/BrandPriceTable.vue'
import BankPriceList from '@/components/BankPriceList.vue'
import RecycleList from '@/components/RecycleList.vue'
import RefreshBar from '@/components/RefreshBar.vue'

const store = useGoldStore()
const activeTab = ref<'quote' | 'domestic' | 'recycle'>('quote')

const today = computed(() => new Date().toLocaleDateString('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
}))

const usdCnyDisplay = computed(() =>
  store.usdCny ? `USD/CNY ${store.usdCny.toFixed(4)}` : 'USD/CNY —'
)

onMounted(() => {
  store.fetchAll()
  store.startAutoRefresh()
})

onUnmounted(() => {
  store.stopAutoRefresh()
})
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-main">
        <div class="header-left">
          <h1 class="app-title">黄金行情</h1>
          <span class="today">{{ today }}</span>
        </div>
        <div class="rate-badge">{{ usdCnyDisplay }}</div>
      </div>
    </header>

    <!-- 主内容区（留出 header + tab + refreshbar 高度） -->
    <main class="main">
      <!-- Tab 1：国际行情 -->
      <div v-show="activeTab === 'quote'" class="tab-panel">
        <QuoteCard symbol="XAU" />
        <QuoteCard symbol="GC" />
        <SgeCard />
      </div>

      <!-- Tab 2：国内金价 -->
      <div v-show="activeTab === 'domestic'" class="tab-panel">
        <BrandPriceTable />
        <BankPriceList />
      </div>

      <!-- Tab 3：回收价 -->
      <div v-show="activeTab === 'recycle'" class="tab-panel">
        <RecycleList />
      </div>
    </main>

    <!-- 刷新状态栏 -->
    <RefreshBar />

    <!-- 底部 Tab 导航 -->
    <nav class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'quote' }"
        @click="activeTab = 'quote'"
      >
        <span class="tab-icon">📈</span>
        <span class="tab-label">行情</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'domestic' }"
        @click="activeTab = 'domestic'"
      >
        <span class="tab-icon">🏪</span>
        <span class="tab-label">国内金价</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'recycle' }"
        @click="activeTab = 'recycle'"
      >
        <span class="tab-icon">♻️</span>
        <span class="tab-label">回收价</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: var(--bg-page);
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  padding: env(safe-area-inset-top, 0) 0 0;
}
.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}
.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.app-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--gold-primary);
  letter-spacing: 1px;
}
.today {
  font-size: 11px;
  color: var(--text-muted);
}
.rate-badge {
  font-size: 12px;
  color: var(--gold-light);
  background: var(--gold-dark);
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* Main */
.main {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 0;
  /* 留出底部 refreshbar + tab 的空间 */
  padding-bottom: calc(56px + 40px + 12px);
}
.tab-panel {
  padding-bottom: 8px;
}

/* Tab Nav */
.tab-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  background: var(--bg-header);
  border-top: 1px solid var(--border-color);
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 30;
}
.tab-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 0;
  background: transparent;
  border: none;
  color: var(--text-muted);
  transition: color 0.2s;
  min-height: 56px;
}
.tab-btn.active {
  color: var(--gold-primary);
}
.tab-icon { font-size: 18px; }
.tab-label { font-size: 11px; }
</style>
