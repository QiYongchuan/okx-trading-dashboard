---
name: claude-code-executor
description: "使用 Claude Code CLI 或 Codex CLI 执行编程任务。当用户要求写代码、修复 bug、重构代码时自动使用此技能。"
version: "1.0.0"
---

# Claude Code Executor - 编程任务执行器

自动调用 Claude Code CLI 或 Codex CLI 执行编程任务。

---

## 🎯 触发条件

当用户说以下内容时自动触发：
- "帮我写..."、"用 cc..."、"写一个脚本..."
- "修复这个 bug"、"重构代码"
- "实现 xxx 功能"、"添加 xxx 功能"
- 任何与编程、代码相关的请求

---

## 🛠️ 工具选择

### Claude Code CLI（默认）
- **位置**：`/Users/qyc/.npm-global/bin/claude`
- **模型**：Claude Opus 4 / Sonnet 4
- **优势**：长上下文、理解能力强、支持复杂任务
- **适用场景**：复杂编程、架构设计、代码审查

### Codex CLI（可选）
- **位置**：`/Users/qyc/.npm-global/bin/codex`（已安装）
- **模型**：GPT-5.2 / Codex
- **优势**：OpenAI 生态、快速响应
- **适用场景**：快速原型、简单脚本

---

## 📋 工作流程

### 方案 1：本地执行（简单任务）

```bash
# 用户说："帮我写一个 Python 脚本，监控目录变化"
claude "写一个 Python 脚本，监控 ~/Documents 目录的变化，记录到日志文件"
```

**适用**：
- 简单脚本
- 快速原型
- 一次性任务

---

### 方案 2：ACP 隔离执行（复杂任务）

```javascript
// 用户说："重构 ~/myproject 的代码结构"
sessions_spawn({
  runtime: "acp",
  agentId: "claude-code",
  task: "重构 ~/myproject 的代码结构，优化模块划分"
})
```

**适用**：
- 复杂重构
- 大型项目
- 长时间任务

---

### 方案 3：混合执行（最灵活）

**判断逻辑**：
1. 如果任务涉及文件修改 > 10 个 → ACP 隔离
2. 如果任务预计时间 > 5 分钟 → ACP 隔离
3. 否则 → 本地执行

---

## 🔧 使用示例

### 示例 1：简单脚本

**用户**：帮我写一个 Python 脚本，批量重命名文件

**执行**：
```bash
claude "写一个 Python 脚本，批量重命名当前目录下的所有 .txt 文件，添加日期前缀"
```

**返回**：
```
✅ 脚本已生成：

```python
import os
from datetime import datetime

# 批量重命名 .txt 文件
for file in os.listdir('.'):
    if file.endswith('.txt'):
        date_prefix = datetime.now().strftime('%Y%m%d_')
        new_name = date_prefix + file
        os.rename(file, new_name)
        print(f'Renamed: {file} -> {new_name}')
```

保存为：rename_files.py
运行方式：python rename_files.py
```

---

### 示例 2：复杂重构

**用户**：重构一下我的 Obsidian 笔记目录结构

**执行**：
```javascript
sessions_spawn({
  runtime: "acp",
  agentId: "claude-code",
  task: "重构 ~/Documents/Obsidian 目录结构，按照 GTD 方法组织",
  label: "Obsidian 重构"
})
```

**返回**：
```
✅ 重构任务已提交，预计需要 10 分钟

任务 ID：task-xxx-xxx
进度追踪：我会持续监控并在完成后通知你
```

---

## ⚙️ 配置

### 环境变量

```bash
# Claude Code
export ANTHROPIC_API_KEY="your-key-here"

# Codex
export OPENAI_API_KEY="your-key-here"
```

### ACP 配置

在 `openclaw.json` 中添加：
```json
{
  "acp": {
    "allowedAgents": ["claude-code", "codex"],
    "defaultAgent": "claude-code"
  }
}
```

---

## 🚀 快速开始

### 第一次使用

1. **测试 Claude Code CLI**
   ```bash
   claude "print hello world in python"
   ```

2. **测试 Codex CLI**
   ```bash
   codex "print hello world in python"
   ```

3. **测试飞书触发**
   在飞书发消息："帮我写一个 Python 脚本，列出当前目录所有 .md 文件"

---

## 📊 性能对比

| 维度 | Claude Code | Codex |
|------|------------|-------|
| **上下文长度** | 200k tokens | 128k tokens |
| **理解能力** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **响应速度** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **复杂任务** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **简单脚本** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**推荐**：
- 复杂任务 → Claude Code
- 简单脚本 → Codex（或 Claude Code 都行）

---

## 💡 最佳实践

### 1. 清晰描述需求
❌ 不好："帮我写个脚本"
✅ 好："写一个 Python 脚本，监控 ~/Documents 目录，记录所有新增的 .md 文件到 log.txt"

### 2. 指定技术栈
❌ 不好："写一个 web 界面"
✅ 好："用 React + TypeScript 写一个登录界面"

### 3. 分步骤执行
对于大型任务，拆分为多个小任务：
1. "先帮我设计数据库 schema"
2. "然后写 API 接口"
3. "最后写前端界面"

---

## 🐛 常见问题

### Q1: Codex CLI 报错 "API key not found"
**A**: 需要设置 `OPENAI_API_KEY` 环境变量

### Q2: Claude Code CLI 响应很慢
**A**: 复杂任务需要更多时间，考虑使用 ACP 隔离执行

### Q3: 如何查看任务进度？
**A**: 使用 `sessions_history` 工具查看

---

## 🔄 更新日志

### v1.0.0 (2026-03-17)
- ✅ 初始版本
- ✅ 支持 Claude Code CLI
- ✅ 支持 Codex CLI
- ✅ 支持本地执行
- ✅ 支持 ACP 隔离执行

---

*创建时间：2026-03-17*
*作者：贾维斯*
