const express = require('express');
const path = require('path'); // ✅ เพิ่มบรรทัดนี้
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/theme-changer.html'));
});

router.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        leonardo: !!process.env.LEONARDO_API_KEY,
        timestamp: new Date().toISOString()
    });
});

router.post('/api/upload', uploadController.upload.single('image'), uploadController.handleUpload);

module.exports = router;