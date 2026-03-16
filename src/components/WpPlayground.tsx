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

const VIEWPORT_HEIGHTS: Record<ViewportSize, number> = {
  desktop: 600,
  tablet: 600,
  mobile: 667,
};

export default function WpPlayground({
  themeZip,
  themeName,
  onReady,
  onError,
}: WpPlaygroundProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<"loading" | "installing" | "ready" | "error">("loading");
  const [statusMessage, setStatusMessage] = useState("Starting WordPress...");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const bootedRef = useRef(false);

  const boot = useCallback(async () => {
    if (bootedRef.current || !iframeRef.current) return;
    bootedRef.current = true;

    try {
      const { startPlaygroundWeb } = await import("@wp-playground/client");
      const { ProgressTracker } = await import("@php-wasm/progress");

      const tracker = new ProgressTracker();

      setStatusMessage("Booting WordPress...");
      const client = await startPlaygroundWeb({
        iframe: iframeRef.current,
        remoteUrl: "https://playground.wordpress.net/remote.html",
        progressTracker: tracker,
        disableProgressBar: true,
      });

      // Install theme after WP boots
      setStatus("installing");
      setStatusMessage("Installing theme...");

      const zipData = new Uint8Array(await themeZip.arrayBuffer());
      const zipPath = "/tmp/theme-upload.zip";
      await client.writeFile(zipPath, zipData);

      // Use PHP to unzip and activate
      await client.run({
        code: `<?php
          require '/wordpress/wp-load.php';

          WP_Filesystem();
          $result = unzip_file('${zipPath}', '/wordpress/wp-content/themes/');

          if (is_wp_error($result)) {
            echo 'ERROR: ' . $result->get_error_message();
          } else {
            // Find the theme directory
            $themes = glob('/wordpress/wp-content/themes/*/style.css');
            foreach ($themes as $style) {
              $data = get_file_data($style, array('Name' => 'Theme Name'));
              if (!empty($data['Name']) && $data['Name'] !== 'Twenty Twenty-Five') {
                $theme_dir = basename(dirname($style));
                switch_theme($theme_dir);
                echo 'OK: ' . $theme_dir;
                break;
              }
            }
          }
        `,
      });

      await client.goTo("/");

      setStatus("ready");
      setStatusMessage("");
      onReady?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Preview failed");
      setStatus("error");
      setErrorMessage(error.message);
      onError?.(error);
    }
  }, [themeZip, onReady, onError]);

  useEffect(() => {
    boot();
  }, [boot]);

  function handleRetry() {
    bootedRef.current = false;
    setStatus("loading");
    setErrorMessage("");
    boot();
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

        <a
          href="https://playground.wordpress.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in new tab
        </a>
      </div>

      {/* Preview */}
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {(status === "loading" || status === "installing") && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
            <div className="w-8 h-8 border-3 border-zinc-200 dark:border-zinc-700 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{statusMessage}</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preview failed</p>
            <p className="mt-1 text-xs text-zinc-400 text-center max-w-sm">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950">
          <iframe
            ref={iframeRef}
            title={`Preview of ${themeName} theme`}
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
