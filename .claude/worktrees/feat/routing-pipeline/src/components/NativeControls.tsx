"use client";

import { useState } from "react";
import { THEME_COLORS } from "@/lib/theme-colors";

const FONTS = [
  { id: "sans", name: "Sans" },
  { id: "serif", name: "Serif" },
  { id: "mono", name: "Mono" },
];

interface NativeControlsProps {
  onThemeChange: (themeId: string) => void;
  onFontChange: (fontId: string) => void;
  onDarkModeToggle: (isDark: boolean) => void;
  isDarkMode: boolean;
  activeThemeId?: string;
  activeFontId?: string;
}

export default function NativeControls({ 
  onThemeChange, 
  onFontChange, 
  onDarkModeToggle,
  isDarkMode,
  activeThemeId = "default",
  activeFontId = "sans"
}: NativeControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
      {isOpen && (
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 shadow-2xl w-64 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {THEME_COLORS.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  title={theme.name}
                  className={`w-10 h-10 rounded-full border-2 transition-all mx-auto ${activeThemeId === theme.id ? 'border-zinc-900 dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-105 shadow-sm'}`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.lightColors.primary[500]} 0%, ${theme.lightColors.secondary[500]} 100%)`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">Typography</h3>
            <div className="flex gap-2">
              {FONTS.map(font => (
                 <button
                   key={font.id}
                   onClick={() => onFontChange(font.id)}
                   className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${activeFontId === font.id ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-medium shadow-sm' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                 >
                   {font.name}
                 </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={() => onDarkModeToggle(!isDarkMode)}
          className="flex items-center justify-center w-12 h-12 bg-white border border-zinc-200/50 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/50 dark:text-white rounded-full shadow-lg hover:scale-105 transition-transform backdrop-blur-md"
          title="Toggle Light/Dark Mode"
        >
          {isDarkMode ? (
             <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
          ) : (
             <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
          )}
        </button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-white border border-zinc-200/50 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800/50 dark:text-white rounded-full shadow-lg hover:scale-105 transition-transform backdrop-blur-md"
          title="Customize Template"
        >
          <svg className="w-5 h-5 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
