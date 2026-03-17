export const SAAS_FRONT_PAGE_HTML = `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"100%"}} -->
<main class="wp-block-group">

<!-- Hero Section -->
<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"8rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:8rem;padding-bottom:6rem">
   <!-- wp:paragraph {"align":"center"} -->
   <p class="has-text-align-center"><span style="background-color:rgba(59, 130, 246, 0.1);color:#3b82f6;padding:4px 12px;border-radius:9999px;font-size:0.875rem;font-weight:500">v1.0 is now live</span></p>
   <!-- /wp:paragraph -->
   
   <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(3rem, 6vw, 4.5rem)","fontWeight":"700","lineHeight":"1.1"}}} -->
   <h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(3rem, 6vw, 4.5rem);font-weight:700;line-height:1.1;margin-top:1rem;margin-bottom:1.5rem">Design WordPress themes<br>at the speed of thought.</h1>
   <!-- /wp:heading -->
   
   <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->
   <p class="has-text-align-center" style="font-size:1.25rem;max-width:800px;margin:0 auto;opacity:0.8;margin-bottom:2.5rem">Describe your ideal website, and our AI will generate a complete, production-ready Block Theme in seconds. Fully responsive, natively built, and instantly previewable.</p>
   <!-- /wp:paragraph -->
   
   <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
   <div class="wp-block-buttons">
      <!-- wp:button {"style":{"border":{"radius":"9999px"}},"backgroundColor":"primary","textColor":"base"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-base-color has-primary-background-color has-text-color has-background wp-element-button" style="border-radius:9999px;padding:16px 32px">Generate Your Theme</a></div>
      <!-- /wp:button -->
      <!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"9999px"}}} -->
      <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" style="border-radius:9999px;padding:16px 32px">View Features</a></div>
      <!-- /wp:button -->
   </div>
   <!-- /wp:buttons -->
</div>
<!-- /wp:group -->

<!-- Mock UI Preview -->
<!-- wp:group {"layout":{"type":"constrained","contentSize":"1000px"},"style":{"spacing":{"padding":{"bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-bottom:6rem">
   <!-- wp:group {"style":{"border":{"radius":"16px","color":"var(--wp--preset--color--secondary)","width":"1px","style":"solid"}}} -->
   <div class="wp-block-group" style="border-color:var(--wp--preset--color--secondary);border-style:solid;border-width:1px;border-radius:16px;background-color:#fafafa;overflow:hidden;box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
      <!-- Browser header -->
      <!-- wp:group {"style":{"spacing":{"padding":{"top":"12px","bottom":"12px","left":"16px","right":"16px"}},"border":{"bottom":{"color":"var(--wp--preset--color--secondary)","width":"1px","style":"solid"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
      <div class="wp-block-group" style="border-bottom-color:var(--wp--preset--color--secondary);border-bottom-style:solid;border-bottom-width:1px;padding-top:12px;padding-right:16px;padding-bottom:12px;padding-left:16px;background-color:#f5f5f5">
         <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"8px"}}} -->
         <div class="wp-block-group">
            <div style="width:12px;height:12px;border-radius:50%;background-color:#f87171"></div>
            <div style="width:12px;height:12px;border-radius:50%;background-color:#fbbf24"></div>
            <div style="width:12px;height:12px;border-radius:50%;background-color:#4ade80"></div>
         </div>
         <!-- /wp:group -->
      </div>
      <!-- /wp:group -->
      
      <!-- Content grid inside mock -->
      <!-- wp:columns {"style":{"spacing":{"padding":{"top":"32px","bottom":"32px","left":"32px","right":"32px"}}}} -->
      <div class="wp-block-columns" style="padding-top:32px;padding-right:32px;padding-bottom:32px;padding-left:32px;background-color:#ffffff">
         <!-- wp:column {"width":"33.33%"} -->
         <div class="wp-block-column" style="flex-basis:33.33%">
            <div style="height:64px;width:64px;border-radius:12px;background:rgba(59, 130, 246, 0.1);margin-bottom:24px"></div>
            <div style="height:16px;width:80%;background:#e5e7eb;border-radius:4px;margin-bottom:16px"></div>
            <div style="height:16px;width:60%;background:#f3f4f6;border-radius:4px;margin-bottom:32px"></div>
            <div style="height:140px;width:100%;border-radius:8px;border:1px solid #e5e7eb;background:white"></div>
         </div>
         <!-- /wp:column -->
         <!-- wp:column {"width":"66.66%"} -->
         <div class="wp-block-column" style="flex-basis:66.66%">
            <div style="height:320px;width:100%;background:#f3f4f6;border-radius:12px;border:1px solid #e5e7eb"></div>
         </div>
         <!-- /wp:column -->
      </div>
      <!-- /wp:columns -->
   </div>
   <!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- Features Section -->
<!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"6rem","bottom":"6rem"}}}} -->
<div class="wp-block-group" style="padding-top:6rem;padding-bottom:6rem">
   <!-- wp:heading {"textAlign":"center","level":2} -->
   <h2 class="wp-block-heading has-text-align-center">Everything you need to build stunning themes.</h2>
   <!-- /wp:heading -->
   <!-- wp:paragraph {"align":"center"} -->
   <p class="has-text-align-center" style="opacity:0.8;max-width:600px;margin:0 auto 4rem auto">Stop tweaking code and start designing. Our platform handles the complex architecture of WordPress Block Themes for you.</p>
   <!-- /wp:paragraph -->
   
   <!-- wp:columns -->
   <div class="wp-block-columns">
      <!-- wp:column -->
      <div class="wp-block-column" style="padding:32px;border:1px solid var(--wp--preset--color--secondary);border-radius:16px">
         <div style="height:48px;width:48px;border-radius:12px;background-color:var(--wp--preset--color--secondary);margin-bottom:24px"></div>
         <!-- wp:heading {"level":3} -->
         <h3 class="wp-block-heading">AI-Powered Generation</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p>Describe your brand, and our advanced LLM interprets your requirements into full semantic layouts.</p>
         <!-- /wp:paragraph -->
      </div>
      <!-- /wp:column -->
      <!-- wp:column -->
      <div class="wp-block-column" style="padding:32px;border:1px solid var(--wp--preset--color--secondary);border-radius:16px">
         <div style="height:48px;width:48px;border-radius:12px;background-color:var(--wp--preset--color--secondary);margin-bottom:24px"></div>
         <!-- wp:heading {"level":3} -->
         <h3 class="wp-block-heading">Instant Live Previews</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p>See exactly what your theme looks like through the embedded WordPress Playground. No server required.</p>
         <!-- /wp:paragraph -->
      </div>
      <!-- /wp:column -->
      <!-- wp:column -->
      <div class="wp-block-column" style="padding:32px;border:1px solid var(--wp--preset--color--secondary);border-radius:16px">
         <div style="height:48px;width:48px;border-radius:12px;background-color:var(--wp--preset--color--secondary);margin-bottom:24px"></div>
         <!-- wp:heading {"level":3} -->
         <h3 class="wp-block-heading">Native Block Compatibility</h3>
         <!-- /wp:heading -->
         <!-- wp:paragraph -->
         <p>Generates pure theme.json and core block HTML patterns. No bloated plugins or external page builders.</p>
         <!-- /wp:paragraph -->
      </div>
      <!-- /wp:column -->
   </div>
   <!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- CTA Section -->
<!-- wp:group {"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained","contentSize":"100%"},"style":{"spacing":{"padding":{"top":"8rem","bottom":"8rem"}}}} -->
<div class="wp-block-group has-base-color has-primary-background-color has-text-color has-background alignfull" style="padding-top:8rem;padding-bottom:8rem">
   <!-- wp:heading {"textAlign":"center","level":2,"style":{"typography":{"fontSize":"clamp(2rem, 4vw, 3rem)"}}} -->
   <h2 class="wp-block-heading has-text-align-center" style="font-size:clamp(2rem, 4vw, 3rem)">Ready to create your next masterpiece?</h2>
   <!-- /wp:heading -->
   <!-- wp:paragraph {"align":"center"} -->
   <p class="has-text-align-center" style="opacity:0.9;max-width:600px;margin:1rem auto 2.5rem auto;font-size:1.25rem">Join thousands of creators who are supercharging their WordPress workflow with AI-driven design capabilities.</p>
   <!-- /wp:paragraph -->
   <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
   <div class="wp-block-buttons">
      <!-- wp:button {"style":{"border":{"radius":"9999px"}},"backgroundColor":"base","textColor":"primary"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-base-background-color has-text-color has-background wp-element-button" style="border-radius:9999px;padding:16px 32px;font-weight:bold">Start Generating for Free</a></div>
      <!-- /wp:button -->
   </div>
   <!-- /wp:buttons -->
</div>
<!-- /wp:group -->

</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`;
