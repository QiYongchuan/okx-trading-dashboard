# OKX AI 交易复盘系统

> 让 AI 从每次交易中学习，持续优化交易策略

## 功能特性

- ✅ **模拟盘交易**：接入 OKX 模拟账户，实时运行网格交易策略
- ✅ **AI 自动复盘**：每笔交易后 Claude 自动分析决策依据、市场状态和经验教训
- 🔄 **策略提取**：从成功/失败交易中提取可复用规则（开发中）
- 🔄 **策略评分**：自动评估策略有效性（开发中）

## 技术栈

- **前端**：Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **AI**：Claude API (claude-3-5-sonnet)
- **交易**：OKX API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Claude API Key：

```env
ANTHROPIC_API_KEY=your_key_here
```

获取 API Key：https://console.anthropic.com/

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
dashboard/
├── app/
│   ├── page.tsx              # 主页
│   ├── layout.tsx            # 布局
│   ├── globals.css           # 全局样式
│   ├── reflection/
│   │   └── page.tsx         # AI 复盘页面
│   └── api/
│       └── reflection/
│           └── route.ts     # AI 复盘 API
├── lib/
│   └── claude.ts            # Claude API 封装
├── types/
│   └── trade.ts             # TypeScript 类型定义
└── package.json
```

## 使用说明

### AI 复盘功能

1. 打开 http://localhost:3000/reflection
2. 查看交易列表
3. 点击「AI 复盘」按钮
4. 等待 Claude 分析（约 3-5 秒）
5. 查看复盘结果：
   - 交易分析
   - 关键学习点
   - 策略建议
   - 风险评估

### 复盘模板

每笔交易的复盘包含 5 个问题：

1. 决策依据是什么？
2. 当时的市场状态如何？
3. 结果如何？符合预期吗？
4. 如果重来，会怎么做？
5. 这次交易学到了什么？

## API 接口

### POST /api/reflection

生成单笔交易的复盘分析。

**请求体**：
```json
{
  "trade": {
    "id": "1",
    "symbol": "BTC-USDT",
    "side": "buy",
    "price": 67500,
    "quantity": 0.01,
    "timestamp": "2026-03-31T08:00:00Z",
    "strategy": "网格交易 #1",
    "pnl": 50
  }
}
```

**响应**：
```json
{
  "success": true,
  "reflection": {
    "tradeId": "1",
    "analysis": "完整的复盘分析文本...",
    "keyLearnings": ["学习点1", "学习点2"],
    "suggestedStrategy": "建议的策略改进",
    "riskAssessment": "风险评估"
  }
}
```

## 开发路线

### P0 - 最高优先级（当前）
- [x] AI 自动复盘功能
- [x] Claude API 集成
- [x] 复盘页面 UI

### P1 - 高优先级（下一步）
- [ ] 策略提取系统
  - 从成功交易中提取策略模板
  - 从失败交易中提取避坑规则
- [ ] 策略评分系统
  - 胜率 > 60%
  - 平均收益率 > 2%
  - 最大回撤 < 5%

### P2 - 中优先级
- [ ] 动态规则库
- [ ] 真实交易系统
- [ ] 风控机制

## 常见问题

### Q: 为什么需要 Claude API Key？

A: AI 复盘功能使用 Claude 分析交易数据，生成结构化的反思文本。Claude 在理解复杂金融场景和生成高质量分析方面表现出色。

### Q: 数据存储在哪里？

A: 目前数据暂存在本地。未来可以集成数据库（如 Supabase、PlanetScale）持久化存储。

### Q: 可以用于真实交易吗？

A: 当前仅用于模拟盘。真实交易需要：
- 完成策略评分系统
- 设置风控机制
- 通过"毕业标准"（100+ 笔模拟交易，3+ 个验证策略）

## 相关资源

- [项目交接文档](../../../obsidian/06-项目管理/运行项目/okx-交易-黑暗森林/项目交接文档.md)
- [OKX API 文档](https://www.okx.com/docs-v5/)
- [Claude API 文档](https://docs.anthropic.com/)

## License

MIT

---

Made with ❤️ by Kevin & Claude
