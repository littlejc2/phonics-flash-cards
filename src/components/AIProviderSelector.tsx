import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentProvider, type AIProvider } from '@/config/gemini';
import { getAvailableProviders, isAIConfigured } from '@/lib/ai-client';
import { Brain, Zap, Settings } from 'lucide-react';

interface AIProviderSelectorProps {
  onProviderChange?: (provider: AIProvider) => void;
  showStatus?: boolean;
}

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ 
  onProviderChange, 
  showStatus = true 
}) => {
  const currentProvider = getCurrentProvider();
  const availableProviders = getAvailableProviders();

  const handleProviderChange = (value: string) => {
    const provider = value as AIProvider;
    onProviderChange?.(provider);
    
    // Note: In a real app, you might want to update the environment variable
    // or store the preference in localStorage/database
    console.log(`Switched to ${provider} provider`);
  };

  const getProviderInfo = (provider: AIProvider) => {
    switch (provider) {
      case 'gemini':
        return {
          name: 'Google Gemini',
          description: 'Google的先进AI模型，支持多模态理解',
          icon: <Brain className="w-4 h-4" />,
          color: 'bg-blue-500'
        };
      case 'deepseek':
        return {
          name: 'DeepSeek',
          description: '国产优秀AI模型，性价比高',
          icon: <Zap className="w-4 h-4" />,
          color: 'bg-purple-500'
        };
      default:
        return {
          name: provider,
          description: '未知提供商',
          icon: <Settings className="w-4 h-4" />,
          color: 'bg-gray-500'
        };
    }
  };

  const currentProviderInfo = getProviderInfo(currentProvider);

  if (!showStatus) {
    return (
      <Select value={currentProvider} onValueChange={handleProviderChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择AI提供商" />
        </SelectTrigger>
        <SelectContent>
          {(['gemini', 'deepseek'] as AIProvider[]).map((provider) => {
            const info = getProviderInfo(provider);
            const isConfigured = isAIConfigured(provider);
            
            return (
              <SelectItem 
                key={provider} 
                value={provider}
                disabled={!isConfigured}
              >
                <div className="flex items-center gap-2">
                  {info.icon}
                  <span>{info.name}</span>
                  {!isConfigured && (
                    <Badge variant="secondary" className="text-xs">
                      未配置
                    </Badge>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          AI 提供商设置
        </CardTitle>
        <CardDescription>
          选择用于生成单词卡片的AI服务
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Provider Status */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${currentProviderInfo.color}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {currentProviderInfo.icon}
              <span className="font-medium">{currentProviderInfo.name}</span>
              <Badge variant={isAIConfigured(currentProvider) ? "default" : "destructive"}>
                {isAIConfigured(currentProvider) ? "已配置" : "未配置"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentProviderInfo.description}
            </p>
          </div>
        </div>

        {/* Provider Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">切换提供商</label>
          <Select value={currentProvider} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="选择AI提供商" />
            </SelectTrigger>
            <SelectContent>
              {(['gemini', 'deepseek'] as AIProvider[]).map((provider) => {
                const info = getProviderInfo(provider);
                const isConfigured = isAIConfigured(provider);
                
                return (
                  <SelectItem 
                    key={provider} 
                    value={provider}
                    disabled={!isConfigured}
                  >
                    <div className="flex items-center gap-2">
                      {info.icon}
                      <span>{info.name}</span>
                      {!isConfigured && (
                        <Badge variant="secondary" className="text-xs">
                          未配置
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Configuration Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">配置状态</label>
          <div className="space-y-2">
            {(['gemini', 'deepseek'] as AIProvider[]).map((provider) => {
              const info = getProviderInfo(provider);
              const isConfigured = isAIConfigured(provider);
              
              return (
                <div key={provider} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {info.icon}
                    <span className="text-sm">{info.name}</span>
                  </div>
                  <Badge variant={isConfigured ? "default" : "secondary"}>
                    {isConfigured ? "✓ 已配置" : "✗ 未配置"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Configuration Help */}
        {availableProviders.length === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ 没有可用的AI提供商。请在 <code>.env.local</code> 文件中配置API密钥。
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
