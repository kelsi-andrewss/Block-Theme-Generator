import { ARCHETYPES, type ThemeArchetype } from "./archetypes";

export interface Gap {
  specified: boolean;
  suggestion: string;
}

export interface GapAnalysis {
  audience: Gap;
  aesthetic: Gap;
  palette: Gap;
  typography: Gap;
  sections: Gap;
  interactions: Gap;
  reference: Gap;
}

export interface FlavorSeed {
  colorHarmony: "analogous" | "complementary" | "triadic" | "split-complementary";
  typoPairingStyle: "serif-sans" | "display-mono" | "geometric-humanist";
  layoutDensity: "airy" | "balanced" | "compact";
}

export interface EnrichedPrompt {
  original: string;
  archetype: ThemeArchetype;
  gaps: GapAnalysis;
  enrichedDescription: string;
  flavorSeed: FlavorSeed;
  negativeConstraints: string[];
}

const COLOR_HARMONIES: FlavorSeed["colorHarmony"][] = [
  "analogous",
  "complementary",
  "triadic",
  "split-complementary",
];

const TYPO_PAIRING_STYLES: FlavorSeed["typoPairingStyle"][] = [
  "serif-sans",
  "display-mono",
  "geometric-humanist",
];

const LAYOUT_DENSITIES: FlavorSeed["layoutDensity"][] = [
  "airy",
  "balanced",
  "compact",
];

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function detectArchetype(input: string): ThemeArchetype {
  const lower = input.toLowerCase();
  const tokens = lower.split(/\s+/);

  let bestMatch: ThemeArchetype = ARCHETYPES[0];
  let bestScore = 0;

  for (const archetype of ARCHETYPES) {
    let score = 0;
    for (const keyword of archetype.keywords) {
      if (tokens.includes(keyword)) {
        score += 2;
      } else if (lower.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = archetype;
    }
  }

  return bestMatch;
}

const AUDIENCE_PATTERNS = [
  /\b(for|targeting|aimed at|designed for|audience)\b.*\b(professionals?|developers?|designers?|photographers?|businesses?|startups?|freelancers?|students?|artists?|writers?|foodies?|shoppers?|readers?|clients?|customers?|users?|everyone)\b/i,
  /\b(professionals?|developers?|designers?|photographers?|businesses?|startups?|freelancers?|students?|artists?|writers?|foodies?|shoppers?|readers?|clients?)\b/i,
];

const AESTHETIC_KEYWORDS = [
  "minimal", "minimalist", "bold", "playful", "elegant", "modern", "vintage",
  "retro", "futuristic", "rustic", "luxurious", "clean", "brutalist",
  "neobrutalist", "glassmorphism", "editorial", "cinematic", "organic",
  "industrial", "art deco", "contemporary", "classic", "whimsical", "dark",
  "light", "warm", "cool", "vibrant", "muted", "earthy", "pastel", "neon",
];

const COLOR_PATTERNS = [
  /#[0-9a-f]{3,8}/i,
  /\b(red|blue|green|yellow|orange|purple|pink|black|white|gray|grey|teal|cyan|magenta|navy|coral|turquoise|maroon|olive|gold|silver|indigo|violet|beige|cream|ivory|charcoal|slate|sage|burgundy|rust|amber|emerald|sapphire)\b/i,
  /\b(dark\s*mode|light\s*mode|dark\s*theme|light\s*theme)\b/i,
  /\b(monochrome|monochromatic|colorful|pastel|neon|muted|vibrant|earthy)\b/i,
];

const TYPOGRAPHY_PATTERNS = [
  /\b(serif|sans[- ]?serif|monospace|slab|display|handwritten|script|condensed)\b/i,
  /\b(Playfair|Montserrat|Roboto|Open Sans|Lato|Poppins|Raleway|Inter|Oswald|Merriweather|DM Sans|Space Grotesk|Bebas|Cormorant|Lora|Bitter|Source|Fira|Nunito|Outfit|Work Sans|Karla|Hind|IBM Plex)\b/i,
  /\b(bold\s*type|large\s*type|big\s*headlines?|thin\s*font|heavy\s*font)\b/i,
];

const SECTION_PATTERNS = [
  /\b(hero|header|nav|footer|sidebar|about|contact|gallery|portfolio|blog|shop|cart|pricing|features?|testimonials?|team|faq|newsletter|cta|call[- ]to[- ]action|menu|reservation|services?|case\s*stud)/i,
];

const INTERACTION_PATTERNS = [
  /\b(animation|animated|hover|scroll|parallax|transition|motion|interactive|slider|carousel|accordion|modal|popup|lightbox|infinite\s*scroll|lazy\s*load|smooth\s*scroll|drag|swipe)\b/i,
];

const REFERENCE_PATTERNS = [
  /\b(like|similar to|inspired by|reminds? me of|looks? like|in the style of|vibe of)\b/i,
];

function checkPatterns(input: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(input));
}

const AESTHETIC_SUGGESTIONS: Record<string, string> = {
  portfolio: "editorial and refined, with a focus on letting visuals breathe",
  saas: "clean and modern with a trustworthy, conversion-optimized feel",
  blog: "calm and readable with a warm, inviting atmosphere",
  restaurant: "warm, appetizing, and subtly luxurious",
  ecommerce: "clean and browsable with trust-building visual cues",
  agency: "bold and confident with strong typographic hierarchy",
  magazine: "authoritative and information-dense but well-organized",
  creative: "experimental and visually bold with unexpected layout choices",
};

const AUDIENCE_SUGGESTIONS: Record<string, string> = {
  portfolio: "creative professionals and potential clients seeking visual talent",
  saas: "decision-makers evaluating software solutions",
  blog: "engaged readers seeking in-depth content",
  restaurant: "local diners and food enthusiasts looking for their next meal",
  ecommerce: "online shoppers looking for quality products with easy checkout",
  agency: "business owners and marketing directors seeking professional services",
  magazine: "news consumers and subject-matter enthusiasts",
  creative: "design-savvy visitors and art world professionals",
};

const INTERACTION_SUGGESTIONS: Record<string, string> = {
  portfolio: "subtle hover reveals on gallery items, smooth scroll between sections, lightbox for full-size images",
  saas: "scroll-triggered feature reveals, interactive pricing toggle (monthly/annual), smooth anchor navigation",
  blog: "infinite scroll or paginated post loading, reading progress indicator, smooth category filtering",
  restaurant: "menu section tabs or accordion, interactive map embed, reservation form with date picker",
  ecommerce: "product quick-view on hover, add-to-cart animation, filter/sort transitions",
  agency: "case study hover previews, team member cards with flip animation, scroll-triggered stats counters",
  magazine: "sticky header that shrinks on scroll, infinite article loading, sidebar that follows scroll",
  creative: "parallax scroll effects, cursor-following elements, page transition animations",
};

export function analyzeGaps(input: string, archetype: ThemeArchetype): GapAnalysis {
  const hasAudience = AUDIENCE_PATTERNS.some((p) => p.test(input));
  const hasAesthetic = AESTHETIC_KEYWORDS.some((kw) =>
    input.toLowerCase().includes(kw)
  );
  const hasPalette = checkPatterns(input, COLOR_PATTERNS);
  const hasTypography = checkPatterns(input, TYPOGRAPHY_PATTERNS);
  const hasSections = checkPatterns(input, SECTION_PATTERNS);
  const hasInteractions = checkPatterns(input, INTERACTION_PATTERNS);
  const hasReference = checkPatterns(input, REFERENCE_PATTERNS);

  const randomPalette = pickRandom(archetype.colorSuggestions);
  const randomFonts = pickRandom(archetype.typographySuggestions);

  return {
    audience: {
      specified: hasAudience,
      suggestion: hasAudience
        ? ""
        : AUDIENCE_SUGGESTIONS[archetype.id] ?? "general web visitors",
    },
    aesthetic: {
      specified: hasAesthetic,
      suggestion: hasAesthetic
        ? ""
        : AESTHETIC_SUGGESTIONS[archetype.id] ?? "modern and clean",
    },
    palette: {
      specified: hasPalette,
      suggestion: hasPalette
        ? ""
        : `Use the "${randomPalette.name}" palette: primary ${randomPalette.primary}, secondary ${randomPalette.secondary}, accent ${randomPalette.accent}, background ${randomPalette.background}, text ${randomPalette.text}`,
    },
    typography: {
      specified: hasTypography,
      suggestion: hasTypography
        ? ""
        : `${randomFonts.name} pairing: "${randomFonts.heading}" for headings, "${randomFonts.body}" for body text`,
    },
    sections: {
      specified: hasSections,
      suggestion: hasSections
        ? ""
        : `Include these sections: ${archetype.sections.join(", ")}`,
    },
    interactions: {
      specified: hasInteractions,
      suggestion: hasInteractions
        ? ""
        : INTERACTION_SUGGESTIONS[archetype.id] ?? "subtle hover effects and smooth scroll",
    },
    reference: {
      specified: hasReference,
      suggestion: "",
    },
  };
}

export function generateFlavorSeed(): FlavorSeed {
  return {
    colorHarmony: pickRandom(COLOR_HARMONIES),
    typoPairingStyle: pickRandom(TYPO_PAIRING_STYLES),
    layoutDensity: pickRandom(LAYOUT_DENSITIES),
  };
}

const NEGATIVE_CONSTRAINTS = [
  "Generate static JSX only — no React hooks, no event handlers, no dynamic logic. Use WP-specific components for dynamic blocks.",
  "Do NOT use Inter or Roboto as font choices — pick more distinctive typefaces.",
  "Do NOT use generic card grids with placeholder icons — every section should have a clear purpose.",
  "Do NOT use lorem ipsum or placeholder text — generate real, contextual content.",
  "Do NOT use more than 3 font families total.",
  "Do NOT use pure black (#000000) on pure white (#ffffff) for body text — use softer contrast ratios.",
];

function composeEnrichedDescription(
  original: string,
  archetype: ThemeArchetype,
  gaps: GapAnalysis,
  seed: FlavorSeed
): string {
  const parts: string[] = [];

  parts.push(`Create a WordPress block theme for: ${original}`);
  parts.push("");
  parts.push(`Site type: ${archetype.name}. ${archetype.description}`);

  parts.push("");
  parts.push("## Design Direction");
  if (!gaps.audience.specified && gaps.audience.suggestion) {
    parts.push(`Target audience: ${gaps.audience.suggestion}.`);
  }
  if (!gaps.aesthetic.specified && gaps.aesthetic.suggestion) {
    parts.push(`Visual aesthetic: ${gaps.aesthetic.suggestion}.`);
  }

  parts.push("");
  parts.push("## Color & Typography");
  if (!gaps.palette.specified && gaps.palette.suggestion) {
    parts.push(`Color: ${gaps.palette.suggestion}.`);
  }
  parts.push(`Use a ${seed.colorHarmony} color harmony approach.`);
  if (!gaps.typography.specified && gaps.typography.suggestion) {
    parts.push(`Typography: ${gaps.typography.suggestion}.`);
  }
  parts.push(`Typography pairing style: ${seed.typoPairingStyle}.`);

  parts.push("");
  parts.push("## Layout & Structure");
  parts.push(`Layout density: ${seed.layoutDensity}.`);
  parts.push(`Layout approach: ${archetype.designConventions.layout}.`);
  parts.push(`Image treatment: ${archetype.designConventions.imageStyle}.`);
  parts.push(`Spacing: ${archetype.designConventions.spacing}.`);
  parts.push(`Navigation: ${archetype.designConventions.navStyle}.`);
  if (!gaps.sections.specified && gaps.sections.suggestion) {
    parts.push(`${gaps.sections.suggestion}.`);
  }

  parts.push("");
  parts.push("## Interactions");
  if (!gaps.interactions.specified && gaps.interactions.suggestion) {
    parts.push(gaps.interactions.suggestion + ".");
  }

  parts.push("");
  parts.push("## Constraints");
  for (const constraint of NEGATIVE_CONSTRAINTS) {
    parts.push(`- ${constraint}`);
  }

  return parts.join("\n");
}

export function enrichPrompt(userInput: string): EnrichedPrompt {
  const trimmed = userInput.trim();
  const archetype = detectArchetype(trimmed);
  const gaps = analyzeGaps(trimmed, archetype);
  const flavorSeed = generateFlavorSeed();
  const enrichedDescription = composeEnrichedDescription(
    trimmed,
    archetype,
    gaps,
    flavorSeed
  );

  return {
    original: trimmed,
    archetype,
    gaps,
    enrichedDescription,
    flavorSeed,
    negativeConstraints: NEGATIVE_CONSTRAINTS,
  };
}
