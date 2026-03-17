"use client";

import { PREMADE_THEMES, type PremadeTheme } from "@/lib/premade-themes";
import ThemePreview from "@/components/ThemePreview";
import { SAAS_FRONT_PAGE_HTML } from "@/lib/generators/saas-template";

interface TemplateGalleryProps {
  onSelectTheme: (theme: PremadeTheme) => void;
}

export default function TemplateGallery({
  onSelectTheme,
}: TemplateGalleryProps) {
  // We only have the SaaS archetype now
  const saasTheme = PREMADE_THEMES[0];

  const templates = {
    "front-page.html": SAAS_FRONT_PAGE_HTML,
    "index.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group">\n<!-- wp:heading {"level":1} -->\n<h1 class="wp-block-heading">Latest Posts</h1>\n<!-- /wp:heading -->\n</div>\n<!-- /wp:group -->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->\n<div class="wp-block-query">\n<!-- wp:post-template -->\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">\n<!-- wp:post-title {"isLink":true} /-->\n<!-- wp:post-date /-->\n<!-- wp:post-excerpt /-->\n</div>\n<!-- /wp:group -->\n<!-- /wp:post-template -->\n<!-- wp:query-pagination -->\n<!-- wp:query-pagination-previous /-->\n<!-- wp:query-pagination-numbers /-->\n<!-- wp:query-pagination-next /-->\n<!-- /wp:query-pagination -->\n<!-- wp:query-no-results -->\n<!-- wp:paragraph -->\n<p>No posts found.</p>\n<!-- /wp:paragraph -->\n<!-- /wp:query-no-results -->\n</div>\n<!-- /wp:query -->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
  };

  const parts = {
    "header.html": `<!-- wp:group {"tagName":"header","layout":{"type":"constrained"}} -->\n<header class="wp-block-group">\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group" style="padding-top:1.5rem;padding-bottom:1.5rem">\n<!-- wp:site-title {"level":0} /-->\n<!-- wp:navigation {"layout":{"type":"flex","orientation":"horizontal"}} /-->\n</div>\n<!-- /wp:group -->\n</header>\n<!-- /wp:group -->`,
    "footer.html": `<!-- wp:group {"tagName":"footer","style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem","left":"2rem","right":"2rem"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained","contentSize":"100%"}} -->\n<footer class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="padding-top:3rem;padding-right:2rem;padding-bottom:3rem;padding-left:2rem">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group">\n<!-- wp:site-title {"level":0,"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->\n<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem"}}} -->\n<p style="font-size:0.875rem">© ${new Date().getFullYear()} All rights reserved.</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</footer>\n<!-- /wp:group -->`
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-sm">
          Interactive Gallery
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          The SaaS Blueprint
        </h2>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          A high-converting, native WordPress block template. Interact with the live preview below, then use AI to instantly customize the branding and copy.
        </p>
      </div>

      <div className="max-w-6xl mx-auto relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
        
        {/* Interactive Preview Container */}
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col">
          
          {/* Mock Browser Header */}
          <div className="h-14 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 justify-between shrink-0">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400 dark:bg-red-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400 dark:bg-green-500/80"></div>
            </div>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 min-w-48 justify-center shadow-inner">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              your-saas-theme.local
            </div>
            <div className="w-16"></div> {/* Spacer for symmetry */}
          </div>

          <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950 aspect-[16/9] lg:aspect-[21/9]">
            {/* The NativePreview wrapper has hardcoded height, we need a custom iframe here for full flexibility */}
            <div className="w-full h-full relative" style={{ minHeight: "600px" }}>
              <ThemePreview
                themeJson={JSON.stringify(saasTheme.themeJson)}
                templates={templates}
                parts={parts}
              />
            </div>
          </div>
          
          {/* Action Bar */}
          <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {saasTheme.archetype.name}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Optimized for conversion. Native block structure.
              </p>
            </div>
            <button
              onClick={() => onSelectTheme(saasTheme)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Generating
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
          Looking for a personal portfolio?
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Check out our brand new, highly customizable portfolio template built with Next.js and Tailwind.
        </p>
        <a 
          href="/templates/portfolio" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-zinc-200/50 dark:border-zinc-800/50 bg-white/5 shadow-sm text-sm font-medium rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
        >
          View Portfolio Template
          <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
