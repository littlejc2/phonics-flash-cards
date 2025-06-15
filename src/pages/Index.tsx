
import React, { useState } from 'react';
import SimpleWordForm from '@/components/SimpleWordForm';
import WordCard from '@/components/WordCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, History } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [currentView, setCurrentView] = useState<'input' | 'card'>('input');
  const [wordData, setWordData] = useState<any>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleWordSubmit = (data: any) => {
    console.log('Generated word data:', data);
    setWordData(data);
    setCurrentView('card');
  };

  const handleBackToInput = () => {
    setCurrentView('input');
  };

  const handleDownload = async () => {
    if (!wordData) return;

    setIsConverting(true);
    
    try {
      // Get the card element
      const cardElement = document.querySelector('.word-card-container');
      if (!cardElement) {
        throw new Error('卡片元素未找到');
      }

      // Convert the card to HTML string
      const cardHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${wordData.word} - AI智能单词学习卡片</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              background: linear-gradient(135deg, #dbeafe 0%, #faf5ff 50%, #fce7f3 100%);
              padding: 20px;
              margin: 0;
            }
            .highlight-vowel {
              background-color: #fef3c7;
              color: #dc2626;
              font-weight: bold;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          ${cardElement.outerHTML}
        </body>
        </html>
      `;

      // Use CloudConvert API to convert HTML to PNG
      const response = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_CLOUDCONVERT_API_KEY' // 用户需要设置API密钥
        },
        body: JSON.stringify({
          tasks: {
            'import-html': {
              operation: 'import/base64',
              file: btoa(cardHTML),
              filename: `${wordData.word}-card.html`
            },
            'convert-to-png': {
              operation: 'convert',
              input: 'import-html',
              output_format: 'png',
              engine: 'chrome',
              engine_version: '91',
              zoom: 2,
              width: 1200,
              height: 1600,
              wait_time: 2
            },
            'export-png': {
              operation: 'export/url',
              input: 'convert-to-png'
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('CloudConvert API 请求失败');
      }

      const job = await response.json();
      
      toast.success('转换中...', {
        description: '正在使用 CloudConvert 将卡片转换为图片格式'
      });

      // Poll for job completion
      const jobId = job.data.id;
      let attempts = 0;
      const maxAttempts = 30;

      const pollJob = async () => {
        const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
          headers: {
            'Authorization': 'Bearer YOUR_CLOUDCONVERT_API_KEY'
          }
        });

        const jobStatus = await statusResponse.json();
        
        if (jobStatus.data.status === 'finished') {
          const exportTask = jobStatus.data.tasks.find((task: any) => task.name === 'export-png');
          if (exportTask && exportTask.result && exportTask.result.files[0]) {
            const downloadUrl = exportTask.result.files[0].url;
            
            // Download the file
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${wordData.word}-学习卡片.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success('卡片保存成功！', {
              description: `${wordData.word} 学习卡片已保存为 PNG 图片`
            });
          }
        } else if (jobStatus.data.status === 'error') {
          throw new Error('转换过程中出现错误');
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(pollJob, 2000);
        } else {
          throw new Error('转换超时，请重试');
        }
      };

      setTimeout(pollJob, 2000);

    } catch (error) {
      console.error('Error converting card:', error);
      toast.error('保存失败', {
        description: '请检查 CloudConvert API 密钥设置或网络连接'
      });
      
      // Fallback to screenshot instruction
      toast.info('备用方案', {
        description: '您可以使用浏览器的截图功能或手机截屏来保存卡片'
      });
    } finally {
      setIsConverting(false);
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
                  disabled={isConverting}
                >
                  <Download className="w-4 h-4" />
                  {isConverting ? '转换中...' : '保存为图片'}
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
              📷 <strong>CloudConvert 保存：</strong>一键将卡片转换为高质量 PNG 图片
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
