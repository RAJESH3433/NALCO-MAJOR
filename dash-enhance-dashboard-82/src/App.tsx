
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/config/contexts/LanguageContext";
import { OptimizationProvider } from "@/config/contexts/OptimizationContext";
import QualityControl from "./pages/QualityControl";
import ProcessOverview from "./pages/ProcessOverview";
import Optimization from "./pages/Optimization";
import NotFound from "./pages/NotFound";
import Prediction from "./pages/Prediction";
import LLM from "./pages/LLM";
import ReversePrediction from "./pages/ReversePrediction";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <OptimizationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<QualityControl />} />
              <Route path="/quality-control" element={<QualityControl />} />
              <Route path="/process-overview" element={<ProcessOverview />} />
              <Route path="/optimization" element={<Optimization />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/llm" element={<LLM />} />
              <Route path="/reverse-prediction" element={<ReversePrediction />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OptimizationProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;