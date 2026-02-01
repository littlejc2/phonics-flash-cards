
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { word, provider = 'gemini', model } = await req.json();

    if (!word) {
      return new Response(
        JSON.stringify({ error: 'Word is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check API keys based on provider
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (provider === 'deepseek' && !deepseekApiKey) {
      return new Response(
        JSON.stringify({ error: 'DeepSeek API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (provider === 'gemini' && !geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if word already exists
    const { data: existingWord } = await supabase
      .from('words')
      .select('*')
      .eq('word', word.toLowerCase())
      .single();

    if (existingWord) {
      return new Response(
        JSON.stringify({ wordData: existingWord }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate word data using Gemini
    const prompt = `请为英语单词"${word}"生成完整的学习信息，以JSON格式返回，包含以下字段：
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

    // Generate content using selected AI provider
    let response: Response;
    let generatedText: string;

    if (provider === 'deepseek') {
      // DeepSeek API call
      response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`,
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
        console.error(`DeepSeek API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('DeepSeek API error response:', errorText);
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const deepseekData = await response.json();
      console.log('DeepSeek API response:', deepseekData);

      generatedText = deepseekData.choices?.[0]?.message?.content;
    } else {
      // Gemini API call (default)
      const geminiModel = model || 'gemini-1.5-flash-latest';
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      if (!response.ok) {
        console.error(`Gemini API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const geminiData = await response.json();
      console.log('Gemini API response:', geminiData);

      generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!generatedText) {
      console.error('No content generated by Gemini:', geminiData);
      throw new Error('No content generated by Gemini');
    }

    // Parse the JSON response from Gemini
    let wordData;
    try {
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      wordData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Failed to parse AI response');
    }

    // Store in database
    const { data: savedWord, error: saveError } = await supabase
      .from('words')
      .insert([{
        word: wordData.word.toLowerCase(),
        pronunciation: wordData.pronunciation,
        part_of_speech: wordData.partOfSpeech,
        meaning: wordData.meaning,
        frequency: wordData.frequency,
        frequency_note: wordData.frequencyNote,
        vowels: wordData.vowels,
        etymology: wordData.etymology,
        collocations: wordData.collocations,
        example_sentences: wordData.exampleSentences
      }])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving word:', saveError);
      // Return generated data even if save fails
      return new Response(
        JSON.stringify({ wordData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ wordData: savedWord }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-word-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
