import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { TrendingUp, TrendingDown, Minus, Newspaper, BarChart3, Shield, Heart, Scale } from "lucide-react";
import { AnimatedCard } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

interface Props {
  articles: NewsArticle[];
}

function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{decimals > 0 ? value.toFixed(decimals) : value}{suffix}
    </motion.span>
  );
}

export function StatsCards({ articles }: Props) {
  const stats = useMemo(() => {
    const total = articles.length;
    const positive = articles.filter((a) => a.sentiment_label === "Positive").length;
    const negative = articles.filter((a) => a.sentiment_label === "Negative").length;
    const avgScore = total > 0
      ? articles.reduce((s, a) => s + (a.sentiment_score || 0), 0) / total
      : 0;
    const avgCred = total > 0
      ? articles.reduce((s, a) => s + (a.credibility_score || 0), 0) / total
      : 0;
    const fakeCount = articles.filter((a) => a.is_fake).length;
    
    const withEmotions = articles.filter(a => a.emotions);
    const dominantEmotion = withEmotions.length > 0 ? (() => {
      const sums: Record<string, number> = {};
      withEmotions.forEach(a => {
        if (a.emotions) {
          Object.entries(a.emotions).forEach(([k, v]) => {
            sums[k] = (sums[k] || 0) + (v as number);
          });
        }
      });
      const top = Object.entries(sums).sort((a, b) => b[1] - a[1])[0];
      return top ? top[0] : "—";
    })() : "—";

    const avgBias = total > 0
      ? articles.reduce((s, a) => s + (a.bias_score || 0), 0) / total
      : 0;

    return { total, positive, negative, avgScore, avgCred, fakeCount, dominantEmotion, avgBias };
  }, [articles]);

  const cards = [
    { label: "Total Articles", value: <AnimatedNumber value={stats.total} />, icon: Newspaper, color: "text-primary" },
    { label: "Avg Sentiment", value: <AnimatedNumber value={stats.avgScore} decimals={2} prefix={stats.avgScore > 0 ? "+" : ""} />, icon: stats.avgScore > 0 ? TrendingUp : stats.avgScore < 0 ? TrendingDown : Minus, color: stats.avgScore > 0 ? "text-success" : stats.avgScore < 0 ? "text-destructive" : "text-muted-foreground" },
    { label: "Positive / Negative", value: <><AnimatedNumber value={stats.positive} /> / <AnimatedNumber value={stats.negative} /></>, icon: BarChart3, color: "text-primary" },
    { label: "Avg Credibility", value: <AnimatedNumber value={Math.round(stats.avgCred * 100)} suffix="%" />, icon: Shield, color: stats.avgCred > 0.7 ? "text-success" : "text-warning" },
    { label: "Top Emotion", value: <span className="capitalize">{stats.dominantEmotion}</span>, icon: Heart, color: "text-warning" },
    { label: "Avg Bias", value: <AnimatedNumber value={Math.round(stats.avgBias * 100)} suffix="%" />, icon: Scale, color: stats.avgBias > 0.5 ? "text-destructive" : "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => (
        <AnimatedCard key={c.label} delay={i * 0.1}>
          <div className="glass-card rounded-lg p-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <c.icon className={`h-4 w-4 ${c.color}`} />
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
              <div className="text-xl font-bold text-foreground">{c.value}</div>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
