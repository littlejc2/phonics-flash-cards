// AI Provider Types
export type AIProvider = 'gemini' | 'deepseek';

// Model Types
export type GeminiModel =
  | 'gemini-2.5-pro-latest'
  | 'gemini-2.0-flash-exp'
  | 'gemini-1.5-flash-latest'
  | 'gemini-1.5-pro-latest'
  | 'gemini-1.0-pro';
export type DeepSeekModel = 'deepseek-chat' | 'deepseek-coder';

// Model Information
export const modelInfo = {
  gemini: {
    'gemini-2.5-pro-latest': {
      name: 'Gemini 2.5 Pro',
      description: '最新最强大的模型，顶级性能和理解能力',
      features: ['顶级性能', '最强推理', '多模态支持', '最新技术'],
      recommended: true
    },
    'gemini-2.0-flash-exp': {
      name: 'Gemini 2.0 Flash (实验版)',
      description: '新一代快速模型，平衡性能与速度',
      features: ['新一代技术', '快速响应', '实验性功能', '性能提升'],
      recommended: false
    },
    'gemini-1.5-flash-latest': {
      name: 'Gemini 1.5 Flash',
      description: '成熟快速模型，响应速度快，成本低',
      features: ['快速响应', '成本低', '适合日常使用', '稳定可靠'],
      recommended: false
    },
    'gemini-1.5-pro-latest': {
      name: 'Gemini 1.5 Pro',
      description: '成熟专业版模型，功能强大，质量高',
      features: ['高质量输出', '复杂推理', '多模态支持', '成熟稳定'],
      recommended: false
    },
    'gemini-1.0-pro': {
      name: 'Gemini 1.0 Pro',
      description: '经典稳定版本，兼容性最好',
      features: ['稳定可靠', '兼容性好', '经过验证', '成本最低'],
      recommended: false
    }
  },
  deepseek: {
    'deepseek-chat': {
      name: 'DeepSeek Chat',
      description: '通用对话模型，适合各种文本生成任务',
      features: ['通用性强', '中文优化', '对话能力强'],
      recommended: true
    },
    'deepseek-coder': {
      name: 'DeepSeek Coder',
      description: '专门针对代码和技术内容优化的模型',
      features: ['代码理解', '技术文档', '逻辑推理'],
      recommended: false
    }
  }
};

// Gemini Configuration
export const geminiConfig = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  baseUrl: import.meta.env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
  model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-pro-latest'
};

// DeepSeek Configuration
export const deepseekConfig = {
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  baseUrl: import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'
};

// Runtime configuration getters (with localStorage support)
export const getCurrentProvider = (): AIProvider => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('selected_ai_provider') as AIProvider;
    if (stored) return stored;
  }
  return (import.meta.env.VITE_AI_PROVIDER as AIProvider) || 'gemini';
};

export const getCurrentModel = (provider?: AIProvider): string => {
  const currentProvider = provider || getCurrentProvider();
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`${currentProvider}_model`);
    if (stored) return stored;
  }
  return currentProvider === 'deepseek' ? deepseekConfig.model : geminiConfig.model;
};

// Get current AI configuration
export const getCurrentAIConfig = () => {
  const provider = getCurrentProvider();
  const model = getCurrentModel(provider);
  const config = provider === 'deepseek' ? deepseekConfig : geminiConfig;
  return {
    ...config,
    model
  };
};

// Get available models for a provider
export const getAvailableModels = (provider: AIProvider) => {
  return Object.keys(modelInfo[provider]);
};

// Get model info
export const getModelInfo = (provider: AIProvider, model: string) => {
  return modelInfo[provider][model as keyof typeof modelInfo[typeof provider]];
};

// Legacy function for backward compatibility
export const getGeminiApiUrl = (endpoint: string) => {
  return `${geminiConfig.baseUrl}/${endpoint}?key=${geminiConfig.apiKey}`;
};

