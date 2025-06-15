
export interface WordData {
  id?: string;
  word: string;
  pronunciation: string;
  part_of_speech: string;
  meaning: string;
  frequency: 'high' | 'medium' | 'low';
  frequency_note: string;
  vowels: Array<{
    vowel: string;
    sound: string;
    similarWords: Array<string | {
      word: string;
      pronunciation: string;
      meaning: string;
    }>;
  }>;
  etymology: {
    root: string;
    affix: string;
    coreMeaning: string;
    changeMeaning: string;
    finalMeaning: string;
  };
  collocations: Array<{
    phrase: string;
    meaning: string;
    context: string;
  }>;
  example_sentences?: Array<{
    sentence: string;
    translation: string;
  }>;
}

export interface WordCardProps {
  wordData: WordData;
}
