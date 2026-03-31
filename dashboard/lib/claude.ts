import Anthropic from '@anthropic-ai/sdk'
import { Trade, ReflectionResult } from '@/types/trade'

// 初始化 Claude 客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// 复盘提示词模板
const REFLECTION_PROMPT = `你是一位经验丰富的量化交易分析师。请根据以下交易数据进行复盘分析。

## 交易信息
- 交易对: {{symbol}}
- 方向: {{side}}
- 价格: {{price}}
- 数量: {{quantity}}
- 时间: {{timestamp}}
- 策略: {{strategy}}
- 盈亏: {{pnl}}

## 请回答以下问题

【交易复盘】
1. 决策依据是什么？
   - 分析该交易可能基于哪些技术指标或市场信号
   
2. 当时的市场状态如何？
   - 根据交易时间和价格推测市场环境
   
3. 结果如何？符合预期吗？
   - 评估交易的盈亏表现和风险收益比
   
4. 如果重来，会怎么做？
   - 提出可能的改进方案
   
5. 这次交易学到了什么？
   - 提取可复用的经验教训

## 输出格式

请以 JSON 格式返回分析结果：
{
  "analysis": "完整的复盘分析文本（300-500字）",
  "keyLearnings": ["学习点1", "学习点2", "学习点3"],
  "suggestedStrategy": "建议的策略改进（如果适用）",
  "riskAssessment": "风险评估（低/中/高及原因）"
}

只返回 JSON，不要包含其他文字。`

// 生成复盘分析
export async function generateReflection(trade: Trade): Promise<ReflectionResult> {
  try {
    // 替换模板中的占位符
    const prompt = REFLECTION_PROMPT
      .replace('{{symbol}}', trade.symbol)
      .replace('{{side}}', trade.side === 'buy' ? '买入' : '卖出')
      .replace('{{price}}', trade.price.toString())
      .replace('{{quantity}}', trade.quantity.toString())
      .replace('{{timestamp}}', trade.timestamp)
      .replace('{{strategy}}', trade.strategy)
      .replace('{{pnl}}', trade.pnl?.toString() || '未知')

    // 调用 Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // 解析响应
    const content = message.content[0]
    if (content.type === 'text') {
      // 提取 JSON
      let jsonStr = content.text.trim()
      
      // 尝试找到 JSON 块
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }

      const result = JSON.parse(jsonStr)

      return {
        tradeId: trade.id,
        analysis: result.analysis,
        keyLearnings: result.keyLearnings,
        suggestedStrategy: result.suggestedStrategy,
        riskAssessment: result.riskAssessment,
        timestamp: new Date().toISOString(),
      }
    }

    throw new Error('Invalid response type from Claude')
  } catch (error) {
    console.error('Error generating reflection:', error)
    throw error
  }
}

// 批量生成复盘（用于历史交易）
export async function batchGenerateReflections(
  trades: Trade[],
  onProgress?: (current: number, total: number) => void
): Promise<ReflectionResult[]> {
  const results: ReflectionResult[] = []

  for (let i = 0; i < trades.length; i++) {
    try {
      const result = await generateReflection(trades[i])
      results.push(result)

      if (onProgress) {
        onProgress(i + 1, trades.length)
      }

      // 避免 API 限流，每次请求间隔 1 秒
      if (i < trades.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`Failed to generate reflection for trade ${trades[i].id}:`, error)
    }
  }

  return results
}

// 提取策略规则（从多个复盘中提取共性）
export async function extractStrategyRules(
  reflections: ReflectionResult[]
): Promise<{ strategies: string[]; avoidRules: string[] }> {
  const prompt = `基于以下多笔交易的复盘分析，提取可复用的交易策略和避坑规则。

## 复盘数据
${reflections.map((r, i) => `
### 交易 ${i + 1}
${r.analysis}

关键学习点：
${r.keyLearnings.map((l) => `- ${l}`).join('\n')}

建议改进：
${r.suggestedStrategy || '无'}
`).join('\n---\n')}

## 任务
请分析这些复盘，提取：
1. 共性的成功模式（转化为可复用策略）
2. 共性的失败模式（转化为避坑规则）

## 输出格式（JSON）
{
  "strategies": [
    "策略1：具体条件和动作",
    "策略2：具体条件和动作"
  ],
  "avoidRules": [
    "避坑规则1：具体条件和原因",
    "避坑规则2：具体条件和原因"
  ]
}

只返回 JSON。`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    }

    throw new Error('Failed to extract strategy rules')
  } catch (error) {
    console.error('Error extracting strategy rules:', error)
    return { strategies: [], avoidRules: [] }
  }
}
