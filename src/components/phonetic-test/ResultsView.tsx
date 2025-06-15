
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { TestQuestion } from '@/lib/phonetic-test-utils';

interface ResultsViewProps {
  score: number;
  questions: TestQuestion[];
  selectedAnswers: number[];
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ score, questions, selectedAnswers, onRestart }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 text-center">
      <div className="mb-6">
        <div className="text-6xl mb-4">
          {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          测试完成！
        </h2>
        <div className="text-5xl font-bold text-blue-600 mb-4">
          {score}分
        </div>
        <p className="text-lg text-gray-600 mb-6">
          {score >= 80 ? '优秀！您对音标掌握得很好！' : 
           score >= 60 ? '不错！继续加油！' : 
           '需要多练习音标哦！'}
        </p>
      </div>

      <div className="text-left mb-6">
        <h3 className="text-lg font-semibold mb-4">答题回顾：</h3>
        {questions.map((question, index) => {
          const selectedOptionIndex = selectedAnswers[index];
          const isCorrect = selectedOptionIndex !== undefined && question.options[selectedOptionIndex]?.isCorrect;
          
          return (
            <div key={index} className="mb-3 p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xl ${isCorrect ? '✅' : '❌'}`} />
                <span className="text-sm text-gray-600">题目 {index + 1}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">您的答案：</span>
                {selectedOptionIndex !== undefined ? 
                  question.options[selectedOptionIndex].word : '未选择'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={onRestart} variant="outline">
          重新测试
        </Button>
        <Button onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    </Card>
  );
};

export default ResultsView;
