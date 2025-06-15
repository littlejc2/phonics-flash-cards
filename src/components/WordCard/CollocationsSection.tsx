
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { playPronunciation } from '@/lib/speech';

interface Collocation {
  phrase: string;
  meaning: string;
  context: string;
}

interface CollocationsSectionProps {
  collocations: Collocation[];
}

const CollocationsSection: React.FC<CollocationsSectionProps> = ({ collocations }) => {
  if (!collocations || collocations.length === 0) return null;

  return (
    <div className="bg-red-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
      <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-red-800 mb-3">
        📌 实用搭配
      </h3>
      <div className="space-y-3">
        {collocations.map((collocation, index) => (
          <div key={index} className="bg-white rounded-md border border-red-100 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-red-700 text-sm break-words">• {collocation.phrase}</span>
                <button
                  onClick={() => playPronunciation(collocation.phrase)}
                  className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors text-red-600 text-xs flex-shrink-0"
                  title="播放搭配发音"
                >
                  🔊
                </button>
              </div>
              <Badge variant="secondary" className="text-xs flex-shrink-0 self-start sm:self-center">
                {collocation.context}
              </Badge>
            </div>
            <div className="text-gray-700 text-xs sm:text-sm break-words">
              {collocation.meaning}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollocationsSection;
