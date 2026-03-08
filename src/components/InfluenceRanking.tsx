import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Star } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

export function InfluenceRanking({ articles }: Props) {
  const ranked = useMemo(() => {
    return [...articles]
      .filter((a) => a.influence_score !== null && a.influence_score !== undefined)
      .sort((a, b) => (b.influence_score || 0) - (a.influence_score || 0));
  }, [articles]);

  const topSources = useMemo(() => {
    const sourceScores: Record<string, { total: number; count: number }> = {};
    ranked.forEach((a) => {
      const src = a.source || "Unknown";
      if (!sourceScores[src]) sourceScores[src] = { total: 0, count: 0 };
      sourceScores[src].total += a.influence_score || 0;
      sourceScores[src].count++;
    });
    return Object.entries(sourceScores)
      .map(([source, data]) => ({ source, avg: data.total / data.count, count: data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [ranked]);

  if (!ranked.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No influence scores available yet. Scan some news to generate rankings.</p>
      </div>
    );
  }

  const medalColors = ["hsl(48, 96%, 53%)", "hsl(0, 0%, 75%)", "hsl(30, 60%, 45%)"];

  return (
    <div className="space-y-4">
      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ranked.slice(0, 3).map((a, i) => (
          <div key={a.id} className="glass-card rounded-lg p-4 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Trophy className="h-5 w-5" style={{ color: medalColors[i] }} />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">#{i + 1}</p>
            <p className="text-sm text-foreground font-medium truncate mb-1">{a.title}</p>
            <p className="text-xs text-muted-foreground mb-2">{a.source}</p>
            <div className="text-lg font-bold" style={{ color: medalColors[i] }}>
              {((a.influence_score || 0) * 100).toFixed(0)}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Influence Score</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Full Ranking */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Article Influence Ranking
          </h3>
          <div className="space-y-3">
            {ranked.slice(0, 10).map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.source}</p>
                </div>
                <Progress value={(a.influence_score || 0) * 100} className="w-16 h-2" />
                <span className="text-xs font-mono font-semibold text-foreground w-8 text-right">
                  {((a.influence_score || 0) * 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Source Rankings */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Top Sources by Influence
          </h3>
          <div className="space-y-3">
            {topSources.map((s, i) => (
              <div key={s.source} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-5 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{s.source}</p>
                  <p className="text-xs text-muted-foreground">{s.count} articles</p>
                </div>
                <Progress value={s.avg * 100} className="w-16 h-2" />
                <span className="text-xs font-mono font-semibold text-foreground w-8 text-right">
                  {(s.avg * 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
