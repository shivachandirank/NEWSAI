import { useState, useEffect } from "react";
import { SearchPanel } from "@/components/SearchPanel";
import { StatsCards } from "@/components/StatsCards";
import { AnimatedSection } from "@/components/AnimatedSection";
import { scrapeAndAnalyzeNews, fetchArticles, NewsArticle } from "@/lib/api";
import { toast } from "sonner";

export default function SearchPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  const handleScrape = async (query: string, domain: string, count: number) => {
    setIsAnalyzing(true);
    try {
      const newArticles = await scrapeAndAnalyzeNews(query, domain, count);
      toast.success(`Analyzed ${newArticles.length} articles`);
      const all = await fetchArticles();
      setArticles(all);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">News Scanner</h1>
        <p className="text-sm text-muted-foreground">Scrape and analyze news from across the web</p>
      </div>
      <AnimatedSection>
        <SearchPanel onScrape={handleScrape} isLoading={isAnalyzing} />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <StatsCards articles={articles} />
      </AnimatedSection>
    </div>
  );
}
