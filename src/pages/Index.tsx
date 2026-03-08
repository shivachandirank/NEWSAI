import { useState, useEffect } from "react";
import { SearchPanel } from "@/components/SearchPanel";
import { StatsCards } from "@/components/StatsCards";
import { SentimentCharts } from "@/components/SentimentCharts";
import { ArticlesTable } from "@/components/ArticlesTable";
import { TopicsPanel } from "@/components/TopicsPanel";
import { FakeNewsPanel } from "@/components/FakeNewsPanel";
import { InsightsPanel } from "@/components/InsightsPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatedSection } from "@/components/AnimatedSection";
import { scrapeAndAnalyzeNews, fetchArticles, NewsArticle } from "@/lib/api";
import { toast } from "sonner";
import { Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

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
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="h-4.5 w-4.5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">NewsPulse</h1>
              <p className="text-xs text-muted-foreground">RAG-Powered Web Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <Activity className="h-3 w-3" />
              <span className="font-mono">{articles.length} articles</span>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono text-[10px]">K</kbd>
              <span>Search</span>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <AnimatedSection>
          <SearchPanel onScrape={handleScrape} isLoading={isAnalyzing} />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <StatsCards articles={articles} />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <SentimentCharts articles={articles} />
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopicsPanel articles={articles} />
            <FakeNewsPanel articles={articles} />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.35}>
          <InsightsPanel />
        </AnimatedSection>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatedSection delay={0.4}>
            <ArticlesTable articles={articles} />
          </AnimatedSection>
          <AnimatedSection delay={0.45}>
            <ChatPanel />
          </AnimatedSection>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NewsPulse — AI-powered news intelligence</span>
          <span className="font-mono">v1.0</span>
        </div>
      </footer>
    </div>
  );
}
