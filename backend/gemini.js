import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateImage(imagePath, theme) {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro-vision"
  });

  const image = fs.readFileSync(imagePath);

  const prompt = `
  Transform this person into ${theme}.
  Keep the same face.
  Ultra realistic.
  `;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: image.toString("base64"),
        mimeType: "image/jpeg"
      }
    }
  ]);

  return result.response.text(); // (Gemini บางทีจะคืนเป็น text / base64)
}