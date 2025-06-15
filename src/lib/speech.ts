
export const playPronunciation = (word: string) => {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    synth.speak(utterance);
  }
};
