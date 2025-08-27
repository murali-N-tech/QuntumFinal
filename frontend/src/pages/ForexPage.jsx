import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Globe, ArrowRightLeft } from 'lucide-react';

const ForexPage = () => {
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/screener/forex/pairs');
        setPairs(response.data);
      } catch (err) {
        setError('Failed to fetch Forex data. The API limit may have been reached.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPairs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Forex Market
        </h1>
        <p className="text-quantum-text-muted mb-8 text-center max-w-2xl mx-auto">
          Live data for major currency pairs from around the globe.
        </p>
      </motion.div>

      <motion.div 
        className="quantum-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="p-16 text-center text-quantum-text-muted">Loading Forex pairs...</div>
        ) : error ? (
          <div className="p-16 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b-2 border-quantum-border">
                <tr>
                  <th className="p-4 text-quantum-text-muted font-semibold">Symbol</th>
                  <th className="p-4 text-quantum-text-muted font-semibold">Pair</th>
                  <th className="p-4 text-quantum-text-muted font-semibold hidden sm:table-cell">Market</th>
                  <th className="p-4 text-quantum-text-muted font-semibold hidden md:table-cell">Locale</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => (
                  <motion.tr 
                    key={pair.symbol} 
                    className="border-b border-quantum-border last:border-b-0 hover:bg-quantum-secondary/20 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="p-4 font-mono font-semibold text-quantum-accent">{pair.symbol}</td>
                    <td className="p-4 text-quantum-text">
                      <div className="flex items-center">
                        <span>{pair.currency_base}</span>
                        <ArrowRightLeft size={14} className="mx-2 text-quantum-text-muted" />
                        <span>{pair.currency_quote}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell text-quantum-text">{pair.market}</td>
                    <td className="p-4 hidden md:table-cell text-quantum-text">{pair.locale}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForexPage;