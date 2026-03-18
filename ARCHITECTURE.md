# OpenClaw 架构说明

> 创建时间: 2026-03-15
> 用途: 理解 OpenClaw 的文件结构和配置，以便手动修复问题

## 核心目录结构

```
~/.openclaw/                          # 主目录
├── openclaw.json                     # 🔑 主配置文件 (最重要！)
├── openclaw.json.bak                 # 自动备份
├── auth-profiles.json                # 全局认证配置
│
├── agents/                           # Agent 配置
│   └── main/                         # 默认 agent
│       ├── agent/
│       │   └── auth-profiles.json    # agent 级别的认证
│       └── sessions/
│           ├── sessions.json         # 会话状态
│           └── *.jsonl               # 对话历史记录
│
├── workspace/                        # 🧠 工作区 (Agent 的"大脑")
│   ├── AGENTS.md                     # Agent 行为指南
│   ├── SOUL.md                       # 性格/身份定义
│   ├── USER.md                       # 用户信息
│   ├── IDENTITY.md                   # 身份标识 (名字、emoji)
│   ├── TOOLS.md                      # 工具配置
│   ├── HEARTBEAT.md                  # 定时任务
│   ├── MEMORY.md                     # 长期记忆 (需创建)
│   └── memory/                       # 每日笔记
│
├── cron/jobs.json                    # 定时任务
├── devices/                          # 设备配对
├── logs/                             # 日志
└── identity/                         # 设备身份
```

## 关键配置文件

### 1. `~/.openclaw/openclaw.json` — 主配置

关键字段:
- `env.ZAI_API_KEY` — API Key
- `agents.defaults.model.primary` — 默认模型 (zai/glm-5)
- `gateway.port` — Dashboard 端口 (18789)
- `gateway.auth.token` — Gateway 认证 token

### 2. 工作区文件 (`~/.openclaw/workspace/`)

| 文件 | 作用 |
|------|------|
| `AGENTS.md` | Agent 行为规则、记忆机制 |
| `SOUL.md` | 性格、价值观、边界 |
| `USER.md` | 用户信息 |
| `IDENTITY.md` | 名字、emoji、头像 |
| `MEMORY.md` | 长期记忆 |

## 备份命令

```bash
# 完整备份
tar -czvf ~/Desktop/openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw

# 最小备份 (只配置)
tar -czvf ~/Desktop/openclaw-config-$(date +%Y%m%d).tar.gz \
  ~/.openclaw/openclaw.json \
  ~/.openclaw/auth-profiles.json \
  ~/.openclaw/workspace/
```

## 紧急修复

### API Key 丢失
```bash
nano ~/.openclaw/openclaw.json
# 或
openclaw agents add main
```

### 会话损坏
```bash
rm ~/.openclaw/agents/main/sessions/*.jsonl
rm ~/.openclaw/agents/main/sessions/sessions.json
```

### Gateway 问题
```bash
openclaw gateway status
openclaw gateway restart
```

### 完全重置 (慎用)
```bash
openclaw gateway stop
mv ~/.openclaw ~/.openclaw.backup
openclaw wizard
```

## 当前配置

- 模型: zai/glm-5
- Dashboard: http://127.0.0.1:18789/
- Gateway: 本地模式 (loopback)
- 工作区: /Users/qyc/.openclaw/workspace
