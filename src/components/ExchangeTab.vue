<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGoldStore } from '@/stores/gold'

const store = useGoldStore()

// ---- USD / CNY ----
const usdAmt = ref('1')
const cnyUsdAmt = ref('')

watch(usdAmt, (val) => {
  const v = parseFloat(val)
  if (!store.usdCny || isNaN(v) || val === '') { cnyUsdAmt.value = ''; return }
  cnyUsdAmt.value = (v * store.usdCny).toFixed(2)
}, { immediate: true })

watch(cnyUsdAmt, (val) => {
  const v = parseFloat(val)
  if (!store.usdCny || isNaN(v) || val === '') { usdAmt.value = ''; return }
  usdAmt.value = (v / store.usdCny).toFixed(4)
})

// ---- JPY / CNY ----
const jpyAmt = ref('1000')
const cnyJpyAmt = ref('')

watch(jpyAmt, (val) => {
  const v = parseFloat(val)
  if (!store.jpyCny || isNaN(v) || val === '') { cnyJpyAmt.value = ''; return }
  cnyJpyAmt.value = (v * store.jpyCny).toFixed(2)
}, { immediate: true })

watch(cnyJpyAmt, (val) => {
  const v = parseFloat(val)
  if (!store.jpyCny || isNaN(v) || val === '') { jpyAmt.value = ''; return }
  jpyAmt.value = (v / store.jpyCny).toFixed(0)
})
</script>

<template>
  <div class="exchange-tab">
    <!-- USD/CNY -->
    <div class="rate-card">
      <div class="card-header">
        <span class="pair-name">美元兑人民币</span>
        <span class="pair-code">USD / CNY</span>
      </div>
      <div class="rate-display" v-if="store.usdCny">
        1 USD = <strong>{{ store.usdCny.toFixed(4) }}</strong> CNY
      </div>
      <div class="calculator">
        <div class="calc-row">
          <div class="calc-field">
            <label>USD</label>
            <input
              v-model="usdAmt"
              type="number"
              inputmode="decimal"
              placeholder="0"
              @focus="($event.target as HTMLInputElement).select()"
            />
          </div>
          <span class="calc-eq">=</span>
          <div class="calc-field">
            <label>CNY</label>
            <input
              v-model="cnyUsdAmt"
              type="number"
              inputmode="decimal"
              placeholder="0"
              @focus="($event.target as HTMLInputElement).select()"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- JPY/CNY -->
    <div class="rate-card">
      <div class="card-header">
        <span class="pair-name">日元兑人民币</span>
        <span class="pair-code">JPY / CNY</span>
      </div>
      <div class="rate-display" v-if="store.jpyCny">
        100 JPY = <strong>{{ (store.jpyCny * 100).toFixed(4) }}</strong> CNY
      </div>
      <div class="calculator">
        <div class="calc-row">
          <div class="calc-field">
            <label>JPY</label>
            <input
              v-model="jpyAmt"
              type="number"
              inputmode="decimal"
              placeholder="0"
              @focus="($event.target as HTMLInputElement).select()"
            />
          </div>
          <span class="calc-eq">=</span>
          <div class="calc-field">
            <label>CNY</label>
            <input
              v-model="cnyJpyAmt"
              type="number"
              inputmode="decimal"
              placeholder="0"
              @focus="($event.target as HTMLInputElement).select()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exchange-tab {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rate-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.pair-name {
  font-size: 14px;
  color: var(--text-muted);
}
.pair-code {
  font-size: 11px;
  background: var(--gold-dark);
  color: var(--gold-light);
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.rate-display {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 14px;
}
.rate-display strong {
  font-size: 22px;
  font-weight: 700;
  color: var(--gold-primary);
  font-variant-numeric: tabular-nums;
}

.calc-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.calc-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.calc-field label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.calc-field input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-page);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  outline: none;
  box-sizing: border-box;
}
.calc-field input:focus {
  border-color: var(--gold-primary);
}
.calc-eq {
  font-size: 18px;
  color: var(--text-muted);
  padding-bottom: 10px;
}
</style>
