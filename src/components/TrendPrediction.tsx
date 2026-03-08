import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  articles: NewsArticle[];
}

export function TrendPrediction({ articles }: Props) {
  const timeSeriesData = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Group by date
    const dateGroups: Record<string, { scores: number[]; count: number }> = {};
    sorted.forEach((a) => {
      const date = new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!dateGroups[date]) dateGroups[date] = { scores: [], count: 0 };
      dateGroups[date].scores.push(a.sentiment_score || 0);
      dateGroups[date].count++;
    });

    const data = Object.entries(dateGroups).map(([date, group]) => ({
      date,
      avg: Number((group.scores.reduce((a, b) => a + b, 0) / group.scores.length).toFixed(3)),
      positive: group.scores.filter((s) => s > 0.2).length,
      negative: group.scores.filter((s) => s < -0.2).length,
      neutral: group.scores.filter((s) => s >= -0.2 && s <= 0.2).length,
      volume: group.count,
    }));

    // Simple linear prediction (next 3 points)
    if (data.length >= 3) {
      const lastN = data.slice(-5);
      const avgDelta = lastN.reduce((sum, _, i) => {
        if (i === 0) return 0;
        return sum + (lastN[i].avg - lastN[i - 1].avg);
      }, 0) / (lastN.length - 1);

      for (let i = 1; i <= 3; i++) {
        const predicted = Math.max(-1, Math.min(1, data[data.length - 1].avg + avgDelta * i));
        data.push({
          date: `+${i}d`,
          avg: Number(predicted.toFixed(3)),
          positive: 0,
          negative: 0,
          neutral: 0,
          volume: 0,
        });
      }
    }

    return data;
  }, [articles]);

  const trend = useMemo(() => {
    const actual = timeSeriesData.filter((d) => !d.date.startsWith("+"));
    if (actual.length < 2) return "stable";
    const recent = actual.slice(-3);
    const avgRecent = recent.reduce((s, d) => s + d.avg, 0) / recent.length;
    const older = actual.slice(0, Math.max(1, actual.length - 3));
    const avgOlder = older.reduce((s, d) => s + d.avg, 0) / older.length;
    const diff = avgRecent - avgOlder;
    if (diff > 0.1) return "rising";
    if (diff < -0.1) return "falling";
    return "stable";
  }, [timeSeriesData]);

  const topicTrends = useMemo(() => {
    const topicDates: Record<string, Record<string, number>> = {};
    articles.forEach((a) => {
      const date = new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      (a.topics || []).forEach((topic) => {
        if (!topicDates[topic]) topicDates[topic] = {};
        topicDates[topic][date] = (topicDates[topic][date] || 0) + 1;
      });
    });

    return Object.entries(topicDates)
      .map(([topic, dates]) => ({
        topic,
        total: Object.values(dates).reduce((a, b) => a + b, 0),
        trend: Object.values(dates),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [articles]);

  if (!articles.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No data for trend prediction. Scan some news first.</p>
      </div>
    );
  }

  const TrendIcon = trend === "rising" ? TrendingUp : trend === "falling" ? TrendingDown : Minus;
  const trendColor = trend === "rising" ? "text-success" : trend === "falling" ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="space-y-4">
      {/* Trend Indicator */}
      <div className="glass-card rounded-lg p-5 flex items-center gap-4">
        <TrendIcon className={`h-8 w-8 ${trendColor}`} />
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Sentiment Trend</p>
          <p className="text-xl font-bold text-foreground capitalize">{trend}</p>
          <p className="text-xs text-muted-foreground">Based on recent article analysis</p>
        </div>
      </div>

      {/* Main Prediction Chart */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sentiment Timeline with Prediction</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[-1, 1]} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="avg" stroke="hsl(var(--primary))" fill="url(#sentGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Dashed portion (+1d, +2d, +3d) shows predicted sentiment trajectory
        </p>
      </div>

      {/* Volume Chart */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Article Volume Over Time</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timeSeriesData.filter((d) => !d.date.startsWith("+"))}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="volume" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trending Topics */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Topic Popularity Index</h3>
        <div className="flex flex-wrap gap-2">
          {topicTrends.map((t, i) => (
            <Badge
              key={t.topic}
              variant={i < 3 ? "default" : "secondary"}
              className="gap-1 text-xs"
            >
              {i < 3 && "🔥"} {t.topic}
              <span className="font-mono">({t.total})</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
