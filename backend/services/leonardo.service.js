const FACE_LOCK = 'CRITICAL: This is image-to-image. Preserve the EXACT same face, facial features, skin tone, eye shape, nose, mouth, jawline and identity of the reference person. The person MUST be instantly recognizable. Change ONLY costume and background. ';
const NEGATIVE = 'deformed, blurry, bad anatomy, disfigured, ugly, low quality, watermark, text, logo, different person, wrong face, altered face, morphed face, distorted identity';

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

module.exports = { uploadToLeonardo, pollGeneration, generateSingleImage };