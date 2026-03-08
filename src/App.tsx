import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/AppLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import ArticlesPage from "./pages/ArticlesPage";
import TopicsPage from "./pages/TopicsPage";
import FakeNewsPage from "./pages/FakeNewsPage";
import InsightsPage from "./pages/InsightsPage";
import ChatPage from "./pages/ChatPage";
import EmotionsPage from "./pages/EmotionsPage";
import BiasPage from "./pages/BiasPage";
import EntitiesPage from "./pages/EntitiesPage";
import ContradictionsPage from "./pages/ContradictionsPage";
import InfluencePage from "./pages/InfluencePage";
import TrendsPage from "./pages/TrendsPage";
import SimilarityPage from "./pages/SimilarityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/fake-news" element={<FakeNewsPage />} />
              <Route path="/emotions" element={<EmotionsPage />} />
              <Route path="/bias" element={<BiasPage />} />
              <Route path="/entities" element={<EntitiesPage />} />
              <Route path="/contradictions" element={<ContradictionsPage />} />
              <Route path="/influence" element={<InfluencePage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/similarity" element={<SimilarityPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
