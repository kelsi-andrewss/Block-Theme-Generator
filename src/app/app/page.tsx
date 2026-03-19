"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import ThemePreview from "@/components/ThemePreview";
import ColorSwitcher from "@/components/ColorSwitcher";
import TemplateGallery from "@/components/TemplateGallery";
import IterationChat, { SelectedBlockEvent } from "@/components/IterationChat";
import type { ThemeArchetype } from "@/lib/prompts/archetypes";
import type { PremadeTheme } from "@/lib/premade-themes";
import { SAAS_FRONT_PAGE_HTML } from "@/lib/generators/saas-template";
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
import type { AuditResult } from "@/lib/validation/design-audit";

type AppStep = "input" | "generating" | "results";

interface ThemeFilesData {
  themeJson: string;
  darkMode: string;
  templates: Record<string, string>;
  parts: Record<string, string>;
  patterns: Record<string, string>;
  customCss?: string;
}

interface GenerationResult {
  themeFiles: ThemeFilesData;
  audit: AuditResult;
  meta: { themeName: string; displayName: string; description: string };
  validationErrors?: string[];
}

interface StepState {
  name: string;
  key: string;
  status: "pending" | "active" | "done" | "error";
  detail?: string;
}

const INITIAL_STEPS: StepState[] = [
  { name: "Enriching prompt", key: "enrich", status: "pending" },
  { name: "Generating theme.json", key: "theme-json", status: "pending" },
  { name: "Generating templates", key: "templates", status: "pending" },
  { name: "Generating parts", key: "parts", status: "pending" },
  { name: "Generating patterns", key: "patterns", status: "pending" },
  { name: "Validating & auditing", key: "validate", status: "pending" },
];

export default function Home() {
  const [step, setStep] = useState<AppStep>("input");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [pipelineSteps, setPipelineSteps] = useState<StepState[]>(INITIAL_STEPS);
  const [error, setError] = useState<string | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [themeSlug, setThemeSlug] = useState("generated-theme");
  const [archetypeId, setArchetypeId] = useState("blog");
  const themeSlugRef = useRef("generated-theme");

  // Tab State & Initial Data for the Form
  const [activeTab, setActiveTab] = useState<"generator" | "gallery">("generator");
  const [formKey, setFormKey] = useState(0); // Used to force remount GeneratorForm when initial data changes
  const [initialDesc, setInitialDesc] = useState("");
  const [initialArch, setInitialArch] = useState<string | null>(null);

  const [isIterating, setIsIterating] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlockEvent | null>(null);
  const [iframeState, setIframeState] = useState<{ isDarkMode: boolean; activeThemeId: string; activeFontId: string; colors: any } | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'BLOCK_SELECTED') {
        setSelectedBlock(event.data.payload);
      } else if (event.data?.type === 'TEMPLATE_STATE_CHANGE') {
        setIframeState(event.data.payload);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    setIsIterating(true);
    // Simulate iterative generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsIterating(false);
  }, []);

  const updateStep = useCallback((key: string, status: StepState["status"], detail?: string) => {
    setPipelineSteps(prev =>
      prev.map(s => (s.key === key ? { ...s, status, ...(detail !== undefined ? { detail } : {}) } : s))
    );
  }, []);

  async function handleSubmit(data: {
    description: string;
    archetype?: string;
    style?: string;
  }) {
    setStep("generating");
    setError(null);
    setResult({
      themeFiles: { themeJson: "", darkMode: "", templates: {}, parts: {}, patterns: {}, customCss: "" },
      audit: { score: 0, grade: "F", checks: [] },
      meta: { themeName: "generating", displayName: "Generating...", description: data.description }
    });
    setPipelineSteps(INITIAL_STEPS);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Generation failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;

          // Parse SSE format: "event: <type>\ndata: <json>"
          // Data is always a single line (JSON.stringify produces no newlines)
          const lines = event.split("\n");
          const eventLine = lines.find(l => l.startsWith("event: "));
          const dataLine = lines.find(l => l.startsWith("data: "));
          if (!eventLine || !dataLine) continue;

          const eventType = eventLine.slice(7);
          const eventData = dataLine.slice(6);
          const parsed = JSON.parse(eventData);

          if (eventType === "step") {
            updateStep(parsed.step, parsed.status, parsed.detail);

            // When enrich completes, configure the theme path
            if (parsed.step === "enrich" && parsed.status === "done" && parsed.meta?.themeSlug) {
              const slug = parsed.meta.themeSlug;
              setThemeSlug(slug);
              themeSlugRef.current = slug;
              setArchetypeId(parsed.meta.archetypeId ?? "blog");
            }
          } else if (eventType === "files") {
            if (parsed.type === "theme-json") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, themeJson: parsed.content } } : null);
            } else if (parsed.type === "templates" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, templates: { ...prev.themeFiles.templates, ...parsed.files } } } : null);
            } else if (parsed.type === "parts" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, parts: { ...prev.themeFiles.parts, ...parsed.files } } } : null);
            } else if (parsed.type === "patterns" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, patterns: { ...prev.themeFiles.patterns, ...parsed.files } } } : null);
            } else if (parsed.type === "dark-mode") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, darkMode: parsed.content } } : null);
            } else if (parsed.type === "custom-css") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, customCss: parsed.content } } : null);
            }
          } else if (eventType === "complete") {
            setResult(parsed as GenerationResult);
            setStep("results");
          } else if (eventType === "error") {
            throw new Error(parsed.error);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    }
  }

  async function handleDownload() {
    if (!result) return;
    setIsPackaging(true);
    try {
      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeFiles: result.themeFiles, meta: result.meta }),
      });
      if (!res.ok) throw new Error("Packaging failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.meta.themeName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsPackaging(false);
    }
  }

  async function handlePreview() {
    if (!result) return;
    setIsPreviewing(true);
    
    try {
      // 0. Sync WP Blueprint settings with the active layout toggles in the React Iframe (Dark Mode & Colors)
      let activeThemeJsonStr = result.themeFiles.themeJson;
      let activeDarkModeStr = result.themeFiles.darkMode;
      
      try {
        const parsedJson = JSON.parse(activeThemeJsonStr);
        
        // If dark mode is active, cleanly merge dark colors into the root theme.json so we don't lose typography/layout!
        if (iframeState?.isDarkMode && result.themeFiles.darkMode) {
          const parsedDark = JSON.parse(result.themeFiles.darkMode);
          if (parsedDark.settings?.color?.palette) {
            parsedJson.settings.color.palette = parsedDark.settings.color.palette;
          }
          if (parsedDark.styles?.color) {
            parsedJson.styles = parsedJson.styles || {};
            parsedJson.styles.color = parsedDark.styles.color;
          }
        }
        
        // Inject live color palette overrides
        if (iframeState?.colors) {
          const palette = parsedJson.settings?.color?.palette;
          if (Array.isArray(palette)) {
            const primary = palette.find((p: any) => p.slug === 'primary');
            if (primary && iframeState.colors.primary) primary.color = iframeState.colors.primary[500];
            
            const secondary = palette.find((p: any) => p.slug === 'secondary');
            if (secondary && iframeState.colors.secondary) secondary.color = iframeState.colors.secondary[500];
          }
        }

        // Inject live font overrides
        if (iframeState?.activeFontId) {
          const fontFamilies = parsedJson.settings?.typography?.fontFamilies;
          if (Array.isArray(fontFamilies)) {
            const fontMap: Record<string, string> = {
              'sans': 'Inter, ui-sans-serif, system-ui, sans-serif',
              'serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
              'mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
            };
            const activeFontFamily = fontMap[iframeState.activeFontId] || fontMap['sans'];
            
            const headingFont = fontFamilies.find((f: any) => f.slug === 'heading');
            if (headingFont) headingFont.fontFamily = activeFontFamily;
            
            const bodyFont = fontFamilies.find((f: any) => f.slug === 'body');
            if (bodyFont) bodyFont.fontFamily = activeFontFamily;
          }
        }

        activeThemeJsonStr = JSON.stringify(parsedJson, null, 2);
      } catch (e) {
        console.error("Failed to inject CSS palette variables into theme.json", e);
      }
      
      const exportedThemeFiles = {
        ...result.themeFiles,
        themeJson: activeThemeJsonStr,
        darkMode: activeDarkModeStr
      };

      // 1. Get the compiled zip blob
      const pkgRes = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeFiles: exportedThemeFiles, meta: result.meta }),
      });
      if (!pkgRes.ok) throw new Error("Packaging failed");
      const blob = await pkgRes.blob();
      
      // 2. Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        
        // 3. Generate blueprint using backend generator to get the Zip bundle
        const bpRes = await fetch("/api/blueprint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zipBase64: base64data,
            meta: result.meta,
            archetypeId,
            templateMarkup: Object.values(result.themeFiles.templates).join("\n") +
              "\n" + Object.values(result.themeFiles.parts).join("\n"),
          }),
        });
        
        if (!bpRes.ok) throw new Error("Blueprint generation failed");
        
        const { bundleBase64 } = await bpRes.json();
        
        // 4. Open WordPress Playground in a new tab using properly URL-encoded data URI
        const dataUri = `data:application/zip;base64,${bundleBase64}`;
        window.open(`https://playground.wordpress.net/?blueprint-url=${encodeURIComponent(dataUri)}`, "_blank");
        setIsPreviewing(false);
      };
      
      reader.onerror = () => {
        setIsPreviewing(false);
      };
    } catch (err) {
      console.error(err);
      setIsPreviewing(false);
    }
  }

  function handleStartOver() {
    setStep("input");
    setResult(null);
    setError(null);
    setPipelineSteps(INITIAL_STEPS);
    setInitialDesc("");
    setInitialArch(null);
    setFormKey(k => k + 1);
  }

  function handleSelectGalleryTheme(theme: PremadeTheme) {
    // Construct the static files
    const templates = {
      "index.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group">\n<!-- wp:heading {"level":1} -->\n<h1 class="wp-block-heading">Latest Posts</h1>\n<!-- /wp:heading -->\n</div>\n<!-- /wp:group -->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->\n<div class="wp-block-query">\n<!-- wp:post-template -->\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">\n<!-- wp:post-title {"isLink":true} /-->\n<!-- wp:post-date /-->\n<!-- wp:post-excerpt /-->\n</div>\n<!-- /wp:group -->\n<!-- /wp:post-template -->\n<!-- wp:query-pagination -->\n<!-- wp:query-pagination-previous /-->\n<!-- wp:query-pagination-numbers /-->\n<!-- wp:query-pagination-next /-->\n<!-- /wp:query-pagination -->\n<!-- wp:query-no-results -->\n<!-- wp:paragraph -->\n<p>No posts found.</p>\n<!-- /wp:paragraph -->\n<!-- /wp:query-no-results -->\n</div>\n<!-- /wp:query -->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "single.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:post-featured-image {"isLink":false,"align":"wide"} /-->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-title {"level":1} /-->\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group">\n<!-- wp:post-date /-->\n<!-- wp:post-author {"showAvatar":false,"showBio":false} /-->\n</div>\n<!-- /wp:group -->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-content /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "page.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:post-title {"level":1} /-->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-content /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "front-page.html": theme.id === "saas" ? SAAS_FRONT_PAGE_HTML : `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained","contentSize":"100%"}} -->\n<main class="wp-block-group">\n<!-- wp:cover {"dimRatio":50,"overlayColor":"base","isDark":false,"align":"full"} -->\n<div class="wp-block-cover alignfull has-base-background-color">\n<span aria-hidden="true" class="wp-block-cover__background has-base-background-color has-background-dim"></span>\n<div class="wp-block-cover__inner-container">\n<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->\n<div class="wp-block-group">\n<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2.5rem, 5vw, 4rem)","fontWeight":"700"}}} -->\n<h1 class="wp-block-heading has-text-align-center" style="font-size:clamp(2.5rem, 5vw, 4rem);font-weight:700">Digital experiences crafted for the modern web</h1>\n<!-- /wp:heading -->\n<!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.25rem"}}} -->\n<p class="has-text-align-center" style="font-size:1.25rem">We build beautiful, fast, and scalable solutions that help your business grow and reach new heights in the digital era.</p>\n<!-- /wp:paragraph -->\n<!-- wp:spacer {"height":"1.5rem"} -->\n<div style="height:1.5rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->\n<div class="wp-block-buttons">\n<!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Get Started</a></div>\n<!-- /wp:button -->\n<!-- wp:button {"className":"is-style-outline"} -->\n<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button">Learn More</a></div>\n<!-- /wp:button -->\n</div>\n<!-- /wp:buttons -->\n</div>\n<!-- /wp:group -->\n</div>\n</div>\n<!-- /wp:cover -->\n<!-- wp:spacer {"height":"6rem"} -->\n<div style="height:6rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"4rem","right":"2rem","bottom":"4rem","left":"2rem"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained"}} -->\n<div class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="padding-top:4rem;padding-right:2rem;padding-bottom:4rem;padding-left:2rem">\n<!-- wp:heading {"textAlign":"center","level":2} -->\n<h2 class="wp-block-heading has-text-align-center">Ready to accelerate your growth?</h2>\n<!-- /wp:heading -->\n<!-- wp:paragraph {"align":"center"} -->\n<p class="has-text-align-center">Join thousands of companies already building the future on our platform.</p>\n<!-- /wp:paragraph -->\n<!-- wp:spacer {"height":"1rem"} -->\n<div style="height:1rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->\n<div class="wp-block-buttons">\n<!-- wp:button {"className":"is-style-fill"} -->\n<div class="wp-block-button is-style-fill"><a class="wp-block-button__link wp-element-button">Start Free Trial</a></div>\n<!-- /wp:button -->\n</div>\n<!-- /wp:buttons -->\n</div>\n<!-- /wp:group -->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "404.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:heading {"textAlign":"center","level":1} -->\n<h1 class="wp-block-heading has-text-align-center">404 - Page Not Found</h1>\n<!-- /wp:heading -->\n<!-- wp:search {"showLabel":false,"buttonText":"Search"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "archive.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:query-title {"type":"archive","textAlign":"center"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "search.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:query-title {"type":"search","textAlign":"center"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
    };

    const parts = {
      "header.html": `<!-- wp:group {"tagName":"header","style":{"border":{"bottom":{"width":"1px","color":"rgba(255,255,255,0.05)"}},"spacing":{"padding":{"top":"0","right":"0","bottom":"0","left":"0"}}},"layout":{"type":"default"}} -->\n<header class="wp-block-group" style="border-bottom-width:1px;border-bottom-color:rgba(255,255,255,0.05);padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;width:100%;background-color:rgba(9,9,11,0.7);backdrop-filter:blur(24px);z-index:50;">\n<!-- wp:group {"style":{"spacing":{"padding":{"right":"1.5rem","left":"1.5rem"}}},"layout":{"type":"constrained","contentSize":"80rem"}} -->\n<div class="wp-block-group" style="padding-right:1.5rem;padding-left:1.5rem;max-width:80rem;margin:0 auto;">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group" style="display:flex;align-items:center;justify-content:space-between;height:5rem;">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group">\n<!-- wp:paragraph -->\n<p><a href="/" style="display:flex;align-items:center;gap:0.5rem;text-decoration:none;"><span style="width:2rem;height:2rem;border-radius:0.5rem;background-color:var(--wp--preset--color--primary);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700;box-shadow:0 10px 15px -3px rgba(59, 130, 246, 0.2);">S</span><span style="font-size:1.25rem;font-weight:700;color:#fff;letter-spacing:-0.025em;font-family:sans-serif;">SaaS<span style="color:var(--wp--preset--color--primary)">Flow</span></span></a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group" style="display:flex;align-items:center;gap:2rem;">\n<!-- wp:paragraph -->\n<p><a href="#features" style="font-size:0.875rem;font-weight:500;color:#a1a1aa;text-decoration:none;font-family:sans-serif;">Features</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#testimonials" style="font-size:0.875rem;font-weight:500;color:#a1a1aa;text-decoration:none;font-family:sans-serif;">Customers</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#pricing" style="font-size:0.875rem;font-weight:500;color:#a1a1aa;text-decoration:none;font-family:sans-serif;">Pricing</a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group" style="display:flex;align-items:center;gap:1.5rem;">\n<!-- wp:paragraph -->\n<p><a href="#login" style="font-size:0.875rem;font-weight:500;color:#a1a1aa;text-decoration:none;font-family:sans-serif;">Log in</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:buttons -->\n<div class="wp-block-buttons">\n<!-- wp:button {"style":{"border":{"radius":"9999px"}}} -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="#signup" style="font-size:0.875rem;font-weight:500;background-color:#fff;color:#18181b;padding:0.625rem 1.25rem;border-radius:9999px;text-decoration:none;font-family:sans-serif;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">Get Started</a></div>\n<!-- /wp:button -->\n</div>\n<!-- /wp:buttons -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n</header>\n<!-- /wp:group -->`,
      "footer.html": `<!-- wp:group {"tagName":"footer","style":{"border":{"top":{"width":"1px","color":"rgba(255,255,255,0.05)"}},"spacing":{"padding":{"top":"4rem","bottom":"2rem","right":"0","left":"0"}}},"layout":{"type":"default"}} -->\n<footer class="wp-block-group" style="border-top:1px solid rgba(255,255,255,0.05);background-color:#09090b;padding-top:4rem;padding-bottom:2rem;font-family:sans-serif;">\n<!-- wp:group {"style":{"spacing":{"padding":{"right":"1.5rem","left":"1.5rem"}}},"layout":{"type":"constrained","contentSize":"80rem"}} -->\n<div class="wp-block-group" style="max-width:80rem;margin:0 auto;padding:0 1.5rem;">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"}} -->\n<div class="wp-block-group" style="display:flex;flex-wrap:wrap;gap:3rem;margin-bottom:3rem;">\n<!-- wp:group {"layout":{"type":"default"}} -->\n<div class="wp-block-group" style="flex:2;min-width:250px;">\n<!-- wp:paragraph -->\n<p><a href="#" style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;text-decoration:none;"><span style="width:1.5rem;height:1.5rem;border-radius:0.375rem;background-color:var(--wp--preset--color--primary);display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:0.75rem;font-weight:700;">S</span><span style="font-size:1.125rem;font-weight:700;color:#fff;letter-spacing:-0.025em;">SaaSFlow</span></a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p style="font-size:0.875rem;color:#a1a1aa;max-width:20rem;line-height:1.6;margin:0;">Building the next generation of powerful, scalable SaaS tools for modern teams.</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"layout":{"type":"default"}} -->\n<div class="wp-block-group" style="flex:1;min-width:120px;">\n<!-- wp:heading {"level":3} -->\n<h3 style="font-weight:600;color:#fff;margin-bottom:1.5rem;font-size:0.875rem;line-height:1.2;margin-top:0;">Product</h3>\n<!-- /wp:heading -->\n<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="display:flex;flex-direction:column;gap:0.75rem;">\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Features</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Integrations</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Pricing</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Changelog</a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"layout":{"type":"default"}} -->\n<div class="wp-block-group" style="flex:1;min-width:120px;">\n<!-- wp:heading {"level":3} -->\n<h3 style="font-weight:600;color:#fff;margin-bottom:1.5rem;font-size:0.875rem;line-height:1.2;margin-top:0;">Company</h3>\n<!-- /wp:heading -->\n<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="display:flex;flex-direction:column;gap:0.75rem;">\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">About Us</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Careers</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Blog</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Contact</a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"layout":{"type":"default"}} -->\n<div class="wp-block-group" style="flex:1;min-width:120px;">\n<!-- wp:heading {"level":3} -->\n<h3 style="font-weight:600;color:#fff;margin-bottom:1.5rem;font-size:0.875rem;line-height:1.2;margin-top:0;">Legal</h3>\n<!-- /wp:heading -->\n<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="display:flex;flex-direction:column;gap:0.75rem;">\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Privacy Policy</a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="font-size:0.875rem;color:#a1a1aa;text-decoration:none;">Terms of Service</a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n<!-- wp:group {"style":{"border":{"top":{"width":"1px","color":"rgba(255,255,255,0.05)"}},"spacing":{"padding":{"top":"2rem"}}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group" style="border-top:1px solid rgba(255,255,255,0.05);padding-top:2rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">\n<!-- wp:paragraph -->\n<p style="font-size:0.875rem;color:#a1a1aa;margin:0;">\u00a9 2026 SaaSFlow Inc. All rights reserved.</p>\n<!-- /wp:paragraph -->\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group" style="display:flex;gap:1rem;">\n<!-- wp:paragraph -->\n<p><a href="#" style="color:#a1a1aa;"><svg style="width:1.25rem;height:1.25rem;" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg></a></p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p><a href="#" style="color:#a1a1aa;"><svg style="width:1.25rem;height:1.25rem;" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg></a></p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n</div>\n<!-- /wp:group -->\n</footer>\n<!-- /wp:group -->`
    };

    setThemeSlug(theme.id);
    themeSlugRef.current = theme.id;
    setArchetypeId(theme.id);

    const customCss = theme.id === "saas" ? generateSaasCustomCss() : undefined;

    // Instantly inject the statically generated template into the Result state and bypass the generation wait
    setResult({
      themeFiles: {
        themeJson: JSON.stringify(theme.themeJson, null, 2),
        darkMode: JSON.stringify(theme.darkMode, null, 2),
        templates,
        parts,
        patterns: {},
        customCss,
      },
      audit: {
        score: 100,
        grade: "A",
        checks: [
          { name: "Pre-made Template", passed: true, severity: "info", message: "Curated static template loaded." }
        ]
      },
      meta: {
        themeName: theme.id,
        displayName: theme.archetype.name,
        description: theme.archetype.description
      }
    });

    setPipelineSteps(INITIAL_STEPS.map(s => ({ ...s, status: "done" })));
    setStep("results");
  }

  function handleThemeJsonChange(newThemeStr: string) {
    if (!result) return;
    setResult({
      ...result,
      themeFiles: {
        ...result.themeFiles,
        themeJson: newThemeStr,
      },
    });
  }

  const currentStepIndex = pipelineSteps.findIndex(s => s.status === "active");

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Navbar - Fixed Height */}
      <nav className="shrink-0 w-full z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-all shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            ForgeTheme
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block">
            Home
          </Link>
          {step !== "input" && (
            <button
              onClick={handleStartOver}
              className="text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            >
              Start over
            </button>
          )}
        </div>
      </nav>

      {/* Main Split-Pane Content Area */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">
        {/* Left Sidebar Pane */}
        <aside className="w-[480px] shrink-0 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl z-20 flex flex-col">
          {step === "input" && (
            <>
              {/* Segmented Controls for Sidebar */}
              <div className="p-6 pb-2 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="inline-flex w-full items-center p-1 bg-zinc-100/50 dark:bg-zinc-950/50 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
                  <button
                    onClick={() => setActiveTab("generator")}
                    className={`flex-1 relative py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      activeTab === "generator"
                        ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    Theme Generator
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`flex-1 relative py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      activeTab === "gallery"
                        ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    Template Gallery
                  </button>
                </div>
              </div>
              
              {/* Form / Gallery Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab === "generator" ? (
                  <GeneratorForm 
                    key={formKey}
                    initialDescription={initialDesc}
                    initialArchetype={initialArch ?? undefined}
                    onSubmit={handleSubmit} 
                  />
                ) : (
                  <TemplateGallery onSelectTheme={handleSelectGalleryTheme} />
                )}
              </div>
            </>
          )}

          {(step === "generating" || step === "results") && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              {step === "generating" ? (
                <>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                    <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
                    Building Theme...
                  </h2>
                  <ProgressIndicator
                    currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
                    steps={pipelineSteps.map((s) => ({ name: s.name, status: s.status, detail: s.detail }))}
                  />
                  {error && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                      <p className="text-red-700 dark:text-red-400 text-sm font-medium mb-3">{error}</p>
                      <button
                        onClick={handleStartOver}
                        className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        Try again &rarr;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col h-full z-10">
                  <div className="flex-1 p-0 flex flex-col -m-6 mb-0 shadow-lg relative z-20">
                    {result && (
                      <IterationChat
                        onSendMessage={handleSendMessage}
                        onRegenerateLayout={() => {}}
                        isProcessing={isIterating}
                        selectedBlock={selectedBlock}
                        onClearSelection={() => setSelectedBlock(null)}
                      />
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={isPackaging || isPreviewing}
                      className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isPackaging ? "Packaging..." : "Download ZIP"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <button
                      onClick={handlePreview}
                      disabled={isPackaging || isPreviewing}
                      className="w-full py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isPreviewing ? "Generating Blueprint..." : "Preview in WordPress"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right Canvas Pane */}
        <section className="flex-1 relative overflow-hidden bg-white/50 dark:bg-zinc-950/50 flex flex-col">
          {/* Animated Glow Orbs copied precisely from landing page */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto pointer-events-none z-0">
            <div className="absolute -top-48 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-32 right-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/20 dark:bg-purple-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>

          <div className="flex-1 relative z-10 flex flex-col p-6 w-full h-full overflow-hidden">
            {step === "input" && activeTab === "generator" && (
              <div className="flex-1 flex flex-col justify-center items-center text-center opacity-90">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3 shadow-xl shadow-blue-500/5 mb-8 transform -rotate-3 hover:rotate-0 transition-all">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white max-w-2xl mb-6">
                  Forge your brand's digital identity {" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    instantly
                  </span>
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Start by describing your dream website on the left, or dive into one of our curated archetypes to spark your creativity.
                </p>
                <div className="mt-12 flex items-center justify-center gap-3 opacity-50 text-sm font-medium text-zinc-500 uppercase tracking-widest">
                  <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                  AI Powered Environment
                  <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                </div>
              </div>
            )}

            {step === "input" && activeTab === "gallery" && (
              <div className="flex-1 w-full h-full relative z-10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex-1 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                  {/* Mock Browser Header */}
                  <div className="h-14 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400 dark:bg-red-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-green-400 dark:bg-green-500/80 border border-black/10"></div>
                    </div>
                    <div className="ml-auto mr-auto px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-inner">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      forge-saas-blueprint.local
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950">
                    <iframe 
                      src="/templates/saas" 
                      className="w-full h-full border-0"
                      title="SaaS Template Preview"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === "generating" && !result && (
              <div className="flex-1 flex justify-center items-center">
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl max-w-sm w-full mx-auto">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/30 shadow-lg shadow-blue-500/10 mb-8 relative">
                    <svg className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin absolute" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">Booting Sandbox...</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Deploying virtual WordPress instance to preview your generated block theme in real-time.
                  </p>
                </div>
              </div>
            )}

            {step === "results" && result && (
              <div className="flex-1 w-full h-full relative z-10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex-1 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                  {/* Mock Browser Header */}
                  <div className="h-14 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400 dark:bg-red-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-green-400 dark:bg-green-500/80 border border-black/10"></div>
                    </div>
                    <div className="ml-auto mr-auto px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-inner">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      forge-{themeSlug || 'saas'}-blueprint.local
                    </div>
                  </div>
                  {/* Theme Preview Flex Container */}
                  <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950 relative z-0 overflow-hidden flex flex-col">
                    {(themeSlug && themeSlug !== "generated-theme") ? (
                      <iframe 
                        src={`/templates/${themeSlug}`}
                        className="w-full h-full border-0"
                        title={`${themeSlug} Template Iteration Preview`}
                      />
                    ) : (
                      <ThemePreview
                        themeJson={result?.themeFiles.darkMode || result?.themeFiles.themeJson}
                        templates={result?.themeFiles.templates}
                        parts={result?.themeFiles.parts}
                        patterns={result?.themeFiles.patterns}
                        customCss={result?.themeFiles.customCss}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
