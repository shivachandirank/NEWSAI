import { supabase } from "@/integrations/supabase/client";

export interface NewsArticle {
  id: string;
  title: string;
  source: string | null;
  url: string | null;
  published_date: string | null;
  content: string;
  sentiment_label: string | null;
  sentiment_score: number | null;
  confidence_score: number | null;
  credibility_score: number | null;
  is_fake: boolean | null;
  topics: string[] | null;
  query: string | null;
  domain: string | null;
  created_at: string;
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export async function scrapeAndAnalyzeNews(query: string, domain: string, count: number): Promise<NewsArticle[]> {
  const { data, error } = await supabase.functions.invoke("analyze-news", {
    body: { query, domain, count },
  });
  if (error) throw new Error(error.message);
  if (!data.success) throw new Error(data.error || "Analysis failed");
  return data.articles;
}

export async function fetchArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function generateInsights(): Promise<string> {
  const { data, error } = await supabase.functions.invoke("generate-insights");
  if (error) throw new Error(error.message);
  return data.insight || data.error || "Unable to generate insights";
}

export async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: ChatMessage[];
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(`${FUNCTIONS_URL}/rag-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    if (resp.status === 429) throw new Error("Rate limited. Please try again shortly.");
    if (resp.status === 402) throw new Error("AI credits exhausted.");
    throw new Error("Chat failed");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // Flush remaining
  for (let raw of buffer.split("\n")) {
    if (!raw || !raw.startsWith("data: ")) continue;
    const json = raw.slice(6).trim();
    if (json === "[DONE]") continue;
    try {
      const parsed = JSON.parse(json);
      const c = parsed.choices?.[0]?.delta?.content;
      if (c) onDelta(c);
    } catch {}
  }

  onDone();
}
