
import React from 'react';
import { Button } from '@/components/ui/button';

interface TestNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLastQuestion: boolean;
}

const TestNavigation: React.FC<TestNavigationProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  isLastQuestion,
}) => {
  return (
    <div className="flex justify-between">
      <Button
        onClick={onPrevious}
        variant="outline"
        disabled={isPreviousDisabled}
      >
        上一题
      </Button>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className="px-6"
      >
        {isLastQuestion ? '提交答案' : '下一题'}
      </Button>
    </div>
  );
};

export default TestNavigation;
