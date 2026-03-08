import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  articles: NewsArticle[];
}

const BIAS_COLORS: Record<string, string> = {
  Left: "hsl(210, 70%, 50%)",
  "Center-Left": "hsl(200, 50%, 55%)",
  Center: "hsl(var(--muted-foreground))",
  "Center-Right": "hsl(30, 60%, 50%)",
  Right: "hsl(0, 65%, 50%)",
  Neutral: "hsl(var(--accent))",
};

export function BiasPanel({ articles }: Props) {
  const biasDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      if (a.bias_label) {
        counts[a.bias_label] = (counts[a.bias_label] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const avgBiasScore = useMemo(() => {
    const withBias = articles.filter((a) => a.bias_score !== null);
    if (!withBias.length) return 0;
    return withBias.reduce((sum, a) => sum + (a.bias_score || 0), 0) / withBias.length;
  }, [articles]);

  const highBiasArticles = useMemo(() => {
    return articles
      .filter((a) => (a.bias_score || 0) > 0.6)
      .sort((a, b) => (b.bias_score || 0) - (a.bias_score || 0))
      .slice(0, 6);
  }, [articles]);

  if (!biasDistribution.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No bias data available yet. Scan some news to see bias analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Average Bias Intensity</p>
            <p className="text-2xl font-bold text-foreground">{(avgBiasScore * 100).toFixed(0)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Articles Analyzed</p>
            <p className="text-lg font-semibold text-foreground">{articles.filter((a) => a.bias_label).length}</p>
          </div>
        </div>
        <Progress value={avgBiasScore * 100} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {avgBiasScore < 0.3 ? "Overall coverage is relatively unbiased" : avgBiasScore < 0.6 ? "Moderate bias detected across sources" : "High bias levels detected — cross-reference recommended"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Bias Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={biasDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="count" nameKey="label" label={({ label, count }) => `${label}: ${count}`}>
                {biasDistribution.map((entry) => (
                  <Cell key={entry.label} fill={BIAS_COLORS[entry.label] || "hsl(var(--muted))"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bias labels */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Bias Labels</h3>
          <div className="space-y-3">
            {biasDistribution.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: BIAS_COLORS[b.label] }} />
                <span className="text-sm text-foreground flex-1">{b.label}</span>
                <Badge variant="secondary">{b.count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High bias articles */}
      {highBiasArticles.length > 0 && (
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">⚠️ High Bias Articles</h3>
          <div className="space-y-2">
            {highBiasArticles.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs shrink-0" style={{ borderColor: BIAS_COLORS[a.bias_label || "Neutral"] }}>
                  {a.bias_label}
                </Badge>
                <span className="flex-1 text-sm text-foreground truncate">{a.title}</span>
                <span className="text-xs font-mono text-muted-foreground">{((a.bias_score || 0) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
