import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CryptoPage = () => {
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
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

  // Filter cryptocurrencies based on the search term
  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <p className="text-center p-8 text-white">
        Loading top cryptocurrencies...
      </p>
    );
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;

  return (
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white text-center">
        Top 100 Cryptocurrencies ₿
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Ranked by market capitalization.
      </p>

      {/* Search Bar Feature */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for a cryptocurrency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCryptos.length > 0 ? (
          filteredCryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="bg-white p-6 rounded-lg shadow-xl border-2 border-black 
                         hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-10 h-10 mr-4"
                />
                <div>
                  <h2 className="font-bold text-black text-xl">
                    {crypto.name}
                  </h2>
                  <p className="text-sm text-gray-500 uppercase">
                    {crypto.symbol}
                  </p>
                </div>
              </div>
              <p className="text-2xl font-semibold text-black">
                ${crypto.price.toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  crypto.changePercent24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {crypto.changePercent24h.toFixed(2)}% (24h)
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No cryptocurrencies found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CryptoPage;