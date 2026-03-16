# AI-Powered WordPress Block Theme Generator

Web app that generates complete WordPress Block Themes from natural language descriptions.

## Prerequisites

- Node.js 18+
- Gemini API key ([get one free](https://aistudio.google.com/apikey))

## Quick Start

```bash
npm install
cp .env.example .env        # then add your GEMINI_API_KEY
npm run dev                  # opens at http://localhost:3000
```

## Architecture

Describe a theme in plain English and get a production-ready `.zip` you can install on any WordPress 6.6+ site.

```
┌─────────────────┐
│  User Prompt     │  "A warm bakery site with menu and online ordering"
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Prompt          │  Archetype detection (8 built-in types)
│  Enrichment      │  Gap analysis — fills in missing design decisions
│                  │  Design brief — color harmony, typography pairing, layout density
│                  │  Flavor seeds — randomized to prevent identical outputs
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Multi-step AI   │  Step 1: theme.json (colors, typography, spacing, layout)
│  Generation      │  Step 2: Templates (index, single, page, archive, 404, search)
│                  │  Step 3: Template parts (header, footer, sidebar)
│                  │  Step 4: Block patterns (hero, features, CTA, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation &    │  Block markup validation (delimiter pairs, block whitelist, JSON attrs)
│  Audit           │  WCAG AA contrast checking
│                  │  Typography scale & 8px grid adherence
│                  │  Color harmony analysis
│                  │  Design quality score (0–100)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ZIP Packaging   │  Assembles style.css, theme.json, templates/, parts/, patterns/
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WordPress       │  Full WP instance via WebAssembly (WordPress Playground)
│  Playground      │  Blueprint API installs theme from ZIP blob
│  Preview         │  Zero server-side WordPress required
└─────────────────┘
```

## Key Features

- **Smart prompt suggestions** — detects vague prompts and enriches them with specific design decisions
- **8 theme archetypes** — Portfolio, SaaS, Blog, Restaurant, Ecommerce, Agency, Magazine, Creative
- **Light + dark mode** — generates both color schemes with proper `theme.json` presets
- **Design quality score** — automated audit measuring contrast, type scale, spacing, color harmony
- **Live WordPress preview** — see your theme running in a real WordPress instance, in-browser

## Swapping AI Providers

The generator uses a provider-agnostic interface. Set the `AI_PROVIDER` environment variable:

```bash
AI_PROVIDER=gemini    # default — Gemini 2.5 Flash (free tier works)
AI_PROVIDER=claude    # Anthropic Claude
AI_PROVIDER=openai    # OpenAI GPT
```

Each provider needs its own API key environment variable (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`).

## Known Limitations

- **Free tier rate limits** — Gemini free tier allows 10 RPM / 250K TPM, so full theme generation takes ~2 minutes
- **Core blocks only** — generated themes use WordPress core blocks; no custom or third-party block support
- **No WooCommerce** — ecommerce archetype generates layout patterns but not product/cart/checkout templates
- **No custom fonts** — typography is limited to Google Fonts available in the WordPress font library

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| AI | Gemini 2.5 Flash (provider-swappable) |
| Validation | Zod |
| Packaging | JSZip |
| Preview | WordPress Playground (WebAssembly) |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + React Testing Library |

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm run test       # run tests
npm run test:watch # tests in watch mode
```
