import "server-only";

import type { ReflectionResult, Trade } from "@/types/trade";

const MODEL_NAME = "glm-4-plus";

function parseReflectionResult(rawText: string): ReflectionResult {
  const trimmed = rawText.trim();
  const jsonStart = trimmed.indexOf("{");
  const jsonEnd = trimmed.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    throw new Error("GLM returned invalid JSON");
  }

  return JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as ReflectionResult;
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

  const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
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

  try {
    const parsed = parseReflectionResult(rawText);

    return {
      tradeId: parsed.tradeId || trade.id,
      analysis: parsed.analysis,
      keyLearnings: Array.isArray(parsed.keyLearnings) ? parsed.keyLearnings : [],
      suggestedStrategy: parsed.suggestedStrategy,
    };
  } catch {
    throw new Error("GLM returned invalid JSON");
  }
}
