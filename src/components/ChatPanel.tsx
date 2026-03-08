import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";
import { MessageSquare, Send, Loader2, Trash2 } from "lucide-react";

export function ChatPanel() {
  const { messages, isLoading, send, clear } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <div className="glass-card rounded-lg flex flex-col h-[420px]">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          RAG Chatbot
        </h3>
        {messages.length > 0 && (
          <Button size="sm" variant="ghost" onClick={clear} className="h-7 gap-1 text-muted-foreground">
            <Trash2 className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
            Ask questions about the analyzed news articles.
            <div className="mt-2 space-y-1 text-xs">
              <p>"What's the overall sentiment about AI?"</p>
              <p>"Which articles seem unreliable?"</p>
              <p>"Summarize the key topics"</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
              {m.role === "assistant" && isLoading && i === messages.length - 1 && (
                <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse-glow" />
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the news..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
