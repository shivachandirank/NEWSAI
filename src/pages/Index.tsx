import { useState, useEffect } from "react";
import { SearchPanel } from "@/components/SearchPanel";
import { StatsCards } from "@/components/StatsCards";
import { SentimentCharts } from "@/components/SentimentCharts";
import { ArticlesTable } from "@/components/ArticlesTable";
import { TopicsPanel } from "@/components/TopicsPanel";
import { FakeNewsPanel } from "@/components/FakeNewsPanel";
import { InsightsPanel } from "@/components/InsightsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { scrapeAndAnalyzeNews, fetchArticles, NewsArticle } from "@/lib/api";
import { toast } from "sonner";
import { Zap } from "lucide-react";

export default function Index() {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">NewsPulse</h1>
            <p className="text-xs text-muted-foreground">RAG-Powered Web Intelligence</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <SearchPanel onScrape={handleScrape} isLoading={isAnalyzing} />
        <StatsCards articles={articles} />
        <SentimentCharts articles={articles} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopicsPanel articles={articles} />
          <FakeNewsPanel articles={articles} />
        </div>

        <InsightsPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ArticlesTable articles={articles} />
          <ChatPanel />
        </div>
      </main>
    </div>
  );
}
