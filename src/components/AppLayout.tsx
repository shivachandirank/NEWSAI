import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Home, Search, BarChart3, Newspaper, Tags, ShieldAlert,
  Sparkles, MessageSquare, Menu, X, Heart, Scale, Network,
  AlertTriangle, Trophy, TrendingUp, Link2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { to: "/", label: "Home", icon: Home },
      { to: "/search", label: "Scanner", icon: Search },
      { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { to: "/articles", label: "Articles", icon: Newspaper },
    ],
  },
  {
    label: "Analysis",
    items: [
      { to: "/topics", label: "Topics", icon: Tags },
      { to: "/emotions", label: "Emotions", icon: Heart },
      { to: "/bias", label: "Bias Detection", icon: Scale },
      { to: "/fake-news", label: "Credibility", icon: ShieldAlert },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/entities", label: "Knowledge Graph", icon: Network },
      { to: "/contradictions", label: "Contradictions", icon: AlertTriangle },
      { to: "/influence", label: "Influence", icon: Trophy },
      { to: "/trends", label: "Trends", icon: TrendingUp },
      { to: "/similarity", label: "Similar Articles", icon: Link2 },
    ],
  },
  {
    label: "AI",
    items: [
      { to: "/insights", label: "AI Insights", icon: Sparkles },
      { to: "/chat", label: "RAG Chat", icon: MessageSquare },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Zap className="h-4.5 w-4.5 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">NewsPulse</h1>
              <p className="text-[10px] text-muted-foreground font-mono">AI Intelligence v3.0</p>
            </div>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1.5">
                  {section.label}
                </p>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                        {active && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-mono">v3.0 — 15 modules</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">NewsPulse</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-card max-h-[70vh] overflow-y-auto"
            >
              <div className="p-3 space-y-3">
                {NAV_SECTIONS.map((section) => (
                  <div key={section.label}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                      {section.label}
                    </p>
                    {section.items.map((item) => {
                      const active = location.pathname === item.to;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:max-h-screen lg:overflow-y-auto">
        <div className="pt-16 lg:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
