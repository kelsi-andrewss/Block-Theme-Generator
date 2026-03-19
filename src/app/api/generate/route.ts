import { enrichPrompt } from "@/lib/prompts/enrichment";
import { getProvider } from "@/lib/ai";
import { generateLightThemeJson, generateDarkMode } from "@/lib/generators/theme-json";
import { generateTemplates } from "@/lib/generators/templates";
import { generateParts } from "@/lib/generators/parts";
import { generatePatterns } from "@/lib/generators/patterns";
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
import { generateSkeletonPages } from "@/lib/generators/skeleton-pages";
import { validateBlockMarkup } from "@/lib/validation/block-validator";
import { auditThemeDesign } from "@/lib/validation/design-audit";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function mapToObject(map: Map<string, string>): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { description, archetype, style } = body as {
    description: string;
    archetype?: string;
    style?: string;
  };

  if (!description || typeof description !== "string" || !description.trim()) {
    return new Response(JSON.stringify({ error: "Description is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      try {
        // Step 1: Enrich
        send("step", { step: "enrich", status: "active", detail: "Analyzing your description..." });
        const enriched = enrichPrompt(description);
        const themeName = [style, enriched.archetype.name, "theme"]
          .filter(Boolean).join(" ");
        const themeSlug = slugify(themeName);

        const gapsFilled = Object.values(enriched.gaps).filter(g => !g.specified).length;
        send("step", {
          step: "enrich",
          status: "done",
          meta: { themeSlug, archetypeId: enriched.archetype.id },
          detail: `${enriched.archetype.name} archetype · ${enriched.flavorSeed.colorHarmony} palette · ${enriched.flavorSeed.typoPairingStyle} fonts${gapsFilled > 0 ? ` · ${gapsFilled} gaps auto-filled` : ""}`,
        });

        // Step 2: Get provider
        const provider = getProvider();

        // Step 3: Theme.json
        send("step", { step: "theme-json", status: "active", detail: "Creating color palette, typography scale, and layout..." });
        const themeJson = await generateLightThemeJson(enriched, provider);
        send("files", { type: "theme-json", content: JSON.stringify(themeJson, null, 2) });

        // Extract palette colors for the detail message
        const palette = (themeJson as Record<string, unknown>).settings as Record<string, unknown> | undefined;
        const colors = (palette?.color as Record<string, unknown>)?.palette as Array<{color: string; name: string}> | undefined;
        const colorPreview = colors?.slice(0, 3).map(c => c.color).join(", ") ?? "";
        const fontFamilies = (palette?.typography as Record<string, unknown>)?.fontFamilies as Array<{name: string}> | undefined;
        const fontPreview = fontFamilies?.map(f => f.name).join(" + ") ?? "";
        send("step", {
          step: "theme-json",
          status: "done",
          detail: [colorPreview && `Colors: ${colorPreview}`, fontPreview && `Fonts: ${fontPreview}`].filter(Boolean).join(" · ") || "Theme configuration ready",
        });

        // Steps 4-7: Dark mode + load standard templates + parts
        send("step", { step: "templates", status: "active", detail: "Generating page layouts (AI-powered front page)..." });
        send("step", { step: "parts", status: "active", detail: "Structuring responsive header/footer" });
        send("step", { step: "patterns", status: "active", detail: "Skipping pattern injection (handled by layout)" });

        const [darkMode, templates, parts, patterns] = await Promise.all([
          generateDarkMode(themeJson, provider).then(r => {
            send("files", { type: "dark-mode", content: JSON.stringify(r, null, 2) });
            send("step", { step: "dark-mode", status: "done", detail: "Dark color variant ready" });
            return r;
          }),
          generateTemplates(enriched, themeJson, provider).then(r => {
            send("files", { type: "templates", files: mapToObject(r) });
            send("step", { step: "templates", status: "done", detail: `${r.size} templates built` });
            return r;
          }),
          generateParts(enriched, themeJson, provider).then(r => {
            send("files", { type: "parts", files: mapToObject(r) });
            send("step", { step: "parts", status: "done", detail: `${r.size} template parts built` });
            return r;
          }),
          generatePatterns(enriched, themeJson, provider).then(r => {
            send("files", { type: "patterns", files: mapToObject(r) });
            send("step", { step: "patterns", status: "done", detail: "Pattern generation bypassed." });
            return r;
          }),
        ]);

        // Step 8: Skeleton pages
        send("step", { step: "skeleton-pages", status: "active", detail: "Generating content pages..." });
        const skeletonPages = generateSkeletonPages(enriched.archetype.id);
        const skeletonMarkup = new Map<string, string>();
        const skeletonPayload: Record<string, { title: string; slug: string; content: string }> = {};
        for (const [slug, page] of skeletonPages) {
          skeletonMarkup.set(slug, page.content);
          skeletonPayload[slug] = { title: page.title, slug: page.slug, content: page.content };
        }
        send("files", { type: "skeleton-pages", files: skeletonPayload });
        send("step", {
          step: "skeleton-pages",
          status: "done",
          detail: `${skeletonPages.size} content pages generated`,
        });

        // Step 9: Validate
        send("step", { step: "validate", status: "active", detail: "Checking block markup, WCAG contrast, typography..." });
        const validationErrors: string[] = [];
        const allMarkup = new Map([...templates, ...parts, ...skeletonMarkup]);
        for (const [filename, content] of allMarkup) {
          const result = validateBlockMarkup(content);
          if (!result.valid) {
            validationErrors.push(`${filename}: ${result.errors.map(e => e.message).join(", ")}`);
          }
        }
        for (const [filename, content] of patterns) {
          const markupStart = content.indexOf("?>");
          if (markupStart !== -1) {
            const markup = content.slice(markupStart + 2).trim();
            if (markup) {
              const result = validateBlockMarkup(markup);
              if (!result.valid) {
                validationErrors.push(`${filename}: ${result.errors.map(e => e.message).join(", ")}`);
              }
            }
          }
        }

        const audit = auditThemeDesign(themeJson);
        send("step", {
          step: "validate",
          status: "done",
          detail: `Score: ${audit.score}/100 (${audit.grade})${validationErrors.length > 0 ? ` · ${validationErrors.length} warnings` : ""}`,
        });

        // Step 10: Custom CSS (archetype-specific)
        const customCss = enriched.archetype.id === "saas"
          ? generateSaasCustomCss()
          : undefined;

        // Final result
        send("complete", {
          themeFiles: {
            themeJson: JSON.stringify(themeJson, null, 2),
            darkMode: JSON.stringify(darkMode, null, 2),
            templates: mapToObject(templates),
            parts: mapToObject(parts),
            patterns: mapToObject(patterns),
            skeletonPages: skeletonPayload,
            customCss,
          },
          audit,
          validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
          meta: {
            themeName: themeSlug,
            displayName: themeName.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            description: enriched.original,
          },
        });

        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        send("error", { error: message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
