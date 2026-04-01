"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type GridBot = any;

type Data = {
  gridBots: GridBot[];
  timestamp: string;
};

export default function ReflectionPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);

  const loadData = async () => {
    const res = await fetch("/api/okx");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  const generateReport = async () => {
    const res = await fetch("/api/reflection", { method: "POST" });
    if (res.ok) {
      setReportGenerated(true);
      alert("复盘报告已生成！");
    }
  };

  useEffect(() => {
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

  // Calculate summary stats
  const totalBots = data?.gridBots?.length || 0;
  const totalTrades = data?.gridBots?.reduce((sum: number, b: any) => sum + (parseInt(b.detail?.tradeNum || "0")), 0) || 0;
  const totalPnl = data?.gridBots?.reduce((sum: number, b: any) => sum + parseFloat(b.detail?.totalPnl || "0"), 0) || 0;
  const profitableBots = data?.gridBots?.filter((b: any) => parseFloat(b.detail?.totalPnl || "0") > 0).length || 0;

  const bestBot = data?.gridBots?.reduce((best: any, b: any) =>
    parseFloat(b.detail?.totalPnl || "0") > parseFloat(best?.detail?.totalPnl || "0") ? b : best
  , data?.gridBots?.[0]);

  const worstBot = data?.gridBots?.reduce((worst: any, b: any) =>
    parseFloat(b.detail?.totalPnl || "0") < parseFloat(worst?.detail?.totalPnl || "0") ? b : worst
  , data?.gridBots?.[0]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
          <div>
            <h1 className="text-2xl font-bold">交易复盘</h1>
            <p className="text-[#8888a0] text-sm">
              {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg hover:border-[#3b82f6] transition-colors text-sm"
            >
              返回看板
            </Link>
            <button
              onClick={generateReport}
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg text-white text-sm transition-colors"
            >
              生成报告
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">运行策略</div>
            <div className="text-2xl font-bold mt-1">{totalBots}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">总成交笔数</div>
            <div className="text-2xl font-bold mt-1">{totalTrades}</div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">总盈亏</div>
            <div className={`text-2xl font-bold mt-1 ${totalPnl >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"}`}>
              {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)} USDT
            </div>
          </div>
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
            <div className="text-[#8888a0] text-sm">盈利策略</div>
            <div className="text-2xl font-bold mt-1 text-[#00d4aa]">{profitableBots}/{totalBots}</div>
          </div>
        </div>

        {/* Per-Strategy Breakdown */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg">
          <div className="p-4 border-b border-[#1e1e2e]">
            <h2 className="font-bold">策略详情</h2>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {data?.gridBots?.map((bot: any) => (
              <div key={bot.algoId} className="p-4 hover:bg-[#1a1a25]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-lg">{bot.instId}</div>
                    <div className="text-[#8888a0] text-sm">
                      #{bot.algoId.slice(-6)} • {bot.gridNum}格网格
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      parseFloat(bot.detail?.totalPnl || "0") >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"
                    }`}>
                      {parseFloat(bot.detail?.totalPnl || "0") >= 0 ? "+" : ""}
                      {parseFloat(bot.detail?.totalPnl || "0").toFixed(4)} USDT
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-[#8888a0]">投入: </span>
                    <span>{bot.investment} USDT</span>
                  </div>
                  <div>
                    <span className="text-[#8888a0]">成交: </span>
                    <span>{bot.detail?.tradeNum || "0"} 笔</span>
                  </div>
                  <div>
                    <span className="text-[#8888a0]">当前价: </span>
                    <span>{parseFloat(bot.detail?.runPx || "0").toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#8888a0]">状态: </span>
                    <span className="px-2 py-1 bg-[#00d4aa]/20 text-[#00d4aa] rounded text-xs">
                      {bot.state === "running" ? "运行中" : bot.state}
                    </span>
                  </div>
                </div>

                {/* Progress bar for grid profits */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-[#8888a0] mb-1">
                    <span>网格进度</span>
                    <span>{bot.detail?.gridProfit || "0"} / {bot.gridNum}</span>
                  </div>
                  <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00d4aa]"
                      style={{ width: `${Math.min(100, (parseInt(bot.detail?.gridProfit || "0") / bot.gridNum) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span>🤖</span>
            <span>AI 分析</span>
          </h2>
          {totalTrades === 0 ? (
            <p className="text-[#8888a0]">暂无交易数据，AI 保持观望中...</p>
          ) : (
            <div className="space-y-3 text-sm leading-relaxed">
              <p>• 共运行 <strong>{totalBots}</strong> 个网格策略</p>
              <p>• 已完成 <strong>{totalTrades}</strong> 笔交易，总盈亏 <strong className={totalPnl >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"}>{totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(2)} USDT</strong></p>
              <p>• {profitableBots > 0 ? `${profitableBots} 个策略正在盈利` : "所有策略暂时浮亏"}</p>
              {bestBot && parseFloat(bestBot.detail?.totalPnl) > 0 && (
                <p>• 表现最佳: <strong>{bestBot.instId}</strong> (+{parseFloat(bestBot.detail?.totalPnl).toFixed(4)} USDT)</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
