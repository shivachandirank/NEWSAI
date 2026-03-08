
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS emotions jsonb DEFAULT null,
  ADD COLUMN IF NOT EXISTS bias_label text DEFAULT null,
  ADD COLUMN IF NOT EXISTS bias_score numeric DEFAULT null,
  ADD COLUMN IF NOT EXISTS influence_score numeric DEFAULT null,
  ADD COLUMN IF NOT EXISTS entities jsonb DEFAULT null;
