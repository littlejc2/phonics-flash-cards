
import React from 'react';
import { playPronunciation } from '@/lib/speech';

interface WordCardHeaderProps {
  word: string;
  pronunciation: string;
}

const WordCardHeader: React.FC<WordCardHeaderProps> = ({ word, pronunciation }) => {
  return (
    <div className="text-center mb-4 sm:mb-6">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 break-words">{word}</h1>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
        <span className="text-base sm:text-lg text-blue-600 font-mono break-all">[{pronunciation}]</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => playPronunciation(word)}
            className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-blue-700 text-xs sm:text-sm whitespace-nowrap"
          >
            🔊 发音
          </button>
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">🤖 AI生成</span>
        </div>
      </div>
    </div>
  );
};

export default WordCardHeader;
