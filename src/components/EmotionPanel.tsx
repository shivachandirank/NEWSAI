import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";

interface Props {
  articles: NewsArticle[];
}

const EMOTION_COLORS: Record<string, string> = {
  joy: "hsl(48, 96%, 53%)",
  fear: "hsl(270, 70%, 55%)",
  anger: "hsl(0, 72%, 51%)",
  sadness: "hsl(210, 70%, 50%)",
  surprise: "hsl(38, 92%, 50%)",
  disgust: "hsl(142, 50%, 40%)",
};

const EMOTION_ICONS: Record<string, string> = {
  joy: "😊",
  fear: "😨",
  anger: "😡",
  sadness: "😢",
  surprise: "😮",
  disgust: "🤢",
};

export function EmotionPanel({ articles }: Props) {
  const avgEmotions = useMemo(() => {
    const articlesWithEmotions = articles.filter((a) => a.emotions);
    if (!articlesWithEmotions.length) return [];

    const sums: Record<string, number> = { joy: 0, fear: 0, anger: 0, sadness: 0, surprise: 0, disgust: 0 };
    articlesWithEmotions.forEach((a) => {
      if (a.emotions) {
        Object.keys(sums).forEach((k) => {
          sums[k] += (a.emotions as any)[k] || 0;
        });
      }
    });

    return Object.entries(sums).map(([emotion, total]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      key: emotion,
      score: Number((total / articlesWithEmotions.length).toFixed(3)),
      icon: EMOTION_ICONS[emotion],
    }));
  }, [articles]);

  const dominantEmotion = useMemo(() => {
    if (!avgEmotions.length) return null;
    return [...avgEmotions].sort((a, b) => b.score - a.score)[0];
  }, [avgEmotions]);

  const perArticleEmotions = useMemo(() => {
    return articles
      .filter((a) => a.emotions)
      .slice(0, 8)
      .map((a) => {
        const emotions = a.emotions!;
        const dominant = Object.entries(emotions).sort(([, a], [, b]) => b - a)[0];
        return {
          title: (a.title || "").substring(0, 25) + "...",
          dominant: dominant[0],
          score: dominant[1],
        };
      });
  }, [articles]);

  if (!avgEmotions.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No emotion data available yet. Scan some news to see emotion analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dominant emotion highlight */}
      {dominantEmotion && (
        <div className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="text-4xl">{dominantEmotion.icon}</div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Dominant Emotion</p>
            <p className="text-xl font-bold text-foreground">{dominantEmotion.emotion}</p>
            <p className="text-sm text-muted-foreground">Average intensity: {(dominantEmotion.score * 100).toFixed(0)}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Emotion Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={avgEmotions}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 9 }} />
              <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Bars */}
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Average Emotion Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgEmotions} layout="vertical">
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="emotion" width={80} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {avgEmotions.map((entry) => (
                  <Cell key={entry.key} fill={EMOTION_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-article dominant emotions */}
      {perArticleEmotions.length > 0 && (
        <div className="glass-card rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Dominant Emotion per Article</h3>
          <div className="space-y-2">
            {perArticleEmotions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{EMOTION_ICONS[a.dominant]}</span>
                <span className="flex-1 text-foreground truncate">{a.title}</span>
                <span className="text-xs font-mono text-muted-foreground capitalize">{a.dominant}</span>
                <span className="text-xs font-mono font-semibold text-foreground">{(a.score * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
