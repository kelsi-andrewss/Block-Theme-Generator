import { ARCHETYPES, type ThemeArchetype } from "./prompts/archetypes";
import type { ThemeJson, DarkModeStyles } from "./schemas/theme-json";

export interface PremadeTheme {
  id: string;
  archetype: ThemeArchetype;
  themeJson: ThemeJson;
  darkMode: DarkModeStyles;
  image?: string; // Path to thumbnail
}

function generateBaseThemeJson(arch: ThemeArchetype): ThemeJson {
  const palette = arch.colorSuggestions[0] || {
    primary: "#3b82f6",
    secondary: "#eff6ff",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1e293b",
  };

  const fonts = arch.typographySuggestions[0] || {
    heading: "Inter",
    body: "Inter",
  };

  return {
    version: 3,
    title: arch.name,
    settings: {
      appearanceTools: true,
      color: {
        palette: [
          { name: "Primary", slug: "primary", color: palette.primary },
          { name: "Secondary", slug: "secondary", color: palette.secondary },
          { name: "Accent", slug: "accent", color: palette.accent },
          { name: "Base", slug: "base", color: palette.background },
          { name: "Contrast", slug: "contrast", color: palette.text },
        ],
      },
      typography: {
        defaultFontSizes: false,
        fontFamilies: [
          {
            name: "Heading Font",
            slug: "heading",
            fontFamily: `"${fonts.heading}", sans-serif`,
          },
          {
            name: "Body Font",
            slug: "body",
            fontFamily: `"${fonts.body}", sans-serif`,
          },
        ],
        fontSizes: [
          { name: "Small", slug: "small", size: "0.875rem" },
          { name: "Medium", slug: "medium", size: "1rem" },
          { name: "Large", slug: "large", size: "1.25rem" },
          { name: "X-Large", slug: "x-large", size: "1.5rem" },
          { name: "XX-Large", slug: "xx-large", size: "2.25rem" },
          { name: "XXX-Large", slug: "xxx-large", size: "3rem" },
        ],
      },
      layout: {
        contentSize: "800px",
        wideSize: "1200px",
      },
      spacing: {
        defaultSpacingSizes: false,
        spacingSizes: [
          { name: "1", slug: "10", size: "0.25rem" },
          { name: "2", slug: "20", size: "0.5rem" },
          { name: "3", slug: "30", size: "1rem" },
          { name: "4", slug: "40", size: "1.5rem" },
          { name: "5", slug: "50", size: "2rem" },
          { name: "6", slug: "60", size: "3rem" },
          { name: "7", slug: "70", size: "4rem" },
          { name: "8", slug: "80", size: "6rem" },
        ],
      },
    },
    styles: {
      color: {
        background: "var(--wp--preset--color--base)",
        text: "var(--wp--preset--color--contrast)",
      },
      typography: {
        fontFamily: "var(--wp--preset--font-family--body)",
        fontSize: "var(--wp--preset--font-size--medium)",
        lineHeight: "1.6",
      },
      elements: {
        heading: {
          typography: {
            fontFamily: "var(--wp--preset--font-family--heading)",
            lineHeight: "1.2",
            fontWeight: "700",
          },
          color: {
            text: "var(--wp--preset--color--contrast)",
          },
        },
        link: {
          color: {
            text: "var(--wp--preset--color--primary)",
          },
          typography: {
            textDecoration: "none",
          },
        },
        button: {
          color: {
            background: "var(--wp--preset--color--primary)",
            text: "var(--wp--preset--color--base)",
          },
          border: {
            radius: "0.375rem",
          },
          spacing: {
            padding: {
              top: "0.75rem",
              bottom: "0.75rem",
              left: "1.5rem",
              right: "1.5rem",
            },
          },
        },
      },
      blocks: {
        "core/group": {
          spacing: {
            padding: {
              top: "var(--wp--preset--spacing--60)",
              bottom: "var(--wp--preset--spacing--60)",
            },
          },
        },
        "core/site-title": {
          typography: {
            fontFamily: "var(--wp--preset--font-family--heading)",
            fontSize: "var(--wp--preset--font-size--large)",
            fontWeight: "bold",
          },
        },
      },
    },
  };
}

function generateDarkModeStyles(arch: ThemeArchetype): DarkModeStyles {
  const palette = arch.colorSuggestions[0] || {
    primary: "#3b82f6",
    secondary: "#eff6ff",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1e293b",
  };

  return {
    version: 3,
    title: "Dark",
    settings: {
      color: {
        palette: [
          { name: "Primary", slug: "primary", color: palette.primary },
          { name: "Secondary", slug: "secondary", color: palette.text }, // Darker secondary
          { name: "Accent", slug: "accent", color: palette.accent },
          { name: "Base", slug: "base", color: "#0f172a" }, // Dark background
          { name: "Contrast", slug: "contrast", color: "#f8fafc" }, // Light text
        ],
      },
    },
    styles: {
      color: {
        background: "var(--wp--preset--color--base)",
        text: "var(--wp--preset--color--contrast)",
      },
    },
  };
}

export const PREMADE_THEMES: PremadeTheme[] = ARCHETYPES.map((arch) => ({
  id: arch.id,
  archetype: arch,
  themeJson: generateBaseThemeJson(arch),
  darkMode: generateDarkModeStyles(arch),
  // Default to a placeholder if no screenshot exists yet
  image: `/thumbnails/${arch.id}.png`, 
}));
