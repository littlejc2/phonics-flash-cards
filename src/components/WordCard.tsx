
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WordData, WordCardProps } from './WordCard/types';
import WordCardHeader from './WordCard/WordCardHeader';
import BasicInfoSection from './WordCard/BasicInfoSection';
import VowelAnalysisSection from './WordCard/VowelAnalysisSection';
import CollocationsSection from './WordCard/CollocationsSection';
import ExampleSentencesSection from './WordCard/ExampleSentencesSection';
import WordCardFooter from './WordCard/WordCardFooter';

const WordCard: React.FC<WordCardProps> = ({ wordData }) => {
  console.log('WordCard data:', wordData);
  console.log('Vowels data:', wordData.vowels);
  console.log('Example sentences data:', wordData.example_sentences);

  // 兼容性处理：支持 example_sentences 字段
  const exampleSentencesData = wordData.example_sentences || [];

  return (
    <Card className="w-full max-w-2xl mx-auto p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
      <WordCardHeader 
        word={wordData.word} 
        pronunciation={wordData.pronunciation} 
      />

      <BasicInfoSection
        partOfSpeech={wordData.part_of_speech}
        meaning={wordData.meaning}
        frequency={wordData.frequency}
        frequencyNote={wordData.frequency_note}
      />

      <Separator className="my-3 sm:my-4" />

      <VowelAnalysisSection 
        word={wordData.word}
        vowels={wordData.vowels}
      />
      
      {wordData.vowels && wordData.vowels.length > 0 && (
        <Separator className="my-3 sm:my-4" />
      )}

      <CollocationsSection collocations={wordData.collocations} />
      
      {wordData.collocations && wordData.collocations.length > 0 && (
        <Separator className="my-3 sm:my-4" />
      )}

      <ExampleSentencesSection exampleSentences={exampleSentencesData} />
      
      {exampleSentencesData && exampleSentencesData.length > 0 && (
        <Separator className="my-3 sm:my-4" />
      )}

      <WordCardFooter />
    </Card>
  );
};

export default WordCard;
