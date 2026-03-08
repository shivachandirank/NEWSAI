import { useState, useEffect } from "react";
import { BiasPanel } from "@/components/BiasPanel";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function BiasPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Bias Detection</h1>
        <p className="text-sm text-muted-foreground">Analyze political and ideological bias across news sources</p>
      </div>
      <AnimatedSection>
        <BiasPanel articles={articles} />
      </AnimatedSection>
    </div>
  );
}
