# 🔧 OpenClaw 配置完全指南

## 📁 第一步：找到配置文件

### Windows
```
C:\Users\你的用户名\.openclaw\openclaw.json
```

### macOS / Linux
```
~/.openclaw/openclaw.json
```

---

## 📖 第二步：配置文件结构详解

**打开方式：** 用记事本、VS Code 或任何文本编辑器

**完整配置示例：**

```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.11",
    "lastTouchedAt": "2026-03-17T11:11:52.193Z"
  },
  "env": {
    "MOONSHOT_API_KEY": "sk-xxxxx",
    "ZHIPU_API_KEY": "xxxxx.xxxxx",
    "OPENAI_API_KEY": "sk-xxxxx"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-2.5"
      },
      "models": {
        "moonshot/kimi-2.5": {}
      },
      "workspace": "C:\\Users\\你的用户名\\.openclaw\\workspace"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback"
  },
  "tools": {
    "profile": "coding"
  },
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxx",
      "appSecret": "xxxxx"
    }
  }
}
```

---

## 🔍 第三步：配置文件各部分含义

### 1. **meta（元数据）**
```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.11",
    "lastTouchedAt": "2026-03-17T11:11:52.193Z"
  }
}
```

**作用：** 记录 OpenClaw 版本和最后修改时间
**是否需要改：** ❌ 不需要手动修改

---

### 2. **env（环境变量）** ⭐ 重要
```json
{
  "env": {
    "MOONSHOT_API_KEY": "sk-xxxxx",
    "ZHIPU_API_KEY": "xxxxx.xxxxx",
    "OPENAI_API_KEY": "sk-xxxxx"
  }
}
```

**作用：** 存储各个模型的 API Key
**是否需要改：** ✅ **需要！** 这里配置你的 API Key

**常见问题：**
- ❌ API Key 填错了 → 报错 `401 Unauthorized`
- ❌ API Key 过期了 → 报错 `limit`
- ❌ API Key 额度用完了 → 报错 `limit`

---

### 3. **agents.defaults.model（模型配置）** ⭐⭐⭐ 最重要
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-2.5"
      },
      "models": {
        "moonshot/kimi-2.5": {}
      }
    }
  }
}
```

**作用：** 指定使用哪个模型
**是否需要改：** ✅ **需要！** 这里修改模型

**如何修改：**
- `primary` - 当前使用的模型
- `models` - 可用的模型列表

**常见模型名称：**
- Kimi 2.5: `moonshot/kimi-2.5` 或 `moonshot/moonshot-v1-8k`
- GLM-4: `zhipu/glm-4`
- DeepSeek: `deepseek/deepseek-chat`
- GPT-4: `openai/gpt-4`
- Claude: `anthropic/claude-3-5-sonnet-20241022`

---

### 4. **gateway（网关配置）**
```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback"
  }
}
```

**作用：** OpenClaw 服务端口和模式
**是否需要改：** ❌ 一般不需要

---

### 5. **tools（工具配置）**
```json
{
  "tools": {
    "profile": "coding"
  }
}
```

**作用：** 工具权限配置
**常见值：**
- `coding` - 允许执行命令（推荐）
- `messaging` - 只允许消息

**是否需要改：** ⚠️ 如果无法执行命令，改为 `coding`

---

### 6. **channels（通道配置）**
```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_xxxxx",
      "appSecret": "xxxxx"
    }
  }
}
```

**作用：** 配置飞书、Telegram 等通道
**是否需要改：** ⚠️ 如果要用飞书/Telegram，需要配置

---

## 🔧 第四步：修复当前问题（Kimi limit 错误）

### 问题诊断

**可能原因：**

1. **API Key 额度用完**
   - 登录 https://moonshot.cn/ 查看剩余额度
   - 如果用完了，有两个选择：
     - 方案 A：等待下月重置
     - 方案 B：切换到其他模型

2. **API Key 填错了**
   - 检查 `env.MOONSHOT_API_KEY` 是否正确
   - 重新复制 API Key

3. **模型名称错误**
   - 检查 `agents.defaults.model.primary` 是否正确
   - 应该是 `moonshot/kimi-2.5` 或 `moonshot/moonshot-v1-8k`

---

### 修复步骤

#### **方案 A：切换到 GLM-4（推荐）**

**步骤：**

1. **获取 GLM API Key**
   - 访问：https://open.bigmodel.cn/
   - 注册账号
   - 进入控制台 → API Keys → 创建

2. **修改配置文件**
   ```json
   {
     "env": {
       "ZHIPU_API_KEY": "你的GLM API Key"
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "zhipu/glm-4"
         },
         "models": {
           "zhipu/glm-4": {}
         }
       }
     }
   }
   ```

3. **重启 OpenClaw**
   ```bash
   openclaw gateway restart
   ```

4. **测试**
   ```bash
   openclaw test
   ```

---

#### **方案 B：切换到 DeepSeek**

**步骤：**

1. **获取 DeepSeek API Key**
   - 访问：https://platform.deepseek.com/
   - 注册账号
   - 进入控制台 → API Keys → 创建

2. **修改配置文件**
   ```json
   {
     "env": {
       "DEEPSEEK_API_KEY": "你的DeepSeek API Key"
     },
     "agents": {
       "defaults": {
         "model": {
           "primary": "deepseek/deepseek-chat"
         },
         "models": {
           "deepseek/deepseek-chat": {}
         }
       }
     }
   }
   ```

3. **重启 OpenClaw**
   ```bash
   openclaw gateway restart
   ```

---

#### **方案 C：继续用 Kimi（升级付费）**

**步骤：**

1. **登录 Kimi 官网**
   - 访问：https://moonshot.cn/
   - 查看套餐和价格

2. **升级付费套餐**
   - 选择合适的套餐
   - 付款后 API Key 自动生效

---

## 📊 可接入模型列表

### 🆓 免费模型

| 模型 | 提供商 | 注册地址 |
|------|--------|---------|
| **Kimi** | Moonshot | https://moonshot.cn/ |
| **GLM-4** | 智谱 AI | https://open.bigmodel.cn/ |
| **DeepSeek** | DeepSeek | https://platform.deepseek.com/ |
| **Qwen** | 阿里云 | https://dashscope.aliyun.com/ |
| **Yi** | 零一万物 | https://platform.lingyiwanwu.com/ |
| **Baichuan** | 百川智能 | https://platform.baichuan-ai.com/ |
| **MiniMax** | MiniMax | https://www.minimaxi.com/ |

---

### 💰 付费模型

| 模型 | 提供商 | 注册地址 |
|------|--------|---------|
| **GPT-4 / GPT-3.5** | OpenAI | https://platform.openai.com/ |
| **Claude 3** | Anthropic | https://www.anthropic.com/ |
| **Gemini** | Google | https://ai.google.dev/ |
| **Mistral** | Mistral AI | https://mistral.ai/ |

---

### 🌍 订阅制套餐

| 套餐 | 价格 | 注册地址 |
|------|------|---------|
| **ChatGPT Plus** | $20/月 | https://chat.openai.com/ |
| **Claude Pro** | $20/月 | https://claude.ai/ |
| **Kimi 高级版** | ¥99/月 | https://moonshot.cn/ |

---

## 🚀 快速切换命令

### 切换到 GLM-4
```bash
# Windows
set ZHIPU_API_KEY=你的API Key
openclaw config set agents.defaults.model.primary "zhipu/glm-4"
openclaw gateway restart

# macOS / Linux
export ZHIPU_API_KEY=你的API Key
openclaw config set agents.defaults.model.primary "zhipu/glm-4"
openclaw gateway restart
```

### 切换到 DeepSeek
```bash
# Windows
set DEEPSEEK_API_KEY=你的API Key
openclaw config set agents.defaults.model.primary "deepseek/deepseek-chat"
openclaw gateway restart

# macOS / Linux
export DEEPSEEK_API_KEY=你的API Key
openclaw config set agents.defaults.model.primary "deepseek/deepseek-chat"
openclaw gateway restart
```

---

## 🔍 常见问题排查

### 问题 1：limit 错误

**诊断步骤：**

1. **检查 API Key 是否有效**
   ```bash
   openclaw test
   ```

2. **检查剩余额度**
   - 登录对应平台查看

3. **如果额度用完**
   - 等待下月重置
   - 或切换到其他模型

---

### 问题 2：model not found

**诊断步骤：**

1. **检查模型名称是否正确**
   - 确认 `primary` 和 `models` 中的名称一致
   - 确认名称格式正确（`提供商/模型名`）

2. **检查 API Key 是否配置**
   - 确认 `env` 中有对应的 API Key

---

### 问题 3：401 Unauthorized

**诊断步骤：**

1. **检查 API Key 是否正确**
   - 重新复制 API Key
   - 确认没有多余的空格

2. **检查 API Key 是否过期**
   - 登录平台查看状态

---

## 💡 最佳实践

1. **免费用户：** GLM-4（额度大） + DeepSeek（备用）
2. **付费用户：** GPT-4（主力） + GLM-4（免费备用）
3. **海外用户：** GPT-4 或 Claude 3

---

## 📞 获取帮助

**官方文档：** https://docs.openclaw.ai

**社区讨论：** https://github.com/ythx-101/openclaw-qa/discussions

**龙虾茶馆：** https://github.com/ythx-101/openclaw-qa/discussions/22

---

*创建时间：2026-03-17*
*作者：贾维斯*
*适用版本：OpenClaw 2026.3.11+*
