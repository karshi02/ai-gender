const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/generate-leonardo', aiController.generateSingle);
router.post('/generate-4', aiController.generateBulk);

module.exports = router;