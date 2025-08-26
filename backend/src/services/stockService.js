const axios = require("axios");

const API_KEY = "PTn1XDIPjwLUoNwcn9fvhsYmfxgagL0J"; // Your API key
const BASE_URL = "https://financialmodelingprep.com/api/v3";

// Helper: chunk array into smaller batches
const chunkArray = (arr, size) =>
  arr.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    []
  );

/**
 * Fetches real-time quotes for multiple stock symbols (batched).
 * @param {string[]} symbols - Array of stock tickers.
 * @returns {Array} A list of formatted stock quote objects.
 */
const getMultipleStockQuotes = async (symbols) => {
  if (!API_KEY) throw new Error("Financial Modeling Prep API key is missing.");

  try {
    const chunks = chunkArray(symbols, 50); // API works best with ≤ 50 symbols
    const results = [];

    for (const chunk of chunks) {
      const response = await axios.get(`${BASE_URL}/quote/${chunk.join(",")}`, {
        params: { apikey: API_KEY },
      });
      results.push(...response.data);
    }

    return results.map((data) => ({
      symbol: data.symbol,
      name: data.name,
      price: data.price ?? "N/A",
      changePercent: data.changesPercentage ?? "N/A",
      volume: data.volume ?? "N/A",
      marketCap: data.marketCap ?? "N/A",
      dayHigh: data.dayHigh ?? "N/A",
      dayLow: data.dayLow ?? "N/A",
    }));
  } catch (error) {
    console.error(
      "FMP Service Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      "Failed to fetch stock quotes from Financial Modeling Prep."
    );
  }
};

/**
 * Fetches a list of the top 100–250 US stocks and retrieves their quote data.
 * @returns {Array} A list of stock objects.
 */
const getTopStocksWithQuotes = async () => {
  if (!API_KEY) throw new Error("Financial Modeling Prep API key is missing.");

  try {
    // ✅ Use stock-screener (valid endpoint)
    const response = await axios.get(`${BASE_URL}/stock-screener`, {
      params: {
        limit: 100, // you can increase to 250
        exchange: "NYSE,NASDAQ,AMEX", // supported US exchanges
        apikey: API_KEY,
      },
    });

    const symbols = response.data.map((stock) => stock.symbol);
    return getMultipleStockQuotes(symbols);
  } catch (error) {
    console.error(
      "FMP Service Error (Top Stocks):",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch top stocks from Financial Modeling Prep.");
  }
};

module.exports = {
  getMultipleStockQuotes,
  getTopStocksWithQuotes,
};
