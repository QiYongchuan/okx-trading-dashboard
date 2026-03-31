import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { ReflectionResult, Trade } from "@/types/trade";

const MODEL_NAME = "claude-3-5-sonnet-latest";

function extractTextBlock(content: Array<{ type: string; text?: string }>) {
  return content
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text ?? "")
    .join("\n")
    .trim();
}

function parseReflectionResult(rawText: string): ReflectionResult {
  const trimmed = rawText.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("Claude returned invalid JSON");
  }

  return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as ReflectionResult;
}

export async function generateReflection(trade: Trade): Promise<ReflectionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const anthropic = new Anthropic({ apiKey });

  const prompt = `
你是专业的交易复盘助手。请基于以下交易数据，使用中文输出严格 JSON，不要输出 Markdown 代码块。

交易数据：
- 交易 ID: ${trade.id}
- 交易对: ${trade.symbol}
- 方向: ${trade.side}
- 成交价格: ${trade.price}
- 数量: ${trade.quantity}
- 时间: ${trade.timestamp}
- 策略: ${trade.strategy}
- 盈亏: ${trade.pnl ?? "未知"}

复盘模板：
【交易复盘】
1. 决策依据是什么？
2. 当时的市场状态如何？
3. 结果如何？符合预期吗？
4. 如果重来，会怎么做？
5. 这次交易学到了什么？

请返回以下 JSON 结构：
{
  "tradeId": "${trade.id}",
  "analysis": "完整复盘文本",
  "keyLearnings": ["要点1", "要点2", "要点3"],
  "suggestedStrategy": "可选，下一次建议策略"
}
`;

  const response = await anthropic.messages.create({
    model: MODEL_NAME,
    max_tokens: 900,
    temperature: 0.4,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const rawText = extractTextBlock(response.content as Array<{ type: string; text?: string }>);

  if (!rawText) {
    throw new Error("Claude returned an empty response");
  }

  try {
    const parsed = parseReflectionResult(rawText);

    return {
      tradeId: parsed.tradeId || trade.id,
      analysis: parsed.analysis,
      keyLearnings: Array.isArray(parsed.keyLearnings) ? parsed.keyLearnings : [],
      suggestedStrategy: parsed.suggestedStrategy,
    };
  } catch {
    throw new Error("Claude returned invalid JSON");
  }
}
