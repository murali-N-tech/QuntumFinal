const axios = require("axios");

const API_KEY ="M6LLgNCI8QmzY9DaGJDQtL4NW4epSjAk"; // Replace with your API key
const BASE_URL = "https://financialmodelingprep.com/api/v3";

// Helper: chunk array into smaller batches
const chunkArray = (arr, size) =>
  arr.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]),
    []
  );

/**
 * Fetches real-time quotes for multiple stock symbols (batched).
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
    throw new Error("Failed to fetch stock quotes from Financial Modeling Prep.");
  }
};

/**
 * Fetches a list of the top 100–250 US stocks and retrieves their quote data.
 */
const getTopStocksWithQuotes = async () => {
  if (!API_KEY) throw new Error("Financial Modeling Prep API key is missing.");

  try {
    const response = await axios.get(`${BASE_URL}/stock-screener`, {
      params: {
        limit: 100, // can increase to 250
        exchange: "NYSE,NASDAQ,AMEX",
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

/**
 * Searches for assets by ticker or name.
 */
const searchAssets = async (query) => {
  if (!API_KEY) throw new Error("Financial Modeling Prep API key is missing.");
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        query: query,
        limit: 10,
        exchange: "NASDAQ,NYSE,AMEX",
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("FMP Service Error (Search):", error.message);
    throw new Error("Failed to search for assets.");
  }
};
/**
 * Fetches the detailed profile for a single company.
 * @param {string} symbol - The stock ticker.
 * @returns {object} The company profile data.
 */
const getCompanyProfile = async (symbol) => {
  if (!API_KEY) throw new Error("Financial Modeling Prep API key is missing.");
  try {
    const response = await axios.get(`${BASE_URL}/profile/${symbol}`, {
      params: { apikey: API_KEY },
    });
    return response.data[0]; // The API returns an array with one object
  } catch (error) {
    console.error("FMP Service Error (Profile):", error.message);
    throw new Error("Failed to fetch company profile.");
  }
};

module.exports = {
  getMultipleStockQuotes,
  getTopStocksWithQuotes,
  searchAssets,
  getCompanyProfile
};
