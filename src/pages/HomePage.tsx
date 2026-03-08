import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, BarChart3, Newspaper, Tags, ShieldAlert,
  Sparkles, MessageSquare, ArrowRight, Zap, Globe, Brain,
  Heart, Scale, Network, AlertTriangle, Trophy, TrendingUp, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    to: "/search",
    icon: Search,
    title: "News Scanner",
    desc: "Scrape & analyze news from any domain with full AI intelligence pipeline.",
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
    to: "/emotions",
    icon: Heart,
    title: "Emotion Detection",
    desc: "Detect joy, fear, anger, sadness, surprise & disgust with radar analysis.",
    gradient: "from-destructive to-warning",
  },
  {
    to: "/bias",
    icon: Scale,
    title: "Bias Detection",
    desc: "Analyze political and ideological bias across news sources.",
    gradient: "from-primary/80 to-destructive/60",
  },
  {
    to: "/fake-news",
    icon: ShieldAlert,
    title: "Credibility Detector",
    desc: "AI-powered fake news detection with confidence scoring per article.",
    gradient: "from-destructive to-destructive/60",
  },
  {
    to: "/entities",
    icon: Network,
    title: "Knowledge Graph",
    desc: "Interactive entity relationship graph — people, orgs, locations, tech.",
    gradient: "from-accent to-success",
  },
  {
    to: "/contradictions",
    icon: AlertTriangle,
    title: "Contradiction Alerts",
    desc: "Detect conflicting reporting across different sources on the same topic.",
    gradient: "from-warning to-destructive",
  },
  {
    to: "/influence",
    icon: Trophy,
    title: "Influence Ranking",
    desc: "Rank articles by influence score combining sentiment, credibility & reach.",
    gradient: "from-warning to-warning/60",
  },
  {
    to: "/trends",
    icon: TrendingUp,
    title: "Trend Prediction",
    desc: "Time-series forecasting with sentiment trends and topic popularity index.",
    gradient: "from-success to-accent",
  },
  {
    to: "/similarity",
    icon: Link2,
    title: "Similar Articles",
    desc: "Find related articles using vector similarity across topics and sentiment.",
    gradient: "from-primary/60 to-accent/60",
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
  show: { transition: { staggerChildren: 0.04 } },
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
            AI-Powered News Intelligence Platform v3.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-5"
          >
            Complete News{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            14 AI modules — scrape, analyze sentiment & emotions, detect bias & fake news, build knowledge graphs,
            predict trends, find contradictions, and chat with your data via RAG.
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-12 flex-wrap"
          >
            {[
              { icon: Globe, label: "Multi-Source Scraping" },
              { icon: Brain, label: "6 AI Analysis Modules" },
              { icon: Network, label: "Knowledge Graph" },
              { icon: TrendingUp, label: "Trend Prediction" },
              { icon: MessageSquare, label: "RAG Chatbot" },
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.to} variants={item}>
                <Link
                  to={f.to}
                  className="group glass-card rounded-xl p-5 flex flex-col h-full hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div
                    className={`h-9 w-9 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <f.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium mt-3 group-hover:gap-2 transition-all">
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
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NewsPulse — AI-powered news intelligence platform</span>
          <span className="font-mono">v3.0 — 14 modules</span>
        </div>
      </footer>
    </div>
  );
}
