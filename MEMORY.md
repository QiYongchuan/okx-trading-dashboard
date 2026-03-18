# MEMORY.md - 长期记忆

## 📌 重要方法

### X/Twitter 抓取方法

**使用 r.jina.ai 抓取推文全文（无需登录，免费）**

```
https://r.jina.ai/https://x.com/用户名/status/推文ID
```

**特点：**
- ✅ 绕过登录墙
- ✅ 获取正文 + 图片链接
- ✅ 免费，默认 20次/分钟
- ✅ 支持 PDF 和图片识别
- ✅ 更多配额：访问 jina.ai/reader/ 获取 1000w token 免费key

**何时使用：** 任何 X/Twitter 链接，都用这个方法抓取

---

## 🧠 核心原则库

### 自媒体变现原则（来源：@RookieRicardoR + dontbesilent）

**核心观点：你要从第一天做自媒体开始就要想着如何变现。**

1. **赚钱的流量才是大流量，粉丝量 ≠ 变现能力**
   - 很多博主执着于涨粉
   - 但如果内容本身没有变现属性（如纯煽动情绪、追热点）
   - 粉丝涨到十万、百万，变现也是零

2. **变现优先思维**
   - 从第一天开始就要想：这个内容能怎么变现？
   - 不要先涨粉再想变现，要反过来

3. **服务型变现 vs 卖课型变现**
   - 如果不擅长卖课，可以提供服务
   - 比如精修文稿、技术咨询等

**何时提醒：**
- Kevin 讨论内容策略时
- Kevin 过于关注涨粉时
- Kevin 犹豫要不要做某件事时（提醒变现角度）

---

## 🛠️ 工具清单

### 已安装工具

| 工具 | 位置 | 用途 |
|------|------|------|
| **feedgrab** | `~/tools/feedgrab` | 抓取公众号、小红书、Twitter 等 |
| **OpenCLI** | 全局命令 | 网站转 CLI（18+ 网站） |
| **ask-search** | `~/tools/ask-search` | 自托管搜索（待配置 Docker） |

### 飞书文档

| 文档 | 链接 |
|------|------|
| 🎩 贾维斯权限清单 | https://www.feishu.cn/docx/BRzHdZ6RLolxfjxPIWTcYwEHnfd |
| 📊 Kevin深度分析报告 | https://www.feishu.cn/docx/XySjdPjQWofv9cxIcS9cC7P8n9f |
| 📚 OpenClaw小白上手指南 | https://www.feishu.cn/docx/Qh6QdiaKLowOo2xCAykc9EIJnLf |
| 💡 灵感库（多维表格） | https://www.feishu.cn/base/BVLwbwuuqaIZmEsyTCyce1M6npd |

### 待安装工具

- Docker Desktop（运行 ask-search）
- gh CLI（GitHub 操作）
- obsidian-cli（笔记管理）

---

## 🦞 社区

### 龙虾茶馆

**加入方式：** https://github.com/ythx-101/openclaw-qa/discussions/31

**订阅通知：**
```bash
curl -s https://raw.githubusercontent.com/ythx-101/openclaw-qa/main/feeds/teahouse.json
```

---

## 📚 学习资源

### mem9.ai

**是什么：** 为 OpenClaw 提供无限记忆的基础设施

**核心功能：**
- 云端持久化记忆
- 混合搜索（关键词 + 向量）
- 跨设备同步
- 跨 Agent 共享

**安装：** https://mem9.ai/SKILL.md

---

## 🛠️ 编程工具

### Claude Code CLI
- **位置**：`/Users/qyc/.npm-global/bin/claude`
- **用途**：AI 编程助手，支持复杂任务
- **优势**：长上下文（200k）、理解能力强

### Codex CLI
- **位置**：`/Users/qyc/.npm-global/bin/codex`
- **版本**：0.115.0
- **模型**：GPT-5.3-codex
- **用途**：快速编程、图像分析、实时交互
- **独有功能**：
  - 📸 全分辨率图像检查
  - 🔄 JS REPL
  - 🔴 实时 WebSocket 会话
  - 🤖 子代理系统
- **认证**：使用 ChatGPT Plus 账号登录（已包含）

### 工作流
- **日常开发**：优先用 Codex（已包含在 Plus 订阅）
- **深度重构**：用 Claude Code（代码理解能力强）
- **图像分析**：用 Codex（全分辨率支持）
- **复杂任务**：使用 sessions_spawn (ACP)
- **推荐**：Codex 为主，Claude Code 为辅

---

## 📅 重要日期

### 2026-03-17 - 贾维斯超进化日（第二轮）

**完成事项：**
- ✅ 创建飞书文档同步系统
- ✅ 安装 content-collector skill
- ✅ 创建 self-improving skill（自我进化）
- ✅ 安装 Codex CLI
- ✅ 设置每日早报（明天 9:30）
- ✅ 创建 claude-code-executor skill
- ✅ 生成工作流优化方案

**创建的文档：**
- `飞书文档同步优化方案.md`
- `工作流优化方案.md`
- `skills/claude-code-executor/SKILL.md`
- `skills/self-improving/SKILL.md`

**待办：**
- 申请飞书权限（docs:document:import）
- 配置 Codex CLI（OPENAI_API_KEY）
- 安装 defuddle/web-content-fetcher

### 2026-03-16 - 贾维斯超进化日

**完成事项：**
- ✅ 安装 feedgrab + OpenCLI（内容抓取工具）
- ✅ 创建 8 个文档（原则库、工具手册、进化报告等）
- ✅ 创建 2 个自定义技能（内容抓取、原则提醒）
- ✅ 研究 mem9.ai（云端记忆方案）
- ✅ 更新 MEMORY.md + HEARTBEAT.md

**创建的文档：**
- `principles/自媒体变现原则.md`
- `docs/工具使用手册.md`
- `docs/mem9使用指南.md`
- `skills/content-grab/SKILL.md`
- `skills/principle-reminder/SKILL.md`
- `memory/2026-03-16-evolution-*.md`
- `早安惊喜.md`

**下一步：**
- 安装 Docker Desktop
- 配置 ask-search
- 加入龙虾茶馆

---

*最后更新：2026-03-16 14:15*

---

## 🧠 OpenClaw记忆机制

### 记忆的三层结构

| 层级 | 位置 | 生命周期 | 容量 |
|------|------|---------|------|
| 上下文 | 模型内存 | 单次对话 | 固定（200k） |
| Session | .jsonl文件 | 可跨天，会被压缩 | 会压缩 |
| 记忆 | Markdown文件 | 永久 | 无限制 |

### 判断"重要"的标准

**要记**：决策、关键数据、人脉、日期、承诺、教训、偏好
**不记**：闲聊、临时想法、情绪吐槽、重复信息

### OpenClaw原生记忆的问题

1. 依赖模型主动写入
2. 没有结构化提炼
3. 向量搜索依赖配置
4. 没有遗忘机制
5. 实体管理混乱
6. 没有时间约束
7. 跨会话冲突
8. 没有置信度
9. 隐私边界模糊
10. 没有主动回忆

### Compaction的问题

1. memoryFlush还是依赖模型
2. 压缩质量不可控
3. keepRecentTokens粗暴
4. 压缩后不可恢复
5. 工具调用细节丢失
6. 用户无法控制

### mem9的解决方案

- **Lifecycle Hooks**：before_prompt_build（自动注入）、before_reset（自动保存）、agent_end（自动捕获）
- 把记忆从"模型主动"变成"系统自动"
- 代价：云端依赖 + 隐私让渡

---

## 关于Kevin

### 核心特质
- 爆发型多巴胺依赖（冲刺型）
- 具体结果导向（需要可见Deliverable）
- 外部认可敏感（需要反馈）
- ADHDer + INFP

### 状态
- 2026年1月离职，全职自媒体+独立开发
- 全网1.5w+粉丝
- 商单：飞书1.1k、Medeo 2k、百度5w

### 待办

#### 高优先级
1. **OKX 文章推广合作** — 每月 2-3 条，1000u，长期合作
2. **黑暗森林 Agent** — 独立运行，自己赚 token/流量/盈利
3. **X 收藏列表整理** — 整理所有收藏，分类归档

#### 中优先级
4. **SOP 创作工作流** — 选题→评分→初稿→修改→发布→反馈
5. **Token 集中管理** — 统一管理所有 API tokens
6. **多模型接入** — Claude + GPT + Kimi + DeepSeek

### 已完成
- ✅ 安装 mem9 云端记忆
- ✅ 启用 Cron
- ✅ 设置每日早报
- ✅ 启用 Tailscale 远程访问
- ✅ 安装 OpenCLI Skill
- ✅ 验证飞书工具权限（心跳检查需要日历和任务访问权限）
- ✅ OKX 长约达成（1000U/月）
- ✅ 2月商单收入历史新高（1.3w+）

---

## 🧠 Kevin 的核心洞察（来源：日记 2026.02-03）

### 商单悖论
```
商单多 → 焦虑质量 → 追求数量 → 质量下降 → 账号增长变慢
商单少 → 焦虑收入 → FOMO → 状态崩溃
```

**解法：** 做真正有价值的事情，追求长期价值而非数量

### 有得有失
- 流量好、商单多 → 错失做真正项目的时间和精力
- 数据差、商单少 → 有时间和精力做真正牛逼的东西
- 只有当饥饿的时候，才能做出真正伟大的作品

### 效率天花板
**问题：**
1. 太过追求完美，太过于吹毛求疵
2. 迟迟与 AI 有一段距离，不愿意全面拥抱 AI
3. 系统迟迟无法搭建起来
4. 把创意工作，做成了苦力的人力成本工作

**解法：** 把最主要的精力，都放在最核心的品味和判断上

### 熬夜 = 动力失调
**解法：**
- 极度内耗焦虑时，选择打扫卫生、轻微体力活动
- 不要玩手机，状态能恢复一些

### 现在是追生产力的时候
- 微信里的钱花出去，买最贵的模型
- 事业快速上升期，输出要跟得上

---

## 📅 重要日期

### 2026-03-18 - 日记归档完成
- 创建了 `memory/2026-02-05-to-03-18-journal-archive.md`（原始日记）
- 创建了 `memory/2026-02-05-to-03-18-monthly-review.md`（月报）

### 2026-03-17 - 贾维斯超进化日（第二轮）

**完成事项：**
- ✅ 创建飞书文档同步系统
- ✅ 安装 content-collector skill
- ✅ 创建 self-improving skill（自我进化）
- ✅ 安装 Codex CLI
- ✅ 设置每日早报（明天 9:30）
- ✅ 创建 claude-code-executor skill
- ✅ 生成工作流优化方案

**创建的文档：**
- `飞书文档同步优化方案.md`
- `工作流优化方案.md`
- `skills/claude-code-executor/SKILL.md`
- `skills/self-improving/SKILL.md`

**待办：**
- 申请飞书权限（docs:document:import）
- 配置 Codex CLI（OPENAI_API_KEY）
- 安装 defuddle/web-content-fetcher

### 2026-03-16 - 贾维斯超进化日

**完成事项：**
- ✅ 安装 feedgrab + OpenCLI（内容抓取工具）
- ✅ 创建 8 个文档（原则库、工具手册、进化报告等）
- ✅ 创建 2 个自定义技能（内容抓取、原则提醒）
- ✅ 研究 mem9.ai（云端记忆方案）
- ✅ 更新 MEMORY.md + HEARTBEAT.md

**创建的文档：**
- `principles/自媒体变现原则.md`
- `docs/工具使用手册.md`
- `docs/mem9使用指南.md`
- `skills/content-grab/SKILL.md`
- `skills/principle-reminder/SKILL.md`
- `memory/2026-03-16-evolution-*.md`
- `早安惊喜.md`

**下一步：**
- 安装 Docker Desktop
- 配置 ask-search
- 加入龙虾茶馆
