import { InsightsPanel } from "@/components/InsightsPanel";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
        <p className="text-sm text-muted-foreground">Generate executive-level summaries and trend analysis</p>
      </div>
      <AnimatedSection>
        <InsightsPanel />
      </AnimatedSection>
    </div>
  );
}
