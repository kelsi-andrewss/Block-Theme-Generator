# Project scaffold - Next.js 14+ App Router, TypeScript, ESLint, Tailwind CSS, dependencies

Story: story-851
Agent: architect

## Context

Initialize the project from scratch. This is the foundation every other story depends on. Must produce a clean, buildable Next.js 14+ project with App Router, TypeScript strict mode, Tailwind CSS, and all required dependencies installed.

## What changes

| File | Change |
|---|---|
| package.json | Initialize with Next.js 14+, TypeScript, Tailwind CSS, ESLint. Install: `@google/genai`, `zod`, `zod-to-json-schema`, `jszip`, `@wp-playground/client`. Dev deps: `@types/node`, `@types/react`, `vitest`, `@testing-library/react` |
| vitest.config.ts | Vitest configuration with path aliases matching tsconfig |
| tsconfig.json | TypeScript strict mode, path aliases (`@/` → `src/`), target ES2022 |
| next.config.js | Minimal Next.js config, enable experimental features if needed for App Router |
| tailwind.config.ts | Tailwind v3 config with content paths for `src/` |
| src/app/layout.tsx | Root layout with html/body, metadata (title: "Block Theme Generator"), global CSS import |
| src/app/page.tsx | Placeholder home page — heading + brief description. Will be replaced by story-859 |
| src/app/globals.css | Tailwind directives (@tailwind base/components/utilities) + minimal reset |

## Tasks

1. Run `npx create-next-app@latest` with TypeScript, Tailwind, ESLint, App Router, `src/` directory, import alias `@/`
2. Install production dependencies: `@google/genai`, `zod`, `zod-to-json-schema`, `jszip`
3. Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
4. Configure TypeScript strict mode and path aliases in tsconfig.json
5. Create placeholder page.tsx and root layout.tsx with app metadata
6. Verify: `npm run build` passes, `npm run dev` starts without errors
7. Create `.env.example` with `GEMINI_API_KEY=your-key-here` and `AI_PROVIDER=gemini`
8. Add `.gitignore` for node_modules, .next, .env, *.zip

## Acceptance criteria

- `npm install` completes without errors
- `npm run build` produces a successful build
- `npm run dev` starts the dev server and serves the placeholder page
- TypeScript strict mode is enabled
- All listed dependencies are present in package.json
- `.env.example` documents required environment variables

## Verification

- Run `npm run build` — must pass
- Run `npm run dev` — must serve at localhost:3000
- Run `npx tsc --noEmit` — must pass with strict mode
