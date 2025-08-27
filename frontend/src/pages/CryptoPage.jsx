import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

const CryptoPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/screener/crypto/top");
        setCryptos(response.data);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopCryptos();
  }, []);

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Top 100 Cryptocurrencies
        </h1>
        <p className="text-quantum-text-muted mb-8 text-center max-w-2xl mx-auto">
          Explore the top digital assets ranked by market capitalization. Data is updated in real-time.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search for a cryptocurrency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-quantum-secondary/20 text-quantum-text border-2 border-quantum-border 
                         focus:outline-none focus:ring-2 focus:ring-quantum-accent focus:border-quantum-accent transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-quantum-text-muted" size={20} />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-16 text-quantum-text-muted">Loading cryptocurrency data...</div>
        ) : error ? (
          <div className="text-center p-16 text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCryptos.length > 0 ? (
              filteredCryptos.map((crypto, index) => (
                <motion.div
                  key={crypto.id}
                  className="quantum-card p-6 text-left group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(67, 206, 162, 0.1)' }}
                >
                  <div className="flex items-center mb-4">
                    <img src={crypto.image} alt={crypto.name} className="w-10 h-10 mr-4" />
                    <div>
                      <h2 className="font-bold text-quantum-text text-lg">{crypto.name}</h2>
                      <p className="text-sm text-quantum-text-muted uppercase">{crypto.symbol}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-quantum-text mb-1">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </p>
                  <div className={`flex items-center text-sm ${crypto.changePercent24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {crypto.changePercent24h >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    {crypto.changePercent24h.toFixed(2)}% (24h)
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-quantum-text-muted py-16">
                No cryptocurrencies found matching your search.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CryptoPage;