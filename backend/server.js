// // // const path = require('path');
// // // require('dotenv').config({ path: path.join(__dirname, '.env') });

// // // const express = require('express');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const fs = require('fs');

// // // const app = express();
// // // const PORT = process.env.PORT || 3000;

// // // app.use(cors());
// // // app.use(express.json({ limit: '50mb' }));
// // // app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// // // app.use(express.static(path.join(__dirname, '../frontend')));

// // // const uploadDir = path.join(__dirname, '../uploads');
// // // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // // const storage = multer.diskStorage({
// // //     destination: (req, file, cb) => cb(null, uploadDir),
// // //     filename: (req, file, cb) => {
// // //         cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
// // //     }
// // // });

// // // const upload = multer({
// // //     storage,
// // //     limits: { fileSize: 10 * 1024 * 1024 },
// // //     fileFilter: (req, file, cb) => {
// // //         const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
// // //                 && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
// // //         ok ? cb(null, true) : cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
// // //     }
// // // });

// // // app.get('/', (req, res) => {
// // //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // // });

// // // app.get('/api/health', (req, res) => {
// // //     res.json({
// // //         status: 'OK',
// // //         leonardo: !!process.env.LEONARDO_API_KEY,
// // //         timestamp: new Date().toISOString()
// // //     });
// // // });

// // // app.post('/api/upload', upload.single('image'), (req, res) => {
// // //     try {
// // //         if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// // //         const buf = fs.readFileSync(req.file.path);
// // //         res.json({
// // //             success: true,
// // //             filename: req.file.filename,
// // //             path: `/uploads/${req.file.filename}`,
// // //             base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
// // //             message: 'อัปโหลดรูปสำเร็จ'
// // //         });
// // //         setTimeout(() => {
// // //             fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
// // //         }, 5000);
// // //     } catch (e) {
// // //         console.error('Upload error:', e);
// // //         res.status(500).json({ error: e.message });
// // //     }
// // // });

// // // // ========== Leonardo Helpers (ใช้ native FormData) ==========
// // // async function uploadToLeonardo(base64Image, apiKey) {
// // //     let base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

// // //     const initRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
// // //         method: 'POST',
// // //         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ extension: 'jpg' })
// // //     });
    
// // //     if (!initRes.ok) {
// // //         throw new Error(`init-image failed: ${initRes.status}`);
// // //     }

// // //     const initData = await initRes.json();
// // //     const d = initData.uploadInitImage || initData;
// // //     const imageId = d.id || d.imageId;
// // //     const uploadUrl = d.url || d.uploadUrl;
    
// // //     let fields = {};
// // //     if (d.fields) {
// // //         fields = typeof d.fields === 'string' ? JSON.parse(d.fields) : d.fields;
// // //     }

// // //     if (!uploadUrl || !imageId) {
// // //         throw new Error(`Missing uploadUrl or imageId`);
// // //     }

// // //     console.log(`✅ Got upload URL, imageId: ${imageId}`);

// // //     // ✅ ใช้ FormData แบบ native (Node.js v18+)
// // //     const formData = new FormData();
// // //     Object.entries(fields).forEach(([k, v]) => {
// // //         formData.append(k, v);
// // //     });
    
// // //     // ✅ แปลง base64 เป็น Buffer แล้วสร้าง Blob
// // //     const imgBuf = Buffer.from(base64Data, 'base64');
// // //     const blob = new Blob([imgBuf], { type: 'image/jpeg' });
// // //     formData.append('file', blob, 'image.jpg');

// // //     const s3Res = await fetch(uploadUrl, { 
// // //         method: 'POST', 
// // //         body: formData
// // //     });
    
// // //     if (!s3Res.ok) {
// // //         throw new Error(`S3 upload failed: ${s3Res.status}`);
// // //     }

// // //     console.log(`✅ Uploaded to Leonardo, imageId: ${imageId}`);
// // //     return imageId;
// // // }

// // // async function pollGeneration(generationId, apiKey, timeoutMs = 120000) {
// // //     const startTime = Date.now();
// // //     for (let i = 0; i < 40; i++) {
// // //         if (Date.now() - startTime > timeoutMs) throw new Error('Generation timeout');
// // //         await new Promise(r => setTimeout(r, 3000));
// // //         const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// // //             headers: { 'Authorization': `Bearer ${apiKey}` }
// // //         });
// // //         if (!res.ok) continue;
// // //         const data = await res.json();
// // //         let imgs = data.generations_by_pk?.generated_images ||
// // //                    data.generations?.[0]?.generated_images ||
// // //                    data.generated_images ||
// // //                    (data.status === 'COMPLETED' ? data.images : null);
// // //         if (imgs?.length > 0 && imgs[0].url) return imgs[0].url;
// // //     }
// // //     throw new Error('Generation timed out');
// // // }

// // // const FACE_LOCK = 'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, eye shape, nose, mouth, jawline and identity of the reference person. The person MUST be instantly recognizable. Change ONLY costume and background. ';
// // // const NEGATIVE = 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, altered face, morphed face, distorted identity';

// // // async function generateSingleImage(theme, prompt, imageId, strength, apiKey) {
// // //     const fullPrompt = FACE_LOCK + (prompt || '') + ' Professional lighting, cinematic, ultra realistic, 4k, sharp focus.';
// // //     const payload = {
// // //         prompt: fullPrompt,
// // //         negative_prompt: NEGATIVE,
// // //         modelId: 'e316348f-7773-490e-adcd-46757c738eb7',
// // //         width: 768,
// // //         height: 768,
// // //         num_images: 1,
// // //         guidance_scale: 8,
// // //         num_inference_steps: 40,
// // //         presetStyle: 'CINEMATIC',
// // //         init_image_id: imageId,
// // //         init_strength: parseFloat(strength)
// // //     };
    
// // //     const genRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// // //         method: 'POST',
// // //         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(payload)
// // //     });
    
// // //     if (!genRes.ok) {
// // //         const txt = await genRes.text();
// // //         throw new Error(`Generation API ${genRes.status}: ${txt}`);
// // //     }
    
// // //     const genData = await genRes.json();
// // //     const generationId = genData.sdGenerationJob?.generationId || genData.generationId;
// // //     if (!generationId) throw new Error('No generationId returned');
    
// // //     return pollGeneration(generationId, apiKey);
// // // }

// // // app.post('/api/generate-leonardo', async (req, res) => {
// // //     try {
// // //         const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
// // //         if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// // //         if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
// // //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
// // //         if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
// // //         console.log(`🎨 Generating: ${theme} (strength ${strength})`);
        
// // //         const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
// // //         const imageUrl = await generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        
// // //         res.json({ success: true, imageUrl, provider: 'leonardo', strength });
        
// // //     } catch (err) {
// // //         console.error('generate-leonardo error:', err.message);
// // //         res.status(500).json({ 
// // //             error: err.message,
// // //             details: 'ตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
// // //         });
// // //     }
// // // });

// // // app.use('/uploads', express.static(uploadDir));
// // // app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl }));
// // // app.use((err, req, res, next) => { 
// // //     console.error('Server error:', err); 
// // //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' }); 
// // // });

// // // const startServer = (port) => {
// // //     app.listen(port, '0.0.0.0', () => {
// // //         console.log(`\n✅ Server running — http://localhost:${port}`);
// // //         console.log(`🎨 Leonardo API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// // //         console.log(`🚀 Endpoints: POST /api/generate-leonardo, POST /api/upload, GET /api/health\n`);
// // //     }).on('error', (err) => { 
// // //         if (err.code === 'EADDRINUSE') startServer(port + 1); 
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

// // app.use(cors());
// // app.use(express.json({ limit: '50mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// // app.use(express.static(path.join(__dirname, '../frontend')));
// // const uploadDir = path.join(__dirname, '../uploads');
// // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => cb(null, uploadDir),
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
// //     }
// // });

// // const upload = multer({
// //     storage,
// //     limits: { fileSize: 10 * 1024 * 1024 },
// //     fileFilter: (req, file, cb) => {
// //         const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
// //                 && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
// //         ok ? cb(null, true) : cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
// //     }
// // });

// // app.get('/', (req, res) => {
// //     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// // });

// // app.get('/api/health', (req, res) => {
// //     res.json({
// //         status: 'OK',
// //         leonardo: !!process.env.LEONARDO_API_KEY,
// //         timestamp: new Date().toISOString()
// //     });
// // });

// // app.post('/api/upload', upload.single('image'), (req, res) => {
// //     try {
// //         if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
// //         const buf = fs.readFileSync(req.file.path);
// //         res.json({
// //             success: true,
// //             filename: req.file.filename,
// //             path: `/uploads/${req.file.filename}`,
// //             base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
// //             message: 'อัปโหลดรูปสำเร็จ'
// //         });
// //         setTimeout(() => {
// //             fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
// //         }, 5000);
// //     } catch (e) {
// //         console.error('Upload error:', e);
// //         res.status(500).json({ error: e.message });
// //     }
// // });

// // // ========== Leonardo Helpers (ใช้ native FormData) ==========
// // async function uploadToLeonardo(base64Image, apiKey) {
// //     let base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

// //     const initRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
// //         method: 'POST',
// //         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ extension: 'jpg' })
// //     });
    
// //     if (!initRes.ok) {
// //         throw new Error(`init-image failed: ${initRes.status}`);
// //     }

// //     const initData = await initRes.json();
// //     const d = initData.uploadInitImage || initData;
// //     const imageId = d.id || d.imageId;
// //     const uploadUrl = d.url || d.uploadUrl;
    
// //     let fields = {};
// //     if (d.fields) {
// //         fields = typeof d.fields === 'string' ? JSON.parse(d.fields) : d.fields;
// //     }

// //     if (!uploadUrl || !imageId) {
// //         throw new Error(`Missing uploadUrl or imageId`);
// //     }

// //     console.log(`✅ Got upload URL, imageId: ${imageId}`);

// //     const formData = new FormData();
// //     Object.entries(fields).forEach(([k, v]) => {
// //         formData.append(k, v);
// //     });
    
// //     const imgBuf = Buffer.from(base64Data, 'base64');
// //     const blob = new Blob([imgBuf], { type: 'image/jpeg' });
// //     formData.append('file', blob, 'image.jpg');

// //     const s3Res = await fetch(uploadUrl, { 
// //         method: 'POST', 
// //         body: formData
// //     });
    
// //     if (!s3Res.ok) {
// //         throw new Error(`S3 upload failed: ${s3Res.status}`);
// //     }

// //     console.log(`✅ Uploaded to Leonardo, imageId: ${imageId}`);
// //     return imageId;
// // }

// // async function pollGeneration(generationId, apiKey, timeoutMs = 120000) {
// //     const startTime = Date.now();
// //     for (let i = 0; i < 40; i++) {
// //         if (Date.now() - startTime > timeoutMs) throw new Error('Generation timeout');
// //         await new Promise(r => setTimeout(r, 3000));
// //         const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
// //             headers: { 'Authorization': `Bearer ${apiKey}` }
// //         });
// //         if (!res.ok) continue;
// //         const data = await res.json();
// //         let imgs = data.generations_by_pk?.generated_images ||
// //                    data.generations?.[0]?.generated_images ||
// //                    data.generated_images ||
// //                    (data.status === 'COMPLETED' ? data.images : null);
// //         if (imgs?.length > 0 && imgs[0].url) return imgs[0].url;
// //     }
// //     throw new Error('Generation timed out');
// // }

// // const FACE_LOCK = 'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, eye shape, nose, mouth, jawline and identity of the reference person. The person MUST be instantly recognizable. Change ONLY costume and background. ';
// // const NEGATIVE = 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, altered face, morphed face, distorted identity';

// // async function generateSingleImage(theme, prompt, imageId, strength, apiKey) {
// //     const fullPrompt = FACE_LOCK + (prompt || '') + ' Professional lighting, cinematic, ultra realistic, 4k, sharp focus.';
// //     const payload = {
// //         prompt: fullPrompt,
// //         negative_prompt: NEGATIVE,
// //         modelId: 'e316348f-7773-490e-adcd-46757c738eb7',
// //         width: 768,
// //         height: 768,
// //         num_images: 1,
// //         guidance_scale: 8,
// //         num_inference_steps: 40,
// //         presetStyle: 'CINEMATIC',
// //         init_image_id: imageId,
// //         init_strength: parseFloat(strength)
// //     };
    
// //     const genRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
// //         method: 'POST',
// //         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload)
// //     });
    
// //     if (!genRes.ok) {
// //         const txt = await genRes.text();
// //         throw new Error(`Generation API ${genRes.status}: ${txt}`);
// //     }
    
// //     const genData = await genRes.json();
// //     const generationId = genData.sdGenerationJob?.generationId || genData.generationId;
// //     if (!generationId) throw new Error('No generationId returned');
    
// //     return pollGeneration(generationId, apiKey);
// // }

// // // ========== SINGLE IMAGE ENDPOINT ==========
// // app.post('/api/generate-leonardo', async (req, res) => {
// //     try {
// //         const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
// //         if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// //         if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
// //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
// //         if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
// //         console.log(`🎨 Generating: ${theme} (strength ${strength})`);
        
// //         const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
// //         const imageUrl = await generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        
// //         res.json({ success: true, imageUrl, provider: 'leonardo', strength });
        
// //     } catch (err) {
// //         console.error('generate-leonardo error:', err.message);
// //         res.status(500).json({ 
// //             error: err.message,
// //             details: 'ตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
// //         });
// //     }
// // });

// // // ========== BULK ENDPOINT: generate 4 images at once ==========
// // app.post('/api/generate-4', async (req, res) => {
// //     try {
// //         const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
// //         if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
// //         if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
// //         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
// //         if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
// //         console.log(`🎨 [${new Date().toISOString()}] Generating 4 images: ${theme}`);
        
// //         const imageId = await uploadToLeonardo(referenceImage, );
        
// //         // Generate 4 images with delay between each to avoid rate limit
// //         const generateWithDelay = async (index) => {
// //             await new Promise(resolve => setTimeout(resolve, index * 1000));
// //             return generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
// //         };
        
// //         const results = await Promise.allSettled(
// //             [0, 1, 2, 3].map((_, idx) => generateWithDelay(idx))
// //         );
        
// //         const imageUrls = results
// //             .map(r => r.status === 'fulfilled' ? r.value : null)
// //             .filter(Boolean);
        
// //         if (imageUrls.length === 0) {
// //             throw new Error('ไม่ได้รับรูปภาพจาก Leonardo.ai');
// //         }
        
// //         console.log(`✅ Generated ${imageUrls.length} images for ${theme}`);
        
// //         res.json({ 
// //             success: true, 
// //             imageUrls, 
// //             count: imageUrls.length, 
// //             provider: 'leonardo' 
// //         });
        
// //     } catch (err) {
// //         console.error('generate-4 error:', err.message);
// //         res.status(500).json({ error: err.message });
// //     }
// // });
// // app.use('/uploads', express.static(uploadDir));
// // app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl }));
// // app.use((err, req, res, next) => { 
// //     console.error('Server error:', err); 
// //     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' }); 
// // });

// // const startServer = (port) => {
// //     app.listen(port, '0.0.0.0', () => {
// //         console.log(`\n✅ Server running — http://localhost:${port}`);
// //         console.log(`🎨 Leonardo API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
// //         console.log(`🚀 Endpoints:`);
// //         console.log(`   POST /api/generate-leonardo — สร้าง 1 ภาพ`);
// //         console.log(`   POST /api/generate-4        — สร้าง 4 ภาพ (แนะนำ)`);
// //         console.log(`   POST /api/upload            — อัปโหลดรูป`);
// //         console.log(`   GET  /api/health            — ตรวจสอบสถานะ\n`);
// //     }).on('error', (err) => { 
// //         if (err.code === 'EADDRINUSE') startServer(port + 1); 
// //     });
// // };

// // startServer(PORT);
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });

// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');
// const session = require('express-session'); // ✅ เพิ่ม session

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(express.static(path.join(__dirname, '../frontend')));

// // ✅ เพิ่ม Session middleware (ต้องมาก่อน routes)
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-this',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false, // เปลี่ยนเป็น true ถ้าใช้ HTTPS
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 // 24 ชั่วโมง
//     }
// }));

// // ✅ Admin middleware
// function requireAdmin(req, res, next) {
//     if (req.session.isAdmin) {
//         next();
//     } else {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// }

// const uploadDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadDir),
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
//                 && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
//         ok ? cb(null, true) : cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
//     }
// });

// // ============ Existing Routes ============
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
// });

// app.get('/api/health', (req, res) => {
//     res.json({
//         status: 'OK',
//         leonardo: !!process.env.LEONARDO_API_KEY,
//         timestamp: new Date().toISOString()
//     });
// });

// app.post('/api/upload', upload.single('image'), (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
//         const buf = fs.readFileSync(req.file.path);
//         res.json({
//             success: true,
//             filename: req.file.filename,
//             path: `/uploads/${req.file.filename}`,
//             base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
//             message: 'อัปโหลดรูปสำเร็จ'
//         });
//         setTimeout(() => {
//             fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
//         }, 5000);
//     } catch (e) {
//         console.error('Upload error:', e);
//         res.status(500).json({ error: e.message });
//     }
// });

// // ========== Leonardo Helpers ==========
// async function uploadToLeonardo(base64Image, apiKey) {
//     let base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

//     const initRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify({ extension: 'jpg' })
//     });
    
//     if (!initRes.ok) {
//         throw new Error(`init-image failed: ${initRes.status}`);
//     }

//     const initData = await initRes.json();
//     const d = initData.uploadInitImage || initData;
//     const imageId = d.id || d.imageId;
//     const uploadUrl = d.url || d.uploadUrl;
    
//     let fields = {};
//     if (d.fields) {
//         fields = typeof d.fields === 'string' ? JSON.parse(d.fields) : d.fields;
//     }

//     if (!uploadUrl || !imageId) {
//         throw new Error(`Missing uploadUrl or imageId`);
//     }

//     console.log(`✅ Got upload URL, imageId: ${imageId}`);

//     const formData = new FormData();
//     Object.entries(fields).forEach(([k, v]) => {
//         formData.append(k, v);
//     });
    
//     const imgBuf = Buffer.from(base64Data, 'base64');
//     const blob = new Blob([imgBuf], { type: 'image/jpeg' });
//     formData.append('file', blob, 'image.jpg');

//     const s3Res = await fetch(uploadUrl, { 
//         method: 'POST', 
//         body: formData
//     });
    
//     if (!s3Res.ok) {
//         throw new Error(`S3 upload failed: ${s3Res.status}`);
//     }

//     console.log(`✅ Uploaded to Leonardo, imageId: ${imageId}`);
//     return imageId;
// }

// async function pollGeneration(generationId, apiKey, timeoutMs = 120000) {
//     const startTime = Date.now();
//     for (let i = 0; i < 40; i++) {
//         if (Date.now() - startTime > timeoutMs) throw new Error('Generation timeout');
//         await new Promise(r => setTimeout(r, 3001));
//         const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
//             headers: { 'Authorization': `Bearer ${apiKey}` }
//         });
//         if (!res.ok) continue;
//         const data = await res.json();
//         let imgs = data.generations_by_pk?.generated_images ||
//                    data.generations?.[0]?.generated_images ||
//                    data.generated_images ||
//                    (data.status === 'COMPLETED' ? data.images : null);
//         if (imgs?.length > 0 && imgs[0].url) return imgs[0].url;
//     }
//     throw new Error('Generation timed out');
// }

// const FACE_LOCK = 'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, eye shape, nose, mouth, jawline and identity of the reference person. The person MUST be instantly recognizable. Change ONLY costume and background. ';
// const NEGATIVE = 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, altered face, morphed face, distorted identity';

// async function generateSingleImage(theme, prompt, imageId, strength, apiKey) {
//     const fullPrompt = FACE_LOCK + (prompt || '') + ' Professional lighting, cinematic, ultra realistic, 4k, sharp focus.';
//     const payload = {
//         prompt: fullPrompt,
//         negative_prompt: NEGATIVE,
//         modelId: 'e316348f-7773-490e-adcd-46757c738eb7',
//         width: 768,
//         height: 768,
//         num_images: 1,
//         guidance_scale: 8,
//         num_inference_steps: 40,
//         presetStyle: 'CINEMATIC',
//         init_image_id: imageId,
//         init_strength: parseFloat(strength)
//     };
    
//     const genRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//     });
    
//     if (!genRes.ok) {
//         const txt = await genRes.text();
//         throw new Error(`Generation API ${genRes.status}: ${txt}`);
//     }
    
//     const genData = await genRes.json();
//     const generationId = genData.sdGenerationJob?.generationId || genData.generationId;
//     if (!generationId) throw new Error('No generationId returned');
    
//     return pollGeneration(generationId, apiKey);
// }

// // ========== SINGLE IMAGE ENDPOINT ==========
// app.post('/api/generate-leonardo', async (req, res) => {
//     try {
//         const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
//         if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
//         if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
//         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
//         if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
//         console.log(`🎨 Generating: ${theme} (strength ${strength})`);
        
//         const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
//         const imageUrl = await generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        
//         res.json({ success: true, imageUrl, provider: 'leonardo', strength });
        
//     } catch (err) {
//         console.error('generate-leonardo error:', err.message);
//         res.status(500).json({ 
//             error: err.message,
//             details: 'ตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
//         });
//     }
// });

// // ========== BULK ENDPOINT: generate 4 images at once ==========
// app.post('/api/generate-4', async (req, res) => {
//     try {
//         const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
//         if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
//         if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
//         const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
//         if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
//         console.log(`🎨 [${new Date().toISOString()}] Generating 4 images: ${theme}`);
        
//         // ✅ แก้ไข: เพิ่ม API Key ที่ขาดหายไป
//         const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
        
//         // Generate 4 images with delay between each to avoid rate limit
//         const generateWithDelay = async (index) => {
//             await new Promise(resolve => setTimeout(resolve, index * 1000));
//             return generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
//         };
        
//         const results = await Promise.allSettled(
//             [0, 1, 2, 3].map((_, idx) => generateWithDelay(idx))
//         );
        
//         const imageUrls = results
//             .map(r => r.status === 'fulfilled' ? r.value : null)
//             .filter(Boolean);
        
//         if (imageUrls.length === 0) {
//             throw new Error('ไม่ได้รับรูปภาพจาก Leonardo.ai');
//         }
        
//         console.log(`✅ Generated ${imageUrls.length} images for ${theme}`);
        
//         res.json({ 
//             success: true, 
//             imageUrls, 
//             count: imageUrls.length, 
//             provider: 'leonardo' 
//         });
        
//     } catch (err) {
//         console.error('generate-4 error:', err.message);
//         res.status(500).json({ error: err.message });
//     }
// });

// // ============ ✅ ADMIN ROUTES (เพิ่มใหม่) ============

// // Serve admin HTML file
// app.use('/admin-page', express.static(path.join(__dirname, '../frontend')));

// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/admin.html'));
// });

// // 1. Admin Login
// app.post('/api/admin/login', (req, res) => {
//     const { username, password } = req.body;
    
//     if (username === process.env.ADMIN_USERNAME && 
//         password === process.env.ADMIN_PASSWORD) {
        
//         req.session.isAdmin = true;
//         req.session.user = username;
        
//         res.json({ success: true, message: 'Login successful' });
//     } else {
//         res.status(401).json({ error: 'Invalid username or password' });
//     }
// });

// // 2. Get API Key
// app.get('/api/admin/leonardo-key', requireAdmin, (req, res) => {
//     const apiKey = process.env.LEONARDO_API_KEY;
    
//     if (apiKey) {
//         const masked = apiKey.length > 8 
//             ? apiKey.slice(0, 4) + '...' + apiKey.slice(-4)
//             : '***';
        
//         res.json({ key: apiKey, masked: masked });
//     } else {
//         res.json({ key: null, masked: null });
//     }
// });

// // 3. Update API Key
// app.post('/api/admin/update-leonardo-key', requireAdmin, (req, res) => {
//     const { newKey } = req.body;
    
//     if (!newKey || newKey.length < 10) {
//         return res.status(400).json({ error: 'Invalid API key format' });
//     }
    
//     // อัพเดทค่าใน environment (สำหรับการทำงานปัจจุบัน)
//     process.env.LEONARDO_API_KEY = newKey;
    
//     res.json({ success: true, message: 'API key updated successfully' });
// });

// // 4. System Status
// app.get('/api/admin/system-status', requireAdmin, (req, res) => {
//     res.json({
//         status: 'online',
//         leonardoConfigured: !!process.env.LEONARDO_API_KEY,
//         uptime: process.uptime(),
//         timestamp: new Date().toISOString()
//     });
// });

// // 5. Admin Logout
// app.post('/api/admin/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             res.status(500).json({ error: 'Logout failed' });
//         } else {
//             res.json({ success: true });
//         }
//     });
// });

// // ============ Static Files & Error Handling ============
// app.use('/uploads', express.static(uploadDir));
// app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl }));
// app.use((err, req, res, next) => { 
//     console.error('Server error:', err); 
//     res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' }); 
// });

// const startServer = (port) => {
//     app.listen(port, '0.0.0.0', () => {
//         console.log(`\n✅ Server running — http://localhost:${port}`);
//         console.log(`🎨 Leonardo API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
//         // console.log(`🔐 Admin Panel: http://localhost:${port}/admin`); //อยากไช้ก็เปิด 
//         // console.log(`👤 Admin: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'ตั้งค่าใน .env'}`);
//         console.log(`\n🚀 Endpoints:`);
//         console.log(`   POST /api/generate-leonardo — สร้าง 1 ภาพ`);
//         console.log(`   POST /api/generate-4        — สร้าง 4 ภาพ`);
//         console.log(`   POST /api/upload            — อัปโหลดรูป`);
//         console.log(`   GET  /api/health            — ตรวจสอบสถานะ`);
//         console.log(`   POST /api/admin/login       — ล็อกอิน admin`);
//         console.log(`   GET  /api/admin/leonardo-key — ดู API key\n`);
//     }).on('error', (err) => { 
//         if (err.code === 'EADDRINUSE') startServer(port + 1); 
//     });
// };

// startServer(PORT);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001; // ✅ เปลี่ยนเป็น 3001

// ✅ ฟังก์ชันสำหรับอัพเดทค่าในไฟล์ .env
function updateEnvFile(key, value) {
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    // อ่านไฟล์ .env ปัจจุบัน
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // แยกบรรทัด
    const lines = envContent.split(/\r?\n/);
    let keyFound = false;
    
    // อัพเดทหรือเพิ่ม key
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(`${key}=`)) {
            lines[i] = `${key}=${value}`;
            keyFound = true;
            break;
        }
    }
    
    if (!keyFound) {
        lines.push(`${key}=${value}`);
    }
    
    // เขียนกลับไปที่ไฟล์
    fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
    console.log(`✅ Updated ${key} in .env file`);
    
    // ✅ อัพเดทค่าใน process.env ด้วย
    process.env[key] = value;
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Session middleware
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

// ✅ Admin middleware
function requireAdmin(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
                && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
    }
});

// ============ Existing Routes ============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/theme-changer.html'));
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        leonardo: !!process.env.LEONARDO_API_KEY,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
        const buf = fs.readFileSync(req.file.path);
        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
            message: 'อัปโหลดรูปสำเร็จ'
        });
        setTimeout(() => {
            fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
        }, 5000);
    } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ error: e.message });
    }
});

// ========== Leonardo Helpers ==========
async function uploadToLeonardo(base64Image, apiKey) {
    let base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const initRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ extension: 'jpg' })
    });
    
    if (!initRes.ok) {
        throw new Error(`init-image failed: ${initRes.status}`);
    }

    const initData = await initRes.json();
    const d = initData.uploadInitImage || initData;
    const imageId = d.id || d.imageId;
    const uploadUrl = d.url || d.uploadUrl;
    
    let fields = {};
    if (d.fields) {
        fields = typeof d.fields === 'string' ? JSON.parse(d.fields) : d.fields;
    }

    if (!uploadUrl || !imageId) {
        throw new Error(`Missing uploadUrl or imageId`);
    }

    console.log(`✅ Got upload URL, imageId: ${imageId}`);

    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v);
    });
    
    const imgBuf = Buffer.from(base64Data, 'base64');
    const blob = new Blob([imgBuf], { type: 'image/jpeg' });
    formData.append('file', blob, 'image.jpg');

    const s3Res = await fetch(uploadUrl, { 
        method: 'POST', 
        body: formData
    });
    
    if (!s3Res.ok) {
        throw new Error(`S3 upload failed: ${s3Res.status}`);
    }

    console.log(`✅ Uploaded to Leonardo, imageId: ${imageId}`);
    return imageId;
}

async function pollGeneration(generationId, apiKey, timeoutMs = 120000) {
    const startTime = Date.now();
    for (let i = 0; i < 40; i++) {
        if (Date.now() - startTime > timeoutMs) throw new Error('Generation timeout');
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!res.ok) continue;
        const data = await res.json();
        let imgs = data.generations_by_pk?.generated_images ||
                   data.generations?.[0]?.generated_images ||
                   data.generated_images ||
                   (data.status === 'COMPLETED' ? data.images : null);
        if (imgs?.length > 0 && imgs[0].url) return imgs[0].url;
    }
    throw new Error('Generation timed out');
}

const FACE_LOCK = 'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, eye shape, nose, mouth, jawline and identity of the reference person. The person MUST be instantly recognizable. Change ONLY costume and background. ';
const NEGATIVE = 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, altered face, morphed face, distorted identity';

async function generateSingleImage(theme, prompt, imageId, strength, apiKey) {
    const fullPrompt = FACE_LOCK + (prompt || '') + ' Professional lighting, cinematic, ultra realistic, 4k, sharp focus.';
    const payload = {
        prompt: fullPrompt,
        negative_prompt: NEGATIVE,
        modelId: 'e316348f-7773-490e-adcd-46757c738eb7',
        width: 768,
        height: 768,
        num_images: 1,
        guidance_scale: 8,
        num_inference_steps: 40,
        presetStyle: 'CINEMATIC',
        init_image_id: imageId,
        init_strength: parseFloat(strength)
    };
    
    const genRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    if (!genRes.ok) {
        const txt = await genRes.text();
        throw new Error(`Generation API ${genRes.status}: ${txt}`);
    }
    
    const genData = await genRes.json();
    const generationId = genData.sdGenerationJob?.generationId || genData.generationId;
    if (!generationId) throw new Error('No generationId returned');
    
    return pollGeneration(generationId, apiKey);
}

// ========== SINGLE IMAGE ENDPOINT ==========
app.post('/api/generate-leonardo', async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
        console.log(`🎨 Generating: ${theme} (strength ${strength})`);
        
        const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
        const imageUrl = await generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        
        res.json({ success: true, imageUrl, provider: 'leonardo', strength });
        
    } catch (err) {
        console.error('generate-leonardo error:', err.message);
        res.status(500).json({ 
            error: err.message,
            details: 'ตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
        });
    }
});

// ========== BULK ENDPOINT: generate 4 images at once ==========
app.post('/api/generate-4', async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
        console.log(`🎨 [${new Date().toISOString()}] Generating 4 images: ${theme}`);
        
        // ✅ แก้ไข: เพิ่ม API Key
        const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
        
        // Generate 4 images with delay between each to avoid rate limit
        const generateWithDelay = async (index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            return generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        };
        
        const results = await Promise.allSettled(
            [0, 1, 2, 3].map((_, idx) => generateWithDelay(idx))
        );
        
        const imageUrls = results
            .map(r => r.status === 'fulfilled' ? r.value : null)
            .filter(Boolean);
        
        if (imageUrls.length === 0) {
            throw new Error('ไม่ได้รับรูปภาพจาก Leonardo.ai');
        }
        
        console.log(`✅ Generated ${imageUrls.length} images for ${theme}`);
        
        res.json({ 
            success: true, 
            imageUrls, 
            count: imageUrls.length, 
            provider: 'leonardo' 
        });
        
    } catch (err) {
        console.error('generate-4 error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ============ ✅ ADMIN ROUTES ============

// Serve admin HTML file
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// 1. Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        
        req.session.isAdmin = true;
        req.session.user = username;
        
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// 2. Get API Key
app.get('/api/admin/leonardo-key', requireAdmin, (req, res) => {
    const apiKey = process.env.LEONARDO_API_KEY;
    
    if (apiKey) {
        const masked = apiKey.length > 8 
            ? apiKey.slice(0, 4) + '...' + apiKey.slice(-4)
            : '***';
        
        res.json({ key: apiKey, masked: masked });
    } else {
        res.json({ key: null, masked: null });
    }
});

// 3. Update API Key ✅ บันทึกลง .env จริง
app.post('/api/admin/update-leonardo-key', requireAdmin, (req, res) => {
    const { newKey } = req.body;
    
    if (!newKey || newKey.length < 10) {
        return res.status(400).json({ error: 'Invalid API key format' });
    }
    
    try {
        // ✅ อัพเดททั้งในไฟล์ .env และ process.env
        updateEnvFile('LEONARDO_API_KEY', newKey);
        
        res.json({ 
            success: true, 
            message: 'API key updated successfully! (Saved to .env file)' 
        });
    } catch (error) {
        console.error('Error updating .env:', error);
        res.status(500).json({ error: 'Failed to save API key to .env file' });
    }
});

// 4. System Status
app.get('/api/admin/system-status', requireAdmin, (req, res) => {
    res.json({
        status: 'online',
        leonardoConfigured: !!process.env.LEONARDO_API_KEY,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 5. Admin Logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Logout failed' });
        } else {
            res.json({ success: true });
        }
    });
});

// ============ Static Files & Error Handling ============
app.use('/uploads', express.static(uploadDir));
app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl }));
app.use((err, req, res, next) => { 
    console.error('Server error:', err); 
    res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' }); 
});

const startServer = (port) => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`\n✅ Server running — http://localhost:${port}`);
        console.log(`🎨 Leonardo API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
        // console.log(`🔐 Admin Panel: http://localhost:${port}/admin`);
        // console.log(`👤 Admin: ${process.env.ADMIN_USERNAME || 'admin'} / ${process.env.ADMIN_PASSWORD || 'ตั้งค่าใน .env'}`);
        console.log(`\n🚀 Endpoints:`);
        console.log(`   POST /api/generate-leonardo — สร้าง 1 ภาพ`);
        console.log(`   POST /api/generate-4        — สร้าง 4 ภาพ`);
        console.log(`   POST /api/upload            — อัปโหลดรูป`);
        console.log(`   GET  /api/health            — ตรวจสอบสถานะ`);
        console.log(`   POST /api/admin/login       — ล็อกอิน admin`);
        console.log(`   GET  /api/admin/leonardo-key — ดู API key`);
        console.log(`   POST /api/admin/update-leonardo-key — อัพเดท API key (บันทึก .env)\n`);
    }).on('error', (err) => { 
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        }
    });
};

startServer(PORT);