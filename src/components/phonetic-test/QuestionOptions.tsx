
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { playPronunciation } from '@/lib/speech';

interface Option {
  word: string;
  pronunciation: string;
}

interface QuestionOptionsProps {
  options: Option[];
  selectedAnswer: number | undefined;
  onAnswerSelect: (index: number) => void;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({ options, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
            selectedAnswer === index
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onAnswerSelect(index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                )}
              </div>
              <div>
                <span className="font-medium text-lg">{option.word}</span>
                <div className="text-sm text-blue-600 font-mono">
                  [{option.pronunciation}]
                </div>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                playPronunciation(option.word);
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionOptions;
