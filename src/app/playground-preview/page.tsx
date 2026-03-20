"use client";

import { useEffect, useRef, useState } from "react";
import { generateStyleCss, generateFunctionsPHP } from "@/lib/packer/constants";

export default function PlaygroundPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Booting WordPress...");
  const [error, setError] = useState<string | null>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current || !iframeRef.current) return;
    bootedRef.current = true;

    const raw = sessionStorage.getItem("playground-theme");
    if (!raw) {
      setError("No theme data found. Go back and click 'Preview in WordPress' again.");
      return;
    }

    const data = JSON.parse(raw) as {
      themeJson: string;
      darkMode: string;
      templates: Record<string, string>;
      parts: Record<string, string>;
      patterns: Record<string, string>;
      customCss?: string;
      meta: { themeName: string; displayName: string; description: string };
    };

    const slug = data.meta.themeName;
    const basePath = `/wordpress/wp-content/themes/${slug}`;

    async function boot() {
      try {
        setStatus("Loading WordPress Playground...");
        const { startPlaygroundWeb } = await import("@wp-playground/client");

        const client = await startPlaygroundWeb({
          iframe: iframeRef.current!,
          remoteUrl: "https://playground.wordpress.net/remote.html",
        });

        setStatus("Installing theme files...");

        const enc = new TextEncoder();
        const write = (path: string, content: string) =>
          client.writeFile(path, enc.encode(content));

        // Create theme directory structure first
        const mkdir = (path: string) =>
          client.run({ code: `<?php @mkdir('${path}', 0777, true); echo 'OK'; ?>` });
        await mkdir(basePath);
        await mkdir(`${basePath}/templates`);
        await mkdir(`${basePath}/parts`);
        await mkdir(`${basePath}/patterns`);
        await mkdir(`${basePath}/styles`);
        await mkdir(`${basePath}/assets/css`);

        // Write style.css
        await write(
          `${basePath}/style.css`,
          generateStyleCss({
            name: data.meta.displayName,
            slug,
            description: data.meta.description,
            version: "1.0.0",
          })
        );

        // Write theme.json
        await write(`${basePath}/theme.json`, data.themeJson);

        // Write functions.php
        const fontFamilies: string[] = [];
        try {
          const tj = JSON.parse(data.themeJson);
          const families = tj?.settings?.typography?.fontFamilies;
          if (Array.isArray(families)) {
            for (const f of families) {
              if (f.name) fontFamilies.push(f.name);
            }
          }
        } catch {}

        await write(
          `${basePath}/functions.php`,
          generateFunctionsPHP({
            name: data.meta.displayName,
            slug,
            description: data.meta.description,
            version: "1.0.0",
            fontFamilies,
            hasCustomCss: !!data.customCss,
          })
        );

        // Write templates
        for (const [name, content] of Object.entries(data.templates)) {
          await write(`${basePath}/templates/${name}`, content);
        }

        // Write parts
        for (const [name, content] of Object.entries(data.parts)) {
          await write(`${basePath}/parts/${name}`, content);
        }

        // Write patterns
        for (const [name, content] of Object.entries(data.patterns)) {
          await write(`${basePath}/patterns/${name}`, content);
        }

        // Write dark mode
        await write(`${basePath}/styles/dark.json`, data.darkMode);

        // Write custom CSS if present
        if (data.customCss) {
          await write(`${basePath}/assets/css/saas-sections.css`, data.customCss);
        }

        setStatus("Activating theme...");

        // Activate theme
        await client.run({
          code: `<?php
require '/wordpress/wp-load.php';
switch_theme('${slug}');
echo 'OK';
?>`,
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
