"use client";

import { PREMADE_THEMES, type PremadeTheme } from "@/lib/premade-themes";

interface TemplateGalleryProps {
  onPreviewTheme: (theme: PremadeTheme) => void;
  onGenerateTheme: (theme: PremadeTheme) => void;
  activePreviewThemeId: string;
}

export default function TemplateGallery({
  onPreviewTheme,
  onGenerateTheme,
  activePreviewThemeId,
}: TemplateGalleryProps) {
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
        {PREMADE_THEMES.map((theme) => {
          const isActive = theme.id === activePreviewThemeId;
          return (
            <div
              key={theme.id}
              onClick={() => onPreviewTheme(theme)}
              className={`group rounded-xl border p-5 shadow-sm transition-all cursor-pointer overflow-hidden relative ${
                isActive
                  ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-900/5"
              }`}
            >
              {isActive && (
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:scale-150 group-hover:bg-blue-500/20"></div>
              )}
              {!isActive && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/0 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/5 group-hover:scale-150"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase transition-colors ${
                    isActive 
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 text-zinc-600 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}>
                    {isActive ? "Active Preview" : theme.archetype.name}
                  </span>
                  <svg className={`w-5 h-5 transition-colors ${isActive ? "text-blue-500" : "text-zinc-400 group-hover:text-blue-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  {theme.archetype.name} Blueprint
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                  {theme.archetype.description}
                </p>
                
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateTheme(theme);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                  >
                    Generate with AI
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
                {!isActive && (
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onPreviewTheme(theme);
                     }}
                     className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-lg font-medium transition-all active:scale-[0.98]"
                   >
                     Preview Template
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                     </svg>
                   </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
