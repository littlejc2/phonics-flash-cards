
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicInfoFormProps {
  word: string;
  setWord: (value: string) => void;
  pronunciation: string;
  setPronunciation: (value: string) => void;
  partOfSpeech: string;
  setPartOfSpeech: (value: string) => void;
  meaning: string;
  setMeaning: (value: string) => void;
  frequency: string;
  setFrequency: (value: string) => void;
  frequencyNote: string;
  setFrequencyNote: (value: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  word,
  setWord,
  pronunciation,
  setPronunciation,
  partOfSpeech,
  setPartOfSpeech,
  meaning,
  setMeaning,
  frequency,
  setFrequency,
  frequencyNote,
  setFrequencyNote,
}) => {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="word">单词 *</Label>
          <Input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="输入要学习的单词"
            required
          />
        </div>
        <div>
          <Label htmlFor="pronunciation">音标 *</Label>
          <Input
            id="pronunciation"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="例: /wɜːrd/"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="partOfSpeech">词性 *</Label>
          <Input
            id="partOfSpeech"
            value={partOfSpeech}
            onChange={(e) => setPartOfSpeech(e.target.value)}
            placeholder="例: n."
            required
          />
        </div>
        <div>
          <Label htmlFor="meaning">核心含义 *</Label>
          <Input
            id="meaning"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="例: 单词，词语"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frequency">频率等级 *</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">🔴 极高频 (前3000)</SelectItem>
              <SelectItem value="medium">🔵 高频 (3000-5000)</SelectItem>
              <SelectItem value="low">⚪️ 中频 (5000-8000)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="frequencyNote">使用场景</Label>
          <Input
            id="frequencyNote"
            value={frequencyNote}
            onChange={(e) => setFrequencyNote(e.target.value)}
            placeholder="例: 考试常用"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
