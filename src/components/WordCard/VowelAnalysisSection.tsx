import React from 'react';
import { playPronunciation } from '@/lib/speech';

interface VowelData {
  vowel: string;
  sound: string;
  similarWords: Array<string | {
    word: string;
    pronunciation: string;
    meaning: string;
  }>;
}

interface VowelAnalysisSectionProps {
  word: string;
  vowels: VowelData[];
}

const VowelAnalysisSection: React.FC<VowelAnalysisSectionProps> = ({ word, vowels }) => {
  const highlightVowels = (word: string, vowel: string) => {
    if (!word || !vowel) return word || '';
    const regex = new RegExp(`(${vowel})`, 'gi');
    return word.replace(regex, `<span class="bg-yellow-300 text-red-600 font-bold underline">$1</span>`);
  };

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

  const getSortedSimilarWords = (similarWords: Array<string | {word: string; pronunciation: string; meaning: string}>, originalWord: string, vowel: string) => {
    if (!similarWords || !Array.isArray(similarWords)) return [];
    
    const safeVowel = vowel?.toLowerCase() || '';
    
    const normalizedWords = similarWords.map(item => {
      if (typeof item === 'string') {
        return {
          word: item,
          pronunciation: `/${item}/`,
          meaning: getSimpleMeaning(item)
        };
      }
      return item;
    });
    
    const sorted = [...normalizedWords].sort((a, b) => {
      const aWord = a.word?.toLowerCase() || '';
      const bWord = b.word?.toLowerCase() || '';
      
      const aHasSameLetters = safeVowel && aWord.includes(safeVowel);
      const bHasSameLetters = safeVowel && bWord.includes(safeVowel);
      
      if (aHasSameLetters && !bHasSameLetters) return -1;
      if (!aHasSameLetters && bHasSameLetters) return 1;
      
      return aWord.localeCompare(bWord);
    });
    
    return sorted.slice(0, 3);
  };

  if (!vowels || vowels.length === 0) return null;

  return (
    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
      <h3 className="text-base sm:text-lg font-semibold text-yellow-800 mb-3">🎵 元音音标同音词</h3>
      <div className="space-y-3">
        <div className="font-bold text-lg sm:text-xl mb-2">
          <span 
            dangerouslySetInnerHTML={{ 
              __html: highlightVowels(word, vowels[0]?.vowel || '') 
            }} 
          />
        </div>
        {vowels.map((vowelData, index) => {
          const sortedSimilarWords = getSortedSimilarWords(vowelData.similarWords, word, vowelData.vowel);
          
          return (
            <div key={index} className="space-y-2">
              <div className="font-semibold text-orange-700 text-sm sm:text-base break-words">
                #{vowelData.vowel}：例子{word}，{vowelData.sound}
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
  );
};

export default VowelAnalysisSection;
