import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, BarChart3, Newspaper, Tags, ShieldAlert,
  Sparkles, MessageSquare, ArrowRight, Zap, Globe, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    to: "/search",
    icon: Search,
    title: "News Scanner",
    desc: "Scrape & analyze news from any domain with AI-powered sentiment analysis.",
    gradient: "from-primary to-primary/60",
  },
  {
    to: "/dashboard",
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Real-time sentiment distribution, trends, and statistical breakdowns.",
    gradient: "from-accent to-accent/60",
  },
  {
    to: "/articles",
    icon: Newspaper,
    title: "Article Explorer",
    desc: "Browse, sort, filter, and export all analyzed articles with full detail.",
    gradient: "from-warning to-warning/60",
  },
  {
    to: "/topics",
    icon: Tags,
    title: "Topic Clusters",
    desc: "Discover trending topics and how they relate across your news corpus.",
    gradient: "from-success to-success/60",
  },
  {
    to: "/fake-news",
    icon: ShieldAlert,
    title: "Credibility Detector",
    desc: "AI-powered fake news detection with confidence scoring per article.",
    gradient: "from-destructive to-destructive/60",
  },
  {
    to: "/insights",
    icon: Sparkles,
    title: "AI Insights",
    desc: "Generate executive-level summaries and trend analysis with one click.",
    gradient: "from-primary to-accent",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "RAG Chatbot",
    desc: "Ask questions about your news data using retrieval-augmented generation.",
    gradient: "from-accent to-primary",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-28">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6"
          >
            <Zap className="h-3.5 w-3.5" />
            RAG-Powered Web Intelligence Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-5"
          >
            Analyze News with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Scrape, analyze sentiment, detect fake news, extract topics, and chat with your data —
            all powered by cutting-edge AI and retrieval-augmented generation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <Link to="/search">
                <Search className="h-4 w-4" />
                Start Scanning
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4" />
                View Dashboard
              </Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-12"
          >
            {[
              { icon: Globe, label: "Multi-Source Scraping" },
              { icon: Brain, label: "AI Analysis" },
              { icon: ShieldAlert, label: "Fake News Detection" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <s.icon className="h-4 w-4 text-primary" />
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.to} variants={item}>
                <Link
                  to={f.to}
                  className="group glass-card rounded-xl p-6 flex flex-col h-full hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{f.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium mt-4 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NewsPulse — AI-powered news intelligence</span>
          <span className="font-mono">v2.0</span>
        </div>
      </footer>
    </div>
  );
}
