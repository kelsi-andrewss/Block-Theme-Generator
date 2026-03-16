import type { AIProvider } from "@/lib/ai/provider";
import type { EnrichedPrompt } from "@/lib/prompts/enrichment";

export interface PatternSpec {
  slug: string;
  title: string;
  categories: string[];
  description: string;
  keywords: string[];
}

export const ARCHETYPE_PATTERNS: Record<string, PatternSpec[]> = {
  portfolio: [
    {
      slug: "hero-image",
      title: "Hero Image",
      categories: ["featured", "banner"],
      description: "Full-width hero section with a striking image, headline overlay, and subtle call to action.",
      keywords: ["hero", "image", "portfolio", "banner"],
    },
    {
      slug: "gallery-grid",
      title: "Gallery Grid",
      categories: ["gallery"],
      description: "Responsive image grid showcasing portfolio work with consistent aspect ratios.",
      keywords: ["gallery", "grid", "images", "portfolio"],
    },
    {
      slug: "about-section",
      title: "About Section",
      categories: ["about"],
      description: "Split layout with portrait image and biographical text for the creative professional.",
      keywords: ["about", "bio", "portrait"],
    },
    {
      slug: "contact-cta",
      title: "Contact Call to Action",
      categories: ["call-to-action"],
      description: "Bold contact section with headline, short message, and prominent email or form link.",
      keywords: ["contact", "cta", "email"],
    },
    {
      slug: "testimonials",
      title: "Testimonials",
      categories: ["testimonials"],
      description: "Client testimonials displayed as a clean card grid with quote, name, and role.",
      keywords: ["testimonials", "reviews", "clients"],
    },
  ],

  saas: [
    {
      slug: "hero-cta",
      title: "Hero with Call to Action",
      categories: ["featured", "banner"],
      description: "Conversion-focused hero with headline, subtext, and primary/secondary action buttons.",
      keywords: ["hero", "cta", "saas", "landing"],
    },
    {
      slug: "features-grid",
      title: "Features Grid",
      categories: ["features"],
      description: "Three or four column grid highlighting key product features with icons and descriptions.",
      keywords: ["features", "grid", "product"],
    },
    {
      slug: "pricing-table",
      title: "Pricing Table",
      categories: ["pricing"],
      description: "Side-by-side pricing tiers with feature lists, recommended badge, and CTA buttons.",
      keywords: ["pricing", "table", "plans"],
    },
    {
      slug: "testimonials",
      title: "Testimonials",
      categories: ["testimonials"],
      description: "Customer testimonials with avatar, quote, company name, and star rating.",
      keywords: ["testimonials", "reviews", "social-proof"],
    },
    {
      slug: "cta-banner",
      title: "CTA Banner",
      categories: ["call-to-action"],
      description: "Full-width banner with compelling headline and sign-up or demo action button.",
      keywords: ["cta", "banner", "conversion"],
    },
  ],

  blog: [
    {
      slug: "hero-post",
      title: "Hero Post",
      categories: ["featured", "posts"],
      description: "Large featured post card with image, title, excerpt, and author info.",
      keywords: ["hero", "featured", "post", "blog"],
    },
    {
      slug: "recent-posts",
      title: "Recent Posts",
      categories: ["posts", "query"],
      description: "Grid or list of recent blog posts with thumbnails, titles, dates, and excerpts.",
      keywords: ["posts", "recent", "grid", "blog"],
    },
    {
      slug: "newsletter-signup",
      title: "Newsletter Signup",
      categories: ["call-to-action"],
      description: "Email newsletter subscription section with heading, description, and input field.",
      keywords: ["newsletter", "email", "subscribe"],
    },
    {
      slug: "about-author",
      title: "About the Author",
      categories: ["about"],
      description: "Author bio section with avatar, name, short description, and social links.",
      keywords: ["author", "bio", "about"],
    },
    {
      slug: "categories-list",
      title: "Categories List",
      categories: ["navigation"],
      description: "Visual category listing with post counts, arranged as cards or tag pills.",
      keywords: ["categories", "navigation", "taxonomy"],
    },
  ],

  restaurant: [
    {
      slug: "hero-banner",
      title: "Hero Banner",
      categories: ["featured", "banner"],
      description: "Full-width food photography hero with restaurant name, tagline, and reservation button.",
      keywords: ["hero", "restaurant", "food", "banner"],
    },
    {
      slug: "menu-section",
      title: "Menu Section",
      categories: ["text", "columns"],
      description: "Structured menu layout with category headings, item names, descriptions, and prices.",
      keywords: ["menu", "food", "prices", "dining"],
    },
    {
      slug: "about-us",
      title: "About Us",
      categories: ["about"],
      description: "Restaurant story section with side-by-side image and narrative text.",
      keywords: ["about", "story", "restaurant"],
    },
    {
      slug: "gallery",
      title: "Photo Gallery",
      categories: ["gallery"],
      description: "Food and ambiance photo gallery showcasing the dining experience.",
      keywords: ["gallery", "photos", "food", "ambiance"],
    },
    {
      slug: "reservation-cta",
      title: "Reservation Call to Action",
      categories: ["call-to-action"],
      description: "Reservation prompt with hours, phone number, and booking button.",
      keywords: ["reservation", "booking", "cta", "contact"],
    },
  ],

  ecommerce: [
    {
      slug: "hero-product",
      title: "Hero Product",
      categories: ["featured", "banner"],
      description: "Featured product showcase with large image, product name, price, and shop button.",
      keywords: ["hero", "product", "featured", "shop"],
    },
    {
      slug: "featured-products",
      title: "Featured Products",
      categories: ["products", "gallery"],
      description: "Product card grid showing curated items with images, names, prices, and add-to-cart.",
      keywords: ["products", "featured", "grid", "shop"],
    },
    {
      slug: "categories-grid",
      title: "Categories Grid",
      categories: ["navigation", "gallery"],
      description: "Visual category cards with images and labels linking to product collections.",
      keywords: ["categories", "grid", "navigation", "shop"],
    },
    {
      slug: "testimonials",
      title: "Customer Reviews",
      categories: ["testimonials"],
      description: "Customer reviews with star ratings, review text, and buyer name.",
      keywords: ["testimonials", "reviews", "customers"],
    },
    {
      slug: "newsletter",
      title: "Newsletter Signup",
      categories: ["call-to-action"],
      description: "Email signup section offering discounts or updates for subscribers.",
      keywords: ["newsletter", "email", "subscribe", "discount"],
    },
  ],

  agency: [
    {
      slug: "hero-statement",
      title: "Hero Statement",
      categories: ["featured", "banner"],
      description: "Bold typographic hero with agency mission statement and contact CTA.",
      keywords: ["hero", "statement", "agency", "bold"],
    },
    {
      slug: "services-grid",
      title: "Services Grid",
      categories: ["features"],
      description: "Service offerings in a card grid with titles, short descriptions, and icons.",
      keywords: ["services", "grid", "offerings"],
    },
    {
      slug: "case-studies",
      title: "Case Studies",
      categories: ["portfolio", "gallery"],
      description: "Case study cards with project images, client names, and result summaries.",
      keywords: ["case-studies", "portfolio", "projects", "work"],
    },
    {
      slug: "team-section",
      title: "Team Section",
      categories: ["team", "about"],
      description: "Team member grid with headshots, names, roles, and short bios.",
      keywords: ["team", "people", "staff", "about"],
    },
    {
      slug: "contact-cta",
      title: "Contact Call to Action",
      categories: ["call-to-action"],
      description: "Contact section with headline, brief message, and prominent action button.",
      keywords: ["contact", "cta", "agency"],
    },
  ],

  magazine: [
    {
      slug: "hero-featured",
      title: "Featured Article Hero",
      categories: ["featured", "posts"],
      description: "Large featured article with hero image, category tag, headline, and excerpt.",
      keywords: ["hero", "featured", "article", "magazine"],
    },
    {
      slug: "article-grid",
      title: "Article Grid",
      categories: ["posts", "query"],
      description: "Multi-column article grid with thumbnails, headlines, authors, and dates.",
      keywords: ["articles", "grid", "posts", "news"],
    },
    {
      slug: "sidebar-widgets",
      title: "Sidebar Widgets",
      categories: ["sidebar"],
      description: "Sidebar layout with trending articles list, category links, and newsletter form.",
      keywords: ["sidebar", "widgets", "trending", "navigation"],
    },
    {
      slug: "newsletter",
      title: "Newsletter Signup",
      categories: ["call-to-action"],
      description: "Newsletter subscription banner with compelling headline and email input.",
      keywords: ["newsletter", "email", "subscribe"],
    },
    {
      slug: "category-highlights",
      title: "Category Highlights",
      categories: ["navigation", "posts"],
      description: "Sections highlighting top articles from different categories.",
      keywords: ["categories", "highlights", "sections", "editorial"],
    },
  ],

  creative: [
    {
      slug: "hero-fullscreen",
      title: "Fullscreen Hero",
      categories: ["featured", "banner"],
      description: "Full-viewport hero with large typography, background image or color, and scroll indicator.",
      keywords: ["hero", "fullscreen", "creative", "bold"],
    },
    {
      slug: "portfolio-masonry",
      title: "Portfolio Masonry",
      categories: ["gallery", "portfolio"],
      description: "Masonry-style portfolio grid with varied image sizes and hover overlays.",
      keywords: ["portfolio", "masonry", "gallery", "creative"],
    },
    {
      slug: "process-timeline",
      title: "Process Timeline",
      categories: ["features"],
      description: "Vertical timeline showing creative process steps with numbered markers and descriptions.",
      keywords: ["process", "timeline", "steps", "workflow"],
    },
    {
      slug: "contact-section",
      title: "Contact Section",
      categories: ["call-to-action"],
      description: "Minimal contact section with large email link, social icons, and availability status.",
      keywords: ["contact", "email", "social"],
    },
    {
      slug: "about-creative",
      title: "About",
      categories: ["about"],
      description: "Personal story section with expressive typography and image collage.",
      keywords: ["about", "story", "creative", "bio"],
    },
  ],
};

const PATTERN_SYSTEM_PROMPT = `Generate WordPress block markup for a pattern. Use ONLY core WordPress blocks. NEVER use wp:html. Return ONLY the block markup, no PHP wrapper.

Rules:
- Use only core WordPress blocks (wp:group, wp:columns, wp:column, wp:heading, wp:paragraph, wp:image, wp:buttons, wp:button, wp:cover, wp:separator, wp:spacer, wp:list, wp:quote, wp:media-text, etc.)
- Never use wp:html or any custom HTML blocks
- Use theme color slugs (primary, secondary, accent, base, contrast) in block attributes when setting colors
- Use theme font family slugs in typography attributes when available
- Generate realistic, contextual content — no lorem ipsum
- Return raw block markup only, no surrounding PHP or HTML document structure`;

function buildPatternPrompt(
  spec: PatternSpec,
  enrichedPrompt: EnrichedPrompt,
  themeJson: Record<string, unknown>
): string {
  const colors = extractThemeColors(themeJson);
  const fonts = extractThemeFonts(themeJson);

  const lines: string[] = [];
  lines.push(`Generate the block markup for a "${spec.title}" pattern.`);
  lines.push("");
  lines.push(`Description: ${spec.description}`);
  lines.push(`Site context: ${enrichedPrompt.enrichedDescription}`);
  lines.push("");

  if (colors) {
    lines.push(`Theme colors: ${colors}`);
  }
  if (fonts) {
    lines.push(`Theme fonts: ${fonts}`);
  }

  lines.push("");
  lines.push("Return ONLY the WordPress block markup. No PHP, no explanation.");

  return lines.join("\n");
}

function extractThemeColors(themeJson: Record<string, unknown>): string | null {
  try {
    const settings = themeJson.settings as Record<string, unknown> | undefined;
    if (!settings) return null;
    const color = settings.color as Record<string, unknown> | undefined;
    if (!color) return null;
    const palette = color.palette as Array<{ slug: string; color: string; name: string }> | undefined;
    if (!palette || palette.length === 0) return null;
    return palette.map((p) => `${p.name} (${p.slug}): ${p.color}`).join(", ");
  } catch {
    return null;
  }
}

function extractThemeFonts(themeJson: Record<string, unknown>): string | null {
  try {
    const settings = themeJson.settings as Record<string, unknown> | undefined;
    if (!settings) return null;
    const typography = settings.typography as Record<string, unknown> | undefined;
    if (!typography) return null;
    const fontFamilies = typography.fontFamilies as Array<{ slug: string; name: string; fontFamily: string }> | undefined;
    if (!fontFamilies || fontFamilies.length === 0) return null;
    return fontFamilies.map((f) => `${f.name} (${f.slug}): ${f.fontFamily}`).join(", ");
  } catch {
    return null;
  }
}

export function formatPatternPHP(
  slug: string,
  spec: PatternSpec,
  themeSlug: string,
  blockMarkup: string
): string {
  return `<?php
/**
 * Title: ${spec.title}
 * Slug: ${themeSlug}/${slug}
 * Categories: ${spec.categories.join(", ")}
 * Keywords: ${spec.keywords.join(", ")}
 * Description: ${spec.description}
 */
?>
${blockMarkup}
`;
}

export async function generatePatterns(
  enrichedPrompt: EnrichedPrompt,
  themeJson: Record<string, unknown>,
  provider: AIProvider
): Promise<Map<string, string>> {
  const archetypeId = enrichedPrompt.archetype.id;
  const specs = ARCHETYPE_PATTERNS[archetypeId];
  if (!specs) {
    return new Map();
  }

  const themeSlug = extractThemeSlug(themeJson);
  const results = new Map<string, string>();

  const generations = specs.map(async (spec) => {
    const prompt = buildPatternPrompt(spec, enrichedPrompt, themeJson);
    const blockMarkup = await provider.generateText(prompt, PATTERN_SYSTEM_PROMPT, {
      temperature: 0.8,
    });
    const php = formatPatternPHP(spec.slug, spec, themeSlug, blockMarkup.trim());
    return { path: `patterns/${spec.slug}.php`, content: php };
  });

  const settled = await Promise.all(generations);
  for (const { path, content } of settled) {
    results.set(path, content);
  }

  return results;
}

function extractThemeSlug(themeJson: Record<string, unknown>): string {
  const name = themeJson.name as string | undefined;
  if (name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  return "theme";
}
