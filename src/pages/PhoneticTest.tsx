
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { usePhoneticTest } from '@/hooks/usePhoneticTest';
import PhoneticTestHeader from '@/components/phonetic-test/PhoneticTestHeader';
import TestView from '@/components/phonetic-test/TestView';
import ResultsView from '@/components/phonetic-test/ResultsView';

const PhoneticTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wordData = location.state?.wordData;
  
  // Navigate away if wordData is not available
  React.useEffect(() => {
    if (!wordData) {
      navigate('/');
    }
  }, [wordData, navigate]);

  const {
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
  } = usePhoneticTest(wordData);

  if (!wordData || isLoading) {
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
        <PhoneticTestHeader word={wordData.word} />
        
        {!showResults ? (
          <TestView 
            questions={questions}
            currentQuestion={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        ) : (
          <ResultsView 
            score={score}
            questions={questions}
            selectedAnswers={selectedAnswers}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default PhoneticTest;
