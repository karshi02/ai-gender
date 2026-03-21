// // import fs from "fs";
// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // export async function generateImage(imagePath, theme) {
// //   const model = genAI.getGenerativeModel({
// //     model: "gemini-pro-vision"
// //   });

// //   const image = fs.readFileSync(imagePath);

// //   const prompt = `
// //   Transform this person into ${theme}.
// //   Keep the same face.
// //   Ultra realistic.
// //   `;

// //   const result = await model.generateContent([
// //     prompt,
// //     {
// //       inlineData: {
// //         data: image.toString("base64"),
// //         mimeType: "image/jpeg"
// //       }
// //     }
// //   ]);

// //   return result.response.text(); // (Gemini บางทีจะคืนเป็น text / base64)
// // }
// import fs from "fs";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({ path: path.join(__dirname, ".env") });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function analyzeGender(imagePath) {
//   try {
//     // อ่านไฟล์รูป
//     const imageBuffer = fs.readFileSync(imagePath);
//     const base64Image = imageBuffer.toString("base64");
//     const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

//     // ใช้ Gemini 1.5 Flash (เร็วและฟรี)
//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-1.5-flash"
//     });

//     const prompt = `Please analyze this person's photo carefully and determine their gender.
    
//     Look at:
//     - Facial features (jawline, brow ridge, cheekbones)
//     - Hairstyle and facial hair
//     - Overall appearance
    
//     Respond with ONLY one word in lowercase:
//     - "male" if clearly male
//     - "female" if clearly female  
//     - "non-binary" if ambiguous or androgynous
//     - "unknown" if cannot determine
    
//     Do not add any explanation, just the single word.`;

//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: base64Image,
//           mimeType: mimeType
//         }
//       }
//     ]);

//     const response = await result.response;
//     let gender = response.text().trim().toLowerCase();
    
//     // ทำความสะอาดผลลัพธ์
//     if (gender.includes("male")) gender = "male";
//     else if (gender.includes("female")) gender = "female";
//     else if (gender.includes("non-binary")) gender = "non-binary";
//     else gender = "unknown";
    
//     console.log("🔍 Gemini gender analysis:", gender);
    
//     return {
//       gender: gender,
//       method: "Google Gemini 1.5 Flash",
//       success: true
//     };
    
//   } catch (error) {
//     console.error("❌ Gemini API error:", error);
//     throw error;
//   }
// }

// // ถ้าอยากให้สร้างภาพจริงๆ ต้องใช้ Replicate หรือ API อื่น
// export async function generateImageWithReplicate(imagePath, theme) {
//   // ใช้ Replicate แทน (ตามโค้ดเดิมของคุณ)
//   // แต่แนะนำให้แยกฟังก์ชันนี้ไว้ต่างหาก
//   console.log("⚠️ Image generation requires Replicate API, not Gemini");
//   throw new Error("Gemini cannot generate images. Use Replicate instead.");
// }
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeGender(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    const prompt = `Analyze this person's photo and determine their gender.
    Look at facial features, hairstyle, and overall appearance.
    Respond with ONLY one word: male, female, or non-binary.
    If unsure, respond with unknown.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    let gender = response.text().trim().toLowerCase();
    
    // Clean up response
    if (gender.includes("male")) gender = "male";
    else if (gender.includes("female")) gender = "female";
    else if (gender.includes("non-binary")) gender = "non-binary";
    else gender = "unknown";
    
    console.log(`🔍 Gemini result: ${gender}`);
    
    return {
      gender: gender,
      method: "Google Gemini 1.5 Flash",
      confidence: "high"
    };
    
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    throw error;
  }
}