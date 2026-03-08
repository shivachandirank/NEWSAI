import { NewsArticle } from "@/lib/api";

export function exportArticlesCSV(articles: NewsArticle[]) {
  const headers = [
    "Title", "Source", "URL", "Published Date", "Sentiment", "Sentiment Score",
    "Credibility Score", "Is Fake", "Topics", "Domain", "Query", "Created At"
  ];

  const rows = articles.map((a) => [
    `"${(a.title || "").replace(/"/g, '""')}"`,
    `"${(a.source || "").replace(/"/g, '""')}"`,
    a.url || "",
    a.published_date || "",
    a.sentiment_label || "",
    a.sentiment_score?.toFixed(3) || "",
    a.credibility_score?.toFixed(3) || "",
    a.is_fake ? "Yes" : "No",
    `"${(a.topics || []).join(", ")}"`,
    a.domain || "",
    a.query || "",
    a.created_at,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `newspulse-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
