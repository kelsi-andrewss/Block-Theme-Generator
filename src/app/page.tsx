"use client";

import { useState, useRef, useCallback } from "react";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import type { AuditResult } from "@/lib/validation/design-audit";

type AppStep = "input" | "generating" | "results";

interface GenerationResult {
  zip: string;
  audit: AuditResult;
  meta: { themeName: string; generationTime: number };
}

const PIPELINE_STEPS = [
  "Enriching prompt",
  "Generating theme.json",
  "Generating templates",
  "Generating parts",
  "Generating patterns",
  "Packaging theme",
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

    // Simulate progress stepping while waiting for the API
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

  function handleDownload() {
    if (!result) return;
    const byteString = atob(result.zip);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.meta.themeName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handlePreview() {
    // TODO: Connect to WordPress Playground (story-860)
    window.open(
      "https://playground.wordpress.net/",
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleStartOver() {
    setStep("input");
    setResult(null);
    setError(null);
    setProgressIndex(0);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
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

      {/* Content */}
      <main className="flex-1 bg-white dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Input step */}
          {step === "input" && <GeneratorForm onSubmit={handleSubmit} />}

          {/* Generating step */}
          {step === "generating" && (
            <div className="py-12">
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

          {/* Results step */}
          {step === "results" && result && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Theme generated
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {result.meta.themeName} -- built in{" "}
                  {(result.meta.generationTime / 1000).toFixed(1)}s
                </p>
              </div>
              <AuditResults
                result={result.audit}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
