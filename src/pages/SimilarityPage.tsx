import { useState, useEffect } from "react";
import { SimilarArticles } from "@/components/SimilarArticles";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function SimilarityPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Similar Articles</h1>
        <p className="text-sm text-muted-foreground">Find related articles using vector similarity across topics, sentiment, and entities</p>
      </div>
      <AnimatedSection>
        <SimilarArticles articles={articles} />
      </AnimatedSection>
    </div>
  );
}
