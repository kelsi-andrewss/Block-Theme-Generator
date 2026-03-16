"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

const PLAYGROUND_REMOTE_URL = "https://playground.wordpress.net/remote.html";

export default function WpPlayground({
  themeZip,
  themeName,
  onReady,
  onError,
}: WpPlaygroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  const bootPlayground = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const playgroundModule = await import("@wp-playground/client");

      const blobUrl = URL.createObjectURL(themeZip);

      const client = await playgroundModule.startPlaygroundWeb({
        iframe,
        remoteUrl: PLAYGROUND_REMOTE_URL,
        disableProgressBar: true,
        blueprint: {
          landingPage: "/",
          steps: [
            {
              step: "installTheme",
              themeData: {
                resource: "url",
                url: blobUrl,
              },
              options: {
                activate: true,
              },
            },
          ],
        } as Parameters<typeof playgroundModule.startPlaygroundWeb>[0]["blueprint"],
      });

      URL.revokeObjectURL(blobUrl);

      await client.goTo("/");

      setStatus("ready");
      onReadyRef.current?.();
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load preview");
      setStatus("error");
      setErrorMessage(error.message);
      onErrorRef.current?.(error);
    }
  }, [themeZip]);

  useEffect(() => {
    bootPlayground();
  }, [bootPlayground]);

  function handleOpenNewTab() {
    window.open("https://playground.wordpress.net/", "_blank");
  }

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

        <button
          type="button"
          onClick={handleOpenNewTab}
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
        </button>
      </div>

      {/* Preview container */}
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Loading overlay */}
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900">
            <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-700 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              Starting WordPress Playground...
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              This may take a moment on first load
            </p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Failed to load preview
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 text-center max-w-sm">
              {errorMessage ||
                "WordPress Playground could not be initialized."}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setErrorMessage("");
                bootPlayground();
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Iframe */}
        <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950">
          <iframe
            ref={iframeRef}
            title={`Preview of ${themeName} theme`}
            className="border-0 bg-white transition-[width] duration-300 ease-in-out"
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
              height: viewport === "mobile" ? 667 : 600,
            }}
          />
        </div>
      </div>
    </div>
  );
}
