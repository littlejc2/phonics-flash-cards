
import React from 'react';
import { BookOpen } from 'lucide-react';
import { playPronunciation } from '@/lib/speech';

interface ExampleSentence {
  sentence: string;
  translation: string;
}

interface ExampleSentencesSectionProps {
  exampleSentences: ExampleSentence[];
}

const ExampleSentencesSection: React.FC<ExampleSentencesSectionProps> = ({ exampleSentences }) => {
  if (!exampleSentences || exampleSentences.length === 0) return null;

  return (
    <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
      <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-green-800 mb-3">
        <BookOpen className="w-5 h-5" /> 精选例句
      </h3>
      <div className="space-y-3">
        {exampleSentences.map((example, index) => (
          <div key={index} className="bg-white rounded-md border border-green-100 p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-gray-800 text-sm sm:text-base break-words flex-1">
                {example.sentence}
              </p>
              <button
                onClick={() => playPronunciation(example.sentence)}
                className="flex items-center gap-1 px-2 py-1 bg-green-100 hover:bg-green-200 rounded transition-colors text-green-600 text-xs flex-shrink-0"
                title="播放例句发音"
              >
                🔊
              </button>
            </div>
            <div className="text-gray-600 text-xs sm:text-sm break-words">
              {example.translation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSentencesSection;
