"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import type { AuditResult } from "@/lib/validation/design-audit";
import ThemePreview from "@/components/ThemePreview";
import ColorSwitcher from "@/components/ColorSwitcher";
import TemplateGallery from "@/components/TemplateGallery";
import type { ThemeArchetype } from "@/lib/prompts/archetypes";
import type { PremadeTheme } from "@/lib/premade-themes";
import { SAAS_FRONT_PAGE_HTML } from "@/lib/generators/saas-template";

type AppStep = "input" | "generating" | "results";

interface ThemeFilesData {
  themeJson: string;
  darkMode: string;
  templates: Record<string, string>;
  parts: Record<string, string>;
  patterns: Record<string, string>;
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
  const [themeSlug, setThemeSlug] = useState("generated-theme");
  const [archetypeId, setArchetypeId] = useState("blog");
  const themeSlugRef = useRef("generated-theme");

  // Tab State & Initial Data for the Form
  const [activeTab, setActiveTab] = useState<"generator" | "gallery">("generator");
  const [formKey, setFormKey] = useState(0); // Used to force remount GeneratorForm when initial data changes
  const [initialDesc, setInitialDesc] = useState("");
  const [initialArch, setInitialArch] = useState<string | null>(null);

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
      themeFiles: { themeJson: "", darkMode: "", templates: {}, parts: {}, patterns: {} },
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
      "header.html": `<!-- wp:group {"tagName":"header","layout":{"type":"constrained"}} -->\n<header class="wp-block-group">\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group" style="padding-top:1.5rem;padding-bottom:1.5rem">\n<!-- wp:site-title {"level":0} /-->\n<!-- wp:navigation {"layout":{"type":"flex","orientation":"horizontal"}} /-->\n</div>\n<!-- /wp:group -->\n</header>\n<!-- /wp:group -->`,
      "footer.html": `<!-- wp:group {"tagName":"footer","style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem","left":"2rem","right":"2rem"}}},"backgroundColor":"primary","textColor":"base","layout":{"type":"constrained","contentSize":"100%"}} -->\n<footer class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="padding-top:3rem;padding-right:2rem;padding-bottom:3rem;padding-left:2rem">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group">\n<!-- wp:site-title {"level":0,"style":{"typography":{"fontStyle":"normal","fontWeight":"700"}}} /-->\n<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.875rem"}}} -->\n<p style="font-size:0.875rem">© ${new Date().getFullYear()} All rights reserved.</p>\n<!-- /wp:paragraph -->\n</div>\n<!-- /wp:group -->\n</footer>\n<!-- /wp:group -->`
    };

    setThemeSlug(theme.id);
    themeSlugRef.current = theme.id;
    setArchetypeId(theme.id);

    // Instantly inject the statically generated template into the Result state and bypass the generation wait
    setResult({
      themeFiles: {
        themeJson: JSON.stringify(theme.themeJson, null, 2),
        darkMode: JSON.stringify(theme.darkMode, null, 2),
        templates,
        parts,
        patterns: {}
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
                <>
                  {result && (
                    <div className="mb-8">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 relative top-[0.5px]"></span>
                        Complete
                      </div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                        {result.meta.displayName}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        Theme successfully generated and analyzed. View detailed scores below.
                      </p>
                    </div>
                  )}
                  {result && (
                    <AuditResults
                      result={result.audit}
                      onDownload={handleDownload}
                      onPreview={() => {}} // Not used in split layout since it's always visible
                    />
                  )}
                  {isPackaging && (
                    <p className="text-center text-sm font-medium text-blue-600 dark:text-blue-400 mt-6 animate-pulse bg-blue-50 dark:bg-blue-500/10 py-2.5 rounded-xl border border-blue-100 dark:border-blue-500/20">
                      Packaging ZIP for download...
                    </p>
                  )}
                </>
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
              <div className="flex-1 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                {/* Embedded Browser Header */}
                <div className="h-14 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-400 border border-black/10" />
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-black/10" />
                      <div className="w-3 h-3 rounded-full bg-green-400 border border-black/10" />
                    </div>
                    <div className="px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      local_sandbox_env:3000
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ColorSwitcher 
                      lightThemeJsonStr={result.themeFiles.themeJson}
                      darkThemeJsonStr={result.themeFiles.darkMode}
                      onThemeJsonChange={handleThemeJsonChange}
                    />
                  </div>
                </div>
                {/* Theme Preview Flex Container */}
                <div className="flex-1 w-full bg-zinc-100 dark:bg-black/20 relative z-0 p-4 lg:p-6 overflow-hidden flex flex-col">
                  <ThemePreview 
                    themeJson={result?.themeFiles.themeJson} 
                    templates={result?.themeFiles.templates} 
                    parts={result?.themeFiles.parts} 
                    patterns={result?.themeFiles.patterns} 
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
