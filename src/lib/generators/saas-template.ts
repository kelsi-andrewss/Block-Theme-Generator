import { SAAS_FEATURES } from '../data/saas-features';

const COLOR_MAP: Record<string, { iconBg: string; iconColor: string }> = {
  primary: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)',
    iconColor: 'var(--wp--preset--color--primary)',
  },
  secondary: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--secondary) 15%, transparent)',
    iconColor: 'var(--wp--preset--color--secondary)',
  },
  accent: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--primary) 10%, color-mix(in srgb, var(--wp--preset--color--secondary) 5%, transparent))',
    iconColor: 'var(--wp--preset--color--secondary)',
  },
};

const featuresGrid = SAAS_FEATURES.map((feature) => {
  const colors = COLOR_MAP[feature.colorType] || COLOR_MAP.primary;
  return `<!-- wp:group {"style":{"spacing":{"padding":{"top":"2rem","right":"2rem","bottom":"2rem","left":"2rem"}}}} -->
<div class="wp-block-group" style="padding:2rem;border-radius:1rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent);box-shadow:0 1px 2px rgba(0,0,0,0.05)">
<!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
<div class="wp-block-group" style="width:48px;height:48px;border-radius:12px;background-color:${colors.iconBg};display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;color:${colors.iconColor}">
<svg style="width:24px;height:24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">${feature.wpIconSvg}</svg>
</div>
<!-- /wp:group -->
<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.75rem"}}}} -->
<h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;margin-bottom:0.75rem">${feature.title}</h3>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"color":{"text":"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}} -->
<p style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-size:0.875rem;line-height:1.625">${feature.description}</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->`;
}).join('\n');

export const SAAS_FRONT_PAGE_HTML = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"100%"}} -->
<main class="wp-block-group">

<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"8rem","bottom":"5rem"}}},"className":"relative overflow-hidden"} -->
<div class="wp-block-group relative overflow-hidden" style="padding-top:8rem;padding-bottom:5rem;position:relative">

   <!-- wp:group {"className":"saas-glow saas-glow--primary"} -->
   <div class="wp-block-group saas-glow saas-glow--primary" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background-color:var(--wp--preset--color--primary);opacity:0.15;filter:blur(120px);border-radius:50%;pointer-events:none;z-index:0"></div>
   <!-- /wp:group -->
   <!-- wp:group {"className":"saas-glow saas-glow--secondary"} -->
   <div class="wp-block-group saas-glow saas-glow--secondary" style="position:absolute;top:0;right:0;width:600px;height:600px;background-color:var(--wp--preset--color--secondary);opacity:0.15;filter:blur(120px);border-radius:50%;pointer-events:none;z-index:0"></div>
   <!-- /wp:group -->

   <!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center","alignItems":"center"},"style":{"spacing":{"blockGap":"0"}}} -->
   <div class="wp-block-group" style="position:relative;z-index:10;text-align:center">

      <!-- wp:group {"className":"saas-badge"} -->
      <div class="wp-block-group saas-badge" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;border-radius:9999px;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent);box-shadow:0 1px 2px rgba(0,0,0,0.05);margin-bottom:2rem;backdrop-filter:blur(4px)">
      <!-- wp:paragraph -->
      <p><span style="display:block;width:8px;height:8px;border-radius:50%;background-color:var(--wp--preset--color--primary)"></span><span style="font-size:0.875rem;font-weight:500;color:var(--wp--preset--color--contrast)">Introducing SaaSFlow 2.0</span></p>
      <!-- /wp:paragraph -->
      </div>
      <!-- /wp:group -->

      <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3rem, 6vw, 4.5rem)","fontWeight":"800","lineHeight":"1.1"}}} -->
      <h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3rem, 6vw, 4.5rem);font-weight:800;line-height:1.1;margin-bottom:2rem;max-width:1024px;margin-left:auto;margin-right:auto">Build faster with our <br><span style="background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">advanced platform</span></h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
      <p class="has-text-align-center" style="font-size:1.25rem;max-width:672px;margin:0 auto 3rem auto;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-weight:300;line-height:1.625">The complete toolkit for modern teams. Streamline your workflow, collaborate in real-time, and ship powerful products faster than ever before.</p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons">
         <!-- wp:button {"style":{"border":{"radius":"9999px"}},"backgroundColor":"primary","textColor":"base"} -->
         <div class="wp-block-button"><a class="wp-block-button__link has-base-color has-primary-background-color has-text-color has-background wp-element-button" style="border-radius:9999px;padding:16px 32px;font-weight:700;box-shadow: 0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 25%, transparent)">Start for free</a></div>
         <!-- /wp:button -->
         <!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"9999px"}}} -->
         <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" style="border-radius:9999px;padding:16px 32px;font-weight:500;background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)">View Documentation</a></div>
         <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->

      <!-- wp:group {"style":{"spacing":{"margin":{"top":"5rem"}}}} -->
      <div class="wp-block-group" style="margin-top:5rem;position:relative;max-width:1024px;margin-left:auto;margin-right:auto;width:100%">
         <!-- wp:group -->
         <div class="wp-block-group" style="border-radius:1rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent);backdrop-filter:blur(24px);box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden">
            <!-- wp:group {"className":"saas-browser-bar"} -->
            <div class="wp-block-group saas-browser-bar" style="height:3rem;border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);display:flex;align-items:center;padding:0 1rem;gap:0.5rem;background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)">
               <!-- wp:group -->
               <div class="wp-block-group" style="width:12px;height:12px;border-radius:50%;background-color:rgba(248, 113, 113, 0.8)"></div>
               <!-- /wp:group -->
               <!-- wp:group -->
               <div class="wp-block-group" style="width:12px;height:12px;border-radius:50%;background-color:rgba(251, 191, 36, 0.8)"></div>
               <!-- /wp:group -->
               <!-- wp:group -->
               <div class="wp-block-group" style="width:12px;height:12px;border-radius:50%;background-color:rgba(74, 222, 128, 0.8)"></div>
               <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
            <!-- wp:group -->
            <div class="wp-block-group" style="aspect-ratio:16/9;width:100%;background-image:url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&amp;w=2070&amp;auto=format&amp;fit=crop');background-size:cover;background-position:center;mix-blend-mode:multiply;opacity:0.9"></div>
            <!-- /wp:group -->
         </div>
         <!-- /wp:group -->
      </div>
      <!-- /wp:group -->
   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem"}}}} -->
<div class="wp-block-group" style="padding-top:3rem;padding-bottom:3rem;border-top:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);border-bottom:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent);">
   <!-- wp:paragraph {"align":"center"} -->
   <p class="has-text-align-center" style="font-size:0.875rem;font-weight:500;color:color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2rem">Trusted by innovative teams worldwide</p>
   <!-- /wp:paragraph -->
   <!-- wp:group {"className":"saas-logos-grid"} -->
   <div class="wp-block-group saas-logos-grid" style="display:flex;flex-wrap:wrap;justify-content:center;gap:4rem;opacity:0.5;filter:grayscale(100%)">
      <!-- wp:group -->
      <div class="wp-block-group" style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1.25rem;color:var(--wp--preset--color--contrast)"><!-- wp:group -->
<div class="wp-block-group" style="width:32px;height:32px;border-radius:4px;background-color:var(--wp--preset--color--contrast);display:flex;align-items:center;justify-content:center;color:var(--wp--preset--color--base)">1</div>
<!-- /wp:group -->Company 1</div>
      <!-- /wp:group -->
      <!-- wp:group -->
      <div class="wp-block-group" style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1.25rem;color:var(--wp--preset--color--contrast)"><!-- wp:group -->
<div class="wp-block-group" style="width:32px;height:32px;border-radius:4px;background-color:var(--wp--preset--color--contrast);display:flex;align-items:center;justify-content:center;color:var(--wp--preset--color--base)">2</div>
<!-- /wp:group -->Company 2</div>
      <!-- /wp:group -->
      <!-- wp:group -->
      <div class="wp-block-group" style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1.25rem;color:var(--wp--preset--color--contrast)"><!-- wp:group -->
<div class="wp-block-group" style="width:32px;height:32px;border-radius:4px;background-color:var(--wp--preset--color--contrast);display:flex;align-items:center;justify-content:center;color:var(--wp--preset--color--base)">3</div>
<!-- /wp:group -->Company 3</div>
      <!-- /wp:group -->
      <!-- wp:group -->
      <div class="wp-block-group" style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1.25rem;color:var(--wp--preset--color--contrast)"><!-- wp:group -->
<div class="wp-block-group" style="width:32px;height:32px;border-radius:4px;background-color:var(--wp--preset--color--contrast);display:flex;align-items:center;justify-content:center;color:var(--wp--preset--color--base)">4</div>
<!-- /wp:group -->Company 4</div>
      <!-- /wp:group -->
      <!-- wp:group -->
      <div class="wp-block-group" style="display:flex;align-items:center;gap:0.5rem;font-weight:700;font-size:1.25rem;color:var(--wp--preset--color--contrast)"><!-- wp:group -->
<div class="wp-block-group" style="width:32px;height:32px;border-radius:4px;background-color:var(--wp--preset--color--contrast);display:flex;align-items:center;justify-content:center;color:var(--wp--preset--color--base)">5</div>
<!-- /wp:group -->Company 5</div>
      <!-- /wp:group -->
   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"8rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:8rem;position:relative;">

   <!-- wp:group {"layout":{"type":"constrained","contentSize":"768px"},"style":{"spacing":{"margin":{"bottom":"5rem"}}}} -->
   <div class="wp-block-group" style="margin-bottom:5rem">
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center" style="color:var(--wp--preset--color--primary);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Powerful Features</p>
      <!-- /wp:paragraph -->
      <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"clamp(2.25rem, 4vw, 3rem)","fontWeight":"700"}}} -->
      <h2 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.25rem, 4vw, 3rem);font-weight:700;margin-bottom:1.5rem">Everything you need to succeed</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center" style="font-size:1.125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625">We've built a comprehensive suite of tools designed to help you build, scale, and manage your product with ease.</p>
      <!-- /wp:paragraph -->
   </div>
   <!-- /wp:group -->

   <!-- wp:group {"className":"saas-features-grid"} -->
   <div class="wp-block-group saas-features-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:2rem">
${featuresGrid}
   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->



<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem;background-color:#09090b;color:#ffffff;position:relative;overflow:hidden;">
   <!-- wp:group {"className":"saas-glow saas-glow--testimonial"} -->
   <div class="wp-block-group saas-glow saas-glow--testimonial" style="position:absolute;right:0;bottom:0;width:600px;height:600px;background-color:var(--wp--preset--color--primary);opacity:0.2;filter:blur(100px);border-radius:50%;pointer-events:none"></div>
   <!-- /wp:group -->

   <!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":"4rem"}}} -->
   <div class="wp-block-columns alignwide are-vertically-aligned-center" style="gap:4rem">
      <!-- wp:column {"verticalAlignment":"center"} -->
      <div class="wp-block-column is-vertically-aligned-center">
         <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)","fontWeight":"700"}}} -->
         <h2 class="wp-block-heading" style="font-size:clamp(2rem, 4vw, 3rem);font-weight:700;margin-bottom:2rem">Loved by builders everywhere.</h2>
         <!-- /wp:heading -->

         <!-- wp:group -->
         <div class="wp-block-group" style="position:relative">
            <!-- wp:group -->
            <div class="wp-block-group"><svg style="position:absolute;top:-1.5rem;left:-2rem;width:4rem;height:4rem;color:var(--wp--preset--color--primary);opacity:0.3" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg></div>
            <!-- /wp:group -->
            <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.25rem","fontWeight":"500","lineHeight":"1.6"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
            <p style="font-size:1.25rem;font-weight:500;line-height:1.6;margin-bottom:2rem;position:relative;z-index:10">"Switching to SaaSFlow was the best decision we made this year. It allowed our team to ship features 40% faster and cut our infrastructure costs in half."</p>
            <!-- /wp:paragraph -->
            <!-- wp:group -->
            <div class="wp-block-group" style="display:flex;align-items:center;gap:1rem">
               <!-- wp:group -->
               <div class="wp-block-group" style="width:3.5rem;height:3.5rem;border-radius:50%;background-image:url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&amp;w=200&amp;auto=format&amp;fit=crop');background-size:cover;border:2px solid #27272a"></div>
               <!-- /wp:group -->
               <!-- wp:group -->
               <div class="wp-block-group">
                  <!-- wp:heading {"level":4,"style":{"typography":{"fontWeight":"700"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} -->
                  <h4 class="wp-block-heading" style="font-weight:700;margin:0">Sarah Jenkins</h4>
                  <!-- /wp:heading -->
                  <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem"},"spacing":{"margin":{"top":"0","bottom":"0"}}}} -->
                  <p style="color:#a1a1aa;font-size:0.875rem;margin:0">CTO at TechNova</p>
                  <!-- /wp:paragraph -->
               </div>
               <!-- /wp:group -->
            </div>
            <!-- /wp:group -->
         </div>
         <!-- /wp:group -->
      </div>
      <!-- /wp:column -->

      <!-- wp:column {"verticalAlignment":"center"} -->
      <div class="wp-block-column is-vertically-aligned-center">
         <!-- wp:group {"className":"saas-stats-grid"} -->
         <div class="wp-block-group saas-stats-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
            <!-- wp:group -->
            <div class="wp-block-group" style="background-color:rgba(39,39,42,0.5);backdrop-filter:blur(4px);padding:2rem;border-radius:1rem;border:1px solid rgba(63,63,70,0.5)">
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem","fontWeight":"800"}}} -->
               <p style="font-size:2.5rem;font-weight:800;color:var(--wp--preset--color--primary);margin-bottom:0.5rem">99.9%</p>
               <!-- /wp:paragraph -->
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"500"}}} -->
               <p style="color:#a1a1aa;font-weight:500;margin:0;font-size:0.875rem">Uptime</p>
               <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
            <!-- wp:group -->
            <div class="wp-block-group" style="background-color:rgba(39,39,42,0.5);backdrop-filter:blur(4px);padding:2rem;border-radius:1rem;border:1px solid rgba(63,63,70,0.5);transform:translateY(1.5rem)">
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem","fontWeight":"800"}}} -->
               <p style="font-size:2.5rem;font-weight:800;color:var(--wp--preset--color--primary);margin-bottom:0.5rem">10M+</p>
               <!-- /wp:paragraph -->
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"500"}}} -->
               <p style="color:#a1a1aa;font-weight:500;margin:0;font-size:0.875rem">Requests</p>
               <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
            <!-- wp:group -->
            <div class="wp-block-group" style="background-color:rgba(39,39,42,0.5);backdrop-filter:blur(4px);padding:2rem;border-radius:1rem;border:1px solid rgba(63,63,70,0.5)">
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem","fontWeight":"800"}}} -->
               <p style="font-size:2.5rem;font-weight:800;color:var(--wp--preset--color--secondary);margin-bottom:0.5rem">5,000+</p>
               <!-- /wp:paragraph -->
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"500"}}} -->
               <p style="color:#a1a1aa;font-weight:500;margin:0;font-size:0.875rem">Teams</p>
               <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
            <!-- wp:group -->
            <div class="wp-block-group" style="background-color:rgba(39,39,42,0.5);backdrop-filter:blur(4px);padding:2rem;border-radius:1rem;border:1px solid rgba(63,63,70,0.5);transform:translateY(1.5rem)">
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"2.5rem","fontWeight":"800"}}} -->
               <p style="font-size:2.5rem;font-weight:800;color:var(--wp--preset--color--secondary);margin-bottom:0.5rem">24/7</p>
               <!-- /wp:paragraph -->
               <!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem","fontWeight":"500"}}} -->
               <p style="color:#a1a1aa;font-weight:500;margin:0;font-size:0.875rem">Support</p>
               <!-- /wp:paragraph -->
            </div>
            <!-- /wp:group -->
         </div>
         <!-- /wp:group -->
      </div>
      <!-- /wp:column -->
   </div>
   <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"8rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:8rem;position:relative;">
   <!-- wp:group {"layout":{"type":"constrained","contentSize":"768px"},"style":{"spacing":{"margin":{"bottom":"4rem"}}}} -->
   <div class="wp-block-group" style="margin-bottom:4rem;text-align:center">
      <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"clamp(2.25rem, 4vw, 3rem)","fontWeight":"700"}}} -->
      <h2 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.25rem, 4vw, 3rem);font-weight:700;margin-bottom:1.5rem">Simple, transparent pricing</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center" style="font-size:1.125rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);line-height:1.625;margin-bottom:2rem">Choose the plan that best fits your needs. All plans include a 14-day free trial.</p>
      <!-- /wp:paragraph -->
      <!-- wp:group -->
      <div class="wp-block-group" style="display:inline-flex;align-items:center;padding:0.25rem;background-color:color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent);border-radius:9999px;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)">
         <!-- wp:buttons -->
         <div class="wp-block-buttons">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="padding:0.5rem 1.5rem;border-radius:9999px;background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);font-weight:500;font-size:0.875rem;border:none;box-shadow:0 1px 2px rgba(0,0,0,0.05)">Monthly</a></div>
            <!-- /wp:button -->
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="padding:0.5rem 1.5rem;border-radius:9999px;background-color:transparent;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-weight:500;font-size:0.875rem;border:none">Annually <span style="margin-left:0.25rem;font-size:0.75rem;color:var(--wp--preset--color--primary);font-weight:700">-20%</span></a></div>
            <!-- /wp:button -->
         </div>
         <!-- /wp:buttons -->
      </div>
      <!-- /wp:group -->
   </div>
   <!-- /wp:group -->

   <!-- wp:group {"className":"saas-pricing-grid"} -->
   <div class="wp-block-group saas-pricing-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:2rem;max-width:1024px;margin:0 auto;align-items:center">

      <!-- wp:group -->
      <div class="wp-block-group" style="padding:2rem;border-radius:1.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent);display:flex;flex-direction:column">
         <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
         <h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;color:var(--wp--preset--color--contrast);margin-bottom:0.5rem">Starter</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-size:0.875rem;margin-bottom:1.5rem">Perfect for side projects and small teams.</p>
         <!-- /wp:paragraph -->
         <!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
         <div class="wp-block-group" style="margin-bottom:1.5rem">
            <!-- wp:paragraph -->
            <p><span style="font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)">$19</span><span style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)">/mo</span></p>
            <!-- /wp:paragraph -->
         </div>
         <!-- /wp:group -->
         <!-- wp:buttons -->
         <div class="wp-block-buttons">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="display:block;width:100%;padding:0.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);font-weight:500;text-align:center;text-decoration:none;margin-bottom:2rem">Start Free Trial</a></div>
            <!-- /wp:button -->
         </div>
         <!-- /wp:buttons -->
         <!-- wp:list {"style":{"typography":{"fontSize":"0.875rem"}}} -->
         <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem;font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)">
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:#22c55e" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Up to 5 users</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:#22c55e" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Basic analytics</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:#22c55e" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Community support</li>
         </ul>
         <!-- /wp:list -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group -->
      <div class="wp-block-group" style="padding:2rem;border-radius:1.5rem;border:2px solid var(--wp--preset--color--primary);background-color:var(--wp--preset--color--base);display:flex;flex-direction:column;position:relative;box-shadow:0 20px 25px -5px color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent);transform:translateY(-1rem)">
         <!-- wp:group -->
         <div class="wp-block-group" style="position:absolute;top:-0.5rem;left:50%;transform:translateX(-50%);background-color:var(--wp--preset--color--primary);color:var(--wp--preset--color--base);font-size:0.75rem;font-weight:700;padding:0.25rem 0.75rem;border-radius:9999px;text-transform:uppercase;letter-spacing:0.05em">Most Popular</div>
         <!-- /wp:group -->
         <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
         <h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;color:var(--wp--preset--color--primary);margin-bottom:0.5rem">Professional</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-size:0.875rem;margin-bottom:1.5rem">For growing companies and established teams.</p>
         <!-- /wp:paragraph -->
         <!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
         <div class="wp-block-group" style="margin-bottom:1.5rem">
            <!-- wp:paragraph -->
            <p><span style="font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)">$49</span><span style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)">/mo</span></p>
            <!-- /wp:paragraph -->
         </div>
         <!-- /wp:group -->
         <!-- wp:buttons -->
         <div class="wp-block-buttons">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="display:block;width:100%;padding:0.75rem;border-radius:0.5rem;background-color:var(--wp--preset--color--primary);color:var(--wp--preset--color--base);font-weight:700;text-align:center;text-decoration:none;margin-bottom:2rem">Get Started</a></div>
            <!-- /wp:button -->
         </div>
         <!-- /wp:buttons -->
         <!-- wp:list {"style":{"typography":{"fontSize":"0.875rem"}}} -->
         <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem;font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)">
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Unlimited users</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Advanced analytics</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Priority email support</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Custom integrations</li>
         </ul>
         <!-- /wp:list -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group -->
      <div class="wp-block-group" style="padding:2rem;border-radius:1.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent);background-color:color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent);display:flex;flex-direction:column">
         <!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"1.25rem","fontWeight":"700"},"spacing":{"margin":{"bottom":"0.5rem"}}}} -->
         <h3 class="wp-block-heading" style="font-size:1.25rem;font-weight:700;color:var(--wp--preset--color--contrast);margin-bottom:0.5rem">Enterprise</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);font-size:0.875rem;margin-bottom:1.5rem">Custom solutions for large organizations.</p>
         <!-- /wp:paragraph -->
         <!-- wp:group {"style":{"spacing":{"margin":{"bottom":"1.5rem"}}}} -->
         <div class="wp-block-group" style="margin-bottom:1.5rem">
            <!-- wp:paragraph -->
            <p><span style="font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)">$99</span><span style="color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)">/mo</span></p>
            <!-- /wp:paragraph -->
         </div>
         <!-- /wp:group -->
         <!-- wp:buttons -->
         <div class="wp-block-buttons">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="display:block;width:100%;padding:0.75rem;border-radius:0.5rem;border:1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent);background-color:var(--wp--preset--color--base);color:var(--wp--preset--color--contrast);font-weight:500;text-align:center;text-decoration:none;margin-bottom:2rem">Contact Sales</a></div>
            <!-- /wp:button -->
         </div>
         <!-- /wp:buttons -->
         <!-- wp:list {"style":{"typography":{"fontSize":"0.875rem"}}} -->
         <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:1rem;font-size:0.875rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)">
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Everything in Pro</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Dedicated account manager</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> SLA guarantees</li>
            <li style="display:flex;align-items:center;gap:0.75rem"><svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> SSO &amp; Advanced Security</li>
         </ul>
         <!-- /wp:list -->
      </div>
      <!-- /wp:group -->

   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem;position:relative;overflow:hidden;background:linear-gradient(to bottom, transparent, color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent));">
   <!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"},"style":{"spacing":{"blockGap":"2rem"}}} -->
   <div class="wp-block-group" style="text-align:center;position:relative;z-index:10;">
      <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"clamp(2.25rem, 4vw, 3rem)","fontWeight":"700"}}} -->
      <h2 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.25rem, 4vw, 3rem);font-weight:700;margin-bottom:1.5rem">Ready to supercharge your workflow?</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center" style="font-size:1.25rem;color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent);margin-bottom:2.5rem">Join thousands of teams who are already building faster and better.</p>
      <!-- /wp:paragraph -->
      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons">
         <!-- wp:button {"style":{"border":{"radius":"9999px"}}} -->
         <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="border-radius:9999px;padding:16px 32px;font-weight:700;background-color:var(--wp--preset--color--contrast);color:var(--wp--preset--color--base);box-shadow:0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)">Get Started for Free</a></div>
         <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->

</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`;
