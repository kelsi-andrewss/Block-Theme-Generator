"use client";

import { useState, useEffect } from "react";

export interface GlobalPalette {
  name: string;
  category: "brand" | "fun";
  primary: string;
  secondary: string;
  accent: string;
  baseLight?: string;
  contrastLight?: string;
  baseDark?: string;
  contrastDark?: string;
}

const GLOBAL_PALETTES: GlobalPalette[] = [
  // Primary Families
  { name: "Ocean Blue", category: "brand", primary: "#2563eb", secondary: "#eff6ff", accent: "#f59e0b" },
  { name: "Forest Green", category: "brand", primary: "#166534", secondary: "#f0fdf4", accent: "#d97706" },
  { name: "Ruby Red", category: "brand", primary: "#dc2626", secondary: "#fef2f2", accent: "#1e40af" },
  { name: "Royal Purple", category: "brand", primary: "#7c3aed", secondary: "#f5f3ff", accent: "#10b981" },
  { name: "Monochrome", category: "brand", primary: "#171717", secondary: "#f5f5f5", accent: "#525252" },
  
  // Fun Themes
  { name: "Neon Cyberpunk", category: "fun", primary: "#ff00ff", secondary: "#1a0b2e", accent: "#00ffcc", baseDark: "#050014", contrastDark: "#f0f0ff" },
  { name: "Soft Pastel", category: "fun", primary: "#ffb7b2", secondary: "#e2f0cb", accent: "#ffdac1", baseLight: "#faf9f6", contrastLight: "#5c5c5c" },
  { name: "Retro Arcade", category: "fun", primary: "#ff0055", secondary: "#111122", accent: "#ffaa00", baseDark: "#111111", contrastDark: "#eeeeee" },
  { name: "Earthy Boho", category: "fun", primary: "#bc6c25", secondary: "#fefae0", accent: "#283618", baseLight: "#fefae0", contrastLight: "#283618", baseDark: "#283618", contrastDark: "#fefae0" },
];

interface ColorSwitcherProps {
  lightThemeJsonStr?: string;
  darkThemeJsonStr?: string;
  onThemeJsonChange: (newThemeStr: string) => void;
}

export default function ColorSwitcher({
  lightThemeJsonStr,
  darkThemeJsonStr,
  onThemeJsonChange,
}: ColorSwitcherProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activePalette, setActivePalette] = useState<GlobalPalette | null>(null);

  // When props change or dark mode toggles, we need to rebuild the base theme and apply the active palette
  useEffect(() => {
    reapplyTheme();
  }, [isDarkMode, lightThemeJsonStr, darkThemeJsonStr]);

  const reapplyTheme = (paletteOverride?: GlobalPalette | null) => {
    const targetPalette = paletteOverride !== undefined ? paletteOverride : activePalette;
    const baseStr = isDarkMode && darkThemeJsonStr ? darkThemeJsonStr : lightThemeJsonStr;
    
    if (!baseStr) return;

    try {
      const parsed = JSON.parse(baseStr);

      // If we have an active palette, inject its primary/secondary/accent colors
      // We also enforce clean Light/Dark mode backgrounds to ensure AI overrides don't ruin the color switch
      if (targetPalette && parsed.settings?.color?.palette) {
        const pArray = parsed.settings.color.palette;
        
        const updateOrAdd = (slug: string, color: string, name: string) => {
          const existing = pArray.find((c: any) => c.slug === slug);
          if (existing) {
            existing.color = color;
          } else {
            pArray.push({ slug, color, name });
          }
        };

        const activeBase = isDarkMode ? (targetPalette.baseDark || "#0f172a") : (targetPalette.baseLight || "#ffffff");
        const activeContrast = isDarkMode ? (targetPalette.contrastDark || "#f8fafc") : (targetPalette.contrastLight || "#0f172a");

        updateOrAdd("primary", targetPalette.primary, "Primary");
        updateOrAdd("secondary", targetPalette.secondary, "Secondary");
        updateOrAdd("accent", targetPalette.accent, "Accent");
        updateOrAdd("base", activeBase, "Background Base");
        updateOrAdd("contrast", activeContrast, "Text Contrast");
        
        // Ensure styles reference base/contrast for layout structural backgrounds
        if (!parsed.styles) parsed.styles = {};
        if (!parsed.styles.color) parsed.styles.color = {};
        parsed.styles.color.background = "var(--wp--preset--color--base)";
        parsed.styles.color.text = "var(--wp--preset--color--contrast)";
      }

      onThemeJsonChange(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.error("Failed to parse or mutate themeJson during color switch", e);
    }
  };

  const handleSelectPalette = (palette: GlobalPalette) => {
    setActivePalette(palette);
    reapplyTheme(palette);
  };

  if (!lightThemeJsonStr) return null;
  return (
    <div className="mb-8 space-y-6">
      
      {/* Light / Dark Mode Toggle */}
      {darkThemeJsonStr && (
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Theme Mode</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Switch between light and dark backgrounds</p>
          </div>
          <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-lg p-1">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${!isDarkMode ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Light
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${isDarkMode ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              Dark
            </button>
          </div>
        </div>
      )}

      {/* Brand Colors */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Brand Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {GLOBAL_PALETTES.filter(p => p.category === "brand").map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => handleSelectPalette(palette)}
              className={`group flex flex-col items-start p-3 rounded-lg border transition-all bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${activePalette?.name === palette.name ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500'}
              `}
            >
              <div className="flex w-full h-8 rounded-md shrink-0 mb-3 overflow-hidden shadow-sm border border-black/5 dark:border-white/5">
                <div className="w-full h-full" style={{ backgroundColor: palette.primary }} />
              </div>
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate w-full text-left">
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fun Themes */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
          Fun Variants
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GLOBAL_PALETTES.filter(p => p.category === "fun").map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => handleSelectPalette(palette)}
              className={`group flex flex-col items-start p-3 rounded-lg border transition-all bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${activePalette?.name === palette.name ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500'}
              `}
            >
              <div className="flex w-full h-8 rounded shrink-0 mb-3 overflow-hidden shadow-sm">
                <div className="w-1/3 h-full" style={{ backgroundColor: palette.primary }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: palette.secondary }} />
                <div className="w-1/3 h-full" style={{ backgroundColor: palette.accent }} />
              </div>
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate w-full text-left">
                {palette.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
