const axios = require('axios');

const API_KEY = "GnGzk2U40zPzENGqQYkkBgWaRu_14KYd"; // Using the provided API key directly
const BASE_URL = "https://api.polygon.io";

/**
 * Get general market news from Polygon.io.
 * @returns {Array} An array of news articles.
 */
const getMarketNews = async () => {
  if (!API_KEY) {
    throw new Error("Polygon.io API key is missing.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/v2/reference/news`, {
      params: {
        apiKey: API_KEY,
        limit: 50, // Fetch top 50 articles
        order: "desc",
        sort: "published_utc",
      },
    });

    const data = response.data;
    if (data && Array.isArray(data.results)) {
      return data.results.map((article) => ({
        id: article.id || article.title,
        source: article.publisher.name,
        headline: article.title,
        summary: article.description,
        url: article.article_url,
        datetime: new Date(article.published_utc).getTime() / 1000,
      }));
    } else {
      throw new Error("Invalid data format from Polygon.io API for news.");
    }
  } catch (error) {
    console.error(
      "Polygon.io API Error (News):",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch market news.");
  }
};

module.exports = {
    getMarketNews,
};