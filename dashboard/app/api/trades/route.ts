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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instId = searchParams.get("instId") || "";

    // Fetch grid bot orders
    let gridPath = "/api/v5/tradingBot/grid/orders-algo-pending?algoOrdType=grid";
    const gridOrders = await okxFetch(gridPath);

    // Fetch filled sub-orders for each grid bot
    const gridFills: any[] = [];
    for (const bot of gridOrders?.data || []) {
      if (instId && bot.instId !== instId) continue;

      // Try the history endpoint with type=filled
      const subOrders = await okxFetch(
        `/api/v5/tradingBot/grid/sub-orders-history?algoOrdType=grid&algoId=${bot.algoId}&type=filled`
      );

      // Transform to fills format
      const subOrdersData = subOrders?.data || [];
      if (Array.isArray(subOrdersData)) {
        const filled = subOrdersData.map((so: any) => {
          const fillPx = so.fillPx || so.px || so.avgPx || "0";
          const fillSz = so.fillSz || so.sz || so.accFillSz || "0";
          const baseCcy = bot.instId.split("-")[0];
          const quoteCcy = bot.instId.split("-")[1];
          return {
            instId: bot.instId,
            tradeId: so.ordId,
            side: so.side,
            px: fillPx,
            sz: fillSz,
            fee: Math.abs(parseFloat(so.fee || "0")).toString(),
            feeCcy: quoteCcy,
            ts: so.uTime || so.cTime || so.fillTime || Date.now().toString(),
            source: "grid_bot",
          };
        });
        gridFills.push(...filled);
      }
    }

    // Also fetch regular spot fills
    let fillsPath = `/api/v5/trade/fills-history?instType=SPOT&limit=100`;
    if (instId) {
      fillsPath += `&instId=${instId}`;
    }
    const regularFills = await okxFetch(fillsPath);

    // Combine and sort by timestamp
    const allFills = [...gridFills, ...(regularFills?.data || [])]
      .sort((a, b) => parseInt(b.ts) - parseInt(a.ts));

    return NextResponse.json({
      fills: allFills,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
