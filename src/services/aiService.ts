import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const enhanceImageWithAI = async (imageDataUrl: string) => {
  if (!API_KEY || API_KEY === "MY_GEMINI_API_KEY") {
    throw new Error("Gemini API Key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const base64Data = imageDataUrl.split(",")[1];
  
  const result = await model.generateContent([
    "Describe this image in detail for a high-quality reconstruction. Focus on lighting, textures, and clarity.",
    {
      inlineData: {
        data: base64Data,
        mimeType: "image/png"
      }
    }
  ]);

  const response = await result.response;
  return response.text();
};
