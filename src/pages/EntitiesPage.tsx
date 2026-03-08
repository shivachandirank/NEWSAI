import { useState, useEffect } from "react";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function EntitiesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Knowledge Graph</h1>
        <p className="text-sm text-muted-foreground">Explore entities, relationships, and connections across your news corpus</p>
      </div>
      <AnimatedSection>
        <KnowledgeGraph articles={articles} />
      </AnimatedSection>
    </div>
  );
}
