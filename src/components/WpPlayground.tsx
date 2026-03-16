"use client";

import { useState } from "react";

interface WpPlaygroundProps {
  themeZip: Blob;
  themeName: string;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 375,
};

const VIEWPORT_HEIGHTS: Record<ViewportSize, number> = {
  desktop: 600,
  tablet: 600,
  mobile: 667,
};

export default function WpPlayground({
  themeZip,
  themeName,
}: WpPlaygroundProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [showInstructions, setShowInstructions] = useState(true);

  function handleDownloadForPlayground() {
    const url = URL.createObjectURL(themeZip);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${themeName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowInstructions(false);
  }

  return (
    <div className="space-y-4">
      {/* Instructions banner */}
      {showInstructions && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Preview your theme in WordPress Playground
          </p>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>
              <button
                onClick={handleDownloadForPlayground}
                className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
              >
                Download your theme ZIP
              </button>
            </li>
            <li>In the Playground below, go to <strong>Appearance → Themes → Add New Theme</strong></li>
            <li>Click <strong>Upload Theme</strong> and select the downloaded ZIP</li>
            <li>Click <strong>Activate</strong> to see your theme live</li>
          </ol>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
          {(Object.keys(VIEWPORT_WIDTHS) as ViewportSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setViewport(size)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewport === size
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>

        <a
          href="https://playground.wordpress.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Open in new tab
        </a>
      </div>

      {/* Playground iframe */}
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950">
          <iframe
            src="https://playground.wordpress.net/"
            title={`WordPress Playground — preview ${themeName}`}
            className="border-0 bg-white transition-[width] duration-300 ease-in-out"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
              height: VIEWPORT_HEIGHTS[viewport],
            }}
          />
        </div>
      </div>
    </div>
  );
}
