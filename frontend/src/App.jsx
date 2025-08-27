import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StocksPage from './pages/StocksPage';
import CryptoPage from './pages/CryptoPage';
import ForexPage from './pages/ForexPage';
import NewsPage from "./pages/NewsPage";
import PortfolioPage from "./pages/PortfolioPage";
import NotFound from "./pages/NotFound";
import AssetDetailPage from "./pages/AssetDetailPage";
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import TermsPage from './pages/TermsPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-quantum-primary">
            {!isAuthPage && <Navbar />}
            {/* By adding relative and z-0, we create a new stacking context for the main content, fixing the overlap bug. */}
            <main className="flex-grow relative z-0">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stocks" element={<StocksPage />} />
                <Route path="/crypto" element={<CryptoPage />} />
                <Route path="/forex" element={<ForexPage />} />
                <Route path="/trading" element={<NewsPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/asset/:symbol" element={<AssetDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {!isAuthPage && <Footer />}
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;