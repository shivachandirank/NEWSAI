import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateInsights } from "@/lib/api";

export function InsightsPanel() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateInsights();
      setInsight(result);
    } catch (e) {
      setInsight(`Error: ${e instanceof Error ? e.message : "Failed to generate insights"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Insights
        </h3>
        <Button size="sm" variant="outline" onClick={handleGenerate} disabled={isLoading} className="gap-1">
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          Generate
        </Button>
      </div>
      {insight ? (
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{insight}</p>
      ) : (
        <p className="text-sm text-muted-foreground">Click "Generate" to get AI-powered insights about the current news landscape.</p>
      )}
    </div>
  );
}
