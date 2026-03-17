export async function generateParts(
  enrichedPrompt: any,
  themeJson: object,
  provider: any
): Promise<Map<string, string>> {
  const parts = new Map<string, string>();

  parts.set("header.html", `<!-- wp:group {"tagName":"header","layout":{"type":"constrained"}} -->
<header class="wp-block-group">
<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group" style="padding-top:1.5rem;padding-bottom:1.5rem">
<!-- wp:site-title {"level":0} /-->
<!-- wp:navigation {"layout":{"type":"flex","orientation":"horizontal"}} /-->
</div>
<!-- /wp:group -->
</header>
<!-- /wp:group -->`);

  parts.set("footer.html", `<!-- wp:group {"tagName":"footer","style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem","left":"2rem","right":"2rem"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained","contentSize":"100%"}} -->
<footer class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="padding-top:3rem;padding-right:2rem;padding-bottom:3rem;padding-left:2rem">
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
<!-- wp:site-title {"level":0,"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem"}}} -->
<p style="font-size:0.875rem">© ${new Date().getFullYear()} All rights reserved.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</footer>
<!-- /wp:group -->`);

  return parts;
}
