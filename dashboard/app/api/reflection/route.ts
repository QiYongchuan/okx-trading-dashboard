import { NextRequest, NextResponse } from 'next/server'
import { generateReflection } from '@/lib/claude'
import { Trade } from '@/types/trade'

export async function POST(request: NextRequest) {
  try {
    // 检查 API Key 是否配置
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    // 解析请求体
    const body = await request.json()
    const trade: Trade = body.trade

    if (!trade) {
      return NextResponse.json({ error: 'Trade data is required' }, { status: 400 })
    }

    // 验证必要字段
    if (!trade.id || !trade.symbol || !trade.side || !trade.price) {
      return NextResponse.json(
        { error: 'Missing required trade fields' },
        { status: 400 }
      )
    }

    // 生成复盘分析
    const reflection = await generateReflection(trade)

    return NextResponse.json({
      success: true,
      reflection,
    })
  } catch (error) {
    console.error('Error in /api/reflection:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate reflection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET 方法用于获取历史复盘记录
export async function GET(request: NextRequest) {
  try {
    // 这里可以从数据库或文件系统读取历史复盘记录
    // 目前返回空数组作为占位
    return NextResponse.json({
      success: true,
      reflections: [],
    })
  } catch (error) {
    console.error('Error fetching reflections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reflections' },
      { status: 500 }
    )
  }
}
