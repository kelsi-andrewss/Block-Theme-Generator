"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import type { AuditResult } from "@/lib/validation/design-audit";
import type { PlaygroundHandle } from "@/components/WpPlayground";
import { generateStyleCss } from "@/lib/packer/constants";
import { buildSampleContentPHP } from "@/lib/playground/sample-content";

const WpPlayground = dynamic(() => import("@/components/WpPlayground"), {
  ssr: false,
});

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
  const themeSlugRef = useRef("generated-theme");
  const archetypeIdRef = useRef("blog");

  const playgroundRef = useRef<PlaygroundHandle>(null);
  const themePathRef = useRef("/wordpress/wp-content/themes/generated-theme");
  const themeActivatedRef = useRef(false);
  const themeDirCreatedRef = useRef(false);
  const playgroundReadyResolveRef = useRef<(() => void) | null>(null);
  const playgroundReadyPromiseRef = useRef<Promise<void>>(
    new Promise<void>((resolve) => {
      playgroundReadyResolveRef.current = resolve;
    })
  );

  const updateStep = useCallback((key: string, status: StepState["status"], detail?: string) => {
    setPipelineSteps(prev =>
      prev.map(s => (s.key === key ? { ...s, status, ...(detail !== undefined ? { detail } : {}) } : s))
    );
  }, []);

  function handlePlaygroundReady() {
    playgroundReadyResolveRef.current?.();
  }

  /** Wait for Playground + ensure theme dir exists, then write file */
  async function pushToPlayground(wpPath: string, content: string) {
    await playgroundReadyPromiseRef.current;
    const pg = playgroundRef.current;
    if (!pg?.isReady()) return;

    // Ensure theme directory structure exists on first write
    if (!themeDirCreatedRef.current) {
      themeDirCreatedRef.current = true;
      const base = themePathRef.current;
      await pg.runPHP(`<?php
        @mkdir('${base}', 0777, true);
        @mkdir('${base}/templates', 0777, true);
        @mkdir('${base}/parts', 0777, true);
        @mkdir('${base}/patterns', 0777, true);
        @mkdir('${base}/styles', 0777, true);
      `);
    }

    await pg.writeFile(wpPath, content);
  }

  /** Activate the theme and populate with sample content */
  async function activateThemeInPlayground(slug: string) {
    await playgroundReadyPromiseRef.current;
    const pg = playgroundRef.current;
    if (!pg?.isReady() || themeActivatedRef.current) return;
    themeActivatedRef.current = true;

    // Activate theme
    await pg.runPHP(`<?php
      require '/wordpress/wp-load.php';
      switch_theme('${slug}');
    `);

    // Insert archetype-appropriate sample content
    const contentPHP = buildSampleContentPHP(archetypeIdRef.current, slug);
    await pg.runPHP(contentPHP);

    await pg.goTo("/");
  }

  async function handleSubmit(data: {
    description: string;
    archetype?: string;
    style?: string;
  }) {
    setStep("generating");
    setError(null);
    setResult(null);
    setPipelineSteps(INITIAL_STEPS);
    themeActivatedRef.current = false;
    themeDirCreatedRef.current = false;
    playgroundReadyPromiseRef.current = new Promise<void>((resolve) => {
      playgroundReadyResolveRef.current = resolve;
    });

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
              archetypeIdRef.current = parsed.meta.archetypeId ?? "blog";
              themePathRef.current = `/wordpress/wp-content/themes/${slug}`;

              // Write style.css so WP can discover the theme
              const styleCss = generateStyleCss({
                name: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
                slug,
                description: data.description ?? "",
                version: "1.0.0",
              });
              // This will wait for Playground to be ready + create dirs
              pushToPlayground(`${themePathRef.current}/style.css`, styleCss);
            }
          } else if (eventType === "files") {
            const base = themePathRef.current;

            if (parsed.type === "theme-json") {
              await pushToPlayground(`${base}/theme.json`, parsed.content);
              await activateThemeInPlayground(themeSlugRef.current);
            } else if (parsed.type === "templates" && parsed.files) {
              for (const [filename, content] of Object.entries(parsed.files)) {
                await pushToPlayground(`${base}/templates/${filename}`, content as string);
              }
              await playgroundRef.current?.goTo("/");
            } else if (parsed.type === "parts" && parsed.files) {
              for (const [filename, content] of Object.entries(parsed.files)) {
                await pushToPlayground(`${base}/parts/${filename}`, content as string);
              }
              await playgroundRef.current?.goTo("/");
            } else if (parsed.type === "patterns" && parsed.files) {
              for (const [filename, content] of Object.entries(parsed.files)) {
                await pushToPlayground(`${base}/patterns/${filename}`, content as string);
              }
            } else if (parsed.type === "dark-mode") {
              await pushToPlayground(`${base}/styles/dark.json`, parsed.content);
            }
          } else if (eventType === "complete") {
            setResult(parsed as GenerationResult);
            setStep("results");
            // Final refresh
            await playgroundRef.current?.goTo("/");
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
    themeActivatedRef.current = false;
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
        {/* Input step — centered */}
        {step === "input" && (
          <div className="max-w-3xl mx-auto px-6 py-10">
            <GeneratorForm onSubmit={handleSubmit} />
          </div>
        )}

        {/* Generating step — split view: progress left, preview right */}
        {step === "generating" && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
              {/* Left: progress */}
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
                  Building your theme...
                </h2>
                <ProgressIndicator
                  currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
                  steps={pipelineSteps.map(s => ({ name: s.name, status: s.status, detail: s.detail }))}
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
              </div>

              {/* Right: live preview */}
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  Live Preview
                </h3>
                <WpPlayground ref={playgroundRef} themeName={themeSlug} onReady={handlePlaygroundReady} />
              </div>
            </div>
          </div>
        )}

        {/* Results step — audit + preview */}
        {step === "results" && result && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Theme generated
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {result.meta.displayName}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
              {/* Left: audit + download */}
              <div>
                <AuditResults
                  result={result.audit}
                  onDownload={handleDownload}
                  onPreview={() => {}} // Preview is already visible
                />
                {isPackaging && (
                  <p className="text-center text-sm text-zinc-500 mt-4 animate-pulse">
                    Packaging ZIP...
                  </p>
                )}
              </div>

              {/* Right: preview persists from generating step */}
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  Live Preview
                </h3>
                <WpPlayground ref={playgroundRef} themeName={themeSlug} onReady={handlePlaygroundReady} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
