
interface TestOption {
  word: string;
  pronunciation: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: TestOption[];
  targetVowel: string;
}

const generateOptions = (similarWords: any[], wordSet: string, correctWordIndex: number): TestOption[] => {
  const correctWordItem = similarWords[correctWordIndex % similarWords.length];

  const correctWords: TestOption[] = [];
  if (correctWordItem) {
    const word = typeof correctWordItem === 'string' ? correctWordItem : correctWordItem.word;
    const pronunciation = typeof correctWordItem === 'string' ? `/${word}/` : correctWordItem.pronunciation;
    correctWords.push({
      word,
      pronunciation,
      isCorrect: true
    });
  }

  const wordSets = {
    set1: [
      { word: 'apple', pronunciation: '/ˈæpəl/', isCorrect: false },
      { word: 'house', pronunciation: '/haʊs/', isCorrect: false },
      { word: 'blue', pronunciation: '/bluː/', isCorrect: false },
      { word: 'chair', pronunciation: '/tʃer/', isCorrect: false },
      { word: 'tree', pronunciation: '/triː/', isCorrect: false },
      { word: 'book', pronunciation: '/bʊk/', isCorrect: false }
    ],
    set2: [
      { word: 'orange', pronunciation: '/ˈɔːrɪndʒ/', isCorrect: false },
      { word: 'table', pronunciation: '/ˈteɪbəl/', isCorrect: false },
      { word: 'green', pronunciation: '/ɡriːn/', isCorrect: false },
      { word: 'phone', pronunciation: '/foʊn/', isCorrect: false },
      { word: 'yellow', pronunciation: '/ˈjeloʊ/', isCorrect: false },
      { word: 'purple', pronunciation: '/ˈpɜːrpəl/', isCorrect: false }
    ],
    set3: [
      { word: 'water', pronunciation: '/ˈwɔːtər/', isCorrect: false },
      { word: 'school', pronunciation: '/skuːl/', isCorrect: false },
      { word: 'happy', pronunciation: '/ˈhæpi/', isCorrect: false },
      { word: 'window', pronunciation: '/ˈwɪndoʊ/', isCorrect: false },
      { word: 'garden', pronunciation: '/ˈɡɑːrdən/', isCorrect: false },
      { word: 'kitchen', pronunciation: '/ˈkɪtʃən/', isCorrect: false }
    ]
  };

  const selectedSet = wordSets[wordSet as keyof typeof wordSets];
  const incorrectWords = selectedSet
    .filter(item => !correctWords.some(correct => correct.word === item.word))
    .slice(0, 3);

  const allOptions = [...correctWords, ...incorrectWords];
  return allOptions.sort(() => Math.random() - 0.5);
};

export const generateAllQuestions = (wordData: any): TestQuestion[] | null => {
  if (!wordData?.vowels || wordData.vowels.length === 0) {
    return null;
  }

  const vowelData = wordData.vowels[0];
  const targetWord = wordData.word;
  const targetVowel = vowelData.vowel;
  const similarWords = [...(vowelData.similarWords || [])].sort(() => Math.random() - 0.5);

  if (similarWords.length < 3) {
    return null;
  }

  const generatedQuestions: TestQuestion[] = [
    {
      id: 1,
      question: `下列哪些单词与 "${targetWord}" 中的 "${targetVowel}" 发音相同？`,
      options: generateOptions(similarWords, 'set1', 0),
      targetVowel
    },
    {
      id: 2,
      question: `选择与 "${targetWord}" 中 "${targetVowel}" 音标相同的单词：`,
      options: generateOptions(similarWords, 'set2', 1),
      targetVowel
    },
    {
      id: 3,
      question: `找出与 "${targetWord}" 元音发音规律相同的单词：`,
      options: generateOptions(similarWords, 'set3', 2),
      targetVowel
    }
  ];

  return generatedQuestions;
}
