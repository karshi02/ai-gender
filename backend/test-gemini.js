// backend/test-gemini.js - ไฟล์ทดสอบเรียก Gemini API
require('dotenv').config();
const express = require('express');
const router = express.Router();

router.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'กรุณาส่งข้อความด้วย' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API error');
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;

        res.json({ success: true, reply });
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;