import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface Props {
  articles: NewsArticle[];
}

const COLORS = {
  Positive: "hsl(142, 71%, 45%)",
  Negative: "hsl(0, 72%, 51%)",
  Neutral: "hsl(220, 9%, 46%)",
};

export function SentimentCharts({ articles }: Props) {
  const pieData = useMemo(() => {
    const counts: Record<string, number> = { Positive: 0, Negative: 0, Neutral: 0 };
    articles.forEach((a) => {
      const label = a.sentiment_label || "Neutral";
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [articles]);

  const barData = useMemo(() => {
    return articles
      .slice(0, 10)
      .map((a) => ({
        name: (a.title || "").substring(0, 20) + "...",
        score: a.sentiment_score || 0,
        fill: COLORS[a.sentiment_label as keyof typeof COLORS] || COLORS.Neutral,
      }));
  }, [articles]);

  const trendData = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    let runningAvg = 0;
    return sorted.map((a, i) => {
      runningAvg = (runningAvg * i + (a.sentiment_score || 0)) / (i + 1);
      return {
        idx: i + 1,
        score: a.sentiment_score || 0,
        avg: Number(runningAvg.toFixed(3)),
      };
    });
  }, [articles]);

  if (!articles.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Pie Chart */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sentiment Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Neutral} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sentiment Scores</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Bar dataKey="score">
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Line */}
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sentiment Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="idx" tick={{ fontSize: 10 }} />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" dot={{ r: 3 }} strokeWidth={1.5} />
            <Line type="monotone" dataKey="avg" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
