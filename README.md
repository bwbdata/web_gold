# Web Gold - 手机端金价查询 App

> 基于 Vue 3 + TypeScript 的手机端单页黄金价格查询应用

## 功能特性

- 实时显示**伦敦现货金**（XAU）与**纽约黄金期货**（GC/COMEX）价格
- 涨跌颜色标识、涨跌额与涨跌幅双指标
- 最高价 / 最低价 / 今开 / 昨收四项明细
- **国内品牌零售金价**（周大福、老凤祥、中国黄金等）：黄金 / 金条 / 铂金
- **银行金条价**（工行、建行、农行、浦发等）
- **黄金回收价**参考（黄金、钯金等）
- **自动刷新**（30 秒倒计时）+ 手动刷新按钮
- 最后更新时间显示
- 黄金主题 UI，兼容浅色 / 深色系统主题
- 移动优先（Mobile-first）响应式布局，Tab 页签导航

## 数据来源

| 代码 | 接口 | 说明 | 跨域 |
|------|------|------|------|
| `hf_XAU` | `http://qt.gtimg.cn/q=hf_XAU` | 伦敦金现货（USD/盎司） | 需代理 |
| `hf_GC`  | `http://qt.gtimg.cn/q=hf_GC`  | 纽约黄金期货（COMEX） | 需代理 |
| —        | `https://v2.xxapi.cn/api/goldprice` | 国内银行/品牌/回收价（元/克） | 直连 |

> 腾讯财经接口存在跨域限制，本地开发通过 Vite proxy 转发，生产部署需配置反向代理。xxapi 接口已开放 CORS，直接请求即可。

## 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Vue 3 Composition API |
| 语言 | TypeScript |
| 构建 | Vite |
| 状态 | Pinia |
| 样式 | 原生 CSS（CSS Variables 主题化） |

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（含 API 代理）
npm run dev

# 构建生产包
npm run build

# 预览生产包
npm run preview
```

## 生产部署

生产环境需在 Nginx（或其他反向代理）上配置代理转发，将 `/api/` 前缀的请求代理到 `http://qt.gtimg.cn/`，以规避浏览器跨域限制。

```nginx
location /api/ {
    proxy_pass http://qt.gtimg.cn/;
    add_header Access-Control-Allow-Origin *;
}
```

## 目录结构

```
web_gold/
├── public/
├── src/
│   ├── api/          # 接口请求封装
│   ├── components/   # 业务组件
│   ├── stores/       # Pinia Store
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数（数据解析等）
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── project.md
```
