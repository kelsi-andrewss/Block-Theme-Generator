"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ARCHETYPES } from "@/lib/prompts/archetypes";
import { STARTER_TEMPLATES } from "@/lib/prompts/templates";
import { analyzeGaps, detectArchetype, type GapAnalysis } from "@/lib/prompts/enrichment";

const STYLE_OPTIONS = [
  "Editorial",
  "Cinematic",
  "Neobrutalist",
  "Minimal",
  "Glassmorphism",
  "Luxurious",
  "Playful",
  "Organic",
];

const GAP_LABELS: Record<keyof GapAnalysis, string> = {
  audience: "Target Audience",
  aesthetic: "Visual Style",
  palette: "Color Palette",
  typography: "Typography",
  sections: "Page Sections",
  interactions: "Interactions",
  reference: "Reference / Inspiration",
};

interface GeneratorFormProps {
  onSubmit: (data: {
    description: string;
    archetype?: string;
    style?: string;
  }) => void;
}

export default function GeneratorForm({ onSubmit }: GeneratorFormProps) {
  const [description, setDescription] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [gaps, setGaps] = useState<GapAnalysis | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateGaps = useCallback((text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setGaps(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const archetype = detectArchetype(text);
      setGaps(analyzeGaps(text, archetype));
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleDescriptionChange(value: string) {
    setDescription(value);
    updateGaps(value);
  }

  function handleTemplateClick(enrichedDescription: string) {
    setDescription(enrichedDescription);
    updateGaps(enrichedDescription);
    setShowTemplates(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      description: description.trim(),
      archetype: selectedArchetype ?? undefined,
      style: selectedStyle ?? undefined,
    });
  }

  const specifiedCount = gaps
    ? Object.values(gaps).filter((g) => g.specified).length
    : 0;
  const totalDimensions = gaps ? Object.keys(gaps).length : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Textarea */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Describe your theme
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe your dream website theme... e.g., A dark mode photography portfolio with a large hero image, masonry gallery, and minimal navigation"
          className="w-full min-h-32 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      </div>

      {/* Archetype chips */}
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Site type
        </p>
        <div className="flex flex-wrap gap-2">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              type="button"
              onClick={() =>
                setSelectedArchetype(
                  selectedArchetype === arch.id ? null : arch.id
                )
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedArchetype === arch.id
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {arch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Style chips */}
      <div>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Design style
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() =>
                setSelectedStyle(
                  selectedStyle === style.toLowerCase()
                    ? null
                    : style.toLowerCase()
                )
              }
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStyle === style.toLowerCase()
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Starter templates */}
      <div>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${
              showTemplates ? "rotate-90" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Start from a template
        </button>
        {showTemplates && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STARTER_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleTemplateClick(tpl.enrichedDescription)}
                className="text-left p-4 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                  {tpl.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {tpl.description}
                </p>
                <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300">
                  {tpl.style}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gap analysis */}
      {gaps && (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Prompt completeness
            </p>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {specifiedCount}/{totalDimensions} dimensions
            </span>
          </div>
          <div className="space-y-2">
            {(Object.entries(gaps) as [keyof GapAnalysis, GapAnalysis[keyof GapAnalysis]][]).map(
              ([key, gap]) => (
                <div key={key} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 shrink-0">
                    {gap.specified ? (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          strokeLinecap="round"
                          d="M12 8v4m0 4h.01"
                        />
                      </svg>
                    )}
                  </span>
                  <div>
                    <span
                      className={
                        gap.specified
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-zinc-500 dark:text-zinc-400"
                      }
                    >
                      {GAP_LABELS[key]}
                    </span>
                    {!gap.specified && gap.suggestion && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Suggestion: {gap.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!description.trim()}
        className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Generate Theme
      </button>
    </form>
  );
}
