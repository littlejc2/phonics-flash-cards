
import React from 'react';

const WordCardFooter: React.FC = () => {
  return (
    <div className="mt-4 sm:mt-6 text-center text-xs text-gray-500">
      <div className="bg-gray-100 p-2 sm:p-3 rounded-md">
        <p className="break-words">🔴 = 教育部考纲核心词汇前3000 | 🔵 = 3000-5000 | ⚪️ = 5000-8000</p>
        <p className="mt-1 break-words">🤖 本卡片由AI生成，基于语言学习最佳实践</p>
      </div>
    </div>
  );
};

export default WordCardFooter;
