// AI Service - Direct API calls without Supabase
import type { AIProvider } from '@/config/gemini';

export interface WordData {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  frequency: string;
  frequencyNote: string;
  vowels: Array<{
    vowel: string;
    sound: string;
    similarWords: Array<{
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
  exampleSentences: Array<{
    sentence: string;
    translation: string;
  }>;
}

const getPrompt = (word: string) => `请为英语单词"${word}"生成完整的学习信息，以JSON格式返回，包含以下字段：
{
  "word": "${word}",
  "pronunciation": "音标，如/wɜːrd/",
  "partOfSpeech": "词性，如n.",
  "meaning": "中文含义",
  "frequency": "high/medium/low之一",
  "frequencyNote": "使用场景说明",
  "vowels": [
    {
      "vowel": "主要元音字母",
      "sound": "音标发音",
      "similarWords": [
        {
          "word": "同音规律单词1",
          "pronunciation": "音标",
          "meaning": "简单中文翻译"
        },
        {
          "word": "同音规律单词2",
          "pronunciation": "音标",
          "meaning": "简单中文翻译"
        },
        {
          "word": "同音规律单词3",
          "pronunciation": "音标",
          "meaning": "简单中文翻译"
        }
      ]
    }
  ],
  "etymology": {
    "root": "词根",
    "affix": "词缀",
    "coreMeaning": "核心含义",
    "changeMeaning": "变化含义",
    "finalMeaning": "最终解释"
  },
  "collocations": [
    {
      "phrase": "常用搭配",
      "meaning": "搭配含义",
      "context": "使用语境"
    }
  ],
  "exampleSentences": [
    {
      "sentence": "包含该单词的完整英文例句",
      "translation": "该例句的中文翻译"
    },
    {
      "sentence": "第二个例句",
      "translation": "第二个例句的翻译"
    }
  ]
}

注意：
1. similarWords数组中每个单词都要有word、pronunciation和meaning三个字段
2. meaning字段应该是简单的中文翻译，1-3个汉字即可，如"书"、"猫"、"工作"等
3. 同音词、常用搭配和例句各提供2-3个即可，不要太多
4. 确保所有单词的pronunciation都是准确的音标格式
5. 选择的同音词应该是常见的基础词汇，便于学习记忆

请确保返回的是有效的JSON格式，不要包含其他文字说明。`;

const getApiKey = (provider: AIProvider): string => {
  if (typeof window === 'undefined') return '';
  const key = localStorage.getItem(`${provider}_api_key`);
  if (!key) {
    throw new Error(`${provider === 'gemini' ? 'Gemini' : 'DeepSeek'} API密钥未配置`);
  }
  return key.trim();
};

export async function generateWordData(
  word: string,
  provider: AIProvider,
  model: string
): Promise<WordData> {
  const apiKey = getApiKey(provider);
  const prompt = getPrompt(word);

  let response: Response;
  let generatedText: string;

  if (provider === 'deepseek') {
    // DeepSeek API call
    response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error('DeepSeek 未返回内容');
    }

  } else {
    // Gemini API call
    const geminiModel = model || 'gemini-1.5-flash-latest';
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API 错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('Gemini 未返回内容');
    }
  }

  // Parse the JSON response
  try {
    const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    const wordData = JSON.parse(cleanedText);
    return wordData;
  } catch (parseError) {
    console.error('Failed to parse AI response:', generatedText);
    throw new Error('解析 AI 响应失败，请重试');
  }
}
