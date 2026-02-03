import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Key, ExternalLink, Save, RefreshCw, Cpu } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AIProvider } from '@/config/gemini';
import { getAvailableModels, getModelInfo, getCurrentModel } from '@/config/gemini';

interface APIKeyManagerProps {
  onKeysUpdated?: () => void;
}

interface APIKeyConfig {
  key: string;
  isVisible: boolean;
  isValid: boolean;
  model: string;
  baseUrl?: string;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onKeysUpdated }) => {
  const [geminiConfig, setGeminiConfig] = useState<APIKeyConfig>({
    key: '',
    isVisible: false,
    isValid: false,
    model: 'gemini-3-pro-preview',
    baseUrl: ''
  });

  const [deepseekConfig, setDeepseekConfig] = useState<APIKeyConfig>({
    key: '',
    isVisible: false,
    isValid: false,
    model: 'deepseek-chat'
  });

  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('gemini');
  const [isSaving, setIsSaving] = useState(false);

  // 调试：监听selectedProvider变化
  useEffect(() => {
    console.log('selectedProvider changed to:', selectedProvider);
  }, [selectedProvider]);

  // API密钥验证函数
  const validateAPIKey = (provider: AIProvider, key: string): boolean => {
    const trimmedKey = key.trim();

    if (!trimmedKey || trimmedKey.length < 10) {
      return false;
    }

    // 检查是否是占位符
    if (trimmedKey.includes('your_') || trimmedKey.includes('_here')) {
      return false;
    }

    // 提供商特定的格式检查
    if (provider === 'gemini') {
      return trimmedKey.startsWith('AIza') && trimmedKey.length > 20;
    } else if (provider === 'deepseek') {
      return trimmedKey.startsWith('sk-') && trimmedKey.length > 20;
    }

    return trimmedKey.length > 10;
  };

  // 从localStorage加载已保存的API密钥和模型
  useEffect(() => {
    // 从localStorage加载已保存的API密钥和模型
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedDeepseekKey = localStorage.getItem('deepseek_api_key') || '';
    const savedGeminiBaseUrl = localStorage.getItem('gemini_base_url') || '';
    
    // 获取保存的模型，如果不存在或无效，则使用默认值
    let savedGeminiModel = localStorage.getItem('gemini_model');
    const availableGeminiModels = getAvailableModels('gemini');
    if (!savedGeminiModel || !availableGeminiModels.includes(savedGeminiModel)) {
      savedGeminiModel = 'gemini-3-pro-preview';
    }

    let savedDeepseekModel = localStorage.getItem('deepseek_model');
    const availableDeepseekModels = getAvailableModels('deepseek');
    if (!savedDeepseekModel || !availableDeepseekModels.includes(savedDeepseekModel)) {
      savedDeepseekModel = 'deepseek-chat';
    }

    const savedProvider = (localStorage.getItem('selected_ai_provider') as AIProvider) || 'gemini';

    setGeminiConfig(prev => ({
      ...prev,
      key: savedGeminiKey,
      isValid: validateAPIKey('gemini', savedGeminiKey),
      model: savedGeminiModel || 'gemini-3-pro-preview',
      baseUrl: savedGeminiBaseUrl
    }));

    setDeepseekConfig(prev => ({
      ...prev,
      key: savedDeepseekKey,
      isValid: validateAPIKey('deepseek', savedDeepseekKey),
      model: savedDeepseekModel || 'deepseek-chat'
    }));

    setSelectedProvider(savedProvider);
  }, []);

  const toggleVisibility = (provider: AIProvider) => {
    if (provider === 'gemini') {
      setGeminiConfig(prev => ({ ...prev, isVisible: !prev.isVisible }));
    } else {
      setDeepseekConfig(prev => ({ ...prev, isVisible: !prev.isVisible }));
    }
  };

  const updateKey = (provider: AIProvider, key: string) => {
    const isValid = validateAPIKey(provider, key);

    console.log('updateKey called:', { provider, key: key.substring(0, 10) + '...', isValid });

    if (provider === 'gemini') {
      setGeminiConfig(prev => {
        const newConfig = { ...prev, key, isValid };
        console.log('Updating Gemini config:', newConfig);
        return newConfig;
      });
    } else {
      setDeepseekConfig(prev => {
        const newConfig = { ...prev, key, isValid };
        console.log('Updating DeepSeek config:', newConfig);
        return newConfig;
      });
    }
  };

  const updateModel = (provider: AIProvider, model: string) => {
    if (provider === 'gemini') {
      setGeminiConfig(prev => ({ ...prev, model }));
    } else {
      setDeepseekConfig(prev => ({ ...prev, model }));
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);

    console.log('saveConfiguration called with:', {
      gemini: geminiConfig.key.substring(0, 10) + '...',
      deepseek: deepseekConfig.key.substring(0, 10) + '...',
      selectedProvider
    });

    try {
      // 保存到localStorage
      if (geminiConfig.key.trim()) {
        localStorage.setItem('gemini_api_key', geminiConfig.key.trim());
        console.log('Saved Gemini key to localStorage:', geminiConfig.key.substring(0, 10) + '...');
      } else {
        localStorage.removeItem('gemini_api_key');
        console.log('Removed Gemini key from localStorage');
      }

      if (deepseekConfig.key.trim()) {
        localStorage.setItem('deepseek_api_key', deepseekConfig.key.trim());
        console.log('Saved DeepSeek key to localStorage:', deepseekConfig.key.substring(0, 10) + '...');
      } else {
        localStorage.removeItem('deepseek_api_key');
        console.log('Removed DeepSeek key from localStorage');
      }

      // 保存模型选择
      localStorage.setItem('gemini_model', geminiConfig.model);
      localStorage.setItem('deepseek_model', deepseekConfig.model);
      localStorage.setItem('selected_ai_provider', selectedProvider);
      
      // 保存Gemini Base URL
      if (geminiConfig.baseUrl) {
        localStorage.setItem('gemini_base_url', geminiConfig.baseUrl.trim());
      } else {
        localStorage.removeItem('gemini_base_url');
      }

      // 更新全局配置（通过重新加载页面或事件）
      if (onKeysUpdated) {
        onKeysUpdated();
      }

      toast.success('API密钥配置已保存！', {
        description: '配置将在下次API调用时生效'
      });

      // 提示用户刷新页面以应用新配置
      setTimeout(() => {
        if (confirm('配置已保存！是否刷新页面以应用新配置？')) {
          window.location.reload();
        }
      }, 1000);

    } catch (error) {
      toast.error('保存配置失败', {
        description: error instanceof Error ? error.message : '未知错误'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const clearConfiguration = () => {
    if (confirm('确定要清除所有API密钥配置吗？')) {
      localStorage.removeItem('gemini_api_key');
      localStorage.removeItem('deepseek_api_key');
      localStorage.removeItem('gemini_model');
      localStorage.removeItem('deepseek_model');
      localStorage.removeItem('selected_ai_provider');
      localStorage.removeItem('gemini_base_url');

      setGeminiConfig({ key: '', isVisible: false, isValid: false, model: 'gemini-3-pro-preview', baseUrl: '' });
      setDeepseekConfig({ key: '', isVisible: false, isValid: false, model: 'deepseek-chat' });
      setSelectedProvider('gemini');

      toast.success('配置已清除');
    }
  };

  const getProviderInfo = (provider: AIProvider) => {
    switch (provider) {
      case 'gemini':
        return {
          name: 'Google Gemini',
          description: 'Google的先进AI模型，支持多模态理解',
          signupUrl: 'https://makersuite.google.com/app/apikey',
          keyFormat: 'AIza...',
          features: ['免费额度较高', '多模态支持', '响应质量高'],
          requirements: '需要科学上网'
        };
      case 'deepseek':
        return {
          name: 'DeepSeek',
          description: '国产优秀AI模型，性价比高',
          signupUrl: 'https://platform.deepseek.com/',
          keyFormat: 'sk-...',
          features: ['国内直连', '性价比高', '中文理解优秀'],
          requirements: '无需科学上网'
        };
    }
  };

  const hasValidKey = geminiConfig.isValid || deepseekConfig.isValid;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          API 密钥管理
        </CardTitle>
        <CardDescription>
          配置AI提供商的API密钥以使用单词生成功能
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as AIProvider)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              Google Gemini
              {geminiConfig.isValid && <Badge variant="default" className="text-xs">已配置</Badge>}
            </TabsTrigger>
            <TabsTrigger value="deepseek" className="flex items-center gap-2">
              DeepSeek
              {deepseekConfig.isValid && <Badge variant="default" className="text-xs">已配置</Badge>}
            </TabsTrigger>
          </TabsList>

          {(['gemini', 'deepseek'] as AIProvider[]).map((provider) => {
            const config = provider === 'gemini' ? geminiConfig : deepseekConfig;
            const info = getProviderInfo(provider);
            
            return (
              <TabsContent key={provider} value={provider} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 提供商信息 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{info.name}</h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">特点：</h4>
                      <ul className="text-sm space-y-1">
                        {info.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600">
                        <strong>访问要求：</strong> {info.requirements}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(info.signupUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      获取API密钥
                    </Button>
                  </div>

                  {/* API密钥配置 */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${provider}-key`}>API 密钥</Label>
                      <div className="relative">
                        <Input
                          id={`${provider}-key`}
                          type={config.isVisible ? 'text' : 'password'}
                          value={config.key}
                          onChange={(e) => {
                            console.log(`Input onChange for ${provider}:`, e.target.value.substring(0, 10) + '...');
                            updateKey(provider, e.target.value);
                          }}
                          placeholder={`输入${info.name} API密钥 (${info.keyFormat})`}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => toggleVisibility(provider)}
                        >
                          {config.isVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      {config.key && (
                        <div className="flex items-center gap-2">
                          <Badge variant={config.isValid ? "default" : "destructive"}>
                            {config.isValid ? "✓ 格式正确" : "✗ 格式错误"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Gemini Base URL (Only for Gemini) */}
                    {provider === 'gemini' && (
                      <div className="space-y-2">
                        <Label htmlFor="gemini-base-url">代理地址 (可选)</Label>
                        <Input
                          id="gemini-base-url"
                          type="text"
                          value={geminiConfig.baseUrl || ''}
                          onChange={(e) => setGeminiConfig({ ...geminiConfig, baseUrl: e.target.value })}
                          placeholder="例如: https://my-proxy.com (默认为 Google 官方 API)"
                        />
                        <p className="text-xs text-gray-500">
                          如果你在中国大陆且没有系统级代理，可以配置反向代理地址。
                        </p>
                      </div>
                    )}

                    {/* 模型选择 */}
                    <div className="space-y-2">
                      <Label htmlFor={`${provider}-model`}>
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          模型选择
                        </div>
                      </Label>
                      <Select
                        value={config.model}
                        onValueChange={(value) => updateModel(provider, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择模型" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableModels(provider).map((model) => {
                            const modelInfo = getModelInfo(provider, model);
                            if (!modelInfo) return null; // Add safety check
                            return (
                              <SelectItem key={model} value={model}>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span>{modelInfo.name}</span>
                                    {modelInfo.recommended && (
                                      <Badge variant="default" className="text-xs">推荐</Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500">{modelInfo.description}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {/* 模型特性显示 */}
                      {config.model && getModelInfo(provider, config.model) && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600">
                            <strong>特性：</strong>
                            {getModelInfo(provider, config.model).features.map((feature, index) => (
                              <span key={index} className="ml-1">
                                {feature}{index < getModelInfo(provider, config.model).features.length - 1 ? '、' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* 操作按钮 */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={clearConfiguration}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            清除配置
          </Button>
          
          <Button
            onClick={saveConfiguration}
            disabled={isSaving || !hasValidKey}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存配置
              </>
            )}
          </Button>
        </div>

        {/* 状态提示 */}
        {!hasValidKey && (
          <Alert>
            <Key className="w-4 h-4" />
            <AlertDescription>
              请至少配置一个AI提供商的API密钥才能使用单词生成功能。
            </AlertDescription>
          </Alert>
        )}

        {hasValidKey && (
          <Alert>
            <AlertDescription className="text-green-700">
              ✅ 配置完成！当前可用的AI提供商：
              {geminiConfig.isValid && <Badge variant="outline" className="ml-2">Gemini</Badge>}
              {deepseekConfig.isValid && <Badge variant="outline" className="ml-2">DeepSeek</Badge>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default APIKeyManager;
