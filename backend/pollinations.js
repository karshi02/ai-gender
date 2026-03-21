// import fs from "fs";
// import fetch from "node-fetch";

// export async function generateImageWithPollinations(imagePath, theme) {
//   try {
//     // อ่านรูปต้นฉบับ
//     const imageBuffer = fs.readFileSync(imagePath);
//     const base64Image = imageBuffer.toString("base64");
    
//     // สร้าง prompt
//     const prompts = {
//       astronaut: "person in NASA astronaut suit, space background",
//       samurai: "person in samurai armor, japanese temple",
//       wizard: "person in wizard robe, fantasy castle",
//       cyberpunk: "person in cyberpunk outfit, neon city",
//     };
    
//     const prompt = prompts[theme] || `person in ${theme} outfit`;
    
//     // ใช้ Pollinations.ai (ฟรี)
//     const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&model=flux`;
    
//     console.log("🎨 กำลังสร้างภาพด้วย Pollinations.ai...");
//     const response = await fetch(url);
    
//     if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
//     // บันทึกรูป
//     const outputPath = `uploads/output_${Date.now()}.png`;
//     const buffer = await response.buffer();
//     fs.writeFileSync(outputPath, buffer);
    
//     console.log("✅ สร้างภาพสำเร็จ:", outputPath);
//     return [outputPath]; // คืนค่าเป็น array เหมือน Replicate
    
//   } catch (error) {
//     console.error("❌ Pollinations error:", error);
//     throw error;
//   }
// }
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateImageWithPollinations(imagePath, theme) {
  try {
    const prompts = {
      astronaut: "person wearing NASA astronaut suit, space helmet, outer space background, photorealistic, 8k, professional photography",
      samurai: "person wearing traditional samurai armor, katana, japanese temple background, cinematic lighting, photorealistic",
      wizard: "person wearing magical wizard robe, holding magic staff, fantasy castle background, magical glow, photorealistic",
      cyberpunk: "person wearing cyberpunk futuristic neon outfit, glowing cybernetic implants, rainy city street, neon lights, cinematic"
    };
    
    const prompt = prompts[theme] || `person in ${theme} outfit, photorealistic, cinematic lighting, professional photography`;
    
    console.log(`🎨 Pollinations prompt: ${prompt}`);
    
    // สร้างรูป 4 รูปด้วยธีมเดียวกัน
    const images = [];
    const uploadDir = path.join(__dirname, '../uploads');
    
    for (let i = 0; i < 4; i++) {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&model=flux&nologo=true`;
      
      console.log(`   📥 กำลังสร้างรูปที่ ${i + 1}/4...`);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const filename = `generated_${Date.now()}_${i}.png`;
      const filepath = path.join(uploadDir, filename);
      
      fs.writeFileSync(filepath, Buffer.from(buffer));
      images.push(`/uploads/${filename}`);
      
      // รอเล็กน้อยเพื่อไม่ให้ API โหลด太重
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`✅ สร้างภาพสำเร็จ ${images.length} รูป`);
    return images;
    
  } catch (error) {
    console.error("❌ Pollinations error:", error);
    throw error;
  }
}