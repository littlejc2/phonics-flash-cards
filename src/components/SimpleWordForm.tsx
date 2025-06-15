import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SimpleWordFormProps {
  onSubmit: (wordData: any) => void;
}

const SimpleWordForm: React.FC<SimpleWordFormProps> = ({ onSubmit }) => {
  const [word, setWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      toast.error('请输入单词');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Generating word data for:', word);
      
      const { data, error } = await supabase.functions.invoke('generate-word-data', {
        body: { word: word.trim().toLowerCase() }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.wordData) {
        throw new Error('未收到单词数据');
      }

      console.log('Generated word data:', data.wordData);
      onSubmit(data.wordData);
      
      toast.success('单词卡片生成成功！', {
        description: 'AI已自动分析并生成完整的学习信息'
      });
      
    } catch (error) {
      console.error('Error generating word data:', error);
      toast.error('生成失败', {
        description: error instanceof Error ? error.message : '请稍后重试'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🤖 AI单词卡片生成器
      </h2>
      
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          只需输入单词，AI将自动生成：
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-600">
          <span>✨ 音标发音</span>
          <span>✨ 同音词记忆</span>
          <span>✨ 实用搭配</span>
          <span>✨ 频率标注</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="word" className="text-lg">输入要学习的单词</Label>
          <Input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="例如: word, learning, vocabulary..."
            className="text-lg p-4 mt-2"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <Button 
          type="submit" 
          className="w-full text-lg py-6" 
          size="lg"
          disabled={isLoading || !word.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              AI正在分析生成中...
            </>
          ) : (
            '🚀 一键生成学习卡片'
          )}
        </Button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          💡 AI将根据语言学习最佳实践，为您的单词生成专业的学习卡片
        </p>
      </div>
    </Card>
  );
};

export default SimpleWordForm;
