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
    id: "portfolio",
    name: "Creative Portfolio",
    description:
      "A visually striking layout focusing on imagery and selected works. Minimalist structure emphasizing large typography and projects.",
    keywords: ["portfolio", "creative", "resume", "agency", "freelance", "designer", "photography", "art"],
    sections: ["hero-intro", "selected-works", "about-me", "services", "contact"],
    colorSuggestions: [
      { name: "Monochrome Minimal", primary: "#171717", secondary: "#f5f5f5", accent: "#3b82f6", background: "#ffffff", text: "#171717" },
      { name: "Neon Dark", primary: "#ec4899", secondary: "#18181b", accent: "#8b5cf6", background: "#09090b", text: "#f4f4f5" },
      { name: "Earthy Warm", primary: "#b45309", secondary: "#fef3c7", accent: "#059669", background: "#fffbeb", text: "#451a03" },
    ],
    typographySuggestions: [
      { name: "Elegant Serif", heading: "Playfair Display", body: "Inter" },
      { name: "Modern Sans", heading: "Syne", body: "DM Sans" },
      { name: "Brutalist", heading: "Space Grotesk", body: "Space Mono" },
    ],
    designConventions: {
      layout: "Asymmetrical grids, large featured images, plenty of whitespace",
      imageStyle: "High-resolution photography, stark contrast, full bleed",
      spacing: "Generous whitespace, oversized typography margins",
      navStyle: "Minimalist header, often just a logo and a hamburger menu",
      mood: "Creative, bold, expressive, personal",
    },
  },
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description:
      "A clean retail storefront layout optimized for highlighting products, categories, and driving purchases.",
    keywords: ["shop", "store", "retail", "ecommerce", "products", "boutique", "brand"],
    sections: ["promo-banner", "hero", "featured-categories", "bestsellers", "newsletter", "footer"],
    colorSuggestions: [
      { name: "Clean Retail", primary: "#000000", secondary: "#f9fafb", accent: "#ef4444", background: "#ffffff", text: "#111827" },
      { name: "Soft Boutique", primary: "#db2777", secondary: "#fdf2f8", accent: "#14b8a6", background: "#ffffff", text: "#4c1d95" },
      { name: "Premium Dark", primary: "#fbbf24", secondary: "#2dd4bf", accent: "#f87171", background: "#18181b", text: "#fafafa" },
    ],
    typographySuggestions: [
      { name: "Fashion Editorial", heading: "Cormorant Garamond", body: "Montserrat" },
      { name: "Modern Shop", heading: "Jost", body: "Hind" },
      { name: "Tech Store", heading: "Roboto", body: "Open Sans" },
    ],
    designConventions: {
      layout: "Grid-based product galleries, prominent search and cart placement",
      imageStyle: "Minimalist product photography, lifestyle shots in hero",
      spacing: "Compact product cards, airy category sections",
      navStyle: "Multi-tier navigation with search bar, prominent cart icon",
      mood: "Inviting, trustworthy, transactional, stylish",
    },
  },
  {
    id: "blog",
    name: "Magazine / Blog",
    description:
      "A content-heavy layout with strong typographic hierarchy, featured articles, and organized post grids.",
    keywords: ["blog", "magazine", "news", "articles", "publishing", "editorial", "content"],
    sections: ["featured-post", "recent-articles", "categories", "newsletter", "footer"],
    colorSuggestions: [
      { name: "Classic Print", primary: "#111827", secondary: "#f3f4f6", accent: "#dc2626", background: "#ffffff", text: "#1f2937" },
      { name: "Modern Editorial", primary: "#4338ca", secondary: "#eef2ff", accent: "#f59e0b", background: "#fafafa", text: "#374151" },
      { name: "Night Mode Reading", primary: "#38bdf8", secondary: "#0f172a", accent: "#fb923c", background: "#020617", text: "#e2e8f0" },
    ],
    typographySuggestions: [
      { name: "Traditional", heading: "Merriweather", body: "Source Serif Pro" },
      { name: "Contemporary", heading: "Lora", body: "Nunito" },
      { name: "Tech News", heading: "Fira Sans", body: "Work Sans" },
    ],
    designConventions: {
      layout: "Card-based grids for articles, prominent featured post banners",
      imageStyle: "Editorial photography, varying aspect ratios depending on prominence",
      spacing: "Comfortable reading line height, distinct separation between articles",
      navStyle: "Category-focused top navigation, prominent subscribe button",
      mood: "Informative, intellectual, engaging",
    },
  },
  {
    id: "local-business",
    name: "Local Business",
    description:
      "An informative, trust-building layout perfect for restaurants, services, and physical storefronts.",
    keywords: ["restaurant", "cafe", "services", "plumber", "salon", "local", "business", "booking"],
    sections: ["hero-with-booking", "services", "menu", "testimonials", "location", "footer"],
    colorSuggestions: [
      { name: "Rustic Eatery", primary: "#b45309", secondary: "#fffbeb", accent: "#166534", background: "#ffffff", text: "#451a03" },
      { name: "Clean Services", primary: "#0284c7", secondary: "#f0f9ff", accent: "#f59e0b", background: "#ffffff", text: "#0c4a6e" },
      { name: "Modern Salon", primary: "#be185d", secondary: "#fdf2f8", accent: "#0f766e", background: "#fff1f2", text: "#831843" },
    ],
    typographySuggestions: [
      { name: "Friendly Local", heading: "Quicksand", body: "Open Sans" },
      { name: "Elegant Diner", heading: "Cinzel", body: "Lato" },
      { name: "Trustworthy Pro", heading: "Oswald", body: "Roboto" },
    ],
    designConventions: {
      layout: "Clear info blocks (hours, location) paired with visual service offerings",
      imageStyle: "Warm, authentic photos of the business, team, or food",
      spacing: "Structured sections, clear separators for easy scanning",
      navStyle: "Utility-focused header with 'Call Now' or 'Book' actions prominently displayed",
      mood: "Welcoming, reliable, community-focused",
    },
  },
];

export function getArchetypeById(id: string): ThemeArchetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
