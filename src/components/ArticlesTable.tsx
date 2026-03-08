import { useState } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Shield, ShieldAlert, Download, Search, ChevronUp, ChevronDown } from "lucide-react";
import { ArticleDetailDialog } from "@/components/ArticleDetailDialog";
import { exportArticlesCSV } from "@/lib/export";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  articles: NewsArticle[];
}

function getSentimentColor(label: string | null) {
  if (label === "Positive") return "bg-success/10 text-success border-success/20";
  if (label === "Negative") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground border-border";
}

type SortKey = "title" | "sentiment_score" | "credibility_score" | "created_at";

export function ArticlesTable({ articles }: Props) {
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = articles
    .filter((a) => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      return a.title.toLowerCase().includes(q) ||
        (a.source || "").toLowerCase().includes(q) ||
        (a.topics || []).some((t) => t.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const m = sortAsc ? 1 : -1;
      if (sortKey === "title") return m * a.title.localeCompare(b.title);
      if (sortKey === "sentiment_score") return m * ((a.sentiment_score || 0) - (b.sentiment_score || 0));
      if (sortKey === "credibility_score") return m * ((a.credibility_score || 0) - (b.credibility_score || 0));
      return m * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return null;
    return sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  if (!articles.length) {
    return (
      <div className="glass-card rounded-lg p-8 text-center text-muted-foreground">
        No articles yet. Search for news to get started.
      </div>
    );
  }

  return (
    <AnimatedSection delay={0.2}>
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground shrink-0">Articles ({filtered.length})</h3>
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter articles..."
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Button size="sm" variant="outline" className="gap-1 h-8" onClick={() => exportArticlesCSV(articles)}>
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
          </div>
        </div>

        {/* Sort headers */}
        <div className="grid grid-cols-[1fr,80px,80px] gap-2 px-4 py-2 border-b border-border text-xs text-muted-foreground">
          <button onClick={() => handleSort("title")} className="flex items-center gap-1 hover:text-foreground transition-colors text-left">Title <SortIcon k="title" /></button>
          <button onClick={() => handleSort("sentiment_score")} className="flex items-center gap-1 hover:text-foreground transition-colors">Sentiment <SortIcon k="sentiment_score" /></button>
          <button onClick={() => handleSort("credibility_score")} className="flex items-center gap-1 hover:text-foreground transition-colors">Cred. <SortIcon k="credibility_score" /></button>
        </div>

        <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {filtered.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[1fr,80px,80px] gap-2 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelected(a)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground truncate text-sm">{a.title}</h4>
                    {a.url && (
                      <a href={a.url} target="_blank" rel="noopener" className="shrink-0 text-muted-foreground hover:text-primary" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {a.source && <span className="text-xs text-muted-foreground">{a.source}</span>}
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getSentimentColor(a.sentiment_label)}`}>
                      {a.sentiment_label || "Unknown"}
                    </Badge>
                    {a.is_fake ? (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-destructive/10 text-destructive border-destructive/20 gap-0.5">
                        <ShieldAlert className="h-2.5 w-2.5" /> Suspicious
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-success/10 text-success border-success/20 gap-0.5">
                        <Shield className="h-2.5 w-2.5" /> Credible
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm font-mono text-foreground text-center self-center">
                  {a.sentiment_score !== null ? (a.sentiment_score > 0 ? "+" : "") + a.sentiment_score.toFixed(2) : "—"}
                </div>
                <div className="text-sm font-mono text-muted-foreground text-center self-center">
                  {a.credibility_score !== null ? `${(a.credibility_score * 100).toFixed(0)}%` : "—"}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ArticleDetailDialog article={selected} open={!!selected} onClose={() => setSelected(null)} />
    </AnimatedSection>
  );
}
