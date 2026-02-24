// 国际金价（来自 qt.gtimg.cn，单位 USD/oz）
export interface GoldQuote {
  symbol: string       // 'XAU' | 'GC'
  name: string         // 市场名称，如 "伦敦金（现货黄金）"
  price: number        // 当前价（USD/oz）
  changePct: number    // 涨跌幅（%），如 -1.00
  change: number       // 涨跌额（USD），= price - prevClose
  high: number         // 最高价
  low: number          // 最低价
  open: number         // 今开价
  prevClose: number    // 昨收价
  time: string         // 数据时间，如 "09:52:00"
  date: string         // 日期，如 "2026-02-24"
}

// 上海金交所 Au9999 现货（来自东方财富，单位 CNY/g）
export interface SgeQuote {
  code: string         // "AU9999"
  name: string         // "黄金9999"
  price: number        // 当前价（CNY/g）
  change: number       // 涨跌额（CNY/g）
  changePct: number    // 涨跌幅（%）
  high: number         // 最高价
  low: number          // 最低价
  open: number         // 今开价
  prevClose: number    // 昨收价
}

// COMEX 黄金连续合约（来自东方财富 GC00Y，单位 USD/oz）
export interface ComexQuote {
  code: string         // "GC00Y"
  name: string         // "COMEX黄金"
  price: number        // 当前价（USD/oz）
  change: number       // 涨跌额（USD/oz）
  changePct: number    // 涨跌幅（%）
  high: number         // 最高价
  low: number          // 最低价
  open: number         // 今开价
  prevClose: number    // 昨收价
}

// 银行金条价（来自 xxapi，单位 CNY/g）
export interface BankBarPrice {
  bank: string         // 银行 + 产品名，如 "工商银行如意金条"
  price: string        // 价格，如 "1165.95"
}

// 品牌贵金属零售价（来自 xxapi，单位 CNY/g）
export interface BrandPrice {
  brand: string         // 品牌名，如 "周大福"
  bullion_price: string // 金条价（"-" 表示无数据）
  gold_price: string    // 黄金饰品价
  platinum_price: string // 铂金价
  updated_date: string  // 更新日期
}

// 黄金回收价（来自 xxapi，单位 CNY/g）
export interface RecyclePrice {
  gold_type: string    // 品类，如 "黄金回收"
  recycle_price: string // 回收价
  updated_date: string  // 更新日期
}
