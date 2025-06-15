import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Headphones } from 'lucide-react';

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
    similarWords: Array<string | {
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
  example_sentences?: Array<{
    sentence: string;
    translation: string;
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

  // Function to get simple meaning for common words
  const getSimpleMeaning = (word: string) => {
    const simpleMeanings: { [key: string]: string } = {
      'word': '单词',
      'work': '工作',
      'bird': '鸟',
      'learn': '学习',
      'turn': '转动',
      'burn': '燃烧',
      'hurt': '受伤',
      'world': '世界',
      'first': '第一',
      'church': '教堂',
      'earth': '地球',
      'third': '第三',
      'heard': '听到',
      'search': '搜索',
      'person': '人',
      'certain': '确定的',
      'perfect': '完美的',
      'purpose': '目的',
      'surface': '表面',
      'circle': '圆圈',
      'purple': '紫色',
      'service': '服务',
      'nervous': '紧张的',
      'herself': '她自己',
      'concern': '关心',
      'deserve': '值得',
      'reserve': '保留',
      'observe': '观察',
      'preserve': '保护',
      'confirm': '确认',
      'western': '西方的',
      'northern': '北方的',
      'southern': '南方的',
      'eastern': '东方的',
      'winter': '冬天',
      'summer': '夏天',
      'water': '水',
      'better': '更好的',
      'letter': '信件',
      'center': '中心',
      'matter': '事情',
      'sister': '姐妹',
      'brother': '兄弟',
      'mother': '母亲',
      'father': '父亲',
      'teacher': '老师',
      'worker': '工人',
      'player': '玩家',
      'winner': '获胜者',
      'dinner': '晚餐',
      'finger': '手指',
      'number': '数字',
      'member': '成员',
      'answer': '答案',
      'flower': '花',
      'power': '力量',
      'tower': '塔',
      'shower': '淋浴',
      'hour': '小时',
      'sour': '酸的',
      'four': '四',
      'door': '门',
      'floor': '地板',
      'poor': '贫穷的',
      'more': '更多',
      'store': '商店',
      'before': '之前',
      'explore': '探索',
      'ignore': '忽视',
      'score': '分数',
      'shore': '海岸'
    };
    
    return simpleMeanings[word.toLowerCase()] || '常用词';
  };

  const playPronunciation = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('抱歉，您的浏览器不支持语音朗读功能。');
      return;
    }
    
    const synth = window.speechSynthesis;

    // A hack to "wake up" the speech synthesis engine on some mobile browsers
    if (synth.paused) {
      synth.resume();
    }
    
    // Stop any currently playing speech to avoid overlaps
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.volume = 1.0;
    
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror:', event);
      
      // 'interrupted' and 'canceled' are often not true errors on mobile.
      // They can happen when we intentionally call `synth.cancel()`.
      // We will ignore them to prevent false error messages.
      if (event.error === 'interrupted' || event.error === 'canceled') {
        console.warn(`SpeechSynthesis event "${event.error}" caught and ignored.`);
        return;
      }

      let errorMessage = '朗读时发生未知错误。';
      // The 'error' property provides a string code for the error.
      if (event.error) {
          switch(event.error) {
              case 'not-allowed':
                  errorMessage = '浏览器阻止了语音播放。请在网站设置中允许音频播放。请在网站设置中允许音频播放。';
                  break;
              case 'synthesis-unavailable':
                  errorMessage = '您设备上的语音合成服务当前不可用。';
                  break;
              case 'synthesis-failed':
                  errorMessage = '语音合成失败，请稍后重试。';
                  break;
              case 'audio-busy':
                  errorMessage = '音频设备正忙，请关闭其他音频应用后再试。';
                  break;
              case 'network':
                  errorMessage = '需要网络连接来加载语音，请检查您的网络。';
                  break;
              default:
                  errorMessage = `朗读失败，错误代码: ${event.error}`;
          }
      }
      toast.error('语音朗读失败', {
        description: errorMessage,
        duration: 5000,
      });
    };

    synth.speak(utterance);
  };

  // Sort and limit similar words - handle both string and object formats
  const getSortedSimilarWords = (similarWords: Array<string | {word: string; pronunciation: string; meaning: string}>, originalWord: string, vowel: string) => {
    if (!similarWords || !Array.isArray(similarWords)) return [];
    
    // Safely handle undefined vowel
    const safeVowel = vowel?.toLowerCase() || '';
    
    // Convert strings to objects if needed
    const normalizedWords = similarWords.map(item => {
      if (typeof item === 'string') {
        return {
          word: item,
          pronunciation: `/${item}/`, // Default pronunciation
          meaning: getSimpleMeaning(item) // Use the simple meaning function
        };
      }
      return item;
    });
    
    // Sort by: 1) words with same letters as original word, 2) alphabetically
    const sorted = [...normalizedWords].sort((a, b) => {
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
  console.log('Example sentences data:', wordData.example_sentences);

  // 修正字段命名兼容（核心更新）
  const exampleSentencesData = wordData.example_sentences || wordData.exampleSentences || [];

  return (
    <Card className="w-full max-w-2xl mx-auto p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 break-words">{wordData.word}</h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2">
          <span className="text-base sm:text-lg text-blue-600 font-mono break-all">[{wordData.pronunciation}]</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => playPronunciation(wordData.word)}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-blue-700 text-xs sm:text-sm whitespace-nowrap"
            >
              🔊 发音
            </button>
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">🤖 AI生成</span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-green-800 mb-2">
          📖 基本信息
        </h3>
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
            <span className="font-medium">词性：</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{wordData.part_of_speech}</Badge>
              <span className="text-gray-700 text-sm break-words">{wordData.meaning}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-medium whitespace-nowrap">频率：</span>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFrequencyIcon(wordData.frequency)}</span>
                <span className={`px-2 py-1 rounded text-white text-xs sm:text-sm whitespace-nowrap ${getFrequencyColor(wordData.frequency)}`}>
                  {getFrequencyText(wordData.frequency)}
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              {wordData.frequency_note}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-3 sm:my-4" />

      {/* Vowel Analysis */}
      {wordData.vowels && wordData.vowels.length > 0 && (
        <>
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-3">🎵 元音音标同音词</h3>
            <div className="space-y-3">
              <div className="font-bold text-lg sm:text-xl mb-2">
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
                    <div className="font-semibold text-orange-700 text-sm sm:text-base break-words">
                      #{vowelData.vowel}：例子{wordData.word}，{vowelData.sound}
                    </div>
                    {sortedSimilarWords.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {sortedSimilarWords.map((wordObj, wordIndex) => (
                          <div key={wordIndex} className="bg-white rounded-lg p-3 shadow-sm border">
                            <div className="flex items-center justify-between mb-2">
                              <span 
                                className="text-base sm:text-lg font-bold text-gray-800 break-words flex-1"
                                dangerouslySetInnerHTML={{ 
                                  __html: highlightVowels(wordObj.word, vowelData.vowel) 
                                }}
                              />
                              <button
                                onClick={() => playPronunciation(wordObj.word)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors text-blue-600 text-xs ml-2 flex-shrink-0"
                              >
                                🔊
                              </button>
                            </div>
                            <div className="text-xs sm:text-sm text-blue-600 font-mono mb-1 break-all">
                              [{wordObj.pronunciation}]
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 break-words">
                              {wordObj.meaning}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-gray-500 italic">
                        暂无同音词数据
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Separator className="my-3 sm:my-4" />
        </>
      )}

      {/* Practical Collocations */}
      {wordData.collocations && wordData.collocations.length > 0 && (
        <>
          <div className="bg-red-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-red-800 mb-3">
              📌 实用搭配
            </h3>
            <div className="space-y-3">
              {wordData.collocations.map((collocation, index) => (
                <div key={index} className="bg-white rounded-md border border-red-100 p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="font-medium text-red-700 text-sm break-words">• {collocation.phrase}</span>
                      <button
                        onClick={() => playPronunciation(collocation.phrase)}
                        className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors text-red-600 text-xs flex-shrink-0"
                        title="播放搭配发音"
                      >
                        🔊
                      </button>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0 self-start sm:self-center">
                      {collocation.context}
                    </Badge>
                  </div>
                  <div className="text-gray-700 text-xs sm:text-sm break-words">
                    {collocation.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-3 sm:my-4" />
        </>
      )}

      {/* Example Sentences - 修正渲染字段 */}
      {exampleSentencesData && exampleSentencesData.length > 0 && (
        <>
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-purple-800 mb-3">
              <Headphones className="w-5 h-5" /> 精选例句
            </h3>
            <div className="space-y-3">
              {exampleSentencesData.map((example: any, index: number) => (
                <div key={index} className="bg-white rounded-md border border-purple-100 p-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-gray-800 text-sm sm:text-base break-words flex-1">
                      {example.sentence}
                    </p>
                    <button
                      onClick={() => playPronunciation(example.sentence)}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-100 hover:bg-purple-200 rounded transition-colors text-purple-600 text-xs flex-shrink-0"
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
          <Separator className="my-3 sm:my-4" />
        </>
      )}

      {/* Footer */}
      <div className="mt-4 sm:mt-6 text-center text-xs text-gray-500">
        <div className="bg-gray-100 p-2 sm:p-3 rounded-md">
          <p className="break-words">🔴 = 教育部考纲核心词汇前3000 | 🔵 = 3000-5000 | ⚪️ = 5000-8000</p>
          <p className="mt-1 break-words">🤖 本卡片由AI生成，基于语言学习最佳实践</p>
        </div>
      </div>
    </Card>
  );
};

export default WordCard;
