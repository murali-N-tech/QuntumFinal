const express = require('express');
const router = express.Router();
const { 
  createPortfolio, 
  getPortfolios, 
  optimizePortfolio, 
  fetchAssetHistory 
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// POST to /api/portfolios to create a new portfolio
// GET to /api/portfolios to fetch all of the user's portfolios
router.route('/')
  .post(protect, createPortfolio)
  .get(protect, getPortfolios);

// POST to /api/portfolios/optimize to run the optimization
router.route('/optimize').post(protect, optimizePortfolio);

// GET to /api/portfolios/history/:symbol to get historical data
router.get('/history/:symbol', protect, fetchAssetHistory);

module.exports = router;
