import { NextResponse } from "next/server";
import { generateReflection } from "@/lib/claude";
import type { Trade } from "@/types/trade";

function isTrade(input: unknown): input is Trade {
  if (!input || typeof input !== "object") {
    return false;
  }

  const trade = input as Record<string, unknown>;

  return (
    typeof trade.id === "string" &&
    typeof trade.symbol === "string" &&
    (trade.side === "buy" || trade.side === "sell") &&
    typeof trade.price === "number" &&
    typeof trade.quantity === "number" &&
    typeof trade.timestamp === "string" &&
    typeof trade.strategy === "string" &&
    (trade.pnl === undefined || typeof trade.pnl === "number")
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!isTrade(body)) {
      return NextResponse.json(
        { error: "交易数据格式无效，请检查请求参数。" },
        { status: 400 },
      );
    }

    const reflection = await generateReflection(body);
    return NextResponse.json(reflection);
  } catch (error) {
    const message =
      error instanceof Error && error.message === "Missing GLM_API_KEY"
        ? "服务端缺少 GLM_API_KEY，无法调用 GLM API。"
        : "AI 复盘生成失败，请稍后重试。";

    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}
