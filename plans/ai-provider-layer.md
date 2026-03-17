# AI provider abstraction layer

Story: story-852
Agent: architect

## Context

Create a provider-agnostic AI interface so the app can swap between Gemini, Claude, and OpenAI with a single env var change. Default implementation uses Gemini 2.5 Flash with structured JSON output support via `@google/genai` SDK.

Key SDK details (from research):
- Package: `@google/genai` (NOT the older `@google/generative-ai`)
- Client: `new GoogleGenAI({ apiKey })`
- Calls: `ai.models.generateContent({ model, contents, config })`
- Structured output: `config.responseMimeType: "application/json"` + `config.responseJsonSchema`
- System instructions: `config.systemInstruction: string`
- Model: `gemini-2.5-flash` (2.0-flash is deprecated, shutting down June 2026)

## What changes

| File | Change |
|---|---|
| src/lib/ai/provider.ts | Define `AIProvider` interface with `generateJSON<T>(prompt: string, systemPrompt: string, schema: ZodSchema<T>): Promise<T>` and `generateText(prompt: string, systemPrompt: string): Promise<string>` methods |
| src/lib/ai/gemini.ts | Implement `GeminiProvider` — uses `@google/genai`, `gemini-2.5-flash`, structured JSON output with Zod schema conversion via `zod-to-json-schema` or manual conversion, retry with exponential backoff (p-retry pattern), temperature config |
| src/lib/ai/index.ts | Factory function `getProvider(name?: string): AIProvider` — reads `AI_PROVIDER` env var, returns appropriate provider. Default: Gemini |
| .env.example | Add `AI_PROVIDER=gemini` and `GEMINI_API_KEY=` entries |

## Contract

- `AIProvider` interface
  - `generateJSON<T>(prompt: string, systemPrompt: string, schema: ZodSchema<T>, options?: { temperature?: number }): Promise<T>` — generates and validates structured JSON
  - `generateText(prompt: string, systemPrompt: string, options?: { temperature?: number }): Promise<string>` — generates free-form text
- `GeminiProvider` implements `AIProvider`
  - Constructor: `new GeminiProvider(apiKey: string, model?: string)`
- `getProvider(name?: string): AIProvider` — factory, reads env vars

## Tasks

1. Define the `AIProvider` interface in `provider.ts` with generic `generateJSON<T>` (takes Zod schema, returns parsed+validated T) and `generateText` methods
2. Implement `GeminiProvider` in `gemini.ts`:
   - Initialize `GoogleGenAI` client with API key from env
   - `generateJSON`: use `responseMimeType: "application/json"` + convert Zod schema to JSON Schema for `responseJsonSchema`, parse response with `schema.parse()`
   - `generateText`: standard text generation with system prompt
   - Retry logic: exponential backoff with jitter, max 3 retries, abort on 400/401/403, retry on 429/500
   - Configurable temperature per call (default 0.7)
3. Implement factory in `index.ts` — switch on `AI_PROVIDER` env var
4. Update `.env.example` with all AI provider env vars

## Acceptance criteria

- Given a valid Gemini API key, when `generateJSON` is called with a Zod schema, then the response is parsed and validated against that schema
- Given a valid Gemini API key, when `generateText` is called, then a string response is returned
- Given a 429 rate limit response, when a request fails, then it retries with exponential backoff up to 3 times
- Given `AI_PROVIDER=gemini` in env, when `getProvider()` is called, then a `GeminiProvider` instance is returned
- Given an unsupported provider name, when `getProvider("unknown")` is called, then an error is thrown

## Verification

- Unit test: mock the Gemini SDK, verify generateJSON parses and validates output
- Unit test: verify retry logic triggers on 429 responses
- Manual test: with real API key, generate a simple JSON object
