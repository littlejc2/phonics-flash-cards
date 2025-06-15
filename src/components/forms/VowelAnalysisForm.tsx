
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface VowelData {
  vowel: string;
  sound: string;
  similarWords: string[];
}

interface VowelAnalysisFormProps {
  vowels: VowelData[];
  setVowels: (vowels: VowelData[]) => void;
}

const VowelAnalysisForm: React.FC<VowelAnalysisFormProps> = ({
  vowels,
  setVowels,
}) => {
  const addVowel = () => {
    setVowels([...vowels, { vowel: '', sound: '', similarWords: [''] }]);
  };

  const removeVowel = (index: number) => {
    if (vowels.length > 1) {
      setVowels(vowels.filter((_, i) => i !== index));
    }
  };

  const updateVowel = (index: number, field: string, value: string) => {
    const updated = vowels.map((vowel, i) => 
      i === index ? { ...vowel, [field]: value } : vowel
    );
    setVowels(updated);
  };

  const addSimilarWord = (vowelIndex: number) => {
    const updated = vowels.map((vowel, i) => 
      i === vowelIndex ? { ...vowel, similarWords: [...vowel.similarWords, ''] } : vowel
    );
    setVowels(updated);
  };

  const removeSimilarWord = (vowelIndex: number, wordIndex: number) => {
    const updated = vowels.map((vowel, i) => 
      i === vowelIndex ? { 
        ...vowel, 
        similarWords: vowel.similarWords.filter((_, j) => j !== wordIndex) 
      } : vowel
    );
    setVowels(updated);
  };

  const updateSimilarWord = (vowelIndex: number, wordIndex: number, value: string) => {
    const updated = vowels.map((vowel, i) => 
      i === vowelIndex ? { 
        ...vowel, 
        similarWords: vowel.similarWords.map((word, j) => j === wordIndex ? value : word)
      } : vowel
    );
    setVowels(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">元音分析</Label>
        <Button type="button" onClick={addVowel} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          添加元音
        </Button>
      </div>
      
      {vowels.map((vowel, vowelIndex) => (
        <div key={vowelIndex} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">元音 {vowelIndex + 1}</span>
            {vowels.length > 1 && (
              <Button
                type="button"
                onClick={() => removeVowel(vowelIndex)}
                size="sm"
                variant="outline"
                className="text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>元音字母</Label>
              <Input
                value={vowel.vowel}
                onChange={(e) => updateVowel(vowelIndex, 'vowel', e.target.value)}
                placeholder="例: o"
              />
            </div>
            <div>
              <Label>发音说明</Label>
              <Input
                value={vowel.sound}
                onChange={(e) => updateVowel(vowelIndex, 'sound', e.target.value)}
                placeholder="例: 发/ɜː/音"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>同音词</Label>
              <Button
                type="button"
                onClick={() => addSimilarWord(vowelIndex)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {vowel.similarWords.map((word, wordIndex) => (
                <div key={wordIndex} className="flex items-center gap-1">
                  <Input
                    value={word}
                    onChange={(e) => updateSimilarWord(vowelIndex, wordIndex, e.target.value)}
                    placeholder="同音词"
                    className="text-sm"
                  />
                  {vowel.similarWords.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSimilarWord(vowelIndex, wordIndex)}
                      size="sm"
                      variant="outline"
                      className="p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VowelAnalysisForm;
