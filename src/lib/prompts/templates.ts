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
    id: "editorial-photography-portfolio",
    name: "Editorial Photography Portfolio",
    description: "A refined portfolio for photographers with editorial sensibility, large image presentations, and minimal distractions.",
    archetype: requireArchetype("portfolio"),
    style: "editorial",
    enrichedDescription: `Create a WordPress block theme for an editorial photography portfolio.

## Design Direction
Target audience: creative directors, art buyers, and photography enthusiasts.
Visual aesthetic: editorial and refined — every element serves the imagery. Think high-end photo book translated to web.

## Color & Typography
Color: Use the "Dark Studio" palette: primary #0d0d0d, secondary #1a1a1a, accent #e8d5b7, background #0d0d0d, text #f0ede8.
Use a complementary color harmony with warm gold accents against deep blacks.
Typography: "Playfair Display" for headings (elegant serifs that evoke print editorials), "Source Sans 3" for body text (clean, readable, stays out of the way).

## Layout & Structure
Layout density: airy — generous whitespace is the primary design element.
Full-bleed hero image that fills the viewport. Masonry gallery below with variable-height images preserving original aspect ratios. About section with large pull quote and photographer bio. Contact section with minimal form.
Navigation: fixed minimal top bar with logo left, 3-4 text links right, no background until scroll.
Sections: hero, gallery, about, contact.

## Interactions
Subtle hover reveals showing image titles, smooth scroll between sections, lightbox for full-size image viewing with keyboard navigation.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use generic card grids — gallery items should feel curated, not templated.
- Do NOT use lorem ipsum — use contextual placeholder text about photography.
- Do NOT use more than 3 font families.
- Do NOT use pure black (#000000) on pure white (#ffffff) for body text.`,
  },
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
  },
  {
    id: "minimal-personal-blog",
    name: "Minimal Personal Blog",
    description: "A distraction-free blog focused entirely on reading experience, with warm tones and carefully chosen typography.",
    archetype: requireArchetype("blog"),
    style: "minimal",
    enrichedDescription: `Create a WordPress block theme for a minimal personal blog.

## Design Direction
Target audience: thoughtful readers who value long-form content and a calm digital space.
Visual aesthetic: minimal and warm — stripped to essentials but not cold. Every element earns its place.

## Color & Typography
Color: Use a restrained palette: primary #2d2d2d, secondary #f7f5f0, accent #c05746 (warm terracotta for links and highlights), background #faf8f5, text #363636.
Use an analogous color harmony — warm neutrals with terracotta accent.
Typography: "Lora" for headings (warm serif with personality), "Source Serif 4" for body text at 18px with 1.75 line height. Reading comfort is the top priority.

## Layout & Structure
Layout density: airy — maximum breathing room for content.
Single column content layout with 640px max-width. Simple header with blog name (no logo) and minimal nav. Post listing shows title, date, and first paragraph excerpt. Individual posts have generous margins, pull quotes styled with left border accent, and footnote support. Footer with simple about blurb and RSS link.
Navigation: text-only top nav with blog name left, 2-3 page links right. No hamburger menu.
Sections: header, featured-post, post-grid, about, newsletter.

## Interactions
Reading progress indicator (thin accent-colored bar at top of page), smooth anchor scrolling for table of contents, subtle link underline animation on hover.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use sidebar elements — single column only.
- Do NOT use featured images as large hero banners — keep image sizes moderate and inline.
- Do NOT use more than 2 font families.
- Do NOT use any decorative elements that don't serve readability.`,
  },
  {
    id: "warm-rustic-restaurant",
    name: "Warm Rustic Restaurant",
    description: "An inviting restaurant site with warm earth tones, food photography emphasis, and an elegant menu presentation.",
    archetype: requireArchetype("restaurant"),
    style: "organic",
    enrichedDescription: `Create a WordPress block theme for a warm rustic restaurant website.

## Design Direction
Target audience: local diners, food enthusiasts, and visitors searching for an authentic dining experience.
Visual aesthetic: organic and rustic — warm earth tones, natural textures, hand-crafted feeling without being kitschy. Think farm-to-table ethos reflected in design.

## Color & Typography
Color: Primary #3c1518 (deep wine), secondary #f9f2ec (warm cream), accent #c8553d (burnt sienna), background #fdfaf6 (warm white), text #2c1810 (espresso).
Use an analogous color harmony — all warm tones from cream through wine.
Typography: "Playfair Display" for headings and menu category names (elegant, restaurant-appropriate), "Lato" for body text and menu descriptions (warm, readable sans-serif).

## Layout & Structure
Layout density: balanced — spacious enough to feel premium, structured enough for menu readability.
Full-viewport hero with atmospheric food photography and restaurant name overlay. Story/about section with side-by-side image and text. Menu section with categorized items (starters, mains, desserts) in a clean two-column layout with prices right-aligned. Photo gallery with warm-toned food and interior shots. Reservations section with booking CTA. Location section with hours and embedded map area.
Navigation: transparent nav over hero image, becomes solid on scroll. Logo centered or left, minimal links.
Sections: hero, about, menu, gallery, reservations, location, contact.

## Interactions
Menu category tabs or smooth accordion for different meal sections, hover effect on gallery images showing dish names, scroll-triggered fade-in for content sections.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use cold blue or grey tones — maintain warmth throughout.
- Do NOT use stock photo aesthetics — design for authentic, warm food photography.
- Do NOT use more than 3 font families.
- Do NOT use pure black (#000000) on pure white (#ffffff) — keep the warm tone consistent.`,
  },
  {
    id: "cinematic-creative-portfolio",
    name: "Cinematic Creative Portfolio",
    description: "A dramatic, full-screen portfolio with cinematic dark tones, bold typography, and immersive visual storytelling.",
    archetype: requireArchetype("creative"),
    style: "cinematic",
    enrichedDescription: `Create a WordPress block theme for a cinematic creative portfolio.

## Design Direction
Target audience: art directors, creative agencies, and collaborators seeking a visually bold creative partner.
Visual aesthetic: cinematic — dramatic contrast, wide-format compositions, dark atmosphere with selective lighting through color accents. Like opening credits of a film.

## Color & Typography
Color: Primary #0a0a0a (near black), secondary #1a1a2e (midnight blue-black), accent #ff3366 (electric magenta for highlights and hover states), background #0a0a0a, text #e0e0e0.
Use a complementary color harmony — magenta cuts through the darkness.
Typography: "Bebas Neue" for headings at display scale (80-120px, all caps, cinematic titling), "Space Mono" for body text and captions (technical edge, pairs well with display type).

## Layout & Structure
Layout density: airy — full-screen sections with single focal points per viewport.
Full-viewport dark hero with project reel or single dramatic image. Work section as horizontal scroll or large stacked project showcases (one per viewport). About section with high-contrast portrait and short bio in large type. Process section showing creative methodology in numbered steps. Contact section minimal — email link as large type.
Navigation: hidden hamburger menu that opens as full-screen overlay, or thin fixed side nav with dot indicators.
Sections: hero, work, about, process, contact.

## Interactions
Cursor-following spotlight effect on dark backgrounds, project hover reveals with scale and color shift, smooth page-section transitions, parallax depth on layered elements.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use light backgrounds — maintain the dark cinematic atmosphere throughout.
- Do NOT use small, timid typography — headings should be dramatically oversized.
- Do NOT use more than 3 font families.
- Do NOT use generic grid layouts — each project should have unique visual treatment.`,
  },
  {
    id: "clean-agency-showcase",
    name: "Clean Agency Showcase",
    description: "A polished agency site that communicates expertise through strong typography, strategic whitespace, and results-focused case studies.",
    archetype: requireArchetype("agency"),
    style: "minimal",
    enrichedDescription: `Create a WordPress block theme for a clean agency showcase website.

## Design Direction
Target audience: business owners, marketing directors, and startup founders evaluating professional service partners.
Visual aesthetic: minimal and authoritative — confidence expressed through restraint. Strong typographic hierarchy does the heavy lifting.

## Color & Typography
Color: Primary #0f172a (deep navy), secondary #f8fafc (cool white), accent #2563eb (confident blue for CTAs and highlights), background #ffffff, text #1e293b (slate).
Use a complementary color harmony — navy and blue create depth without visual noise.
Typography: "Space Grotesk" for headings (geometric, modern, conveys technical competence), "DM Sans" for body text (clean, professional, excellent readability).

## Layout & Structure
Layout density: balanced — professional and organized with room to breathe.
Hero with bold statement headline (no image — pure typography impact), optional subtle animated background. Services section as clean icon-free grid with service name and one-line description. Case studies as large image cards with project name and results metric overlay. About section with team value proposition. Team grid with professional headshots. Testimonials as large pull quotes with client attribution. Contact section with clear CTA.
Navigation: clean horizontal nav, logo left, links center or right, prominent "Get in Touch" CTA button. Sticky on scroll.
Sections: hero, services, case-studies, about, team, testimonials, contact.

## Interactions
Case study cards with subtle scale-up on hover, scroll-triggered stat counters (e.g., "150+ projects delivered"), smooth section transitions, team member cards revealing role on hover.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use decorative icons from generic icon sets — let typography and whitespace do the work.
- Do NOT use carousel/slider components — they reduce engagement.
- Do NOT use more than 3 font families.
- Do NOT use pure black (#000000) on pure white (#ffffff) for body text.`,
  },
  {
    id: "bold-magazine-layout",
    name: "Bold Magazine Layout",
    description: "A striking editorial magazine theme with dynamic multi-column layouts, bold headlines, and information-rich presentation.",
    archetype: requireArchetype("magazine"),
    style: "editorial",
    enrichedDescription: `Create a WordPress block theme for a bold editorial magazine layout.

## Design Direction
Target audience: news consumers, subject-matter enthusiasts, and readers who enjoy rich editorial content.
Visual aesthetic: editorial and bold — dynamic grid layouts, strong headline hierarchy, dense but navigable. Think digital translation of a premium print magazine.

## Color & Typography
Color: Primary #1a1a1a (deep black), secondary #f5f5f0 (warm off-white), accent #b91c1c (editorial red for highlights, breaking tags, and key links), background #ffffff, text #1a1a1a.
Use a complementary color harmony — red accent against neutral foundation.
Typography: "Merriweather" for headlines (authoritative serif, excellent at multiple sizes), "Source Sans 3" for body text and UI elements (clean, readable at small sizes for dense layouts).

## Layout & Structure
Layout density: compact — information-dense with clear visual hierarchy preventing overwhelm.
Header with publication name in large serif, category nav below. Featured story taking 60% width with large image and overlay headline, two secondary stories at 40% width stacked. Article grid below in 3-column layout with image, category tag, title, excerpt, and byline. Sidebar with trending articles (title-only list), newsletter signup, and category links. Section dividers between content areas.
Navigation: full-width primary nav with category links, secondary nav row for sections/topics, search icon, possibly sticky header that collapses to slim bar.
Sections: header, featured-story, article-grid, sidebar, categories, trending, newsletter.

## Interactions
Sticky header that shrinks on scroll, article hover showing excerpt expansion, infinite scroll or load-more for article listings, smooth category filter transitions.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use single-column layouts — magazine design requires multi-column thinking.
- Do NOT use oversized whitespace — density is part of the magazine aesthetic.
- Do NOT use more than 3 font families.
- Do NOT use lorem ipsum — generate realistic article headlines and excerpts.`,
  },
  {
    id: "modern-ecommerce-store",
    name: "Modern Ecommerce Store",
    description: "A conversion-optimized online store with clean product presentation, trust signals, and seamless browsing experience.",
    archetype: requireArchetype("ecommerce"),
    style: "contemporary",
    enrichedDescription: `Create a WordPress block theme for a modern ecommerce store.

## Design Direction
Target audience: online shoppers who value clean presentation, easy navigation, and a trustworthy buying experience.
Visual aesthetic: contemporary and clean — product-first design where nothing competes with the merchandise. Polished without being sterile.

## Color & Typography
Color: Primary #111827 (near-black for text and emphasis), secondary #f9fafb (cool light grey for backgrounds), accent #dc2626 (red for sale badges, CTAs, and urgency), background #ffffff, text #111827.
Use a triadic color harmony — primary dark, clean white, and strategic red accents.
Typography: "Plus Jakarta Sans" for headings and product names (modern, friendly, slightly rounded), "DM Sans" for body text, prices, and UI elements (clean, excellent at small sizes).

## Layout & Structure
Layout density: balanced — clean enough to browse comfortably, structured enough to show adequate inventory.
Hero with seasonal/featured promotion banner. Featured products row showing 4 items with image, name, and price. Category cards section with lifestyle images and category names. Product grid (3-4 columns) with consistent card design: product image, name, price, and quick-add button. Trust badges row (free shipping, returns, secure checkout). Customer testimonials. Newsletter signup with discount incentive. Footer with organized links, payment method icons, and social links.
Navigation: multi-level mega menu with category structure, search bar prominently placed, cart icon with item count badge, account icon. Sticky on scroll.
Sections: hero, featured-products, categories, product-grid, testimonials, trust-badges, newsletter.

## Interactions
Product card hover showing secondary image or quick-view button, add-to-cart button animation (subtle confirmation), smooth filter/sort transitions for product grid, price range and category filter sidebar.

## Constraints
- Do NOT use wp:html blocks or custom HTML blocks.
- Do NOT use Inter or Roboto fonts.
- Do NOT use inconsistent product image aspect ratios — all product images should be uniform.
- Do NOT use more than 2 accent colors — let the products be the visual focus.
- Do NOT use more than 3 font families.
- Do NOT use decorative elements that slow page load — ecommerce demands performance.`,
  },
];
