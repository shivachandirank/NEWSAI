import { useState, useEffect } from "react";
import { TrendPrediction } from "@/components/TrendPrediction";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function TrendsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Trend Prediction</h1>
        <p className="text-sm text-muted-foreground">Time-series sentiment analysis and trend forecasting with popularity index</p>
      </div>
      <AnimatedSection>
        <TrendPrediction articles={articles} />
      </AnimatedSection>
    </div>
  );
}
