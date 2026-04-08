const express = require('express');
const path = require('path'); // ✅ เพิ่มบรรทัดนี้
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middlewares/auth.middleware');

// หน้า HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin.html'));
});

// API endpoints
router.post('/login', adminController.login);
router.get('/leonardo-key', requireAdmin, adminController.getApiKey);
router.post('/update-leonardo-key', requireAdmin, adminController.updateApiKey);
router.get('/system-status', requireAdmin, adminController.getSystemStatus);
router.post('/logout', adminController.logout);

module.exports = router;