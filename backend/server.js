import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generateImageWithReplicate } from "./replicate.js"; // เปลี่ยนเป็น replicate

// 1️⃣ โหลด .env
dotenv.config({ path: "./backend/.env" });

// 2️⃣ สร้าง app
const app = express();

// 3️⃣ middleware
app.use(cors());
app.use(express.json());

// 4️⃣ setup path สำหรับเสิร์ฟไฟล์
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 5️⃣ เสิร์ฟ frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// 6️⃣ route หน้าแรก
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 7️⃣ upload config
const upload = multer({ dest: "uploads/" });

// 8️⃣ debug
console.log("✅ Gemini API KEY:", process.env.GEMINI_API_KEY);
console.log("✅ Replicate API Token:", process.env.REPLICATE_API_TOKEN ? "มีแล้ว ✅" : "ไม่มี ❌");

// 9️⃣ API generate (ใช้ Replicate)
app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const theme = req.body.theme;
    const imagePath = req.file.path;

    console.log("🎯 รับรูปแล้ว กำลังส่งไป Replicate...");

    // เรียก Replicate ให้สร้าง 4 รูป
    const imageUrls = await generateImageWithReplicate(imagePath, theme);

    console.log("✅ ได้รูปมาแล้ว:", imageUrls);

    // ส่งกลับไป frontend
    res.json(imageUrls);
  } catch (err) {
    console.error("❌ Error ใน /generate:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔟 start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});