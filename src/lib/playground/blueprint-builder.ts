import { ARCHETYPE_CONTENT } from "./sample-content";

interface InternalLink {
  label: string;
  path: string;
}

interface SkeletonPage {
  title: string;
  slug: string;
  content: string;
}

interface BlueprintStep {
  step: string;
  [key: string]: unknown;
}

interface Blueprint {
  $schema: string;
  landingPage: string;
  preferredVersions: { php: string; wp: string };
  steps: BlueprintStep[];
}

export function extractInternalLinks(markup: string): InternalLink[] {
  const seen = new Set<string>();
  const links: InternalLink[] = [];
  const re = /<a\s[^>]*href="([^"]*)"[^>]*>([^<]*)/gi;

  let match;
  while ((match = re.exec(markup)) !== null) {
    const href = match[1];
    const label = match[2].trim();

    if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) continue;
    if (href.startsWith("#")) continue;
    if (href === "/") continue;

    const path = href.startsWith("/") ? href : `/${href}`;
    const normalized = path.replace(/\/+$/, "").toLowerCase();

    if (seen.has(normalized)) continue;
    seen.add(normalized);
    links.push({ label: label || normalized.slice(1), path: normalized });
  }

  return links;
}

export function resolveSkeletonPages(links: InternalLink[], archetypeId: string): SkeletonPage[] {
  const content = ARCHETYPE_CONTENT[archetypeId] ?? ARCHETYPE_CONTENT.blog;
  const pages: SkeletonPage[] = [];

  for (const link of links) {
    const slug = link.path.replace(/^\//, "").replace(/\/+$/, "");
    if (!slug) continue;

    const archPost = content.posts.find(
      (p) => p.type === "page" && p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug
    );

    pages.push({
      title: archPost?.title ?? link.label,
      slug,
      content: archPost?.content ?? `<!-- wp:paragraph -->\n<p>This page is under construction.</p>\n<!-- /wp:paragraph -->`,
    });
  }

  return pages;
}

export function buildContentPHP(
  pages: SkeletonPage[],
  siteTitle: string,
  siteTagline: string,
  menuLinks: InternalLink[]
): string {
  const esc = (s: string) => s.replace(/'/g, "\\'");

  const pageInserts = pages
    .map(
      (page, i) => `
    $page_${i} = wp_insert_post(array(
      'post_title'   => '${esc(page.title)}',
      'post_content' => '${esc(page.content)}',
      'post_status'  => 'publish',
      'post_type'    => 'page',
      'post_name'    => '${esc(page.slug)}',
    ));`
    )
    .join("\n");

  const menuItemsCode = menuLinks
    .map(
      (link) => `
    wp_update_nav_menu_item($menu_id, 0, array(
      'menu-item-title'  => '${esc(link.label)}',
      'menu-item-url'    => home_url('${esc(link.path)}/'),
      'menu-item-status' => 'publish',
      'menu-item-type'   => 'custom',
    ));`
    )
    .join("\n");

  return `<?php
  require '/wordpress/wp-load.php';

  // Delete default content
  wp_delete_post(1, true);
  wp_delete_post(2, true);

  // Set site identity
  update_option('blogname', '${esc(siteTitle)}');
  update_option('blogdescription', '${esc(siteTagline)}');

  // Insert pages
  ${pageInserts}

  // Set static front page
  update_option('show_on_front', 'page');
  ${pages.length > 0 ? `$front = get_page_by_path('${esc(pages[0].slug)}');
  if ($front) {
    update_option('page_on_front', $front->ID);
  }` : ""}

  // Create navigation menu
  $menu_id = wp_create_nav_menu('Primary');
  ${menuItemsCode}

  // Assign menu to theme location
  $locations = get_theme_mod('nav_menu_locations');
  if (!is_array($locations)) $locations = array();
  $locations['primary'] = $menu_id;
  set_theme_mod('nav_menu_locations', $locations);

  echo 'OK';
  `;
}

export function buildEnhancedBlueprint(
  themeSlug: string,
  archetypeId: string,
  templateMarkup: string
): Blueprint {
  const content = ARCHETYPE_CONTENT[archetypeId] ?? ARCHETYPE_CONTENT.blog;
  const links = extractInternalLinks(templateMarkup);
  const pages = resolveSkeletonPages(links, archetypeId);

  const menuLinks: InternalLink[] =
    links.length > 0
      ? links
      : content.menuItems.map((item) => ({
          label: item,
          path: `/${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        }));

  const php = buildContentPHP(pages, content.siteTitle, content.siteTagline, menuLinks);

  return {
    $schema: "https://playground.wordpress.net/blueprint-schema.json",
    landingPage: "/",
    preferredVersions: { php: "8.2", wp: "latest" },
    steps: [
      { step: "login", username: "admin", password: "password" },
      {
        step: "installTheme",
        themeData: { resource: "bundled", path: "theme.zip" },
      },
      {
        step: "setSiteOptions",
        options: { stylesheet: themeSlug, template: themeSlug },
      },
      { step: "runPHP", code: php },
    ],
  };
}
