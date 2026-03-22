// // // // backend/server.js
// // // const path = require('path');
// // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // const express = require('express');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const fs = require('fs');

// // // const app = express();
// // // const PORT = process.env.PORT || 3001;

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));

// // // // สร้างโฟลเดอร์ uploads
// // // const uploadDir = path.join(__dirname, '../uploads');
// // // if (!fs.existsSync(uploadDir)) {
// // //     fs.mkdirSync(uploadDir, { recursive: true });
// // // }

// // // // ตั้งค่า multer
// // // const storage = multer.diskStorage({
// // //     destination: (req, file, cb) => {
// // //         cb(null, uploadDir);
// // //     },
// // //     filename: (req, file, cb) => {
// // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // //         cb(null, uniqueSuffix + path.extname(file.originalname));
// // //     }
// // // });

// // // const upload = multer({ 
// // //     storage: storage,
// // //     limits: { fileSize: 5 * 1024 * 1024 },
// // //     fileFilter: (req, file, cb) => {
// // //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// // //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // //         const mimetype = allowedTypes.test(file.mimetype);
        
// // //         if (mimetype && extname) {
// // //             return cb(null, true);
// // //         } else {
// // //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
// // //         }
// // //     }
// // // });

// // // // ========== API Endpoints ==========

// // // // Root path
// // // app.get('/', (req, res) => {
// // //     res.json({
// // //         name: 'AI Gender Detection System API',
// // //         version: '1.0.0',
// // //         status: 'running',
// // //         port: PORT,
// // //         endpoints: {
// // //             health: 'GET /api/health',
// // //             chat: 'POST /api/chat',
// // //             models: 'GET /api/models',
// // //             upload: 'POST /api/upload',
// // //             uploads: 'GET /uploads/:filename'
// // //         },
// // //         gemini_api: process.env.GEMINI_API_KEY ? '✅ configured' : '❌ not configured',
// // //         model_used: 'gemini-2.0-flash-exp'
// // //     });
// // // });

// // // // Health check
// // // app.get('/api/health', (req, res) => {
// // //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // // });

// // // // 📋 ดูรายการโมเดลที่รองรับ
// // // app.get('/api/models', async (req, res) => {
// // //     try {
// // //         const API_KEY = process.env.GEMINI_API_KEY;
// // //         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
// // //         const data = await response.json();
        
// // //         // กรองเฉพาะโมเดลที่รองรับ generateContent
// // //         const supportedModels = data.models?.filter(model => 
// // //             model.supportedGenerationMethods?.includes('generateContent')
// // //         ).map(model => ({
// // //             name: model.name,
// // //             displayName: model.displayName,
// // //             description: model.description,
// // //             version: model.version
// // //         }));
        
// // //         res.json({ 
// // //             models: supportedModels,
// // //             total: supportedModels?.length || 0
// // //         });
// // //     } catch (error) {
// // //         res.status(500).json({ error: error.message });
// // //     }
// // // });

// // // // Chat with Gemini - ใช้โมเดลที่รองรับ
// // // app.post('/api/chat', async (req, res) => {
// // //     try {
// // //         const { message } = req.body;
        
// // //         if (!message) {
// // //             return res.status(400).json({ error: 'กรุณาส่งข้อความด้วย' });
// // //         }

// // //         const API_KEY = process.env.GEMINI_API_KEY;
        
// // //         if (!API_KEY) {
// // //             return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY ใน .env' });
// // //         }

// // //         // 🔧 เปลี่ยนเป็นโมเดลที่มีใน v1beta
// // //         // ตัวเลือกที่ใช้ได้:
// // //         // - gemini-2.0-flash-exp (experimental, มี quota จำกัด)
// // //         // - gemini-1.5-pro (อาจมี quota จำกัด)
// // //         // - gemini-pro (รุ่นเก่า แต่เสถียร)
// // //         const MODEL_NAME = 'gemini-2.0-flash-exp';  // experimental แต่ใช้ได้
        
// // //         const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// // //         console.log(`📡 Calling Gemini API with model: ${MODEL_NAME}`);
// // //         console.log(`📝 Message: ${message.substring(0, 50)}...`);

// // //         const response = await fetch(API_URL, {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({
// // //                 contents: [{ parts: [{ text: message }] }]
// // //             })
// // //         });

// // //         if (!response.ok) {
// // //             const errorData = await response.json();
// // //             console.error('API Error:', errorData);
            
// // //             // ถ้า error แนะนำให้ลองโมเดลอื่น
// // //             if (errorData.error?.message?.includes('not found')) {
// // //                 throw new Error(`โมเดล ${MODEL_NAME} ไม่พร้อมใช้งาน ลองใช้ /api/models เพื่อดูโมเดลที่รองรับ`);
// // //             }
// // //             throw new Error(errorData.error?.message || `API error: ${response.status}`);
// // //         }

// // //         const data = await response.json();
// // //         const reply = data.candidates[0].content.parts[0].text;

// // //         res.json({ success: true, reply, model: MODEL_NAME });
        
// // //     } catch (error) {
// // //         console.error('Gemini API Error:', error);
// // //         res.status(500).json({ error: error.message });
// // //     }
// // // });

// // // // Upload image
// // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // //     try {
// // //         if (!req.file) {
// // //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // //         }
        
// // //         const imagePath = `/uploads/${req.file.filename}`;
// // //         res.json({ 
// // //             success: true, 
// // //             filename: req.file.filename,
// // //             path: imagePath,
// // //             message: 'อัปโหลดรูปสำเร็จ'
// // //         });
// // //     } catch (error) {
// // //         console.error('Upload error:', error);
// // //         res.status(500).json({ error: error.message });
// // //     }
// // // });

// // // // Serve uploaded files
// // // app.use('/uploads', express.static(uploadDir));

// // // // 404 handler
// // // app.use((req, res) => {
// // //     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// // // });

// // // // Error handler
// // // app.use((err, req, res, next) => {
// // //     console.error('Server error:', err);
// // //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// // // });

// // // // Start server
// // // app.listen(PORT, () => {
// // //     console.log(`✅ Server running on http://localhost:${PORT}`);
// // //     console.log(`📁 Upload folder: ${uploadDir}`);
// // //     console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // //     console.log(`🤖 Using model: gemini-2.0-flash-exp (experimental)`);
// // //     console.log(`📄 .env path: ${path.join(__dirname, '.env')}`);
// // //     console.log(`\n📋 ดูรายการโมเดลที่รองรับ: http://localhost:${PORT}/api/models`);
// // // });
// // // backend/server.js
// // const path = require('path');
// // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // const express = require('express');
// // const cors = require('cors');
// // const multer = require('multer');
// // const fs = require('fs');

// // const app = express();
// // const PORT = process.env.PORT || 3001;

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // สร้างโฟลเดอร์ uploads
// // const uploadDir = path.join(__dirname, '../uploads');
// // if (!fs.existsSync(uploadDir)) {
// //     fs.mkdirSync(uploadDir, { recursive: true });
// // }

// // // ตั้งค่า multer
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, uploadDir);
// //     },
// //     filename: (req, file, cb) => {
// //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //         cb(null, uniqueSuffix + path.extname(file.originalname));
// //     }
// // });

// // const upload = multer({ 
// //     storage: storage,
// //     limits: { fileSize: 5 * 1024 * 1024 },
// //     fileFilter: (req, file, cb) => {
// //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// //         const mimetype = allowedTypes.test(file.mimetype);
        
// //         if (mimetype && extname) {
// //             return cb(null, true);
// //         } else {
// //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
// //         }
// //     }
// // });

// // // ========== API Endpoints ==========

// // // Root path
// // app.get('/', (req, res) => {
// //     res.json({
// //         name: 'AI Gender Detection System API',
// //         version: '1.0.0',
// //         status: 'running',
// //         port: PORT,
// //         endpoints: {
// //             health: 'GET /api/health',
// //             chat: 'POST /api/chat',
// //             models: 'GET /api/models',
// //             upload: 'POST /api/upload',
// //             uploads: 'GET /uploads/:filename'
// //         },
// //         gemini_api: process.env.GEMINI_API_KEY ? '✅ configured' : '❌ not configured',
// //         current_model: 'models/gemini-2.0-flash'
// //     });
// // });

// // // Health check
// // app.get('/api/health', (req, res) => {
// //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // });

// // // 📋 ดูรายการโมเดลที่รองรับ
// // app.get('/api/models', async (req, res) => {
// //     try {
// //         const API_KEY = process.env.GEMINI_API_KEY;
// //         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
// //         const data = await response.json();
        
// //         // กรองเฉพาะโมเดลที่รองรับ generateContent
// //         const supportedModels = data.models?.filter(model => 
// //             model.supportedGenerationMethods?.includes('generateContent')
// //         ).map(model => ({
// //             name: model.name,
// //             displayName: model.displayName,
// //             description: model.description,
// //             version: model.version
// //         }));
        
// //         res.json({ 
// //             models: supportedModels,
// //             total: supportedModels?.length || 0
// //         });
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // Chat with Gemini - ใช้โมเดลที่ถูกต้อง (มี "models/" นำหน้า)
// // app.post('/api/chat', async (req, res) => {
// //     try {
// //         const { message } = req.body;
        
// //         if (!message) {
// //             return res.status(400).json({ error: 'กรุณาส่งข้อความด้วย' });
// //         }

// //         const API_KEY = process.env.GEMINI_API_KEY;
        
// //         if (!API_KEY) {
// //             return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY ใน .env' });
// //         }

// //         // ✅ ใช้ชื่อโมเดลที่ถูกต้องตามที่แสดงใน /api/models
// //         // ตัวเลือกแนะนำ:
// //         // - models/gemini-2.0-flash (เสถียร, เร็ว, quota สูง)
// //         // - models/gemini-2.5-flash (รุ่นใหม่กว่า)
// //         // - models/gemini-2.0-flash-lite (ประหยัด quota)
// //         // const MODEL_NAME = 'models/gemini-2.0-flash';
        
// //         // ใน server.js เปลี่ยน MODEL_NAME เป็นตัวใดตัวหนึ่ง
// //         const MODEL_NAME = 'models/gemini-2.5-flash-lite';  // หรือ
// // // const MODEL_NAME = 'models/gemini-2.0-flash-lite';  // หรือ
// // // const MODEL_NAME = 'models/gemma-3-12b-it';  // โมเดล open source
// //         // ใช้ v1beta API พร้อมชื่อโมเดลเต็ม
// //         const API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// //         console.log(`📡 Calling Gemini API with model: ${MODEL_NAME}`);
// //         console.log(`📝 Message: ${message.substring(0, 50)}...`);

// //         const response = await fetch(API_URL, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({
// //                 contents: [{ parts: [{ text: message }] }]
// //             })
// //         });

// //         if (!response.ok) {
// //             const errorData = await response.json();
// //             console.error('API Error:', errorData);
            
// //             // จัดการ error quota
// //             if (errorData.error?.message?.includes('quota')) {
// //                 throw new Error(`Quota หมดแล้ว กรุณารอสักครู่หรือลองใหม่พรุ่งนี้\nรายละเอียด: ${errorData.error.message}`);
// //             }
            
// //             throw new Error(errorData.error?.message || `API error: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         const reply = data.candidates[0].content.parts[0].text;

// //         res.json({ success: true, reply, model: MODEL_NAME });
        
// //     } catch (error) {
// //         console.error('Gemini API Error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // Upload image
// // app.post('/api/upload', upload.single('image'), (req, res) => {
// //     try {
// //         if (!req.file) {
// //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// //         }
        
// //         const imagePath = `/uploads/${req.file.filename}`;
// //         res.json({ 
// //             success: true, 
// //             filename: req.file.filename,
// //             path: imagePath,
// //             message: 'อัปโหลดรูปสำเร็จ'
// //         });
// //     } catch (error) {
// //         console.error('Upload error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // Serve uploaded files
// // app.use('/uploads', express.static(uploadDir));

// // // 404 handler
// // app.use((req, res) => {
// //     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// // });

// // // Error handler
// // app.use((err, req, res, next) => {
// //     console.error('Server error:', err);
// //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// // });

// // // Start server
// // app.listen(PORT, () => {
// //     console.log(`✅ Server running on http://localhost:${PORT}`);
// //     console.log(`📁 Upload folder: ${uploadDir}`);
// //     console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// //     console.log(`🤖 Using model: models/gemini-2.0-flash`);
// //     console.log(`📄 .env path: ${path.join(__dirname, '.env')}`);
// //     console.log(`\n📋 ดูรายการโมเดลที่รองรับ: http://localhost:${PORT}/api/models`);
// // });




// // เพิ่ม endpoint สำหรับสร้างภาพตามธีม
// app.post('/api/generate-themed-image', async (req, res) => {
//     try {
//         const { image, theme, prompt } = req.body;
        
//         if (!image || !theme) {
//             return res.status(400).json({ error: 'กรุณาส่งรูปและธีม' });
//         }
        
//         const API_KEY = process.env.GEMINI_API_KEY;
        
//         if (!API_KEY) {
//             return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY' });
//         }
        
//         // ใช้ Gemini 2.0 Flash Vision หรือโมเดลที่รองรับภาพ
//         const MODEL_NAME = 'models/gemini-2.0-flash-exp';
        
//         // สร้าง prompt สำหรับ Gemini
//         const userPrompt = `You are an AI that changes the outfit/style of a person in a photo.
        
// Original photo is provided. Please analyze the face and body in the photo, then create a new image where the person is wearing/dressed as: ${theme} (${prompt}).

// Requirements:
// - Keep the face and hair exactly the same
// - Change only the outfit, accessories, and background to match the theme
// - Make the result look natural and photorealistic
// - Output should be a single image

// Return the result as a base64 encoded image.`;

//         // เรียก Gemini API (ต้องใช้โมเดลที่รองรับ vision + generation)
//         // หมายเหตุ: Gemini ปกติไม่รองรับการสร้างภาพโดยตรง ต้องใช้ Imagen
//         // วิธีนี้เป็นการส่ง prompt และรอให้ Gemini คืนคำอธิบาย
        
//         const API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
//         // ส่งรูปเป็น base64
//         const requestBody = {
//             contents: [{
//                 parts: [
//                     { text: userPrompt },
//                     {
//                         inline_data: {
//                             mime_type: "image/jpeg",
//                             data: image.split(',')[1] // เอา base64 ส่วน data
//                         }
//                     }
//                 ]
//             }]
//         };
        
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(requestBody)
//         });
        
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error?.message || 'API error');
//         }
        
//         const data = await response.json();
        
//         // Gemini จะคืนคำอธิบายวิธีการเปลี่ยน
//         const description = data.candidates[0].content.parts[0].text;
        
//         // สำหรับตอนนี้ยังไม่สามารถสร้างภาพได้จริง
//         // ส่งคำอธิบายกลับไป (หรือจะใช้ fallback image)
//         res.json({ 
//             success: true, 
//             description: description,
//             imageUrl: null, // ยังไม่มีภาพจริง
//             message: `Gemini แนะนำ: ${description.substring(0, 200)}...\n\n(หมายเหตุ: การสร้างภาพจริงต้องใช้โมเดล Imagen ซึ่งต้องเปิด billing)`
//         });
        
//     } catch (error) {
//         console.error('Generate error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });


// backend/server.js - เต็มรูปแบบ

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // เพิ่ม limit สำหรับรูป base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    limits: { fileSize: 10 * 1024 * 1024 }, // เพิ่มเป็น 10MB
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
    res.json({
        name: 'AI Gender Detection System API',
        version: '1.0.0',
        status: 'running',
        port: PORT,
        endpoints: {
            health: 'GET /api/health',
            chat: 'POST /api/chat',
            models: 'GET /api/models',
            upload: 'POST /api/upload',
            generateTheme: 'POST /api/generate-themed-image',
            uploads: 'GET /uploads/:filename'
        },
        gemini_api: process.env.GEMINI_API_KEY ? '✅ configured' : '❌ not configured',
        current_model: 'models/gemini-2.5-flash-lite'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// 📋 ดูรายการโมเดลที่รองรับ
app.get('/api/models', async (req, res) => {
    try {
        const API_KEY = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        const supportedModels = data.models?.filter(model => 
            model.supportedGenerationMethods?.includes('generateContent')
        ).map(model => ({
            name: model.name,
            displayName: model.displayName,
            description: model.description,
            version: model.version
        }));
        
        res.json({ 
            models: supportedModels,
            total: supportedModels?.length || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chat with Gemini
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'กรุณาส่งข้อความด้วย' });
        }

        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY ใน .env' });
        }

        // const MODEL_NAME = 'models/gemini-2.5-flash-lite';
        // const MODEL_NAME = 'models/gemini-2.5-flash-lite';
        const MODEL_NAME = 'models/gemini-3.1-flash-image-preview';  // Nano Banana 2
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`;

        console.log(`📡 Calling Gemini API with model: ${MODEL_NAME}`);
        console.log(`📝 Message: ${message.substring(0, 50)}...`);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            if (response.status === 429 || errorData.error?.message?.includes('quota')) {
                const errorMsg = errorData.error?.message || '';
                const match = errorMsg.match(/retry in (\d+\.?\d*)s/);
                const waitTime = match ? parseFloat(match[1]) : 60;
                
                throw new Error(`Quota หมด กรุณารอ ${Math.ceil(waitTime)} วินาที หรือลองใหม่พรุ่งนี้`);
            }
            
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;

        res.json({ success: true, reply, model: MODEL_NAME });
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload image
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
//         }
        
//         const imagePath = `/uploads/${req.file.filename}`;
//         res.json({ 
//             success: true, 
//             filename: req.file.filename,
//             path: imagePath,
//             message: 'อัปโหลดรูปสำเร็จ'
//         });
//     } catch (error) {
//         console.error('Upload error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // 🎨 สร้างภาพตามธีม (NEW)
// app.post('/api/generate-themed-image', async (req, res) => {
//     try {
//         const { image, theme, prompt } = req.body;
        
//         if (!image || !theme) {
//             return res.status(400).json({ error: 'กรุณาส่งรูปและธีม' });
//         }
        
//         const API_KEY = process.env.GEMINI_API_KEY;
        
//         if (!API_KEY) {
//             return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY' });
//         }
        
//         console.log(`🎨 Generating themed image: ${theme}`);
//         console.log(`📸 Image size: ${Math.round(image.length / 1024)} KB`);
        
//         // ใช้ Gemini 2.0 Flash (รองรับ vision)
//         const MODEL_NAME = 'models/gemini-2.0-flash';
        
//         const userPrompt = `You are an AI that changes the outfit/style of a person in a photo.

// Task: Change the person in the provided photo to look like a ${theme} (${prompt}).

// Requirements:
// - Keep the face, hair, and facial features exactly the same
// - Change only the outfit, accessories, and background to match the theme
// - Make the result look natural and photorealistic
// - Describe in detail what the new image should look like

// Please provide:
// 1. A detailed description of the transformed image
// 2. Suggestions for outfit, accessories, colors, and background

// Return only the description, no other text.`;

//         const API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
//         // เอา base64 data ส่วนที่ไม่มี prefix
//         const base64Data = image.split(',')[1] || image;
        
//         const requestBody = {
//             contents: [{
//                 parts: [
//                     { text: userPrompt },
//                     {
//                         inline_data: {
//                             mime_type: "image/jpeg",
//                             data: base64Data
//                         }
//                     }
//                 ]
//             }]
//         };
        
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(requestBody)
//         });
        
//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error('API Error:', errorData);
            
//             if (response.status === 429) {
//                 throw new Error(`Quota หมด กรุณารอสักครู่หรือลองใหม่พรุ่งนี้`);
//             }
//             throw new Error(errorData.error?.message || 'API error');
//         }
        
//         const data = await response.json();
//         const description = data.candidates[0].content.parts[0].text;
        
//         console.log(`✅ Generated description for theme: ${theme}`);
        
//         // สำหรับตอนนี้ยังไม่สามารถสร้างภาพได้จริง
//         // ส่งคำอธิบายกลับไป และใช้ placeholder image
//         res.json({ 
//             success: true, 
//             description: description,
//             imageUrl: null,
//             message: `🎨 คำแนะนำจาก AI:\n\n${description}\n\n⚠️ หมายเหตุ: การสร้างภาพจริงต้องใช้โมเดล Imagen ซึ่งต้องเปิด billing`
//         });
        
//     } catch (error) {
//         console.error('Generate error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });
// 🎨 สร้างภาพตามธีม ด้วย Nano Banana Pro (สร้างภาพจริง)
app.post('/api/generate-themed-image', async (req, res) => {
    try {
        const { image, theme, prompt } = req.body;
        
        if (!image || !theme) {
            return res.status(400).json({ error: 'กรุณาส่งรูปและธีม' });
        }
        
        const API_KEY = process.env.GEMINI_API_KEY;
        
        if (!API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ GEMINI_API_KEY' });
        }
        
        console.log(`🎨 Generating image with Nano Banana Pro: ${theme}`);
        console.log(`📸 Image size: ${Math.round(image.length / 1024)} KB`);
        
        // ✅ ใช้ Nano Banana Pro (Gemini 3 Pro Image Preview) - สร้างภาพได้จริง!
        const MODEL_NAME = 'models/gemini-3-pro-image-preview';  // Nano Banana Pro
        
        // Prompt สำหรับสร้างภาพ
        const imagePrompt = `Transform this person to look like a ${theme} (${prompt}).
        
Requirements:
- Keep the face and hair exactly the same
- Change outfit, accessories, and background to match the ${theme} theme
- Make it look natural and photorealistic
- Output a high-quality image

Style: ${theme} theme, professional photography, high detail, natural lighting`;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`;
        
        // เอา base64 data ส่วนที่ไม่มี prefix
        const base64Data = image.split(',')[1] || image;
        
        const requestBody = {
            contents: [{
                parts: [
                    { text: imagePrompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 1.0,
                candidateCount: 1,
                // สำหรับโมเดลสร้างภาพ อาจมี parameter พิเศษ
            }
        };
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            if (response.status === 429) {
                throw new Error(`Quota หมด กรุณารอสักครู่หรือลองใหม่พรุ่งนี้`);
            }
            throw new Error(errorData.error?.message || 'API error');
        }
        
        const data = await response.json();
        
        // โมเดลสร้างภาพจะคืนรูปเป็น base64 ในส่วนของ inline_data
        let generatedImage = null;
        let description = null;
        
        // ตรวจสอบว่า response มีรูปหรือไม่
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const parts = data.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inline_data && part.inline_data.data) {
                    // ได้รูปเป็น base64
                    generatedImage = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
                    break;
                } else if (part.text) {
                    description = part.text;
                }
            }
        }
        
        console.log(`✅ Generated image for theme: ${theme}`);
        
        if (generatedImage) {
            res.json({ 
                success: true, 
                imageUrl: generatedImage,
                description: description,
                message: `✨ สร้างภาพธีม ${theme} สำเร็จ!`
            });
        } else {
            // Fallback: ถ้าไม่มีรูป ให้คืนคำอธิบาย
            res.json({ 
                success: true, 
                description: description || 'สร้างภาพสำเร็จ แต่ไม่ได้รับข้อมูลรูป',
                imageUrl: null,
                message: `⚠️ ได้รับคำอธิบายจาก AI แต่ไม่มีข้อมูลรูป: ${description?.substring(0, 200)}`
            });
        }
        
    } catch (error) {
        console.error('Generate error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// 404 handler (ต้องอยู่ท้ายสุด)
app.use((req, res) => {
    res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📁 Upload folder: ${uploadDir}`);
    console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
    console.log(`🤖 Using model: models/gemini-2.5-flash-lite`);
    console.log(`🎨 Theme changer endpoint: /api/generate-themed-image`);
    console.log(`📄 .env path: ${path.join(__dirname, '.env')}`);
});
