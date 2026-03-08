import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!messages?.length) throw new Error("Messages required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // RAG: Retrieve relevant articles from DB based on latest user message
    const userMsg = messages[messages.length - 1]?.content || "";
    const { data: articles } = await supabase
      .from("news_articles")
      .select("title, source, sentiment_label, sentiment_score, topics, content, url, credibility_score, is_fake, published_date")
      .order("created_at", { ascending: false })
      .limit(20);

    // Build context from retrieved articles
    const context = (articles || [])
      .map(
        (a, i) =>
          `[Article ${i + 1}] "${a.title}" (${a.source}) - Sentiment: ${a.sentiment_label} (${a.sentiment_score}), ` +
          `Credibility: ${(a.credibility_score * 100).toFixed(0)}%, Fake: ${a.is_fake ? "Yes" : "No"}, ` +
          `Topics: ${(a.topics || []).join(", ")}\n` +
          `Content: ${(a.content || "").substring(0, 500)}\n`
      )
      .join("\n");

    const systemPrompt = `You are NewsPulse AI, an intelligent news analysis assistant. You have access to a database of recently analyzed news articles. Use the following context to answer questions about news sentiment, trends, fake news, and topics.

CONTEXT (Recent News Articles):
${context || "No articles found in the database yet. Suggest the user scrape some news first."}

Instructions:
- Answer questions about news sentiment, trends, and topics based on the context
- Cite specific articles when relevant
- Provide data-driven insights
- If asked about sentiment trends, summarize the overall patterns
- Be concise but informative`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("rag-chat error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
