import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PieChart from '../components/PieChart';
import MultiLineChart from '../components/LineChart';
import { useAuth } from '../context/AuthContext';

const ASSET_CATEGORIES = {
  Stocks: ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA", "TSLA", "META", "JPM"],
  Crypto: ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "DOGE-USD", "ADA-USD"],
  Forex: ["EURUSD=X", "JPY=X", "GBPUSD=X", "AUDUSD=X", "USDCAD=X", "USDCHF=X"]
};

const PortfolioPage = () => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [customAssets, setCustomAssets] = useState([]);
  const [customAssetInput, setCustomAssetInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('Stocks');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-quantum-bg text-white min-h-screen p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold mb-4">Access Denied</h2>
        <p className="mt-2 text-gray-400">
          Please{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            log in
          </Link>{" "}
          to use the optimizer.
        </p>
      </div>
    );
  }

  const handleAddCustomAsset = () => {
    const newAsset = customAssetInput.trim().toUpperCase();
    if (newAsset && ![...Object.values(ASSET_CATEGORIES).flat(), ...customAssets].includes(newAsset)) {
      setCustomAssets(prev => [...prev, newAsset]);
      setSelectedAssets(prev => [...prev, newAsset]);
      setCustomAssetInput('');
    }
  };

  const handleAssetToggle = (asset) => {
    setSelectedAssets(prev =>
      prev.includes(asset) ? prev.filter(a => a !== asset) : [...prev, asset]
    );
  };
  
  // Corrected function to process historical data and prevent NaN errors.
  const processChartData = (histories) => {
    const combinedData = {};
    const initialPrices = {};
    const allDates = new Set();

    // First, gather all unique dates and find the first valid price for each asset.
    histories.forEach(({ asset, data }) => {
      if (data && data.length > 0) {
        initialPrices[asset] = data[0].price;
        data.forEach(point => {
          allDates.add(point.date);
        });
      }
    });

    // Create a sorted array of all unique dates from all assets.
    const sortedDates = Array.from(allDates).sort();
    
    // Build the chart data object, date by date.
    sortedDates.forEach(date => {
        combinedData[date] = { date };

        histories.forEach(({ asset, data }) => {
            if (data && data.length > 0) {
                const point = data.find(p => p.date === date);
                // If a data point for this date exists, calculate its performance.
                if (point) {
                    const performance = ((point.price - initialPrices[asset]) / initialPrices[asset]) * 100;
                    combinedData[date][asset] = performance;
                }
            }
        });
    });

    // Convert the data object to an array for charting.
    const finalChartData = Object.values(combinedData);
    const assetKeys = histories.map(h => h.asset);

    // Forward-fill any missing data points to create continuous chart lines.
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
      setError('Please select at least 2 assets to optimize.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResults(null);
    setChartData([]);

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

  const currentAssets = ASSET_CATEGORIES[activeCategory] || [];

  return (
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
        Quantum Portfolio Optimizer ✨
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Harness the power of quantum computing for smarter investments.
      </p>

      {/* Main container with white background and black border */}
      <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-black">
          1. Select Your Assets
        </h2>

        <div className="border-b border-gray-300 mb-6">
          <nav className="-mb-px flex space-x-6">
            {Object.keys(ASSET_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                           ${
                             activeCategory === category
                               ? "border-blue-500 text-blue-600"
                               : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {currentAssets.map((asset) => (
            <button
              key={asset}
              onClick={() => handleAssetToggle(asset)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 
                         ${
                           selectedAssets.includes(asset)
                             ? "bg-blue-600 text-white border-blue-600"
                             : "bg-white text-black border-black hover:bg-gray-100"
                         }`}
            >
              {asset}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2 text-black">
            Add Custom Asset
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={customAssetInput}
              onChange={(e) => setCustomAssetInput(e.target.value)}
              placeholder="Enter stock ticker (e.g., VOO)"
              className="flex-grow px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            />
            <button
              onClick={handleAddCustomAsset}
              className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-black pt-6">
          <h3 className="font-bold text-black text-lg">
            Selected Assets ({selectedAssets.length}):
          </h3>
          <p className="text-sm text-gray-600 break-words mt-2">
            {selectedAssets.length > 0 ? selectedAssets.join(", ") : "None"}
          </p>
        </div>
      </div>

      <button
        onClick={handleOptimize}
        disabled={isLoading || selectedAssets.length < 2}
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg 
                   hover:bg-green-700 disabled:bg-gray-400 transition-colors text-lg mt-8 max-w-7xl mx-auto block"
      >
        {isLoading
          ? "Running Quantum Simulation & Fetching History..."
          : "Optimize Portfolio"}
      </button>

      {error && (
        <div className="text-red-500 mt-4 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="mt-8 space-y-8 max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-black text-center">
              Optimal Portfolio Allocation
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-black">
                    Optimal Weights:
                  </h3>
                  <ul className="list-disc list-inside text-gray-800 mt-2">
                    {Object.entries(results.optimal_weights).map(
                      ([asset, weight]) => (
                        <li
                          key={asset}
                          className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="font-bold">{asset}:</span>
                          <span>{(weight * 100).toFixed(2)}%</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">
                    Performance Metrics:
                  </h3>
                  <ul className="text-gray-800 mt-2">
                    <li className="py-1 border-b border-gray-200 flex justify-between">
                      <strong>Sharpe Ratio:</strong>{" "}
                      <span>{results.performance.sharpe_ratio}</span>
                    </li>
                    <li className="py-1 border-b border-gray-200 flex justify-between">
                      <strong>Expected Return:</strong>{" "}
                      <span>
                        {(
                          results.performance.expected_annual_return * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </li>
                    <li className="py-1 flex justify-between">
                      <strong>Volatility:</strong>{" "}
                      <span>
                        {(results.performance.annual_volatility * 100).toFixed(
                          2
                        )}
                        %
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <PieChart data={results.optimal_weights} />
              </div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-black animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-black text-center">
                Historical Performance Comparison (1Y)
              </h2>
              <div className="h-[400px] w-full">
                <MultiLineChart data={chartData} assets={selectedAssets} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;