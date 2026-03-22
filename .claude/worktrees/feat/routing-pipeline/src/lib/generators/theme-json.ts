import type { AIProvider } from "../ai/provider";
import type { EnrichedPrompt } from "../prompts/enrichment";
import {
  ThemeJsonSchema,
  DarkModeSchema,
  type ThemeJson,
  type DarkModeStyles,
} from "../schemas/theme-json";

export interface ThemeJsonResult {
  themeJson: ThemeJson;
  darkMode: DarkModeStyles;
}

const THEME_JSON_SYSTEM_PROMPT = `You are a WordPress theme.json generator. Generate a WordPress theme.json v3. Use version: 3. Include settings.color.palette with at least 5 colors (primary, secondary, accent, base, contrast at minimum). Include settings.typography.fontFamilies with at least 2 font families (one for headings, one for body). Include settings.typography.fontSizes with at least 5 sizes (small, medium, large, x-large, xx-large). Include settings.layout with contentSize and wideSize. Include settings.spacing.spacingSizes with at least 5 sizes. Include templateParts for header and footer. Set settings.typography.defaultFontSizes: false and settings.spacing.defaultSpacingSizes: false and settings.appearanceTools: true. Return valid JSON only. No markdown fences, no explanation.`;

const DARK_MODE_SYSTEM_PROMPT = `You are a WordPress theme style variation generator. Given a light-mode theme.json, generate a dark mode style variation. The output must have version: 3, a title of "Dark", settings.color.palette with adjusted colors for dark mode, and styles.color with inverted background (dark) and text (light) colors. Maintain the same color slugs from the original palette but shift values for dark backgrounds. Return valid JSON only. No markdown fences, no explanation.`;

export function buildThemeJsonPrompt(enrichedPrompt: EnrichedPrompt): string {
  const parts: string[] = [];

  parts.push(enrichedPrompt.enrichedDescription);

  parts.push("");
  parts.push("## Archetype Context");
  parts.push(`This is a ${enrichedPrompt.archetype.name} theme.`);
  parts.push(enrichedPrompt.archetype.description);

  parts.push("");
  parts.push("## Design Conventions");
  const conv = enrichedPrompt.archetype.designConventions;
  parts.push(`Layout: ${conv.layout}`);
  parts.push(`Image style: ${conv.imageStyle}`);
  parts.push(`Spacing: ${conv.spacing}`);
  parts.push(`Navigation: ${conv.navStyle}`);
  parts.push(`Mood: ${conv.mood}`);

  parts.push("");
  parts.push("## Flavor Parameters");
  parts.push(`Color harmony: ${enrichedPrompt.flavorSeed.colorHarmony}`);
  parts.push(`Typography pairing: ${enrichedPrompt.flavorSeed.typoPairingStyle}`);
  parts.push(`Layout density: ${enrichedPrompt.flavorSeed.layoutDensity}`);

  if (!enrichedPrompt.gaps.palette.specified && enrichedPrompt.gaps.palette.suggestion) {
    parts.push("");
    parts.push("## Suggested Palette");
    parts.push(enrichedPrompt.gaps.palette.suggestion);
  }

  if (!enrichedPrompt.gaps.typography.specified && enrichedPrompt.gaps.typography.suggestion) {
    parts.push("");
    parts.push("## Suggested Typography");
    parts.push(enrichedPrompt.gaps.typography.suggestion);
  }

  if (enrichedPrompt.negativeConstraints.length > 0) {
    parts.push("");
    parts.push("## Constraints");
    for (const c of enrichedPrompt.negativeConstraints) {
      parts.push(`- ${c}`);
    }
  }

  parts.push("");
  parts.push("Generate a complete theme.json v3 for this theme. Use Google Fonts for fontFamilies. Do NOT include fontFace entries with src arrays — fonts are loaded via Google Fonts CDN in functions.php. All color values must be valid hex codes. Sizes should use clamp() or rem units where appropriate.");

  return parts.join("\n");
}

export function buildDarkModePrompt(themeJson: ThemeJson): string {
  const parts: string[] = [];

  parts.push("Here is the light-mode theme.json to create a dark mode variation for:");
  parts.push("");
  parts.push(JSON.stringify(themeJson, null, 2));
  parts.push("");
  parts.push("Generate a dark mode style variation (styles/dark.json) that:");
  parts.push("- Inverts the background to a dark color and text to a light color");
  parts.push("- Adjusts the palette colors to work well on dark backgrounds");
  parts.push("- Keeps the same color slugs as the original palette");
  parts.push("- Maintains brand identity while ensuring readability on dark backgrounds");
  parts.push("- Sets title to \"Dark\"");
  parts.push("- Uses version: 3");

  return parts.join("\n");
}

export async function generateLightThemeJson(
  enrichedPrompt: EnrichedPrompt,
  provider: AIProvider
): Promise<ThemeJson> {
  const themePrompt = buildThemeJsonPrompt(enrichedPrompt);
  return provider.generateJSON(
    themePrompt,
    THEME_JSON_SYSTEM_PROMPT,
    ThemeJsonSchema,
    { temperature: 0.7 }
  );
}

export async function generateDarkMode(
  themeJson: ThemeJson,
  provider: AIProvider
): Promise<DarkModeStyles> {
  const darkPrompt = buildDarkModePrompt(themeJson);
  return provider.generateJSON(
    darkPrompt,
    DARK_MODE_SYSTEM_PROMPT,
    DarkModeSchema,
    { temperature: 0.5 }
  );
}

export async function generateThemeJson(
  enrichedPrompt: EnrichedPrompt,
  provider: AIProvider
): Promise<ThemeJsonResult> {
  const themeJson = await generateLightThemeJson(enrichedPrompt, provider);
  const darkMode = await generateDarkMode(themeJson, provider);
  return { themeJson, darkMode };
}
