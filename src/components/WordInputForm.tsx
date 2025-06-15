
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BasicInfoForm from '@/components/forms/BasicInfoForm';
import VowelAnalysisForm from '@/components/forms/VowelAnalysisForm';
import EtymologyForm from '@/components/forms/EtymologyForm';
import CollocationForm from '@/components/forms/CollocationForm';

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
        <BasicInfoForm
          word={word}
          setWord={setWord}
          pronunciation={pronunciation}
          setPronunciation={setPronunciation}
          partOfSpeech={partOfSpeech}
          setPartOfSpeech={setPartOfSpeech}
          meaning={meaning}
          setMeaning={setMeaning}
          frequency={frequency}
          setFrequency={setFrequency}
          frequencyNote={frequencyNote}
          setFrequencyNote={setFrequencyNote}
        />

        <VowelAnalysisForm
          vowels={vowels}
          setVowels={setVowels}
        />

        <EtymologyForm
          etymology={etymology}
          setEtymology={setEtymology}
        />

        <CollocationForm
          collocations={collocations}
          setCollocations={setCollocations}
        />

        <Button type="submit" className="w-full" size="lg">
          🎯 生成学习卡片
        </Button>
      </form>
    </Card>
  );
};

export default WordInputForm;
