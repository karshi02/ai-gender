const leonardoService = require('../services/leonardo.service');

const generateSingle = async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
        console.log(`🎨 Generating: ${theme} (strength ${strength})`);
        
        const imageId = await leonardoService.uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
        const imageUrl = await leonardoService.generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
        
        res.json({ success: true, imageUrl, provider: 'leonardo', strength });
        
    } catch (err) {
        console.error('generate-leonardo error:', err.message);
        res.status(500).json({ 
            error: err.message,
            details: 'ตรวจสอบ API key, เครดิต Leonardo.ai และรูปต้นฉบับ'
        });
    }
};

const generateBulk = async (req, res) => {
    try {
        const { theme, prompt, referenceImage, strength = 0.45 } = req.body;
        
        if (!theme) return res.status(400).json({ error: 'กรุณาเลือกธีม' });
        if (!referenceImage) return res.status(400).json({ error: 'กรุณาอัปโหลดรูปก่อน' });
        
        const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
        if (!LEONARDO_API_KEY) return res.status(500).json({ error: 'ไม่พบ LEONARDO_API_KEY' });
        
        console.log(`🎨 [${new Date().toISOString()}] Generating 4 images: ${theme}`);
        
        const imageId = await leonardoService.uploadToLeonardo(referenceImage, LEONARDO_API_KEY);
        
        const generateWithDelay = async (index) => {
            await new Promise(resolve => setTimeout(resolve, index * 1000));
            return leonardoService.generateSingleImage(theme, prompt, imageId, strength, LEONARDO_API_KEY);
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
};

module.exports = { generateSingle, generateBulk };