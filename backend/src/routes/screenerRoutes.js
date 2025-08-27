const express = require("express");
const router = express.Router();

const {
  fetchMultipleStockQuotes,
  fetchTopCryptos,
  fetchForexPairs,
  fetchMarketNews,
  handleAssetSearch,
  fetchCompanyProfile
} = require("../controllers/screenerController.js");

// === Stock Route (multiple quotes or top stocks) ===
router.get("/stocks/quotes", fetchMultipleStockQuotes);

// === Crypto Route ===
router.get("/crypto/top", fetchTopCryptos);

// === Forex Route ===
router.get("/forex/pairs", fetchForexPairs);

// === Trading Route ===
router.get("/trading/news", fetchMarketNews);

// === Asset Search Route (✅ corrected endpoint) ===
router.get("/assets/search", handleAssetSearch);

router.get('/screener/profile/:symbol', fetchCompanyProfile);

module.exports = router;
