const axios = require('axios');

const API_KEY = "GnGzk2U40zPzENGqQYkkBgWaRu_14KYd"; // Using the provided API key directly
const BASE_URL = "https://api.polygon.io";

/**
 * Fetches a list of the top 50 forex pairs from Polygon.io.
 * @returns {Array} A list of formatted forex pair objects.
 */
const getForexPairs = async () => {
  if (!API_KEY) {
    throw new Error("Polygon.io API key is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/v3/reference/tickers`, {
      params: {
        apiKey: API_KEY,
        market: "fx",
        limit: 50,
        sort: "ticker",
        order: "asc",
      },
    });

    const data = response.data;
    if (data && Array.isArray(data.results)) {
      return data.results.map((pair) => ({
        symbol: pair.ticker,
        name: pair.name,
        active: pair.active,
        locale: pair.locale,
        market: pair.market,
        currency_base: pair.ticker.split(":")[1].split("/")[0],
        currency_quote: pair.ticker.split(":")[1].split("/")[1],
      }));
    } else {
      throw new Error(
        "Invalid data format from Polygon.io API for forex pairs."
      );
    }
  } catch (error) {
    console.error(
      "Polygon.io API Error (Forex Pairs):",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch forex pairs from Polygon.io.");
  }
};

module.exports = {
  getForexPairs,
};