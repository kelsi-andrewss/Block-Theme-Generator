/**
 * Generate PHP code that creates sample content in WordPress
 * matching the theme's archetype.
 */

interface SampleContent {
  posts: Array<{ title: string; content: string; type: "post" | "page"; featured?: boolean }>;
  siteTitle: string;
  siteTagline: string;
  menuItems: string[];
}

export const ARCHETYPE_CONTENT: Record<string, SampleContent> = {
  portfolio: {
    siteTitle: "Alex Rivera Photography",
    siteTagline: "Capturing moments that matter",
    menuItems: ["Portfolio", "About", "Contact"],
    posts: [
      {
        title: "Mountain Landscapes",
        type: "post",
        featured: true,
        content: `<!-- wp:paragraph --><p>A collection of breathtaking mountain landscapes captured during golden hour across the Pacific Northwest. Each image tells the story of patience, timing, and the raw beauty of nature.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>These photographs were taken over the course of two years, from the peaks of Mount Rainier to the valleys of Olympic National Park.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Urban Architecture",
        type: "post",
        content: `<!-- wp:paragraph --><p>Exploring the geometric beauty of modern architecture through a minimalist lens. Sharp lines, bold shadows, and the interplay of glass and steel define this series.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Portrait Sessions",
        type: "post",
        content: `<!-- wp:paragraph --><p>Natural light portrait work focusing on authentic expression and emotion. Every session is a collaboration between photographer and subject.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "About",
        type: "page",
        content: `<!-- wp:paragraph --><p>I'm a photographer based in Portland, Oregon, specializing in landscape and architectural photography. With over 10 years of experience, I bring a unique perspective to every project.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>My work has been featured in National Geographic, Condé Nast Traveler, and Architectural Digest.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Contact",
        type: "page",
        content: `<!-- wp:paragraph --><p>Let's work together. Whether you need commercial photography, event coverage, or fine art prints, I'd love to hear about your project.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Email: hello@alexrivera.com</p><!-- /wp:paragraph -->`,
      },
    ],
  },

  saas: {
    siteTitle: "FlowStack",
    siteTagline: "Ship faster with smarter workflows",
    menuItems: ["Features", "Pricing", "About", "Contact"],
    posts: [
      {
        title: "Introducing FlowStack 2.0",
        type: "post",
        featured: true,
        content: `<!-- wp:paragraph --><p>We're excited to announce FlowStack 2.0 — a complete reimagining of how teams manage their deployment workflows. With real-time collaboration, automated testing pipelines, and intelligent rollback detection, shipping code has never been easier.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Over 10,000 teams trust FlowStack to deploy with confidence.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "How We Reduced Deploy Times by 80%",
        type: "post",
        content: `<!-- wp:paragraph --><p>A deep dive into the engineering decisions that made FlowStack the fastest CI/CD platform on the market. From incremental builds to intelligent caching, every millisecond counts.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Features",
        type: "page",
        content: `<!-- wp:paragraph --><p>FlowStack comes loaded with everything your team needs to ship with confidence — automated testing, one-click deploys, real-time monitoring, and rollback protection.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Pricing",
        type: "page",
        content: `<!-- wp:paragraph --><p>Simple, transparent pricing. Start free, scale as you grow. No hidden fees, no surprises.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Starter: Free for up to 3 users. Pro: $29/month per user. Enterprise: Custom pricing.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "About",
        type: "page",
        content: `<!-- wp:paragraph --><p>FlowStack was founded in 2024 by a team of engineers who were tired of broken deployment pipelines. We believe shipping software should be boring — in the best way possible.</p><!-- /wp:paragraph -->`,
      },
    ],
  },

  blog: {
    siteTitle: "The Curious Mind",
    siteTagline: "Thoughts on technology, creativity, and life",
    menuItems: ["Home", "About", "Archive"],
    posts: [
      {
        title: "Why I Stopped Multitasking",
        type: "post",
        featured: true,
        content: `<!-- wp:paragraph --><p>For years, I wore my ability to juggle multiple tasks like a badge of honor. Then I read the research — and everything changed. Here's what single-tasking taught me about doing meaningful work.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>The science is clear: what we call multitasking is actually rapid task-switching, and it comes with a cognitive cost of up to 40% reduced productivity.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "The Art of Digital Minimalism",
        type: "post",
        content: `<!-- wp:paragraph --><p>In a world of infinite scroll and constant notifications, choosing less is a radical act. Here's my framework for a more intentional digital life.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Reading List: Books That Changed My Perspective",
        type: "post",
        content: `<!-- wp:paragraph --><p>A curated collection of books that fundamentally shifted how I think about work, creativity, and human connection. Updated quarterly.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Learning to Code at 35",
        type: "post",
        content: `<!-- wp:paragraph --><p>I picked up programming as a hobby in my mid-thirties and it transformed my career. Here's an honest account of the journey — the frustrations, breakthroughs, and unexpected joys.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "About",
        type: "page",
        content: `<!-- wp:paragraph --><p>I'm a writer and thinker exploring the intersection of technology and human experience. This blog is my space to work through ideas in public.</p><!-- /wp:paragraph -->`,
      },
    ],
  },

  restaurant: {
    siteTitle: "Ember & Oak",
    siteTagline: "Wood-fired cuisine in the heart of the city",
    menuItems: ["Menu", "About", "Reservations"],
    posts: [
      {
        title: "Our Spring Tasting Menu",
        type: "post",
        featured: true,
        content: `<!-- wp:paragraph --><p>This season's tasting menu celebrates the first harvest — wild ramps, morel mushrooms, and spring lamb, all kissed by our wood-fired oven. Five courses, each telling a story of the land.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Farm to Flame: Our Sourcing Philosophy",
        type: "post",
        content: `<!-- wp:paragraph --><p>Every ingredient at Ember & Oak comes from within 100 miles of our kitchen. We visit our farms weekly, choosing what's best — not what's convenient.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Menu",
        type: "page",
        content: `<!-- wp:paragraph --><p>Our menu changes with the seasons. Below you'll find our current offerings — each dish crafted with care using locally sourced ingredients and our signature wood-fired technique.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Starters from $14 · Mains from $28 · Desserts from $12 · Tasting Menu $85</p><!-- /wp:paragraph -->`,
      },
      {
        title: "About",
        type: "page",
        content: `<!-- wp:paragraph --><p>Ember & Oak was born from a simple idea: great food starts with great fire. Chef Maria Santos brings 20 years of culinary experience and a deep respect for seasonal cooking to every plate.</p><!-- /wp:paragraph -->`,
      },
      {
        title: "Reservations",
        type: "page",
        content: `<!-- wp:paragraph --><p>We accept reservations for parties of all sizes. For groups of 8 or more, please contact us directly for our private dining options.</p><!-- /wp:paragraph -->

<!-- wp:paragraph --><p>Hours: Tuesday–Saturday, 5:30 PM – 10:00 PM · Sunday Brunch, 10:00 AM – 2:00 PM</p><!-- /wp:paragraph -->`,
      },
    ],
  },

  ecommerce: {
    siteTitle: "Heirloom Goods",
    siteTagline: "Thoughtfully made, built to last",
    menuItems: ["Shop", "About", "Contact"],
    posts: [
      { title: "The Craft Behind Our Leather Collection", type: "post", featured: true, content: `<!-- wp:paragraph --><p>Every piece in our leather collection is hand-cut and stitched by artisans in our Portland workshop. We use full-grain vegetable-tanned leather that develops a rich patina over years of use.</p><!-- /wp:paragraph -->` },
      { title: "New Arrivals: Spring Collection", type: "post", content: `<!-- wp:paragraph --><p>Introducing our lightest fabrics yet — organic linen and cotton blends designed for warm weather comfort without compromising on style or durability.</p><!-- /wp:paragraph -->` },
      { title: "About", type: "page", content: `<!-- wp:paragraph --><p>Heirloom Goods creates timeless everyday essentials using traditional craftsmanship and sustainable materials. Founded in 2020, we believe the best things in life are made to last.</p><!-- /wp:paragraph -->` },
      { title: "Shipping & Returns", type: "page", content: `<!-- wp:paragraph --><p>Free shipping on orders over $75. Easy returns within 30 days. We stand behind everything we make — if it doesn't meet your expectations, we'll make it right.</p><!-- /wp:paragraph -->` },
    ],
  },

  agency: {
    siteTitle: "Meridian Studio",
    siteTagline: "Strategy, design, and digital transformation",
    menuItems: ["Work", "Services", "About", "Contact"],
    posts: [
      { title: "Rebranding National Parks Foundation", type: "post", featured: true, content: `<!-- wp:paragraph --><p>How we helped the National Parks Foundation connect with a new generation of outdoor enthusiasts through a complete brand overhaul — from visual identity to digital experience.</p><!-- /wp:paragraph -->` },
      { title: "Why Brand Strategy Comes Before Design", type: "post", content: `<!-- wp:paragraph --><p>Beautiful design without strategy is decoration. Here's our framework for building brands that resonate with the right audience and drive measurable results.</p><!-- /wp:paragraph -->` },
      { title: "Services", type: "page", content: `<!-- wp:paragraph --><p>Brand Strategy · Visual Identity · Web Design & Development · Content Strategy · Digital Marketing · UX Research</p><!-- /wp:paragraph -->` },
      { title: "About", type: "page", content: `<!-- wp:paragraph --><p>Meridian Studio is a full-service creative agency helping ambitious brands tell their story. We're a team of strategists, designers, and engineers based in Brooklyn, NY.</p><!-- /wp:paragraph -->` },
    ],
  },

  magazine: {
    siteTitle: "Wavelength",
    siteTagline: "Culture, technology, and ideas",
    menuItems: ["Culture", "Tech", "Ideas", "About"],
    posts: [
      { title: "The Rise of Solarpunk Architecture", type: "post", featured: true, content: `<!-- wp:paragraph --><p>A new generation of architects is designing buildings that generate more energy than they consume. We visited three projects redefining what sustainable design looks like in 2026.</p><!-- /wp:paragraph -->` },
      { title: "Inside the AI Music Revolution", type: "post", content: `<!-- wp:paragraph --><p>Musicians are using AI not to replace creativity, but to augment it. We talked to five artists pushing the boundaries of what's possible when human intuition meets machine learning.</p><!-- /wp:paragraph -->` },
      { title: "The Case for Slow Technology", type: "post", content: `<!-- wp:paragraph --><p>In a world optimized for speed, a growing movement argues that the best tech experiences are the ones that encourage us to slow down.</p><!-- /wp:paragraph -->` },
      { title: "About", type: "page", content: `<!-- wp:paragraph --><p>Wavelength is an independent digital magazine exploring the intersection of culture, technology, and ideas. Published weekly since 2024.</p><!-- /wp:paragraph -->` },
    ],
  },

  creative: {
    siteTitle: "Studio Noir",
    siteTagline: "Experimental design and visual art",
    menuItems: ["Work", "About", "Contact"],
    posts: [
      { title: "Fragments: A Generative Art Series", type: "post", featured: true, content: `<!-- wp:paragraph --><p>Exploring the space between order and chaos through algorithmically generated visual compositions. Each piece is unique — created by code, curated by eye.</p><!-- /wp:paragraph -->` },
      { title: "The Process Behind Our Installations", type: "post", content: `<!-- wp:paragraph --><p>A behind-the-scenes look at how we design and build large-scale interactive installations — from concept sketches to hardware prototyping to opening night.</p><!-- /wp:paragraph -->` },
      { title: "About", type: "page", content: `<!-- wp:paragraph --><p>Studio Noir is a multidisciplinary creative studio working at the intersection of art, design, and technology. We create experiences that challenge perception and provoke wonder.</p><!-- /wp:paragraph -->` },
    ],
  },
};

/**
 * Generate PHP code to populate WordPress with archetype-appropriate sample content.
 */
export function buildSampleContentPHP(archetypeId: string, themeSlug: string): string {
  const content = ARCHETYPE_CONTENT[archetypeId] ?? ARCHETYPE_CONTENT.blog;

  const postInserts = content.posts
    .map((post, i) => {
      const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return `
    $post_${i} = wp_insert_post(array(
      'post_title'   => '${post.title.replace(/'/g, "\\'")}',
      'post_content' => '${post.content.replace(/'/g, "\\'")}',
      'post_status'  => 'publish',
      'post_type'    => '${post.type}',
      'post_name'    => '${slug}',
    ));`;
    })
    .join("\n");

  // Find the first page for use as front page
  const firstPage = content.posts.find(p => p.type === "page");
  const frontPageSlug = firstPage
    ? firstPage.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : "";

  const menuItemsCode = content.menuItems
    .map((item) => {
      const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return `
    wp_update_nav_menu_item($menu_id, 0, array(
      'menu-item-title'  => '${item}',
      'menu-item-url'    => home_url('/${slug}/'),
      'menu-item-status' => 'publish',
      'menu-item-type'   => 'custom',
    ));`;
    })
    .join("\n");

  return `<?php
  require '/wordpress/wp-load.php';

  // Delete default content
  wp_delete_post(1, true); // Hello World
  wp_delete_post(2, true); // Sample Page

  // Set site identity
  update_option('blogname', '${content.siteTitle.replace(/'/g, "\\'")}');
  update_option('blogdescription', '${content.siteTagline.replace(/'/g, "\\'")}');

  // Insert sample content
  ${postInserts}

  // Create navigation menu
  $menu_id = wp_create_nav_menu('Primary');
  ${menuItemsCode}

  // Assign menu to theme location
  $locations = get_theme_mod('nav_menu_locations');
  if (!is_array($locations)) $locations = array();
  $locations['primary'] = $menu_id;
  set_theme_mod('nav_menu_locations', $locations);

  // Set front page to static page if we have pages
  ${firstPage ? `
  $front = get_page_by_path('${frontPageSlug}');
  if ($front) {
    update_option('show_on_front', 'page');
    update_option('page_on_front', $front->ID);
  }` : ""}

  echo 'OK';
  `;
}
