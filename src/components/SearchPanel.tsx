import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Newspaper } from "lucide-react";

interface Props {
  onScrape: (query: string, domain: string, count: number) => void;
  isLoading: boolean;
}

const DOMAINS = [
  { value: "all", label: "All Domains" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "politics", label: "Politics" },
  { value: "healthcare", label: "Healthcare" },
  { value: "sports", label: "Sports" },
];

export function SearchPanel({ onScrape, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [count, setCount] = useState("5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onScrape(query.trim(), domain === "all" ? "" : domain, Number(count));
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">News Scanner</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news topics (e.g., AI regulation, Tesla, climate)"
          className="flex-1"
          disabled={isLoading}
        />
        <Select value={domain} onValueChange={setDomain}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOMAINS.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={count} onValueChange={setCount}>
          <SelectTrigger className="w-full sm:w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[3, 5, 8, 10].map((n) => (
              <SelectItem key={n} value={String(n)}>{n} articles</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isLoading || !query.trim()} className="gap-2">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </form>
  );
}
