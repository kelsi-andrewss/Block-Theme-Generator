import type { ThemeArchetype } from "./archetypes";
import { getArchetypeById } from "./archetypes";

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  archetype: ThemeArchetype;
  style: string;
  enrichedDescription: string;
}

function requireArchetype(id: string): ThemeArchetype {
  const archetype = getArchetypeById(id);
  if (!archetype) {
    throw new Error(`Archetype "${id}" not found`);
  }
  return archetype;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "neobrutalist-saas-landing",
    name: "Neobrutalist SaaS Landing Page",
    description: "A bold, attention-grabbing SaaS landing page with thick borders, raw aesthetics, and unapologetic personality.",
    archetype: requireArchetype("saas"),
    style: "neobrutalist",
    enrichedDescription: `Create a WordPress block theme for a neobrutalist SaaS landing page.

## Design Direction
Target audience: early-adopter developers and tech-savvy founders who appreciate design that breaks conventions.
Visual aesthetic: neobrutalist — thick black borders, offset shadows, raw typography, intentionally rough edges. Not broken — deliberately bold.

## Color & Typography
Color: Primary #0a0a0a, secondary #f5f0e6, accent #ff5c00 (signal orange), background #f5f0e6, text #0a0a0a. Add pops of #3b82f6 (blue) for secondary CTAs.
Use a split-complementary color harmony — orange + blue accents against warm off-white.
Typography: "Space Grotesk" for headings at oversized scale (48-72px), "IBM Plex Mono" for body text and UI labels. Monospace creates the technical credibility.

## Layout & Structure
Layout density: balanced — sections have breathing room but content is direct.
Hero with oversized headline (one big statement), thick-bordered feature cards with 4px solid black borders and 6px offset shadows. Pricing table with exaggerated borders. Testimonial cards with pull-quote styling. Final CTA section with full-width colored background.
Navigation: sticky top bar with thick bottom border, logo left, nav links in monospace, CTA button with offset shadow.
Sections: hero, features, pricing, testimonials, cta, faq.

## Interactions
Hover effects with shadow offset changes (shadow moves on hover), pricing toggle between monthly/annual with animated transition, scroll-triggered section reveals with no fade — elements snap in.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use rounded corners above 4px — keep edges sharp and deliberate.
- Do NOT use gradients — flat colors only for the brutalist aesthetic.
- Do NOT use more than 3 font families.
- Do NOT use subtle, safe design choices — this template should have strong visual opinions.`,
  }
];
