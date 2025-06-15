
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TestQuestion, generateAllQuestions } from '@/lib/phonetic-test-utils';

export const usePhoneticTest = (wordData: any) => {
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateQuestions = useCallback(() => {
    if (!wordData) {
      navigate('/');
      return;
    }
    const generatedQuestions = generateAllQuestions(wordData);
    if (!generatedQuestions) {
        toast.error('无法生成测试题目', {
            description: '缺少足够的相似发音单词来生成测试。'
        });
        navigate('/');
        return;
    }

    setQuestions(generatedQuestions);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
    setIsLoading(false);
  }, [wordData, navigate]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
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

  const handleRestart = () => {
    setIsLoading(true);
    generateQuestions();
  };

  return {
    isLoading,
    questions,
    currentQuestion,
    selectedAnswers,
    showResults,
    score,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRestart,
  };
};
