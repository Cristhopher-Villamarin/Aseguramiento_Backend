const express = require('express');
const { getSocialMediaComments } = require('../controllers/socialMediaController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get social media comments
router.post('/comments', authMiddleware, getSocialMediaComments);

module.exports = router;