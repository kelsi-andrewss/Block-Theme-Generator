"use client";

import { PREMADE_THEMES, type PremadeTheme } from "@/lib/premade-themes";


interface TemplateGalleryProps {
  onSelectTheme: (theme: PremadeTheme) => void;
}

export default function TemplateGallery({
  onSelectTheme,
}: TemplateGalleryProps) {
  // We only have the SaaS archetype now
  const saasTheme = PREMADE_THEMES[0];



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left space-y-3 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Template Library
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Start with a production-ready blueprint. Select a template and use AI to customize the branding instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* SaaS Template Card */}
        <div className="relative group rounded-xl border-2 border-blue-500/50 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 p-5 shadow-sm transition-all hover:bg-white dark:hover:bg-zinc-800 cursor-pointer overflow-hidden ring-1 ring-blue-500/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150 group-hover:bg-blue-500/20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide uppercase">
                Active Selection
              </span>
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              {saasTheme.archetype.name} Blueprint
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              A high-converting, native WordPress block template. Interactive preview is active on the right canvas.
            </p>
            
            <button
              onClick={() => onSelectTheme(saasTheme)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
            >
              Generate with AI
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Coming Soon Templates */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 opacity-60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">
              Coming Soon
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Creator Portfolio</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Masonry grids, dynamic project layouts, and minimal typography.</p>
        </div>
        
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 opacity-60">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">
              Coming Soon
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">E-Commerce Storefront</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Product grids, cart slide-outs, and conversion-optimized checkout.</p>
        </div>
      </div>
    </div>
  );
}
