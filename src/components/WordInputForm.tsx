
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface WordInputFormProps {
  onSubmit: (wordData: any) => void;
}

const WordInputForm: React.FC<WordInputFormProps> = ({ onSubmit }) => {
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [meaning, setMeaning] = useState('');
  const [frequency, setFrequency] = useState('medium');
  const [frequencyNote, setFrequencyNote] = useState('');
  
  const [vowels, setVowels] = useState([
    { vowel: '', sound: '', similarWords: [''] }
  ]);
  
  const [etymology, setEtymology] = useState({
    root: '',
    affix: '',
    coreMeaning: '',
    changeMeaning: '',
    finalMeaning: ''
  });
  
  const [collocations, setCollocations] = useState([
    { phrase: '', meaning: '', context: '' }
  ]);

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

  const addCollocation = () => {
    setCollocations([...collocations, { phrase: '', meaning: '', context: '' }]);
  };

  const removeCollocation = (index: number) => {
    if (collocations.length > 1) {
      setCollocations(collocations.filter((_, i) => i !== index));
    }
  };

  const updateCollocation = (index: number, field: string, value: string) => {
    const updated = collocations.map((collocation, i) => 
      i === index ? { ...collocation, [field]: value } : collocation
    );
    setCollocations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wordData = {
      word,
      pronunciation,
      partOfSpeech,
      meaning,
      frequency,
      frequencyNote,
      vowels: vowels.filter(v => v.vowel && v.sound),
      etymology,
      collocations: collocations.filter(c => c.phrase && c.meaning)
    };
    onSubmit(wordData);
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📚 单词学习卡片制作器
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Vowel Analysis */}
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

        {/* Etymology */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">词根词缀分析</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>词根</Label>
              <Input
                value={etymology.root}
                onChange={(e) => setEtymology({...etymology, root: e.target.value})}
                placeholder="例: word"
              />
            </div>
            <div>
              <Label>词缀</Label>
              <Input
                value={etymology.affix}
                onChange={(e) => setEtymology({...etymology, affix: e.target.value})}
                placeholder="例: -s"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>核心含义</Label>
              <Input
                value={etymology.coreMeaning}
                onChange={(e) => setEtymology({...etymology, coreMeaning: e.target.value})}
                placeholder="例: 说话"
              />
            </div>
            <div>
              <Label>变化含义</Label>
              <Input
                value={etymology.changeMeaning}
                onChange={(e) => setEtymology({...etymology, changeMeaning: e.target.value})}
                placeholder="例: 复数"
              />
            </div>
          </div>
          <div>
            <Label>最终解释</Label>
            <Input
              value={etymology.finalMeaning}
              onChange={(e) => setEtymology({...etymology, finalMeaning: e.target.value})}
              placeholder="例: 多个说话的单位，即词语"
            />
          </div>
        </div>

        {/* Collocations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">实用搭配</Label>
            <Button type="button" onClick={addCollocation} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              添加搭配
            </Button>
          </div>
          
          {collocations.map((collocation, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">搭配 {index + 1}</span>
                {collocations.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeCollocation(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>搭配</Label>
                  <Input
                    value={collocation.phrase}
                    onChange={(e) => updateCollocation(index, 'phrase', e.target.value)}
                    placeholder="例: key word"
                  />
                </div>
                <div>
                  <Label>中文释义</Label>
                  <Input
                    value={collocation.meaning}
                    onChange={(e) => updateCollocation(index, 'meaning', e.target.value)}
                    placeholder="例: 关键词"
                  />
                </div>
                <div>
                  <Label>使用场景</Label>
                  <Select 
                    value={collocation.context} 
                    onValueChange={(value) => updateCollocation(index, 'context', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择场景" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="考试常用">考试常用</SelectItem>
                      <SelectItem value="学术常用">学术常用</SelectItem>
                      <SelectItem value="商务常用">商务常用</SelectItem>
                      <SelectItem value="日常常用">日常常用</SelectItem>
                      <SelectItem value="专业领域常用">专业领域常用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg">
          🎯 生成学习卡片
        </Button>
      </form>
    </Card>
  );
};

export default WordInputForm;
