const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalValue: {
    type: Number,
    required: true
  },
  allocation: {
    type: Map,
    of: Number,
    required: true
  },
  assets: [{
    symbol: String,
    weight: Number,
    amount: Number
  }],
  performance: {
    expectedReturn: Number,
    volatility: Number,
    sharpeRatio: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);