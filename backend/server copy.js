const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ✅ เพิ่ม dependencies ที่จำเป็นสำหรับ Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Uploads folder ──
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ── Multer ──
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

// ════════════════════════════════════════════════════
//  API ENDPOINTS
// ════════════════════════════════════════════════════

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

// ✅ แก้ไข upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
        
        // ✅ ใช้ req.file.path โดยตรง
        const buf = fs.readFileSync(req.file.path);
        
        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
            message: 'อัปโหลดรูปสำเร็จ'
        });
        
        // ✅ ลบไฟล์หลังส่ง response เพื่อประหยัดพื้นที่
        setTimeout(() => {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }, 5000);
        
    } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ error: e.message });
    }
});

// ════════════════════════════════════════════════════
//  LEONARDO HELPERS
// ════════════════════════════════════════════════════

/**
 * Upload reference image to Leonardo and get init_image_id
 */
async function uploadToLeonardo(base64Image, apiKey) {
    let base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    // Step 1: get presigned S3 URL
    const initRes = await fetch('https://cloud.leonardo.ai/api/rest/v1/init-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ extension: 'jpg' })
    });
    
    if (!initRes.ok) {
        const errorText = await initRes.text();
        throw new Error(`init-image failed: ${initRes.status} - ${errorText}`);
    }

    const initData = await initRes.json();
    console.log('init-image response:', JSON.stringify(initData).slice(0, 300));

    // ✅ ปรับปรุงการ parse response
    const d = initData.uploadInitImage || initData;
    const imageId = d.id || d.imageId;
    const uploadUrl = d.url || d.uploadUrl;
    
    // ✅ ตรวจสอบและจัดการ fields อย่างปลอดภัย
    let fields = {};
    if (d.fields) {
        if (typeof d.fields === 'string') {
            try {
                fields = JSON.parse(d.fields);
            } catch (e) {
                console.error('Failed to parse fields:', e);
                fields = {};
            }
        } else if (typeof d.fields === 'object') {
            fields = d.fields;
        }
    }

    if (!uploadUrl || !imageId) {
        throw new Error(`Missing uploadUrl or imageId. Got keys: ${Object.keys(d).join(', ')}`);
    }

    console.log(`✅ Got upload URL, imageId: ${imageId}`);

    // Step 2: upload to S3
    const form = new FormData();
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));
    
    const imgBuf = Buffer.from(base64Data, 'base64');
    // ✅ ใช้ Buffer โดยตรงแทน Blob
    form.append('file', imgBuf, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
    });

    const s3Res = await fetch(uploadUrl, { method: 'POST', body: form });
    if (!s3Res.ok) {
        const errorText = await s3Res.text();
        throw new Error(`S3 upload failed: ${s3Res.status} - ${errorText}`);
    }

    console.log(`✅ Uploaded to Leonardo, imageId: ${imageId}`);
    return imageId;
}

/** ✅ ปรับปรุง pollGeneration ให้มี timeout และ error handling ที่ดีขึ้น */
async function pollGeneration(generationId, apiKey, timeoutMs = 120000) {
    const startTime = Date.now();
    const MAX_ATTEMPTS = 40;
    
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        // ✅ ตรวจสอบ timeout
        if (Date.now() - startTime > timeoutMs) {
            throw new Error(`Generation timeout after ${timeoutMs}ms`);
        }
        
        await new Promise(r => setTimeout(r, 3000));
        console.log(`⏳ Polling ${i + 1}/${MAX_ATTEMPTS} — generationId: ${generationId}`);

        try {
            const res = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
            });
            
            if (!res.ok) {
                console.warn(`Poll failed: ${res.status}`);
                continue;
            }

            const data = await res.json();
            
            // ✅ ปรับปรุงการตรวจสอบ response
            let imgs = null;
            if (data.generations_by_pk?.generated_images?.length > 0) {
                imgs = data.generations_by_pk.generated_images;
            } else if (data.generations && data.generations[0]?.generated_images?.length > 0) {
                imgs = data.generations[0].generated_images;
            } else if (data.generated_images?.length > 0) {
                imgs = data.generated_images;
            } else if (data.status === 'COMPLETED' && data.images?.length > 0) {
                imgs = data.images;
            }

            if (imgs && imgs.length > 0 && imgs[0].url) {
                console.log(`✅ Got image: ${imgs[0].url}`);
                return imgs[0].url;
            }
            
            // ✅ ตรวจสอบสถานะ failed
            if (data.status === 'FAILED') {
                throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
            }
            
        } catch (error) {
            console.error('Polling error:', error);
            if (i === MAX_ATTEMPTS - 1) throw error;
        }
    }
    throw new Error('Generation timed out after maximum attempts');
}

// Face-lock prefix keeps identity intact
const FACE_LOCK =
    'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, ' +
    'eye shape, nose, mouth, jawline and identity of the reference person. ' +
    'The person MUST be instantly recognizable. Change ONLY costume and background. ';

const NEGATIVE =
    'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, ' +
    'different person, wrong face, altered face, morphed face, distorted identity';

// ════════════════════════════════════════════════════
//  GENERATE — single image
// ════════════════════════════════════════════════════
async function generateSingleImage(theme, prompt, imageId, strength, apiKey) {
    const fullPrompt = FACE_LOCK + (prompt || '') +
        ' Professional lighting, cinematic, ultra realistic, 4k, sharp focus.';

    // ✅ ตรวจสอบ strength
    const initStrength = parseFloat(strength);
    if (isNaN(initStrength)) {
        throw new Error('Invalid strength value');
    }

    const payload = {
        prompt: fullPrompt,
        negative_prompt: NEGATIVE,
        modelId: 'e316348f-7773-490e-adcd-46757c738eb7', // Leonardo Kino XL
        width: 768, height: 768, num_images: 1,
        guidance_scale: 8, num_inference_steps: 40,
        presetStyle: 'CINEMATIC',
        init_image_id: imageId,
        init_strength: initStrength
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

// ════════════════════════════════════════════════════
//  MAIN ENDPOINT: generate-leonardo
// ════════════════════════════════════════════════════
app.post('/api/generate-leonardo', async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;

        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });

        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        }

        console.log(`🎨 [${new Date().toISOString()}] Generating: ${theme} (strength ${strength})`);

        // Upload reference image
        const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);

        // Generate 1 image
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

// ════════════════════════════════════════════════════
//  BULK ENDPOINT: generate 4 images at once
// ════════════════════════════════════════════════════
app.post('/api/generate-4', async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;

        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });

        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) {
            return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        }

        console.log(`🎨 [${new Date().toISOString()}] Generating 4 images: ${theme}`);

        // Upload once, reuse imageId for all 4
        const imageId = await uploadToLeonardo(referenceImage, LEONARDO_API_KEY);

        // ✅ เพิ่ม delay ระหว่างการ generate เพื่อไม่ให้ overload API
        const generateWithDelay = async (index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            return generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        };

        // Generate 4 in parallel with delay
        const results = await Promise.allSettled(
            [0, 1, 2, 3].map((_, idx) => generateWithDelay(idx))
        );

        const imageUrls = results
            .map(r => r.status === 'fulfilled' ? r.value : null)
            .filter(Boolean);

        if (imageUrls.length === 0) {
            throw new Error('ไม่ได้รับรูปภาพจาก Leonardo.ai');
        }

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

// ── Static ──
app.use('/uploads', express.static(uploadDir));

// ── 404 / Error ──
app.use((req, res) => res.status(404).json({ error: 'ไม่พบ endpoint', path: req.originalUrl }));
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'เกิดข้อผิดพลาด' });
});

// ── Start ──
const startServer = (port) => {
    app.listen(port, '0.0.0.0', () => {
        const nets = require('os').networkInterfaces();
        console.log(`\n✅  Server running — http://localhost:${port}`);
        console.log(`🎨  Leonardo API Key: ${process.env.LEONARDO_API_KEY ? '✓ พบ' : '✗ ไม่พบ'}`);
        console.log(`\n📡  LAN access:`);
        for (const ifaces of Object.values(nets)) {
            for (const iface of ifaces) {
                if (iface.family === 'IPv4' && !iface.internal)
                    console.log(`    🌐  http://${iface.address}:${port}`);
            }
        }
        console.log(`\n🚀  Endpoints:`);
        console.log(`    POST /api/generate-leonardo  — 1 image per call`);
        console.log(`    POST /api/generate-4         — 4 images in one call`);
        console.log(`    POST /api/upload             — upload reference image`);
        console.log(`    GET  /api/health             — status check\n`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${port} in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

startServer(PORT);