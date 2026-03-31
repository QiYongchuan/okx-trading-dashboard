'use client'

import { useState } from 'react'
import { Trade, ReflectionResult } from '@/types/trade'

// 模拟交易数据（实际应从 OKX API 获取）
const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'BTC-USDT',
    side: 'buy',
    price: 67500,
    quantity: 0.01,
    timestamp: '2026-03-31T08:00:00Z',
    strategy: '网格交易 #1',
    pnl: 50,
  },
  {
    id: '2',
    symbol: 'ETH-USDT',
    side: 'sell',
    price: 2050,
    quantity: 0.5,
    timestamp: '2026-03-31T10:30:00Z',
    strategy: '网格交易 #2',
    pnl: -15,
  },
  {
    id: '3',
    symbol: 'OKB-USDT',
    side: 'buy',
    price: 48.5,
    quantity: 10,
    timestamp: '2026-03-31T12:15:00Z',
    strategy: '网格交易 #3',
    pnl: 5,
  },
]

export default function ReflectionPage() {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [reflection, setReflection] = useState<ReflectionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 生成复盘分析
  const handleGenerateReflection = async (trade: Trade) => {
    setSelectedTrade(trade)
    setLoading(true)
    setError(null)
    setReflection(null)

    try {
      const response = await fetch('/api/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trade }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate reflection')
      }

      setReflection(data.reflection)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          AI 交易复盘
        </h1>

        {/* 说明卡片 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 点击交易记录右侧的「AI 复盘」按钮，让 Claude 分析该笔交易的决策依据、市场状态和可复用经验。
          </p>
        </div>

        {/* 交易列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              近期交易
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockTrades.map((trade) => (
              <div
                key={trade.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trade.symbol}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          trade.side === 'buy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {trade.side === 'buy' ? '买入' : '卖出'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">价格：</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${trade.price.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">数量：</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {trade.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">策略：</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {trade.strategy}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-500">盈亏：</span>
                        <span
                          className={`font-medium ${
                            trade.pnl && trade.pnl > 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {trade.pnl ? `$${trade.pnl > 0 ? '+' : ''}${trade.pnl}` : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleGenerateReflection(trade)}
                    disabled={loading && selectedTrade?.id === trade.id}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    {loading && selectedTrade?.id === trade.id ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        分析中...
                      </span>
                    ) : (
                      'AI 复盘'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              ❌ {error}
              {error.includes('ANTHROPIC_API_KEY') && (
                <span className="block mt-2">
                  请在 `.env.local` 文件中配置 `ANTHROPIC_API_KEY`
                </span>
              )}
            </p>
          </div>
        )}

        {/* 复盘结果 */}
        {reflection && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI 复盘分析
                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-2">
                  {selectedTrade?.symbol} - {selectedTrade?.side === 'buy' ? '买入' : '卖出'}
                </span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* 完整分析 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📊 交易分析
                </h3>
                <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                  {reflection.analysis}
                </p>
              </div>

              {/* 关键学习点 */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  💡 关键学习点
                </h3>
                <ul className="space-y-2">
                  {reflection.keyLearnings.map((learning, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-900 dark:text-white">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 策略建议 */}
              {reflection.suggestedStrategy && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🎯 策略建议
                  </h3>
                  <p className="text-gray-900 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                    {reflection.suggestedStrategy}
                  </p>
                </div>
              )}

              {/* 风险评估 */}
              {reflection.riskAssessment && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ⚠️ 风险评估
                  </h3>
                  <p className="text-gray-900 dark:text-white">{reflection.riskAssessment}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
