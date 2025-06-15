
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface CollocationData {
  phrase: string;
  meaning: string;
  context: string;
}

interface CollocationFormProps {
  collocations: CollocationData[];
  setCollocations: (collocations: CollocationData[]) => void;
}

const CollocationForm: React.FC<CollocationFormProps> = ({
  collocations,
  setCollocations,
}) => {
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

  return (
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
  );
};

export default CollocationForm;
