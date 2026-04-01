import { NextResponse } from "next/server";
import crypto from "crypto";

const API_KEY = process.env.OKX_API_KEY!;
const SECRET_KEY = process.env.OKX_SECRET_KEY!;
const PASSPHRASE = process.env.OKX_PASSPHRASE!;
const BASE_URL = "https://www.okx.com";

function sign(timestamp: string, method: string, path: string, body: string = "") {
  const prehash = timestamp + method + path + body;
  return crypto.createHmac("sha256", SECRET_KEY).update(prehash).digest("base64");
}

async function okxFetch(path: string) {
  const timestamp = new Date().toISOString();
  const headers: Record<string, string> = {
    "OK-ACCESS-KEY": API_KEY,
    "OK-ACCESS-SIGN": sign(timestamp, "GET", path),
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": PASSPHRASE,
    "x-simulated-trading": "1",
    "Content-Type": "application/json",
  };
  const res = await fetch(BASE_URL + path, { headers, next: { revalidate: 0 } });
  return res.json();
}

async function publicFetch(path: string) {
  const res = await fetch(BASE_URL + path, { next: { revalidate: 0 } });
  return res.json();
}

export async function GET() {
  try {
    const [balance, gridOrders, ticker, ethTicker, okbTicker] = await Promise.all([
      okxFetch("/api/v5/account/balance"),
      okxFetch("/api/v5/tradingBot/grid/orders-algo-pending?algoOrdType=grid"),
      publicFetch("/api/v5/market/ticker?instId=BTC-USDT"),
      publicFetch("/api/v5/market/ticker?instId=ETH-USDT"),
      publicFetch("/api/v5/market/ticker?instId=OKB-USDT"),
    ]);

    // Get sub-orders for each grid bot
    const gridDetails = await Promise.all(
      (gridOrders?.data || []).map(async (bot: any) => {
        const [subOrders, detail] = await Promise.all([
          okxFetch(
            `/api/v5/tradingBot/grid/sub-orders?algoOrdType=${bot.algoOrdType}&algoId=${bot.algoId}&type=live`
          ),
          okxFetch(
            `/api/v5/tradingBot/grid/orders-algo-details?algoOrdType=${bot.algoOrdType}&algoId=${bot.algoId}`
          ),
        ]);
        return {
          ...bot,
          subOrders: subOrders?.data || [],
          detail: detail?.data?.[0] || null,
        };
      })
    );

    return NextResponse.json({
      balance: balance?.data?.[0]?.details || [],
      gridBots: gridDetails,
      tickers: {
        "BTC-USDT": ticker?.data?.[0] || null,
        "ETH-USDT": ethTicker?.data?.[0] || null,
        "OKB-USDT": okbTicker?.data?.[0] || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
