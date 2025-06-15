
ALTER TABLE public.words ADD COLUMN example_sentences JSONB DEFAULT '[]'::jsonb;
