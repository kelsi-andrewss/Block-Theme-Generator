import type { AIProvider } from "./provider";
import { GeminiProvider } from "./gemini";

export type { AIProvider, GenerateOptions } from "./provider";
export { GeminiProvider } from "./gemini";

export function getProvider(name?: string): AIProvider {
  const provider = name ?? process.env.AI_PROVIDER ?? "gemini";

  switch (provider) {
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "GEMINI_API_KEY environment variable is required for Gemini provider"
        );
      }
      return new GeminiProvider(apiKey);
    }
    default:
      throw new Error(`Unsupported AI provider: "${provider}"`);
  }
}
