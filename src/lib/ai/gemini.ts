import "server-only";

import { GoogleGenAI } from "@google/genai/node";
import type { Mood } from "@/lib/constants";
import { buildDreamInsightPrompt } from "@/lib/ai/prompts";

const MODEL = "gemini-2.5-flash";

export async function generateDreamInsight(
  dreamText: string,
  mood: Mood,
  isLucid: boolean,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildDreamInsightPrompt(dreamText, mood, isLucid);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Empty response from Gemini");
  }
  return text;
}

export { MODEL as GEMINI_MODEL_ID };
