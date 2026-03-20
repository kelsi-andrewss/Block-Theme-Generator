import type { AIProvider } from "../ai/provider";
import type { EnrichedPrompt } from "../prompts/enrichment";
import { TEMPLATE_SYSTEM_PROMPT } from "../constants/block-markup";
import { transpileJSXToBlocks } from "../transpiler/jsx-to-blocks";

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

import { SAAS_FRONT_PAGE_HTML } from "./saas-template";

export async function generateTemplates(
  enrichedPrompt: any,
  themeJson: object,
  provider: any
): Promise<Map<string, string>> {
  const templates = new Map<string, string>();

  // Use a beautifully structured, modern SaaS-like layout that relies strictly
  // on standard WordPress core blocks (group, columns, headings).
  
  templates.set("index.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Latest Posts</h1>
<!-- /wp:heading -->
</div>
<!-- /wp:group -->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-date /-->
<!-- wp:post-excerpt /-->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No posts found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  templates.set("single.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:post-featured-image {"isLink":false,"align":"wide"} /-->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:post-title {"level":1} /-->
<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group">
<!-- wp:post-date /-->
<!-- wp:post-author {"showAvatar":false,"showBio":false} /-->
</div>
<!-- /wp:group -->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:post-content /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  templates.set("page.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:post-title {"level":1} /-->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:post-content /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  const genericFrontPage = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"100%"}} -->
<main class="wp-block-group">

<!-- HERO SECTION -->
<!-- wp:cover {"dimRatio":50,"overlayColor":"base","isDark":false,"align":"full"} -->
<div class="wp-block-cover alignfull has-base-background-color">
<span aria-hidden="true" class="wp-block-cover__background has-base-background-color has-background-dim"></span>
<div class="wp-block-cover__inner-container">
<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group">
<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2.5rem, 5vw, 4rem)","fontWeight":"700"}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.5rem, 5vw, 4rem);font-weight:700">Digital experiences crafted for the modern web</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
<p class="has-text-align-center" style="font-size:1.25rem">We build beautiful, fast, and scalable solutions that help your business grow and reach new heights in the digital era.</p>
<!-- /wp:paragraph -->
<!-- wp:spacer {"height":"1.5rem"} -->
<div style="height:1.5rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Get Started</a></div>
<!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Learn More</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
</div>
</div>
<!-- /wp:cover -->

<!-- wp:spacer {"height":"6rem"} -->
<div style="height:6rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- FEATURES SECTION -->
<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
<!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">Why choose our platform</h2>
<!-- /wp:heading -->
<!-- wp:spacer {"height":"3rem"} -->
<div style="height:3rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:columns -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Lightning Fast</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Optimized for speed and performance out of the box. Give your users the snappy experience they deserve.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Secure by Default</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Bank-grade security protocols implemented natively so you never have to worry about data breaches.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Highly Scalable</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>Architecture that grows with you. From your first hundred users to your first million.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:spacer {"height":"6rem"} -->
<div style="height:6rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- CALL TO ACTION SECTION -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"4rem","right":"2rem","bottom":"4rem","left":"2rem"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="padding-top:4rem;padding-right:2rem;padding-bottom:4rem;padding-left:2rem">
<!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">Ready to accelerate your growth?</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Join thousands of companies already building the future on our platform.</p>
<!-- /wp:paragraph -->
<!-- wp:spacer {"height":"1rem"} -->
<div style="height:1rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
<!-- wp:button {"className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">Start Free Trial</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->

</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`;

  let frontPageHtml: string;
  try {
    const frontPageSpec = TEMPLATE_SPECS.find(s => s.name === "front-page")!;
    const frontPagePrompt = buildTemplatePrompt(frontPageSpec, enrichedPrompt, themeJson);

    const jsxString = await provider.generateText(
      frontPagePrompt,
      TEMPLATE_SYSTEM_PROMPT,
      { temperature: frontPageSpec.temperature }
    );

    frontPageHtml = transpileJSXToBlocks(jsxString);
  } catch (err) {
    console.warn(
      "[templates] Front-page AI generation/transpilation failed, using fallback:",
      err instanceof Error ? err.message : err
    );
    frontPageHtml = enrichedPrompt?.archetype?.id === "saas"
      ? SAAS_FRONT_PAGE_HTML
      : genericFrontPage;
  }

  templates.set("front-page.html", frontPageHtml);
  templates.set("index.html", frontPageHtml);

  templates.set("404.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:heading {"textAlign":"center","level":1} -->
<h1 class="wp-block-heading has-text-align-center">404 - Page Not Found</h1>
<!-- /wp:heading -->
<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
<!-- /wp:paragraph -->
<!-- wp:search {"showLabel":false,"buttonText":"Search"} /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  templates.set("archive.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"archive","textAlign":"center"} /-->
<!-- wp:term-description {"textAlign":"center"} /-->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-date /-->
<!-- wp:post-excerpt /-->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No results found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  templates.set("search.html", `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
<!-- wp:query-title {"type":"search","textAlign":"center"} /-->
<!-- wp:search {"showLabel":false,"buttonText":"Search"} /-->
<!-- wp:spacer {"height":"2rem"} -->
<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt /-->
</div>
<!-- /wp:group -->
<!-- /wp:post-template -->
<!-- wp:query-pagination -->
<!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
<!-- wp:query-no-results -->
<!-- wp:paragraph -->
<p>No results found for your search.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`);

  return templates;
}
