-- Create table for storing scraped news articles and their analysis
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT,
  url TEXT,
  published_date TIMESTAMP WITH TIME ZONE,
  content TEXT NOT NULL,
  sentiment_label TEXT,
  sentiment_score NUMERIC,
  confidence_score NUMERIC,
  credibility_score NUMERIC,
  is_fake BOOLEAN,
  topics TEXT[],
  query TEXT,
  domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read articles" ON public.news_articles
  FOR SELECT USING (true);

-- Allow inserts/updates/deletes (service role)
CREATE POLICY "Anyone can insert articles" ON public.news_articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update articles" ON public.news_articles
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete articles" ON public.news_articles
  FOR DELETE USING (true);