// ตัวอย่าง Node.js + Express
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Get API key endpoint
app.get('/api/admin/leonardo-key', (req, res) => {
    if (!req.session.isAdmin) return res.status(401).json({ error: 'Unauthorized' });
    const key = process.env.LEONARDO_API_KEY;
    res.json({ 
        key: key,
        masked: key ? key.slice(0,4) + '...' + key.slice(-4) : null 
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));