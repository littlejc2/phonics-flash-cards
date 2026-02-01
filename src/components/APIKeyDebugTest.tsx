import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AIProvider } from '@/config/gemini';

const APIKeyDebugTest: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [selectedTab, setSelectedTab] = useState<AIProvider>('gemini');

  // 从localStorage加载
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('gemini_api_key') || '';
    const savedDeepseekKey = localStorage.getItem('deepseek_api_key') || '';
    
    setGeminiKey(savedGeminiKey);
    setDeepseekKey(savedDeepseekKey);
    
    console.log('Loaded from localStorage:', {
      gemini: savedGeminiKey,
      deepseek: savedDeepseekKey
    });
  }, []);

  const handleSave = () => {
    console.log('Saving keys:', {
      gemini: geminiKey,
      deepseek: deepseekKey,
      selectedTab
    });

    // 保存到localStorage
    if (geminiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiKey.trim());
      console.log('Saved Gemini key:', geminiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
      console.log('Removed Gemini key');
    }

    if (deepseekKey.trim()) {
      localStorage.setItem('deepseek_api_key', deepseekKey.trim());
      console.log('Saved DeepSeek key:', deepseekKey.trim());
    } else {
      localStorage.removeItem('deepseek_api_key');
      console.log('Removed DeepSeek key');
    }

    // 验证保存结果
    setTimeout(() => {
      const verifyGemini = localStorage.getItem('gemini_api_key');
      const verifyDeepseek = localStorage.getItem('deepseek_api_key');
      
      console.log('Verification after save:', {
        gemini: verifyGemini,
        deepseek: verifyDeepseek
      });

      alert(`保存验证:\nGemini: ${verifyGemini || '(空)'}\nDeepSeek: ${verifyDeepseek || '(空)'}`);
    }, 100);
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('deepseek_api_key');
    setGeminiKey('');
    setDeepseekKey('');
    console.log('Cleared all keys');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 API密钥保存测试</CardTitle>
        <CardDescription>
          简化版本的API密钥管理，用于调试保存问题
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as AIProvider)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API 密钥</Label>
              <Input
                id="gemini-key"
                type="text"
                value={geminiKey}
                onChange={(e) => {
                  console.log('Gemini key changed:', e.target.value);
                  setGeminiKey(e.target.value);
                }}
                placeholder="输入Gemini API密钥"
              />
              <div className="text-xs text-gray-500">
                当前值: {geminiKey || '(空)'}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deepseek" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepseek-key">DeepSeek API 密钥</Label>
              <Input
                id="deepseek-key"
                type="text"
                value={deepseekKey}
                onChange={(e) => {
                  console.log('DeepSeek key changed:', e.target.value);
                  setDeepseekKey(e.target.value);
                }}
                placeholder="输入DeepSeek API密钥"
              />
              <div className="text-xs text-gray-500">
                当前值: {deepseekKey || '(空)'}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleSave}>保存配置</Button>
          <Button variant="outline" onClick={handleClear}>清除配置</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('Current state:', {
                geminiKey,
                deepseekKey,
                selectedTab,
                localStorage: {
                  gemini: localStorage.getItem('gemini_api_key'),
                  deepseek: localStorage.getItem('deepseek_api_key')
                }
              });
            }}
          >
            输出状态
          </Button>
        </div>

        {/* 状态显示 */}
        <div className="space-y-2 p-4 bg-gray-50 rounded">
          <h4 className="font-medium">当前状态</h4>
          <div className="text-sm space-y-1">
            <div><strong>选中标签:</strong> {selectedTab}</div>
            <div><strong>Gemini状态:</strong> {geminiKey ? `${geminiKey.substring(0, 10)}...` : '(空)'}</div>
            <div><strong>DeepSeek状态:</strong> {deepseekKey ? `${deepseekKey.substring(0, 10)}...` : '(空)'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyDebugTest;
