import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set — analysis calls will fail.");
}

// Single shared instance. Low temperature since we want consistent,
// grounded extraction/scoring, not creative variation.
export const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash",
  temperature: 0.2,
});

/**
 * Helper to get a clean JSON object back from Gemini.
 * Strips markdown code fences if the model wraps its output in them.
 */
export async function getStructuredResponse<T>(prompt: string): Promise<T> {
  const response = await geminiModel.invoke(prompt);
  const raw =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const cleaned = raw.replace(/```json\s*|```\s*/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse structured response from Gemini: ${cleaned.slice(0, 200)}`
    );
  }
}
