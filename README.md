 NewsPulse — AI News Intelligence Platform
> Real-time news scraping, multi-dimensional AI analysis, and RAG-powered chat — all in a modern dark-themed dashboard.
## Overview
**NewsPulse** is an AI-powered news intelligence platform that automatically collects articles from the web and performs deep analysis across multiple dimensions: **sentiment**, **emotions**, **political bias**, **credibility (fake-news detection)**, **named entities**, **topics**, and **influence scoring**. It also features a **RAG chatbot** that grounds its answers in your actual scraped article database.
## Key Features
### News Collection
- **Firecrawl-powered search** — scrape fresh articles by topic, domain, or keyword
- Configurable article count (3–10 per scan)
- Domain filtering: Technology, Finance, Politics, Healthcare, Sports
### AI Analysis Pipeline (per article)
| Dimension | Output |
|---|---|
| **Sentiment** | Label (Positive / Negative / Neutral) + score (-1 to +1) |
| **Emotions** | 6-dimension breakdown: Joy, Fear, Anger, Sadness, Surprise, Disgust |
| **Credibility / Fake News** | 0–100% credibility score + fake/misleading flag |
| **Political Bias** | Label (Left → Right spectrum) + bias intensity score |
| **Topics** | Auto-extracted 3–5 key topics |
| **Entities** | People, Organizations, Locations, Technologies |
| **Influence Score** | Composite ranking based on sentiment strength + credibility + topic breadth |
### Interactive Dashboard
- **Sentiment distribution** — pie & bar charts with trend tracking
- **Emotion radar / bar charts** — visual emotional fingerprint of the news corpus
- **Topic analysis** — frequency bar chart + tag badges
- **Fake news panel** — credibility overview with shield indicators
- **Stats cards** — live article count, avg sentiment, avg credibility, bias breakdown
- **Influence ranking** — top influential articles
- **Knowledge graph** — entity relationship visualization (SVG)
### RAG Chatbot
- Conversational AI assistant grounded in **your scraped articles**
- Streaming responses (SSE)
- Answers questions about sentiment, emotions, bias, trends, entities, and topics
- Cites real article titles and data points
### AI Insights Generator
- One-click executive briefing
- Corpus-wide analysis: trends, bias patterns, credibility alerts, contradictory reporting, actionable recommendations
### Dedicated Analysis Pages
- `/emotions` — deep-dive emotion analytics
- `/bias` — source bias breakdown
- `/entities` — entity explorer + knowledge graph
- `/contradictions` — contradictory reporting detection
- `/influence` — influence leaderboard
- `/trends` — trend prediction & forecasting
- `/similarity` — similar article clustering
## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS v3, shadcn/ui components |
| **Animation** | Framer Motion |
| **Charts** | Recharts |
| **Backend / Database** | Supabase (PostgreSQL + Auth) |
| **Edge Functions** | Deno (serverless functions) |
| **AI / LLM** | Google Gemini (via Lovable AI Gateway or your own API key) |
| **Web Scraping** | Firecrawl |
| **Testing** | Vitest + React Testing Library |
## Architecture
```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React SPA     │──────│  Supabase Edge   │──────│  Firecrawl API  │
│  (Vite + TS)    │      │  Functions       │      │  (news scraping)│
└─────────────────┘      └──────────────────┘      └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐      ┌──────────────────┐
│  PostgreSQL DB  │◄─────│  Google Gemini   │
│  news_articles  │      │  (AI analysis)   │
└─────────────────┘      └──────────────────┘
```
### Edge Functions
| Function | File | Purpose |
|---|---|---|
| `analyze-news` | `supabase/functions/analyze-news/index.ts` | Scrape articles via Firecrawl, run full Gemini analysis pipeline, store results |
| `rag-chat` | `supabase/functions/rag-chat/index.ts` | Retrieve recent articles as context, stream Gemini responses via SSE |
| `generate-insights` | `supabase/functions/generate-insights/index.ts` | Generate corpus-wide executive briefing from latest 30 articles |
### Database Schema (news_articles)
```sql
id                  uuid (pk)
title               text
source              text
url                 text
published_date      timestamptz
content             text
sentiment_label     text        -- Positive | Negative | Neutral
sentiment_score     float       -- -1.0 to +1.0
confidence_score    float       -- 0.0 to 1.0
credibility_score   float       -- 0.0 to 1.0
is_fake             boolean
topics              text[]
emotions            jsonb       -- { joy, fear, anger, sadness, surprise, disgust }
bias_label          text        -- Left | Center-Left | Center | Center-Right | Right | Neutral
bias_score          float       -- 0.0 to 1.0
influence_score     float       -- 0.0 to 1.0
entities            jsonb       -- { people[], organizations[], locations[], technologies[] }
query               text        -- search query used
domain              text
created_at          timestamptz
```
## Getting Started
### Prerequisites
- Node.js 18+ and npm (or bun)
- A Supabase project
- Firecrawl API key (for scraping)
- Google Gemini API key (or Lovable AI Gateway key)
### 1. Clone & Install
```bash
git clone <your-repo-url>
cd newspulse
npm install
```
### 2. Environment Variables
Create a `.env` file in the project root:
```env
# Supabase (frontend connection)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
# Supabase project ID (for CLI / functions)
VITE_SUPABASE_PROJECT_ID=your-project-id
```
> Edge function secrets (`FIRECRAWL_API_KEY`, `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`) are configured in your Supabase dashboard under **Project Settings > Edge Functions** or via the Supabase CLI.
### 3. Database Setup
Run the migration to create the `news_articles` table (enable RLS + policies as needed):
```sql
CREATE TABLE public.news_articles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    source text,
    url text,
    published_date timestamptz,
    content text,
    sentiment_label text,
    sentiment_score float,
    confidence_score float,
    credibility_score float,
    is_fake boolean,
    topics text[],
    emotions jsonb,
    bias_label text,
    bias_score float,
    influence_score float,
    entities jsonb,
    query text,
    domain text,
    created_at timestamptz DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
-- Example policy: allow all reads (tighten for production)
CREATE POLICY "Allow public read" ON public.news_articles
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON public.news_articles
  FOR INSERT TO authenticated WITH CHECK (true);
-- Grants
GRANT SELECT, INSERT ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;
```
### 4. Deploy Edge Functions
```bash
# Install Supabase CLI if you haven't
npm install -g supabase
# Link your project
supabase link --project-ref your-project-ref
# Set secrets
supabase secrets set FIRECRAWL_API_KEY=your-firecrawl-key
supabase secrets set LOVABLE_API_KEY=your-lovable-or-gemini-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
# Deploy functions
supabase functions deploy analyze-news
supabase functions deploy rag-chat
supabase functions deploy generate-insights
```
### 5. Run Locally
```bash
The app will be available at `http://localhost:5173`.
### 6. Build for Production
```bash
npm run build
```
## Project Structure
```
├── public/                     # Static assets
├── src/
│   ├── components/             # React components (UI + feature panels)
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── SearchPanel.tsx
│   │   ├── SentimentCharts.tsx
│   │   ├── ArticlesTable.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── InsightsPanel.tsx
│   │   ├── FakeNewsPanel.tsx
│   │   ├── EmotionPanel.tsx
│   │   ├── TopicsPanel.tsx
│   │   ├── KnowledgeGraph.tsx
│   │   ├── BiasPanel.tsx
│   │   └── ...
│   ├── pages/                  # Route-level page components
│   ├── lib/
│   │   ├── api.ts              # Frontend API clients (Supabase + Edge Functions)
│   │   ├── utils.ts            # Utility helpers
│   │   └── export.ts           # CSV export logic
│   ├── hooks/                  # Custom React hooks
│   ├── integrations/supabase/  # Auto-generated Supabase client + types
│   ├── App.tsx                 # Router + providers
│   └── main.tsx                # Entry point
├── supabase/
│   ├── config.toml             # Edge function config
│   └── functions/              # Deno Edge Functions
│       ├── analyze-news/
│       ├── rag-chat/
│       └── generate-insights/
├── .env                        # Environment variables (gitignored)
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```
## Available Scripts
| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint |
| Test | `npm run test` | Run Vitest (once) |
| Test watch | `npm run test:watch` | Run Vitest in watch mode |
## Customization
### Switching to Your Own Gemini API Key
By default, edge functions call the Lovable AI Gateway. To use your own Google Gemini API key directly:
1. Update each edge function (`analyze-news`, `rag-chat`, `generate-insights`) to call `https://generativelanguage.googleapis.com/v1beta/models/...` instead of `https://ai.gateway.lovable.dev/v1/chat/completions`.
2. Replace `LOVABLE_API_KEY` with `GEMINI_API_KEY` in secrets and code.
3. Adjust request/response formatting to match the Gemini API spec.
## Roadmap / Ideas
- Scheduled scraping (cron-triggered edge function)
- User authentication + personal article collections
- Real-time updates via Supabase Realtime
- Export to PDF / scheduled email reports
- Multi-language article support
- Advanced contradiction detection with sentence-level comparison
## License
MIT — feel free to fork, extend, and build on top of NewsPulse.
---
Built with React, Supabase, Deno Edge Functions, Google Gemini, and Firecrawl.
