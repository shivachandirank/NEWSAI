import { useState, useEffect } from "react";
import { StatsCards } from "@/components/StatsCards";
import { SentimentCharts } from "@/components/SentimentCharts";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function DashboardPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time sentiment analysis and trend breakdowns</p>
      </div>
      <AnimatedSection>
        <StatsCards articles={articles} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <SentimentCharts articles={articles} />
      </AnimatedSection>
    </div>
  );
}
