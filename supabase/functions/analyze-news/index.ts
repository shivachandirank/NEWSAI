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
    const { query, domain, count = 5 } = await req.json();
    if (!query) throw new Error("Query is required");

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!FIRECRAWL_API_KEY) throw new Error("FIRECRAWL_API_KEY not configured");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Step 1: Search news using Firecrawl
    console.log("Searching news for:", query);
    const searchQuery = domain ? `${query} ${domain} news` : `${query} news`;
    const searchRes = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: searchQuery,
        limit: count,
        tbs: "qdr:w",
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    const searchData = await searchRes.json();
    if (!searchRes.ok) {
      console.error("Firecrawl error:", searchData);
      throw new Error(`Firecrawl search failed: ${searchData.error || searchRes.status}`);
    }

    const articles = searchData.data || [];
    if (articles.length === 0) {
      return new Response(JSON.stringify({ success: true, articles: [], message: "No articles found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 2: Analyze each article with AI
    console.log(`Analyzing ${articles.length} articles...`);
    const analyzedArticles = [];

    for (const article of articles) {
      const content = article.markdown || article.description || "";
      const title = article.title || "Untitled";
      const truncatedContent = content.substring(0, 3000);

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
              content: `You are a news analysis AI. Analyze the given article and return structured analysis. You must call the analyze_article function with your results.`,
            },
            {
              role: "user",
              content: `Analyze this news article:\n\nTitle: ${title}\n\nContent: ${truncatedContent}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_article",
                description: "Return structured analysis of a news article",
                parameters: {
                  type: "object",
                  properties: {
                    sentiment_label: { type: "string", enum: ["Positive", "Negative", "Neutral"] },
                    sentiment_score: { type: "number", description: "Score from -1 (negative) to 1 (positive)" },
                    confidence_score: { type: "number", description: "Confidence 0-1" },
                    credibility_score: { type: "number", description: "Credibility 0-1, 1 = very credible" },
                    is_fake: { type: "boolean", description: "Whether article appears to be fake/misleading" },
                    topics: { type: "array", items: { type: "string" }, description: "3-5 key topics/keywords" },
                  },
                  required: ["sentiment_label", "sentiment_score", "confidence_score", "credibility_score", "is_fake", "topics"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_article" } },
        }),
      });

      if (!aiRes.ok) {
        if (aiRes.status === 429) {
          console.warn("Rate limited, skipping remaining articles");
          break;
        }
        console.error("AI error for article:", title, aiRes.status);
        continue;
      }

      const aiData = await aiRes.json();
      let analysis;
      try {
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        analysis = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error("Failed to parse AI response for:", title);
        continue;
      }

      const articleRecord = {
        title,
        source: article.url ? new URL(article.url).hostname : null,
        url: article.url || null,
        published_date: new Date().toISOString(),
        content: truncatedContent,
        sentiment_label: analysis.sentiment_label,
        sentiment_score: analysis.sentiment_score,
        confidence_score: analysis.confidence_score,
        credibility_score: analysis.credibility_score,
        is_fake: analysis.is_fake,
        topics: analysis.topics,
        query,
        domain: domain || null,
      };

      analyzedArticles.push(articleRecord);
    }

    // Step 3: Store in database
    if (analyzedArticles.length > 0) {
      const { error: insertError } = await supabase.from("news_articles").insert(analyzedArticles);
      if (insertError) console.error("Insert error:", insertError);
    }

    console.log(`Successfully analyzed ${analyzedArticles.length} articles`);
    return new Response(JSON.stringify({ success: true, articles: analyzedArticles }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-news error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
