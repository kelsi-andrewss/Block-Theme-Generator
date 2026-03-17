"use client";

import { useState, useCallback, useRef } from "react";
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Block Theme Generator</h1>
            <p className="text-sm text-zinc-400">AI-powered WordPress themes from a description</p>
          </div>
          {step !== "input" && (
            <button
              onClick={handleStartOver}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 bg-white dark:bg-zinc-900">
        
        {/* Tab Navigation (only show on input step) */}
        {step === "input" && (
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("generator")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "generator"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  Theme Generator
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "gallery"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  Template Gallery
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Input step — Generator vs Gallery */}
        {step === "input" && (
          <div className={activeTab === "gallery" ? "max-w-7xl mx-auto px-6 py-10" : "max-w-3xl mx-auto px-6 py-10"}>
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
        )}

        {/* Shared layout for Generating and Results steps to persist WordPress Playground */}
        {(step === "generating" || (step === "results" && result)) && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {step === "results" && result && (
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Theme generated
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {result.meta.displayName}
                </p>
              </div>
            )}

            <div className={`grid grid-cols-1 gap-8 ${step === "results" ? "lg:grid-cols-[400px_1fr]" : "lg:grid-cols-[320px_1fr]"}`}>
              {/* Left: progress OR audit results */}
              <div>
                {step === "generating" ? (
                  <>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                      Building your theme...
                    </h2>
                    <ProgressIndicator
                      currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
                      steps={pipelineSteps.map((s) => ({ name: s.name, status: s.status, detail: s.detail }))}
                    />
                    {error && (
                      <div className="mt-6">
                        <p className="text-red-600 dark:text-red-400 text-sm mb-3">{error}</p>
                        <button
                          onClick={handleStartOver}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {result && (
                      <AuditResults
                        result={result.audit}
                        onDownload={handleDownload}
                        onPreview={() => {}} // Preview is already visible
                      />
                    )}
                    {isPackaging && (
                      <p className="text-center text-sm text-zinc-500 mt-4 animate-pulse">
                        Packaging ZIP...
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Right: live preview */}
              <div>
                {step === "results" && result && (
                  <ColorSwitcher 
                    lightThemeJsonStr={result.themeFiles.themeJson}
                    darkThemeJsonStr={result.themeFiles.darkMode}
                    onThemeJsonChange={handleThemeJsonChange}
                  />
                )}
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  Live Preview
                </h3>
                <ThemePreview 
                  themeJson={result?.themeFiles.themeJson} 
                  templates={result?.themeFiles.templates} 
                  parts={result?.themeFiles.parts} 
                  patterns={result?.themeFiles.patterns} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
