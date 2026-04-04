import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from 'node-fetch';  // เพิ่มบรรทัดนี้

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateImageWithPollinations(imagePath, theme) {
  try {
    const prompts = {
      astronaut: "astronaut in space suit, outer space background, photorealistic, high quality",
      samurai: "samurai warrior with katana, japanese temple background, cinematic lighting",
      wizard: "wizard with magic staff, fantasy castle background, magical glow",
      cyberpunk: "cyberpunk character with neon lights, futuristic city, rainy street"
    };
    
    const prompt = prompts[theme] || `${theme} style character, photorealistic, high quality`;
    const encodedPrompt = encodeURIComponent(prompt);
    
    // ใช้ URL ที่เสถียรกว่า
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&model=flux&nologo=true`;
    
    console.log("🎨 กำลังสร้างภาพ:", prompt);
    console.log("🔗 URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    const uploadDir = path.join(__dirname, '../uploads');
    
    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filename = `generated_${Date.now()}.png`;
    const filepath = path.join(uploadDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    console.log("✅ สร้างภาพสำเร็จ:", filename);
    
    return [`/uploads/${filename}`];
    
  } catch (error) {
    console.error("❌ Pollinations error:", error);
    throw error;
  }
}



