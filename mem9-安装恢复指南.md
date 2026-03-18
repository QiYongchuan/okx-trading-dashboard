# mem9 安装恢复指南

> 创建时间：2026-03-17 04:14 PDT
> 目的：万一重启失败，按照此文档恢复 OpenClaw

---

## 一、修改了哪些配置？

### 1. 安装了 mem9 插件

```bash
# 插件位置
~/.openclaw/extensions/mem9/

# 安装命令（已执行）
openclaw plugins install @mem9/mem9
```

### 2. 修改了 openclaw.json

**修改内容**：
```json
{
  "plugins": {
    "slots": {
      "memory": "mem9"  // 从 "memory-core" 改为 "mem9"
    },
    "entries": {
      "mem9": {
        "enabled": true,
        "config": {
          "apiUrl": "https://api.mem9.ai",
          "apiKey": "ae9e7025-555d-4d37-9c06-088a7d6f1e4d"
        }
      },
      "memory-core": {
        "enabled": false  // 被禁用
      }
    },
    "allow": ["mem9", "openclaw-lark", "telegram"]
  }
}
```

### 3. 创建了 mem9 API key

```
API Key: ae9e7025-555d-4d37-9c06-088a7d6f1e4d
```

⚠️ **重要**：这个 key 是你的记忆空间唯一凭证，丢了就无法恢复记忆！

---

## 二、备份文件位置

```bash
# 配置文件备份
~/.openclaw/openclaw.json.mem9-backup

# 自动备份（OpenClaw自动创建）
~/.openclaw/openclaw.json.bak
```

---

## 三、重启失败时的恢复步骤

### 场景1：Gateway 启动失败

**症状**：
```bash
openclaw gateway status
# 显示 stopped 或 error
```

**恢复步骤**：

```bash
# Step 1: 恢复配置文件
cp ~/.openclaw/openclaw.json.mem9-backup ~/.openclaw/openclaw.json

# Step 2: 卸载 mem9 插件
rm -rf ~/.openclaw/extensions/mem9

# Step 3: 重启 Gateway
openclaw gateway restart

# Step 4: 检查状态
openclaw status
```

### 场景2：插件加载错误

**症状**：
```bash
openclaw logs
# 显示 mem9 plugin error
```

**恢复步骤**：

```bash
# Step 1: 编辑配置，禁用 mem9
jq '.plugins.entries.mem9.enabled = false | .plugins.slots.memory = "memory-core"' ~/.openclaw/openclaw.json > /tmp/config.json && mv /tmp/config.json ~/.openclaw/openclaw.json

# Step 2: 重启
openclaw gateway restart
```

### 场景3：完全无法启动

**症状**：所有命令都报错

**恢复步骤**：

```bash
# Step 1: 停止服务
openclaw gateway stop

# Step 2: 恢复到安装 mem9 之前的状态
cp ~/.openclaw/openclaw.json.mem9-backup ~/.openclaw/openclaw.json
rm -rf ~/.openclaw/extensions/mem9

# Step 3: 重新安装（如果需要）
npm install -g openclaw@latest

# Step 4: 重新配置
openclaw configure

# Step 5: 启动
openclaw gateway start
```

---

## 四、手动恢复命令汇总

### 完全回滚到 mem9 安装前

```bash
# 1. 恢复配置
cp ~/.openclaw/openclaw.json.mem9-backup ~/.openclaw/openclaw.json

# 2. 删除 mem9 插件
rm -rf ~/.openclaw/extensions/mem9

# 3. 重启 Gateway
openclaw gateway restart

# 4. 验证
openclaw status
```

### 只禁用 mem9（保留插件）

```bash
# 1. 禁用 mem9，恢复 memory-core
jq '.plugins.entries.mem9.enabled = false | .plugins.slots.memory = "memory-core"' ~/.openclaw/openclaw.json > /tmp/config.json && mv /tmp/config.json ~/.openclaw/openclaw.json

# 2. 重启
openclaw gateway restart
```

---

## 五、验证 mem9 是否正常工作

重启成功后，在 Telegram 或飞书发消息测试：

```
你: Hi，测试 mem9
我: → 应该正常回复
```

然后检查 mem9 是否加载：

```bash
# 检查插件状态
openclaw status --deep | grep -A 5 mem9

# 测试 mem9 API
curl -s -H "X-API-Key: ae9e7025-555d-4d37-9c06-088a7d6f1e4d" \
  "https://api.mem9.ai/v1alpha2/mem9s/memories?limit=5"
```

---

## 六、mem9 API Key 备份

```
API Key: ae9e7025-555d-4d37-9c06-088a7d6f1e4d

用途：
- 连接到你的云端记忆空间
- 任何设备用这个 key 都能访问同一份记忆
- 丢了就无法恢复

保存位置建议：
1. 密码管理器（1Password、Bitwarden）
2. 安全笔记
3. 不要分享给任何人
```

---

## 七、如果需要重新安装 mem9

```bash
# 1. 安装插件
openclaw plugins install @mem9/mem9

# 2. 配置（使用同一个 API key）
jq '.plugins.slots.memory = "mem9" | .plugins.entries.mem9 = {enabled: true, config: {apiUrl: "https://api.mem9.ai", apiKey: "ae9e7025-555d-4d37-9c06-088a7d6f1e4d"}}' ~/.openclaw/openclaw.json > /tmp/config.json && mv /tmp/config.json ~/.openclaw/openclaw.json

# 3. 重启
openclaw gateway restart
```

---

## 八、联系支持

如果以上方法都无法恢复：

1. **OpenClaw 官方文档**：https://docs.openclaw.ai
2. **OpenClaw 社区**：https://discord.com/invite/clawd
3. **GitHub Issues**：https://github.com/openclaw/openclaw/issues

---

*创建者：贾维斯*
*创建时间：2026-03-17 04:14 PDT*
*目的：mem9 安装恢复指南*
