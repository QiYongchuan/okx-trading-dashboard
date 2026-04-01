"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Balance = { ccy: string; bal: string; availBal: string };
type GridBot = any;
type Ticker = any;

type Data = {
  balance: Balance[];
  gridBots: GridBot[];
  tickers: { "BTC-USDT": Ticker; "ETH-USDT": Ticker; "OKB-USDT": Ticker };
  timestamp: string;
};

export default function Dashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>();

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/okx");
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 10000); // 10秒刷新
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const getBalance = (ccy: string) => {
    const b = data?.balance.find((b) => b.ccy === ccy);
    return {
      total: parseFloat(b?.bal || "0"),
      available: parseFloat(b?.availBal || "0"),
      frozen: parseFloat(b?.bal || "0") - parseFloat(b?.availBal || "0"),
    };
  };

  const usdt = getBalance("USDT");
  const btc = getBalance("BTC");
  const eth = getBalance("ETH");
  const okb = getBalance("OKB");

  const btcPrice = parseFloat(data?.tickers["BTC-USDT"]?.last || "0");
  const ethPrice = parseFloat(data?.tickers["ETH-USDT"]?.last || "0");
  const okbPrice = parseFloat(data?.tickers["OKB-USDT"]?.last || "0");

  const totalValue =
    usdt.total +
    btc.total * btcPrice +
    eth.total * ethPrice +
    okb.total * okbPrice;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-4">
          <div>
            <h1 className="text-2xl font-bold">OKX 模拟盘</h1>
            <p className="text-[#8888a0] text-sm">
              自动刷新 • {lastUpdate?.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/trades"
              className="px-4 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg hover:border-[#3b82f6] transition-colors text-sm"
            >
              交易记录
            </Link>
            <Link
              href="/reflection"
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg text-white text-sm transition-colors"
            >
              复盘报告
            </Link>
          </div>
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { ccy: "BTC", bal: btc, price: btcPrice },
            { ccy: "ETH", bal: eth, price: ethPrice },
            { ccy: "OKB", bal: okb, price: okbPrice },
            { ccy: "USDT", bal: usdt, price: 1 },
          ].map((item) => (
            <div
              key={item.ccy}
              className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#8888a0]">{item.ccy}</span>
                <span className="text-xs px-2 py-1 bg-[#1e1e2e] rounded">
                  ${item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-2xl font-bold mt-2">{item.bal.total.toFixed(4)}</div>
              <div className="text-[#8888a0] text-sm">
                可用: {item.bal.available.toFixed(4)} {item.bal.frozen > 0 && `| 冻结: ${item.bal.frozen.toFixed(4)}`}
              </div>
              <div className="text-[#00d4aa] text-sm mt-1">
                ≈ ${(item.bal.total * item.price).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Grid Bots */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg">
          <div className="p-4 border-b border-[#1e1e2e] flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <h2 className="font-bold">运行中的策略</h2>
            <span className="text-[#8888a0] text-sm">
              ({data?.gridBots?.length || 0})
            </span>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {data?.gridBots?.map((bot: any) => (
              <div key={bot.algoId} className="p-4 hover:bg-[#1a1a25] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold">
                      网格 Bot #{bot.algoId.slice(-6)}
                    </div>
                    <div className="text-[#8888a0] text-sm">{bot.instId}</div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        parseFloat(bot.detail?.totalPnl || "0") >= 0
                          ? "text-[#00d4aa]"
                          : "text-[#ff4466]"
                      }`}
                    >
                      {parseFloat(bot.detail?.totalPnl || "0") >= 0 ? "+" : ""}
                      {parseFloat(bot.detail?.totalPnl || "0").toFixed(4)} USDT
                    </div>
                    <div className="text-[#8888a0] text-sm">
                      成交: {bot.detail?.tradeNum || "0"} 笔 | 利润: {bot.detail?.gridProfit || "0"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[#8888a0]">
                    区间: {parseFloat(bot.minPx).toLocaleString()} -{" "}
                    {parseFloat(bot.maxPx).toLocaleString()}
                  </span>
                  <span className="text-[#8888a0]">
                    {bot.gridNum} 格
                  </span>
                  <span className="px-2 py-1 bg-[#00d4aa]/20 text-[#00d4aa] rounded text-xs">
                    运行中
                  </span>
                </div>
                {/* Grid visualization */}
                <div className="mt-3 h-8 relative">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[#1e1e2e]" />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between">
                    {Array.from({ length: Math.min(10, bot.gridNum) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.floor((bot.detail?.gridProfits || 0) / bot.gridNum * 10)
                            ? "bg-[#00d4aa]"
                            : "bg-[#1e1e2e]"
                        }`}
                      />
                    ))}
                  </div>
                  {(() => {
                    const currentPrice = bot.instId === "BTC-USDT" ? btcPrice :
                                       bot.instId === "ETH-USDT" ? ethPrice :
                                       bot.instId === "OKB-USDT" ? okbPrice : 0;
                    const minPx = parseFloat(bot.minPx);
                    const maxPx = parseFloat(bot.maxPx);
                    const position = Math.max(0, Math.min(100, ((currentPrice - minPx) / (maxPx - minPx)) * 100));
                    return currentPrice > 0 ? (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#3b82f6] rounded-full"
                        style={{ left: `${position}%` }}
                        title={`当前价格: ${currentPrice.toFixed(2)}`}
                      />
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
            {(!data?.gridBots || data.gridBots.length === 0) && (
              <div className="p-8 text-center text-[#8888a0]">暂无运行中的策略</div>
            )}
          </div>
        </div>

        {/* Grid Bot Trades Summary */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg">
          <div className="p-4 border-b border-[#1e1e2e] flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="font-bold">策略成交统计</h2>
          </div>
          <div className="divide-y divide-[#1e1e2e]">
            {data?.gridBots?.map((bot: any) => (
              <div key={bot.algoId} className="p-4 flex items-center justify-between hover:bg-[#1a1a25]">
                <div>
                  <span className="font-medium">{bot.instId}</span>
                  <span className="text-[#8888a0] text-sm ml-2">
                    #{bot.algoId.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-[#8888a0]">成交: </span>
                    <span className="font-bold">{bot.detail?.tradeNum || "0"}</span>
                  </div>
                  <div>
                    <span className="text-[#8888a0]">利润: </span>
                    <span className={`font-bold ${
                      parseFloat(bot.detail?.totalPnl || "0") >= 0 ? "text-[#00d4aa]" : "text-[#ff4466]"
                    }`}>
                      {parseFloat(bot.detail?.totalPnl || "0") >= 0 ? "+" : ""}
                      {parseFloat(bot.detail?.totalPnl || "0").toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8888a0]">投入: </span>
                    <span>{bot.investment || "0"} USDT</span>
                  </div>
                </div>
              </div>
            ))}
            {(!data?.gridBots || data.gridBots.length === 0) && (
              <div className="p-8 text-center text-[#8888a0]">暂无运行中的策略</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
