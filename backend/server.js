const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON

// API Routes
app.get('/', (req, res) => res.send('Quantum Portfolio Optimizer API is running...'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/portfolios', require('./src/routes/portfolioRoutes'));
app.use('/api/screener', require('./src/routes/screenerRoutes'));
app.use('/api/translate', require('./src/routes/translationRoutes'));

// Custom Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));