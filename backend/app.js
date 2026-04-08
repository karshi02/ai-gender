const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');

// Import routes
const mainRoutes = require('./routes/main.routes');
const aiRoutes = require('./routes/ai.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ========== Middleware ==========
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ========== Routes ==========
app.use('/', mainRoutes);
app.use('/api', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes); // สำหรับหน้า HTML

// ========== Static & Error Handling ==========
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' });
});

module.exports = app;