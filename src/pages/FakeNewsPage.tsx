import { useState, useEffect } from "react";
import { FakeNewsPanel } from "@/components/FakeNewsPanel";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function FakeNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Credibility Detector</h1>
        <p className="text-sm text-muted-foreground">AI-powered fake news detection with confidence scoring</p>
      </div>
      <AnimatedSection>
        <FakeNewsPanel articles={articles} />
      </AnimatedSection>
    </div>
  );
}
