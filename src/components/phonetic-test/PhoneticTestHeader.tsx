
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PhoneticTestHeaderProps {
  word: string;
}

const PhoneticTestHeader: React.FC<PhoneticTestHeaderProps> = ({ word }) => {
  const navigate = useNavigate();

  return (
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
        🎯 {word} 音标测试
      </h1>
      <div className="w-20" />
    </div>
  );
};

export default PhoneticTestHeader;
