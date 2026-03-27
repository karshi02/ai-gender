// // // // // // const path = require('path');
// // // // // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // // // // const express = require('express');
// // // // // // const cors = require('cors');
// // // // // // const multer = require('multer');
// // // // // // const fs = require('fs');

// // // // // // const app = express();
// // // // // // const PORT = process.env.PORT || 3000;

// // // // // // // Middleware
// // // // // // app.use(cors());
// // // // // // app.use(express.json({ limit: '50mb' }));
// // // // // // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // // // // // เสิร์ฟไฟล์ frontend
// // // // // // app.use(express.static(path.join(__dirname, '../frontend')));

// // // // // // // สร้างโฟลเดอร์ uploads
// // // // // // const uploadDir = path.join(__dirname, '../uploads');
// // // // // // if (!fs.existsSync(uploadDir)) {
// // // // // //     fs.mkdirSync(uploadDir, { recursive: true });
// // // // // // }

// // // // // // // ตั้งค่า multer
// // // // // // const storage = multer.diskStorage({
// // // // // //     destination: (req, file, cb) => {
// // // // // //         cb(null, uploadDir);
// // // // // //     },
// // // // // //     filename: (req, file, cb) => {
// // // // // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // // // // //         cb(null, uniqueSuffix + path.extname(file.originalname));
// // // // // //     }
// // // // // // });

// // // // // // const upload = multer({ 
// // // // // //     storage: storage,
// // // // // //     limits: { fileSize: 10 * 1024 * 1024 },
// // // // // //     fileFilter: (req, file, cb) => {
// // // // // //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// // // // // //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // // // // //         const mimetype = allowedTypes.test(file.mimetype);
// // // // // //         const filename = file.originalname.toLowerCase();
// // // // // //         const nameWithoutExt = path.parse(filename).name; // ตรวจสอบชื่อไฟล์ด้วย (ไม่อนุญาตให้มีคำว่า "exe", "js", "sh" ในชื่อไฟล์)
// // // // // //         const forbiddenPatterns = /exe|js|sh|bat|cmd|php|pl|py|rb|jar/;
// // // // // //         const isSafeName = !forbiddenPatterns.test(nameWithoutExt);
        
// // // // // //         if (mimetype && extname) {
// // // // // //             return cb(null, true);
// // // // // //         } else {
// // // // // //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
// // // // // //         }
// // // // // //     }
// // // // // // });

// // // // // // // ========== API Endpoints ==========

// // // // // // // Root path
// // // // // // app.get('/', (req, res) => {
// // // // // //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // // // // // });

// // // // // // // Health check
// // // // // // app.get('/api/health', (req, res) => {
// // // // // //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // // // // // });

// // // // // // // Upload image
// // // // // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // // // // //     try {
// // // // // //         if (!req.file) {
// // // // // //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // // // // //         }
        
// // // // // //         const imagePath = `/uploads/${req.file.filename}`;
// // // // // //         res.json({ 
// // // // // //             success: true, 
// // // // // //             filename: req.file.filename,
// // // // // //             path: imagePath,
// // // // // //             message: 'อัปโหลดรูปสำเร็จ'
// // // // // //         });
// // // // // //     } catch (error) {
// // // // // //         console.error('Upload error:', error);
// // // // // //         res.status(500).json({ error: error.message });
// // // // // //     }
// // // // // // });

// // // // // // // 🎨 ใช้ Leonardo.ai (คุณภาพสูง ใช้เครดิต $5 ฟรี)
// // // // // // app.post('/api/generate-leonardo', async (req, res) => {
// // // // // //     try {
// // // // // //         const { theme, prompt } = req.body;
        
// // // // // //         if (!theme) {
// // // // // //             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// // // // // //         }
        
// // // // // //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
// // // // // //         if (!LEONARDO_API_KEY) {
// // // // // //             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
// // // // // //         }
        
// // // // // //         console.log(`🎨 Generating with Leonardo.ai: ${theme}`);
        
// // // // // // //         const imagePrompt = `A professional high-quality photo of a person dressed as ${theme} (${prompt || theme}). 
// // // // // // // Detailed, photorealistic, studio lighting, 4k, sharp focus, beautiful, cinematic lighting.`;
// // // // // //                 const imagePrompt = `
// // // // // //         A highly detailed photorealistic portrait of the SAME PERSON from the reference image,
// // // // // //         now transformed into ${theme}.

// // // // // //         Preserve exact facial features, identity, face structure, eyes, nose, and expression.
// // // // // //         Keep the person recognizable.

// // // // // //         Professional lighting, cinematic, ultra realistic, 4k, sharp focus.
// // // // // //         `;
        
// // // // // //         // ลองใช้ modelId ใหม่ (Kino XL - โมเดลล่าสุดของ Leonardo)
// // // // // //         // หรือไม่ใส่ modelId ให้ Leonardo เลือกเอง
// // // // // //         // const generateResponse = await fetch('https://api.leonardo.ai/v1/generations', {
// // // // // //         //     method: 'POST',
// // // // // //         //     headers: {
// // // // // //         //         'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // // // //         //         'Content-Type': 'application/json'
// // // // // //         //     },
// // // // // //         //     body: JSON.stringify({
// // // // // //         //         // ไม่ใส่ modelId ให้ใช้ default
// // // // // //         //         prompt: imagePrompt,
// // // // // //         //         negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality',
// // // // // //         //         width: 768,
// // // // // //         //         height: 768,
// // // // // //         //         num_images: 1,
// // // // // //         //         guidance_scale: 7,
// // // // // //         //         num_inference_steps: 30
// // // // // //         //     })
// // // // // //         // });
// // // // // //             const generateResponse = await fetch('      https://cloud.leonardo.ai/api/rest/v1/generations', {
// // // // // //         method: 'POST',
// // // // // //         headers: {
// // // // // //             'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // // // //             'Content-Type': 'application/json'
// // // // // //         },
// // // // // //         body: JSON.stringify({
// // // // // //             prompt: imagePrompt,
// // // // // //             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality',
// // // // // //             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // ต้องใส่
// // // // // //             width: 768,
// // // // // //             height: 768,
// // // // // //             num_images: 1,
// // // // // //             guidance_scale: 7,
// // // // // //             num_inference_steps: 30
// // // // // //         })
// // // // // //     });
        
// // // // // //         if (!generateResponse.ok) {
// // // // // //             const errorData = await generateResponse.text();
// // // // // //             console.error('Leonardo API Error:', errorData);
            
// // // // // //             if (generateResponse.status === 401) {
// // // // // //                 throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ');
// // // // // //             }
// // // // // //             if (generateResponse.status === 429) {
// // // // // //                 throw new Error('เครดิตไม่พอ หรือส่งคำขอ太多 กรุณาลองใหม่ภายหลัง');
// // // // // //             }
// // // // // //             throw new Error(`Leonardo API error: ${generateResponse.status}`);
// // // // // //         }
        
// // // // // //         const generateData = await generateResponse.json();
// // // // // //         const generationId = generateData.sdGenerationJob.generationId;
        
// // // // // //         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
// // // // // //         let imageUrl = null;
// // // // // //         let attempts = 0;
// // // // // //         const maxAttempts = 30;
        
// // // // // //         while (attempts < maxAttempts) {
// // // // // //             await new Promise(resolve => setTimeout(resolve, 2000));
            
// // // // // //             // const resultResponse = await fetch(`https://api.leonardo.ai/v1/generations/${generationId}`, {
// // // // // //             //     headers: { 
// // // // // //             //         'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // // // //             //         'Content-Type': 'application/json'
// // // // // //             //     }
// // // // // //             // });
// // // // // //                         const resultResponse = await fetch( `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
// // // // // //             {
// // // // // //                 headers: { 
// // // // // //                 Authorization: `Bearer ${LEONARDO_API_KEY}`,
// // // // // //                 'Content-Type': 'application/json'
// // // // // //                 }
// // // // // //             }
// // // // // //             );
// // // // // //             if (!resultResponse.ok) {
// // // // // //                 console.warn(`Failed to get result: ${resultResponse.status}`);
// // // // // //                 attempts++;
// // // // // //                 continue;
// // // // // //             }
            
// // // // // //             const resultData = await resultResponse.json();
            
// // // // // //             if (resultData.generations_by_pk?.generated_images?.length > 0) {
// // // // // //                 imageUrl = resultData.generations_by_pk.generated_images[0].url;
// // // // // //                 console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
// // // // // //                 break;
// // // // // //             }
            
// // // // // //             attempts++;
// // // // // //             console.log(`⏳ Waiting for image... (${attempts}/${maxAttempts})`);
// // // // // //         }
        
// // // // // //         if (imageUrl) {
// // // // // //             res.json({ 
// // // // // //                 success: true, 
// // // // // //                 imageUrl: imageUrl,
// // // // // //                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (Leonardo.ai)`,
// // // // // //                 provider: 'leonardo'
// // // // // //             });
// // // // // //         } else {
// // // // // //             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด');
// // // // // //         }
        
// // // // // //     } catch (error) {
// // // // // //         console.error('Leonardo.ai error:', error);
// // // // // //         res.status(500).json({ error: error.message });
// // // // // //     }
// // // // // // });

// // // // // // // Serve uploaded files
// // // // // // app.use('/uploads', express.static(uploadDir));

// // // // // // // 404 handler
// // // // // // app.use((req, res) => {
// // // // // //     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// // // // // // });

// // // // // // // Error handler
// // // // // // app.use((err, req, res, next) => {
// // // // // //     console.error('Server error:', err);
// // // // // //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// // // // // // });

// // // // // // // Start server
// // // // // // const startServer = (port) => {
// // // // // //     const server = app.listen(port, () => {
// // // // // //         console.log(`✅ Server running on http://localhost:${port}`);
// // // // // //         console.log(`📁 Upload folder: ${uploadDir}`);
// // // // // //         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // // // // //         console.log(`🚀 Endpoints ready:`);
// // // // // //         console.log(`   - POST /api/generate-leonardo (สร้างภาพด้วย Leonardo.ai)`);
// // // // // //         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
// // // // // //         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
// // // // // //         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
// // // // // //     }).on('error', (err) => {
// // // // // //         if (err.code === 'EADDRINUSE') {
// // // // // //             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
// // // // // //             startServer(port + 1);
// // // // // //         } else {
// // // // // //             console.error('Server error:', err);
// // // // // //         }
// // // // // //     });
// // // // // // };

// // // // // // startServer(PORT);
// // // // // const path = require('path');
// // // // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // // // const express = require('express');
// // // // // const cors = require('cors');
// // // // // const multer = require('multer');
// // // // // const fs = require('fs');

// // // // // const app = express();
// // // // // const PORT = process.env.PORT || 3000;

// // // // // // Middleware
// // // // // app.use(cors());
// // // // // app.use(express.json({ limit: '50mb' }));
// // // // // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // // // // เสิร์ฟไฟล์ frontend
// // // // // app.use(express.static(path.join(__dirname, '../frontend')));

// // // // // // สร้างโฟลเดอร์ uploads
// // // // // const uploadDir = path.join(__dirname, '../uploads');
// // // // // if (!fs.existsSync(uploadDir)) {
// // // // //     fs.mkdirSync(uploadDir, { recursive: true });
// // // // // }

// // // // // // ตั้งค่า multer
// // // // // const storage = multer.diskStorage({
// // // // //     destination: (req, file, cb) => {
// // // // //         cb(null, uploadDir);
// // // // //     },
// // // // //     filename: (req, file, cb) => {
// // // // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // // // //         cb(null, uniqueSuffix + path.extname(file.originalname));
// // // // //     }
// // // // // });

// // // // // const upload = multer({ 
// // // // //     storage: storage,
// // // // //     limits: { fileSize: 10 * 1024 * 1024 },
// // // // //     fileFilter: (req, file, cb) => {
// // // // //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// // // // //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // // // //         const mimetype = allowedTypes.test(file.mimetype);
        
// // // // //         if (mimetype && extname) {
// // // // //             return cb(null, true);
// // // // //         } else {
// // // // //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'));
// // // // //         }
// // // // //     }
// // // // // });

// // // // // // ========== API Endpoints ==========

// // // // // // Root path
// // // // // app.get('/', (req, res) => {
// // // // //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // // // // });

// // // // // // Health check
// // // // // app.get('/api/health', (req, res) => {
// // // // //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // // // // });

// // // // // // Upload image
// // // // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // // // //     try {
// // // // //         if (!req.file) {
// // // // //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // // // //         }
        
// // // // //         const imagePath = `/uploads/${req.file.filename}`;
// // // // //         res.json({ 
// // // // //             success: true, 
// // // // //             filename: req.file.filename,
// // // // //             path: imagePath,
// // // // //             message: 'อัปโหลดรูปสำเร็จ'
// // // // //         });
// // // // //     } catch (error) {
// // // // //         console.error('Upload error:', error);
// // // // //         res.status(500).json({ error: error.message });
// // // // //     }
// // // // // });

// // // // // // 🎨 ใช้ Leonardo.ai (คุณภาพสูง ใช้เครดิต $5 ฟรี)
// // // // // app.post('/api/generate-leonardo', async (req, res) => {
// // // // //     try {
// // // // //         const { theme, prompt, referenceImage } = req.body;
        
// // // // //         if (!theme) {
// // // // //             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// // // // //         }
        
// // // // //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
// // // // //         if (!LEONARDO_API_KEY) {
// // // // //             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
// // // // //         }
        
// // // // //         console.log(`🎨 Generating with Leonardo.ai: ${theme}`);
        
// // // // //         // สร้าง prompt
// // // // //         let imagePrompt = `A highly detailed photorealistic portrait of a person dressed as ${theme}. `;
        
// // // // //         if (prompt) {
// // // // //             imagePrompt += `${prompt} `;
// // // // //         }
        
// // // // //         imagePrompt += `Professional lighting, cinematic, ultra realistic, 4k, sharp focus, beautiful, detailed.`;
        
// // // // //         // เตรียม payload สำหรับ Leonardo.ai
// // // // //         const payload = {
// // // // //             prompt: imagePrompt,
// // // // //             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo',
// // // // //             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
// // // // //             width: 768,
// // // // //             height: 768,
// // // // //             num_images: 1,
// // // // //             guidance_scale: 7,
// // // // //             num_inference_steps: 30,
// // // // //             presetStyle: 'CINEMATIC'
// // // // //         };
        
// // // // //         // เพิ่ม reference image ถ้ามี
// // // // //         if (referenceImage) {
// // // // //             payload.init_image = referenceImage; // base64 image
// // // // //             payload.init_strength = 0.6; // ความแรงของ reference
// // // // //         }
        
// // // // //         console.log('📤 Sending to Leonardo API...');
        
// // // // //         const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// // // // //             method: 'POST',
// // // // //             headers: {
// // // // //                 'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // // //                 'Content-Type': 'application/json'
// // // // //             },
// // // // //             body: JSON.stringify(payload)
// // // // //         });
        
// // // // //         if (!generateResponse.ok) {
// // // // //             const errorData = await generateResponse.text();
// // // // //             console.error('Leonardo API Error Response:', errorData);
            
// // // // //             if (generateResponse.status === 401) {
// // // // //                 throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ API key');
// // // // //             }
// // // // //             if (generateResponse.status === 429) {
// // // // //                 throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง');
// // // // //             }
// // // // //             throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
// // // // //         }
        
// // // // //         const generateData = await generateResponse.json();
// // // // //         const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;
        
// // // // //         if (!generationId) {
// // // // //             console.error('No generationId in response:', generateData);
// // // // //             throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
// // // // //         }
        
// // // // //         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
// // // // //         // รอผลลัพธ์
// // // // //         let imageUrl = null;
// // // // //         let attempts = 0;
// // // // //         const maxAttempts = 30;
        
// // // // //         while (attempts < maxAttempts) {
// // // // //             await new Promise(resolve => setTimeout(resolve, 3000)); // รอ 3 วินาที
            
// // // // //             console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);
            
// // // // //             const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// // // // //                 method: 'GET',
// // // // //                 headers: { 
// // // // //                     'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // // //                     'Content-Type': 'application/json'
// // // // //                 }
// // // // //             });
            
// // // // //             if (!resultResponse.ok) {
// // // // //                 console.warn(`Failed to get result: ${resultResponse.status}`);
// // // // //                 attempts++;
// // // // //                 continue;
// // // // //             }
            
// // // // //             const resultData = await resultResponse.json();
// // // // //             console.log('Result data structure:', Object.keys(resultData));
            
// // // // //             // ตรวจสอบโครงสร้าง response ต่างๆ ที่เป็นไปได้
// // // // //             if (resultData.generations_by_pk?.generated_images?.length > 0) {
// // // // //                 imageUrl = resultData.generations_by_pk.generated_images[0].url;
// // // // //                 break;
// // // // //             }
            
// // // // //             if (resultData.generations?.[0]?.generated_images?.length > 0) {
// // // // //                 imageUrl = resultData.generations[0].generated_images[0].url;
// // // // //                 break;
// // // // //             }
            
// // // // //             if (resultData.generated_images?.length > 0) {
// // // // //                 imageUrl = resultData.generated_images[0].url;
// // // // //                 break;
// // // // //             }
            
// // // // //             if (resultData.status === 'COMPLETED' && resultData.images?.length > 0) {
// // // // //                 imageUrl = resultData.images[0].url;
// // // // //                 break;
// // // // //             }
            
// // // // //             attempts++;
// // // // //         }
        
// // // // //         if (imageUrl) {
// // // // //             console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
// // // // //             res.json({ 
// // // // //                 success: true, 
// // // // //                 imageUrl: imageUrl,
// // // // //                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (Leonardo.ai)`,
// // // // //                 provider: 'leonardo'
// // // // //             });
// // // // //         } else {
// // // // //             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (90 วินาที)');
// // // // //         }
        
// // // // //     } catch (error) {
// // // // //         console.error('Leonardo.ai error:', error);
// // // // //         res.status(500).json({ 
// // // // //             error: error.message,
// // // // //             details: 'กรุณาตรวจสอบ API key และเครดิต Leonardo.ai'
// // // // //         });
// // // // //     }
// // // // // });

// // // // // // Serve uploaded files
// // // // // app.use('/uploads', express.static(uploadDir));

// // // // // // 404 handler
// // // // // app.use((req, res) => {
// // // // //     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// // // // // });

// // // // // // Error handler
// // // // // app.use((err, req, res, next) => {
// // // // //     console.error('Server error:', err);
// // // // //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// // // // // });

// // // // // // Start server
// // // // // const startServer = (port) => {
// // // // //     const server = app.listen(port, () => {
// // // // //         console.log(`✅ Server running on http://localhost:${port}`);
// // // // //         console.log(`📁 Upload folder: ${uploadDir}`);
// // // // //         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // // // //         console.log(`🚀 Endpoints ready:`);
// // // // //         console.log(`   - POST /api/generate-leonardo (สร้างภาพด้วย Leonardo.ai)`);
// // // // //         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
// // // // //         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
// // // // //         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
// // // // //     }).on('error', (err) => {
// // // // //         if (err.code === 'EADDRINUSE') {
// // // // //             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
// // // // //             startServer(port + 1);
// // // // //         } else {
// // // // //             console.error('Server error:', err);
// // // // //         }
// // // // //     });
// // // // // };

// // // // // startServer(PORT);
// // // // const path = require('path');
// // // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // // const express = require('express');
// // // // const cors = require('cors');
// // // // const multer = require('multer');
// // // // const fs = require('fs');

// // // // const app = express();
// // // // const PORT = process.env.PORT || 3000;

// // // // // Middleware
// // // // app.use(cors());
// // // // app.use(express.json({ limit: '50mb' }));
// // // // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // // // เสิร์ฟไฟล์ frontend
// // // // app.use(express.static(path.join(__dirname, '../frontend')));

// // // // // สร้างโฟลเดอร์ uploads
// // // // const uploadDir = path.join(__dirname, '../uploads');
// // // // if (!fs.existsSync(uploadDir)) {
// // // //     fs.mkdirSync(uploadDir, { recursive: true });
// // // // }

// // // // // ตั้งค่า multer
// // // // const storage = multer.diskStorage({
// // // //     destination: (req, file, cb) => {
// // // //         cb(null, uploadDir);
// // // //     },
// // // //     filename: (req, file, cb) => {
// // // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // // //         cb(null, uniqueSuffix + path.extname(file.originalname));
// // // //     }
// // // // });

// // // // const upload = multer({ 
// // // //     storage: storage,
// // // //     limits: { fileSize: 10 * 1024 * 1024 },
// // // //     fileFilter: (req, file, cb) => {
// // // //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// // // //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // // //         const mimetype = allowedTypes.test(file.mimetype);
        
// // // //         if (mimetype && extname) {
// // // //             return cb(null, true);
// // // //         } else {
// // // //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'));
// // // //         }
// // // //     }
// // // // });

// // // // // ========== API Endpoints ==========

// // // // // Root path
// // // // app.get('/', (req, res) => {
// // // //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // // // });

// // // // // Health check
// // // // app.get('/api/health', (req, res) => {
// // // //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // // // });

// // // // // Upload image
// // // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // // //     try {
// // // //         if (!req.file) {
// // // //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // // //         }
        
// // // //         // อ่านไฟล์เป็น base64 เพื่อส่งให้ Leonardo
// // // //         const imagePath = path.join(uploadDir, req.file.filename);
// // // //         const imageBuffer = fs.readFileSync(imagePath);
// // // //         const base64Image = imageBuffer.toString('base64');
// // // //         const mimeType = req.file.mimetype;
// // // //         const dataUrl = `data:${mimeType};base64,${base64Image}`;
        
// // // //         res.json({ 
// // // //             success: true, 
// // // //             filename: req.file.filename,
// // // //             path: `/uploads/${req.file.filename}`,
// // // //             base64: dataUrl, // ส่ง base64 กลับไปให้ frontend
// // // //             message: 'อัปโหลดรูปสำเร็จ'
// // // //         });
// // // //     } catch (error) {
// // // //         console.error('Upload error:', error);
// // // //         res.status(500).json({ error: error.message });
// // // //     }
// // // // });

// // // // // 🎨 ใช้ Leonardo.ai สำหรับ Image-to-Image (คงหน้าเหมือนต้นฉบับ)
// // // // app.post('/api/generate-leonardo', async (req, res) => {
// // // //     try {
// // // //         const { theme, prompt, referenceImage, strength = 0.7 } = req.body;
        
// // // //         if (!theme) {
// // // //             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// // // //         }
        
// // // //         if (!referenceImage) {
// // // //             return res.status(400).json({ error: 'กรุณาอัปโหลดรูปต้นฉบับก่อน' });
// // // //         }
        
// // // //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
// // // //         if (!LEONARDO_API_KEY) {
// // // //             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
// // // //         }
        
// // // //         console.log(`🎨 Generating with Leonardo.ai (Image-to-Image): ${theme}`);
// // // //         console.log(`📸 Reference image provided, strength: ${strength}`);
        
// // // //         // สร้าง prompt ที่เน้นการคงหน้าเดิม
// // // //         let imagePrompt = `A professional high-quality photo of the SAME PERSON from the reference image, now dressed as ${theme}. `;
        
// // // //         if (prompt) {
// // // //             imagePrompt += `${prompt} `;
// // // //         }
        
// // // //         imagePrompt += `Preserve exact facial features, identity, face structure, eyes, nose, and expression. The person should be instantly recognizable. Professional lighting, cinematic, ultra realistic, 4k, sharp focus, detailed, beautiful.`;
        
// // // //         // เตรียม payload สำหรับ Leonardo.ai (ใช้ Image-to-Image)
// // // //         const payload = {
// // // //             prompt: imagePrompt,
// // // //             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, not same person',
// // // //             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
// // // //             width: 768,
// // // //             height: 768,
// // // //             num_images: 1,
// // // //             guidance_scale: 7.5,
// // // //             num_inference_steps: 35,
// // // //             presetStyle: 'CINEMATIC',
// // // //             // Image-to-Image parameters
// // // //             init_image: referenceImage, // base64 image data
// // // //             init_strength: strength, // ค่าน้อย = คงหน้าเดิมมาก, ค่ามาก = เปลี่ยนเยอะ (0.4-0.7)
// // // //             init_image_type: 'image'
// // // //         };
        
// // // //         console.log('📤 Sending to Leonardo API with init_image...');
        
// // // //         const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// // // //             method: 'POST',
// // // //             headers: {
// // // //                 'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // //                 'Content-Type': 'application/json'
// // // //             },
// // // //             body: JSON.stringify(payload)
// // // //         });
        
// // // //         if (!generateResponse.ok) {
// // // //             const errorData = await generateResponse.text();
// // // //             console.error('Leonardo API Error Response:', errorData);
            
// // // //             if (generateResponse.status === 401) {
// // // //                 throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ API key');
// // // //             }
// // // //             if (generateResponse.status === 429) {
// // // //                 throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง');
// // // //             }
// // // //             throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
// // // //         }
        
// // // //         const generateData = await generateResponse.json();
// // // //         const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;
        
// // // //         if (!generationId) {
// // // //             console.error('No generationId in response:', generateData);
// // // //             throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
// // // //         }
        
// // // //         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
// // // //         // รอผลลัพธ์
// // // //         let imageUrl = null;
// // // //         let attempts = 0;
// // // //         const maxAttempts = 40; // เพิ่มเป็น 40 ครั้ง (รอได้ถึง 120 วินาที)
        
// // // //         while (attempts < maxAttempts) {
// // // //             await new Promise(resolve => setTimeout(resolve, 3000)); // รอ 3 วินาที
            
// // // //             console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);
            
// // // //             const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// // // //                 method: 'GET',
// // // //                 headers: { 
// // // //                     'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // // //                     'Content-Type': 'application/json'
// // // //                 }
// // // //             });
            
// // // //             if (!resultResponse.ok) {
// // // //                 console.warn(`Failed to get result: ${resultResponse.status}`);
// // // //                 attempts++;
// // // //                 continue;
// // // //             }
            
// // // //             const resultData = await resultResponse.json();
            
// // // //             // ตรวจสอบโครงสร้าง response ต่างๆ ที่เป็นไปได้
// // // //             if (resultData.generations_by_pk?.generated_images?.length > 0) {
// // // //                 const images = resultData.generations_by_pk.generated_images;
// // // //                 if (images[0].url) {
// // // //                     imageUrl = images[0].url;
// // // //                     break;
// // // //                 }
// // // //             }
            
// // // //             if (resultData.generations?.[0]?.generated_images?.length > 0) {
// // // //                 imageUrl = resultData.generations[0].generated_images[0].url;
// // // //                 break;
// // // //             }
            
// // // //             if (resultData.generated_images?.length > 0) {
// // // //                 imageUrl = resultData.generated_images[0].url;
// // // //                 break;
// // // //             }
            
// // // //             if (resultData.status === 'COMPLETED' && resultData.images?.length > 0) {
// // // //                 imageUrl = resultData.images[0].url;
// // // //                 break;
// // // //             }
            
// // // //             attempts++;
// // // //         }
        
// // // //         if (imageUrl) {
// // // //             console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
// // // //             res.json({ 
// // // //                 success: true, 
// // // //                 imageUrl: imageUrl,
// // // //                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (คงใบหน้าเหมือนต้นฉบับ)`,
// // // //                 provider: 'leonardo',
// // // //                 strength: strength
// // // //             });
// // // //         } else {
// // // //             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (120 วินาที)');
// // // //         }
        
// // // //     } catch (error) {
// // // //         console.error('Leonardo.ai error:', error);
// // // //         res.status(500).json({ 
// // // //             error: error.message,
// // // //             details: 'กรุณาตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
// // // //         });
// // // //     }
// // // // });

// // // // // Serve uploaded files
// // // // app.use('/uploads', express.static(uploadDir));

// // // // // 404 handler
// // // // app.use((req, res) => {
// // // //     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// // // // });

// // // // // Error handler
// // // // app.use((err, req, res, next) => {
// // // //     console.error('Server error:', err);
// // // //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// // // // });

// // // // // Start server
// // // // const startServer = (port) => {
// // // //     const server = app.listen(port, () => {
// // // //         console.log(`✅ Server running on http://localhost:${port}`);
// // // //         console.log(`📁 Upload folder: ${uploadDir}`);
// // // //         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // // //         console.log(`🚀 Endpoints ready:`);
// // // //         console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
// // // //         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
// // // //         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
// // // //         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
// // // //     }).on('error', (err) => {
// // // //         if (err.code === 'EADDRINUSE') {
// // // //             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
// // // //             startServer(port + 1);
// // // //         } else {
// // // //             console.error('Server error:', err);
// // // //         }
// // // //     });
// // // // };

// // // // startServer(PORT);
// // // const path = require('path');
// // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // const express = require('express');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const fs = require('fs');

// // // const app = express();
// // // const PORT = process.env.PORT || 3000;

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json({ limit: '50mb' }));
// // // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // // เสิร์ฟไฟล์ frontend
// // // app.use(express.static(path.join(__dirname, '../frontend')));

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
// // //     limits: { fileSize: 10 * 1024 * 1024 },
// // //     fileFilter: (req, file, cb) => {
// // //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// // //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// // //         const mimetype = allowedTypes.test(file.mimetype);
        
// // //         if (mimetype && extname) {
// // //             return cb(null, true);
// // //         } else {
// // //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'));
// // //         }
// // //     }
// // // });

// // // // ========== API Endpoints ==========

// // // // Root path
// // // app.get('/', (req, res) => {
// // //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // // });

// // // // Health check
// // // app.get('/api/health', (req, res) => {
// // //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // // });

// // // // Upload image
// // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // //     try {
// // //         if (!req.file) {
// // //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // //         }
        
// // //         // อ่านไฟล์เป็น base64 เพื่อส่งให้ Leonardo
// // //         const imagePath = path.join(uploadDir, req.file.filename);
// // //         const imageBuffer = fs.readFileSync(imagePath);
// // //         const base64Image = imageBuffer.toString('base64');
// // //         const mimeType = req.file.mimetype;
// // //         const dataUrl = `data:${mimeType};base64,${base64Image}`;
        
// // //         res.json({ 
// // //             success: true, 
// // //             filename: req.file.filename,
// // //             path: `/uploads/${req.file.filename}`,
// // //             base64: dataUrl,
// // //             message: 'อัปโหลดรูปสำเร็จ'
// // //         });
// // //     } catch (error) {
// // //         console.error('Upload error:', error);
// // //         res.status(500).json({ error: error.message });
// // //     }
// // // });

// // // // 🎨 ฟังก์ชันอัปโหลดรูปไปยัง Leonardo.ai ก่อน
// // // async function uploadToLeonardo(base64Image, apiKey) {
// // //     try {
// // //         // เอา base64 header ออก
// // //         const base64Data = base64Image.split(',')[1];
        
// // //         const uploadResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
// // //             method: 'POST',
// // //             headers: {
// // //                 'Authorization': `Bearer ${apiKey}`,
// // //                 'Content-Type': 'application/json'
// // //             },
// // //             body: JSON.stringify({
// // //                 extension: 'jpg'
// // //             })
// // //         });
        
// // //         if (!uploadResponse.ok) {
// // //             throw new Error(`Failed to get upload URL: ${uploadResponse.status}`);
// // //         }
        
// // //         const uploadData = await uploadResponse.json();
// // //         const { uploadUrl, imageId, fields } = uploadData;
        
// // //         // อัปโหลดรูปไปยัง S3 URL
// // //         const formData = new FormData();
// // //         Object.keys(fields).forEach(key => {
// // //             formData.append(key, fields[key]);
// // //         });
        
// // //         // แปลง base64 เป็น blob
// // //         const byteCharacters = atob(base64Data);
// // //         const byteNumbers = new Array(byteCharacters.length);
// // //         for (let i = 0; i < byteCharacters.length; i++) {
// // //             byteNumbers[i] = byteCharacters.charCodeAt(i);
// // //         }
// // //         const byteArray = new Uint8Array(byteNumbers);
// // //         const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
// // //         formData.append('file', blob, 'image.jpg');
        
// // //         const uploadFileResponse = await fetch(uploadUrl, {
// // //             method: 'POST',
// // //             body: formData
// // //         });
        
// // //         if (!uploadFileResponse.ok) {
// // //             throw new Error(`Failed to upload image: ${uploadFileResponse.status}`);
// // //         }
        
// // //         return imageId;
        
// // //     } catch (error) {
// // //         console.error('Upload to Leonardo error:', error);
// // //         throw error;
// // //     }
// // // }

// // // // 🎨 ใช้ Leonardo.ai Image-to-Image
// // // app.post('/api/generate-leonardo', async (req, res) => {
// // //     try {
// // //         const { theme, prompt, referenceImage, strength = 0.6 } = req.body;
        
// // //         if (!theme) {
// // //             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// // //         }
        
// // //         if (!referenceImage) {
// // //             return res.status(400).json({ error: 'กรุณาอัปโหลดรูปต้นฉบับก่อน' });
// // //         }
        
// // //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
// // //         if (!LEONARDO_API_KEY) {
// // //             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
// // //         }
        
// // //         console.log(`🎨 Generating with Leonardo.ai (Image-to-Image): ${theme}`);
// // //         console.log(`📸 Reference image provided, strength: ${strength}`);
        
// // //         // ขั้นตอนที่ 1: อัปโหลดรูปไปยัง Leonardo
// // //         console.log('📤 Uploading reference image to Leonardo...');
// // //         let imageId;
// // //         try {
// // //             imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
// // //             console.log(`✅ Image uploaded, ID: ${imageId}`);
// // //         } catch (uploadError) {
// // //             console.error('Upload error:', uploadError);
// // //             throw new Error('ไม่สามารถอัปโหลดรูปไปยัง Leonardo ได้: ' + uploadError.message);
// // //         }
        
// // //         // สร้าง prompt ที่เน้นการคงหน้าเดิม
// // //         let imagePrompt = `A professional high-quality photo of the SAME PERSON from the reference image, now dressed as ${theme}. `;
        
// // //         if (prompt) {
// // //             imagePrompt += `${prompt} `;
// // //         }
        
// // //         imagePrompt += `Preserve exact facial features, identity, face structure, eyes, nose, and expression. The person should be instantly recognizable. Professional lighting, cinematic, ultra realistic, 4k, sharp focus, detailed, beautiful.`;
        
// // //         // เตรียม payload สำหรับ Leonardo.ai (ใช้ imageId ที่อัปโหลดแล้ว)
// // //         const payload = {
// // //             prompt: imagePrompt,
// // //             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, not same person',
// // //             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
// // //             width: 768,
// // //             height: 768,
// // //             num_images: 1,
// // //             guidance_scale: 7.5,
// // //             num_inference_steps: 35,
// // //             presetStyle: 'CINEMATIC',
// // //             // Image-to-Image parameters - ใช้ imageId
// // //             image: imageId,
// // //             strength: strength // 0.4-0.8
// // //         };
        
// // //         console.log('📤 Sending to Leonardo API with imageId...');
        
// // //         const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// // //             method: 'POST',
// // //             headers: {
// // //                 'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // //                 'Content-Type': 'application/json'
// // //             },
// // //             body: JSON.stringify(payload)
// // //         });
        
// // //         if (!generateResponse.ok) {
// // //             const errorData = await generateResponse.text();
// // //             console.error('Leonardo API Error Response:', errorData);
            
// // //             if (generateResponse.status === 401) {
// // //                 throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ API key');
// // //             }
// // //             if (generateResponse.status === 429) {
// // //                 throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง');
// // //             }
// // //             throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
// // //         }
        
// // //         const generateData = await generateResponse.json();
// // //         const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;
        
// // //         if (!generationId) {
// // //             console.error('No generationId in response:', generateData);
// // //             throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
// // //         }
        
// // //         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
// // //         // รอผลลัพธ์
// // //         let imageUrl = null;
// // //         let attempts = 0;
// // //         const maxAttempts = 40;
        
// // //         while (attempts < maxAttempts) {
// // //             await new Promise(resolve => setTimeout(resolve, 3000));
            
// // //             console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);
            
// // //             const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// // //                 method: 'GET',
// // //                 headers: { 
// // //                     'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// // //                     'Content-Type': 'application/json'
// // //                 }
// // //             });
            
// // //             if (!resultResponse.ok) {
// // //                 console.warn(`Failed to get result: ${resultResponse.status}`);
// // //                 attempts++;
// // //                 continue;
// // //             }
            
// // //             const resultData = await resultResponse.json();
            
// // //             // ตรวจสอบโครงสร้าง response
// // //             if (resultData.generations_by_pk?.generated_images?.length > 0) {
// // //                 const images = resultData.generations_by_pk.generated_images;
// // //                 if (images[0].url) {
// // //                     imageUrl = images[0].url;
// // //                     break;
// // //                 }
// // //             }
            
// // //             if (resultData.generations?.[0]?.generated_images?.length > 0) {
// // //                 imageUrl = resultData.generations[0].generated_images[0].url;
// // //                 break;
// // //             }
            
// // //             if (resultData.generated_images?.length > 0) {
// // //                 imageUrl = resultData.generated_images[0].url;
// // //                 break;
// // //             }
            
// // //             if (resultData.status === 'COMPLETED' && resultData.images?.length > 0) {
// // //                 imageUrl = resultData.images[0].url;
// // //                 break;
// // //             }
            
// // //             attempts++;
// // //         }
        
// // //         if (imageUrl) {
// // //             console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
// // //             res.json({ 
// // //                 success: true, 
// // //                 imageUrl: imageUrl,
// // //                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (คงใบหน้าเหมือนต้นฉบับ)`,
// // //                 provider: 'leonardo',
// // //                 strength: strength
// // //             });
// // //         } else {
// // //             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (120 วินาที)');
// // //         }
        
// // //     } catch (error) {
// // //         console.error('Leonardo.ai error:', error);
// // //         res.status(500).json({ 
// // //             error: error.message,
// // //             details: 'กรุณาตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
// // //         });
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
// // // const startServer = (port) => {
// // //     const server = app.listen(port, () => {
// // //         console.log(`✅ Server running on http://localhost:${port}`);
// // //         console.log(`📁 Upload folder: ${uploadDir}`);
// // //         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // //         console.log(`🚀 Endpoints ready:`);
// // //         console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
// // //         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
// // //         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
// // //         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
// // //     }).on('error', (err) => {
// // //         if (err.code === 'EADDRINUSE') {
// // //             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
// // //             startServer(port + 1);
// // //         } else {
// // //             console.error('Server error:', err);
// // //         }
// // //     });
// // // };

// // // startServer(PORT);
// // const path = require('path');
// // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // const express = require('express');
// // const cors = require('cors');
// // const multer = require('multer');
// // const fs = require('fs');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // // Middleware
// // app.use(cors());
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // // เสิร์ฟไฟล์ frontend
// // app.use(express.static(path.join(__dirname, '../frontend')));

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
// //     limits: { fileSize: 10 * 1024 * 1024 },
// //     fileFilter: (req, file, cb) => {
// //         const allowedTypes = /jpeg|jpg|png|gif|webp/;
// //         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
// //         const mimetype = allowedTypes.test(file.mimetype);
        
// //         if (mimetype && extname) {
// //             return cb(null, true);
// //         } else {
// //             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'));
// //         }
// //     }
// // });

// // // ========== API Endpoints ==========

// // // Root path
// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // });

// // // Health check
// // app.get('/api/health', (req, res) => {
// //     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// // });

// // // Upload image
// // app.post('/api/upload', upload.single('image'), (req, res) => {
// //     try {
// //         if (!req.file) {
// //             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// //         }
        
// //         // อ่านไฟล์เป็น base64 เพื่อส่งให้ Leonardo
// //         const imagePath = path.join(uploadDir, req.file.filename);
// //         const imageBuffer = fs.readFileSync(imagePath);
// //         const base64Image = imageBuffer.toString('base64');
// //         const mimeType = req.file.mimetype;
// //         const dataUrl = `data:${mimeType};base64,${base64Image}`;
        
// //         res.json({ 
// //             success: true, 
// //             filename: req.file.filename,
// //             path: `/uploads/${req.file.filename}`,
// //             base64: dataUrl,
// //             message: 'อัปโหลดรูปสำเร็จ'
// //         });
// //     } catch (error) {
// //         console.error('Upload error:', error);
// //         res.status(500).json({ error: error.message });
// //     }
// // });

// // // 🎨 ฟังก์ชันอัปโหลดรูปไปยัง Leonardo.ai ก่อน
// // async function uploadToLeonardo(base64Image, apiKey) {
// //     try {
// //         // เอา base64 header ออก
// //         let base64Data = base64Image;
// //         if (base64Image.includes(',')) {
// //             base64Data = base64Image.split(',')[1];
// //         }
        
// //         console.log('📤 Requesting upload URL from Leonardo...');
        
// //         // ขอ upload URL จาก Leonardo
// //         const uploadResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
// //             method: 'POST',
// //             headers: {
// //                 'Authorization': `Bearer ${apiKey}`,
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify({
// //                 extension: 'jpg'
// //             })
// //         });
        
// //         if (!uploadResponse.ok) {
// //             const errorText = await uploadResponse.text();
// //             console.error('Upload URL request failed:', errorText);
// //             throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
// //         }
        
// //         const uploadData = await uploadResponse.json();
// //         console.log('Upload response:', JSON.stringify(uploadData, null, 2));
        
// //         // ตรวจสอบโครงสร้าง response
// //         let uploadUrl, imageId, fields;
        
// //         // Leonardo API v1 response structure
// //         if (uploadData.uploadUrl && uploadData.imageId) {
// //             uploadUrl = uploadData.uploadUrl;
// //             imageId = uploadData.imageId;
// //             fields = uploadData.fields || {};
// //         } else if (uploadData.url && uploadData.id) {
// //             uploadUrl = uploadData.url;
// //             imageId = uploadData.id;
// //             fields = uploadData.fields || {};
// //         } else {
// //             throw new Error('Invalid response structure from Leonardo API');
// //         }
        
// //         console.log(`✅ Got upload URL, imageId: ${imageId}`);
        
// //         // อัปโหลดรูปไปยัง S3 URL
// //         const formData = new FormData();
        
// //         // เพิ่ม fields (ถ้ามี)
// //         if (fields && typeof fields === 'object') {
// //             Object.keys(fields).forEach(key => {
// //                 formData.append(key, fields[key]);
// //             });
// //         }
        
// //         // แปลง base64 เป็น blob
// //         const byteCharacters = atob(base64Data);
// //         const byteNumbers = new Array(byteCharacters.length);
// //         for (let i = 0; i < byteCharacters.length; i++) {
// //             byteNumbers[i] = byteCharacters.charCodeAt(i);
// //         }
// //         const byteArray = new Uint8Array(byteNumbers);
// //         const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
// //         formData.append('file', blob, 'image.jpg');
        
// //         console.log('📤 Uploading image to S3...');
        
// //         const uploadFileResponse = await fetch(uploadUrl, {
// //             method: 'POST',
// //             body: formData
// //         });
        
// //         if (!uploadFileResponse.ok) {
// //             const errorText = await uploadFileResponse.text();
// //             console.error('S3 upload failed:', errorText);
// //             throw new Error(`Failed to upload image: ${uploadFileResponse.status}`);
// //         }
        
// //         console.log('✅ Image uploaded successfully to Leonardo');
// //         return imageId;
        
// //     } catch (error) {
// //         console.error('Upload to Leonardo error:', error);
// //         throw error;
// //     }
// // }

// // // 🎨 ใช้ Leonardo.ai Image-to-Image
// // app.post('/api/generate-leonardo', async (req, res) => {
// //     try {
// //         const { theme, prompt, referenceImage, strength = 0.6 } = req.body;
        
// //         if (!theme) {
// //             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// //         }
        
// //         if (!referenceImage) {
// //             return res.status(400).json({ error: 'กรุณาอัปโหลดรูปต้นฉบับก่อน' });
// //         }
        
// //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        
// //         if (!LEONARDO_API_KEY) {
// //             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
// //         }
        
// //         console.log(`🎨 Generating with Leonardo.ai (Image-to-Image): ${theme}`);
// //         console.log(`📸 Reference image provided, strength: ${strength}`);
        
// //         // ขั้นตอนที่ 1: อัปโหลดรูปไปยัง Leonardo
// //         console.log('📤 Uploading reference image to Leonardo...');
// //         let imageId;
// //         try {
// //             imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
// //             console.log(`✅ Image uploaded, ID: ${imageId}`);
// //         } catch (uploadError) {
// //             console.error('Upload error:', uploadError);
// //             throw new Error('ไม่สามารถอัปโหลดรูปไปยัง Leonardo ได้: ' + uploadError.message);
// //         }
        
// //         // สร้าง prompt ที่เน้นการคงหน้าเดิม
// //         let imagePrompt = `A professional high-quality photo of the SAME PERSON from the reference image, now dressed as ${theme}. `;
        
// //         if (prompt) {
// //             imagePrompt += `${prompt} `;
// //         }
        
// //         imagePrompt += `Preserve exact facial features, identity, face structure, eyes, nose, and expression. The person should be instantly recognizable. Professional lighting, cinematic, ultra realistic, 4k, sharp focus, detailed, beautiful.`;
        
// //         // เตรียม payload สำหรับ Leonardo.ai (ใช้ imageId ที่อัปโหลดแล้ว)
// //         const payload = {
// //             prompt: imagePrompt,
// //             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, not same person',
// //             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
// //             width: 768,
// //             height: 768,
// //             num_images: 1,
// //             guidance_scale: 7.5,
// //             num_inference_steps: 35,
// //             presetStyle: 'CINEMATIC',
// //             // Image-to-Image parameters - ใช้ imageId
// //             imageId: imageId,  // ใช้ imageId แทน image
// //             strength: strength // 0.4-0.8
// //         };
        
// //         console.log('📤 Sending to Leonardo API with imageId...');
// //         console.log('Payload:', JSON.stringify(payload, null, 2));
        
// //         const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// //             method: 'POST',
// //             headers: {
// //                 'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify(payload)
// //         });
        
// //         if (!generateResponse.ok) {
// //             const errorData = await generateResponse.text();
// //             console.error('Leonardo API Error Response:', errorData);
            
// //             if (generateResponse.status === 401) {
// //                 throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ API key');
// //             }
// //             if (generateResponse.status === 429) {
// //                 throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง');
// //             }
// //             throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
// //         }
        
// //         const generateData = await generateResponse.json();
// //         const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;
        
// //         if (!generationId) {
// //             console.error('No generationId in response:', generateData);
// //             throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
// //         }
        
// //         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);
        
// //         // รอผลลัพธ์
// //         let imageUrl = null;
// //         let attempts = 0;
// //         const maxAttempts = 40;
        
// //         while (attempts < maxAttempts) {
// //             await new Promise(resolve => setTimeout(resolve, 3000));
            
// //             console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);
            
// //             const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// //                 method: 'GET',
// //                 headers: { 
// //                     'Authorization': `Bearer ${LEONARDO_API_KEY}`,
// //                     'Content-Type': 'application/json'
// //                 }
// //             });
            
// //             if (!resultResponse.ok) {
// //                 console.warn(`Failed to get result: ${resultResponse.status}`);
// //                 attempts++;
// //                 continue;
// //             }
            
// //             const resultData = await resultResponse.json();
            
// //             // ตรวจสอบโครงสร้าง response
// //             if (resultData.generations_by_pk?.generated_images?.length > 0) {
// //                 const images = resultData.generations_by_pk.generated_images;
// //                 if (images[0].url) {
// //                     imageUrl = images[0].url;
// //                     break;
// //                 }
// //             }
            
// //             if (resultData.generations?.[0]?.generated_images?.length > 0) {
// //                 imageUrl = resultData.generations[0].generated_images[0].url;
// //                 break;
// //             }
            
// //             if (resultData.generated_images?.length > 0) {
// //                 imageUrl = resultData.generated_images[0].url;
// //                 break;
// //             }
            
// //             if (resultData.status === 'COMPLETED' && resultData.images?.length > 0) {
// //                 imageUrl = resultData.images[0].url;
// //                 break;
// //             }
            
// //             attempts++;
// //         }
        
// //         if (imageUrl) {
// //             console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
// //             res.json({ 
// //                 success: true, 
// //                 imageUrl: imageUrl,
// //                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (คงใบหน้าเหมือนต้นฉบับ)`,
// //                 provider: 'leonardo',
// //                 strength: strength
// //             });
// //         } else {
// //             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (120 วินาที)');
// //         }
        
// //     } catch (error) {
// //         console.error('Leonardo.ai error:', error);
// //         res.status(500).json({ 
// //             error: error.message,
// //             details: 'กรุณาตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
// //         });
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
// // const startServer = (port) => {
// //     const server = app.listen(port, () => {
// //         console.log(`✅ Server running on http://localhost:${port}`);
// //         console.log(`📁 Upload folder: ${uploadDir}`);
// //         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// //         console.log(`🚀 Endpoints ready:`);
// //         console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
// //         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
// //         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
// //         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
// //     }).on('error', (err) => {
// //         if (err.code === 'EADDRINUSE') {
// //             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
// //             startServer(port + 1);
// //         } else {
// //             console.error('Server error:', err);
// //         }
// //     });
// // };

// // startServer(PORT);
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });

// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // เสิร์ฟไฟล์ frontend
// app.use(express.static(path.join(__dirname, '../frontend')));

// // สร้างโฟลเดอร์ uploads
// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ตั้งค่า multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|gif|webp/;
//         const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimetype = allowedTypes.test(file.mimetype);

//         if (mimetype && extname) {
//             return cb(null, true);
//         } else {
//             cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'));
//         }
//     }
// });

// // ========== API Endpoints ==========

// // Root path
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// });

// // Health check
// app.get('/api/health', (req, res) => {
//     res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
// });

// // Upload image
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
//         }

//         const imagePath = path.join(uploadDir, req.file.filename);
//         const imageBuffer = fs.readFileSync(imagePath);
//         const base64Image = imageBuffer.toString('base64');
//         const mimeType = req.file.mimetype;
//         const dataUrl = `data:${mimeType};base64,${base64Image}`;

//         res.json({
//             success: true,
//             filename: req.file.filename,
//             path: `/uploads/${req.file.filename}`,
//             base64: dataUrl,
//             message: 'อัปโหลดรูปสำเร็จ'
//         });
//     } catch (error) {
//         console.error('Upload error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // ========== ฟังก์ชันอัปโหลดรูปไปยัง Leonardo.ai ==========
// async function uploadToLeonardo(base64Image, apiKey) {
//     try {
//         // เอา base64 header ออก
//         let base64Data = base64Image;
//         if (base64Image.includes(',')) {
//             base64Data = base64Image.split(',')[1];
//         }

//         console.log('📤 Requesting upload URL from Leonardo...');

//         const uploadResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ extension: 'jpg' })
//         });

//         if (!uploadResponse.ok) {
//             const errorText = await uploadResponse.text();
//             console.error('Upload URL request failed:', errorText);
//             throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
//         }

//         const uploadData = await uploadResponse.json();
//         console.log('Upload response:', JSON.stringify(uploadData, null, 2));

//         // ✅ FIX 1: handle wrapper "uploadInitImage" ที่ Leonardo API ส่งกลับมา
//         const initData = uploadData.uploadInitImage || uploadData;

//         const imageId = initData.id || initData.imageId;
//         const uploadUrl = initData.url || initData.uploadUrl;

//         // ✅ FIX 2: fields เป็น JSON string ต้อง JSON.parse() ก่อน
//         let fields = {};
//         if (initData.fields) {
//             fields = typeof initData.fields === 'string'
//                 ? JSON.parse(initData.fields)
//                 : initData.fields;
//         }

//         if (!uploadUrl || !imageId) {
//             throw new Error(`Missing uploadUrl or imageId. Got keys: ${Object.keys(initData).join(', ')}`);
//         }

//         console.log(`✅ Got upload URL, imageId: ${imageId}`);

//         // อัปโหลดรูปไปยัง S3 — fields ต้องใส่ก่อน file เสมอ (S3 requirement)
//         const formData = new FormData();
//         Object.entries(fields).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         // ✅ FIX 3: ใช้ Buffer.from() แทน atob() เพราะนี่คือ Node.js ไม่ใช่ browser
//         const imageBuffer = Buffer.from(base64Data, 'base64');
//         const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
//         formData.append('file', blob, 'image.jpg');

//         console.log('📤 Uploading image to S3...');

//         const uploadFileResponse = await fetch(uploadUrl, {
//             method: 'POST',
//             body: formData
//         });

//         if (!uploadFileResponse.ok) {
//             const errorText = await uploadFileResponse.text();
//             console.error('S3 upload failed:', errorText);
//             throw new Error(`Failed to upload image to S3: ${uploadFileResponse.status} - ${errorText}`);
//         }

//         console.log('✅ Image uploaded successfully to Leonardo');
//         return imageId;

//     } catch (error) {
//         console.error('Upload to Leonardo error:', error);
//         throw error;
//     }
// }

// // ========== Leonardo.ai Image-to-Image ==========
// app.post('/api/generate-leonardo', async (req, res) => {
//     try {
//         const { theme, prompt, referenceImage, strength = 0.6 } = req.body;

//         if (!theme) {
//             return res.status(400).json({ error: 'กรุณาเลือกธีม' });
//         }

//         if (!referenceImage) {
//             return res.status(400).json({ error: 'กรุณาอัปโหลดรูปต้นฉบับก่อน' });
//         }

//         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
//         if (!LEONARDO_API_KEY) {
//             return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env กรุณาใส่ API key จาก Leonardo.ai' });
//         }

//         console.log(`🎨 Generating with Leonardo.ai (Image-to-Image): ${theme}`);
//         console.log(`📸 Reference image provided, strength: ${strength}`);

//         // ขั้นตอนที่ 1: อัปโหลดรูปไปยัง Leonardo
//         console.log('📤 Uploading reference image to Leonardo...');
//         let imageId;
//         try {
//             imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
//             console.log(`✅ Image uploaded, ID: ${imageId}`);
//         } catch (uploadError) {
//             console.error('Upload error:', uploadError);
//             throw new Error('ไม่สามารถอัปโหลดรูปไปยัง Leonardo ได้: ' + uploadError.message);
//         }

//         // สร้าง prompt ที่เน้นการคงหน้าเดิม
//         let imagePrompt = `A professional high-quality photo of the SAME PERSON from the reference image, now dressed as ${theme}. `;
//         if (prompt) {
//             imagePrompt += `${prompt} `;
//         }
//         imagePrompt += `Preserve exact facial features, identity, face structure, eyes, nose, and expression. The person should be instantly recognizable. Professional lighting, cinematic, ultra realistic, 4k, sharp focus, detailed, beautiful.`;

//         const payload = {
//             prompt: imagePrompt,
//             negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, not same person',
//             modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
//             width: 768,
//             height: 768,
//             num_images: 1,
//             guidance_scale: 7.5,
//             num_inference_steps: 35,
//             presetStyle: 'CINEMATIC',
//             imageId: imageId,   // ✅ ใช้ imageId ที่อัปโหลดแล้ว
//             strength: strength  // 0.4-0.8
//         };

//         console.log('📤 Sending to Leonardo API with imageId...');

//         const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${LEONARDO_API_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(payload)
//         });

//         if (!generateResponse.ok) {
//             const errorData = await generateResponse.text();
//             console.error('Leonardo API Error Response:', errorData);

//             if (generateResponse.status === 401) throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง กรุณาตรวจสอบ API key');
//             if (generateResponse.status === 429) throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป กรุณาลองใหม่ภายหลัง');
//             throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
//         }

//         const generateData = await generateResponse.json();
//         const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;

//         if (!generationId) {
//             console.error('No generationId in response:', generateData);
//             throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
//         }

//         console.log(`📡 Generation ID: ${generationId}, waiting for result...`);

//         // รอผลลัพธ์
//         let imageUrl = null;
//         const maxAttempts = 40;

//         for (let attempts = 0; attempts < maxAttempts; attempts++) {
//             await new Promise(resolve => setTimeout(resolve, 3000));
//             console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);

//             const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${LEONARDO_API_KEY}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!resultResponse.ok) {
//                 console.warn(`Failed to get result: ${resultResponse.status}`);
//                 continue;
//             }

//             const resultData = await resultResponse.json();

//             // ตรวจสอบโครงสร้าง response หลายแบบ
//             if (resultData.generations_by_pk?.generated_images?.[0]?.url) {
//                 imageUrl = resultData.generations_by_pk.generated_images[0].url;
//                 break;
//             }
//             if (resultData.generations?.[0]?.generated_images?.[0]?.url) {
//                 imageUrl = resultData.generations[0].generated_images[0].url;
//                 break;
//             }
//             if (resultData.generated_images?.[0]?.url) {
//                 imageUrl = resultData.generated_images[0].url;
//                 break;
//             }
//             if (resultData.status === 'COMPLETED' && resultData.images?.[0]?.url) {
//                 imageUrl = resultData.images[0].url;
//                 break;
//             }
//         }

//         if (imageUrl) {
//             console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
//             res.json({
//                 success: true,
//                 imageUrl: imageUrl,
//                 message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (คงใบหน้าเหมือนต้นฉบับ)`,
//                 provider: 'leonardo',
//                 strength: strength
//             });
//         } else {
//             throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (120 วินาที)');
//         }

//     } catch (error) {
//         console.error('Leonardo.ai error:', error);
//         res.status(500).json({
//             error: error.message,
//             details: 'กรุณาตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
//         });
//     }
// });

// // Serve uploaded files
// app.use('/uploads', express.static(uploadDir));

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({ error: 'ไม่พบ API ที่ร้องขอ', path: req.originalUrl });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error('Server error:', err);
//     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
// });

// // Start server
// const startServer = (port) => {
//     const server = app.listen(port, () => {
//         console.log(`✅ Server running on http://localhost:${port}`);
//         console.log(`📁 Upload folder: ${uploadDir}`);
//         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
//         console.log(`🚀 Endpoints ready:`);
//         console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
//         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
//         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
//         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
//     }).on('error', (err) => {
//         if (err.code === 'EADDRINUSE') {
//             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
//             startServer(port + 1);
//         } else {
//             console.error('Server error:', err);
//         }
//     });
// };

// startServer(PORT);
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
        const fileSize = parseInt(req.headers['content-length'], 10);
        // undefined;
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น (jpeg, jpg, png, gif, webp)'))
        }
    }
});

// ========== API Endpoints ==========

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
        }
        const imagePath = path.join(uploadDir, req.file.filename);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype;
        const dataUrl = `data:${mimeType};base64,${base64Image}`;
        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            base64: dataUrl,
            message: 'อัปโหลดรูปสำเร็จ'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== อัปโหลดรูปไปยัง Leonardo เพื่อรับ init_image_id ==========
async function uploadToLeonardo(base64Image, apiKey) {
    try {
        let base64Data = base64Image;
        if (base64Image.includes(',')) {
            base64Data = base64Image.split(',')[1];
        }

        console.log('📤 Requesting upload URL from Leonardo...');

        const uploadResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ extension: 'jpg' })
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Failed to get upload URL: ${uploadResponse.status} - ${errorText}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', JSON.stringify(uploadData, null, 2));

        // Leonardo ส่ง response ห่อใน "uploadInitImage"
        const initData = uploadData.uploadInitImage || uploadData;

        const imageId   = initData.id  || initData.imageId;
        const uploadUrl = initData.url || initData.uploadUrl;

        // fields เป็น JSON string — ต้อง parse ก่อน
        let fields = {};
        if (initData.fields) {
            fields = typeof initData.fields === 'string'
                ? JSON.parse(initData.fields)
                : initData.fields;
        }

        if (!uploadUrl || !imageId) {
            throw new Error(`Missing uploadUrl or imageId. Got keys: ${Object.keys(initData).join(', ')}`);
        }

        console.log(`✅ Got upload URL, imageId: ${imageId}`);

        // อัปโหลดไปยัง S3 — fields ต้องมาก่อน file เสมอ
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Node.js ใช้ Buffer.from() แทน atob()
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('file', blob, 'image.jpg');

        console.log('📤 Uploading image to S3...');

        const uploadFileResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!uploadFileResponse.ok) {
            const errorText = await uploadFileResponse.text();
            throw new Error(`Failed to upload image to S3: ${uploadFileResponse.status} - ${errorText}`);
        }

        console.log('✅ Image uploaded successfully to Leonardo');
        return imageId;

    } catch (error) {
        console.error('Upload to Leonardo error:', error);
        throw error;
    }
}

// ========== Leonardo.ai Image-to-Image ==========
app.post('/api/generate-leonardo', async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.6 } = req.body;

        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปต้นฉบับก่อน' });

        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY ใน .env' });
        }

        console.log(`🎨 Generating with Leonardo.ai (Image-to-Image): ${theme}`);
        console.log(`📸 Reference image provided, strength: ${strength}`);

        // Step 1: อัปโหลดรูปต้นฉบับ
        console.log('📤 Uploading reference image to Leonardo...');
        let imageId;
        try {
            imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
            console.log(`✅ Image uploaded, ID: ${imageId}`);
        } catch (uploadError) {
            throw new Error('ไม่สามารถอัปโหลดรูปไปยัง Leonardo ได้: ' + uploadError.message);
        }

        // Step 2: สร้าง prompt
        let imagePrompt = `A professional high-quality photo of the SAME PERSON from the reference image, now dressed as ${theme}. `;
        if (prompt) imagePrompt += `${prompt} `;
        imagePrompt += `Preserve exact facial features, identity, face structure, eyes, nose, and expression. The person should be instantly recognizable. Professional lighting, cinematic, ultra realistic, 4k, sharp focus, detailed, beautiful.`;

        // ✅ ใช้ "init_image_id" และ "init_strength" ตามที่ Leonardo API กำหนด
        const payload = {
            prompt: imagePrompt,
            negative_prompt: 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face',
            modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
            width: 768,
            height: 768,
            num_images: 1,
            guidance_scale: 7.5,
            num_inference_steps: 35,
            presetStyle: 'CINEMATIC',
            init_image_id: imageId,              // ✅ ชื่อ field ที่ถูกต้อง (ไม่ใช่ imageId)
            init_strength: parseFloat(strength)  // ✅ ชื่อ field ที่ถูกต้อง (ไม่ใช่ strength)
        };

        console.log('📤 Sending to Leonardo API...');

        const generateResponse = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LEONARDO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!generateResponse.ok) {
            const errorData = await generateResponse.text();
            console.error('Leonardo API Error Response:', errorData);
            if (generateResponse.status === 401) throw new Error('LEONARDO_API_KEY ไม่ถูกต้อง');
            if (generateResponse.status === 429) throw new Error('เครดิตไม่พอ หรือส่งคำขอมากเกินไป');
            throw new Error(`Leonardo API error: ${generateResponse.status} - ${errorData}`);
        }

        const generateData = await generateResponse.json();
        const generationId = generateData.sdGenerationJob?.generationId || generateData.generationId;

        if (!generationId) {
            console.error('No generationId in response:', generateData);
            throw new Error('ไม่ได้รับ generationId จาก Leonardo.ai');
        }

        console.log(`📡 Generation ID: ${generationId}, waiting for result...`);

        // Step 3: รอผลลัพธ์
        let imageUrl = null;
        const maxAttempts = 40;

        for (let attempts = 0; attempts < maxAttempts; attempts++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.log(`⏳ Checking generation status... (${attempts + 1}/${maxAttempts})`);

            const resultResponse = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${LEONARDO_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!resultResponse.ok) {
                console.warn(`Failed to get result: ${resultResponse.status}`);
                continue;
            }

            const resultData = await resultResponse.json();

            if (resultData.generations_by_pk?.generated_images?.[0]?.url) {
                imageUrl = resultData.generations_by_pk.generated_images[0].url;
                break;
            }
            if (resultData.generations?.[0]?.generated_images?.[0]?.url) {
                imageUrl = resultData.generations[0].generated_images[0].url;
                break;
            }
            if (resultData.generated_images?.[0]?.url) {
                imageUrl = resultData.generated_images[0].url;
                break;
            }
            if (resultData.status === 'COMPLETED' && resultData.images?.[0]?.url) {
                imageUrl = resultData.images[0].url;
                break;
            }
        }

        if (imageUrl) {
            console.log(`✅ Leonardo.ai generated image: ${imageUrl}`);
            res.json({
                success: true,
                imageUrl: imageUrl,
                message: `✨ สร้างภาพธีม ${theme} สำเร็จ! (คงใบหน้าเหมือนต้นฉบับ)`,
                provider: 'leonardo',
                strength: strength
            });
        } else {
            throw new Error('ไม่ได้รับรูปจาก Leonardo.ai ภายในเวลาที่กำหนด (120 วินาที)');
        }

    } catch (error) {
        console.error('Leonardo.ai error:', error);
        res.status(500).json({
            error: error.message,
            details: 'กรุณาตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
        });
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
// const startServer = (port) => {
//     const server = app.listen(port, () => {
//         console.log(`✅ Server running on http://localhost:${port}`);
//         console.log(`📁 Upload folder: ${uploadDir}`);
//         console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
//         console.log(`🚀 Endpoints ready:`);
//         console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
//         console.log(`   - POST /api/upload (อัปโหลดรูป)`);
//         console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
//         console.log(`🌐 เปิดเว็บ: http://localhost:${port}`);
//     }).on('error', (err) => {
//         if (err.code === 'EADDRINUSE') {
//             console.log(`⚠️ Port ${port} is in use, trying ${port + 1}...`);
//             startServer(port + 1);
//         } else {
//             console.error('Server error:', err);
//         }
//     });
// };

// startServer(PORT);
// แทนที่ฟังก์ชัน startServer เดิมด้วยโค้ดนี้
const startServer = (port) => {
    const server = app.listen(port, '0.0.0.0', () => {  // เพิ่ม '0.0.0.0'
        console.log(`✅ Server running on http://localhost:${port}`);
        console.log(`📁 Upload folder: ${uploadDir}`);
        console.log(`🎨 Leonardo.ai API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
        console.log(`🚀 Endpoints ready:`);
        console.log(`   - POST /api/generate-leonardo (Image-to-Image - คงหน้าเหมือนต้นฉบับ)`);
        console.log(`   - POST /api/upload (อัปโหลดรูป)`);
        console.log(`   - GET /api/health (ตรวจสอบสถานะ)`);
        
        // แสดง IP สำหรับให้คนอื่นเชื่อมต่อ
        const networkInterfaces = require('os').networkInterfaces();
        console.log(`\n📡 ให้เพื่อนในวงแลนเดียวกันเข้าใช้ที่:`);
        for (const [name, interfaces] of Object.entries(networkInterfaces)) {
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    console.log(`   🌐 http://${iface.address}:${port}`);
                }
            }
        }
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