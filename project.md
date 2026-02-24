# Project Plan — Web Gold

## 一、项目目标

构建一个**纯前端手机端单页 Web App**，无需后端服务，聚合三路接口，实时展示国际金价行情与国内零售金价。

| 接口 | 用途 | 跨域处理 |
|------|------|----------|
| `http://qt.gtimg.cn/q=hf_XAU` | 伦敦金现货（USD/盎司） | Vite proxy / Nginx 反代 |
| `http://qt.gtimg.cn/q=hf_GC`  | 纽约黄金期货（COMEX） | Vite proxy / Nginx 反代 |
| `https://push2.eastmoney.com/api/qt/stock/get?secid=118.AU9999&...` | 上海金交所 Au9999 现货（CNY/克） | 直接请求（CORS 已开放） |
| `https://v2.xxapi.cn/api/goldprice` | 国内银行金条、品牌零售、黄金回收价 | 直接请求（CORS 已开放） |
| `https://open.er-api.com/v6/latest/USD` | USD/CNY 实时汇率 | 直接请求（CORS 已开放） |

---

## 二、API 数据字段解析

接口返回格式（GBK 编码，需转换）：

```
v_hf_XAU="字段0,字段1,...,字段13";
```

| 下标 | 含义 | 示例 |
|------|------|------|
| 0 | 当前价格 | 5175.26 |
| 1 | 涨跌幅（%） | -1.00 |
| 2 | 买入价 | 5175.26 |
| 3 | 卖出价 | 5176.16 |
| 4 | 最高价 | 5249.29 |
| 5 | 最低价 | 5144.77 |
| 6 | 数据时间 | 09:52:00 |
| 7 | 昨收价 | 5227.43 |
| 8 | 今开价 | 5231.58 |
| 12 | 日期 | 2026-02-24 |
| 13 | 市场名称 | 伦敦金（现货黄金） |

> 涨跌额 = 当前价 - 昨收价（前端计算）
> CNY/克换算：`价格(USD/oz) × 汇率(USD→CNY) ÷ 31.1035`

### 接口二：东方财富 SGE Au9999（上海黄金交易所现货）

```
https://push2.eastmoney.com/api/qt/stock/get
  ?secid=118.AU9999
  &fields=f43,f44,f45,f46,f47,f57,f58,f60,f169,f170
  &ut=fa5fd1943c7b386f172d6893dbfba10b
```

返回 JSON，所有价格字段需 **÷100** 得到实际值（CNY/克）：

| 字段 | 含义 | 示例原值 → 实际 |
|------|------|----------------|
| `f43` | 当前价 | 114788 → 1147.88 CNY/g |
| `f44` | 最高价 | 115800 → 1158.00 |
| `f45` | 最低价 | 113830 → 1138.30 |
| `f46` | 今开价 | 115500 → 1155.00 |
| `f60` | 昨收价 | 110892 → 1108.92 |
| `f169` | 涨跌额 | 3896 → +38.96 |
| `f170` | 涨跌幅 | 351 → +3.51% |
| `f57` | 代码 | "AU9999" |
| `f58` | 名称 | "黄金9999" |

CORS: `Access-Control-Allow-Origin: *`，无需代理，无需 Key。

### 接口三：`https://open.er-api.com/v6/latest/USD`

```json
{ "rates": { "CNY": 6.91626 }, "time_last_update_utc": "..." }
```
取 `rates.CNY` 作为换算汇率，每次 `fetchAll` 时并发请求，与金价同步刷新。

### 接口五：`https://v2.xxapi.cn/api/goldprice`

返回标准 JSON，无需代理，直接 `fetch`。

**`data.bank_gold_bar_price[]`** — 银行金条价（元/克）

| 字段 | 含义 | 示例 |
|------|------|------|
| `bank` | 银行 + 产品名 | 工商银行如意金条 |
| `price` | 金条价格 | 1165.95 |

**`data.precious_metal_price[]`** — 品牌贵金属零售价（元/克）

| 字段 | 含义 | 示例 |
|------|------|------|
| `brand` | 品牌名 | 周大福、老凤祥、中国黄金… |
| `bullion_price` | 金条价 | 1355 |
| `gold_price` | 黄金饰品价 | 1545 |
| `platinum_price` | 铂金价 | 863（"-"表示无数据） |
| `updated_date` | 更新日期 | 2026-02-24 |

**`data.gold_recycle_price[]`** — 黄金回收价（元/克）

| 字段 | 含义 | 示例 |
|------|------|------|
| `gold_type` | 品类 | 黄金回收、pd999纯金回收… |
| `recycle_price` | 回收价 | 1143.0 |
| `updated_date` | 更新日期 | 2026-02-23 |

---

## 三、项目架构

```
src/
├── api/
│   ├── gtimg.ts         # fetchGtimgGold(symbol) → GBK 文本解析
│   ├── eastmoney.ts     # fetchSgeGold() → Au9999 现货（东方财富）
│   ├── xxapi.ts         # fetchXxapiGold() → JSON 直接返回
│   └── exchange.ts      # fetchUsdCny() → 汇率
├── types/
│   └── gold.ts          # GoldQuote、SgeQuote、BankBarPrice、BrandPrice、RecyclePrice 类型
├── utils/
│   └── parser.ts        # parseGtimgResponse(raw) 解析器
├── stores/
│   └── gold.ts          # Pinia store：全部数据 + loading + error + 自动刷新
├── components/
│   ├── QuoteCard.vue    # 国际金价卡片（XAU / GC，复用，显示 USD/oz + CNY/g）
│   ├── SgeCard.vue      # 上海金交所 Au9999 卡片（直接 CNY/g）
│   ├── PriceTag.vue     # 价格 + 涨跌色标 + 箭头
│   ├── DetailRow.vue    # 单行明细（高/低/开/收）
│   ├── BankPriceList.vue   # 银行金条价列表
│   ├── BrandPriceTable.vue # 品牌零售金价表格
│   ├── RecycleList.vue     # 黄金回收价列表
│   └── RefreshBar.vue   # 刷新按钮 + 倒计时进度条
└── App.vue              # Tab 页签切换：行情 / 国内金价 / 回收价
```

---

## 四、组件设计

### App.vue
- 页面整体布局（竖向 flex）
- Header（标题 + 当前日期）
- **底部 Tab 导航**：行情 / 国内金价 / 回收价 三个页签
- 引用 `<RefreshBar>`（全局刷新状态）

### Tab 1 — 行情页
- 两个 `<QuoteCard>`（XAU 伦敦现货、GC 纽约期货），每张卡同时显示 USD/oz 和换算后的 CNY/g
- 一个 `<SgeCard>`（上海金交所 Au9999，直接 CNY/g）
- Header 区域显示**汇率徽章**：`USD/CNY 6.92`

### QuoteCard.vue
Props: `symbol: 'XAU' | 'GC'`
- 从 store 读取对应数据
- 显示：市场名称、当前价（USD/oz）、**换算人民币价（CNY/克）**、涨跌额 + 涨跌幅、最高/最低/今开/昨收
- CNY/克 = `price × usdCny / 31.1035`，汇率来自 store
- Loading skeleton / Error 占位

### SgeCard.vue
- 从 store 读取 `sge` 数据（东方财富 Au9999）
- 显示：黄金9999、当前价（CNY/g）、涨跌额 + 涨跌幅、最高/最低/今开/昨收

### Tab 2 — 国内金价页
- `<BrandPriceTable>` 品牌零售金价（黄金/金条/铂金，横向滚动表格）
- `<BankPriceList>` 银行金条价列表

### Tab 3 — 回收价页
- `<RecycleList>` 黄金回收价列表（按日期分组）

### PriceTag.vue
Props: `price: number, change: number, changePct: number`
- 涨 → 红色；跌 → 绿色；平 → 灰色（国内习惯）
- 箭头图标（↑↓）

### RefreshBar.vue
- 倒计时 30 秒进度条（CSS animation）
- 手动刷新按钮（旋转动画）
- 显示"最后更新 HH:mm:ss"

---

## 五、状态管理（Pinia）

```ts
// stores/gold.ts
interface GoldStore {
  xau: GoldQuote | null
  gc:  GoldQuote | null
  sge: SgeQuote  | null  // 上海金交所 Au9999
  usdCny: number         // 汇率，默认 0
  bankBars: BankBarPrice[]
  brands:   BrandPrice[]
  recycles: RecyclePrice[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  countdown: number           // 0-30 秒
  fetchAll(): Promise<void>   // 并发请求全部五个接口（gtimg×2 + eastmoney + xxapi + exchange）
  startAutoRefresh(): void
  stopAutoRefresh(): void
}
```

自动刷新逻辑：
1. `setInterval` 每秒更新 `countdown`
2. `countdown` 归零时触发 `fetchAll()`，重置为 30

---

## 六、CORS 解决方案

| 接口 | 环境 | 方案 |
|------|------|------|
| `qt.gtimg.cn` | 本地开发 | `vite.config.ts` server.proxy 将 `/api/*` 转发 |
| `qt.gtimg.cn` | 生产部署 | Nginx `location /api/` 反向代理，添加 CORS 头 |
| `push2.eastmoney.com` | 全部 | 直接 fetch，CORS `*`，无需代理 |
| `v2.xxapi.cn` | 全部 | 直接 fetch，CORS 已开放，无需代理 |
| `open.er-api.com` | 全部 | 直接 fetch，CORS `*`，免费无需 Key |

腾讯接口请求 URL 规则：
- 开发：`/api/q=hf_XAU`  → `http://qt.gtimg.cn/q=hf_XAU`
- 生产：同上路径，由 Nginx 代理

---

## 七、UI 设计规范

### 主题色（CSS Variables）
```css
--gold-primary:   #D4AF37;   /* 金色主色 */
--gold-light:     #F5E87A;   /* 高亮金 */
--gold-dark:      #9A7D0A;   /* 深金 */
--up-color:       #E53935;   /* 涨：红 */
--down-color:     #00897B;   /* 跌：绿 */
--flat-color:     #757575;   /* 平 */
--bg-card:        #1A1A1A;   /* 卡片背景（深色） */
--bg-page:        #111111;   /* 页面背景 */
```

### 移动端适配
- viewport: `width=device-width, initial-scale=1, maximum-scale=1`
- 字号最小 14px，触控区域最小 44px
- 无水平滚动条

---

## 八、开发步骤

- [ ] 1. 初始化 Vite + Vue 3 + TypeScript 项目
- [ ] 2. 配置 Vite proxy（qt.gtimg.cn）、tsconfig
- [ ] 3. 实现 `types/gold.ts` 类型定义（GoldQuote、BankBarPrice、BrandPrice、RecyclePrice）
- [ ] 4. 实现 `utils/parser.ts` 解析器（含 GBK 字符处理）
- [ ] 5. 实现 `api/gtimg.ts` + `api/eastmoney.ts` + `api/xxapi.ts` + `api/exchange.ts`
- [ ] 6. 实现 `stores/gold.ts` Pinia store + 自动刷新（五接口并发）
- [ ] 7. 实现 `components/PriceTag.vue`
- [ ] 8. 实现 `components/DetailRow.vue`
- [ ] 9. 实现 `components/QuoteCard.vue`（国际金价，USD/oz + CNY/g）
- [ ] 10. 实现 `components/SgeCard.vue`（上海金 Au9999，CNY/g）
- [ ] 11. 实现 `components/BrandPriceTable.vue`
- [ ] 12. 实现 `components/BankPriceList.vue`
- [ ] 13. 实现 `components/RecycleList.vue`
- [ ] 14. 实现 `components/RefreshBar.vue`
- [ ] 15. 实现 `App.vue`（Tab 导航 + 汇率徽章 + 整体布局与样式）
- [ ] 16. 接口联调、数据验证
- [ ] 17. 移动端适配测试
- [ ] 18. 构建生产包，补充 Nginx 代理配置文档

---

## 九、后续可扩展功能（不在本期范围）

- K 线图（echarts / lightweight-charts）
- 历史价格查询
- 价格预警推送（PWA Notification）
- 人民币 / 美元汇率换算（显示人民币金价）
- 多品种扩展（白银 XAG、铂金 XPT）
