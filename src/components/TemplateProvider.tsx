"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { THEME_COLORS, type ThemeColor } from "@/lib/theme-colors";

const FONTS = [
  { id: "sans", name: "Sans" },
  { id: "serif", name: "Serif" },
  { id: "mono", name: "Mono" },
];

function applyCssVars(theme: ThemeColor, isDark: boolean) {
  const colors = isDark ? theme.darkColors : theme.lightColors;
  const style = document.documentElement.style;
  style.setProperty("--color-primary-400", colors.primary[400]);
  style.setProperty("--color-primary-500", colors.primary[500]);
  style.setProperty("--color-primary-700", colors.primary[700]);
  style.setProperty("--color-primary-900", colors.primary[900]);
  style.setProperty("--color-secondary-400", colors.secondary[400]);
  style.setProperty("--color-secondary-500", colors.secondary[500]);
  style.setProperty("--color-secondary-700", colors.secondary[700]);
  style.setProperty("--color-secondary-900", colors.secondary[900]);
}

export default function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(THEME_COLORS[0]);
  const [activeFont, setActiveFont] = useState(FONTS[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode Class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply active theme via data attribute and CSS custom properties
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme.id);
    applyCssVars(activeTheme, isDarkMode);
  }, [activeTheme, isDarkMode]);

  // Font family class logic
  const fontClass = activeFont.id === 'sans' ? 'font-sans' : activeFont.id === 'serif' ? 'font-serif' : 'font-mono';

  // Sync state upward to parent (used for WordPress blueprint generation)
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent !== window) {
      const colors = isDarkMode ? activeTheme.darkColors : activeTheme.lightColors;
      window.parent.postMessage({
        type: 'TEMPLATE_STATE_CHANGE',
        payload: {
          isDarkMode,
          activeThemeId: activeTheme.id,
          activeFontId: activeFont.id,
          colors
        }
      }, '*');
    }
  }, [isDarkMode, activeTheme, activeFont]);

  return (
    <div className={fontClass}>
      {children}

      {/* Floating Controls */}
      <div data-no-select="true" className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">

        {isOpen && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl w-64 animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {THEME_COLORS.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme)}
                    title={theme.name}
                    className={`w-10 h-10 rounded-full border-2 transition-all mx-auto ${activeTheme.id === theme.id ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.darkColors.primary[500]} 0%, ${theme.darkColors.secondary[500]} 100%)`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Typography</h3>
              <div className="flex gap-2">
                {FONTS.map(font => (
                   <button
                     key={font.id}
                     onClick={() => setActiveFont(font)}
                     className={`flex-1 py-1.5 rounded-md text-sm transition-colors ${activeFont.id === font.id ? 'bg-white text-black font-medium' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                   >
                     {font.name}
                   </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {/* Main Toggle Controls */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center w-12 h-12 bg-zinc-100 border border-zinc-200 text-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white rounded-full shadow-lg hover:scale-105 transition-transform"
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            ) : (
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
               </svg>
            )}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-12 h-12 bg-zinc-100 border border-zinc-200 text-black dark:bg-zinc-900 dark:border-zinc-800 dark:text-white rounded-full shadow-lg hover:scale-105 transition-transform"
            title="Customize Template"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
