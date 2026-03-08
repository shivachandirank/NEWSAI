import { useState, useEffect } from "react";
import { ContradictionAlerts } from "@/components/ContradictionAlerts";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function ContradictionsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Contradictory News</h1>
        <p className="text-sm text-muted-foreground">Detect conflicting reporting across different news sources on the same topics</p>
      </div>
      <AnimatedSection>
        <ContradictionAlerts articles={articles} />
      </AnimatedSection>
    </div>
  );
}
