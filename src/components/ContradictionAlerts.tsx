import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUpDown } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

interface ContradictionGroup {
  topic: string;
  articles: NewsArticle[];
  sentimentRange: number;
  avgPositive: number;
  avgNegative: number;
}

export function ContradictionAlerts({ articles }: Props) {
  const contradictions = useMemo(() => {
    // Group articles by topic overlap
    const topicArticles: Record<string, NewsArticle[]> = {};

    articles.forEach((a) => {
      (a.topics || []).forEach((topic) => {
        if (!topicArticles[topic]) topicArticles[topic] = [];
        topicArticles[topic].push(a);
      });
    });

    // Find topics with contradictory sentiment
    const groups: ContradictionGroup[] = [];

    Object.entries(topicArticles).forEach(([topic, arts]) => {
      if (arts.length < 2) return;

      const scores = arts.map((a) => a.sentiment_score || 0);
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      const range = max - min;

      if (range > 0.8) {
        const positive = arts.filter((a) => (a.sentiment_score || 0) > 0.2);
        const negative = arts.filter((a) => (a.sentiment_score || 0) < -0.2);

        if (positive.length > 0 && negative.length > 0) {
          groups.push({
            topic,
            articles: arts,
            sentimentRange: range,
            avgPositive: positive.reduce((s, a) => s + (a.sentiment_score || 0), 0) / positive.length,
            avgNegative: negative.reduce((s, a) => s + (a.sentiment_score || 0), 0) / negative.length,
          });
        }
      }
    });

    return groups.sort((a, b) => b.sentimentRange - a.sentimentRange);
  }, [articles]);

  if (!articles.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No data available for contradiction analysis.</p>
      </div>
    );
  }

  if (!contradictions.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center">
        <div className="text-success text-4xl mb-3">✓</div>
        <p className="text-sm font-semibold text-foreground">No Major Contradictions Detected</p>
        <p className="text-xs text-muted-foreground mt-1">News sources appear to agree on the current topics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg p-4 border-warning/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">
            {contradictions.length} Contradictory Coverage{contradictions.length > 1 ? "s" : ""} Detected
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          These topics have significantly different sentiment across sources, suggesting conflicting reporting.
        </p>
      </div>

      {contradictions.map((group, idx) => (
        <div key={idx} className="glass-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-warning" />
              <Badge variant="secondary" className="text-sm font-semibold">{group.topic}</Badge>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Range: {group.sentimentRange.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs text-success font-medium">Positive Coverage</p>
              <p className="text-lg font-bold text-foreground">{group.avgPositive.toFixed(2)}</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-medium">Negative Coverage</p>
              <p className="text-lg font-bold text-foreground">{group.avgNegative.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-1">
            {group.articles.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-xs">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: (a.sentiment_score || 0) > 0 ? "hsl(var(--success))" : "hsl(var(--destructive))",
                  }}
                />
                <span className="text-muted-foreground truncate">{a.source}</span>
                <span className="text-foreground truncate flex-1">{a.title}</span>
                <span className="font-mono">{(a.sentiment_score || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
