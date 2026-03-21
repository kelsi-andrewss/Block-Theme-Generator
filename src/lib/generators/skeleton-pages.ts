import {
  SAAS_SIGNUP_HTML,
  SAAS_PRICING_HTML,
  SAAS_CONTACT_HTML,
  SAAS_DOCS_HTML,
} from './saas-template';

interface SkeletonPage {
  title: string;
  slug: string;
  content: string;
}

// ---------------------------------------------------------------------------
// SaaS pages
// ---------------------------------------------------------------------------

const saasSignup: SkeletonPage = {
  title: "Sign Up",
  slug: "signup",
  content: SAAS_SIGNUP_HTML,
};

const saasPricing: SkeletonPage = {
  title: "Pricing",
  slug: "pricing",
  content: SAAS_PRICING_HTML,
};

const saasDocs: SkeletonPage = {
  title: "Documentation",
  slug: "documentation",
  content: SAAS_DOCS_HTML,
};

const saasContact: SkeletonPage = {
  title: "Contact",
  slug: "contact",
  content: SAAS_CONTACT_HTML,
};

// ---------------------------------------------------------------------------
// Blog pages
// ---------------------------------------------------------------------------

const blogAbout: SkeletonPage = {
  title: "About",
  slug: "about",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"720px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
<h1 class="wp-block-heading" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:2rem">About this blog</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.125rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">I started this blog to think out loud about the things that fascinate me most: technology, creativity, and how we live our lives in an increasingly connected world.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p style="font-size:1.125rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">I am a writer based in Portland, Oregon. By day I work in product design; in the margins I read voraciously, experiment with code, and try to make sense of the world one essay at a time.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"2.5rem","bottom":"2.5rem"}}}} -->
<hr class="wp-block-separator" style="border-top:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);margin-top:2.5rem;margin-bottom:2.5rem"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">What I write about</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">Most posts fall into one of three buckets: long-form essays on technology and culture, short reflections on creative practice, and curated reading lists. I publish roughly once a week.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Get in touch</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent)">The best way to reach me is by email at <span style="color:var(--wp--preset--color--primary);font-weight:600">hello@example.com</span>. I read every message and do my best to respond.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`,
};

const blogContact: SkeletonPage = {
  title: "Contact",
  slug: "contact",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"600px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 2.5rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h1 class="wp-block-heading" style="font-size:clamp(2rem, 4vw, 2.5rem);font-weight:800;margin-bottom:1rem">Contact</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.75;color:color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent);margin-bottom:2.5rem">Have a question, collaboration idea, or just want to say hello? Drop me a line and I will get back to you as soon as I can.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.25rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.25rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Name</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.25rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.25rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Email</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.5rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Message</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:8rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="padding:0.75rem 2rem;border-radius:0.5rem;background-color:var(--wp--preset--color--primary);color:var(--wp--preset--color--base);font-weight:700">Send Message</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->`,
};

// ---------------------------------------------------------------------------
// Portfolio pages
// ---------------------------------------------------------------------------

const portfolioProjects: SkeletonPage = {
  title: "Projects",
  slug: "projects",
  content: `<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h1 class="wp-block-heading" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:1rem">Selected Work</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"spacing":{"margin":{"bottom":"4rem"}}}} -->
<p style="font-size:1.125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);max-width:600px;margin-bottom:4rem">A curated collection of projects spanning brand identity, web design, and creative direction.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"4rem"}}}} -->
<div class="wp-block-group" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:4rem">

<!-- wp:group -->
<div class="wp-block-group" style="border-radius:1rem;overflow:hidden;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)">
<!-- wp:group -->
<div class="wp-block-group" style="aspect-ratio:4/3;background-color:color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent);display:flex;align-items:center;justify-content:center">
<!-- wp:paragraph -->
<p style="font-size:3rem;opacity:0.3">01</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem">
<!-- wp:paragraph {"style":{"spacing":{"margin":{"bottom":"0.25rem"}}}} -->
<p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--wp--preset--color--primary);margin-bottom:0.25rem">Brand Identity</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">Lumina Health</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625">Complete brand overhaul for a digital health startup, including logo, color system, and brand guidelines.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group -->
<div class="wp-block-group" style="border-radius:1rem;overflow:hidden;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)">
<!-- wp:group -->
<div class="wp-block-group" style="aspect-ratio:4/3;background-color:color-mix(in srgb, var(--wp--preset--color--secondary) 15%, transparent);display:flex;align-items:center;justify-content:center">
<!-- wp:paragraph -->
<p style="font-size:3rem;opacity:0.3">02</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem">
<!-- wp:paragraph {"style":{"spacing":{"margin":{"bottom":"0.25rem"}}}} -->
<p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--wp--preset--color--secondary);margin-bottom:0.25rem">Web Design</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">Arcadia Magazine</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625">Editorial web experience for an independent culture and arts magazine with custom typography.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group -->
<div class="wp-block-group" style="border-radius:1rem;overflow:hidden;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)">
<!-- wp:group -->
<div class="wp-block-group" style="aspect-ratio:4/3;background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent);display:flex;align-items:center;justify-content:center">
<!-- wp:paragraph -->
<p style="font-size:3rem;opacity:0.3">03</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem">
<!-- wp:paragraph {"style":{"spacing":{"margin":{"bottom":"0.25rem"}}}} -->
<p style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--wp--preset--color--primary);margin-bottom:0.25rem">Creative Direction</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem">Solstice Festival</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625">Art direction and visual identity for an annual music and arts festival, from posters to stage design.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`,
};

const portfolioHireMe: SkeletonPage = {
  title: "Hire Me",
  slug: "hire-me",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"720px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<h1 class="wp-block-heading" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:1.5rem">Let's work together</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.125rem;line-height:1.75;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:2.5rem">I am available for freelance projects, brand collaborations, and creative consulting. Whether you need a complete brand identity or a single landing page, I bring the same level of care and craft to every engagement.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1.25rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:1.5rem;font-weight:700;margin-bottom:1.25rem">Services</h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"2.5rem"}}}} -->
<div class="wp-block-group" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2.5rem">

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem;border-radius:0.75rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Brand Identity</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.8125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625;margin:0">Logo, color, typography, and guidelines</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem;border-radius:0.75rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Web Design</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.8125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625;margin:0">Responsive sites, landing pages, portfolios</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem;border-radius:0.75rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Creative Direction</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.8125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625;margin:0">Campaign concepts and visual storytelling</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}}} -->
<div class="wp-block-group" style="padding:1.5rem;border-radius:0.75rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1rem;font-weight:700;margin-bottom:0.5rem">Consulting</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.8125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625;margin:0">Design audits, strategy, and mentoring</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"0","bottom":"2.5rem"}}}} -->
<hr class="wp-block-separator" style="border-top:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);margin-top:0;margin-bottom:2.5rem"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">Get in touch</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.75;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">Drop me an email at <span style="color:var(--wp--preset--color--primary);font-weight:600">hello@example.com</span> with a brief description of your project, timeline, and budget. I typically respond within 48 hours.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="padding:0.875rem 2rem;border-radius:0.5rem;background-color:var(--wp--preset--color--primary);color:var(--wp--preset--color--base);font-weight:700">Start a Conversation</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->`,
};

// ---------------------------------------------------------------------------
// Restaurant pages
// ---------------------------------------------------------------------------

const restaurantMenu: SkeletonPage = {
  title: "Menu",
  slug: "menu",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:1rem">Our Menu</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"4rem"}}}} -->
<p class="has-text-align-center" style="font-size:1.0625rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin-bottom:4rem">Seasonal dishes crafted from locally sourced ingredients and prepared with our signature wood-fired technique.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"0.8125rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:0.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:var(--wp--preset--color--primary);margin-bottom:2rem">Starters</h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Wood-Roasted Beets</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Whipped chevre, pistachios, honey vinaigrette</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$16</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Burrata &amp; Heirloom Tomato</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Basil oil, flaky salt, grilled sourdough</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$18</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Charred Octopus</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Romesco, fingerling potatoes, smoked paprika</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$22</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"0.8125rem","fontWeight":"700"},"spacing":{"margin":{"top":"3rem","bottom":"2rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:0.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:var(--wp--preset--color--primary);margin-top:3rem;margin-bottom:2rem">Mains</h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Dry-Aged Ribeye</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Bone marrow butter, charred broccolini, red wine jus</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$48</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Pan-Seared Salmon</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Spring pea puree, lemon confit, dill cream</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$36</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Wild Mushroom Risotto</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Truffle oil, pecorino, crispy sage</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$28</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"0.8125rem","fontWeight":"700"},"spacing":{"margin":{"top":"3rem","bottom":"2rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:0.8125rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:var(--wp--preset--color--primary);margin-top:3rem;margin-bottom:2rem">Desserts</h2>
<!-- /wp:heading -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Dark Chocolate Torte</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Salted caramel, espresso cream, hazelnut praline</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$14</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:1rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-bottom:1.5rem">
<!-- wp:group -->
<div class="wp-block-group" style="flex:1">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.0625rem","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:1.0625rem;font-weight:700;margin-bottom:0.25rem">Seasonal Panna Cotta</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin:0">Vanilla bean, berry compote, shortbread</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
<!-- wp:paragraph -->
<p style="font-size:1.0625rem;font-weight:600;color:var(--wp--preset--color--contrast);white-space:nowrap;margin-left:2rem">$12</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:separator {"style":{"spacing":{"margin":{"top":"3rem","bottom":"2rem"}}}} -->
<hr class="wp-block-separator" style="border-top:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);margin-top:3rem;margin-bottom:2rem"/>
<!-- /wp:separator -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center" style="font-size:0.8125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent);font-style:italic">Menu changes seasonally. Please inform your server of any allergies or dietary requirements.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`,
};

const restaurantReservations: SkeletonPage = {
  title: "Reservations",
  slug: "reservations",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"720px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:1rem">Reservations</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"3rem"}}}} -->
<p class="has-text-align-center" style="font-size:1.0625rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin-bottom:3rem">We recommend booking in advance, especially for weekend dining. Walk-ins are welcome based on availability.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"2.5rem","right":"2.5rem","bottom":"2.5rem","left":"2.5rem"},"margin":{"bottom":"2rem"}}}} -->
<div class="wp-block-group" style="padding:2.5rem;border-radius:1rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);background-color:var(--wp--preset--color--base);margin-bottom:2rem">

<!-- wp:columns {"style":{"spacing":{"blockGap":"1.25rem"}}} -->
<div class="wp-block-columns" style="gap:1.25rem;margin-bottom:1.25rem">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Date</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Time</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Guests</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.25rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.25rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Name</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.25rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.25rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Phone or Email</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:2.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="margin-bottom:1.5rem">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"600"}}} -->
<p style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">Special Requests</p>
<!-- /wp:paragraph -->
<!-- wp:group -->
<div class="wp-block-group" style="height:5rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"></div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"width":100} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link wp-element-button" style="border-radius:0.5rem;padding:0.75rem;background-color:var(--wp--preset--color--primary);color:var(--wp--preset--color--base);font-weight:700;text-align:center">Request Reservation</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}}} -->
<div class="wp-block-group" style="padding:2rem;border-radius:1rem;background-color:color-mix(in srgb, var(--wp--preset--color--primary) 5%, transparent);border:1px solid color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)">
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1rem;font-weight:700;margin-bottom:1rem">Hours &amp; Information</h3>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent);line-height:1.875;margin:0"><strong>Dinner:</strong> Tuesday - Saturday, 5:30 PM - 10:00 PM<br><strong>Brunch:</strong> Sunday, 10:00 AM - 2:00 PM<br><strong>Closed:</strong> Monday<br><br>For parties of 8 or more, please call us directly at <span style="color:var(--wp--preset--color--primary);font-weight:600">(503) 555-0192</span> for private dining options.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`,
};

const restaurantAbout: SkeletonPage = {
  title: "About",
  slug: "about",
  content: `<!-- wp:group {"layout":{"type":"constrained","contentSize":"720px"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">

<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"800"},"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:800;margin-bottom:1.5rem">Our Story</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"spacing":{"margin":{"bottom":"3rem"}}}} -->
<p class="has-text-align-center" style="font-size:1.125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-style:italic;margin-bottom:3rem">Great food starts with great fire.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"3rem"}}}} -->
<div class="wp-block-group" style="aspect-ratio:16/9;border-radius:1rem;background-color:color-mix(in srgb, var(--wp--preset--color--primary) 8%, transparent);display:flex;align-items:center;justify-content:center;margin-bottom:3rem;overflow:hidden">
<!-- wp:paragraph -->
<p style="font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 40%, transparent)">Restaurant interior photo</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">Ember &amp; Oak was born from a simple idea: cooking over live fire connects us to something primal and essential. Chef Maria Santos, after twenty years in kitchens from Lisbon to San Francisco, opened these doors with a commitment to seasonal ingredients and the transformative power of wood and flame.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem">Every dish on our menu starts with a conversation with our farmers. We source from within a hundred miles of our kitchen, visiting the farms weekly to choose what is best rather than what is convenient. The result is a menu that changes with the seasons and never stops surprising us.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:2.5rem">Our dining room is designed to feel like an extension of the kitchen: warm, honest, and alive. Whether you are joining us for a casual Tuesday supper or a special celebration, we want you to feel at home.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"style":{"spacing":{"margin":{"bottom":"2.5rem"}}}} -->
<hr class="wp-block-separator" style="border-top:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);margin-bottom:2.5rem"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"1.5rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"1rem"}}}} -->
<h2 class="wp-block-heading" style="font-size:1.5rem;font-weight:700;margin-bottom:1rem">The Team</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent);margin-bottom:1.5rem"><strong>Maria Santos</strong>, Executive Chef &amp; Owner, brings two decades of culinary expertise spanning Portuguese, Mediterranean, and Pacific Northwest cuisines.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p style="font-size:1.0625rem;line-height:1.875;color:color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent)"><strong>James Park</strong>, General Manager &amp; Sommelier, curates our wine program with a focus on small-production, sustainably farmed wines that complement our seasonal menu.</p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`,
};

// ---------------------------------------------------------------------------
// Page registry per archetype
// ---------------------------------------------------------------------------

const ARCHETYPE_PAGES: Record<string, SkeletonPage[]> = {
  saas: [saasSignup, saasPricing, saasDocs, saasContact],
  blog: [blogAbout, blogContact],
  portfolio: [portfolioProjects, portfolioHireMe],
  restaurant: [restaurantMenu, restaurantReservations, restaurantAbout],
};

export function generateSkeletonPages(
  archetypeId: string,
): Map<string, SkeletonPage> {
  const pages = ARCHETYPE_PAGES[archetypeId] ?? [];
  const result = new Map<string, SkeletonPage>();
  for (const page of pages) {
    result.set(page.slug, page);
  }
  return result;
}
