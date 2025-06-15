import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface TestQuestion {
  id: number;
  question: string;
  options: Array<{
    word: string;
    pronunciation: string;
    isCorrect: boolean;
  }>;
  targetVowel: string;
}

const PhoneticTest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const wordData = location.state?.wordData;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);

  useEffect(() => {
    if (!wordData) {
      navigate('/');
      return;
    }
    
    generateQuestions();
  }, [wordData, navigate]);

  const generateQuestions = () => {
    if (!wordData?.vowels || wordData.vowels.length === 0) {
      toast.error('无法生成测试题目', {
        description: '该单词缺少元音分析数据'
      });
      navigate('/');
      return;
    }

    const vowelData = wordData.vowels[0];
    const targetWord = wordData.word;
    const targetVowel = vowelData.vowel;
    const similarWords = vowelData.similarWords || [];

    // Generate 3 questions with completely different word sets
    const generatedQuestions: TestQuestion[] = [
      {
        id: 1,
        question: `下列哪些单词与 "${targetWord}" 中的 "${targetVowel}" 发音相同？`,
        options: generateOptions(targetWord, similarWords, targetVowel, 'set1'),
        targetVowel
      },
      {
        id: 2,
        question: `选择与 "${targetWord}" 中 "${targetVowel}" 音标相同的单词：`,
        options: generateOptions(targetWord, similarWords, targetVowel, 'set2'),
        targetVowel
      },
      {
        id: 3,
        question: `找出与 "${targetWord}" 元音发音规律相同的单词：`,
        options: generateOptions(targetWord, similarWords, targetVowel, 'set3'),
        targetVowel
      }
    ];

    setQuestions(generatedQuestions);
  };

  const generateOptions = (targetWord: string, similarWords: any[], targetVowel: string, wordSet: string) => {
    // Get correct words from similar words
    const correctWords = similarWords.slice(0, 1).map(item => {
      if (typeof item === 'string') {
        return {
          word: item,
          pronunciation: `/${item}/`,
          isCorrect: true
        };
      }
      return {
        word: item.word,
        pronunciation: item.pronunciation,
        isCorrect: true
      };
    });

    // Define completely different word sets for each question
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

    // Select incorrect words from the specified set, ensuring no duplicates
    const selectedSet = wordSets[wordSet as keyof typeof wordSets];
    const incorrectWords = selectedSet
      .filter(item => !correctWords.some(correct => correct.word === item.word))
      .slice(0, 3); // Take 3 incorrect words

    // Combine and shuffle - 1 correct + 3 incorrect = 4 total options
    const allOptions = [...correctWords, ...incorrectWords];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      synth.speak(utterance);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      const selectedOption = selectedAnswers[index];
      if (selectedOption !== undefined && question.options[selectedOption]?.isCorrect) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    toast.success(`测试完成！`, {
      description: `您的得分是 ${finalScore} 分`
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
    generateQuestions();
  };

  if (!wordData || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">加载中...</h2>
          <p className="text-gray-600">正在生成测试题目</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            🎯 {wordData.word} 音标测试
          </h1>
          <div className="w-20" />
        </div>

        {!showResults ? (
          <Card className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  题目 {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {questions[currentQuestion]?.question}
              </h2>
              
              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestion] === index && (
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
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
              >
                上一题
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="px-6"
              >
                {currentQuestion === questions.length - 1 ? '提交答案' : '下一题'}
              </Button>
            </div>
          </Card>
        ) : (
          /* Results */
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

            {/* Answer Review */}
            <div className="text-left mb-6">
              <h3 className="text-lg font-semibold mb-4">答题回顾：</h3>
              {questions.map((question, index) => {
                const selectedOption = selectedAnswers[index];
                const isCorrect = selectedOption !== undefined && question.options[selectedOption]?.isCorrect;
                
                return (
                  <div key={index} className="mb-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl ${isCorrect ? '✅' : '❌'}`} />
                      <span className="text-sm text-gray-600">题目 {index + 1}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">您的答案：</span>
                      {selectedOption !== undefined ? 
                        question.options[selectedOption].word : '未选择'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleRestart} variant="outline">
                重新测试
              </Button>
              <Button onClick={() => navigate('/')}>
                返回首页
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PhoneticTest;
