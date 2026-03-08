import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Shield, ShieldAlert } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

function getSentimentColor(label: string | null) {
  if (label === "Positive") return "bg-success/10 text-success border-success/20";
  if (label === "Negative") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground border-border";
}

export function ArticlesTable({ articles }: Props) {
  if (!articles.length) {
    return (
      <div className="glass-card rounded-lg p-8 text-center text-muted-foreground">
        No articles yet. Search for news to get started.
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Analyzed Articles ({articles.length})</h3>
      </div>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        {articles.map((a) => (
          <div key={a.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">{a.title}</h4>
                  {a.url && (
                    <a href={a.url} target="_blank" rel="noopener" className="shrink-0 text-muted-foreground hover:text-primary">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {a.source && <span className="text-muted-foreground">{a.source}</span>}
                  <Badge variant="outline" className={getSentimentColor(a.sentiment_label)}>
                    {a.sentiment_label || "Unknown"}
                  </Badge>
                  {a.is_fake ? (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                      <ShieldAlert className="h-3 w-3" /> Suspicious
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
                      <Shield className="h-3 w-3" /> Credible
                    </Badge>
                  )}
                  {(a.topics || []).slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono text-foreground">
                  {a.sentiment_score !== null ? (a.sentiment_score > 0 ? "+" : "") + a.sentiment_score.toFixed(2) : "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {a.credibility_score !== null ? `${(a.credibility_score * 100).toFixed(0)}% credible` : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
