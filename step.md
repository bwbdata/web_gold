# 开发进度记录 — Web Gold

> 每次开发前，先看「当前进度」一节，找到上次停止的位置，继续往下做。
> 每完成一个步骤，将状态从 `[ ]` 改为 `[x]`，并在备注栏补充关键信息。

---

## 当前进度

**阶段：规划完成，尚未初始化项目**

| 项 | 内容 |
|----|------|
| 上次完成步骤 | Step 0 — 规划文档（README.md / project.md / step.md） |
| 下次从哪里开始 | **Step 1 — 初始化 Vite 项目** |
| 遗留问题 | 无 |

---

## Step 0 — 规划文档

- [x] 创建 `README.md`（功能说明、技术栈、快速开始）
- [x] 创建 `project.md`（API 字段解析、架构、组件设计、UI 规范）
- [x] 创建 `step.md`（本文件）
- [x] 确认五路接口及 CORS 方案

**备注：**
- qt.gtimg.cn 接口需要 Vite proxy（开发）/ Nginx 反代（生产），其余四个直接 fetch
- 东方财富 SGE Au9999：`secid=118.AU9999`，价格字段需 ÷100
- 汇率：`open.er-api.com/v6/latest/USD` → `rates.CNY`

---

## Step 1 — 初始化项目

- [ ] 在 `web_gold/` 目录下运行 `npm create vite@latest . -- --template vue-ts`
- [ ] 安装依赖：`npm install`
- [ ] 安装 Pinia：`npm install pinia`
- [ ] 删除 Vite 模板默认文件（`src/assets/vue.svg`、`src/components/HelloWorld.vue`、`src/style.css` 模板内容等）
- [ ] 验证 `npm run dev` 能正常启动

**备注：**

---

## Step 2 — 基础配置

- [ ] 配置 `vite.config.ts`：
  - server.proxy 将 `/api/` 转发到 `http://qt.gtimg.cn/`
  - 设置 `base: './'`（方便静态部署）
- [ ] 配置 `tsconfig.json`：确认 `strict: true`、路径别名 `@` → `src/`
- [ ] 在 `index.html` 补充 viewport meta、title、主题色 meta

**备注：**

---

## Step 3 — 类型定义

- [ ] 创建 `src/types/gold.ts`，定义：
  - `GoldQuote`（XAU/GC，来自 gtimg）
  - `SgeQuote`（Au9999，来自东方财富）
  - `BankBarPrice`（银行金条）
  - `BrandPrice`（品牌零售）
  - `RecyclePrice`（黄金回收）

**备注：**

---

## Step 4 — 数据解析工具

- [ ] 创建 `src/utils/parser.ts`：
  - `parseGtimgResponse(raw: string): GoldQuote`
  - 使用 `TextDecoder('gbk')` 处理编码（或在 fetch 层处理）
  - 字段提取：index 0/1/4/5/6/7/8/12/13

**备注：**

---

## Step 5 — API 请求封装

- [ ] 创建 `src/api/gtimg.ts`：`fetchGtimgGold(symbol: 'hf_XAU' | 'hf_GC'): Promise<GoldQuote>`
  - 请求路径：`/api/q=hf_XAU`（走 Vite proxy）
  - Response 用 `arrayBuffer()` + `TextDecoder('gbk')` 解码
- [ ] 创建 `src/api/eastmoney.ts`：`fetchSgeGold(): Promise<SgeQuote>`
  - URL：`https://push2.eastmoney.com/api/qt/stock/get?secid=118.AU9999&fields=f43,f44,f45,f46,f57,f58,f60,f169,f170&ut=fa5fd1943c7b386f172d6893dbfba10b`
  - 价格字段 ÷100
- [ ] 创建 `src/api/xxapi.ts`：`fetchXxapiGold(): Promise<{bankBars, brands, recycles}>`
  - URL：`https://v2.xxapi.cn/api/goldprice`
- [ ] 创建 `src/api/exchange.ts`：`fetchUsdCny(): Promise<number>`
  - URL：`https://open.er-api.com/v6/latest/USD`
  - 返回 `data.rates.CNY`

**备注：**

---

## Step 6 — Pinia Store

- [ ] 创建 `src/stores/gold.ts`：
  - State：`xau / gc / sge / usdCny / bankBars / brands / recycles / loading / error / lastUpdated / countdown`
  - `fetchAll()`：`Promise.allSettled` 并发请求五路接口
  - `startAutoRefresh()`：`setInterval` 每秒减 countdown，归零时调 fetchAll
  - `stopAutoRefresh()`：清除 interval
- [ ] 在 `src/main.ts` 注册 Pinia

**备注：**

---

## Step 7 — 基础子组件

- [ ] 创建 `src/components/PriceTag.vue`
  - Props：`price: number, change: number, changePct: number, unit?: string`
  - 涨红跌绿平灰 + ↑↓ 箭头
- [ ] 创建 `src/components/DetailRow.vue`
  - Props：`label: string, value: string | number, highlight?: boolean`
  - 用于展示高/低/开/收单行数据

**备注：**

---

## Step 8 — 行情卡片组件

- [ ] 创建 `src/components/QuoteCard.vue`
  - Props：`symbol: 'XAU' | 'GC'`
  - 显示：市场名、当前价（USD/oz）、≈人民币价（CNY/g，由 usdCny 换算）、涨跌额/幅、高/低/开/收
  - Loading skeleton（灰色占位块）/ Error 状态
- [ ] 创建 `src/components/SgeCard.vue`
  - 无 Props，从 store 读 sge
  - 显示：黄金9999（上海金交所）、当前价（CNY/g）、涨跌额/幅、高/低/开/收
  - Loading / Error 状态

**备注：**

---

## Step 9 — 国内金价组件

- [ ] 创建 `src/components/BrandPriceTable.vue`
  - 从 store 读 brands
  - 横向滚动表格：品牌 / 黄金饰品 / 金条 / 铂金
  - "-" 值显示为 `—`
- [ ] 创建 `src/components/BankPriceList.vue`
  - 从 store 读 bankBars
  - 列表卡片：银行名称 + 价格（元/克）

**备注：**

---

## Step 10 — 回收价组件

- [ ] 创建 `src/components/RecycleList.vue`
  - 从 store 读 recycles
  - 按 updated_date 分组，展示品类 + 回收价

**备注：**

---

## Step 11 — 刷新栏组件

- [ ] 创建 `src/components/RefreshBar.vue`
  - 显示「最后更新 HH:mm:ss」
  - 30 秒倒计时进度条（CSS `animation: linear`）
  - 手动刷新按钮（点击时旋转动画 + 调 store.fetchAll）

**备注：**

---

## Step 12 — App.vue 整合

- [ ] 编写 `src/App.vue`：
  - Header：标题「黄金行情」+ 日期 + **汇率徽章** `USD/CNY 6.92`
  - 底部 Tab 导航：行情 / 国内金价 / 回收价（固定底部，`position: fixed`）
  - Tab 1 行情页：`<QuoteCard symbol="XAU" />` + `<QuoteCard symbol="GC" />` + `<SgeCard />`
  - Tab 2 国内金价：`<BrandPriceTable />` + `<BankPriceList />`
  - Tab 3 回收价：`<RecycleList />`
  - `<RefreshBar />`（吸附在内容区底部 Tab 之上）
- [ ] 编写全局 CSS（CSS Variables 金色主题、深色背景、移动端适配）
- [ ] `onMounted` 调用 `store.fetchAll()` + `store.startAutoRefresh()`，`onUnmounted` 调用 `stopAutoRefresh()`

**备注：**

---

## Step 13 — 联调与测试

- [ ] 启动 `npm run dev`，验证五路接口数据正常返回
- [ ] 验证 GBK 解码（gtimg 接口中文名称正确显示）
- [ ] 验证 CNY/g 换算数字合理（对比 xxapi 品牌价 ~1540）
- [ ] 验证自动刷新倒计时逻辑
- [ ] 验证 Loading / Error 状态渲染
- [ ] Chrome DevTools 移动端模拟：iPhone 14 Pro、Pixel 7

**备注：**

---

## Step 14 — 构建与部署准备

- [ ] 运行 `npm run build`，检查产出物大小
- [ ] 运行 `npm run preview`，验证生产包可用
- [ ] 在 README.md 中补充 Nginx 反代配置示例（qt.gtimg.cn 代理）
- [ ] 整理 `.gitignore`，确保 `node_modules/`、`dist/` 已忽略

**备注：**

---

## 问题记录

| 日期 | 步骤 | 问题描述 | 解决方案 |
|------|------|----------|----------|
| — | — | — | — |

---

## 版本节点

| 日期 | 版本 | 完成内容 |
|------|------|----------|
| 2026-02-24 | v0.1 | 完成规划文档（Step 0） |
