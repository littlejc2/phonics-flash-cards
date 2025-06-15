
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EtymologyData {
  root: string;
  affix: string;
  coreMeaning: string;
  changeMeaning: string;
  finalMeaning: string;
}

interface EtymologyFormProps {
  etymology: EtymologyData;
  setEtymology: (etymology: EtymologyData) => void;
}

const EtymologyForm: React.FC<EtymologyFormProps> = ({
  etymology,
  setEtymology,
}) => {
  return (
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
  );
};

export default EtymologyForm;
