
import React, { useState } from 'react';
import SimpleWordForm from '@/components/SimpleWordForm';
import WordCard from '@/components/WordCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, History } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState<'input' | 'card'>('input');
  const [wordData, setWordData] = useState<any>(null);

  const handleWordSubmit = (data: any) => {
    console.log('Generated word data:', data);
    setWordData(data);
    setCurrentView('card');
  };

  const handleBackToInput = () => {
    setCurrentView('input');
  };

  const handleDownload = () => {
    toast.info('截图功能', {
      description: '请使用浏览器的截图功能或手机截屏来保存卡片'
    });
  };

  const handleShare = () => {
    if (navigator.share && wordData) {
      navigator.share({
        title: `${wordData.word} - AI智能单词学习卡片`,
        text: `我正在用AI学习单词"${wordData.word}"，快来看看这张智能生成的学习卡片！`,
        url: window.location.href
      }).catch(() => {
        toast.error('分享失败，请尝试其他方式分享');
      });
    } else {
      toast.info('分享提示', {
        description: '您可以截图后通过社交媒体分享这张卡片'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🤖 AI智能单词学习卡片
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            一键输入 • AI智能分析 • 专业学习卡片
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>🤖 AI自动生成</span>
            <span>✅ 词根词缀分析</span>
            <span>✅ 同音词记忆</span>
            <span>✅ 实用搭配</span>
            <span>✅ 分频率标注</span>
            <span>✅ 便于截图分享</span>
          </div>
        </div>

        {/* Main Content */}
        {currentView === 'input' ? (
          <SimpleWordForm onSubmit={handleWordSubmit} />
        ) : (
          <div className="space-y-6">
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleBackToInput}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                生成新卡片
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  保存卡片
                </Button>
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  分享卡片
                </Button>
              </div>
            </div>

            {/* Word Card */}
            {wordData && <WordCard wordData={wordData} />}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
            <p className="mb-2">
              🤖 <strong>AI智能生成：</strong>只需输入单词，AI自动分析生成专业学习卡片
            </p>
            <p>
              🎯 基于最新语言学习理论和大数据分析，帮助您更高效地记忆单词
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
