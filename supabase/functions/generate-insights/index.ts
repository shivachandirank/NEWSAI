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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: articles } = await supabase
      .from("news_articles")
      .select("title, sentiment_label, sentiment_score, topics, credibility_score, is_fake, domain, source")
      .order("created_at", { ascending: false })
      .limit(30);

    if (!articles?.length) {
      return new Response(JSON.stringify({ success: true, insight: "No articles in the database yet. Scrape some news to generate insights!" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const summary = articles.map(a =>
      `"${a.title}" - ${a.sentiment_label} (${a.sentiment_score}), Credibility: ${((a.credibility_score || 0) * 100).toFixed(0)}%, Topics: ${(a.topics || []).join(", ")}`
    ).join("\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a news intelligence analyst. Generate a concise, insightful summary of the current news landscape based on the articles provided. Focus on overall sentiment trends, key topics, credibility concerns, and actionable takeaways. Keep it to 3-4 sentences.",
          },
          { role: "user", content: `Analyze these recent articles and provide insights:\n\n${summary}` },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiRes.json();
    const insight = aiData.choices?.[0]?.message?.content || "Unable to generate insights.";

    return new Response(JSON.stringify({ success: true, insight }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-insights error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
