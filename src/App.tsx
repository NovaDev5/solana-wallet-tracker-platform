import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback, createContext, useContext } from "react";
import { Preloader } from "@/components/Preloader";
import { fetchWalletResponse } from "@/lib/utils";
import { DataProvider } from "./context/DataContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WalletDetail from "./pages/WalletDetails";
import PnlChecker from "./pages/PnlChecker";
import TokenDetails from "./pages/TokenInfo";
import TokenSnapshotPage from "./pages/TokenSnapshot";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Context to share preloaded app data across pages
export interface AppDataContextType {
  data: fetchWalletResponse[];
}

export const AppDataContext = createContext<AppDataContextType>({
  data: [],
});

export function useAppData() {
  return useContext(AppDataContext);
}

const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [appData, setAppData] = useState<fetchWalletResponse[]>();

  const handlePreloaderComplete = useCallback((data: fetchWalletResponse[]) => {
    setAppData(data);
    setPreloaderDone(true);
  }, []);

  return (
    <DataProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
          {preloaderDone && (
            <AppDataContext.Provider value={{ data: appData }}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/wallet/:address" element={<WalletDetail />} />
                  <Route path="/pnl" element={<PnlChecker />} />
                  <Route path="/token-info" element={<TokenDetails />} />
                  <Route path="/token-snapshot" element={<TokenSnapshotPage />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AppDataContext.Provider>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </DataProvider>
  );
};

export default App;
