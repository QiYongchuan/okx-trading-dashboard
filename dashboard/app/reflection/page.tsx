"use client";

import { useState } from "react";
import type { ReflectionResult, Trade } from "@/types/trade";

const mockTrades: Trade[] = [
  {
    id: "trade-001",
    symbol: "BTC-USDT-SWAP",
    side: "buy",
    price: 68450,
    quantity: 0.25,
    timestamp: "2026-03-31T09:15:00Z",
    strategy: "15m 突破回踩做多",
    pnl: 235.5,
  },
  {
    id: "trade-002",
    symbol: "ETH-USDT-SWAP",
    side: "sell",
    price: 3520,
    quantity: 1.5,
    timestamp: "2026-03-30T18:40:00Z",
    strategy: "日内阻力位反转做空",
    pnl: -128.4,
  },
  {
    id: "trade-003",
    symbol: "SOL-USDT-SWAP",
    side: "buy",
    price: 188.6,
    quantity: 18,
    timestamp: "2026-03-29T13:05:00Z",
    strategy: "趋势延续加仓",
    pnl: 96.8,
  },
];

export default function ReflectionPage() {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReflect(trade: Trade) {
    setSelectedTrade(trade);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trade),
      });

      const data = (await response.json()) as ReflectionResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "AI 复盘生成失败");
      }

      setResult(data);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "请求失败，请检查网络或稍后重试。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          AI 交易复盘
        </h1>

        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 点击交易记录右侧的「AI 复盘」按钮，系统会分析该笔交易的决策依据、市场状态和可复用经验。
          </p>
        </div>

        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              近期交易
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockTrades.map((trade) => (
              <div
                key={trade.id}
                className="px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trade.symbol}
                      </span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          trade.side === "buy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {trade.side === "buy" ? "买入" : "卖出"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-4">
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
                            (trade.pnl ?? 0) >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {trade.pnl !== undefined
                            ? `$${trade.pnl > 0 ? "+" : ""}${trade.pnl}`
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReflect(trade)}
                    disabled={loading && selectedTrade?.id === trade.id}
                    className="ml-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 md:ml-4"
                  >
                    {loading && selectedTrade?.id === trade.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
                      "AI 复盘"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">❌ {error}</p>
          </div>
        ) : null}

        {result ? (
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 dark:border-gray-700 dark:from-purple-900/20 dark:to-blue-900/20">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <span className="text-2xl">🤖</span>
                AI 复盘分析
                <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                  {selectedTrade?.symbol} - {selectedTrade?.side === "buy" ? "买入" : "卖出"}
                </span>
              </h2>
            </div>
            <div className="space-y-6 p-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📊 交易分析
                </h3>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-white">
                  {result.analysis}
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  💡 关键学习点
                </h3>
                {result.keyLearnings.length > 0 ? (
                  <ul className="space-y-2">
                    {result.keyLearnings.map((learning) => (
                      <li
                        key={learning}
                        className="flex items-start gap-2 text-gray-900 dark:text-white"
                      >
                        <span className="mt-1 text-blue-500">•</span>
                        <span>{learning}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">暂无关键学习点。</p>
                )}
              </div>

              {result.suggestedStrategy ? (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    🎯 策略建议
                  </h3>
                  <p className="rounded-lg bg-yellow-50 p-3 text-gray-900 dark:bg-yellow-900/20 dark:text-white">
                    {result.suggestedStrategy}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
