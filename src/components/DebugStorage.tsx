import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { isAIConfigured, getAvailableProviders } from '@/lib/ai-client';
import { getCurrentProvider, getCurrentModel } from '@/config/gemini';

const DebugStorage: React.FC = () => {
  const [storageData, setStorageData] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState(false);

  const loadStorageData = () => {
    const keys = [
      'gemini_api_key',
      'deepseek_api_key', 
      'gemini_model',
      'deepseek_model',
      'selected_ai_provider'
    ];

    const data: Record<string, string> = {};
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      data[key] = value || '(未设置)';
    });

    setStorageData(data);
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  const clearStorage = () => {
    if (confirm('确定要清除所有localStorage数据吗？')) {
      Object.keys(storageData).forEach(key => {
        localStorage.removeItem(key);
      });
      loadStorageData();
    }
  };

  const maskValue = (value: string) => {
    if (value === '(未设置)') return value;
    if (value.length <= 8) return value;
    return value.substring(0, 4) + '***' + value.substring(value.length - 4);
  };

  const getConfigStatus = () => {
    const geminiConfigured = isAIConfigured('gemini');
    const deepseekConfigured = isAIConfigured('deepseek');
    const availableProviders = getAvailableProviders();
    const currentProvider = getCurrentProvider();
    const currentGeminiModel = getCurrentModel('gemini');
    const currentDeepseekModel = getCurrentModel('deepseek');

    return {
      geminiConfigured,
      deepseekConfigured,
      availableProviders,
      currentProvider,
      currentGeminiModel,
      currentDeepseekModel
    };
  };

  const status = getConfigStatus();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 配置调试工具
          <Button
            variant="outline"
            size="sm"
            onClick={loadStorageData}
            className="ml-auto"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            刷新
          </Button>
        </CardTitle>
        <CardDescription>
          检查localStorage存储状态和API配置
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 配置状态概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold">配置状态</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span>Gemini</span>
                <Badge variant={status.geminiConfigured ? "default" : "destructive"}>
                  {status.geminiConfigured ? "✓ 已配置" : "✗ 未配置"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span>DeepSeek</span>
                <Badge variant={status.deepseekConfigured ? "default" : "destructive"}>
                  {status.deepseekConfigured ? "✓ 已配置" : "✗ 未配置"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">当前配置</h3>
            <div className="space-y-2 text-sm">
              <div><strong>当前提供商:</strong> {status.currentProvider}</div>
              <div><strong>Gemini模型:</strong> {status.currentGeminiModel}</div>
              <div><strong>DeepSeek模型:</strong> {status.currentDeepseekModel}</div>
              <div><strong>可用提供商:</strong> {status.availableProviders.join(', ') || '无'}</div>
            </div>
          </div>
        </div>

        {/* localStorage数据 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">localStorage 数据</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowValues(!showValues)}
              >
                {showValues ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showValues ? '隐藏' : '显示'}值
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearStorage}
                className="text-red-600"
              >
                清除数据
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(storageData).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div className="font-mono text-sm">{key}</div>
                <div className="text-sm">
                  {showValues ? value : maskValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="space-y-3">
          <h3 className="font-semibold">测试功能</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                console.log('localStorage数据:', storageData);
                console.log('配置状态:', status);
              }}
            >
              输出到控制台
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const testKey = 'test_deepseek_key_' + Date.now();
                localStorage.setItem('deepseek_api_key', testKey);
                setTimeout(() => {
                  const retrieved = localStorage.getItem('deepseek_api_key');
                  alert(`测试结果:\n设置: ${testKey}\n获取: ${retrieved}\n匹配: ${testKey === retrieved}`);
                  loadStorageData();
                }, 100);
              }}
            >
              测试DeepSeek保存
            </Button>
          </div>
        </div>

        {/* 问题诊断 */}
        <div className="space-y-3">
          <h3 className="font-semibold">问题诊断</h3>
          <div className="space-y-2 text-sm">
            {!status.deepseekConfigured && storageData.deepseek_api_key !== '(未设置)' && (
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                ⚠️ DeepSeek API密钥已保存但未被识别为有效配置
              </div>
            )}
            {status.availableProviders.length === 0 && (
              <div className="p-2 bg-red-50 border border-red-200 rounded">
                ❌ 没有可用的AI提供商，请检查API密钥配置
              </div>
            )}
            {storageData.deepseek_api_key === '(未设置)' && (
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                ℹ️ DeepSeek API密钥未保存到localStorage
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugStorage;
