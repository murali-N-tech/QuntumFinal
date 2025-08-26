import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StocksPage from './pages/StocksPage';
import CryptoPage from './pages/CryptoPage';
import ForexPage from './pages/ForexPage';
import NewsPage from "./pages/NewsPage"; // Renamed from TradingPage
import PortfolioPage from "./pages/PortfolioPage";
import NotFound from "./pages/NotFound";
import AssetDetailPage from "./pages/AssetDetailPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/forex" element={<ForexPage />} />
          {/* The comment has been moved outside the Route component */}
          <Route path="/trading" element={<NewsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/asset/:symbol" element={<AssetDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;