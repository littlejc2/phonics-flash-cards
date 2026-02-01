# AI API 配置指南

本项目支持两种AI提供商：Google Gemini 和 DeepSeek。你可以配置其中一种或两种，并在使用时进行切换。

## 🚀 快速配置

### 1. 环境变量配置

编辑 `.env.local` 文件，配置你想使用的AI提供商：

```bash
# AI Provider Configuration
# Choose which AI provider to use: 'gemini' or 'deepseek'
VITE_AI_PROVIDER=gemini

# Gemini API Configuration
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
VITE_GEMINI_MODEL=gemini-1.5-flash-latest

# DeepSeek API Configuration
VITE_DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
VITE_DEEPSEEK_MODEL=deepseek-chat
```

### 2. Supabase Edge Function 环境变量

在你的 Supabase 项目中设置以下环境变量：

```bash
# 在 Supabase Dashboard > Settings > Edge Functions > Environment Variables 中添加
GEMINI_API_KEY=your_actual_gemini_api_key_here
DEEPSEEK_API_KEY=your_actual_deepseek_api_key_here
```

## 🔑 获取 API 密钥

### Google Gemini API

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录你的 Google 账户
3. 点击 "Create API Key"
4. 复制生成的 API 密钥
5. 将密钥粘贴到 `VITE_GEMINI_API_KEY` 和 `GEMINI_API_KEY`

**特点：**
- ✅ 免费额度较高
- ✅ 多模态支持
- ✅ 响应质量高
- ❌ 需要科学上网

### DeepSeek API

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账户
3. 进入 API Keys 页面
4. 创建新的 API 密钥
5. 将密钥粘贴到 `VITE_DEEPSEEK_API_KEY` 和 `DEEPSEEK_API_KEY`

**特点：**
- ✅ 国产模型，访问稳定
- ✅ 性价比高
- ✅ 中文理解能力强
- ✅ 无需科学上网

## 🔄 切换 AI 提供商

### 方法1：修改环境变量

在 `.env.local` 中修改 `VITE_AI_PROVIDER`：

```bash
# 使用 Gemini
VITE_AI_PROVIDER=gemini

# 或使用 DeepSeek
VITE_AI_PROVIDER=deepseek
```

### 方法2：在界面中切换

项目提供了 `AIProviderSelector` 组件，可以在界面上动态切换提供商。

## 📁 项目结构

```
src/
├── config/
│   └── gemini.ts          # AI 配置文件
├── lib/
│   ├── ai-client.ts       # 统一 AI 客户端
│   └── gemini-client.ts   # 兼容性包装器
├── components/
│   ├── AIProviderSelector.tsx  # AI 提供商选择器
│   └── SimpleWordForm.tsx      # 单词表单（已集成选择器）
└── ...

supabase/
└── functions/
    └── generate-word-data/
        └── index.ts       # Edge Function（支持双提供商）
```

## 🛠️ 开发说明

### 使用统一 AI 客户端

```typescript
import { generateWordData, isAIConfigured } from '@/lib/ai-client';

// 使用默认提供商
const result = await generateWordData('hello');

// 指定提供商
const result = await generateWordData('hello', 'deepseek');

// 检查配置状态
const isGeminiReady = isAIConfigured('gemini');
const isDeepSeekReady = isAIConfigured('deepseek');
```

### 添加新的 AI 提供商

1. 在 `src/config/gemini.ts` 中添加新的提供商类型
2. 在 `src/lib/ai-client.ts` 中实现新的客户端类
3. 更新 `AIProviderSelector` 组件
4. 更新 Supabase Edge Function

## 🔍 故障排除

### 常见问题

1. **API 密钥无效**
   - 检查密钥是否正确复制
   - 确认密钥没有过期
   - 检查 API 配额是否用完

2. **网络连接问题**
   - Gemini API 可能需要科学上网
   - DeepSeek API 在国内可直接访问

3. **环境变量未生效**
   - 重启开发服务器
   - 检查 `.env.local` 文件格式
   - 确认变量名拼写正确

### 调试方法

1. 检查浏览器控制台的错误信息
2. 查看 Supabase Edge Function 日志
3. 使用 `isAIConfigured()` 函数检查配置状态

## 📊 成本对比

| 提供商 | 免费额度 | 付费价格 | 访问要求 |
|--------|----------|----------|----------|
| Gemini | 较高 | 较低 | 需科学上网 |
| DeepSeek | 中等 | 很低 | 国内直连 |

## 🎯 推荐配置

- **开发环境**：推荐使用 DeepSeek（稳定访问）
- **生产环境**：可配置双提供商，提供备选方案
- **海外用户**：推荐 Gemini（性能更好）
- **国内用户**：推荐 DeepSeek（访问稳定）

配置完成后，重启开发服务器即可开始使用！🎉
