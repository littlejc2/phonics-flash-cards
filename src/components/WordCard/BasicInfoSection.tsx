
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BasicInfoSectionProps {
  partOfSpeech: string;
  meaning: string;
  frequency: 'high' | 'medium' | 'low';
  frequencyNote: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  partOfSpeech,
  meaning,
  frequency,
  frequencyNote,
}) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'high': return '🔴';
      case 'medium': return '🔵';
      case 'low': return '⚪️';
      default: return '⚪️';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'high': return '极高频';
      case 'medium': return '高频';
      case 'low': return '中频';
      default: return '中频';
    }
  };

  return (
    <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
      <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-green-800 mb-2">
        📖 基本信息
      </h3>
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
          <span className="font-medium">词性：</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{partOfSpeech}</Badge>
            <span className="text-gray-700 text-sm break-words">{meaning}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-medium whitespace-nowrap">频率：</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getFrequencyIcon(frequency)}</span>
              <span className={`px-2 py-1 rounded text-white text-xs sm:text-sm whitespace-nowrap ${getFrequencyColor(frequency)}`}>
                {getFrequencyText(frequency)}
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {frequencyNote}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
