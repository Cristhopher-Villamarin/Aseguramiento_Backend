const express = require('express');
const { getSocialMediaComments, analyzeSentiment} = require('../controllers/socialMediaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get social media comments
router.post('/comments', authMiddleware, getSocialMediaComments);

// Route to analyze sentiment
router.post('/analyze-sentiment', authMiddleware, analyzeSentiment);

module.exports = router;