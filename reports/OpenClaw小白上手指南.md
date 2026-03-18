# OpenClaw 小白上手指南

> 从零到一：安装OpenClaw后需要了解的一切
> 生成时间：2026-03-16
> 适用对象：刚安装OpenClaw的新用户

---

## 目录

1. [OpenClaw是什么？](#一openclaw是什么)
2. [核心概念](#二核心概念)
3. [配置文件详解](#三配置文件详解)
4. [常用命令](#四常用命令)
5. [技能系统](#五技能系统)
6. [推荐技能清单](#六推荐技能清单)
7. [常见问题](#七常见问题)
8. [进阶玩法](#八进阶玩法)

---

## 一、OpenClaw是什么？

**一句话解释**：OpenClaw是一个运行在你电脑上的AI管家，可以通过Telegram、WhatsApp、Discord等聊天软件与你对话，帮你执行各种任务。

### 核心能力

| 能力 | 说明 |
|------|------|
| 💬 多渠道对话 | Telegram、WhatsApp、Discord、iMessage等 |
| 📁 文件操作 | 读取、写入、编辑文件 |
| 🖥️ 命令执行 | 执行shell命令 |
| 🌐 网络访问 | 搜索网页、抓取内容 |
| 🧠 记忆系统 | 记住重要信息，跨会话保持 |
| ⏰ 定时任务 | cron定时执行任务 |
| 🔌 技能扩展 | 安装各种技能增强能力 |

### 架构图

```
你（Telegram/WhatsApp） ←→ Gateway ←→ AI模型（Claude/GPT/GLM等）
                                    ↓
                              你的电脑（文件、命令、网络）
```

---

## 二、核心概念

### 2.1 Gateway（网关）

**是什么**：Gateway是OpenClaw的核心服务，负责：
- 连接聊天软件（Telegram等）
- 调用AI模型
- 执行工具（文件、命令等）

**位置**：运行在你的电脑上，默认端口 `18789`

**管理命令**：
```bash
openclaw gateway status   # 查看状态
openclaw gateway start    # 启动
openclaw gateway stop     # 停止
openclaw gateway restart  # 重启
```

### 2.2 Channel（渠道）

**是什么**：Channel是聊天软件的连接，比如Telegram、WhatsApp。

**配置位置**：`~/.openclaw/openclaw.json` 中的 `channels` 部分

**常见渠道**：
- `telegram` - Telegram机器人
- `whatsapp` - WhatsApp
- `discord` - Discord机器人
- `imessage` - iMessage（仅macOS）

### 2.3 Agent（代理）

**是什么**：Agent是AI的"人格"，可以有多个Agent用于不同用途。

**默认Agent**：`main`

**配置位置**：`~/.openclaw/openclaw.json` 中的 `agents` 部分

### 2.4 Session（会话）

**是什么**：Session是一次对话的上下文，保持对话连贯性。

**类型**：
- `direct` - 私聊
- `group` - 群聊

### 2.5 Skill（技能）

**是什么**：Skill是扩展能力的模块，教AI如何使用特定工具。

**位置**：
- `~/.openclaw/skills/` - 本地技能
- `<workspace>/skills/` - 工作区技能
- 内置技能 - 随OpenClaw安装

### 2.6 Tool（工具）

**是什么**：Tool是AI可以调用的具体能力，比如 `read`、`exec`、`web_search`。

**工具Profile**：
| Profile | 包含工具 | 适用场景 |
|---------|---------|---------|
| `minimal` | session_status | 仅状态查看 |
| `coding` | fs, runtime, sessions, memory, image | 编码任务 |
| `messaging` | messaging, sessions | 消息处理 |
| `full` | 所有工具 | 完全能力 |

---

## 三、配置文件详解

### 3.1 配置文件位置

```
~/.openclaw/openclaw.json
```

### 3.2 最小配置

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace"
    }
  }
}
```

### 3.3 完整配置示例

```json5
{
  // 元数据
  meta: {
    lastTouchedVersion: "2026.3.11",
    lastTouchedAt: "2026-03-16T11:03:44.786Z"
  },

  // 环境变量
  env: {
    ZAI_API_KEY: "your-api-key",
    HTTPS_PROXY: "http://127.0.0.1:7897",
    HTTP_PROXY: "http://127.0.0.1:7897"
  },

  // Agent配置
  agents: {
    defaults: {
      model: {
        primary: "zai/glm-5",
        fallbacks: ["anthropic/claude-sonnet-4-5"]
      },
      workspace: "/Users/xxx/.openclaw/workspace",
      heartbeat: {
        every: "30m",
        target: "last"
      }
    }
  },

  // 工具配置
  tools: {
    profile: "coding",
    web: {
      search: {
        provider: "brave"
      }
    }
  },

  // 渠道配置
  channels: {
    telegram: {
      enabled: true,
      dmPolicy: "pairing",  // pairing | allowlist | open | disabled
      botToken: "your-bot-token",
      groups: {
        "*": { requireMention: true }
      },
      groupPolicy: "allowlist"
    }
  },

  // Gateway配置
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    auth: {
      mode: "token",
      token: "your-auth-token"
    }
  },

  // Cron配置
  cron: {
    enabled: true,
    maxConcurrentRuns: 2
  }
}
```

### 3.4 关键配置项说明

#### agents.defaults.model

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "zai/glm-5",           // 主模型
        fallbacks: ["openai/gpt-5.2"]   // 备用模型
      }
    }
  }
}
```

**可用模型**：
- `zai/glm-5` - 智谱GLM-5
- `anthropic/claude-sonnet-4-5` - Claude Sonnet
- `anthropic/claude-opus-4-6` - Claude Opus
- `openai/gpt-5.2` - GPT-5.2

#### channels.telegram.dmPolicy

| 值 | 说明 |
|---|------|
| `pairing` | 未知用户需要配对码验证（推荐） |
| `allowlist` | 只有白名单用户可以对话 |
| `open` | 所有人都可以对话 |
| `disabled` | 禁用私聊 |

#### tools.profile

| 值 | 说明 |
|---|------|
| `coding` | 文件+命令+会话+记忆（推荐） |
| `messaging` | 仅消息功能 |
| `full` | 所有工具 |
| `minimal` | 仅状态查看 |

#### gateway

```json5
{
  gateway: {
    port: 18789,           // 端口
    mode: "local",         // local | remote
    bind: "loopback",      // loopback | all
    auth: {
      mode: "token",       // token | none
      token: "xxx"
    }
  }
}
```

---

## 四、常用命令

### 4.1 状态检查

```bash
# 查看整体状态
openclaw status

# 查看Gateway状态
openclaw gateway status

# 深度检查
openclaw status --deep
```

### 4.2 配置管理

```bash
# 运行配置向导
openclaw configure

# 查看配置
openclaw config get agents.defaults.model

# 设置配置
openclaw config set agents.defaults.heartbeat.every "1h"

# 查看完整配置
cat ~/.openclaw/openclaw.json
```

### 4.3 渠道管理

```bash
# 登录渠道（如WhatsApp）
openclaw channels login

# 查看渠道状态
openclaw status --deep
```

### 4.4 技能管理

```bash
# 列出所有技能
openclaw skills list

# 安装技能（通过clawhub）
npx clawhub install <skill-slug>

# 更新所有技能
npx clawhub update --all
```

### 4.5 日志和调试

```bash
# 查看日志
openclaw logs

# 实时日志
openclaw logs --follow

# 运行诊断
openclaw doctor

# 自动修复
openclaw doctor --fix
```

### 4.6 服务管理

```bash
# 安装为系统服务
openclaw onboard --install-daemon

# 启动服务
openclaw gateway start

# 停止服务
openclaw gateway stop

# 重启服务
openclaw gateway restart
```

---

## 五、技能系统

### 5.1 什么是技能？

技能（Skill）是扩展OpenClaw能力的模块，每个技能教AI如何使用特定工具或完成特定任务。

### 5.2 技能类型

| 类型 | 位置 | 说明 |
|------|------|------|
| 内置技能 | 随OpenClaw安装 | 51个可用技能 |
| 本地技能 | `~/.openclaw/skills/` | 你的自定义技能 |
| 工作区技能 | `<workspace>/skills/` | 项目相关技能 |

### 5.3 技能状态

| 状态 | 说明 |
|------|------|
| ✓ ready | 可以使用 |
| ✗ missing | 缺少依赖（CLI工具等） |
| ✗ disabled | 被禁用 |

### 5.4 技能依赖

很多技能需要安装CLI工具才能使用：

| 技能 | 需要安装 |
|------|---------|
| github | `gh` CLI |
| obsidian | `obsidian-cli` |
| himalaya | `himalaya` |
| apple-notes | `memo` |
| apple-reminders | `remindctl` |

### 5.5 安装技能依赖

```bash
# GitHub CLI
brew install gh
gh auth login

# 其他工具（如果需要）
brew install himalaya
brew install obsidian-cli
```

---

## 六、推荐技能清单

### 6.1 必装技能 🔥

#### 1. github - GitHub操作

**用途**：管理仓库、PR、Issues

**安装**：
```bash
brew install gh
gh auth login
```

**技能自动就绪**

---

#### 2. obsidian - Obsidian集成

**用途**：直接操作Obsidian笔记

**安装**：
```bash
brew install obsidian-cli
```

---

### 6.2 高频使用技能 📌

| 技能 | 用途 | 依赖 |
|------|------|------|
| 📧 himalaya | 邮件管理 | `himalaya` |
| ⏰ apple-reminders | 提醒事项 | `remindctl` |
| 📝 apple-notes | Apple Notes | `memo` |
| 🐦 xurl | X/Twitter API | - |
| 🔊 sag | ElevenLabs语音 | - |

### 6.3 按场景推荐

#### 场景：独立开发者/创作者

```
必装：github, obsidian
推荐：himalaya, xurl, sag
可选：notion, trello, things-mac
```

#### 场景：日常办公

```
必装：github, apple-reminders
推荐：apple-notes, himalaya
可选：notion, slack
```

#### 场景：AI研究/实验

```
必装：github, coding-agent
推荐：summarize, oracle
可选：gemini, nano-banana-pro
```

### 6.4 查看所有可用技能

```bash
openclaw skills list
```

或访问 [https://clawhub.com](https://clawhub.com)

---

## 七、常见问题

### Q1: 如何更新OpenClaw？

```bash
openclaw update
```

或：
```bash
npm update -g openclaw@latest
```

### Q2: Gateway启动失败怎么办？

1. 检查端口是否被占用：
   ```bash
   lsof -i :18789
   ```

2. 检查配置是否正确：
   ```bash
   openclaw doctor
   ```

3. 查看错误日志：
   ```bash
   openclaw logs
   ```

### Q3: Telegram机器人不响应？

1. 检查botToken是否正确
2. 检查是否完成了pairing（配对）
3. 检查dmPolicy设置
4. 查看日志：`openclaw logs`

### Q4: 技能显示missing怎么办？

技能需要特定的CLI工具，按照提示安装即可：

```bash
# 查看哪些技能missing
openclaw skills list

# 安装对应的CLI工具
brew install <tool-name>
```

### Q5: 如何更换AI模型？

编辑 `~/.openclaw/openclaw.json`：

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5"
      }
    }
  }
}
```

或使用命令：
```bash
openclaw config set agents.defaults.model.primary "anthropic/claude-sonnet-4-5"
```

### Q6: 如何设置定时任务？

1. 启用cron：
   ```json5
   {
     cron: { enabled: true }
   }
   ```

2. 创建任务：
   ```bash
   openclaw cron add \
     --name "每日提醒" \
     --cron "0 9 * * *" \
     --session main \
     --system-event "今天的任务清单"
   ```

### Q7: 如何远程访问？

1. 配置Tailscale（推荐）
2. 或配置gateway.bind为"all"（不推荐，有安全风险）

### Q8: 如何备份数据？

重要文件：
- `~/.openclaw/openclaw.json` - 配置
- `~/.openclaw/workspace/` - 工作区（包含MEMORY.md）
- `~/.openclaw/cron/jobs.json` - 定时任务

---

## 八、进阶玩法

### 8.1 多Agent配置

创建多个Agent用于不同用途：

```json5
{
  agents: {
    list: [
      {
        id: "work",
        default: true,
        workspace: "~/.openclaw/workspace-work",
        tools: { profile: "coding" }
      },
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal",
        tools: { profile: "messaging" }
      }
    ]
  },
  bindings: [
    {
      agentId: "work",
      match: { channel: "telegram", accountId: "default" }
    }
  ]
}
```

### 8.2 创建自定义技能

在 `~/.openclaw/skills/my-skill/SKILL.md`：

```markdown
---
name: my-skill
description: 我的自定义技能
metadata: { "openclaw": { "emoji": "🎯" } }
---

# My Skill

使用说明...

## 使用场景

- 场景1
- 场景2

## 示例

...
```

### 8.3 使用Hooks（Webhook）

接收外部事件并触发AI：

```json5
{
  hooks: {
    enabled: true,
    token: "webhook-secret",
    mappings: [
      {
        match: { path: "gmail" },
        action: "agent",
        agentId: "main",
        deliver: true
      }
    ]
  }
}
```

### 8.4 Heartbeat（定期检查）

让AI定期主动检查并汇报：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "last"
      }
    }
  }
}
```

在 `HEARTBEAT.md` 中定义检查任务。

### 8.5 Sandbox（沙箱）

在Docker容器中运行不可信代码：

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",  // off | non-main | all
        scope: "agent"
      }
    }
  }
}
```

---

## 九、快速上手清单

### 第1天

- [ ] 安装OpenClaw：`npm install -g openclaw@latest`
- [ ] 运行配置向导：`openclaw onboard --install-daemon`
- [ ] 配置Telegram：获取botToken，添加到配置
- [ ] 测试对话：在Telegram中与机器人对话

### 第2天

- [ ] 安装GitHub CLI：`brew install gh && gh auth login`
- [ ] 检查技能：`openclaw skills list`
- [ ] 配置模型：选择适合的AI模型
- [ ] 设置工作目录：了解workspace结构

### 第3天

- [ ] 创建MEMORY.md：记录重要信息
- [ ] 配置heartbeat：设置定期检查
- [ ] 安装更多技能：根据需要安装
- [ ] 阅读进阶文档：[docs.openclaw.ai](https://docs.openclaw.ai)

---

## 十、资源链接

| 资源 | 链接 |
|------|------|
| 官方文档 | https://docs.openclaw.ai |
| GitHub | https://github.com/openclaw/openclaw |
| 技能市场 | https://clawhub.com |
| 社区 | https://discord.com/invite/clawd |
| 更新 | `openclaw update` |

---

## 附录：配置模板

### A. 最小配置

```json5
{
  agents: {
    defaults: {
      workspace: "~/.openclaw/workspace"
    }
  }
}
```

### B. 创作者配置

```json5
{
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-sonnet-4-5" },
      workspace: "~/.openclaw/workspace",
      heartbeat: { every: "30m" }
    }
  },
  tools: { profile: "coding" },
  channels: {
    telegram: {
      enabled: true,
      dmPolicy: "pairing",
      botToken: "YOUR_TOKEN"
    }
  },
  cron: { enabled: true }
}
```

### C. 完整配置

见 [第三节](#三配置文件详解)

---

*生成于2026-03-16 超进化任务*
*适用版本：OpenClaw 2026.3.x*
