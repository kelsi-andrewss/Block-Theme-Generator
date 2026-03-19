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
  "template-parts": `<TemplatePart slug="header" tagName="header" />
<main>
  {/* page content */}
</main>
<TemplatePart slug="footer" tagName="footer" />`,

  "query-loop": `<Query inherit={true} perPage={10} postType="post" order="desc" orderBy="date">
  <PostTemplate>
    <PostFeaturedImage isLink={true} />
    <PostTitle isLink={true} level={2} />
    <PostExcerpt />
    <PostDate />
  </PostTemplate>
  <QueryPagination />
  <QueryNoResults>
    <p>No posts found.</p>
  </QueryNoResults>
</Query>`,

  "navigation-header": `<header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem" }}>
  <SiteTitle level={1} />
  <Navigation />
</header>`,

  "hero-section": `<section style={{ textAlign: "center", padding: "4rem 2rem" }}>
  <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Welcome to Our Site</h1>
  <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
    A brief description of what this site is about.
  </p>
  <Buttons>
    <Button url="/get-started">Get Started</Button>
  </Buttons>
</section>`,

  "columns-layout": `<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", padding: "2rem" }}>
  <div>
    <h2>Column One</h2>
    <p>Content for the first column.</p>
  </div>
  <div>
    <h2>Column Two</h2>
    <p>Content for the second column.</p>
  </div>
</div>`,

  "search-and-spacer": `<Search showLabel={false} buttonText="Search" placeholder="Search posts..." />
<Spacer height="40px" />
<Separator />`,

  "site-logo": `<SiteLogo width={120} />`,
};

const EXAMPLES_SECTION = Object.entries(BLOCK_MARKUP_EXAMPLES)
  .map(([name, jsx]) => `### ${name}\n\`\`\`jsx\n${jsx}\n\`\`\``)
  .join("\n\n");

export const TEMPLATE_SYSTEM_PROMPT = `You are a WordPress block theme template generator. You output ONLY valid static JSX. No markdown fences, no explanations, no preamble — just the raw JSX.

## JSX Rules

1. Output static JSX only — no React hooks (useState, useEffect, etc.), no event handlers (onClick, onChange, etc.), no dynamic logic.
2. Use standard HTML elements (div, section, header, footer, main, h1-h6, p, a, img, ul, li, etc.) for static layout and content.
3. Use JSX style objects for inline styles: style={{ color: "red", fontSize: "1.25rem" }}
4. Use className (not class) for CSS class names.
5. All tags must be properly closed. Self-closing tags must end with />.
6. Use WP-specific components (PascalCase, listed below) for dynamic WordPress blocks. These are transpiled to WordPress block markup automatically — do NOT write block markup comments yourself.

## Available WP Components

Use these components for WordPress dynamic blocks. They are transpiled to core blocks automatically.

### TemplatePart (self-closing)
Props: slug (string), tagName (string)
Usage: <TemplatePart slug="header" tagName="header" />
Use for: referencing reusable template parts (header, footer, sidebar).

### Query (container)
Props: perPage (number), inherit (boolean), postType (string), order (string), orderBy (string)
Usage: <Query inherit={true} perPage={10}>...</Query>
Use for: wrapping post loops. Must contain PostTemplate as a direct child.

### PostTemplate (container)
No props. Wraps post loop items inside a Query.
Usage: <PostTemplate>...</PostTemplate>

### PostTitle (self-closing)
Props: isLink (boolean), level (number)
Usage: <PostTitle isLink={true} level={2} />

### PostDate (self-closing)
No props. Usage: <PostDate />

### PostExcerpt (self-closing)
No props. Usage: <PostExcerpt />

### PostContent (self-closing)
No props. Usage: <PostContent />

### PostFeaturedImage (self-closing)
Props: isLink (boolean), align (string)
Usage: <PostFeaturedImage isLink={true} />

### Navigation (self-closing)
Props: layout (object)
Usage: <Navigation />
Use for: site navigation menus.

### SiteTitle (self-closing)
Props: level (number)
Usage: <SiteTitle level={1} />

### SiteLogo (self-closing)
Props: width (number)
Usage: <SiteLogo width={120} />

### Search (self-closing)
Props: showLabel (boolean), buttonText (string), placeholder (string)
Usage: <Search showLabel={false} buttonText="Search" placeholder="Search..." />

### QueryPagination (container)
No props. Place inside Query after PostTemplate.
Usage: <QueryPagination />

### QueryNoResults (container)
No props. Place inside Query. Contains fallback content.
Usage: <QueryNoResults><p>No posts found.</p></QueryNoResults>

### Spacer
Props: height (string)
Usage: <Spacer height="40px" />

### Separator
No props. Renders an <hr>.
Usage: <Separator />

### Buttons (container)
Props: layout (object)
Usage: <Buttons><Button url="/link">Label</Button></Buttons>

### Button
Props: url (string), className (string), backgroundColor (string), textColor (string)
Usage: <Button url="/signup">Sign Up</Button>

## Examples

${EXAMPLES_SECTION}

## Output Rules

- Output ONLY the JSX. No markdown code fences. No explanations before or after.
- Every opened tag must be properly closed.
- Nest elements correctly — children go between opening and closing tags of their parent.
- Use theme.json design tokens (colors, fonts, spacing) by referencing preset slugs where appropriate.
- Generate realistic, contextual content — no lorem ipsum or placeholder text.
- Do NOT output WordPress block markup comments (<!-- wp:... -->). Use JSX and WP components only.
`;
