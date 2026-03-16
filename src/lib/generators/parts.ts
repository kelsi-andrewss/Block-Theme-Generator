import type { AIProvider } from "../ai/provider";
import type { EnrichedPrompt } from "../prompts/enrichment";
import { TEMPLATE_SYSTEM_PROMPT } from "../constants/block-markup";

const HEADER_GUIDANCE = `Generate a WordPress block theme HEADER template part (header.html).

The header MUST contain:
- A wp:group block with {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} as the outer wrapper
- Inside that group: wp:site-title (or wp:site-logo if the theme description suggests a logo-driven brand)
- A wp:navigation block for the main menu

The header should use the "header" HTML tag via a wrapping wp:group with {"tagName":"header"}.

Keep it clean and semantic. The navigation should use flex layout for horizontal alignment.`;

const FOOTER_GUIDANCE = `Generate a WordPress block theme FOOTER template part (footer.html).

The footer MUST contain:
- A wp:group block with {"tagName":"footer"} as the outer wrapper
- A wp:group with constrained layout inside for content width
- A wp:paragraph block containing a copyright notice (e.g., "Copyright 2025 Site Name. All rights reserved.")

Optional additions based on the theme style:
- wp:social-links for social media
- A secondary wp:navigation for footer links
- wp:columns for a multi-column footer layout with site info, links, and contact

Keep the footer grounded and functional.`;

function extractThemeContext(themeJson: object): string {
  const tj = themeJson as Record<string, unknown>;
  const settings = tj.settings as Record<string, unknown> | undefined;
  const parts: string[] = [];

  if (settings) {
    const color = settings.color as Record<string, unknown> | undefined;
    if (color?.palette) {
      parts.push(`Color palette: ${JSON.stringify(color.palette)}`);
    }
    const typography = settings.typography as Record<string, unknown> | undefined;
    if (typography?.fontFamilies) {
      parts.push(`Font families: ${JSON.stringify(typography.fontFamilies)}`);
    }
  }

  return parts.length > 0
    ? `## Theme Design Tokens\n\n${parts.join("\n")}`
    : "";
}

function buildPartPrompt(
  partName: string,
  enrichedPrompt: EnrichedPrompt,
  themeJson: object
): string {
  const guidance = partName === "header" ? HEADER_GUIDANCE : FOOTER_GUIDANCE;
  const themeContext = extractThemeContext(themeJson);

  return `${guidance}

## Theme Description

${enrichedPrompt.enrichedDescription}

${themeContext}

Generate the ${partName}.html template part now.`;
}

export async function generateParts(
  enrichedPrompt: EnrichedPrompt,
  themeJson: object,
  provider: AIProvider
): Promise<Map<string, string>> {
  const parts = new Map<string, string>();
  const partNames = ["header", "footer"] as const;

  const results = await Promise.all(
    partNames.map((name) =>
      provider.generateText(
        buildPartPrompt(name, enrichedPrompt, themeJson),
        TEMPLATE_SYSTEM_PROMPT,
        { temperature: 0.5 }
      )
    )
  );

  for (let i = 0; i < partNames.length; i++) {
    parts.set(`${partNames[i]}.html`, results[i].trim());
  }

  return parts;
}
