# Wire activeFile into iframe URL

Story: story-1039
Agent: quick-fixer

## Context

The workbench iframe src is hardcoded to `/templates/${themeSlug}` and doesn't respond to tab switching. Wire `activeFile` into the iframe URL so selecting different pages navigates the iframe.

## What changes

| File | Change |
|---|---|
| `src/app/app/page.tsx` | Update iframe src to include the active page slug derived from activeFile. For templates (index.html, front-page.html), use the base URL. For pages/ prefixed files, extract the slug and append to the iframe URL. For parts/ and other templates (404.html, single.html), map to the appropriate slug. |

<!-- CODER_ONLY -->
## Tasks

1. Find the iframe src assignment (around line 845): `src={`/templates/${themeSlug}`}`
2. Create a slug derivation: if activeFile starts with 'pages/', strip prefix and .html → `/templates/${themeSlug}/${slug}`. If activeFile is 'index.html' or 'front-page.html', use base `/templates/${themeSlug}`. If activeFile is another template like '404.html', strip .html → `/templates/${themeSlug}/404`.
3. Update the iframe src to use the derived URL
4. Ensure the iframe key changes with activeFile so React remounts it on navigation
<!-- END_CODER_ONLY -->

## Acceptance criteria

- Clicking 404.html tab navigates iframe to /templates/saas/404
- Clicking index.html tab shows the front page at /templates/saas
- Clicking pages/pricing tab navigates iframe to /templates/saas/pricing
- Tab switching causes the iframe preview to update

## Verification

- Generate a SaaS theme, click through different tabs, confirm preview changes
