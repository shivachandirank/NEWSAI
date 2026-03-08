import { useState, useEffect } from "react";
import { EmotionPanel } from "@/components/EmotionPanel";
import { AnimatedSection } from "@/components/AnimatedSection";
import { fetchArticles, NewsArticle } from "@/lib/api";

export default function EmotionsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">Emotion Analysis</h1>
        <p className="text-sm text-muted-foreground">Detect joy, fear, anger, sadness, surprise, and disgust across news articles</p>
      </div>
      <AnimatedSection>
        <EmotionPanel articles={articles} />
      </AnimatedSection>
    </div>
  );
}
