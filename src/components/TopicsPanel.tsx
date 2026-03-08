import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  articles: NewsArticle[];
}

export function TopicsPanel({ articles }: Props) {
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach((a) => {
      (a.topics || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([topic, count]) => ({ topic, count }));
  }, [articles]);

  if (!articles.length) return null;

  return (
    <div className="glass-card rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Extracted Topics</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {topicCounts.map(({ topic, count }) => (
          <Badge key={topic} variant="secondary" className="gap-1">
            {topic} <span className="text-xs text-muted-foreground">({count})</span>
          </Badge>
        ))}
      </div>
      {topicCounts.length > 3 && (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topicCounts.slice(0, 8)} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="topic" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
