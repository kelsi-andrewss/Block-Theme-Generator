import { describe, it, expect, vi } from "vitest";
import {
  detectArchetype,
  analyzeGaps,
  enrichPrompt,
} from "@/lib/prompts/enrichment";
import type { AIProvider } from "@/lib/ai/provider";
import {
  generateThemeJson,
  buildThemeJsonPrompt,
  buildDarkModePrompt,
} from "@/lib/generators/theme-json";
import type { ThemeJson } from "@/lib/schemas/theme-json";

describe("detectArchetype", () => {
  it("returns portfolio archetype for photography portfolio input", () => {
    const archetype = detectArchetype("photography portfolio");
    expect(archetype.id).toBe("portfolio");
  });

  it("returns saas archetype for SaaS startup pricing input", () => {
    const archetype = detectArchetype("SaaS startup pricing");
    expect(archetype.id).toBe("saas");
  });

  it("returns blog archetype for blog-related input", () => {
    const archetype = detectArchetype("personal blog about cooking");
    expect(archetype.id).toBe("blog");
  });

  it("returns restaurant archetype for food-related input", () => {
    const archetype = detectArchetype("restaurant menu and reservations");
    expect(archetype.id).toBe("restaurant");
  });

  it("returns first archetype as fallback when no keywords match", () => {
    const archetype = detectArchetype("xyzzy nonsense words");
    // Falls back to ARCHETYPES[0] which is portfolio
    expect(archetype).toBeDefined();
    expect(archetype.id).toBe("portfolio");
  });
});

describe("analyzeGaps", () => {
  it("identifies missing dimensions for a bare prompt", () => {
    const archetype = detectArchetype("photography portfolio");
    const gaps = analyzeGaps("photography portfolio", archetype);

    expect(gaps.audience.specified).toBe(false);
    expect(gaps.audience.suggestion).toBeTruthy();

    expect(gaps.aesthetic.specified).toBe(false);
    expect(gaps.aesthetic.suggestion).toBeTruthy();

    expect(gaps.palette.specified).toBe(false);
    expect(gaps.palette.suggestion).toBeTruthy();

    expect(gaps.typography.specified).toBe(false);
    expect(gaps.typography.suggestion).toBeTruthy();
  });

  it("recognizes specified aesthetic keywords", () => {
    const archetype = detectArchetype("minimal photography portfolio");
    const gaps = analyzeGaps("minimal photography portfolio", archetype);
    expect(gaps.aesthetic.specified).toBe(true);
  });

  it("recognizes specified color information", () => {
    const archetype = detectArchetype("portfolio");
    const gaps = analyzeGaps(
      "portfolio with dark mode and navy accents",
      archetype
    );
    expect(gaps.palette.specified).toBe(true);
  });

  it("recognizes specified typography information", () => {
    const archetype = detectArchetype("blog");
    const gaps = analyzeGaps("serif blog with Playfair headings", archetype);
    expect(gaps.typography.specified).toBe(true);
  });

  it("recognizes specified audience", () => {
    const archetype = detectArchetype("portfolio");
    const gaps = analyzeGaps(
      "portfolio for photographers and designers",
      archetype
    );
    expect(gaps.audience.specified).toBe(true);
  });
});

describe("enrichPrompt", () => {
  it("returns an EnrichedPrompt with non-empty enrichedDescription", () => {
    const result = enrichPrompt("dark photography blog");
    expect(result.enrichedDescription).toBeTruthy();
    expect(result.enrichedDescription.length).toBeGreaterThan(0);
  });

  it("preserves the original input", () => {
    const input = "dark photography blog";
    const result = enrichPrompt(input);
    expect(result.original).toBe(input);
  });

  it("detects an archetype", () => {
    const result = enrichPrompt("SaaS startup landing page");
    expect(result.archetype).toBeDefined();
    expect(result.archetype.id).toBe("saas");
  });

  it("includes negative constraints", () => {
    const result = enrichPrompt("portfolio site");
    expect(result.negativeConstraints).toBeDefined();
    expect(result.negativeConstraints.length).toBeGreaterThan(0);
  });

  it("includes a flavor seed with valid values", () => {
    const result = enrichPrompt("blog about travel");
    expect(result.flavorSeed).toBeDefined();
    expect(
      ["analogous", "complementary", "triadic", "split-complementary"]
    ).toContain(result.flavorSeed.colorHarmony);
    expect(
      ["serif-sans", "display-mono", "geometric-humanist"]
    ).toContain(result.flavorSeed.typoPairingStyle);
    expect(["airy", "balanced", "compact"]).toContain(
      result.flavorSeed.layoutDensity
    );
  });

  it("includes gap analysis", () => {
    const result = enrichPrompt("minimal agency site for designers");
    expect(result.gaps).toBeDefined();
    expect(result.gaps.aesthetic.specified).toBe(true);
    expect(result.gaps.audience.specified).toBe(true);
  });
});

describe("generateThemeJson with mock AIProvider", () => {
  const mockThemeJson: ThemeJson = {
    version: 3,
    settings: {
      color: {
        palette: [
          { slug: "primary", color: "#1a1a2e", name: "Primary" },
          { slug: "secondary", color: "#f0efe9", name: "Secondary" },
          { slug: "accent", color: "#e07a5f", name: "Accent" },
          { slug: "base", color: "#fafaf7", name: "Base" },
          { slug: "contrast", color: "#2d2d2d", name: "Contrast" },
        ],
      },
      typography: {
        fontFamilies: [
          {
            fontFamily: "Playfair Display",
            name: "Playfair Display",
            slug: "playfair-display",
          },
          {
            fontFamily: "Source Sans 3",
            name: "Source Sans 3",
            slug: "source-sans-3",
          },
        ],
        fontSizes: [
          { size: "0.875rem", slug: "small", name: "Small" },
          { size: "1rem", slug: "medium", name: "Medium" },
          { size: "1.5rem", slug: "large", name: "Large" },
          { size: "2rem", slug: "x-large", name: "X-Large" },
          { size: "3rem", slug: "xx-large", name: "XX-Large" },
        ],
      },
      spacing: {
        spacingSizes: [
          { size: "0.5rem", slug: "10", name: "Small" },
          { size: "1rem", slug: "20", name: "Medium" },
          { size: "1.5rem", slug: "30", name: "Large" },
          { size: "2rem", slug: "40", name: "XL" },
          { size: "3rem", slug: "50", name: "XXL" },
        ],
      },
      layout: {
        contentSize: "720px",
        wideSize: "1200px",
      },
      appearanceTools: true as const,
    },
    styles: {
      color: {
        background: "#fafaf7",
        text: "#2d2d2d",
      },
      typography: {
        fontFamily: "Source Sans 3",
        fontSize: "1rem",
        lineHeight: "1.5",
      },
    },
    templateParts: [
      { area: "header", name: "header", title: "Header" },
      { area: "footer", name: "footer", title: "Footer" },
    ],
  };

  const mockDarkMode = {
    version: 3 as const,
    title: "Dark",
    settings: {
      color: {
        palette: [
          { slug: "primary", color: "#e0dfd5", name: "Primary" },
          { slug: "secondary", color: "#1a1a2e", name: "Secondary" },
          { slug: "accent", color: "#e07a5f", name: "Accent" },
          { slug: "base", color: "#0f0f0f", name: "Base" },
          { slug: "contrast", color: "#e4e4e4", name: "Contrast" },
        ],
      },
    },
    styles: {
      color: {
        background: "#0f0f0f",
        text: "#e4e4e4",
      },
    },
  };

  it("calls generateJSON twice (theme + dark mode)", async () => {
    const generateJSON = vi.fn()
      .mockResolvedValueOnce(mockThemeJson)
      .mockResolvedValueOnce(mockDarkMode);

    const mockProvider: AIProvider = {
      generateJSON,
      generateText: vi.fn(),
    };

    const enriched = enrichPrompt("photography portfolio");
    const result = await generateThemeJson(enriched, mockProvider);

    expect(generateJSON).toHaveBeenCalledTimes(2);
    expect(result.themeJson).toEqual(mockThemeJson);
    expect(result.darkMode).toEqual(mockDarkMode);
  });

  it("passes enriched prompt content to the provider", async () => {
    const generateJSON = vi.fn()
      .mockResolvedValueOnce(mockThemeJson)
      .mockResolvedValueOnce(mockDarkMode);

    const mockProvider: AIProvider = {
      generateJSON,
      generateText: vi.fn(),
    };

    const enriched = enrichPrompt("SaaS startup pricing page");
    await generateThemeJson(enriched, mockProvider);

    const firstCallArgs = generateJSON.mock.calls[0];
    const prompt = firstCallArgs[0] as string;
    expect(prompt).toContain("SaaS startup pricing page");
  });

  it("second call receives the generated themeJson for dark mode prompt", async () => {
    const generateJSON = vi.fn()
      .mockResolvedValueOnce(mockThemeJson)
      .mockResolvedValueOnce(mockDarkMode);

    const mockProvider: AIProvider = {
      generateJSON,
      generateText: vi.fn(),
    };

    const enriched = enrichPrompt("photography portfolio");
    await generateThemeJson(enriched, mockProvider);

    const secondCallArgs = generateJSON.mock.calls[1];
    const darkPrompt = secondCallArgs[0] as string;
    // The dark mode prompt should contain the serialized theme JSON
    expect(darkPrompt).toContain('"version": 3');
  });
});

describe("buildThemeJsonPrompt", () => {
  it("includes archetype name in the prompt", () => {
    const enriched = enrichPrompt("photography portfolio");
    const prompt = buildThemeJsonPrompt(enriched);
    expect(prompt).toContain("Portfolio");
  });

  it("includes negative constraints", () => {
    const enriched = enrichPrompt("blog site");
    const prompt = buildThemeJsonPrompt(enriched);
    expect(prompt).toContain("wp:html");
  });
});

describe("buildDarkModePrompt", () => {
  it("includes the theme JSON in the prompt", () => {
    const themeJson = {
      version: 3,
      settings: { color: { palette: [] } },
    } as unknown as ThemeJson;
    const prompt = buildDarkModePrompt(themeJson);
    expect(prompt).toContain('"version": 3');
    expect(prompt).toContain("dark mode");
  });
});
