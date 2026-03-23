import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/content/AuthContent";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import LearnPage from "./pages/LearnPage";
import Analyze from "./pages/Analyze";
import Contacts from "./pages/Contacts";
import HistoryPage from "./pages/HistoryPage";
import AssistentePage from "./pages/AssistentePage";
import PerfilPage from "./pages/PerfilPage";
import ApoioPage from "./pages/ApoioPage";
import { ChatbotWidget } from "./components/ChatbotWidget/ChatbotWidget";
import Footer from "./components/Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
    return (
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/aprender" element={<LearnPage />} />
              <Route path="/analisar" element={<Analyze />} />
              <Route path="/contactos" element={<Contacts />} />
              <Route path="/historico" element={<HistoryPage />} />
              <Route path="/assistente" element={<AssistentePage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/apoio" element={<ApoioPage />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
        <ChatbotWidget />
      </AuthProvider>
    );
};

export default App;
