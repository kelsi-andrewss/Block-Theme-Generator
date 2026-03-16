import { GoogleGenAI } from "@google/genai";
import type { ZodSchema } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { AIProvider, GenerateOptions } from "./provider";

const DEFAULT_TEMPERATURE = 0.7;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503]);
const ABORT_STATUS_CODES = new Set([400, 401, 403]);

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const status = (error as Error & { status?: number }).status;
    if (status !== undefined) {
      if (ABORT_STATUS_CODES.has(status)) return false;
      if (RETRYABLE_STATUS_CODES.has(status)) return true;
    }
    const code = (error as Error & { code?: number }).code;
    if (code !== undefined) {
      if (ABORT_STATUS_CODES.has(code)) return false;
      if (RETRYABLE_STATUS_CODES.has(code)) return true;
    }
  }
  return false;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES || !isRetryableError(error)) {
        throw error;
      }
      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export class GeminiProvider implements AIProvider {
  private client: GoogleGenAI;
  private model: string;

  constructor(apiKey: string, model = "gemini-2.5-flash") {
    this.client = new GoogleGenAI({ apiKey });
    this.model = model;
  }

  async generateJSON<T>(
    prompt: string,
    systemPrompt: string,
    schema: ZodSchema<T>,
    options?: GenerateOptions
  ): Promise<T> {
    const jsonSchema = zodToJsonSchema(schema);

    const response = await withRetry(() =>
      this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
          responseMimeType: "application/json",
          responseJsonSchema: jsonSchema,
          systemInstruction: systemPrompt,
        },
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const parsed = JSON.parse(text);
    return schema.parse(parsed);
  }

  async generateText(
    prompt: string,
    systemPrompt: string,
    options?: GenerateOptions
  ): Promise<string> {
    const response = await withRetry(() =>
      this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? DEFAULT_TEMPERATURE,
          systemInstruction: systemPrompt,
        },
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  }
}
