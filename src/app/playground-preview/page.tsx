"use client";

import { useEffect, useRef, useState } from "react";
import { buildThemeFileMap, type ThemeFilesData, type ThemeMetaInput } from "@/lib/packer/constants";
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
      const basePath = `/wordpress/wp-content/themes/${slug}`;
      const fileMap = buildThemeFileMap(data, data.meta);
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

        // Collect all unique directories from the file map
        const dirs = new Set<string>();
        for (const path of Object.keys(fileMap)) {
          const parts = path.split("/");
          for (let i = 1; i < parts.length; i++) {
            dirs.add(parts.slice(0, i).join("/"));
          }
        }

        const mkdir = (path: string) =>
          client.run({ code: `<?php @mkdir('${path}', 0777, true); echo 'OK'; ?>` });
        await mkdir(basePath);
        for (const dir of dirs) {
          await mkdir(`${basePath}/${dir}`);
        }

        // Write all theme files
        for (const [path, content] of Object.entries(fileMap)) {
          await write(`${basePath}/${path}`, content);
        }

        setStatus("Activating theme...");

        await client.run({
          code: `<?php
require '/wordpress/wp-load.php';
switch_theme('${slug}');
$home = wp_insert_post(array('post_title'=>'Home','post_status'=>'publish','post_type'=>'page'));
if ($home && !is_wp_error($home)) {
  update_option('show_on_front', 'page');
  update_option('page_on_front', $home);
}
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
