import React, { useState } from 'react';
import SimpleWordForm from '@/components/SimpleWordForm';
import WordCard from '@/components/WordCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, History, Camera } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

const Index = () => {
  const [currentView, setCurrentView] = useState<'input' | 'card'>('input');
  const [wordData, setWordData] = useState<any>(null);
  const [isScreenshotting, setIsScreenshotting] = useState(false);

  const handleWordSubmit = (data: any) => {
    console.log('Generated word data:', data);
    setWordData(data);
    setCurrentView('card');
  };

  const handleBackToInput = () => {
    setCurrentView('input');
  };

  const handleScreenshot = async () => {
    if (!wordData) return;

    setIsScreenshotting(true);
    
    try {
      // 获取卡片元素
      const cardElement = document.querySelector('.word-card-container');
      
      if (!cardElement) {
        throw new Error('卡片元素未找到');
      }

      toast.info('正在生成截图...', {
        description: '请稍等，正在将卡片转换为图片'
      });

      // 使用html2canvas生成截图
      const canvas = await html2canvas(cardElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高分辨率
        useCORS: true,
        allowTaint: true,
        width: cardElement.scrollWidth,
        height: cardElement.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });

      // 转换为blob并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${wordData.word}-学习卡片.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast.success('截图保存成功！', {
            description: `${wordData.word} 学习卡片已保存为 PNG 图片`
          });
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast.error('截图失败', {
        description: '请尝试刷新页面后重试，或使用浏览器的截图功能'
      });
    } finally {
      setIsScreenshotting(false);
    }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 leading-tight">
            🤖 AI智能单词学习卡片
          </h1>
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
                  onClick={handleScreenshot}
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={isScreenshotting}
                >
                  <Camera className="w-4 h-4" />
                  {isScreenshotting ? '截图中...' : '保存图片'}
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
            {wordData && (
              <div className="word-card-container">
                <WordCard wordData={wordData} />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
            <p className="mb-2">
              🤖 <strong>AI智能生成：</strong>只需输入单词，AI自动分析生成专业学习卡片
            </p>
            <p className="mb-2">
              📷 <strong>快速截图：</strong>使用html2canvas技术，一键将卡片保存为高质量图片
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
