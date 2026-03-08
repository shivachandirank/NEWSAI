import { NewsArticle } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Shield, ShieldAlert, Calendar, Globe, Tag } from "lucide-react";
import { format } from "date-fns";

interface Props {
  article: NewsArticle | null;
  open: boolean;
  onClose: () => void;
}

function getSentimentColor(label: string | null) {
  if (label === "Positive") return "bg-success/10 text-success border-success/20";
  if (label === "Negative") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground border-border";
}

export function ArticleDetailDialog({ article, open, onClose }: Props) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg leading-snug pr-6">{article.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {article.source && (
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {article.source}
              </span>
            )}
            {article.published_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {format(new Date(article.published_date), "MMM d, yyyy")}
              </span>
            )}
            {article.url && (
              <a href={article.url} target="_blank" rel="noopener" className="flex items-center gap-1 text-primary hover:underline">
                <ExternalLink className="h-3.5 w-3.5" /> Read Original
              </a>
            )}
          </div>

          {/* Analysis scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Sentiment</div>
              <Badge variant="outline" className={getSentimentColor(article.sentiment_label)}>
                {article.sentiment_label || "Unknown"}
              </Badge>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Score</div>
              <div className="text-lg font-mono font-bold text-foreground">
                {article.sentiment_score !== null ? (article.sentiment_score > 0 ? "+" : "") + article.sentiment_score.toFixed(2) : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Credibility</div>
              <div className="flex items-center justify-center gap-1">
                <Progress value={(article.credibility_score || 0) * 100} className="w-16 h-2" />
                <span className="text-sm font-mono">{((article.credibility_score || 0) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Verdict</div>
              {article.is_fake ? (
                <div className="flex items-center justify-center gap-1 text-destructive">
                  <ShieldAlert className="h-4 w-4" /> Suspicious
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 text-success">
                  <Shield className="h-4 w-4" /> Credible
                </div>
              )}
            </div>
          </div>

          {/* Topics */}
          {article.topics && article.topics.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-2">
                <Tag className="h-3.5 w-3.5" /> Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {article.topics.map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content preview */}
          <div>
            <div className="text-sm font-medium text-foreground mb-2">Content Preview</div>
            <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {article.content.slice(0, 1500)}
              {article.content.length > 1500 && "…"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
