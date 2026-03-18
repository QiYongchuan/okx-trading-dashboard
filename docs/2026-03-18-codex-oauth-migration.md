# OpenClaw Codex OAuth 接入记录

> 时间：2026-03-18 07:39
> 操作人：贾维斯
> 目的：将 OpenAI Codex (ChatGPT OAuth) 接入 OpenClaw 主模型

---

## 变更前状态

### 主模型
- **默认模型**：`zai/glm-5`（智谱 GLM）
- **认证方式**：环境变量 `ZAI_API_KEY`
- **特点**：便宜、速度快，但能力相对弱

### 配置文件
- `~/.openclaw/openclaw.json` — 主配置
- `~/.openclaw/agents/main/agent/auth-profiles.json` — 认证配置

### 备份位置
- `~/.openclaw/openclaw.json.bak.20260318_073912`
- 已有 Codex CLI 登录状态（ChatGPT Plus）

---

## 变更内容

### 操作命令
```bash
openclaw models auth setup-token --provider openai-codex
```

### 预期变更
1. 主模型从 `zai/glm-5` → `openai-codex/gpt-5.4`
2. 认证方式从环境变量 → OAuth token
3. 所有对话直接使用 GPT-5.4

---

## 配置结构说明

### openclaw.json 关键字段
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai-codex/gpt-5.4"  // 变更后
      }
    }
  }
}
```

### auth-profiles.json 结构
```json
{
  "profiles": {
    "openai-codex": {
      "token": "...",  // OAuth token
      "method": "oauth"
    }
  },
  "order": ["openai-codex", "zai"]
}
```

---

## 回滚方案

如果出问题，执行：

```bash
# 恢复配置
cp ~/.openclaw/openclaw.json.bak.20260318_073912 ~/.openclaw/openclaw.json

# 重启 gateway
openclaw gateway restart
```

---

## 注意事项

1. **Token 消耗**：GPT-5.4 比 GLM-5 贵很多，注意用量
2. **降级选项**：可以在 `openclaw.json` 中设置 fallbacks，主模型失败时降级到 GLM
3. **混合使用**：也可以保持 GLM 为主，复杂任务手动调用 Codex

---

## 相关文件

- 主配置：`~/.openclaw/openclaw.json`
- 认证配置：`~/.openclaw/agents/main/agent/auth-profiles.json`
- 模型配置：`~/.openclaw/agents/main/agent/models.json`（可选）

---

## 后续优化

- [ ] 配置 fallback（GLM-5 作为备用）
- [ ] 测试工具调用是否正常
- [ ] 监控 token 消耗
- [ ] 评估是否需要降级

---

*由贾维斯自动生成*
