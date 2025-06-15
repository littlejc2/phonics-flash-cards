
import React from 'react';
import { Card } from '@/components/ui/card';
import TestProgress from './TestProgress';
import QuestionOptions from './QuestionOptions';
import TestNavigation from './TestNavigation';
import { TestQuestion } from '@/lib/phonetic-test-utils';

interface TestViewProps {
  questions: TestQuestion[];
  currentQuestion: number;
  selectedAnswers: number[];
  onAnswerSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const TestView: React.FC<TestViewProps> = ({
  questions,
  currentQuestion,
  selectedAnswers,
  onAnswerSelect,
  onNext,
  onPrevious,
}) => {
  const question = questions[currentQuestion];
  if (!question) return null;

  return (
    <Card className="p-6">
      <TestProgress current={currentQuestion} total={questions.length} />
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {question.question}
        </h2>
        <QuestionOptions 
          options={question.options}
          selectedAnswer={selectedAnswers[currentQuestion]}
          onAnswerSelect={onAnswerSelect}
        />
      </div>
      <TestNavigation 
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={currentQuestion === 0}
        isNextDisabled={selectedAnswers[currentQuestion] === undefined}
        isLastQuestion={currentQuestion === questions.length - 1}
      />
    </Card>
  );
};

export default TestView;
