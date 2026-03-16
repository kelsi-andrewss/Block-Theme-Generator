import { NextResponse } from "next/server";
import { enrichPrompt } from "@/lib/prompts/enrichment";
import { auditThemeDesign } from "@/lib/validation/design-audit";

// TODO: Wire real pipeline once generator stories are merged.
// These imports will be uncommented when the modules exist:
// import { getProvider } from "@/lib/ai/provider";
// import { generateThemeJson } from "@/lib/generators/theme-json";
// import { generateTemplates } from "@/lib/generators/templates";
// import { generateParts } from "@/lib/generators/parts";
// import { generatePatterns } from "@/lib/generators/patterns";
// import { validateBlockMarkup } from "@/lib/validation/block-validator";
// import { packageTheme } from "@/lib/packaging/zip";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function buildMockThemeJson(themeName: string) {
  return {
    $schema: "https://schemas.wp.org/trunk/theme.json",
    version: 3,
    settings: {
      color: {
        palette: [
          { slug: "primary", color: "#1e293b", name: "Primary" },
          { slug: "secondary", color: "#f1f5f9", name: "Secondary" },
          { slug: "accent", color: "#3b82f6", name: "Accent" },
          { slug: "background", color: "#ffffff", name: "Background" },
          { slug: "foreground", color: "#1e293b", name: "Foreground" },
        ],
      },
      typography: {
        fontSizes: [
          { slug: "small", size: "14px", name: "Small" },
          { slug: "medium", size: "18px", name: "Medium" },
          { slug: "large", size: "24px", name: "Large" },
          { slug: "x-large", size: "36px", name: "Extra Large" },
          { slug: "xx-large", size: "48px", name: "Huge" },
        ],
      },
      spacing: {
        spacingSizes: [
          { slug: "10", size: "8px", name: "Small" },
          { slug: "20", size: "16px", name: "Medium" },
          { slug: "30", size: "24px", name: "Large" },
          { slug: "40", size: "32px", name: "XL" },
          { slug: "50", size: "48px", name: "XXL" },
        ],
      },
      layout: {
        contentSize: "800px",
        wideSize: "1200px",
      },
    },
    styles: {
      color: {
        text: "#1e293b",
        background: "#ffffff",
      },
      typography: {
        fontSize: "18px",
        lineHeight: "1.5",
      },
      elements: {
        heading: {
          color: { text: "#0f172a" },
          typography: { fontWeight: "700" },
        },
        h1: { typography: { fontSize: "48px" } },
        h2: { typography: { fontSize: "36px" } },
        h3: { typography: { fontSize: "24px" } },
        h4: { typography: { fontSize: "20px" } },
        link: {
          color: { text: "#3b82f6" },
        },
      },
    },
    templateParts: [
      { name: "header", title: "Header", area: "header" },
      { name: "footer", title: "Footer", area: "footer" },
    ],
    customTemplates: [
      { name: "blank", title: "Blank", postTypes: ["page", "post"] },
    ],
  };
}

// TODO: Replace with real ZIP packaging once packageTheme is available
function buildMockZipBase64(): string {
  return btoa("MOCK_ZIP_PLACEHOLDER");
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { description, archetype, style } = body as {
      description: string;
      archetype?: string;
      style?: string;
    };

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Step 1: Enrich prompt
    const enriched = enrichPrompt(description);

    // Build theme name from archetype + style
    const themeName = [
      style ?? enriched.archetype.id,
      archetype ?? enriched.archetype.name,
      "theme",
    ]
      .filter(Boolean)
      .join("-");
    const themeSlug = slugify(themeName);

    // TODO: Steps 2-6 will use real generators once merged.
    // For now, return mock data so the UI can be developed.
    const mockThemeJson = buildMockThemeJson(themeSlug);

    // Step 7: Audit the theme.json
    const audit = auditThemeDesign(mockThemeJson);

    // Step 8: Package (mock)
    const zip = buildMockZipBase64();

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      zip,
      audit,
      meta: {
        themeName: themeSlug,
        generationTime,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
