import { enrichPrompt, type EnrichedPrompt } from "@/lib/prompts/enrichment";
import { getProvider } from "@/lib/ai";
import { generateLightThemeJson, generateDarkMode } from "@/lib/generators/theme-json";
import { generateTemplates } from "@/lib/generators/templates";
import { generateParts } from "@/lib/generators/parts";
import { generatePatterns } from "@/lib/generators/patterns";
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
import { generateSkeletonPages } from "@/lib/generators/skeleton-pages";
import { validateBlockMarkup } from "@/lib/validation/block-validator";
import { auditThemeDesign } from "@/lib/validation/design-audit";
import { classifyIntent } from "@/lib/ai/routers/intent";
import { populateSlots } from "@/lib/ai/routers/populate";
import { populateReactPages } from "@/lib/ai/routers/populate-ast";
import { SAAS_FRONT_PAGE_HTML, SAAS_HEADER_HTML, SAAS_FOOTER_HTML } from "@/lib/generators/saas-template";
import {
  SAAS_HEADER_JSX_SOURCE,
  SAAS_FOOTER_JSX_SOURCE,
  SAAS_404_JSX_SOURCE,
  SAAS_SIGNUP_JSX_SOURCE,
  SAAS_PRICING_JSX_SOURCE,
  SAAS_DOCS_JSX_SOURCE,
  SAAS_CONTACT_JSX_SOURCE,
  SAAS_JSX_SOURCE,
} from "@/app/templates/saas/jsx-sources";
import {
  PORTFOLIO_JSX_SOURCE, PORTFOLIO_HEADER_JSX_SOURCE, PORTFOLIO_FOOTER_JSX_SOURCE,
  PORTFOLIO_404_JSX_SOURCE, PORTFOLIO_ABOUT_JSX_SOURCE
} from "@/app/templates/portfolio/jsx-sources";
import {
  ECOMMERCE_JSX_SOURCE, ECOMMERCE_HEADER_JSX_SOURCE, ECOMMERCE_FOOTER_JSX_SOURCE,
  ECOMMERCE_SHOP_JSX_SOURCE, ECOMMERCE_404_JSX_SOURCE
} from "@/app/templates/ecommerce/jsx-sources";
import {
  BLOG_JSX_SOURCE, BLOG_HEADER_JSX_SOURCE, BLOG_FOOTER_JSX_SOURCE,
  BLOG_ARCHIVE_JSX_SOURCE, BLOG_404_JSX_SOURCE
} from "@/app/templates/blog/jsx-sources";
import {
  LOCAL_BUSINESS_JSX_SOURCE, LOCAL_BUSINESS_HEADER_JSX_SOURCE, LOCAL_BUSINESS_FOOTER_JSX_SOURCE,
  LOCAL_BUSINESS_SERVICES_JSX_SOURCE, LOCAL_BUSINESS_404_JSX_SOURCE
} from "@/app/templates/local-business/jsx-sources";
import { injectUids } from "@/lib/transpiler/ast-mutator";

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

async function retryWithConstraints<T>(
  fn: (negativeConstraints?: string[]) => Promise<T>,
  validate: (result: T) => string[],
  maxRetries: number = 2
): Promise<{ result: T; errors: string[] }> {
  let lastResult = await fn();
  let errors = validate(lastResult);

  let attempt = 0;
  while (errors.length > 0 && attempt < maxRetries) {
    attempt++;
    lastResult = await fn(errors);
    errors = validate(lastResult);
  }

  return { result: lastResult, errors };
}

function validateMarkupMap(files: Map<string, string>): string[] {
  const errors: string[] = [];
  for (const [filename, content] of files) {
    const result = validateBlockMarkup(content);
    if (!result.valid) {
      errors.push(`${filename}: ${result.errors.map(e => e.message).join(", ")}`);
    }
  }
  return errors;
}

function validatePatternMap(files: Map<string, string>): string[] {
  const errors: string[] = [];
  for (const [filename, content] of files) {
    const markupStart = content.indexOf("?>");
    if (markupStart !== -1) {
      const markup = content.slice(markupStart + 2).trim();
      if (markup) {
        const result = validateBlockMarkup(markup);
        if (!result.valid) {
          errors.push(`${filename}: ${result.errors.map(e => e.message).join(", ")}`);
        }
      }
    }
  }
  return errors;
}

function withNegativeConstraints(
  prompt: EnrichedPrompt,
  constraints?: string[]
): EnrichedPrompt {
  if (!constraints || constraints.length === 0) return prompt;
  const constraintBlock = [
    "\n\n## IMPORTANT: Previous attempt had these validation errors. Do NOT repeat them:",
    ...constraints.map(c => `- ${c}`),
  ].join("\n");
  return {
    ...prompt,
    enrichedDescription: prompt.enrichedDescription + constraintBlock,
    negativeConstraints: [...prompt.negativeConstraints, ...constraints],
  };
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

        // Step 4: Routing & Dark Mode
        let templates = new Map<string, string>();
        let parts = new Map<string, string>();
        let patterns = new Map<string, string>();
        const validationErrors: string[] = [];

        send("step", { step: "routing", status: "active", detail: "Classifying intent against template gallery..." });
        const intentResult = archetype ? { templateId: archetype } : await classifyIntent(description);
        send("step", { step: "routing", status: "done", meta: { templateId: intentResult.templateId }, detail: `Routed to template: ${intentResult.templateId}` });
        send("step", { step: "debug", status: "done", detail: `Debug Info: req=${JSON.stringify({archetype, templateId: intentResult.templateId})}` });

        const darkModePromise = generateDarkMode(themeJson, provider).then(r => {
          send("files", { type: "dark-mode", content: JSON.stringify(r, null, 2) });
          send("step", { step: "dark-mode", status: "done", detail: "Dark color variant ready" });
          return r;
        });

        send("step", { step: "templates", status: "active", detail: `Populating ${intentResult.templateId} template slots via AST...` });
        
        const validTemplateIds = ["saas", "portfolio", "ecommerce", "blog", "local-business"];
        const templateIdToUse = validTemplateIds.includes(intentResult.templateId) ? intentResult.templateId : "local-business";

        let rawPages: Record<string, string> = {};
        
        if (templateIdToUse === "saas") {
          rawPages = {
            home: SAAS_JSX_SOURCE, header: SAAS_HEADER_JSX_SOURCE, footer: SAAS_FOOTER_JSX_SOURCE,
            "404": SAAS_404_JSX_SOURCE, signup: SAAS_SIGNUP_JSX_SOURCE, pricing: SAAS_PRICING_JSX_SOURCE,
            docs: SAAS_DOCS_JSX_SOURCE, contact: SAAS_CONTACT_JSX_SOURCE,
          };
        } else if (templateIdToUse === "portfolio") {
          rawPages = {
            home: PORTFOLIO_JSX_SOURCE, header: PORTFOLIO_HEADER_JSX_SOURCE, footer: PORTFOLIO_FOOTER_JSX_SOURCE,
            "404": PORTFOLIO_404_JSX_SOURCE, about: PORTFOLIO_ABOUT_JSX_SOURCE,
          };
        } else if (templateIdToUse === "ecommerce") {
          rawPages = {
            home: ECOMMERCE_JSX_SOURCE, header: ECOMMERCE_HEADER_JSX_SOURCE, footer: ECOMMERCE_FOOTER_JSX_SOURCE,
            "404": ECOMMERCE_404_JSX_SOURCE, shop: ECOMMERCE_SHOP_JSX_SOURCE,
          };
        } else if (templateIdToUse === "blog") {
          rawPages = {
            home: BLOG_JSX_SOURCE, header: BLOG_HEADER_JSX_SOURCE, footer: BLOG_FOOTER_JSX_SOURCE,
            "404": BLOG_404_JSX_SOURCE, archive: BLOG_ARCHIVE_JSX_SOURCE,
          };
        } else if (templateIdToUse === "local-business") {
          rawPages = {
            home: LOCAL_BUSINESS_JSX_SOURCE, header: LOCAL_BUSINESS_HEADER_JSX_SOURCE, footer: LOCAL_BUSINESS_FOOTER_JSX_SOURCE,
            "404": LOCAL_BUSINESS_404_JSX_SOURCE, services: LOCAL_BUSINESS_SERVICES_JSX_SOURCE,
          };
        }

        const injectedPages: Record<string, string> = {};
        for (const [key, src] of Object.entries(rawPages)) {
          try { injectedPages[key] = injectUids(src); } catch { injectedPages[key] = src; }
        }
        
        const populatedJsxPages = await populateReactPages(enriched.original, injectedPages);
        
        send("files", { type: "jsx-pages", files: populatedJsxPages });
        send("step", { step: "templates", status: "done", detail: `${templateIdToUse} React templates populated` });

        send("step", { step: "parts", status: "active", detail: "Bypassing block HTML parts population..." });
        send("step", { step: "parts", status: "done", detail: "Block HTML handled client-side" });
        send("step", { step: "patterns", status: "active", detail: "Bypassing pattern injection..." });
        send("step", { step: "patterns", status: "done", detail: "Pattern injection bypassed" });

        const darkMode = await darkModePromise;

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

        // Step 9: Validate (re-validate all markup, including skeleton pages not covered by retry)
        send("step", { step: "validate", status: "active", detail: "Checking block markup, WCAG contrast, typography..." });

        for (const [filename, content] of skeletonMarkup) {
          const result = validateBlockMarkup(content);
          if (!result.valid) {
            validationErrors.push(`${filename}: ${result.errors.map(e => e.message).join(", ")}`);
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
