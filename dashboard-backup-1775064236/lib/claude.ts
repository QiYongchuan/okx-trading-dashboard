import "server-only";

import type { ReflectionResult, Trade } from "@/types/trade";

const MODEL_NAME = "ep-mfqrk6-1773650127789062917";

function normalizeKeyLearnings(text: string): string[] {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[\s\-*•\d.)]+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function buildFallbackReflection(rawText: string, tradeId: string): ReflectionResult {
  const analysis = rawText.trim() || "AI 未返回可用内容。";

  return {
    tradeId,
    analysis,
    keyLearnings: normalizeKeyLearnings(rawText),
  };
}

function parseReflectionResult(rawText: string, tradeId: string): ReflectionResult {
  const trimmed = rawText.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    return buildFallbackReflection(trimmed, tradeId);
  }

  try {
    const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as ReflectionResult;

    return {
      tradeId: parsed.tradeId || tradeId,
      analysis: typeof parsed.analysis === "string" ? parsed.analysis : trimmed,
      keyLearnings: Array.isArray(parsed.keyLearnings)
        ? parsed.keyLearnings.filter((item): item is string => typeof item === "string")
        : normalizeKeyLearnings(typeof parsed.analysis === "string" ? parsed.analysis : trimmed),
      suggestedStrategy:
        typeof parsed.suggestedStrategy === "string" ? parsed.suggestedStrategy : undefined,
    };
  } catch {
    return buildFallbackReflection(trimmed, tradeId);
  }
}

export async function generateReflection(trade: Trade): Promise<ReflectionResult> {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GLM_API_KEY");
  }

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

  const baseUrl = process.env.GLM_BASE_URL || "https://wanqing.streamlakeapi.com/api/gateway/v1/endpoints";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 900,
    }),
  });

  if (!response.ok) {
    throw new Error(`GLM API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content;

  if (!rawText) {
    throw new Error("GLM returned an empty response");
  }

  return parseReflectionResult(rawText, trade.id);
}
