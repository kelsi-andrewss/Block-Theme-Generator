import { enrichPrompt } from "@/lib/prompts/enrichment";
import { getProvider } from "@/lib/ai";
import { generateLightThemeJson, generateDarkMode } from "@/lib/generators/theme-json";
import { generateTemplates } from "@/lib/generators/templates";
import { generateParts } from "@/lib/generators/parts";
import { generatePatterns } from "@/lib/generators/patterns";
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
        send("step", { step: "enrich", status: "active" });
        const enriched = enrichPrompt(description);
        const themeName = [style ?? enriched.archetype.id, archetype ?? enriched.archetype.name, "theme"]
          .filter(Boolean).join("-");
        const themeSlug = slugify(themeName);
        send("step", { step: "enrich", status: "done", meta: { themeSlug } });

        // Step 2: Get provider
        const provider = getProvider();

        // Step 3: Theme.json
        send("step", { step: "theme-json", status: "active" });
        const themeJson = await generateLightThemeJson(enriched, provider);
        send("files", { type: "theme-json", content: JSON.stringify(themeJson, null, 2) });
        send("step", { step: "theme-json", status: "done" });

        // Steps 4-7: Dark mode + templates + parts + patterns in parallel
        send("step", { step: "templates", status: "active" });
        send("step", { step: "parts", status: "active" });
        send("step", { step: "patterns", status: "active" });

        const [darkMode, templates, parts, patterns] = await Promise.all([
          generateDarkMode(themeJson, provider).then(r => {
            send("files", { type: "dark-mode", content: JSON.stringify(r, null, 2) });
            send("step", { step: "dark-mode", status: "done" });
            return r;
          }),
          generateTemplates(enriched, themeJson, provider).then(r => {
            send("files", { type: "templates", files: mapToObject(r) });
            send("step", { step: "templates", status: "done" });
            return r;
          }),
          generateParts(enriched, themeJson, provider).then(r => {
            send("files", { type: "parts", files: mapToObject(r) });
            send("step", { step: "parts", status: "done" });
            return r;
          }),
          generatePatterns(enriched, themeJson, provider).then(r => {
            send("files", { type: "patterns", files: mapToObject(r) });
            send("step", { step: "patterns", status: "done" });
            return r;
          }),
        ]);

        // Step 8: Validate
        send("step", { step: "validate", status: "active" });
        const validationErrors: string[] = [];
        const allMarkup = new Map([...templates, ...parts]);
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
        send("step", { step: "validate", status: "done" });

        // Final result
        send("complete", {
          themeFiles: {
            themeJson: JSON.stringify(themeJson, null, 2),
            darkMode: JSON.stringify(darkMode, null, 2),
            templates: mapToObject(templates),
            parts: mapToObject(parts),
            patterns: mapToObject(patterns),
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
