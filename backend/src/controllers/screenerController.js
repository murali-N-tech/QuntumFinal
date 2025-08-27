const {
  getMultipleStockQuotes,
  getTopStocksWithQuotes,
  searchAssets,
  getCompanyProfile
} = require("../services/stockService.js");
const { getTopCryptos } = require("../services/cryptoService.js");
const { getForexPairs } = require("../services/forexService.js");
const { getMarketNews } = require("../services/tradingService.js");

// === Stock Controller ===
const fetchMultipleStockQuotes = async (req, res, next) => {
  try {
    const symbols = req.query.symbols;
    if (symbols) {
      const quotes = await getMultipleStockQuotes(symbols.split(","));
      return res.json(quotes);
    } else {
      const topStocks = await getTopStocksWithQuotes();
      return res.json(topStocks);
    }
  } catch (error) {
    next(error);
  }
};

// === Crypto Controller ===
const fetchTopCryptos = async (req, res, next) => {
  try {
    const data = await getTopCryptos();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// === Forex Controller ===
const fetchForexPairs = async (req, res, next) => {
  try {
    const data = await getForexPairs();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// === Trading Controller ===
const fetchMarketNews = async (req, res, next) => {
  try {
    const data = await getMarketNews();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// === Asset Search Controller ===
const handleAssetSearch = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Query parameter (q) is required." });
    }
    const results = await searchAssets(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};
const fetchCompanyProfile = async (req, res, next) => {
    try {
        const { symbol } = req.params;
        const profile = await getCompanyProfile(symbol);
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

module.exports = {
  fetchMultipleStockQuotes,
  fetchTopCryptos,
  fetchForexPairs,
  fetchMarketNews,
  handleAssetSearch,
  fetchCompanyProfile
};
