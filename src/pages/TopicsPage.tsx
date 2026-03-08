import { useState, useEffect } from "react";
import { TopicsPanel } from "@/components/TopicsPanel";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function TopicsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Topic Clusters</h1>
        <p className="text-sm text-muted-foreground">Discover trending topics across your analyzed news</p>
      </div>
      <AnimatedSection>
        <TopicsPanel articles={articles} />
      </AnimatedSection>
    </div>
  );
}
