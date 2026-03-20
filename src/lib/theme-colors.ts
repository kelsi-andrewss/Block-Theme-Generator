export interface ColorShades {
  400: string;
  500: string;
  700: string;
  900: string;
}

export interface ThemeColorSet {
  primary: ColorShades;
  secondary: ColorShades;
}

export interface WpLightPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface WpDarkPalette {
  base: string;
  contrast: string;
}

export interface ThemeColor {
  id: string;
  name: string;
  lightColors: ThemeColorSet;
  darkColors: ThemeColorSet;
  wpLight: WpLightPalette;
  wpDark: WpDarkPalette;
}

export const THEME_COLORS: ThemeColor[] = [
  {
    id: "default",
    name: "Nebula",
    lightColors: {
      primary: { 400: "#9333ea", 500: "#7e22ce", 700: "#6b21a8", 900: "#4c1d95" },
      secondary: { 400: "#2563eb", 500: "#1d4ed8", 700: "#1e40af", 900: "#1e3a8a" },
    },
    darkColors: {
      primary: { 400: "#c084fc", 500: "#a855f7", 700: "#7e22ce", 900: "#581c87" },
      secondary: { 400: "#60a5fa", 500: "#3b82f6", 700: "#1d4ed8", 900: "#1e3a8a" },
    },
    wpLight: { primary: "#7e22ce", secondary: "#1d4ed8", accent: "#10b981", background: "#ffffff", text: "#1e1b4b" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
  {
    id: "sunset",
    name: "Sunset",
    lightColors: {
      primary: { 400: "#ea580c", 500: "#c2410c", 700: "#9a3412", 900: "#7c2d12" },
      secondary: { 400: "#e11d48", 500: "#be123c", 700: "#9f1239", 900: "#881337" },
    },
    darkColors: {
      primary: { 400: "#fb923c", 500: "#f97316", 700: "#c2410c", 900: "#7c2d12" },
      secondary: { 400: "#fb7185", 500: "#f43f5e", 700: "#be123c", 900: "#881337" },
    },
    wpLight: { primary: "#c2410c", secondary: "#be123c", accent: "#f59e0b", background: "#ffffff", text: "#1c1917" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
  {
    id: "forest",
    name: "Forest",
    lightColors: {
      primary: { 400: "#059669", 500: "#047857", 700: "#047857", 900: "#064e3b" },
      secondary: { 400: "#0d9488", 500: "#0f766e", 700: "#0f766e", 900: "#134e4a" },
    },
    darkColors: {
      primary: { 400: "#34d399", 500: "#10b981", 700: "#047857", 900: "#064e3b" },
      secondary: { 400: "#2dd4bf", 500: "#14b8a6", 700: "#0f766e", 900: "#134e4a" },
    },
    wpLight: { primary: "#047857", secondary: "#0f766e", accent: "#f59e0b", background: "#ffffff", text: "#1e293b" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
  {
    id: "ocean",
    name: "Ocean",
    lightColors: {
      primary: { 400: "#0891b2", 500: "#0e7490", 700: "#0e7490", 900: "#164e63" },
      secondary: { 400: "#2563eb", 500: "#1d4ed8", 700: "#1d4ed8", 900: "#1e3a8a" },
    },
    darkColors: {
      primary: { 400: "#22d3ee", 500: "#06b6d4", 700: "#0e7490", 900: "#164e63" },
      secondary: { 400: "#60a5fa", 500: "#3b82f6", 700: "#1d4ed8", 900: "#1e3a8a" },
    },
    wpLight: { primary: "#0e7490", secondary: "#1d4ed8", accent: "#f59e0b", background: "#ffffff", text: "#1e293b" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
  {
    id: "cherry",
    name: "Cherry",
    lightColors: {
      primary: { 400: "#db2777", 500: "#be185d", 700: "#9d174d", 900: "#831843" },
      secondary: { 400: "#dc2626", 500: "#b91c1c", 700: "#991b1b", 900: "#7f1d1d" },
    },
    darkColors: {
      primary: { 400: "#f472b6", 500: "#ec4899", 700: "#be185d", 900: "#831843" },
      secondary: { 400: "#f87171", 500: "#ef4444", 700: "#b91c1c", 900: "#7f1d1d" },
    },
    wpLight: { primary: "#be185d", secondary: "#b91c1c", accent: "#f59e0b", background: "#ffffff", text: "#1e293b" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
  {
    id: "midnight",
    name: "Midnight",
    lightColors: {
      primary: { 400: "#4f46e5", 500: "#4338ca", 700: "#3730a3", 900: "#312e81" },
      secondary: { 400: "#475569", 500: "#334155", 700: "#1e293b", 900: "#0f172a" },
    },
    darkColors: {
      primary: { 400: "#818cf8", 500: "#6366f1", 700: "#4338ca", 900: "#312e81" },
      secondary: { 400: "#94a3b8", 500: "#64748b", 700: "#334155", 900: "#0f172a" },
    },
    wpLight: { primary: "#4338ca", secondary: "#334155", accent: "#f59e0b", background: "#ffffff", text: "#1e293b" },
    wpDark: { base: "#09090b", contrast: "#fafafa" },
  },
];

export function getThemeById(id: string): ThemeColor | undefined {
  return THEME_COLORS.find((t) => t.id === id);
}
