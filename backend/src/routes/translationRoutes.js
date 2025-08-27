const express = require('express');
const router = express.Router();
const { handleTranslation } = require('../controllers/translationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, handleTranslation); // Protect the endpoint

module.exports = router;