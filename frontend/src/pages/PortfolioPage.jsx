import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PieChart from '../components/PieChart';
import MultiLineChart from '../components/LineChart';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Search, Plus, Trash2, DollarSign, BarChart2, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Scale } from 'lucide-react';

const ASSET_CATEGORIES = {
  Stocks: ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA", "TSLA", "META", "JPM"],
  Crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD", "ADA-USD"],
  Forex: ["EURUSD=X", "JPY=X", "GBPUSD=X", "AUDUSD=X", "USDCAD=X", "USDCHF=X"]
};

const PerformanceCard = ({ title, results, investmentAmount, icon }) => (
    <div className="quantum-card p-6 h-full flex flex-col">
        <div className="flex items-center justify-center mb-4">
            {icon}
            <h3 className="text-2xl font-bold text-quantum-text ml-2">{title}</h3>
        </div>
        <div className="h-[300px] w-full"><PieChart data={results.optimal_weights} /></div>
        <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center bg-quantum-secondary/20 p-3 rounded-lg">
                <span className="font-semibold text-quantum-text-muted">Sharpe Ratio</span>
                <span className="font-bold text-2xl text-quantum-accent">{results.performance.sharpe_ratio.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center bg-quantum-secondary/20 p-3 rounded-lg">
                <span className="font-semibold text-quantum-text-muted">Expected Annual Return</span>
                <span className="font-bold text-lg text-green-400">{(results.performance.expected_annual_return * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center bg-quantum-secondary/20 p-3 rounded-lg">
                <span className="font-semibold text-quantum-text-muted">Annual Volatility</span>
                <span className="font-bold text-lg text-yellow-400">{(results.performance.annual_volatility * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                <span className="font-semibold text-quantum-text-muted">Potential Daily Risk (VaR)</span>
                <span className="font-bold text-lg text-red-400">
                    ${(investmentAmount * results.performance.value_at_risk_95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    </div>
);


const PortfolioPage = () => {
  const [selectedAssets, setSelectedAssets] = useState(["AAPL", "GOOGL", "MSFT", "NVDA"]);
  const [activeCategory, setActiveCategory] = useState('Stocks');
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [optimizedAssetDetails, setOptimizedAssetDetails] = useState([]);

  const assetsToDisplay = useMemo(() => {
    const currentCategoryAssets = ASSET_CATEGORIES[activeCategory] || [];
    if (activeCategory === 'Stocks') {
      const stockAssets = selectedAssets.filter(asset => !ASSET_CATEGORIES.Crypto.includes(asset) && !ASSET_CATEGORIES.Forex.includes(asset));
      return [...new Set([...currentCategoryAssets, ...stockAssets])];
    }
    return currentCategoryAssets;
  }, [activeCategory, selectedAssets]);

  useEffect(() => {
    const searchForAssets = async () => {
        if (debouncedSearchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await api.get(`/screener/assets/search?q=${debouncedSearchQuery}`);
            setSearchResults(response.data);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setIsSearching(false);
        }
    };
    searchForAssets();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const fetchOptimizedDetails = async () => {
      if (results && results.quantum && results.quantum.optimal_weights) {
        const quantumSymbols = Object.keys(results.quantum.optimal_weights);
        const classicalSymbols = Object.keys(results.classical.optimal_weights);
        const symbols = [...new Set([...quantumSymbols, ...classicalSymbols])].join(',');

        if (!symbols) return;
        try {
          const response = await api.get(`/screener/stocks/quotes?symbols=${symbols}`);
          setOptimizedAssetDetails(response.data);
        } catch (err) {
          console.error("Failed to fetch optimized asset details:", err);
          setOptimizedAssetDetails([]);
        }
      }
    };
    fetchOptimizedDetails();
  }, [results]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-quantum-text">Authentication Required</h2>
        <p className="mt-2 text-quantum-text-muted">
          Please <Link to="/login" className="text-quantum-accent hover:underline">log in</Link> to use the optimizer.
        </p>
      </div>
    );
  }

  const addAssetToPortfolio = (assetSymbol) => {
    const newAsset = assetSymbol.trim().toUpperCase();
    if (newAsset && !selectedAssets.includes(newAsset)) {
      setSelectedAssets(prev => [...prev, newAsset]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAssetToggle = (asset) => {
    setSelectedAssets(prev => prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]);
  };
  
  const processChartData = (histories) => {
    const combinedData = {};
    const initialPrices = {};
    const allDates = new Set();
    histories.forEach(({ asset, data }) => {
      if (data && data.length > 0) {
        initialPrices[asset] = data[0].price;
        data.forEach(point => { allDates.add(point.date); });
      }
    });
    const sortedDates = Array.from(allDates).sort();
    sortedDates.forEach(date => {
        combinedData[date] = { date };
        histories.forEach(({ asset, data }) => {
            if (data && data.length > 0) {
                const point = data.find(p => p.date === date);
                if (point) {
                    const performance = ((point.price - initialPrices[asset]) / initialPrices[asset]) * 100;
                    combinedData[date][asset] = performance;
                }
            }
        });
    });
    const finalChartData = Object.values(combinedData);
    const assetKeys = histories.map(h => h.asset);
    for (let i = 1; i < finalChartData.length; i++) {
        for (const key of assetKeys) {
            if (finalChartData[i][key] === undefined || finalChartData[i][key] === null) {
                finalChartData[i][key] = finalChartData[i - 1][key];
            }
        }
    }
    return finalChartData;
  };

  const handleOptimize = async () => {
    if (selectedAssets.length < 2) {
      setError('Please select at least 2 assets.');
      return;
    }
    if (!investmentAmount || investmentAmount <= 0) {
        setError('Please enter a valid investment amount.');
        return;
    }
    setIsLoading(true);
    setError('');
    setResults(null);
    setChartData([]);
    setOptimizedAssetDetails([]);

    try {
      const res = await api.post('/portfolios/optimize', { assets: selectedAssets });
      setResults(res.data);

      const historyPromises = selectedAssets.map(asset =>
        api.get(`/portfolios/history/${asset}`).then(response => ({ asset, data: response.data }))
      );
      const histories = await Promise.all(historyPromises);
      const processedData = processChartData(histories);
      setChartData(processedData);

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during optimization.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">Quantum Portfolio Optimizer</h1>
        <p className="text-quantum-text-muted mb-12 text-center max-w-3xl mx-auto">
          Define your investment parameters and select your assets. Our engine will compare a quantum-inspired algorithm with a classical approach to find optimal allocations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Configuration & Asset Selection */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div className="quantum-card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-xl font-bold text-quantum-accent mb-4">Step 1: Configure Investment</h2>
            <label className="block text-sm font-medium text-quantum-text-muted mb-2">Total Investment Amount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-quantum-text-muted" size={20} />
              <input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} placeholder="e.g., 10000"
                  className="w-full pl-10 pr-4 py-3 bg-quantum-primary/50 text-quantum-text border border-quantum-border rounded-lg focus:outline-none focus:ring-2 focus:ring-quantum-accent" />
            </div>
          </motion.div>
          
          <motion.div className="quantum-card p-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <h2 className="text-xl font-bold text-quantum-accent mb-4">Step 2: Select Assets</h2>
            <div className="border-b border-quantum-border mb-4">
              <nav className="-mb-px flex space-x-4">
                {Object.keys(ASSET_CATEGORIES).map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeCategory === cat ? 'border-quantum-accent text-quantum-accent' : 'border-transparent text-quantum-text-muted hover:text-quantum-text'}`}>
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {assetsToDisplay.map(asset => (
                <button key={asset} onClick={() => handleAssetToggle(asset)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedAssets.includes(asset) ? 'bg-quantum-accent text-quantum-primary border-quantum-accent' : 'bg-quantum-secondary/20 text-quantum-text-muted border-quantum-border hover:border-quantum-accent'}`}>
                  {selectedAssets.includes(asset) ? <CheckCircle size={14} className="inline mr-1" /> : <Plus size={14} className="inline mr-1" />}
                  {asset}
                </button>
              ))}
            </div>
            
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-quantum-text-muted" size={18} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Add custom asset..."
                          onKeyDown={(e) => e.key === 'Enter' && addAssetToPortfolio(searchQuery)}
                          className="w-full pl-10 pr-4 py-2 bg-quantum-primary/50 text-quantum-text border border-quantum-border rounded-lg focus:outline-none focus:ring-2 focus:ring-quantum-accent" />
                    </div>
                    <button onClick={() => addAssetToPortfolio(searchQuery)}
                        className="bg-quantum-accent text-quantum-primary font-semibold px-4 py-2 rounded-lg hover:bg-quantum-glow transition-colors">
                        Add
                    </button>
                </div>
              {(isSearching || searchResults.length > 0) && (
                <ul className="absolute z-10 w-full bg-quantum-secondary border border-quantum-border rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {isSearching ? <li className="px-4 py-2 text-quantum-text-muted">Searching...</li> : (
                    searchResults.map(asset => (
                      <li key={asset.symbol} onClick={() => addAssetToPortfolio(asset.symbol)}
                        className="px-4 py-2 text-quantum-text hover:bg-quantum-accent/10 cursor-pointer">
                        <span className="font-bold">{asset.symbol}</span>
                        <span className="text-sm text-quantum-text-muted ml-2">{asset.name}</span>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
            <div className="mt-4 border-t border-quantum-border pt-4">
              <h3 className="font-semibold text-quantum-text mb-2">Selected ({selectedAssets.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAssets.map(asset => (
                  <div key={asset} className="flex items-center bg-quantum-secondary/30 text-quantum-text rounded-full px-3 py-1 text-sm">
                    {asset}
                    <button onClick={() => handleAssetToggle(asset)} className="ml-2 text-quantum-text-muted hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Optimizer Button and Results */}
        <div className="lg:col-span-2 space-y-8">
            <motion.button onClick={handleOptimize} disabled={isLoading || selectedAssets.length < 2}
              className="w-full flex items-center justify-center bg-quantum-accent text-quantum-primary font-bold py-4 px-6 rounded-lg hover:bg-quantum-glow disabled:bg-quantum-accent/50 transition-all text-lg transform hover:scale-105 shadow-2xl shadow-quantum-accent/20"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-quantum-primary mr-3"></div>
                    Running Quantum Simulation...
                  </>
                ) : (
                  <>
                    <Atom className="mr-2" /> Optimize Portfolio
                  </>
                )}
            </motion.button>
            
            <AnimatePresence>
              {error && (
                <motion.div className="quantum-card p-6 text-center text-red-400 flex items-center justify-center" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <AlertTriangle className="mr-2" /> {error}
                </motion.div>
              )}

              {results && (
                <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="quantum-card p-6">
                    <h2 className="text-2xl font-bold mb-6 text-quantum-accent text-center">Step 3: Optimization Comparison</h2>
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <PerformanceCard 
                            title="Quantum (QAOA)" 
                            results={results.quantum} 
                            investmentAmount={investmentAmount}
                            icon={<Atom size={28} className="text-quantum-accent" />}
                        />
                        <PerformanceCard 
                            title="Classical (Mean-Variance)" 
                            results={results.classical} 
                            investmentAmount={investmentAmount}
                            icon={<Scale size={28} className="text-quantum-accent" />}
                        />
                    </div>
                  </div>
                  
                   {optimizedAssetDetails && optimizedAssetDetails.length > 0 && (
                    <div className="quantum-card p-6">
                      <h2 className="text-2xl font-bold mb-4 text-quantum-accent text-center">Real-Time Asset Data</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-quantum-text">
                           <thead className="border-b-2 border-quantum-border">
                                <tr>
                                  <th className="p-4 font-semibold text-quantum-text-muted">Symbol</th>
                                  <th className="p-4 font-semibold text-quantum-text-muted">Price</th>
                                  <th className="p-4 font-semibold text-quantum-text-muted">Change (%)</th>
                                  <th className="p-4 font-semibold text-quantum-text-muted hidden md:table-cell">Volume</th>
                                </tr>
                            </thead>
                          <tbody>
                            {optimizedAssetDetails.map(stock => (
                              <tr key={stock.symbol} className="border-b border-quantum-border last:border-b-0">
                                <td className="p-4 font-mono font-semibold text-quantum-accent">{stock.symbol}</td>
                                <td className="p-4">${stock.price?.toFixed(2)}</td>
                                <td className={`p-4 flex items-center ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                   {stock.changePercent >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                                  {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : "N/A"}
                                </td>
                                <td className="p-4 hidden md:table-cell">{stock.volume?.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {chartData && chartData.length > 0 && (
                    <div className="quantum-card p-6">
                      <h2 className="text-2xl font-bold mb-4 text-quantum-accent text-center">Historical Performance (1Y)</h2>
                      <div className="h-[400px] w-full"><MultiLineChart data={chartData} assets={selectedAssets} /></div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;