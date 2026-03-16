export const CORE_BLOCK_NAMES: string[] = [
  "group",
  "paragraph",
  "heading",
  "image",
  "cover",
  "columns",
  "column",
  "query",
  "post-template",
  "post-title",
  "post-content",
  "post-featured-image",
  "post-excerpt",
  "post-date",
  "post-author",
  "post-terms",
  "navigation",
  "page-list",
  "site-title",
  "site-logo",
  "site-tagline",
  "template-part",
  "spacer",
  "separator",
  "buttons",
  "button",
  "search",
  "list",
  "list-item",
  "quote",
  "code",
  "video",
  "audio",
  "row",
  "stack",
  "categories",
  "archives",
  "comment-template",
  "comments",
  "post-comments-form",
  "loginout",
  "term-description",
  "query-title",
  "query-pagination",
  "query-pagination-next",
  "query-pagination-previous",
  "query-pagination-numbers",
  "query-no-results",
  "read-more",
  "avatar",
  "post-author-name",
  "pullquote",
  "preformatted",
  "verse",
  "table",
  "gallery",
  "media-text",
  "social-links",
  "social-link",
  "file",
  "embed",
  "pattern",
];

export const BLOCK_MARKUP_EXAMPLES: Record<string, string> = {
  "group-constrained": `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Content inside a constrained group.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`,

  "columns": `<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Column 1 content.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Column 2 content.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`,

  "cover": `<!-- wp:cover {"url":"https://example.com/image.jpg","dimRatio":50} -->
<div class="wp-block-cover"><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><img class="wp-block-cover__image-background" alt="" src="https://example.com/image.jpg" /><div class="wp-block-cover__inner-container"><!-- wp:heading {"textAlign":"center","level":2} -->
<h2 class="wp-block-heading has-text-align-center">Cover Heading</h2>
<!-- /wp:heading --></div></div>
<!-- /wp:cover -->`,

  "query-loop": `<!-- wp:query {"queryId":0,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":true}} -->
<div class="wp-block-query"><!-- wp:post-template -->
<!-- wp:post-featured-image /-->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-excerpt /-->
<!-- wp:post-date /-->
<!-- /wp:post-template -->

<!-- wp:query-pagination -->
<div class="wp-block-query-pagination"><!-- wp:query-pagination-previous /-->
<!-- wp:query-pagination-numbers /-->
<!-- wp:query-pagination-next /--></div>
<!-- /wp:query-pagination -->

<!-- wp:query-no-results -->
<p>No posts found.</p>
<!-- /wp:query-no-results --></div>
<!-- /wp:query -->`,

  "navigation": `<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"space-between"}} /-->`,

  "template-part": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->`,

  "buttons": `<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Click Me</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->`,

  "spacer": `<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->`,
};

const BLOCK_NAMES_LIST = CORE_BLOCK_NAMES.map((n) => `wp:${n}`).join(", ");

const EXAMPLES_SECTION = Object.entries(BLOCK_MARKUP_EXAMPLES)
  .map(([name, markup]) => `### ${name}\n\`\`\`html\n${markup}\n\`\`\``)
  .join("\n\n");

export const TEMPLATE_SYSTEM_PROMPT = `You are a WordPress block theme template generator. You output ONLY valid WordPress block markup (HTML comments with block annotations and their corresponding HTML). No markdown fences, no explanations, no preamble -- just the raw block markup.

## Block Markup Rules

1. Opening comment: <!-- wp:blockname {"attr":"val"} -->
2. Closing comment: <!-- /wp:blockname -->
3. Self-closing (dynamic blocks): <!-- wp:blockname /-->
4. All core blocks use the "wp:" prefix with NO namespace: wp:paragraph, wp:heading, wp:group, etc.
5. JSON attributes in the opening comment MUST be valid JSON.
6. Template parts are referenced via: <!-- wp:template-part {"slug":"header","tagName":"header"} /-->
7. Query loops use wp:query wrapping wp:post-template.
8. Groups with layout use: <!-- wp:group {"layout":{"type":"constrained"}} -->
9. The wp:group block requires a wrapping <div class="wp-block-group">...</div>.
10. The wp:columns block requires <div class="wp-block-columns">...</div> and each wp:column needs <div class="wp-block-column">...</div>.

## Allowed Block Names

Only use these core blocks: ${BLOCK_NAMES_LIST}

## NEVER use wp:html

You MUST NOT use wp:html (Custom HTML) blocks under any circumstances. All content must use native WordPress block syntax from the allowed list above.

## Correct Markup Examples

${EXAMPLES_SECTION}

## Output Rules

- Output ONLY the block markup. No markdown code fences. No explanations before or after.
- Every opened block must be properly closed.
- Nest blocks correctly -- inner blocks go between the opening and closing comments of their parent.
- Use theme.json design tokens (colors, fonts, spacing) by referencing preset slugs where appropriate.
- Generate realistic, contextual content -- no lorem ipsum or placeholder text.
`;
