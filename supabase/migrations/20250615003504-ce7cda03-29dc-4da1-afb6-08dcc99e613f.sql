
-- 创建词汇表存储单词数据
CREATE TABLE public.words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  pronunciation TEXT,
  part_of_speech TEXT,
  meaning TEXT,
  frequency TEXT,
  frequency_note TEXT,
  vowels JSONB DEFAULT '[]'::jsonb,
  etymology JSONB DEFAULT '{}'::jsonb,
  collocations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建用户学习记录表
CREATE TABLE public.user_word_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  word_id UUID REFERENCES public.words(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, word_id)
);

-- 启用行级安全策略
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_word_cards ENABLE ROW LEVEL SECURITY;

-- 词汇表的策略 - 所有人都可以查看，但只有通过 API 才能创建
CREATE POLICY "Anyone can view words" 
  ON public.words 
  FOR SELECT 
  USING (true);

CREATE POLICY "Service role can manage words" 
  ON public.words 
  FOR ALL 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- 用户学习记录的策略
CREATE POLICY "Users can view their own word cards" 
  ON public.user_word_cards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own word cards" 
  ON public.user_word_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own word cards" 
  ON public.user_word_cards 
  FOR DELETE 
  USING (auth.uid() = user_id);
