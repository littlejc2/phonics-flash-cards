import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import APIKeyManager from '@/components/APIKeyManager';

const APISetup: React.FC = () => {
  const navigate = useNavigate();

  const handleKeysUpdated = () => {
    // 配置更新后的回调
    console.log('API keys updated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回主页
          </Button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            🔑 API 密钥配置
          </h1>
          
          <div></div>
        </div>

        {/* API Key Manager */}
        <APIKeyManager onKeysUpdated={handleKeysUpdated} />

        {/* 使用说明 */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">📋 配置说明</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-700 mb-2">✅ 推荐：DeepSeek API</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 国内可直接访问，无需科学上网</li>
                  <li>• 性价比高，中文理解能力强</li>
                  <li>• 注册简单，免费额度充足</li>
                  <li>• 获取地址：<a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.deepseek.com</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-700 mb-2">🌟 备选：Google Gemini</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 功能强大，支持多模态</li>
                  <li>• 免费额度较高</li>
                  <li>• 需要科学上网访问</li>
                  <li>• 获取地址：<a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">makersuite.google.com</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">💡 使用提示</h4>
              <ul className="text-sm space-y-1 text-yellow-700">
                <li>• 配置完成后点击"保存配置"按钮</li>
                <li>• 建议刷新页面以确保配置生效</li>
                <li>• 可以同时配置两个提供商作为备选</li>
                <li>• API密钥将安全保存在浏览器本地存储中</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APISetup;
