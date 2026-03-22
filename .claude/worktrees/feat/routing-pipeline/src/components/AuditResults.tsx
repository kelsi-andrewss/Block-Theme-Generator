"use client";

import type { AuditResult, AuditCheck } from "@/lib/validation/design-audit";

interface AuditResultsProps {
  result: AuditResult;
  onDownload: () => void;
  onPreview: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-500 border-green-500";
  if (score >= 70) return "text-amber-500 border-amber-500";
  return "text-red-500 border-red-500";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-green-50 dark:bg-green-950/30";
  if (score >= 70) return "bg-amber-50 dark:bg-amber-950/30";
  return "bg-red-50 dark:bg-red-950/30";
}

function severityBadge(check: AuditCheck) {
  if (check.passed) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
        <svg
          className="w-4 h-4"
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
        Pass
      </span>
    );
  }

  const colors = {
    error: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <span className={`inline-flex items-center gap-1 ${colors[check.severity]}`}>
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
      Fail
    </span>
  );
}

export default function AuditResults({
  result,
  onDownload,
  onPreview,
}: AuditResultsProps) {
  return (
    <div className="space-y-8">
      {/* Score circle */}
      <div className="flex flex-col items-center">
        <div
          className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${scoreColor(result.score)} ${scoreBg(result.score)}`}
        >
          <span className="text-4xl font-bold">{result.score}</span>
          <span className="text-lg font-semibold">{result.grade}</span>
        </div>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Design Quality Score
        </p>
      </div>

      {/* Checks grid */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
          Audit Checks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.checks.map((check) => (
            <div
              key={check.name}
              className={`rounded-lg border p-3 ${
                check.passed
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
                  : check.severity === "error"
                    ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                    : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {check.name}
                </span>
                {severityBadge(check)}
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {check.message}
              </p>
              {check.details && (
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                  {check.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 py-3 px-6 rounded-lg bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Download ZIP
        </button>
        <button
          onClick={onPreview}
          className="flex-1 py-3 px-6 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold text-base hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 transition-colors"
        >
          Preview in WordPress
        </button>
      </div>
    </div>
  );
}
