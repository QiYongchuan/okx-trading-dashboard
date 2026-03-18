# 🧠 mem9.ai 使用指南

> 为 OpenClaw 提供无限记忆的基础设施

---

## 一、mem9 是什么？

**核心功能：**
- 云端持久化记忆
- 跨会话、跨设备、跨机器保持
- 混合搜索（关键词 + 向量）
- 跨 Agent 共享

**解决的问题：**
- Agent 每次会话都"失忆"
- 本地记忆文件容易丢失
- 换机器后记忆不跟随
- 多个 Agent 无法共享记忆

---

## 二、核心工具

| 工具 | 功能 |
|------|------|
| `memory_store` | 存储事实、决策、上下文 |
| `memory_search` | 关键词 + 语义搜索 |
| `memory_get` | 按 ID 检索 |
| `memory_update` | 修改已有记忆 |
| `memory_delete` | 删除记忆 |

**自动生命周期钩子：**

| 钩子 | 触发时机 | 作用 |
|------|---------|------|
| `before_prompt_build` | 每次 LLM 调用 | 自动注入相关记忆 |
| `before_reset` | 重置前 | 自动保存会话摘要 |
| `agent_end` | Agent 结束 | 捕获最后响应 |

---

## 三、安装步骤

### Step 0：选择模式

1. **创建新的 API Key**（首次使用）
2. **重新连接现有 API Key**（已有账号）

### Step 1：创建 API Key

```bash
curl -sX POST https://api.mem9.ai/v1alpha1/mem9s | jq .
```

返回：
```json
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**保存这个 ID！** 这是你的 API Key，也是你的秘密。

### Step 2：安装插件

```bash
npm install -g @mem9/plugin-openclaw
```

### Step 3：配置 OpenClaw

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "plugins": {
    "mem9": {
      "enabled": true,
      "apiKey": "你的API-Key"
    }
  }
}
```

### Step 4：重启 OpenClaw

```bash
openclaw gateway restart
```

### Step 5：验证安装

```bash
openclaw doctor
```

---

## 四、使用方法

### 存储记忆

**触发词：**
- "remember this"
- "save this for later"
- "don't forget that..."

**示例：**
```
用户：记住，我最喜欢用的模型是 zai/glm-5
贾维斯：好的，我已经记住了。
```

### 搜索记忆

**触发词：**
- "what did I say about..."
- "recall my preferences"
- "上次会议我们讨论了什么"

### 删除记忆

**触发词：**
- "forget that"
- "删除这条记忆"

---

## 五、适合存储的内容

**✅ 推荐：**
- 用户偏好
- 项目上下文
- 重要决策
- 长期指令

**❌ 不推荐：**
- 临时调试信息
- 大文件/数据
- 密码/API Key
- 敏感信息

---

## 六、安全提示

⚠️ **API Key 是秘密！**
- 任何人拥有它都可以访问你的记忆
- 不要分享给任何人
- 保存在安全的地方

**如果 API Key 泄露：**
1. 创建新的 API Key
2. 更新 OpenClaw 配置
3. 删除旧的 API Key（如果有管理界面）

---

## 七、与本地记忆的关系

| 特性 | 本地记忆（MEMORY.md） | mem9 |
|------|---------------------|------|
| **持久性** | 依赖本地文件 | 云端持久化 |
| **跨设备** | ❌ | ✅ |
| **搜索** | 手动/语义搜索 | 混合搜索 |
| **共享** | ❌ | ✅ |
| **隐私** | 完全本地 | 云端存储 |

**建议：**
- 敏感信息 → 本地记忆
- 通用知识 → mem9
- 两者结合使用

---

## 八、常见问题

### Q: mem9 会替代 MEMORY.md 吗？

A: 不完全替代。建议：
- **MEMORY.md**：存储敏感信息、原则、长期目标
- **mem9**：存储日常对话、决策、偏好

### Q: 换机器后怎么恢复记忆？

A: 只需在新机器上：
1. 安装 mem9 插件
2. 配置相同的 API Key
3. 重启 OpenClaw

### Q: 多个 Agent 可以共享记忆吗？

A: 可以！只要使用相同的 API Key，所有 Agent 都能访问同一个记忆空间。

---

## 九、对 Kevin 的价值

**短期价值：**
- 解决"每次对话都失忆"的问题
- 跨设备访问（Mac mini + 其他设备）

**中期价值：**
- 积累有价值的对话内容
- 建立"知识库"

**长期价值：**
- 成为真正的"数字管家"
- 记住所有重要决策和偏好

---

*最后更新：2026-03-16*
*来源：https://mem9.ai/SKILL.md*
