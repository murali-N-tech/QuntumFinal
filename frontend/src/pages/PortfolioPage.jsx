import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PieChart from '../components/PieChart';
import MultiLineChart from '../components/LineChart';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';

const ASSET_CATEGORIES = {
  Stocks: ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA", "TSLA", "META", "JPM"],
  Crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD", "ADA-USD"],
  Forex: ["EURUSD=X", "JPY=X", "GBPUSD=X", "AUDUSD=X", "USDCAD=X", "USDCHF=X"]
};

// Sub-component for the dynamic investment input field
const InvestmentInput = ({ category, amount, setAmount }) => {
  const getInputDetails = () => {
    switch (category) {
      case 'Crypto': return { label: 'Enter Total Crypto Investment', icon: '🪙' };
      case 'Forex': return { label: 'Enter Total Forex Trade Amount', icon: '🌍' };
      default: return { label: 'Enter Total Stock Investment', icon: '📈' };
    }
  };
  const { label, icon } = getInputDetails();
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-black">{`1. ${label}`}</h2>
      <div className="flex items-center">
        <span className="text-2xl font-bold text-gray-500 mr-2">{icon}</span>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="e.g., 10000"
            className="w-full max-w-xs px-4 py-2 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" />
      </div>
    </div>
  );
};


const PortfolioPage = () => {
  const [selectedAssets, setSelectedAssets] = useState([]);
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
            const response = await api.get(`/screener/search?q=${debouncedSearchQuery}`);
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
      if (results && results.optimal_weights) {
        const symbols = Object.keys(results.optimal_weights).join(',');
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
      <div className="bg-quantum-bg text-white min-h-screen p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold mb-4">Access Denied</h2>
        <p className="mt-2 text-gray-400">
          Please <Link to="/login" className="text-blue-400 hover:underline">log in</Link> to use the optimizer.
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
    setActiveCategory('Stocks');
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
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">Quantum Portfolio Optimizer ✨</h1>
      <p className="text-gray-400 mb-8 text-center">Harness the power of quantum computing for smarter investments.</p>

      <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black max-w-7xl mx-auto">
        <InvestmentInput category={activeCategory} amount={investmentAmount} setAmount={setInvestmentAmount} />
        <h2 className="text-xl font-semibold mb-6 text-black">2. Select Your Assets</h2>
        <div className="border-b border-gray-300 mb-6">
          <nav className="-mb-px flex space-x-6">
            {Object.keys(ASSET_CATEGORIES).map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeCategory === category ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                {category}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {assetsToDisplay.map((asset) => (
            <button key={asset} onClick={() => handleAssetToggle(asset)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${selectedAssets.includes(asset) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-black border-black hover:bg-gray-100"}`}>
              {asset}
            </button>
          ))}
        </div>
        
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2 text-black">Add Custom Asset</h3>
          <div className="relative">
            <div className="flex gap-2">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addAssetToPortfolio(searchQuery)}
                    placeholder="Search for a stock ticker or name..."
                    className="flex-grow px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white" />
                <button onClick={() => addAssetToPortfolio(searchQuery)}
                    className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                    Add
                </button>
            </div>
            {(isSearching || searchResults.length > 0) && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                {isSearching ? <li className="px-4 py-2 text-gray-500">Searching...</li> : (
                  searchResults.map(asset => (
                    <li key={asset.symbol} onClick={() => addAssetToPortfolio(asset.symbol)}
                      className="px-4 py-2 text-black hover:bg-blue-500 hover:text-white cursor-pointer">
                      <span className="font-bold">{asset.symbol}</span>
                      <span className="text-sm text-gray-600 ml-2">{asset.name}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 border-t-2 border-black pt-6">
          <h3 className="font-bold text-black text-lg">Selected Assets ({selectedAssets.length}):</h3>
          <p className="text-sm text-gray-600 break-words mt-2">{selectedAssets.length > 0 ? selectedAssets.join(", ") : "None"}</p>
        </div>
      </div>

      <button onClick={handleOptimize} disabled={isLoading || selectedAssets.length < 2}
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-lg mt-8 max-w-7xl mx-auto block">
        {isLoading ? "Running Quantum Simulation..." : "Optimize Portfolio"}
      </button>

      {error && <div className="text-red-500 mt-4 text-center font-semibold">{error}</div>}

      {results && (
        <div className="mt-8 space-y-8 max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-black text-center">Optimal Portfolio Allocation</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-black">Financial Projections</h3>
                  <ul className="text-gray-800 mt-2">
                    <li className="py-2 border-b border-gray-200 flex justify-between items-center bg-green-50 rounded px-2">
                        <strong>Projected Annual Profit:</strong>
                        <span className="font-bold text-lg text-green-600">
                            ${(investmentAmount * results.performance.expected_annual_return).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </li>
                    <li className="py-2 border-b border-gray-200 flex justify-between items-center bg-red-50 rounded px-2">
                        <strong>Potential Daily Risk (VaR 95%):</strong>
                        <span className="font-bold text-lg text-red-600">
                            ${(investmentAmount * results.performance.value_at_risk_95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </li>
                    <li className="py-2 border-b border-gray-200 flex justify-between items-center bg-blue-50 rounded px-2">
                        <strong>Sharpe Ratio (Risk/Reward):</strong>
                        <span className="font-bold text-lg text-blue-600">
                            {results.performance.sharpe_ratio.toFixed(4)}
                        </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">Allocation Details:</h3>
                  <ul className="text-gray-800 mt-2">
                    {Object.entries(results.optimal_weights).map(([asset, weight]) => (
                      <li key={asset} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                        <span className="font-bold">{asset}:</span>
                        <span>
                          ${(investmentAmount * weight).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-sm text-gray-500 ml-2">({(weight * 100).toFixed(2)}%)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="h-[300px] w-full"><PieChart data={results.optimal_weights} /></div>
            </div>
          </div>
          
          {chartData && chartData.length > 0 && (
            <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                Historical Performance Comparison (1Y)
              </h2>
              <div className="h-[400px] w-full">
                <MultiLineChart data={chartData} assets={selectedAssets} />
              </div>
            </div>
          )}

          {optimizedAssetDetails && optimizedAssetDetails.length > 0 && (
            <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">Real-Time Stock Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-black">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="p-4 font-bold">Symbol</th>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Price</th>
                      <th className="p-4 font-bold">Change (%)</th>
                      <th className="p-4 font-bold">Volume</th>
                      <th className="p-4 font-bold">Market Cap</th>
                      <th className="p-4 font-bold">High / Low</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optimizedAssetDetails.map(stock => (
                      <tr key={stock.symbol} className="border-b border-gray-200">
                        <td className="p-4 font-mono font-semibold text-blue-600">{stock.symbol}</td>
                        <td className="p-4">{stock.name || 'N/A'}</td>
                        <td className="p-4">${stock.price?.toFixed(2)}</td>
                        <td className={`p-4 ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.changePercent ? `${stock.changePercent.toFixed(2)}%` : "N/A"}
                        </td>
                        <td className="p-4">{stock.volume?.toLocaleString()}</td>
                        <td className="p-4">{stock.marketCap ? `$${stock.marketCap.toLocaleString()}` : 'N/A'}</td>
                        <td className="p-4">{stock.dayHigh && stock.dayLow ? `$${stock.dayHigh.toFixed(2)} / $${stock.dayLow.toFixed(2)}` : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
