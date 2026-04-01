"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type GridBot = any;

type Data = {
  gridBots: GridBot[];
  tickers: { "BTC-USDT": any; "ETH-USDT": any; "OKB-USDT": any };
  timestamp: string;
};

export default function TradesPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/okx");
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  // Extract trade info from grid bots
  const trades = data?.gridBots?.map((bot: any) => ({
    instId: bot.instId,
    algoId: bot.algoId,
    tradeNum: parseInt(bot.detail?.tradeNum || "0"),
    totalPnl: parseFloat(bot.detail?.totalPnl || "0"),
    gridProfit: parseInt(bot.detail?.gridProfit || "0"),
    gridNum: bot.gridNum,
    investment: bot.investment,
    runPx: parseFloat(bot.detail?.runPx || "0"),
  })) || [];

  const totalPnl = trades.reduce((sum, t) => sum + t.totalPnl, 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
          <div>
            <h1 className="text-2xl font-bold">交易记录</h1>
            <p className="text-[#8888a0] text-sm">
              网格 Bot 成交统计 • 总盈亏:{" "}
              <span className={totalPnl >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"}>
                {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(4)} USDT
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/reflection"
              className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg hover:border-[#3b82f6] transition-colors text-sm"
            >
              复盘报告
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg hover:border-[#3b82f6] transition-colors text-sm"
            >
              返回看板
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">策略数量</div>
            <div className="text-2xl font-bold mt-1">{trades.length}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">总成交笔数</div>
            <div className="text-2xl font-bold mt-1">{trades.reduce((sum, t) => sum + t.tradeNum, 0)}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">盈利策略</div>
            <div className="text-2xl font-bold mt-1 text-[#00d4aa]">
              {trades.filter((t) => t.totalPnl > 0).length}/{trades.length}
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1a25]">
              <tr>
                <th className="px-4 py-3 text-left text-[#8888a0] font-medium">交易对</th>
                <th className="px-4 py-3 text-left text-[#8888a0] font-medium">策略ID</th>
                <th className="px-4 py-3 text-right text-[#8888a0] font-medium">当前价</th>
                <th className="px-4 py-3 text-right text-[#8888a0] font-medium">成交数</th>
                <th className="px-4 py-3 text-right text-[#8888a0] font-medium">网格进度</th>
                <th className="px-4 py-3 text-right text-[#8888a0] font-medium">盈亏</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2e]">
              {trades.map((trade) => (
                <tr key={trade.algoId} className="hover:bg-[#1a1a25]">
                  <td className="px-4 py-3 font-medium">{trade.instId}</td>
                  <td className="px-4 py-3 text-[#8888a0]">#{trade.algoId.slice(-6)}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {trade.runPx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right">{trade.tradeNum} 笔</td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[#8888a0]">{trade.gridProfit}</span> / {trade.gridNum}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono ${
                      trade.totalPnl >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"
                    }`}>
                      {trade.totalPnl >= 0 ? "+" : ""}{trade.totalPnl.toFixed(4)}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && trades.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#8888a0]">
                    暂无交易记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
