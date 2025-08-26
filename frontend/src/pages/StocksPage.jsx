import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 25;

  // Initial fetch for top stocks with quotes
  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        const response = await api.get("/screener/stocks/quotes");
        setStocks(
          response.data.filter((stock) => stock && stock.price && stock.symbol)
        );
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Failed to fetch top stocks. Please check your API key and try again.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialStocks();
  }, []);

  // Function to handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/screener/stocks/quotes?symbols=${searchTerm.toUpperCase()}`
      );

      const newStocks = response.data;
      if (newStocks && newStocks.length > 0) {
        setStocks(
          newStocks.filter((stock) => stock && stock.price && stock.symbol)
        );
      } else {
        setError(`No results found for ticker: ${searchTerm}`);
        setStocks([]);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while searching for the stock.";
      setError(errorMessage);
      setStocks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stock.name &&
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = filteredStocks.slice(
    indexOfFirstStock,
    indexOfLastStock
  );
  const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading)
    return <p className="text-center p-8 text-white">Loading stocks...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
        Popular Stocks 📈
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Real-time quotes powered by FMP.
      </p>

      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for a stock ticker..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-xl border-2 border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200 border-b-2 border-black">
            <tr>
              <th className="p-4 text-black font-bold">Symbol</th>
              <th className="p-4 hidden sm:table-cell text-black font-bold">
                Company Name
              </th>
              <th className="p-4 text-black font-bold">Price</th>
              <th className="p-4 text-black font-bold">Change (%)</th>
              <th className="p-4 hidden md:table-cell text-black font-bold">
                Volume
              </th>
              <th className="p-4 hidden md:table-cell text-black font-bold">
                Market Cap
              </th>
              <th className="p-4 hidden md:table-cell text-black font-bold">
                High / Low
              </th>
            </tr>
          </thead>
          <tbody>
            {currentStocks.length > 0 ? (
              currentStocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="p-4 font-mono font-semibold text-blue-600">
                    <Link
                      to={`/asset/${stock.symbol}`}
                      className="hover:underline"
                    >
                      {stock.symbol}
                    </Link>
                  </td>
                  <td className="p-4 hidden sm:table-cell text-gray-800">
                    {stock.name || "N/A"}
                  </td>

                  <td className="p-4 font-semibold text-gray-800">
                    {stock.price ? `$${stock.price.toFixed(2)}` : "N/A"}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      stock.changePercent >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stock.changePercent
                      ? `${stock.changePercent.toFixed(2)}%`
                      : "N/A"}
                  </td>

                  <td className="p-4 hidden md:table-cell text-gray-800">
                    {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                  </td>

                  <td className="p-4 hidden md:table-cell text-gray-800">
                    {stock.marketCap
                      ? `$${stock.marketCap.toLocaleString()}`
                      : "N/A"}
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-800">
                    {stock.dayHigh && stock.dayLow
                      ? `$${stock.dayHigh.toFixed(2)} / $${stock.dayLow.toFixed(
                          2
                        )}`
                      : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-600">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200
                         ${
                           currentPage === index + 1
                             ? "bg-blue-600 text-white"
                             : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                         }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StocksPage;