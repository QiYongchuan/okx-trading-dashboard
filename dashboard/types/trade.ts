// 交易数据类型
export interface Trade {
  id: string
  symbol: string // 交易对，如 BTC-USDT
  side: 'buy' | 'sell'
  price: number
  quantity: number
  timestamp: string
  strategy: string // 使用的策略名称
  pnl?: number // 盈亏（可选）
  fees?: number // 手续费
  notes?: string // 备注
}

// AI 复盘结果
export interface ReflectionResult {
  tradeId: string
  analysis: string // AI 分析文本
  keyLearnings: string[] // 关键学习点
  suggestedStrategy?: string // 建议的策略改进
  riskAssessment?: string // 风险评估
  timestamp: string
}

// 策略模板（从成功交易中提取）
export interface StrategyTemplate {
  id: string
  name: string
  description: string
  conditions: string[] // 触发条件
  actions: string[] // 执行动作
  stats: {
    winRate: number // 胜率
    avgReturn: number // 平均收益率
    maxDrawdown: number // 最大回撤
    totalTrades: number // 总交易次数
  }
  status: 'testing' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

// 避坑规则（从失败交易中提取）
export interface AvoidRule {
  id: string
  name: string
  description: string
  condition: string // 触发条件
  reason: string // 避坑原因
  sourceTrades: string[] // 来源交易 ID
  status: 'active' | 'inactive'
  createdAt: string
}

// 交易复盘报告
export interface TradingReport {
  date: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  totalPnl: number
  winRate: number
  avgReturn: number
  reflections: ReflectionResult[]
  strategies: StrategyTemplate[]
  avoidRules: AvoidRule[]
}
