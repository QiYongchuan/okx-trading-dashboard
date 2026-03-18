# 🔧 OpenClaw 在 Windows 上配置 Kimi 报错 "limit" 的修复教程

## 📋 问题描述

**环境：** Windows PC（首次安装）
**配置：** Kimi 2.5
**错误：** limit（API 调用限制）

---

## 🎯 解决方案（3种方式）

### 方式 1：使用 Claude Code 自动修复（推荐 ⭐）

**适用场景：** 不想手动改配置文件

**步骤：**

1. **安装 Claude Code CLI**
   ```bash
   # Windows PowerShell
   irm https://getclaudecode.com/install.ps1 | iex
   ```

2. **启动 Claude Code**
   ```bash
   claude
   ```

3. **让 Claude Code 修复**
   ```
   帮我修复 OpenClaw 的 limit 错误，配置文件在 C:\Users\你的用户名\.openclaw\openclaw.json
   当前使用的模型是 Kimi 2.5，报错提示 limit
   ```

4. **Claude Code 会自动：**
   - 检查配置文件
   - 识别 limit 问题
   - 修改配置或建议切换模型

---

### 方式 2：手动修改配置文件

**适用场景：** 熟悉 JSON 配置

**步骤：**

1. **找到配置文件**
   ```
   C:\Users\你的用户名\.openclaw\openclaw.json
   ```

2. **用记事本或 VS Code 打开**

3. **检查以下配置项：**

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
     },
     "env": {
       "MOONSHOT_API_KEY": "你的Kimi API Key"
     }
   }
   ```

4. **常见 limit 问题及修复：**

   **问题 A：API Key 调用次数用完**
   - **症状：** 报错 limit，无法调用
   - **修复：**
     - 方案1：等待下个月重置（免费套餐）
     - 方案2：升级付费套餐
     - 方案3：切换到其他免费模型（见下文）

   **问题 B：配置文件格式错误**
   - **症状：** limit 错误或无法启动
   - **修复：** 检查 JSON 格式，确保没有多余的逗号或引号

   **问题 C：模型名称错误**
   - **症状：** limit 或 model not found
   - **修复：** 确认模型名称正确：
     - Kimi 2.5: `moonshot/kimi-2.5` 或 `moonshot/moonshot-v1-8k`
     - GLM-4: `zhipu/glm-4`
     - GPT-4: `openai/gpt-4`

---

### 方式 3：切换到免费模型（推荐 ⭐⭐⭐）

**适用场景：** Kimi 免费套餐用完了，想用其他免费模型

**步骤：**

1. **打开配置文件**
   ```
   C:\Users\你的用户名\.openclaw\openclaw.json
   ```

2. **修改模型配置**

   **方案 A：GLM-4（免费，推荐）**
   ```json
   {
     "agents": {
       "defaults": {
         "model": {
           "primary": "zhipu/glm-4"
         },
         "models": {
           "zhipu/glm-4": {}
         }
       }
     },
     "env": {
       "ZHIPU_API_KEY": "你的GLM API Key"
     }
   }
   ```

   **获取 GLM API Key：**
   - 访问：https://open.bigmodel.cn/
   - 注册账号
   - 免费额度：每月 1000 万 tokens

   **方案 B：DeepSeek（免费，推荐）**
   ```json
   {
     "agents": {
       "defaults": {
         "model": {
           "primary": "deepseek/deepseek-chat"
         },
         "models": {
           "deepseek/deepseek-chat": {}
         }
       }
     },
     "env": {
       "DEEPSEEK_API_KEY": "你的DeepSeek API Key"
     }
   }
   ```

   **获取 DeepSeek API Key：**
   - 访问：https://platform.deepseek.com/
   - 注册账号
   - 免费额度：每月 500 万 tokens

   **方案 C：GPT-3.5（付费）**
   ```json
   {
     "agents": {
       "defaults": {
         "model": {
           "primary": "openai/gpt-3.5-turbo"
         },
         "models": {
           "openai/gpt-3.5-turbo": {}
         }
       }
     },
     "env": {
       "OPENAI_API_KEY": "你的OpenAI API Key"
     }
   }
   ```

3. **重启 OpenClaw**
   ```bash
   openclaw gateway restart
   ```

---

## 📊 可用模型套餐对比（2026-03）

### 🆓 免费模型（推荐）

| 模型 | 提供商 | 免费额度 | 特点 | 获取方式 |
|------|--------|---------|------|---------|
| **GLM-4** | 智谱 AI | 1000 万 tokens/月 | 中文强、速度快 | https://open.bigmodel.cn/ |
| **DeepSeek** | DeepSeek | 500 万 tokens/月 | 便宜、能力强 | https://platform.deepseek.com/ |
| **Kimi** | Moonshot | 100 万 tokens/月 | 长上下文、中文好 | https://moonshot.cn/ |
| **Qwen** | 阿里云 | 100 万 tokens/月 | 开源、能力强 | https://dashscope.aliyun.com/ |

**推荐顺序：**
1. GLM-4（免费额度最大，中文最强）
2. DeepSeek（便宜，能力强）
3. Kimi（长上下文，适合大文档）

---

### 💰 付费模型（海外可用）

| 模型 | 提供商 | 价格 | 特点 | 适用场景 |
|------|--------|------|------|---------|
| **GPT-4** | OpenAI | $0.03/1K tokens | 最强通用能力 | 复杂任务、推理 |
| **GPT-3.5** | OpenAI | $0.002/1K tokens | 便宜、快速 | 日常对话、简单任务 |
| **Claude 3** | Anthropic | $0.015/1K tokens | 长上下文、安全 | 长文档、代码分析 |
| **Gemini Pro** | Google | $0.001/1K tokens | 便宜、多模态 | 图文混合任务 |

**订阅制套餐：**

1. **ChatGPT Plus** - $20/月
   - 无限 GPT-4 使用
   - 优先访问新功能
   - 获取方式：https://chat.openai.com/

2. **Claude Pro** - $20/月
   - 无限 Claude 3 使用
   - 长上下文支持
   - 获取方式：https://claude.ai/

3. **Kimi 高级版** - ¥99/月
   - 2000 万 tokens/月
   - 优先响应
   - 获取方式：https://moonshot.cn/

---

### 🌍 海外用户推荐（新加坡）

**最佳组合：**

1. **免费方案**
   - GLM-4（智谱 AI）+ DeepSeek
   - 完全免费，够日常使用

2. **付费方案**
   - GPT-4（OpenAI）- 最强能力
   - Claude 3（Anthropic）- 长上下文

3. **混合方案（推荐 ⭐）**
   - 日常：GLM-4（免费）
   - 复杂任务：GPT-4（按量付费）

---

## 🔧 修复步骤总结

**如果是 limit 错误：**

1. **检查 API Key 是否有效**
   - 登录对应平台
   - 查看剩余额度

2. **如果额度用完**
   - 方案 A：等待下月重置（免费）
   - 方案 B：升级付费套餐
   - 方案 C：切换到其他免费模型

3. **如果配置文件错误**
   - 方案 A：用 Claude Code 修复
   - 方案 B：手动修改 JSON

4. **如果不确定问题**
   - 用 Claude Code 诊断
   - 或切换到 GLM-4（免费，稳定）

---

## 📝 配置示例

### 完整的 openclaw.json 示例（GLM-4）

```json
{
  "meta": {
    "lastTouchedVersion": "2026.3.11"
  },
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
      },
      "workspace": "C:\\Users\\你的用户名\\.openclaw\\workspace"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local"
  },
  "tools": {
    "profile": "coding"
  }
}
```

---

## 💡 常见问题

**Q1: 如何查看当前使用的模型？**
```bash
openclaw status
```

**Q2: 如何测试模型是否正常？**
```bash
openclaw test
```

**Q3: 如何切换模型？**
- 方法1：修改 `openclaw.json`
- 方法2：`openclaw config set agents.defaults.model.primary "模型名称"`

**Q4: 推荐的模型配置？**
- 国内用户：GLM-4（免费）+ DeepSeek（备用）
- 海外用户：GPT-4（付费）+ GLM-4（免费备用）

---

## 🎯 快速修复命令（一键切换到 GLM-4）

```bash
# 1. 获取 GLM API Key
# 访问 https://open.bigmodel.cn/ 注册并获取

# 2. 设置环境变量
set ZHIPU_API_KEY=你的API Key

# 3. 切换模型
openclaw config set agents.defaults.model.primary "zhipu/glm-4"

# 4. 重启
openclaw gateway restart

# 5. 测试
openclaw test
```

---

## 📞 还是不行？

如果以上方法都无法解决，可能是其他问题：

1. **网络问题** - 检查代理设置
2. **版本问题** - 更新 OpenClaw 到最新版
3. **权限问题** - 以管理员身份运行

**获取帮助：**
- 官方文档：https://docs.openclaw.ai
- 社区讨论：https://github.com/ythx-101/openclaw-qa/discussions
- 龙虾茶馆：https://github.com/ythx-101/openclaw-qa/discussions/22

---

*创建时间：2026-03-17*
*作者：贾维斯*
*适用版本：OpenClaw 2026.3.11+*
