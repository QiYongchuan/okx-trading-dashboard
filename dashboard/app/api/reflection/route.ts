import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const OBSIDIAN_PATH = "D:/obsidian/06-项目管理/运行项目/okx-交易-黑暗森林";

export async function POST() {
  try {
    // Fetch trades data
    const tradesRes = await fetch("http://localhost:3001/api/trades");
    const tradesData = await tradesRes.json();

    const fills = tradesData.fills || [];
    const buyCount = fills.filter((f: any) => f.side === "buy").length;
    const sellCount = fills.filter((f: any) => f.side === "sell").length;
    const totalFee = fills.reduce((sum: number, f: any) => sum + parseFloat(f.fee || "0"), 0);

    // Generate markdown report
    const date = new Date().toISOString().split("T")[0];
    const filename = `交易复盘-${date}.md`;
    const report = `# 交易复盘 - ${date}

## 概览

| 指标 | 数值 |
|------|------|
| 交易笔数 | ${fills.length} |
| 买入 | ${buyCount} |
| 卖出 | ${sellCount} |
| 总手续费 | ${totalFee.toFixed(6)} USDT |

## 交易明细

${fills.length === 0 ? "*暂无交易*" : fills.map((f: any) => `
- **${new Date(parseInt(f.ts)).toLocaleString("zh-CN")}** ${f.side === "buy" ? "买入" : "卖出"} ${f.instId}
  - 价格: ${parseFloat(f.px).toLocaleString(undefined, { minimumFractionDigits: 2 })}
  - 数量: ${parseFloat(f.sz).toFixed(6)}
  - 手续费: ${parseFloat(f.fee).toFixed(6)} ${f.feeCcy}
`).join("")}

## AI 分析

> *今日复盘由 AI 自动生成*
>
> ${fills.length === 0 ? "今日暂无交易，AI 保持观望。" : `今日共完成 ${fills.length} 笔交易。`}

---
*生成时间: ${new Date().toLocaleString("zh-CN")}*
`;

    // Save to Obsidian
    const filepath = path.join(OBSIDIAN_PATH, filename);
    await writeFile(filepath, report, "utf-8");

    return NextResponse.json({ success: true, filepath });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
