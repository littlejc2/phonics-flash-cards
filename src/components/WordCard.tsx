
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WordData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  frequency: 'high' | 'medium' | 'low';
  frequencyNote: string;
  vowels: Array<{
    vowel: string;
    sound: string;
    similarWords: string[];
  }>;
  etymology: {
    root: string;
    affix: string;
    coreMeaning: string;
    changeMeaning: string;
    finalMeaning: string;
  };
  collocations: Array<{
    phrase: string;
    meaning: string;
    context: string;
  }>;
}

interface WordCardProps {
  wordData: WordData;
}

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'high': return '🔴';
      case 'medium': return '🔵';
      case 'low': return '⚪️';
      default: return '⚪️';
    }
  };

  const highlightVowels = (word: string, vowel: string) => {
    const regex = new RegExp(`(${vowel})`, 'gi');
    return word.replace(regex, `<span class="bg-yellow-300 text-red-600 font-bold underline">$1</span>`);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{wordData.word}</h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg text-blue-600 font-mono">[{wordData.pronunciation}]</span>
          <button className="text-blue-500 hover:text-blue-700 text-sm">🔊 添加发音</button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-green-50 rounded-lg p-4 mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-2">
          📖 基本信息
        </h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium">词性：</span>
            <Badge variant="outline" className="ml-2">{wordData.partOfSpeech}</Badge>
            <span className="ml-2 text-gray-700">{wordData.meaning}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">频率：</span>
            <span className="text-lg">{getFrequencyIcon(wordData.frequency)}</span>
            <span className={`px-2 py-1 rounded text-white text-sm ${getFrequencyColor(wordData.frequency)}`}>
              {wordData.frequency === 'high' ? '极高频' : wordData.frequency === 'medium' ? '高频' : '中频'}
            </span>
            <span className="text-sm text-gray-600">{wordData.frequencyNote}</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Vowel Analysis */}
      <div className="bg-yellow-50 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">原音音标同音词</h3>
        <div className="space-y-3">
          <div className="font-bold text-xl mb-2">
            <span 
              dangerouslySetInnerHTML={{ 
                __html: highlightVowels(wordData.word, wordData.vowels[0]?.vowel || '') 
              }} 
            />
          </div>
          {wordData.vowels.map((vowelData, index) => (
            <div key={index} className="space-y-2">
              <div className="font-semibold text-orange-700">
                #{vowelData.vowel}：例子{wordData.word}，{vowelData.sound}
              </div>
              <div className="flex flex-wrap gap-2">
                {vowelData.similarWords.map((word, wordIndex) => (
                  <span 
                    key={wordIndex}
                    className="px-2 py-1 bg-yellow-200 rounded text-sm font-medium"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightVowels(word, vowelData.vowel) 
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Understanding */}
      <div className="bg-purple-50 rounded-lg p-4 mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-3">
          ⚡️ 快速理解
        </h3>
        <div className="space-y-2">
          <div className="text-center">
            <span className="font-medium text-purple-700">{wordData.etymology.root}</span>
            <span className="mx-2">·</span>
            <span className="font-medium text-purple-700">{wordData.etymology.affix}</span>
            <span className="mx-2">=</span>
            <span className="text-blue-600">{wordData.etymology.coreMeaning}</span>
            <span className="mx-2">+</span>
            <span className="text-green-600">{wordData.etymology.changeMeaning}</span>
          </div>
          <div className="text-center mt-3">
            <div className="text-2xl">↓</div>
            <div className="bg-white p-3 rounded-md shadow-sm mt-2">
              <span className="text-gray-800 font-medium">{wordData.etymology.finalMeaning}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Practical Collocations */}
      <div className="bg-red-50 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-red-800 mb-3">
          📌 实用搭配
        </h3>
        <div className="space-y-2">
          {wordData.collocations.map((collocation, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-md">
              <span className="font-medium text-red-700 min-w-fit">• {collocation.phrase}</span>
              <span className="text-gray-700">{collocation.meaning}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {collocation.context}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <div className="bg-gray-100 p-2 rounded-md">
          <p>🔴 = 教育部考纲核心词汇前3000 | 🔵 = 3000-5000 | ⚪️ = 5000-8000</p>
        </div>
      </div>
    </Card>
  );
};

export default WordCard;
