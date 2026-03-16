export interface ThemeArchetype {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  sections: string[];
  colorSuggestions: ColorPalette[];
  typographySuggestions: FontPairing[];
  designConventions: DesignConventions;
}

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface FontPairing {
  name: string;
  heading: string;
  body: string;
}

export interface DesignConventions {
  layout: string;
  imageStyle: string;
  spacing: string;
  navStyle: string;
  mood: string;
}

export const ARCHETYPES: ThemeArchetype[] = [
  {
    id: "portfolio",
    name: "Portfolio",
    description:
      "Image-first layout with masonry gallery, minimal navigation, and serif headlines. Designed to showcase visual work with generous whitespace.",
    keywords: ["photo", "portfolio", "gallery", "artist", "creative", "photographer", "showcase"],
    sections: ["hero", "gallery", "about", "contact"],
    colorSuggestions: [
      { name: "Monochrome", primary: "#1a1a1a", secondary: "#f5f5f0", accent: "#c8a97e", background: "#ffffff", text: "#1a1a1a" },
      { name: "Dark Studio", primary: "#0d0d0d", secondary: "#1a1a1a", accent: "#e8d5b7", background: "#0d0d0d", text: "#f0ede8" },
      { name: "Warm Cream", primary: "#2c2c2c", secondary: "#f7f3ed", accent: "#b8860b", background: "#faf8f5", text: "#2c2c2c" },
      { name: "Cool Slate", primary: "#334155", secondary: "#e2e8f0", accent: "#6366f1", background: "#f8fafc", text: "#0f172a" },
    ],
    typographySuggestions: [
      { name: "Classic Editorial", heading: "Playfair Display", body: "Source Sans 3" },
      { name: "Modern Contrast", heading: "DM Serif Display", body: "DM Sans" },
      { name: "Refined Minimal", heading: "Cormorant Garamond", body: "Montserrat" },
    ],
    designConventions: {
      layout: "Masonry or grid gallery with generous whitespace between items",
      imageStyle: "Full-bleed hero images, high-contrast photography, aspect-ratio preserved thumbnails",
      spacing: "Generous padding, breathing room around visual elements",
      navStyle: "Minimal top bar or hamburger menu, no sidebar",
      mood: "Elegant, understated, lets the work speak",
    },
  },
  {
    id: "saas",
    name: "SaaS Landing Page",
    description:
      "Structured hero-features-pricing-testimonials-CTA flow optimized for conversion. Clean lines with strategic use of color for CTAs.",
    keywords: ["saas", "startup", "app", "pricing", "software", "platform", "landing", "product"],
    sections: ["hero", "features", "pricing", "testimonials", "cta", "faq"],
    colorSuggestions: [
      { name: "Tech Blue", primary: "#2563eb", secondary: "#eff6ff", accent: "#f59e0b", background: "#ffffff", text: "#1e293b" },
      { name: "Startup Violet", primary: "#7c3aed", secondary: "#f5f3ff", accent: "#10b981", background: "#ffffff", text: "#1e1b4b" },
      { name: "Enterprise Slate", primary: "#0f172a", secondary: "#f1f5f9", accent: "#3b82f6", background: "#ffffff", text: "#334155" },
      { name: "Warm SaaS", primary: "#ea580c", secondary: "#fff7ed", accent: "#0d9488", background: "#fffbf5", text: "#1c1917" },
    ],
    typographySuggestions: [
      { name: "Clean Tech", heading: "Inter", body: "Inter" },
      { name: "Bold Product", heading: "Plus Jakarta Sans", body: "DM Sans" },
      { name: "Friendly SaaS", heading: "Outfit", body: "Nunito Sans" },
    ],
    designConventions: {
      layout: "Single-page scroll with clear section breaks and visual hierarchy",
      imageStyle: "Product mockups, abstract gradients, isometric illustrations",
      spacing: "Consistent vertical rhythm, 80-120px section padding",
      navStyle: "Sticky top nav with CTA button, clean horizontal links",
      mood: "Professional, trustworthy, conversion-focused",
    },
  },
  {
    id: "blog",
    name: "Blog / Journal",
    description:
      "Content-focused layout optimized for readability with category navigation, post listings, and comfortable reading width.",
    keywords: ["blog", "journal", "magazine", "articles", "editorial", "writing", "posts"],
    sections: ["header", "featured-post", "post-grid", "categories", "about", "newsletter"],
    colorSuggestions: [
      { name: "Classic Paper", primary: "#1a1a2e", secondary: "#f0efe9", accent: "#e07a5f", background: "#fafaf7", text: "#2d2d2d" },
      { name: "Night Reader", primary: "#e4e4e7", secondary: "#18181b", accent: "#a78bfa", background: "#09090b", text: "#e4e4e7" },
      { name: "Soft Sage", primary: "#2d3b2d", secondary: "#f1f5ed", accent: "#d97706", background: "#fafdf7", text: "#1a2e1a" },
    ],
    typographySuggestions: [
      { name: "Long-form Reading", heading: "Lora", body: "Source Serif 4" },
      { name: "Modern Editorial", heading: "Fraunces", body: "Work Sans" },
      { name: "Clean Blog", heading: "Bitter", body: "Open Sans" },
    ],
    designConventions: {
      layout: "Content column max-width 680px, optional sidebar, post cards for listings",
      imageStyle: "Featured images with overlay text, inline post images",
      spacing: "Reading-optimized line height (1.6-1.8), generous paragraph spacing",
      navStyle: "Top nav with categories, optional sidebar with archives/tags",
      mood: "Calm, focused, inviting to read",
    },
  },
  {
    id: "restaurant",
    name: "Restaurant / Cafe",
    description:
      "Hero food photography, menu section with structured layout, reservation CTA, and warm inviting tones throughout.",
    keywords: ["restaurant", "cafe", "food", "menu", "dining", "bistro", "bakery", "bar"],
    sections: ["hero", "about", "menu", "gallery", "reservations", "location", "contact"],
    colorSuggestions: [
      { name: "Warm Bistro", primary: "#3c1518", secondary: "#f9f2ec", accent: "#c8553d", background: "#fdfaf6", text: "#2c1810" },
      { name: "Olive Garden", primary: "#3d405b", secondary: "#f4f1de", accent: "#81b29a", background: "#fefdf8", text: "#2d2d2d" },
      { name: "Dark Dine", primary: "#f5f0e8", secondary: "#1a1a1a", accent: "#c9a96e", background: "#0f0f0f", text: "#f5f0e8" },
      { name: "Fresh Market", primary: "#264653", secondary: "#e9f5f0", accent: "#e76f51", background: "#ffffff", text: "#264653" },
    ],
    typographySuggestions: [
      { name: "Rustic Charm", heading: "Playfair Display", body: "Lato" },
      { name: "Modern Eatery", heading: "Josefin Sans", body: "Nunito" },
      { name: "Classic Fine Dining", heading: "Cormorant", body: "Proza Libre" },
    ],
    designConventions: {
      layout: "Full-width hero, two-column menu with prices, map section",
      imageStyle: "High-quality food photography, warm color grading, full-bleed backgrounds",
      spacing: "Luxurious spacing, wide margins around menu items",
      navStyle: "Simple top nav, often transparent over hero image",
      mood: "Warm, appetizing, inviting",
    },
  },
  {
    id: "ecommerce",
    name: "Ecommerce Store",
    description:
      "Product grid layout with cart integration, trust badges, category filters, and conversion-optimized product cards.",
    keywords: ["shop", "store", "ecommerce", "products", "buy", "retail", "merch", "marketplace"],
    sections: ["hero", "featured-products", "categories", "product-grid", "testimonials", "trust-badges", "newsletter"],
    colorSuggestions: [
      { name: "Clean Commerce", primary: "#111827", secondary: "#f9fafb", accent: "#dc2626", background: "#ffffff", text: "#111827" },
      { name: "Luxury Retail", primary: "#1c1917", secondary: "#fafaf9", accent: "#a16207", background: "#fffbeb", text: "#1c1917" },
      { name: "Fresh Store", primary: "#065f46", secondary: "#ecfdf5", accent: "#7c3aed", background: "#ffffff", text: "#064e3b" },
      { name: "Bold Fashion", primary: "#0a0a0a", secondary: "#fafafa", accent: "#e11d48", background: "#ffffff", text: "#171717" },
    ],
    typographySuggestions: [
      { name: "Modern Shop", heading: "Plus Jakarta Sans", body: "DM Sans" },
      { name: "Fashion Forward", heading: "Montserrat", body: "Hind" },
      { name: "Boutique Feel", heading: "Tenor Sans", body: "Karla" },
    ],
    designConventions: {
      layout: "Product grid (3-4 columns), sidebar filters, prominent cart icon",
      imageStyle: "Clean product photography on white/neutral backgrounds, consistent aspect ratios",
      spacing: "Tight grid spacing for products, generous padding for content sections",
      navStyle: "Multi-level navigation with categories, search bar, cart icon",
      mood: "Clean, trustworthy, easy to browse",
    },
  },
  {
    id: "agency",
    name: "Agency / Consulting",
    description:
      "Case-study-driven layout with services overview, team section, and bold statement typography. Designed to convey expertise.",
    keywords: ["agency", "consulting", "studio", "services", "firm", "digital", "consultancy"],
    sections: ["hero", "services", "case-studies", "about", "team", "testimonials", "contact"],
    colorSuggestions: [
      { name: "Corporate Clean", primary: "#0f172a", secondary: "#f8fafc", accent: "#2563eb", background: "#ffffff", text: "#1e293b" },
      { name: "Creative Agency", primary: "#18181b", secondary: "#fafafa", accent: "#f43f5e", background: "#ffffff", text: "#27272a" },
      { name: "Warm Consultancy", primary: "#292524", secondary: "#fafaf9", accent: "#d97706", background: "#fffbeb", text: "#1c1917" },
    ],
    typographySuggestions: [
      { name: "Bold Authority", heading: "Space Grotesk", body: "DM Sans" },
      { name: "Refined Professional", heading: "Libre Baskerville", body: "Source Sans 3" },
      { name: "Modern Studio", heading: "Sora", body: "Inter" },
    ],
    designConventions: {
      layout: "Bold hero statement, services grid, case study cards with large imagery",
      imageStyle: "High-impact project screenshots, team headshots, abstract brand graphics",
      spacing: "Spacious sections with clear visual hierarchy, large type sizes",
      navStyle: "Clean horizontal nav, prominent contact CTA",
      mood: "Confident, professional, results-driven",
    },
  },
  {
    id: "magazine",
    name: "Magazine / News",
    description:
      "Multi-column layout with featured articles, sidebar content, and dense but organized information architecture.",
    keywords: ["news", "magazine", "publication", "media", "newspaper", "press", "editorial"],
    sections: ["header", "featured-story", "article-grid", "sidebar", "categories", "trending", "newsletter"],
    colorSuggestions: [
      { name: "Classic Broadsheet", primary: "#1a1a1a", secondary: "#f5f5f0", accent: "#b91c1c", background: "#ffffff", text: "#1a1a1a" },
      { name: "Modern Publication", primary: "#0c0a09", secondary: "#fafaf9", accent: "#0ea5e9", background: "#ffffff", text: "#292524" },
      { name: "Dark Edition", primary: "#e7e5e4", secondary: "#1c1917", accent: "#f97316", background: "#0c0a09", text: "#e7e5e4" },
    ],
    typographySuggestions: [
      { name: "News Standard", heading: "Merriweather", body: "Source Sans 3" },
      { name: "Contemporary Press", heading: "Newsreader", body: "Inter" },
      { name: "Bold Headlines", heading: "Archivo Black", body: "Roboto Flex" },
    ],
    designConventions: {
      layout: "Multi-column grid, featured article with large hero, sidebar with trending/popular",
      imageStyle: "Editorial photography, strong crops, text overlays on featured images",
      spacing: "Dense but organized, tight column gaps, clear section dividers",
      navStyle: "Full-width nav bar with category links, search, possibly secondary nav row",
      mood: "Authoritative, information-rich, current",
    },
  },
  {
    id: "creative",
    name: "Creative / Experimental",
    description:
      "Full-screen visuals with experimental layout, bold typography, and portfolio-like presentation for design-forward brands.",
    keywords: ["design", "creative", "artist", "gallery", "experimental", "visual", "motion"],
    sections: ["hero", "work", "about", "process", "contact"],
    colorSuggestions: [
      { name: "Stark Contrast", primary: "#000000", secondary: "#ffffff", accent: "#ff3366", background: "#000000", text: "#ffffff" },
      { name: "Neon Dark", primary: "#0a0a0a", secondary: "#1a1a2e", accent: "#00ff88", background: "#0a0a0a", text: "#e0e0e0" },
      { name: "Pastel Surreal", primary: "#2d2b55", secondary: "#ffeeff", accent: "#ff6ac1", background: "#faf5ff", text: "#2d2b55" },
      { name: "Monochrome Bold", primary: "#111111", secondary: "#eeeeee", accent: "#ffcc00", background: "#111111", text: "#f5f5f5" },
    ],
    typographySuggestions: [
      { name: "Display Impact", heading: "Bebas Neue", body: "Space Mono" },
      { name: "Experimental Duo", heading: "Climate Crisis", body: "IBM Plex Sans" },
      { name: "Art Deco Revival", heading: "Poiret One", body: "Questrial" },
    ],
    designConventions: {
      layout: "Full-screen sections, asymmetric grids, scroll-driven reveals",
      imageStyle: "Full-bleed visuals, art-directed photography, mixed media",
      spacing: "Dramatic — either very tight or very generous, used for contrast",
      navStyle: "Hidden/hamburger menu or minimal fixed nav, navigation as part of the experience",
      mood: "Bold, provocative, boundary-pushing",
    },
  },
];

export function getArchetypeById(id: string): ThemeArchetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
