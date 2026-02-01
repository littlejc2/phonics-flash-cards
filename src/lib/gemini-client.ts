// Legacy file - use ai-client.ts for new implementations
import { generateWordData as generateWordDataNew } from './ai-client';
import type { AIProvider } from '@/config/gemini';

// Backward compatibility wrapper
export const generateWordData = async (word: string, provider?: AIProvider) => {
  const result = await generateWordDataNew(word, provider);
  return result.text;
};