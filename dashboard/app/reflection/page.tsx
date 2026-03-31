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
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(mockTrades[0]);
  const [result, setResult] = useState<ReflectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReflect(trade: Trade) {
    setSelectedTrade(trade);
    setLoading(true);
    setError(null);

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
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">
            Reflection Center
          </p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">
                AI 自动复盘
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                选择一笔交易，系统会调用 Claude 生成结构化交易复盘，帮助你复核判断逻辑与策略偏差。
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">交易列表</h2>
              <span className="text-xs text-slate-400">{mockTrades.length} trades</span>
            </div>

            <div className="space-y-3">
              {mockTrades.map((trade) => {
                const active = trade.id === selectedTrade?.id;
                const pnlPositive = (trade.pnl ?? 0) >= 0;

                return (
                  <button
                    key={trade.id}
                    type="button"
                    onClick={() => handleReflect(trade)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-cyan-300/60 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{trade.symbol}</p>
                        <p className="mt-1 text-sm text-slate-400">{trade.strategy}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          trade.side === "buy"
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-rose-400/15 text-rose-200"
                        }`}
                      >
                        {trade.side.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">Price</p>
                        <p>{trade.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Qty</p>
                        <p>{trade.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">PnL</p>
                        <p className={pnlPositive ? "text-emerald-300" : "text-rose-300"}>
                          {trade.pnl}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Time</p>
                        <p>{new Date(trade.timestamp).toLocaleString("zh-CN")}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[var(--panel)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">复盘结果</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {selectedTrade ? `当前交易：${selectedTrade.symbol}` : "请选择一笔交易"}
                </p>
              </div>
              {loading ? (
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  Claude 正在分析...
                </span>
              ) : null}
            </div>

            <div className="mt-6 min-h-[420px] rounded-[24px] border border-white/10 bg-[var(--panel-strong)] p-5">
              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              {!error && !result && !loading ? (
                <div className="flex h-full min-h-[360px] items-center justify-center text-center text-sm text-slate-400">
                  点击左侧交易卡片，生成 AI 自动复盘。
                </div>
              ) : null}

              {loading ? (
                <div className="space-y-4">
                  <div className="h-5 w-2/5 animate-pulse rounded-full bg-white/10" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-white/8" />
                  <div className="h-4 w-11/12 animate-pulse rounded-full bg-white/8" />
                  <div className="h-4 w-10/12 animate-pulse rounded-full bg-white/8" />
                  <div className="mt-8 h-4 w-1/3 animate-pulse rounded-full bg-white/8" />
                  <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/8" />
                  <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/8" />
                </div>
              ) : null}

              {!loading && result ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                      Analysis
                    </p>
                    <article className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-100">
                      {result.analysis}
                    </article>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                      Key Learnings
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.keyLearnings.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {result.suggestedStrategy ? (
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/80">
                        Suggested Strategy
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-50">
                        {result.suggestedStrategy}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
