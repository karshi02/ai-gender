const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// เสิร์ฟไฟล์ frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// สร้างโฟลเดอร์ uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่า multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
        }
    }
});

// ========== API Endpoints ==========

// Root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
        }
        
        const imagePath = `/uploads/${req.file.filename}`;
        res.json({ 
            success: true, 
            filename: req.file.filename,
            path: imagePath,
            message: 'อัปโหลดรูปสำเร็จ'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🎨 ใช้ Leonardo.ai (คุณภาพสูง ใช้เครดิต $5 ฟรี)
app.post('/api/generate-leonardo', async (req, res) => {
    try {
        const { theme, prompt } = req.body;
        
        if (!theme) {
            return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        }
        
        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
        if (!LEONARDO_API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
        }
        
        console.log(`🎨 Generating with Leonardo.ai: ${theme}`);
        
        const imagePrompt = `A professional high-quality photo of a person dressed as ${theme} (${prompt || theme}). 
Detailed, photorealistic, studio lighting, 4k, sharp focus, beautiful, cinematic lighting.`;
        
        // ลองใช้ modelId ใหม่ (Kino XL - โมเดลล่าสุดของ Leonardo)
        // หรือไม่ใส่ modelId ให้ Leonardo เลือกเอง
        const generateResponse = await fetch('https://api.leonardo.ai/v1/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LEONARDO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // ไม่ใส่ modelId ให้ใช้ default
                prompt: imagePrompt,
                negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality',
                width: 768,
                height: 768,
                num_images: 1,
                guidance_scale: 7,
                num_inference_steps: 30
            })
        });
        
        if (!generateResponse.ok) {
            const errorData = await generateResponse.text();
            console.error('Leonardo API Error:', errorData);
            
            if (generateResponse.status === 401) {
                throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ');
            }
            if (generateResponse.status === 429) {
                throw new Error('เครดิตไม่พอ หรือส่งคำขอ太多 กรุณาลองใหม่ภายหลัง');
            }
            throw new Error(`Leonardo API error: ${generateResponse.status}`);
        }
        
        const generateData = await generateResponse.json();
        const generationId = generateData.sdGenerationJob.generationId;
        
        console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
        let imageUrl = null;
        let attempts = 0;
        const maxAttempts = 30;
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const resultResponse = await fetch(`https://api.leonardo.ai/v1/generations/${generationId}`, {
                headers: { 
                    'Authorization': `Bearer ${LEONARDO_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!resultResponse.ok) {
                console.warn(`Failed to get result: ${resultResponse.status}`);
                attempts++;
                continue;
            }
            
            const resultData = await resultResponse.json();
            
            if (resultData.generations_by_pk?.generated_images?.length > 0) {
                imageUrl = resultData.generations_by_pk.generated_images[0].url;
                console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
                break;
            }
            
            attempts++;
            console.log(`⏳ Waiting for image... (${attempts}/${maxAttempts})`);
        }
        
        if (imageUrl) {
            res.json({ 
                success: true, 
                imageUrl: imageUrl,
                message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (Leonardo.ai)`,
                provider: 'leonardo'
            });
        } else {
            throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด');
        }
        
    } catch (error) {
        console.error('Leonardo.ai error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// Start server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`✅ Server running on http://localhost:${port}`);
        console.log(`📁 Upload folder: ${uploadDir}`);
        console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
        console.log(`🚀 Endpoints ready:`);
        console.log(`   - POST /api/generate-leonardo (สร้างภาพด้วย Leonardo.ai)`);
        console.log(`   - POST /api/upload (อัปโหลดรูป)`);
        console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
        console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

startServer(PORT);