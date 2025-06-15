
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WordData {
  id?: string;
  word: string;
  pronunciation: string;
  part_of_speech: string;
  meaning: string;
  frequency: 'high' | 'medium' | 'low';
  frequency_note: string;
  vowels: Array<{
    vowel: string;
    sound: string;
    similarWords: Array<{
      word: string;
      pronunciation: string;
      meaning: string;
    }>;
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

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'high': return '极高频';
      case 'medium': return '高频';
      case 'low': return '中频';
      default: return '中频';
    }
  };

  const highlightVowels = (word: string, vowel: string) => {
    if (!word || !vowel) return word || '';
    const regex = new RegExp(`(${vowel})`, 'gi');
    return word.replace(regex, `<span class="bg-yellow-300 text-red-600 font-bold underline">$1</span>`);
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Sort and limit similar words - prioritize words with same letters
  const getSortedSimilarWords = (similarWords: Array<{word: string; pronunciation: string; meaning: string}>, originalWord: string, vowel: string) => {
    if (!similarWords || !Array.isArray(similarWords)) return [];
    
    // Safely handle undefined vowel
    const safeVowel = vowel?.toLowerCase() || '';
    
    // Sort by: 1) words with same letters as original word, 2) alphabetically
    const sorted = [...similarWords].sort((a, b) => {
      // Safely handle undefined word properties
      const aWord = a.word?.toLowerCase() || '';
      const bWord = b.word?.toLowerCase() || '';
      
      const aHasSameLetters = safeVowel && aWord.includes(safeVowel);
      const bHasSameLetters = safeVowel && bWord.includes(safeVowel);
      
      if (aHasSameLetters && !bHasSameLetters) return -1;
      if (!aHasSameLetters && bHasSameLetters) return 1;
      
      return aWord.localeCompare(bWord);
    });
    
    // Limit to 2-3 words
    return sorted.slice(0, 3);
  };

  console.log('WordCard data:', wordData);
  console.log('Vowels data:', wordData.vowels);

  return (
    <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{wordData.word}</h1>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-lg text-blue-600 font-mono">[{wordData.pronunciation}]</span>
          <button
            onClick={() => playPronunciation(wordData.word)}
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-blue-700 text-sm"
          >
            🔊 发音
          </button>
          <span className="text-sm text-gray-500">🤖 AI生成</span>
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
            <Badge variant="outline" className="ml-2">{wordData.part_of_speech}</Badge>
            <span className="ml-2 text-gray-700">{wordData.meaning}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">频率：</span>
            <span className="text-lg">{getFrequencyIcon(wordData.frequency)}</span>
            <span className={`px-2 py-1 rounded text-white text-sm ${getFrequencyColor(wordData.frequency)}`}>
              {getFrequencyText(wordData.frequency)}
            </span>
            <span className="text-sm text-gray-600">{wordData.frequency_note}</span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Vowel Analysis */}
      {wordData.vowels && wordData.vowels.length > 0 && (
        <>
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">🎵 元音音标同音词</h3>
            <div className="space-y-3">
              <div className="font-bold text-xl mb-2">
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightVowels(wordData.word, wordData.vowels[0]?.vowel || '') 
                  }} 
                />
              </div>
              {wordData.vowels.map((vowelData, index) => {
                const sortedSimilarWords = getSortedSimilarWords(vowelData.similarWords, wordData.word, vowelData.vowel);
                console.log(`Vowel ${index} similar words:`, sortedSimilarWords);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="font-semibold text-orange-700">
                      #{vowelData.vowel}：例子{wordData.word}，{vowelData.sound}
                    </div>
                    {sortedSimilarWords.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {sortedSimilarWords.map((wordObj, wordIndex) => (
                          <div key={wordIndex} className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-center justify-between mb-2">
                              <span 
                                className="text-lg font-bold text-gray-800"
                                dangerouslySetInnerHTML={{ 
                                  __html: highlightVowels(wordObj.word, vowelData.vowel) 
                                }}
                              />
                              <button
                                onClick={() => playPronunciation(wordObj.word)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors text-blue-600 text-xs"
                              >
                                🔊
                              </button>
                            </div>
                            <div className="text-sm text-blue-600 font-mono mb-1">
                              [{wordObj.pronunciation}]
                            </div>
                            <div className="text-sm text-gray-600">
                              {wordObj.meaning}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        暂无同音词数据
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Separator className="my-4" />
        </>
      )}

      {/* Practical Collocations */}
      {wordData.collocations && wordData.collocations.length > 0 && (
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
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <div className="bg-gray-100 p-2 rounded-md">
          <p>🔴 = 教育部考纲核心词汇前3000 | 🔵 = 3000-5000 | ⚪️ = 5000-8000</p>
          <p className="mt-1">🤖 本卡片由AI智能生成，基于语言学习最佳实践</p>
        </div>
      </div>
    </Card>
  );
};

export default WordCard;
