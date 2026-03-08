import { ChatPanel } from "@/components/ChatPanel";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">RAG Chatbot</h1>
        <p className="text-sm text-muted-foreground">Ask questions about your news data using retrieval-augmented generation</p>
      </div>
      <AnimatedSection>
        <div className="h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]">
          <ChatPanel />
        </div>
      </AnimatedSection>
    </div>
  );
}
