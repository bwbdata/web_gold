# 开发进度记录 — Web Gold

> 每次开发前，先看「当前进度」一节，找到上次停止的位置，继续往下做。
> 每完成一个步骤，将状态从 `[ ]` 改为 `[x]`，并在备注栏补充关键信息。

---

## 当前进度

**阶段：核心代码全部完成，构建通过 ✅**

| 项 | 内容 |
|----|------|
| 上次完成步骤 | Step 11 — App.vue 整合（`npm run build` 零错误） |
| 下次从哪里开始 | **Step 13 — 本地联调测试**（`npm run dev`，验证接口数据） |
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

- [x] 在 `web_gold/` 目录下运行 `npm create vite@latest . -- --template vue-ts`
- [x] 安装依赖：`npm install`
- [x] 安装 Pinia：`npm install pinia`
- [x] 删除 Vite 模板默认文件（`HelloWorld.vue`、`vue.svg` 等）
- [x] 验证 `npm run dev` 能正常启动

**备注：** 目录已有文件，用临时目录生成后复制过来

---

## Step 2 — 基础配置

- [x] 配置 `vite.config.ts`：proxy `/api/` → `http://qt.gtimg.cn/`，`base: './'`，`@` 别名
- [x] 配置 `tsconfig.app.json`：`baseUrl + paths` 支持 `@` 别名
- [x] 在 `index.html` 补充 viewport meta、title、移动端 meta

**备注：** tsconfig 需同时配置 paths 才能让 vue-tsc 识别 `@/` 别名

---

## Step 3 — 类型定义

- [x] 创建 `src/types/gold.ts`：`GoldQuote / SgeQuote / BankBarPrice / BrandPrice / RecyclePrice`

---

## Step 4 — 数据解析工具

- [x] 创建 `src/utils/parser.ts`：`parseGtimgResponse(raw, symbol)` 解析 GBK 文本
- [x] 使用辅助函数 `get(i)` 避免 `parts[i]` 可能为 undefined 的 strict 报错

---

## Step 5 — API 请求封装

- [x] `src/api/gtimg.ts`：GBK arrayBuffer → TextDecoder('gbk') → parseGtimgResponse
- [x] `src/api/eastmoney.ts`：东方财富 Au9999，所有价格字段 ÷100
- [x] `src/api/xxapi.ts`：xxapi goldprice，解构三个数组
- [x] `src/api/exchange.ts`：open.er-api.com 取 rates.CNY

---

## Step 6 — Pinia Store

- [x] `src/stores/gold.ts`：Promise.allSettled 并发五路接口，单路失败不阻断其他
- [x] `src/main.ts`：注册 createPinia()

---

## Step 7 — 基础子组件

- [x] `PriceTag.vue`：涨红跌绿平灰 + ▲▼ 箭头
- [x] `DetailRow.vue`：label / value 双列行

---

## Step 8 — 行情卡片组件

- [x] `QuoteCard.vue`：XAU/GC，USD/oz + 换算 CNY/g（÷31.1035）+ 骨架屏
- [x] `SgeCard.vue`：Au9999 CNY/g，金色边框区分

---

## Step 9 — 国内金价组件

- [x] `BrandPriceTable.vue`：品牌去重，横向滚动表格（黄金/金条/铂金）
- [x] `BankPriceList.vue`：银行金条价列表
- [x] `RecycleList.vue`：回收价按日期分组展示

---

## Step 10 — 刷新栏组件

- [x] `RefreshBar.vue`：30s 倒计时进度条、手动刷新按钮、最后更新时间

---

## Step 11 — App.vue 整合

- [x] `style.css`：CSS Variables 黄金深色主题，全局 reset
- [x] `App.vue`：Header（标题+日期+汇率徽章）、底部 Tab 导航（行情/国内金价/回收价）、RefreshBar
- [x] `npm run build` 通过，产物：JS 77.75kB（gzip 30.47kB）、CSS 10.68kB

**备注：** 修复了三处 TS 错误：tsconfig paths 别名、parser 数组越界、QuoteCard unused var

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

## Step 12 — 版本节点

| 日期 | 版本 | 完成内容 |
|------|------|----------|
| 2026-02-24 | v0.1 | 完成规划文档（Step 0） |
| 2026-02-24 | v0.2 | 核心代码完成，构建通过（Step 1–11） |
