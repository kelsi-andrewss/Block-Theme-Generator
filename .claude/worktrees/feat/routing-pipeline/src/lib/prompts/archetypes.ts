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
];

export function getArchetypeById(id: string): ThemeArchetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
