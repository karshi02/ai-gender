import Replicate from "replicate";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

    // แปลงธีมเป็น prompt
    function getPrompt(theme) {
    const prompts = {
        astronaut: "a person wearing NASA astronaut suit, space helmet, outer space background, highly detailed, cinematic lighting, 8k, photorealistic",
        samurai: "a person wearing traditional samurai armor, japanese background, cinematic lighting, highly detailed, photorealistic",
        wizard: "a person wearing magical wizard robe, holding staff, fantasy background, cinematic lighting, highly detailed",
        cyberpunk: "a person wearing cyberpunk futuristic outfit, neon lights, city background, highly detailed, cinematic lighting",
        default: "a person wearing {theme} outfit, highly detailed, cinematic lighting, photorealistic"
    };
    
    return prompts[theme] || prompts.default.replace("{theme}", theme);
    }

    export async function generateImageWithReplicate(imagePath, theme) {
    try {
        // อ่านรูปเป็น base64
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString("base64");
        const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

        console.log("📤 ส่งไป Replicate ด้วยธีม:", theme);

        // ใช้ model Stable Diffusion img2img
        const output = await replicate.run(
        "stability-ai/stable-diffusion-img2img:15a3689f5a9b804a8bd7eb4022f5a573f7bf5c8e9a2a5b7b9a5b7b9a5b7b9a5b7",
        {
            input: {
            prompt: getPrompt(theme),
            image: dataUrl,
            strength: 0.75,          // ความแรงของ AI (0-1) ยิ่งน้อยยิ่งเหมือนเดิม
            num_outputs: 4,           // สร้าง 4 รูป
            guidance_scale: 7.5,
            negative_prompt: "blurry, bad anatomy, distorted face, extra limbs, bad quality, worst quality",
            scheduler: "DPMSolverMultistep",
            num_inference_steps: 30
            }
        }
        );

        console.log("📥 ผลลัพธ์จาก Replicate:", output);
        
        // output เป็น array ของ URL รูปภาพ
        return output;
    } catch (error) {
        console.error("❌ Replicate error:", error);
        throw error;
  }
}