import { useState, useEffect } from "react";
import { ArticlesTable } from "@/components/ArticlesTable";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Article Explorer</h1>
        <p className="text-sm text-muted-foreground">Browse, sort, filter, and export all analyzed articles</p>
      </div>
      <AnimatedSection>
        <ArticlesTable articles={articles} />
      </AnimatedSection>
    </div>
  );
}
