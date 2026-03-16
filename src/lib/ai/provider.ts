import type { ZodSchema } from "zod";

export interface GenerateOptions {
  temperature?: number;
}

export interface AIProvider {
  generateJSON<T>(
    prompt: string,
    systemPrompt: string,
    schema: ZodSchema<T>,
    options?: GenerateOptions
  ): Promise<T>;

  generateText(
    prompt: string,
    systemPrompt: string,
    options?: GenerateOptions
  ): Promise<string>;
}
