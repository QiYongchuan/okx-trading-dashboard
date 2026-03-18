# OpenClaw 新手指南

> 创建时间: 2026-03-15
> 来源: https://docs.openclaw.ai

## 🚀 安装后的下一步

你已经安装了 OpenClaw，接下来应该做什么？

---

## ✅ 你已经完成的 (当前状态)

| 步骤 | 状态 |
|------|------|
| 安装 OpenClaw | ✅ 完成 |
| 运行 onboard 向导 | ✅ 完成 |
| 配置 API Key (ZAI) | ✅ 完成 |
| Gateway 服务运行 | ✅ 完成 (port 18789) |
| Control UI 可访问 | ✅ http://127.0.0.1:18789/ |

---

## 📋 接下来要做的事

### 1. 定义 Agent 身份 (正在进行中)

编辑这些文件来定义你的 AI 助手：

```bash
# 我的身份和性格
~/.openclaw/workspace/IDENTITY.md   # 名字、emoji、头像
~/.openclaw/workspace/SOUL.md       # 性格、价值观
~/.openclaw/workspace/USER.md       # 你的信息

# 长期记忆 (需要创建)
~/.openclaw/workspace/MEMORY.md     # 重要事情的长期记忆
~/.openclaw/workspace/memory/       # 每日笔记文件夹
```

### 2. 连接聊天平台 (可选但推荐)

```bash
# WhatsApp
openclaw channels login whatsapp

# Telegram (需要 Bot Token)
openclaw channels login telegram

# Discord (需要 Bot Token)
openclaw channels login discord
```

### 3. 配置 Web 搜索 (需要 Brave API Key)

```bash
openclaw configure --section web
```

或设置环境变量：
```bash
export BRAVE_API_KEY="your-key-here"
```

### 4. 配置定时任务 (可选)

编辑 `~/.openclaw/workspace/HEARTBEAT.md` 添加定期检查任务。

### 5. 安装技能 (可选)

```bash
# 查看可用技能
openclaw skills list

# 安装技能
openclaw skills install <skill-name>
```

---

## 🔧 常用命令速查

| 命令 | 作用 |
|------|------|
| `openclaw status` | 查看系统状态 |
| `openclaw dashboard` | 打开 Control UI |
| `openclaw gateway status` | 检查 Gateway 状态 |
| `openclaw gateway restart` | 重启 Gateway |
| `openclaw configure` | 重新配置 |
| `openclaw agents add <name>` | 添加新 agent |
| `openclaw logs --follow` | 实时查看日志 |
| `openclaw update` | 更新到最新版本 |

---

## 🔒 安全配置 (推荐)

编辑 `~/.openclaw/openclaw.json` 添加白名单：

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } }
    }
  },
  "messages": {
    "groupChat": { "mentionPatterns": ["@openclaw"] }
  }
}
```

---

## 📚 学习资源

| 资源 | 链接 |
|------|------|
| 官方文档 | https://docs.openclaw.ai |
| 完整功能列表 | https://docs.openclaw.ai/concepts/features |
| 配置参考 | https://docs.openclaw.ai/gateway/configuration |
| 故障排除 | https://docs.openclaw.ai/help |
| 社区 Discord | https://discord.com/invite/clawd |
| 技能市场 | https://clawhub.com |

---

## 🛠️ 高级配置

### 远程访问 (Tailscale)

```bash
openclaw configure --section gateway
# 选择启用 Tailscale
```

### 多 Agent 配置

```bash
# 创建专用 agent
openclaw agents add coding --workspace ~/.openclaw/workspace-coding
```

### 自定义工具策略

```bash
openclaw configure --section tools
```

---

## 📝 当前你的待办清单

1. [ ] 定义我的名字、性格、emoji (IDENTITY.md)
2. [ ] 填写你的信息 (USER.md)
3. [ ] 创建长期记忆文件 (MEMORY.md)
4. [ ] 连接聊天平台 (WhatsApp/Telegram/Discord)
5. [ ] 配置 Web 搜索 API (Brave)
6. [ ] 更新到最新版本 (`openclaw update`)

---

需要我帮你完成哪一步？
