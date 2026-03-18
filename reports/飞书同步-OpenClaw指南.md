# 复制到飞书文档：📚 OpenClaw小白上手指南
# 文档链接：https://www.feishu.cn/docx/GQt4d0XmoosNAAxBbLnc7CgSni3

生成时间：2026-03-16
适用对象：刚安装OpenClaw的新用户

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

---

## 二、核心概念

### Gateway（网关）

**是什么**：Gateway是OpenClaw的核心服务，负责：
- 连接聊天软件（Telegram等）
- 调用AI模型
- 执行工具（文件、命令等）

**管理命令**：
```bash
openclaw gateway status   # 查看状态
openclaw gateway start    # 启动
openclaw gateway stop     # 停止
openclaw gateway restart  # 重启
```

### Channel（渠道）

**是什么**：Channel是聊天软件的连接，比如Telegram、飞书。

**常见渠道**：
- `telegram` - Telegram机器人
- `feishu` - 飞书机器人
- `discord` - Discord机器人
- `imessage` - iMessage（仅macOS）

### Agent（代理）

**是什么**：Agent是AI的"人格"，可以有多个Agent用于不同用途。

**默认Agent**：`main`

### Skill（技能）

**是什么**：Skill是扩展能力的模块，教AI如何使用特定工具。

**位置**：
- `~/.openclaw/skills/` - 本地技能
- `<workspace>/skills/` - 工作区技能
- 内置技能 - 随OpenClaw安装

---

## 三、常用命令

### 状态检查

```bash
# 查看整体状态
openclaw status

# 深度检查
openclaw status --deep
```

### 配置管理

```bash
# 运行配置向导
openclaw configure

# 查看配置
cat ~/.openclaw/openclaw.json
```

### 技能管理

```bash
# 列出所有技能
openclaw skills list

# 安装技能（通过clawhub）
npx clawhub install <skill-slug>
```

### 日志和调试

```bash
# 查看日志
openclaw logs

# 实时日志
openclaw logs --follow

# 运行诊断
openclaw doctor
```

---

## 四、配置文件详解

### 配置文件位置

```
~/.openclaw/openclaw.json
```

### 关键配置项

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
- `openai/gpt-5.2` - GPT-5.2

#### channels.feishu

```json5
{
  channels: {
    feishu: {
      enabled: true,
      appId: "cli_xxx",
      appSecret: "xxx",
      dmPolicy: "allowlist",  // allowlist | open | disabled
      groupPolicy: "open"     // allowlist | open
    }
  }
}
```

---

## 五、技能系统

### 什么是技能？

技能（Skill）是扩展OpenClaw能力的模块，每个技能教AI如何使用特定工具或完成特定任务。

### 技能依赖

很多技能需要安装CLI工具才能使用：

| 技能 | 需要安装 |
|------|---------|
| github | `gh` CLI |
| obsidian | `obsidian-cli` |
| himalaya | `himalaya` |
| apple-notes | `memo` |
| apple-reminders | `remindctl` |

### 安装技能依赖

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

### 必装技能 🔥

1. **🐙 github** - GitHub操作
   ```bash
   brew install gh
   gh auth login
   ```

2. **💎 obsidian** - Obsidian集成
   ```bash
   brew install obsidian-cli
   ```

### 高频使用技能 📌

| 技能 | 用途 | 依赖 |
|------|------|------|
| 📧 himalaya | 邮件管理 | `himalaya` |
| ⏰ apple-reminders | 提醒事项 | `remindctl` |
| 📝 apple-notes | Apple Notes | `memo` |
| 🐦 xurl | X/Twitter API | - |
| 🔊 sag | ElevenLabs语音 | - |

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

### Q3: 飞书机器人不响应？

1. 检查 appId 和 appSecret 是否正确
2. 检查是否配置了权限
3. 查看日志：`openclaw logs`

### Q4: 如何更换AI模型？

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

### Q5: 如何设置定时任务？

1. 启用cron：
   ```json5
   {
     cron: { enabled: true }
   }
   ```

2. 创建任务（通过对话告诉AI即可）

---

## 八、进阶玩法

### 多Agent配置

创建多个Agent用于不同用途：

```json5
{
  agents: {
    list: [
      {
        id: "work",
        default: true,
        workspace: "~/.openclaw/workspace-work"
      },
      {
        id: "personal",
        workspace: "~/.openclaw/workspace-personal"
      }
    ]
  }
}
```

### 创建自定义技能

在 `~/.openclaw/skills/my-skill/SKILL.md`：

```markdown
---
name: my-skill
description: 我的自定义技能
---

# My Skill

使用说明...
```

### Heartbeat（定期检查）

让AI定期主动检查并汇报：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m"
      }
    }
  }
}
```

在 `HEARTBEAT.md` 中定义检查任务。

---

## 九、资源链接

| 资源 | 链接 |
|------|------|
| 官方文档 | https://docs.openclaw.ai |
| GitHub | https://github.com/openclaw/openclaw |
| 技能市场 | https://clawhub.com |
| 社区 | https://discord.com/invite/clawd |

---

*生成于2026-03-16 超进化任务*
*适用版本：OpenClaw 2026.3.x*
