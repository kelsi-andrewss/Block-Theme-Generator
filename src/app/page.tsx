"use client";

import { useState, useCallback } from "react";
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
  meta: { themeName: string; displayName: string; description: string };
  validationErrors?: string[];
}

interface StepState {
  name: string;
  key: string;
  status: "pending" | "active" | "done" | "error";
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewZip, setPreviewZip] = useState<Blob | null>(null);
  const [isPackaging, setIsPackaging] = useState(false);

  const updateStep = useCallback((key: string, status: StepState["status"]) => {
    setPipelineSteps(prev =>
      prev.map(s => (s.key === key ? { ...s, status } : s))
    );
  }, []);

  async function handleSubmit(data: {
    description: string;
    archetype?: string;
    style?: string;
  }) {
    setStep("generating");
    setError(null);
    setShowPreview(false);
    setPreviewZip(null);
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

        // Parse SSE events from buffer
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? ""; // last incomplete chunk

        for (const event of events) {
          if (!event.trim()) continue;

          const eventMatch = event.match(/^event: (\w+)\ndata: (.+)$/s);
          if (!eventMatch) continue;

          const [, eventType, eventData] = eventMatch;
          const parsed = JSON.parse(eventData);

          if (eventType === "step") {
            updateStep(parsed.step, parsed.status);
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
    setShowPreview(false);
    setPreviewZip(null);
    setPipelineSteps(INITIAL_STEPS);
  }

  const currentStepIndex = pipelineSteps.findIndex(s => s.status === "active");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
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
        <div className="max-w-5xl mx-auto px-6 py-10">
          {step === "input" && <GeneratorForm onSubmit={handleSubmit} />}

          {step === "generating" && (
            <div className="py-12 max-w-xl mx-auto">
              <h2 className="text-xl font-semibold text-center text-zinc-900 dark:text-zinc-100 mb-8">
                Generating your theme...
              </h2>
              <ProgressIndicator
                currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
                steps={pipelineSteps.map(s => ({ name: s.name, status: s.status }))}
              />
              {error && (
                <div className="mt-8 text-center">
                  <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
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
                  {result.meta.displayName}
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
