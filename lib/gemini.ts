import { ChatGoogle } from "@langchain/google";
import type { ZodSchema } from "zod";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set — analysis calls will fail.");
}

// Single shared instance. Low temperature since we want consistent,
// grounded extraction/scoring, not creative variation.
export const geminiModel = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.1-flash-lite",
  temperature: 0.2,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets a structured JSON response from Gemini, validated against a Zod
 * schema. Retries once on failure (network blip, malformed JSON, or a
 * response that fails schema validation) before giving up — LLM calls are
 * flaky enough that a single retry meaningfully cuts down on user-facing
 * failures without adding much latency.
 */
export async function getStructuredResponse<T>(
  prompt: string,
  schema: ZodSchema<T>,
  attempt = 1
): Promise<T> {
  let raw: string;

  try {
    const response = await geminiModel.invoke(prompt);
    raw =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
  } catch (err) {
    if (attempt < 2) {
      await sleep(500);
      return getStructuredResponse(prompt, schema, attempt + 1);
    }
    throw new Error(
      `Gemini API call failed after retry: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  const cleaned = raw.replace(/```json\s*|```\s*/g, "").trim();

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(cleaned);
  } catch {
    if (attempt < 2) {
      await sleep(500);
      return getStructuredResponse(prompt, schema, attempt + 1);
    }
    throw new Error(
      `Gemini returned unparseable JSON: ${cleaned.slice(0, 200)}`
    );
  }

  const result = schema.safeParse(parsedJson);
  if (!result.success) {
    if (attempt < 2) {
      await sleep(500);
      return getStructuredResponse(prompt, schema, attempt + 1);
    }
    throw new Error(
      `Gemini response failed schema validation: ${result.error.message}`
    );
  }

  return result.data;
}
