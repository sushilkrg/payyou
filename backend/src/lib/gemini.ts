import { GoogleGenerativeAI } from "@google/generative-ai";

// Singleton Gemini client
const globalForGemini = globalThis as unknown as {
  gemini: GoogleGenerativeAI | undefined;
};

export const gemini =
  globalForGemini.gemini ?? new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

if (process.env.NODE_ENV !== "production") {
  globalForGemini.gemini = gemini;
}
