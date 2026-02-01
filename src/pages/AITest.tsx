import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AIProviderSelector } from '@/components/AIProviderSelector';
import { DetailedModelSelector } from '@/components/ModelSelector';
import APIKeyManager from '@/components/APIKeyManager';
import DebugStorage from '@/components/DebugStorage';
import APIKeyDebugTest from '@/components/APIKeyDebugTest';
import { generateWordData, isAIConfigured, getAvailableProviders } from '@/lib/ai-client';
import { getCurrentProvider, getCurrentModel, type AIProvider } from '@/config/gemini';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AITest: React.FC = () => {
  const [testWord, setTestWord] = useState('hello');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<AIProvider, any>>({} as any);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(getCurrentProvider());
  const [selectedModel, setSelectedModel] = useState<string>(getCurrentModel());
  const [refreshKey, setRefreshKey] = useState(0);

  const availableProviders = getAvailableProviders();
  const currentProvider = getCurrentProvider();

  const handleKeysUpdated = () => {
    setRefreshKey(prev => prev + 1);
    setTestResults({} as any);
  };

  const testProvider = async (provider: AIProvider) => {
    if (!isAIConfigured(provider)) {
      toast.error(`${provider} 未配置 API 密钥`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateWordData(testWord, provider);
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: true,
          data: result,
          error: null
        }
      }));
      toast.success(`${provider} 测试成功！`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [provider]: {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : '未知错误'
        }
      }));
      toast.error(`${provider} 测试失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllProviders = async () => {
    for (const provider of availableProviders) {
      await testProvider(provider);
      // 添加延迟避免API限制
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getProviderStatus = (provider: AIProvider) => {
    const isConfigured = isAIConfigured(provider);
    const testResult = testResults[provider];

    if (!isConfigured) {
      return { icon: <XCircle className="w-4 h-4 text-red-500" />, text: '未配置', color: 'destructive' };
    }
    
    if (!testResult) {
      return { icon: <AlertCircle className="w-4 h-4 text-yellow-500" />, text: '未测试', color: 'secondary' };
    }
    
    if (testResult.success) {
      return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: '正常', color: 'default' };
    }
    
    return { icon: <XCircle className="w-4 h-4 text-red-500" />, text: '错误', color: 'destructive' };
  };

  return (
    <div className="container mx-auto p-6 space-y-6" key={refreshKey}>
      {/* API密钥管理 */}
      <APIKeyManager onKeysUpdated={handleKeysUpdated} />

      {/* 调试工具 */}
      <DebugStorage />

      {/* API密钥保存测试 */}
      <APIKeyDebugTest />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            AI API 配置测试
          </CardTitle>
          <CardDescription>
            测试和验证 AI 提供商的配置状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 配置状态概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">配置状态</h3>
              {(['gemini', 'deepseek'] as AIProvider[]).map((provider) => {
                const status = getProviderStatus(provider);
                return (
                  <div key={provider} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium">{provider}</span>
                      {provider === currentProvider && (
                        <Badge variant="outline" className="text-xs">当前</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {status.icon}
                      <Badge variant={status.color as any}>{status.text}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">AI配置</h3>
              <div className="space-y-4">
                <div>
                  <AIProviderSelector
                    onProviderChange={(provider) => {
                      setSelectedProvider(provider);
                      setSelectedModel(getCurrentModel(provider));
                    }}
                    showStatus={false}
                  />
                </div>

                <div>
                  <DetailedModelSelector
                    provider={selectedProvider}
                    value={selectedModel}
                    onValueChange={setSelectedModel}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                <strong>当前配置：</strong> {selectedProvider} / {selectedModel}
              </div>
            </div>
          </div>

          {/* 测试区域 */}
          <div className="space-y-4">
            <h3 className="font-semibold">API 测试</h3>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="testWord">测试单词</Label>
                <Input
                  id="testWord"
                  value={testWord}
                  onChange={(e) => setTestWord(e.target.value)}
                  placeholder="输入要测试的单词"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={() => testProvider(selectedProvider)}
                disabled={isLoading || !isAIConfigured(selectedProvider)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    测试中...
                  </>
                ) : (
                  `测试 ${selectedProvider}`
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={testAllProviders}
                disabled={isLoading || availableProviders.length === 0}
              >
                测试所有
              </Button>
            </div>
          </div>

          {/* 测试结果 */}
          {Object.keys(testResults).length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">测试结果</h3>
              {Object.entries(testResults).map(([provider, result]) => (
                <Card key={provider} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{provider}</h4>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "成功" : "失败"}
                    </Badge>
                  </div>
                  
                  {result.success ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">
                        ✅ API 调用成功，返回了 {result.data.text.length} 个字符的响应
                      </p>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600">查看响应详情</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">
                      ❌ 错误：{result.error}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* 配置提示 */}
          {availableProviders.length === 0 && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">需要配置 API 密钥</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    请在 <code>.env.local</code> 文件中配置至少一个 AI 提供商的 API 密钥。
                    查看 <code>AI_SETUP_GUIDE.md</code> 获取详细配置说明。
                  </p>
                </div>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AITest;
