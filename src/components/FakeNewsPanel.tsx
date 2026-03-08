import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, Shield, AlertTriangle } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

export function FakeNewsPanel({ articles }: Props) {
  const stats = useMemo(() => {
    const fake = articles.filter((a) => a.is_fake);
    const credible = articles.filter((a) => !a.is_fake);
    const avgCredibility =
      articles.length > 0
        ? articles.reduce((sum, a) => sum + (a.credibility_score || 0), 0) / articles.length
        : 0;
    return { fake: fake.length, credible: credible.length, avgCredibility };
  }, [articles]);

  if (!articles.length) return null;

  return (
    <div className="glass-card rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Fake News Detection</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <Shield className="h-6 w-6 mx-auto mb-1 text-success" />
          <div className="text-2xl font-bold text-foreground">{stats.credible}</div>
          <div className="text-xs text-muted-foreground">Credible</div>
        </div>
        <div className="text-center">
          <ShieldAlert className="h-6 w-6 mx-auto mb-1 text-destructive" />
          <div className="text-2xl font-bold text-foreground">{stats.fake}</div>
          <div className="text-xs text-muted-foreground">Suspicious</div>
        </div>
        <div className="text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-warning" />
          <div className="text-2xl font-bold text-foreground">{(stats.avgCredibility * 100).toFixed(0)}%</div>
          <div className="text-xs text-muted-foreground">Avg Credibility</div>
        </div>
      </div>
      <div className="space-y-2">
        {articles
          .filter((a) => a.credibility_score !== null)
          .slice(0, 5)
          .map((a) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="flex-1 truncate text-sm text-foreground">{a.title}</div>
              <Progress
                value={(a.credibility_score || 0) * 100}
                className="w-20 h-2"
              />
              <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                {((a.credibility_score || 0) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
