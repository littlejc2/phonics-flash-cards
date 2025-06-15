
import React from 'react';

interface TestProgressProps {
  current: number;
  total: number;
}

const TestProgress: React.FC<TestProgressProps> = ({ current, total }) => {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          题目 {current + 1} / {total}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default TestProgress;
