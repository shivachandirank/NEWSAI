import { useMemo } from "react";
import { NewsArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";

interface Props {
  articles: NewsArticle[];
  currentArticleId?: string;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}

function articleToVector(article: NewsArticle, allTopics: string[]): number[] {
  const topicVec = allTopics.map((t) => (article.topics || []).includes(t) ? 1 : 0);
  return [
    article.sentiment_score || 0,
    article.credibility_score || 0,
    article.bias_score || 0,
    article.influence_score || 0,
    ...topicVec,
  ];
}

export function SimilarArticles({ articles, currentArticleId }: Props) {
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    articles.forEach((a) => (a.topics || []).forEach((t) => topics.add(t)));
    return Array.from(topics);
  }, [articles]);

  const similarityPairs = useMemo(() => {
    if (articles.length < 2) return [];

    const vectors = articles.map((a) => ({
      article: a,
      vec: articleToVector(a, allTopics),
    }));

    // If viewing a specific article, find similar to it
    if (currentArticleId) {
      const target = vectors.find((v) => v.article.id === currentArticleId);
      if (!target) return [];
      return vectors
        .filter((v) => v.article.id !== currentArticleId)
        .map((v) => ({
          article: v.article,
          similarity: cosineSimilarity(target.vec, v.vec),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8);
    }

    // Otherwise, find most similar pairs across all articles
    const pairs: { a1: NewsArticle; a2: NewsArticle; similarity: number }[] = [];
    for (let i = 0; i < vectors.length; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        const sim = cosineSimilarity(vectors[i].vec, vectors[j].vec);
        if (sim > 0.5) {
          pairs.push({ a1: vectors[i].article, a2: vectors[j].article, similarity: sim });
        }
      }
    }
    return pairs.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  }, [articles, currentArticleId, allTopics]);

  if (!articles.length || articles.length < 2) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">Need at least 2 articles for similarity analysis.</p>
      </div>
    );
  }

  if (!similarityPairs.length) {
    return (
      <div className="glass-card rounded-lg p-6 text-center text-muted-foreground">
        <p className="text-sm">No highly similar article pairs found.</p>
      </div>
    );
  }

  // Render based on mode
  if (currentArticleId) {
    return (
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" />
          Similar Articles
        </h3>
        <div className="space-y-2">
          {(similarityPairs as { article: NewsArticle; similarity: number }[]).map((pair) => (
            <div key={pair.article.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{pair.article.title}</p>
                <p className="text-xs text-muted-foreground">{pair.article.source}</p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {(pair.similarity * 100).toFixed(0)}% match
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" />
        Most Similar Article Pairs
      </h3>
      <div className="space-y-3">
        {(similarityPairs as { a1: NewsArticle; a2: NewsArticle; similarity: number }[]).map((pair, i) => (
          <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="default" className="text-xs">
                {(pair.similarity * 100).toFixed(0)}% similar
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground truncate">📰 {pair.a1.title}</p>
              <p className="text-sm text-foreground truncate">📰 {pair.a2.title}</p>
            </div>
            <div className="flex gap-1 mt-2">
              {(pair.a1.topics || [])
                .filter((t) => (pair.a2.topics || []).includes(t))
                .slice(0, 3)
                .map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
