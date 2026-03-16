"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import type { AuditResult } from "@/lib/validation/design-audit";

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
  meta: { themeName: string; displayName: string; description: string; generationTime: number };
  validationErrors?: string[];
}

const PIPELINE_STEPS = [
  "Enriching prompt",
  "Generating theme.json",
  "Generating templates",
  "Generating parts",
  "Generating patterns",
  "Validating & auditing",
];

function buildSteps(activeIndex: number, error: boolean) {
  return PIPELINE_STEPS.map((name, i) => ({
    name,
    status: (
      error && i === activeIndex
        ? "error"
        : i < activeIndex
          ? "done"
          : i === activeIndex
            ? "active"
            : "pending"
    ) as "pending" | "active" | "done" | "error",
  }));
}

export default function Home() {
  const [step, setStep] = useState<AppStep>("input");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [progressIndex, setProgressIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewZip, setPreviewZip] = useState<Blob | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgress = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  async function handleSubmit(data: {
    description: string;
    archetype?: string;
    style?: string;
  }) {
    setStep("generating");
    setError(null);
    setProgressIndex(0);
    setShowPreview(false);
    setPreviewZip(null);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      if (idx < PIPELINE_STEPS.length) {
        setProgressIndex(idx);
      }
    }, 800);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      clearProgress();

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Generation failed (${res.status})`);
      }

      const json: GenerationResult = await res.json();
      setProgressIndex(PIPELINE_STEPS.length);
      setResult(json);
      setStep("results");
    } catch (err) {
      clearProgress();
      setError(err instanceof Error ? err.message : "Generation failed");
    }
  }

  async function packageAndGetZip(): Promise<Blob | null> {
    if (!result) return null;
    setIsPackaging(true);
    try {
      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeFiles: result.themeFiles,
          meta: result.meta,
        }),
      });
      if (!res.ok) throw new Error("Packaging failed");
      return await res.blob();
    } finally {
      setIsPackaging(false);
    }
  }

  async function handleDownload() {
    const blob = await packageAndGetZip();
    if (!blob || !result) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.meta.themeName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handlePreview() {
    const blob = previewZip ?? await packageAndGetZip();
    if (!blob) return;
    setPreviewZip(blob);
    setShowPreview(true);
  }

  function handleStartOver() {
    setStep("input");
    setResult(null);
    setError(null);
    setProgressIndex(0);
    setShowPreview(false);
    setPreviewZip(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Block Theme Generator
            </h1>
            <p className="text-sm text-zinc-400">
              AI-powered WordPress themes from a description
            </p>
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
        <div className="max-w-5xl mx-auto px-6 py-10">
          {step === "input" && <GeneratorForm onSubmit={handleSubmit} />}

          {step === "generating" && (
            <div className="py-12 max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-center text-zinc-900 dark:text-zinc-100 mb-8">
                Generating your theme...
              </h2>
              <ProgressIndicator
                currentStep={progressIndex}
                steps={buildSteps(progressIndex, !!error)}
              />
              {error && (
                <div className="mt-8 text-center">
                  <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                    {error}
                  </p>
                  <button
                    onClick={handleStartOver}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}

          {step === "results" && result && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Theme generated
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {result.meta.displayName} &mdash; built in{" "}
                  {(result.meta.generationTime / 1000).toFixed(1)}s
                </p>
                {result.validationErrors && result.validationErrors.length > 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    {result.validationErrors.length} validation warning(s)
                  </p>
                )}
              </div>

              <AuditResults
                result={result.audit}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />

              {isPackaging && (
                <p className="text-center text-sm text-zinc-500 mt-4 animate-pulse">
                  Packaging ZIP...
                </p>
              )}

              {showPreview && previewZip && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    Live Preview
                  </h3>
                  <WpPlayground
                    themeZip={previewZip}
                    themeName={result.meta.themeName}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
