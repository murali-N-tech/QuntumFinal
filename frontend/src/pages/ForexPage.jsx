import React, { useState, useEffect } from 'react';
import api from '../services/api';

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

  if (isLoading)
    return (
      <p className="text-center p-8 text-white">Loading major Forex pairs...</p>
    );
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
        Forex Market 🌍
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Live data for major currency pairs.
      </p>

      <div className="bg-white rounded-lg shadow-xl border-2 border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200 border-b-2 border-black">
            <tr>
              <th className="p-4 text-black font-bold">Symbol</th>
              <th className="p-4 text-black font-bold">Name</th>
              <th className="p-4 hidden sm:table-cell text-black font-bold">
                Active
              </th>
              <th className="p-4 hidden md:table-cell text-black font-bold">
                Locale
              </th>
              <th className="p-4 hidden md:table-cell text-black font-bold">
                Market
              </th>
              <th className="p-4 text-black font-bold">Base / Quote</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair) => (
              <tr
                key={pair.symbol}
                className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="p-4 font-mono font-semibold text-blue-600">
                  {pair.symbol}
                </td>
                <td className="p-4 text-gray-800">{pair.name}</td>
                <td className="p-4 hidden sm:table-cell text-gray-800">
                  {pair.active ? "Yes" : "No"}
                </td>
                <td className="p-4 hidden md:table-cell text-gray-800">
                  {pair.locale}
                </td>
                <td className="p-4 hidden md:table-cell text-gray-800">
                  {pair.market}
                </td>
                <td className="p-4 text-gray-800">
                  {pair.currency_base} / {pair.currency_quote}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForexPage;