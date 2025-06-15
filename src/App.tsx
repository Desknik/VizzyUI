
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import GradientsPage from "./pages/GradientsPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import StylesListPage from "./pages/StylesListPage";
import StyleDetailPage from "./pages/StyleDetailPage";
import CreateImagePage from "./pages/CreateImagePage";
import UserHistoryPage from "./pages/UserHistoryPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import ProfileSetupModal from "./components/profile/ProfileSetupModal";
import SuccessPage from "./pages/SuccessPage";

const queryClient = new QueryClient();

function AppContent() {
  const { showProfileSetup, setShowProfileSetup } = useAuth();

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gradients" element={<GradientsPage />} />
          <Route path="/styles" element={<StylesListPage />} />
          <Route path="/styles/:styleId" element={<StyleDetailPage />} />
          <Route path="/create-image" element={<CreateImagePage />} />
          <Route path="/history" element={<UserHistoryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <ProfileSetupModal 
        open={showProfileSetup} 
        onOpenChange={setShowProfileSetup} 
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
