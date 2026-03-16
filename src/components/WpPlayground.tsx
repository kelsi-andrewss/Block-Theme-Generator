"use client";

import { useState, useEffect, useRef } from "react";

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

export default function WpPlayground({
  themeZip,
  themeName,
  onReady,
  onError,
}: WpPlaygroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [playgroundUrl, setPlaygroundUrl] = useState<string | null>(null);

  useEffect(() => {
    // Convert the theme zip to a base64 data URI and encode a Blueprint
    // that installs it. Use the Playground URL-based Blueprint API.
    async function buildPlaygroundUrl() {
      try {
        const arrayBuffer = await themeZip.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);

        // Playground accepts blueprints as a URL query param
        // Use writeFile steps to write the zip, then activate via wp-cli
        const blueprint = {
          landingPage: "/",
          features: { networking: true },
          steps: [
            {
              step: "writeFile",
              path: "/tmp/theme.zip",
              data: {
                resource: "literal",
                contents: base64,
                encoding: "base64",
              },
            },
            {
              step: "wp-cli",
              command: `wp theme install /tmp/theme.zip --activate`,
            },
          ],
        };

        const blueprintEncoded = encodeURIComponent(JSON.stringify(blueprint));
        const url = `https://playground.wordpress.net/#${blueprintEncoded}`;

        // Check if the blueprint URL is too long (browsers limit ~2MB)
        if (url.length > 1_500_000) {
          // Too large for URL — fall back to basic playground
          setPlaygroundUrl("https://playground.wordpress.net/");
          setStatus("ready");
          onReady?.();
          return;
        }

        setPlaygroundUrl(url);
        setStatus("ready");
        onReady?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to build preview URL");
        setStatus("error");
        setErrorMessage(error.message);
        onError?.(error);
      }
    }

    buildPlaygroundUrl();
  }, [themeZip, onReady, onError]);

  return (
    <div className="space-y-4">
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

        {playgroundUrl && (
          <a
            href={playgroundUrl}
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
        )}
      </div>

      {/* Preview container */}
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900">
            <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-700 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Preparing WordPress preview...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Preview unavailable
            </p>
            <p className="mt-1 text-xs text-zinc-400 text-center max-w-sm">
              {errorMessage || "Could not initialize WordPress Playground."}
            </p>
            <a
              href="https://playground.wordpress.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Open Playground manually
            </a>
          </div>
        )}

        {playgroundUrl && (
          <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950">
            <iframe
              ref={iframeRef}
              src={playgroundUrl}
              title={`Preview of ${themeName} theme`}
              className="border-0 bg-white transition-[width] duration-300 ease-in-out"
              style={{
                width: VIEWPORT_WIDTHS[viewport],
                maxWidth: "100%",
                height: viewport === "mobile" ? 667 : 600,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
