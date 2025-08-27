import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 20;

  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/screener/stocks/quotes");
        setStocks(
          response.data.filter((stock) => stock && stock.price && stock.symbol)
        );
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch top stocks.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialStocks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get(`/screener/stocks/quotes?symbols=${searchTerm.toUpperCase()}`);
      if (response.data && response.data.length > 0) {
        setStocks(response.data.filter(stock => stock && stock.price && stock.symbol));
      } else {
        setError(`No results found for ticker: ${searchTerm}`);
        setStocks([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while searching.");
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStocks.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Stock Market Analysis
        </h1>
        <p className="text-quantum-text-muted mb-8 text-center max-w-2xl mx-auto">
          Explore real-time quotes for popular stocks. Search for specific tickers to get instant data.
        </p>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <form onSubmit={handleSearch} className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for a stock ticker (e.g., AAPL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-quantum-secondary/20 text-quantum-text border-2 border-quantum-border 
                         focus:outline-none focus:ring-2 focus:ring-quantum-accent focus:border-quantum-accent transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-quantum-text-muted" size={20} />
          </div>
          <button
            type="submit"
            className="ml-3 px-6 py-3 bg-quantum-accent text-quantum-primary font-bold rounded-lg hover:bg-quantum-glow transition-all duration-300 transform hover:scale-105"
          >
            Search
          </button>
        </form>

        <div className="quantum-card overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center text-quantum-text-muted">Loading stock data...</div>
          ) : error ? (
            <div className="p-16 text-center text-red-400">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b-2 border-quantum-border">
                  <tr>
                    <th className="p-4 text-quantum-text-muted font-semibold">Symbol</th>
                    <th className="p-4 text-quantum-text-muted font-semibold hidden sm:table-cell">Company</th>
                    <th className="p-4 text-quantum-text-muted font-semibold">Price</th>
                    <th className="p-4 text-quantum-text-muted font-semibold">Change (%)</th>
                    <th className="p-4 text-quantum-text-muted font-semibold hidden md:table-cell">Volume</th>
                    <th className="p-4 text-quantum-text-muted font-semibold hidden lg:table-cell">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStocks.map((stock, index) => (
                    <motion.tr
                      key={stock.symbol}
                      className="border-b border-quantum-border hover:bg-quantum-secondary/20 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="p-4 font-mono font-semibold text-quantum-accent">
                        <Link to={`/asset/${stock.symbol}`} className="hover:underline">{stock.symbol}</Link>
                      </td>
                      <td className="p-4 text-quantum-text hidden sm:table-cell">{stock.name || 'N/A'}</td>
                      <td className="p-4 font-semibold text-quantum-text">${stock.price ? stock.price.toFixed(2) : 'N/A'}</td>
                      <td className={`p-4 font-semibold flex items-center ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.changePercent >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                        {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : 'N/A'}
                      </td>
                      <td className="p-4 text-quantum-text hidden md:table-cell">{stock.volume ? stock.volume.toLocaleString() : 'N/A'}</td>
                      <td className="p-4 text-quantum-text hidden lg:table-cell">{stock.marketCap ? `$${stock.marketCap.toLocaleString()}` : 'N/A'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md bg-quantum-secondary/20 hover:bg-quantum-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <span className="text-quantum-text-muted">Page {currentPage} of {totalPages}</span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md bg-quantum-secondary/20 hover:bg-quantum-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StocksPage;