const envUtil = require('../utils/env.util');

const login = (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        
        req.session.isAdmin = true;
        req.session.user = username;
        
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
};

const getApiKey = (req, res) => {
    const apiKey = process.env.LEONARDO_API_KEY;
    
    if (apiKey) {
        const masked = apiKey.length > 8 
            ? apiKey.slice(0, 4) + '...' + apiKey.slice(-4)
            : '***';
        
        res.json({ key: apiKey, masked: masked });
    } else {
        res.json({ key: null, masked: null });
    }
};

const updateApiKey = (req, res) => {
    const { newKey } = req.body;
    
    if (!newKey || newKey.length < 10) {
        return res.status(400).json({ error: 'Invalid API key format' });
    }
    
    try {
        envUtil.updateEnvFile('LEONARDO_API_KEY', newKey);
        res.json({ 
            success: true, 
            message: 'API key updated successfully! (Saved to .env file)' 
        });
    } catch (error) {
        console.error('Error updating .env:', error);
        res.status(500).json({ error: 'Failed to save API key to .env file' });
    }
};

const getSystemStatus = (req, res) => {
    res.json({
        status: 'online',
        leonardoConfigured: !!process.env.LEONARDO_API_KEY,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Logout failed' });
        } else {
            res.json({ success: true });
        }
    });
};

module.exports = { login, getApiKey, updateApiKey, getSystemStatus, logout };