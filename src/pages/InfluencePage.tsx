import { useState, useEffect } from "react";
import { InfluenceRanking } from "@/components/InfluenceRanking";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function InfluencePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Influence Ranking</h1>
        <p className="text-sm text-muted-foreground">Rank articles by their overall influence score combining sentiment, credibility, and reach</p>
      </div>
      <AnimatedSection>
        <InfluenceRanking articles={articles} />
      </AnimatedSection>
    </div>
  );
}
