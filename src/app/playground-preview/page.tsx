"use client";

import { useEffect, useRef, useState } from "react";
import { buildThemeFileMap, type ThemeFilesData, type ThemeMetaInput } from "@/lib/packer/constants";
import { buildPreviewBlueprint } from "@/lib/playground/blueprint-builder";
import { get } from "idb-keyval";

export default function PlaygroundPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Booting WordPress...");
  const [error, setError] = useState<string | null>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current || !iframeRef.current) return;
    bootedRef.current = true;

    async function boot() {
      const data = await get<ThemeFilesData & { meta: ThemeMetaInput }>("playground-theme");
      if (!data) {
        setError("No theme data found. Go back and click 'Preview in WordPress' again.");
        return;
      }

      const slug = data.meta.themeName;
      const fileMap = buildThemeFileMap(data, data.meta);
      const blueprint = buildPreviewBlueprint(slug, fileMap);

      try {
        setStatus("Loading WordPress Playground...");
        const { startPlaygroundWeb } = await import("@wp-playground/client");

        const client = await startPlaygroundWeb({
          iframe: iframeRef.current!,
          remoteUrl: "https://playground.wordpress.net/remote.html",
          blueprint: blueprint,
        });

        setStatus("Navigating...");
        await client.goTo("/");
        setStatus("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Preview failed");
      }
    }

    boot();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950">
      {(status || error) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
          {error ? (
            <div className="text-center">
              <p className="text-red-400 font-medium mb-2">Preview Error</p>
              <p className="text-zinc-400 text-sm max-w-md">{error}</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-8 h-8 border-3 border-zinc-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-300 text-sm">{status}</p>
            </div>
          )}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="WordPress Playground Preview"
        className="w-full h-full border-0"
      />
    </div>
  );
}
