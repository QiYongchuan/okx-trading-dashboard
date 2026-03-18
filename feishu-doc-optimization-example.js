/**
 * 飞书文档同步优化示例代码
 * 
 * 方案 C：直接读取文件 + create-doc（无需新权限）
 * 
 * 使用场景：
 * - 从本地 .md 文件创建飞书文档
 * - 减少 LLM token 消耗（LLM 不需要输出完整内容）
 */

const fs = require('fs');
const path = require('path');

/**
 * 示例 1：读取本地 Markdown 文件并创建飞书文档
 * 
 * @param {Object} params - 参数对象
 * @param {string} params.file_path - 本地 .md 文件路径
 * @param {string} params.title - 文档标题（可选，默认使用文件名）
 * @param {string} params.folder_token - 目标文件夹 token（可选）
 */
async function createDocFromFile(params) {
  const { file_path, title, folder_token } = params;
  
  // 1. 验证文件存在
  if (!fs.existsSync(file_path)) {
    throw new Error(`文件不存在: ${file_path}`);
  }
  
  // 2. 读取文件内容
  const markdown = fs.readFileSync(file_path, 'utf-8');
  
  // 3. 提取文件名作为默认标题
  const defaultTitle = path.basename(file_path, '.md');
  
  // 4. 调用现有的 create-doc 工具
  // 注意：这里假设你已经有 createDoc 函数的引用
  const result = await createDoc({
    title: title || defaultTitle,
    markdown: markdown,
    folder_token: folder_token
  });
  
  return result;
}

/**
 * 示例 2：批量导入多个 Markdown 文件
 * 
 * @param {Object} params - 参数对象
 * @param {string[]} params.file_paths - 本地 .md 文件路径数组
 * @param {string} params.folder_token - 目标文件夹 token（可选）
 * @param {number} params.concurrency - 并发数（默认 3，避免触发频率限制）
 */
async function batchCreateDocs(params) {
  const { file_paths, folder_token, concurrency = 3 } = params;
  
  const results = [];
  
  // 分批处理，避免触发 API 频率限制
  for (let i = 0; i < file_paths.length; i += concurrency) {
    const batch = file_paths.slice(i, i + concurrency);
    
    const batchResults = await Promise.all(
      batch.map(async (file_path) => {
        try {
          const result = await createDocFromFile({
            file_path,
            folder_token
          });
          return {
            success: true,
            file_path,
            doc_id: result.doc_id,
            doc_url: result.doc_url
          };
        } catch (error) {
          return {
            success: false,
            file_path,
            error: error.message
          };
        }
      })
    );
    
    results.push(...batchResults);
    
    // 批次之间等待 1 秒，避免频率限制
    if (i + concurrency < file_paths.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return {
    total: file_paths.length,
    success: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

/**
 * 示例 3：从目录导入所有 Markdown 文件
 * 
 * @param {Object} params - 参数对象
 * @param {string} params.directory - 目录路径
 * @param {string} params.folder_token - 目标文件夹 token（可选）
 * @param {boolean} params.recursive - 是否递归子目录（默认 false）
 */
async function importFromDirectory(params) {
  const { directory, folder_token, recursive = false } = params;
  
  // 1. 读取目录中的所有 .md 文件
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(directory, file));
  
  if (files.length === 0) {
    return {
      success: false,
      message: '目录中没有找到 .md 文件'
    };
  }
  
  console.log(`找到 ${files.length} 个 Markdown 文件`);
  
  // 2. 批量导入
  const result = await batchCreateDocs({
    file_paths: files,
    folder_token,
    concurrency: 3
  });
  
  return result;
}

// ============================================================================
// 使用示例
// ============================================================================

/**
 * 示例：在 OpenClaw 中集成新工具
 * 
 * 在 ~/.openclaw/extensions/openclaw-lark/src/tools/oapi/ 下创建新文件：
 * feishu-create-doc-from-file.js
 */

// 新工具的 Schema 定义
const CreateDocFromFileSchema = {
  type: 'object',
  properties: {
    file_path: {
      type: 'string',
      description: '本地 .md 文件路径'
    },
    title: {
      type: 'string',
      description: '文档标题（可选，默认使用文件名）'
    },
    folder_token: {
      type: 'string',
      description: '目标文件夹 token（可选）'
    }
  },
  required: ['file_path']
};

// 新工具的注册函数
async function registerCreateDocFromFileTool(api) {
  api.registerTool({
    name: 'feishu_create_doc_from_file',
    description: '从本地 Markdown 文件创建飞书云文档（避免 LLM 输出完整内容）',
    schema: CreateDocFromFileSchema,
    handler: async (params) => {
      const { file_path, title, folder_token } = params;
      
      // 读取文件
      const markdown = fs.readFileSync(file_path, 'utf-8');
      const defaultTitle = path.basename(file_path, '.md');
      
      // 调用现有 create-doc
      // 注意：这里需要通过 MCP 调用
      const result = await api.callMcpTool('create-doc', {
        title: title || defaultTitle,
        markdown,
        folder_token
      });
      
      return result;
    }
  });
}

// ============================================================================
// 导出
// ============================================================================

module.exports = {
  createDocFromFile,
  batchCreateDocs,
  importFromDirectory,
  registerCreateDocFromFileTool
};

// ============================================================================
// 实际使用示例（假设在 OpenClaw 中）
// ============================================================================

/*
// 用户请求：将 ~/Notes/2026-03-17.md 同步到飞书

// 旧方式（需要 LLM 输出完整内容）：
await createDoc({
  title: '2026-03-17',
  markdown: `# 2026-03-17 日记

今天天气不错...

（LLM 需要输出完整内容，消耗大量 token）
`
});

// 新方式（直接传文件路径）：
await createDocFromFile({
  file_path: '/Users/qyc/Notes/2026-03-17.md'
  // LLM 只需要输出这个工具调用，不需要输出完整内容
});

// 批量导入示例：
await batchCreateDocs({
  file_paths: [
    '/Users/qyc/Notes/2026-03-15.md',
    '/Users/qyc/Notes/2026-03-16.md',
    '/Users/qyc/Notes/2026-03-17.md'
  ],
  folder_token: 'fldbcO1UuPz8VwnpPx5a92abcef',
  concurrency: 3
});

// 从目录导入示例：
await importFromDirectory({
  directory: '/Users/qyc/Notes',
  folder_token: 'fldbcO1UuPz8VwnpPx5a92abcef',
  recursive: false
});
*/
