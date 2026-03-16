import type { AIProvider } from "../ai/provider";
import type { EnrichedPrompt } from "../prompts/enrichment";
import { TEMPLATE_SYSTEM_PROMPT } from "../constants/block-markup";

interface TemplateSpec {
  name: string;
  guidance: string;
  temperature: number;
}

const HEADER_PART = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->`;
const FOOTER_PART = `<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`;

const TEMPLATE_SPECS: TemplateSpec[] = [
  {
    name: "index",
    temperature: 0.5,
    guidance: `Generate the index.html template (the main blog/post listing template).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - A wp:query block with {"query":{"perPage":10,"inherit":true}} wrapping:
     - wp:post-template containing: wp:post-featured-image, wp:post-title (as link), wp:post-excerpt, wp:post-date
     - wp:query-pagination with previous/numbers/next
     - wp:query-no-results with a helpful message
3. Footer template part reference`,
  },
  {
    name: "single",
    temperature: 0.5,
    guidance: `Generate the single.html template (individual blog post view).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - wp:post-featured-image (full width)
   - wp:post-title
   - A wp:group with flex layout containing: wp:post-date, wp:post-author, wp:post-terms
   - wp:post-content
   - wp:separator
   - wp:post-comments-form
   - wp:comments with wp:comment-template
3. Footer template part reference`,
  },
  {
    name: "page",
    temperature: 0.5,
    guidance: `Generate the page.html template (static page view).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - wp:post-title
   - wp:post-featured-image (optional, based on theme style)
   - wp:post-content
3. Footer template part reference

Keep it simple -- pages should let their content breathe.`,
  },
  {
    name: "archive",
    temperature: 0.5,
    guidance: `Generate the archive.html template (category/tag/date archive listing).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - wp:query-title (to show "Category: X" or "Tag: Y")
   - wp:term-description
   - wp:query with {"query":{"perPage":10,"inherit":true}} wrapping:
     - wp:post-template with: wp:post-featured-image, wp:post-title (as link), wp:post-excerpt, wp:post-date
     - wp:query-pagination
     - wp:query-no-results
3. Footer template part reference`,
  },
  {
    name: "404",
    temperature: 0.5,
    guidance: `Generate the 404.html template (page not found).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - wp:heading with "Page Not Found" or similar
   - wp:paragraph with a helpful message explaining the page doesn't exist
   - wp:search block so users can find what they're looking for
   - Optional: wp:buttons with a link back to the home page
3. Footer template part reference

Make the 404 page helpful and on-brand, not just an error dump.`,
  },
  {
    name: "search",
    temperature: 0.5,
    guidance: `Generate the search.html template (search results page).

Structure:
1. Header template part reference
2. A wp:group with constrained layout containing:
   - wp:query-title (shows "Search results for: X")
   - wp:search block
   - wp:query with {"query":{"perPage":10,"inherit":true}} wrapping:
     - wp:post-template with: wp:post-title (as link), wp:post-excerpt, wp:post-date
     - wp:query-pagination
     - wp:query-no-results with a message and another wp:search block
3. Footer template part reference`,
  },
  {
    name: "front-page",
    temperature: 0.7,
    guidance: `Generate the front-page.html template (the site's home page).

This is the most creative template. It should NOT use a query loop for blog posts (that's index.html's job). Instead, build a compelling landing page using the theme's archetype sections.

Structure:
1. Header template part reference
2. A hero section using wp:cover or wp:group with a compelling heading, subheading, and CTA buttons
3. Content sections that match the theme archetype -- use wp:columns, wp:group, wp:media-text, wp:cover as needed
4. Each section should be wrapped in a wp:group for spacing and layout control
5. Use wp:spacer or wp:separator between major sections for visual rhythm
6. Footer template part reference

Make the front page visually engaging and true to the theme description. Use realistic content, not placeholders.`,
  },
];

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
    const spacing = settings.spacing as Record<string, unknown> | undefined;
    if (spacing) {
      parts.push(`Spacing scale: ${JSON.stringify(spacing)}`);
    }
  }

  return parts.length > 0
    ? `## Theme Design Tokens\n\n${parts.join("\n")}`
    : "";
}

function buildTemplatePrompt(
  spec: TemplateSpec,
  enrichedPrompt: EnrichedPrompt,
  themeJson: object
): string {
  const themeContext = extractThemeContext(themeJson);

  const wrapRule = spec.name === "front-page"
    ? ""
    : `\nIMPORTANT: The template MUST start with:\n${HEADER_PART}\nand MUST end with:\n${FOOTER_PART}\n`;

  return `${spec.guidance}
${wrapRule}
## Theme Description

${enrichedPrompt.enrichedDescription}

## Archetype

Site type: ${enrichedPrompt.archetype.name}
Typical sections: ${enrichedPrompt.archetype.sections.join(", ")}
Layout: ${enrichedPrompt.archetype.designConventions.layout}
Navigation: ${enrichedPrompt.archetype.designConventions.navStyle}
Mood: ${enrichedPrompt.archetype.designConventions.mood}

${themeContext}

Generate the ${spec.name}.html template now.`;
}

export async function generateTemplates(
  enrichedPrompt: EnrichedPrompt,
  themeJson: object,
  provider: AIProvider
): Promise<Map<string, string>> {
  const templates = new Map<string, string>();

  const results = await Promise.all(
    TEMPLATE_SPECS.map((spec) =>
      provider.generateText(
        buildTemplatePrompt(spec, enrichedPrompt, themeJson),
        TEMPLATE_SYSTEM_PROMPT,
        { temperature: spec.temperature }
      )
    )
  );

  for (let i = 0; i < TEMPLATE_SPECS.length; i++) {
    let content = results[i].trim();
    const spec = TEMPLATE_SPECS[i];

    // Ensure structural templates have header/footer parts
    if (spec.name !== "front-page") {
      if (!content.startsWith("<!-- wp:template-part")) {
        content = `${HEADER_PART}\n\n${content}`;
      }
      if (!content.endsWith("/-->") || !content.includes("footer")) {
        content = `${content}\n\n${FOOTER_PART}`;
      }
    }

    templates.set(`${spec.name}.html`, content);
  }

  return templates;
}
