"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import GeneratorForm from "@/components/GeneratorForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import AuditResults from "@/components/AuditResults";
import ThemePreview from "@/components/ThemePreview";
import ColorSwitcher from "@/components/ColorSwitcher";
import TemplateGallery from "@/components/TemplateGallery";
import IterationChat, { SelectedBlockEvent } from "@/components/IterationChat";
import WorkbenchHeader from "@/components/WorkbenchHeader";
import type { ThemeArchetype } from "@/lib/prompts/archetypes";
import type { PremadeTheme } from "@/lib/premade-themes";
import { SAAS_FRONT_PAGE_HTML, SAAS_HEADER_HTML, SAAS_FOOTER_HTML, SAAS_SIGNUP_HTML, SAAS_PRICING_HTML, SAAS_DOCS_HTML, SAAS_CONTACT_HTML, SAAS_404_HTML } from "@/lib/generators/saas-template";
import { generateSaasCustomCss } from "@/lib/generators/custom-css";
import type { AuditResult } from "@/lib/validation/design-audit";
import { applyThemeOverrides, buildThemeFileMap, type ThemeFilesData, type IframeState } from "@/lib/packer/constants";
import { set } from "idb-keyval";

type AppStep = "input" | "generating" | "results";

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
  detail?: string;
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
  const [isPackaging, setIsPackaging] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [themeSlug, setThemeSlug] = useState("generated-theme");
  const [archetypeId, setArchetypeId] = useState("blog");
  const themeSlugRef = useRef("generated-theme");

  // Tab State & Initial Data for the Form
  const [activeTab, setActiveTab] = useState<"generator" | "gallery">("generator");
  const [formKey, setFormKey] = useState(0); // Used to force remount GeneratorForm when initial data changes
  const [initialDesc, setInitialDesc] = useState("");
  const [initialArch, setInitialArch] = useState<string | null>(null);

  const [isIterating, setIsIterating] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlockEvent | null>(null);
  const [iframeState, setIframeState] = useState<{ isDarkMode: boolean; activeThemeId: string; activeFontId: string; colors: any } | null>(null);

  // Multi-page Workbench State
  const [activeFile, setActiveFile] = useState<string>("index.html");
  const [openFiles, setOpenFiles] = useState<string[]>(["index.html"]);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Broadcast mode changes to iframes (NativeIframeController listens for SET_MODE)
  useEffect(() => {
    document.querySelectorAll('iframe').forEach(f => {
      f.contentWindow?.postMessage({ type: 'SET_MODE', mode: viewMode }, '*');
    });
  }, [viewMode]);

  const [showGlobalApplyPrompt, setShowGlobalApplyPrompt] = useState(false);
  const lastInstructionRef = useRef<string>("");
  const lastElementRef = useRef<SelectedBlockEvent | null>(null);

  // Undo stack: ref for data (no stale closures), counter for reactivity
  type UndoEntry =
    | { type: "element"; html: string; newHtml: string }
    | { type: "css"; overrides: Record<string, string> }
    | { type: "style-props"; iterateId: string; oldProps: Record<string, string> };
  type RedoEntry =
    | { type: "element"; html: string; newHtml: string }
    | { type: "css"; overrides: Record<string, string> };
  const MAX_UNDO = 20;
  const undoRef = useRef<UndoEntry[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const redoRef = useRef<RedoEntry[]>([]);
  const [redoCount, setRedoCount] = useState(0);

  function pushUndo(entry: UndoEntry) {
    const stack = undoRef.current;
    stack.push(entry);
    if (stack.length > MAX_UNDO) stack.shift();
    setUndoCount(stack.length);
    redoRef.current = [];
    setRedoCount(0);
  }


  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'BLOCK_SELECTED') {
        setSelectedBlock(event.data.payload);
      } else if (event.data?.type === 'TEMPLATE_STATE_CHANGE') {
        setIframeState(event.data.payload);
      } else if (event.data?.type === 'STYLE_SNAPSHOT') {
        const { iterateId, oldProps } = event.data as { iterateId: string; oldProps: Record<string, string> };
        pushUndo({ type: "style-props", iterateId, oldProps });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Read current CSS variable values from the iframe for full palette context
  function getPaletteContext(): string {
    const CSS_VARS = [
      "--color-primary-400", "--color-primary-500", "--color-primary-700", "--color-primary-900",
      "--color-secondary-400", "--color-secondary-500", "--color-secondary-700", "--color-secondary-900",
      "--color-bg", "--color-text", "--color-bg-secondary", "--color-bg-tertiary",
      "--color-text-muted", "--color-text-secondary",
      "--color-border", "--color-border-subtle", "--color-bg-card", "--color-border-card",
    ];

    const iframe = document.querySelector('iframe');
    const root = iframe?.contentDocument?.documentElement;
    if (root) {
      const computed = iframe.contentWindow!.getComputedStyle(root);
      return CSS_VARS.map(v => `${v}: ${computed.getPropertyValue(v).trim() || "(unset)"}`).join("\n");
    }

    // Fallback: theme.json palette slugs
    if (!result) return "";
    try {
      const parsed = JSON.parse(result.themeFiles.themeJson);
      const palette = parsed?.settings?.color?.palette?.map((c: { slug: string; color: string }) =>
        `${c.slug}: ${c.color}`
      ) || [];
      return palette.join(", ");
    } catch {
      return "";
    }
  }

  const handleSendMessage = useCallback(async (message: string, block?: SelectedBlockEvent): Promise<string> => {
    if (!result) return "No theme loaded.";

    setIsIterating(true);
    setShowGlobalApplyPrompt(false);
    lastInstructionRef.current = message;
    lastElementRef.current = block || null;
    try {
      const palette = getPaletteContext();
      const isHeaderFooter = block?.blockName.toLowerCase().includes('header') || block?.blockName.toLowerCase().includes('footer') || activeFile.includes('parts/');

      if (block) {
        // Targeted edit: send element HTML, get modified HTML back
        const res = await fetch("/api/iterate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instruction: message,
            selectedElement: { html: block.html, content: block.content },
            activeFile,
            isGlobal: isHeaderFooter,
            themeFiles: result.themeFiles,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Iteration failed (${res.status})`);
        }

        const data: { themeFiles?: any; styles?: Record<string, string>; html?: string; textContent?: string; explanation: string } = await res.json();

        if (data.themeFiles) {
          setResult(prev => prev ? { ...prev, themeFiles: data.themeFiles } : null);
        }

        if (data.styles) {
          const iterateId = `iter-${Date.now()}`;
          document.querySelectorAll('iframe').forEach(f => {
            f.contentWindow?.postMessage({ type: 'PATCH_STYLES', iterateId, styles: data.styles }, '*');
          });
          if (!isHeaderFooter) setShowGlobalApplyPrompt(true);
        } else if (data.textContent !== undefined) {
          const newHtml = block.html.replace(/>([^<]*)</, `>${data.textContent}<`);
          pushUndo({ type: "element", html: block.html, newHtml });
          document.querySelectorAll('iframe').forEach(f => {
            f.contentWindow?.postMessage({ type: 'PATCH_ELEMENT', html: newHtml }, '*');
          });
          if (!isHeaderFooter) setShowGlobalApplyPrompt(true);
        } else if (data.html) {
          pushUndo({ type: "element", html: block.html, newHtml: data.html });
          document.querySelectorAll('iframe').forEach(f => {
            f.contentWindow?.postMessage({ type: 'PATCH_ELEMENT', html: data.html }, '*');
          });
          if (!isHeaderFooter) setShowGlobalApplyPrompt(true);
        }

        return data.explanation;
      } else {
        // Global edit: CSS variable overrides
        const res = await fetch("/api/iterate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instruction: message, palette, isGlobal: true }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Iteration failed (${res.status})`);
        }

        const data: { cssOverrides: Record<string, string>; explanation: string } = await res.json();

        // Snapshot current CSS values for undo
        const iframe = document.querySelector('iframe');
        const cssSnapshot: Record<string, string> = {};
        if (iframe?.contentDocument) {
          const computed = iframe.contentWindow!.getComputedStyle(iframe.contentDocument.documentElement);
          for (const prop of Object.keys(data.cssOverrides)) {
            cssSnapshot[prop] = computed.getPropertyValue(prop).trim();
          }
        }
        pushUndo({ type: "css", overrides: cssSnapshot });

        // Apply CSS variable overrides directly to iframe's documentElement
        if (iframe?.contentDocument) {
          for (const [prop, value] of Object.entries(data.cssOverrides)) {
            iframe.contentDocument.documentElement.style.setProperty(prop, value);
          }
        }

        return data.explanation;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Iteration failed";
      return `Error: ${msg}`;
    } finally {
      setIsIterating(false);
    }
  }, [result]);

  const handleApplySitewide = useCallback(async () => {
    if (!result || !lastInstructionRef.current) return;
    setIsIterating(true);
    setShowGlobalApplyPrompt(false);
    try {
      const res = await fetch("/api/iterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: lastInstructionRef.current,
          selectedElement: lastElementRef.current ? { 
            html: lastElementRef.current.html, 
            content: lastElementRef.current.content 
          } : undefined,
          isGlobal: true,
        }),
      });

      if (!res.ok) throw new Error("Sitewide update failed");
      
      const data = await res.json();
      if (data.themeFiles) {
        setResult(prev => prev ? { ...prev, themeFiles: data.themeFiles } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsIterating(false);
    }
  }, [result]);

  const handleImageUpload = useCallback((file: File) => {
    if (!selectedBlock) return;
    const blobUrl = URL.createObjectURL(file);
    const imgHtml = `<img src="${blobUrl}" alt="${file.name}" style="width:100%;height:100%;object-fit:cover;display:block" />`;

    // Snapshot for undo
    pushUndo({ type: "element", html: selectedBlock.html, newHtml: imgHtml });

    // Replace selected element with the image
    document.querySelectorAll('iframe').forEach(f => {
      f.contentWindow?.postMessage({ type: 'PATCH_ELEMENT', html: imgHtml }, '*');
    });
    setSelectedBlock(null);
  }, [selectedBlock]);

  const handleUndo = useCallback(() => {
    const stack = undoRef.current;
    if (stack.length === 0) return;
    const last = stack.pop()!;
    setUndoCount(stack.length);

    if (last.type === "element") {
      redoRef.current.push({ type: "element", html: last.html, newHtml: last.newHtml });
      setRedoCount(redoRef.current.length);
      document.querySelectorAll('iframe').forEach(f => {
        f.contentWindow?.postMessage({
          type: 'UNDO_ELEMENT',
          findHtml: last.newHtml,
          restoreHtml: last.html,
        }, '*');
      });
    } else if (last.type === "css") {
      const iframe = document.querySelector('iframe');
      const redoOverrides: Record<string, string> = {};
      if (iframe?.contentDocument) {
        const computed = iframe.contentWindow!.getComputedStyle(iframe.contentDocument.documentElement);
        for (const prop of Object.keys(last.overrides)) {
          redoOverrides[prop] = computed.getPropertyValue(prop).trim();
        }
        for (const [prop, value] of Object.entries(last.overrides)) {
          iframe.contentDocument.documentElement.style.setProperty(prop, value);
        }
      }
      redoRef.current.push({ type: "css", overrides: redoOverrides });
      setRedoCount(redoRef.current.length);
    } else if (last.type === "style-props") {
      document.querySelectorAll('iframe').forEach(f => {
        f.contentWindow?.postMessage({
          type: 'UNDO_STYLES',
          iterateId: last.iterateId,
          oldProps: last.oldProps,
        }, '*');
      });
    }
  }, []);

  const handleRedo = useCallback(() => {
    const stack = redoRef.current;
    if (stack.length === 0) return;
    const entry = stack.pop()!;
    setRedoCount(stack.length);

    if (entry.type === "element") {
      undoRef.current.push({ type: "element", html: entry.html, newHtml: entry.newHtml });
      setUndoCount(undoRef.current.length);
      document.querySelectorAll('iframe').forEach(f => {
        f.contentWindow?.postMessage({ type: 'PATCH_ELEMENT', html: entry.newHtml }, '*');
      });
    } else if (entry.type === "css") {
      const iframe = document.querySelector('iframe');
      const undoOverrides: Record<string, string> = {};
      if (iframe?.contentDocument) {
        const computed = iframe.contentWindow!.getComputedStyle(iframe.contentDocument.documentElement);
        for (const prop of Object.keys(entry.overrides)) {
          undoOverrides[prop] = computed.getPropertyValue(prop).trim();
        }
        for (const [prop, value] of Object.entries(entry.overrides)) {
          iframe.contentDocument.documentElement.style.setProperty(prop, value);
        }
      }
      undoRef.current.push({ type: "css", overrides: undoOverrides });
      setUndoCount(undoRef.current.length);
    }
  }, []);

  const updateStep = useCallback((key: string, status: StepState["status"], detail?: string) => {
    setPipelineSteps(prev =>
      prev.map(s => (s.key === key ? { ...s, status, ...(detail !== undefined ? { detail } : {}) } : s))
    );
  }, []);

  async function handleSubmit(data: {
    description: string;
    archetype?: string;
    style?: string;
  }) {
    setStep("generating");
    setError(null);
    setResult({
      themeFiles: { themeJson: "", darkMode: "", templates: {}, parts: {}, patterns: {}, customCss: "" },
      audit: { score: 0, grade: "F", checks: [] },
      meta: { themeName: "generating", displayName: "Generating...", description: data.description }
    });
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
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.trim()) continue;

          // Parse SSE format: "event: <type>\ndata: <json>"
          // Data is always a single line (JSON.stringify produces no newlines)
          const lines = event.split("\n");
          const eventLine = lines.find(l => l.startsWith("event: "));
          const dataLine = lines.find(l => l.startsWith("data: "));
          if (!eventLine || !dataLine) continue;

          const eventType = eventLine.slice(7);
          const eventData = dataLine.slice(6);
          const parsed = JSON.parse(eventData);

          if (eventType === "step") {
            updateStep(parsed.step, parsed.status, parsed.detail);

            // When enrich completes, configure the theme path
            if (parsed.step === "enrich" && parsed.status === "done" && parsed.meta?.themeSlug) {
              const slug = parsed.meta.themeSlug;
              setThemeSlug(slug);
              themeSlugRef.current = slug;
              setArchetypeId(parsed.meta.archetypeId ?? "blog");
            }
          } else if (eventType === "files") {
            if (parsed.type === "theme-json") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, themeJson: parsed.content } } : null);
            } else if (parsed.type === "templates" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, templates: { ...prev.themeFiles.templates, ...parsed.files } } } : null);
            } else if (parsed.type === "parts" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, parts: { ...prev.themeFiles.parts, ...parsed.files } } } : null);
            } else if (parsed.type === "patterns" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, patterns: { ...prev.themeFiles.patterns, ...parsed.files } } } : null);
            } else if (parsed.type === "dark-mode") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, darkMode: parsed.content } } : null);
            } else if (parsed.type === "custom-css") {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, customCss: parsed.content } } : null);
            } else if (parsed.type === "skeleton-pages" && parsed.files) {
              setResult(prev => prev ? { ...prev, themeFiles: { ...prev.themeFiles, skeletonPages: { ...prev.themeFiles.skeletonPages, ...parsed.files } } } : null);
            }
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

  async function handleDownload() {
    if (!result) return;
    setIsPackaging(true);
    try {
      const overridden = applyThemeOverrides(result.themeFiles, iframeState as IframeState | null);
      const fileMap = buildThemeFileMap(overridden, result.meta);
      const slug = result.meta.themeName;

      const res = await fetch("/api/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileMap, slug }),
      });
      if (!res.ok) throw new Error("Packaging failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowInstallInstructions(true);
    } finally {
      setIsPackaging(false);
    }
  }

  async function handlePreview() {
    if (!result) return;
    setIsPreviewing(true);

    try {
      const overridden = applyThemeOverrides(result.themeFiles, iframeState as IframeState | null);

      await set("playground-theme", {
        ...overridden,
        meta: result.meta,
      });
      window.open("/playground-preview", "_blank");
      setIsPreviewing(false);
    } catch (err) {
      console.error(err);
      setIsPreviewing(false);
    }
  }

  function handleStartOver() {
    setStep("input");
    setResult(null);
    setError(null);
    setPipelineSteps(INITIAL_STEPS);
    setShowInstallInstructions(false);
    setInitialDesc("");
    setInitialArch(null);
    setFormKey(k => k + 1);
  }

  function handleSelectGalleryTheme(theme: PremadeTheme) {
    // Construct the static files
    const templates: Record<string, string> = {
      ...(theme.id === "saas" ? { "front-page.html": SAAS_FRONT_PAGE_HTML } : {}),
      "index.html": theme.id === "saas" ? SAAS_FRONT_PAGE_HTML : `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->\n<div class="wp-block-group">\n<!-- wp:heading {"level":1} -->\n<h1 class="wp-block-heading">Latest Posts</h1>\n<!-- /wp:heading -->\n</div>\n<!-- /wp:group -->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:query {"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->\n<div class="wp-block-query">\n<!-- wp:post-template -->\n<!-- wp:group {"style":{"spacing":{"padding":{"top":"1.5rem","right":"1.5rem","bottom":"1.5rem","left":"1.5rem"}}},"layout":{"type":"flex","orientation":"vertical"}} -->\n<div class="wp-block-group" style="padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">\n<!-- wp:post-title {"isLink":true} /-->\n<!-- wp:post-date /-->\n<!-- wp:post-excerpt /-->\n</div>\n<!-- /wp:group -->\n<!-- /wp:post-template -->\n<!-- wp:query-pagination -->\n<!-- wp:query-pagination-previous /-->\n<!-- wp:query-pagination-numbers /-->\n<!-- wp:query-pagination-next /-->\n<!-- /wp:query-pagination -->\n<!-- wp:query-no-results -->\n<!-- wp:paragraph -->\n<p>No posts found.</p>\n<!-- /wp:paragraph -->\n<!-- /wp:query-no-results -->\n</div>\n<!-- /wp:query -->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "single.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:post-featured-image {"isLink":false,"align":"wide"} /-->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-title {"level":1} /-->\n<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->\n<div class="wp-block-group">\n<!-- wp:post-date /-->\n<!-- wp:post-author {"showAvatar":false,"showBio":false} /-->\n</div>\n<!-- /wp:group -->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-content /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "page.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:post-title {"level":1} /-->\n<!-- wp:spacer {"height":"2rem"} -->\n<div style="height:2rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->\n<!-- wp:post-content /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "404.html": theme.id === "saas" ? SAAS_404_HTML : `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:heading {"textAlign":"center","level":1} -->\n<h1 class="wp-block-heading has-text-align-center">404 - Page Not Found</h1>\n<!-- /wp:heading -->\n<!-- wp:search {"showLabel":false,"buttonText":"Search"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "archive.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:query-title {"type":"archive","textAlign":"center"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`,
      "search.html": `<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->\n<main class="wp-block-group">\n<!-- wp:query-title {"type":"search","textAlign":"center"} /-->\n</main>\n<!-- /wp:group -->\n<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->`
    };

    const parts = {
      "header.html": SAAS_HEADER_HTML,
      "footer.html": SAAS_FOOTER_HTML
    };

    setThemeSlug(theme.id);
    themeSlugRef.current = theme.id;
    setArchetypeId(theme.id);

    const customCss = theme.id === "saas" ? generateSaasCustomCss() : undefined;

    // Instantly inject the statically generated template into the Result state and bypass the generation wait
    setResult({
      themeFiles: {
        themeJson: JSON.stringify(theme.themeJson, null, 2),
        darkMode: JSON.stringify(theme.darkMode, null, 2),
        templates,
        parts,
        patterns: {},
        customCss,
        ...(theme.id === "saas" ? {
          skeletonPages: {
            signup: { title: "Sign Up", slug: "signup", content: SAAS_SIGNUP_HTML },
            pricing: { title: "Pricing", slug: "pricing", content: SAAS_PRICING_HTML },
            docs: { title: "Documentation", slug: "docs", content: SAAS_DOCS_HTML },
            contact: { title: "Contact", slug: "contact", content: SAAS_CONTACT_HTML },
          }
        } : {}),
      },
      audit: {
        score: 100,
        grade: "A",
        checks: [
          { name: "Pre-made Template", passed: true, severity: "info", message: "Curated static template loaded." }
        ]
      },
      meta: {
        themeName: theme.id,
        displayName: theme.archetype.name,
        description: theme.archetype.description
      }
    });

    setPipelineSteps(INITIAL_STEPS.map(s => ({ ...s, status: "done" })));
    setStep("results");
  }

  function handleThemeJsonChange(newThemeStr: string) {
    if (!result) return;
    setResult({
      ...result,
      themeFiles: {
        ...result.themeFiles,
        themeJson: newThemeStr,
      },
    });
  }

  const currentStepIndex = pipelineSteps.findIndex(s => s.status === "active");

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Navbar - Fixed Height */}
      <nav className="shrink-0 w-full z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-all shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            ForgeTheme
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block">
            Home
          </Link>
          {step !== "input" && (
            <button
              onClick={handleStartOver}
              className="text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            >
              Start over
            </button>
          )}
        </div>
      </nav>

      {/* Main Split-Pane Content Area */}
      <main className="flex-1 flex overflow-hidden relative z-10 w-full">
        {/* Left Sidebar Pane */}
        <aside className="w-[480px] shrink-0 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-2xl shadow-2xl z-20 flex flex-col">
          {step === "input" && (
            <>
              {/* Segmented Controls for Sidebar */}
              <div className="p-6 pb-2 border-b border-zinc-200/30 dark:border-zinc-800/30">
                <div className="inline-flex w-full items-center p-1 bg-zinc-100/50 dark:bg-zinc-950/50 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
                  <button
                    onClick={() => setActiveTab("generator")}
                    className={`flex-1 relative py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      activeTab === "generator"
                        ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    Theme Generator
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`flex-1 relative py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      activeTab === "gallery"
                        ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                    }`}
                  >
                    Template Gallery
                  </button>
                </div>
              </div>
              
              {/* Form / Gallery Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {activeTab === "generator" ? (
                  <GeneratorForm 
                    key={formKey}
                    initialDescription={initialDesc}
                    initialArchetype={initialArch ?? undefined}
                    onSubmit={handleSubmit} 
                  />
                ) : (
                  <TemplateGallery onSelectTheme={handleSelectGalleryTheme} />
                )}
              </div>
            </>
          )}

          {(step === "generating" || step === "results") && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              {step === "generating" ? (
                <>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                    <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse"></span>
                    Building Theme...
                  </h2>
                  <ProgressIndicator
                    currentStep={currentStepIndex >= 0 ? currentStepIndex : 0}
                    steps={pipelineSteps.map((s) => ({ name: s.name, status: s.status, detail: s.detail }))}
                  />
                  {error && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                      <p className="text-red-700 dark:text-red-400 text-sm font-medium mb-3">{error}</p>
                      <button
                        onClick={handleStartOver}
                        className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                      >
                        Try again &rarr;
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col h-full z-10">
                  <div className="flex-1 p-0 flex flex-col -m-6 mb-0 shadow-lg relative z-20">
                    {result && (
                      <IterationChat
                        onSendMessage={handleSendMessage}
                        onRegenerateLayout={() => {}}
                        onUndo={handleUndo}
                        canUndo={undoCount > 0}
                        onRedo={handleRedo}
                        canRedo={redoCount > 0}
                        onImageUpload={selectedBlock ? handleImageUpload : undefined}
                        isProcessing={isIterating}
                        selectedBlock={selectedBlock}
                        onClearSelection={() => {
                          setSelectedBlock(null);
                          document.querySelectorAll('iframe').forEach(f => {
                            f.contentWindow?.postMessage({ type: 'CLEAR_SELECTION' }, '*');
                          });
                        }}
                        onApplySitewide={handleApplySitewide}
                        showGlobalBadge={showGlobalApplyPrompt}
                        isGlobalMode={selectedBlock?.blockName.toLowerCase().includes('header') || selectedBlock?.blockName.toLowerCase().includes('footer') || activeFile.includes('parts/')}
                      />
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={isPackaging || isPreviewing}
                      className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 font-semibold bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isPackaging ? "Packaging..." : "Download ZIP"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>

                    <button
                      onClick={handlePreview}
                      disabled={isPackaging || isPreviewing}
                      className="w-full py-2.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isPreviewing ? "Generating Blueprint..." : "Preview in WordPress"}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right Canvas Pane */}
        <section className="flex-1 relative overflow-hidden bg-white/50 dark:bg-zinc-950/50 flex flex-col">
          {/* Animated Glow Orbs copied precisely from landing page */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto pointer-events-none z-0">
            <div className="absolute -top-48 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-32 right-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500/20 dark:bg-purple-500/10 blur-[128px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>

          <div className="flex-1 relative z-10 flex flex-col p-6 w-full h-full overflow-hidden">
            {step === "input" && activeTab === "generator" && (
              <div className="flex-1 flex flex-col justify-center items-center text-center opacity-90">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3 shadow-xl shadow-blue-500/5 mb-8 transform -rotate-3 hover:rotate-0 transition-all">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white max-w-2xl mb-6">
                  Forge your brand's digital identity {" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    instantly
                  </span>
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Start by describing your dream website on the left, or dive into one of our curated archetypes to spark your creativity.
                </p>
                <div className="mt-12 flex items-center justify-center gap-3 opacity-50 text-sm font-medium text-zinc-500 uppercase tracking-widest">
                  <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                  AI Powered Environment
                  <span className="w-8 h-[1px] bg-zinc-300 dark:bg-zinc-700"></span>
                </div>
              </div>
            )}

            {step === "input" && activeTab === "gallery" && (
              <div className="flex-1 w-full h-full relative z-10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex-1 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                  {/* Mock Browser Header */}
                  <div className="h-14 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-400 dark:bg-red-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80 border border-black/10"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-green-400 dark:bg-green-500/80 border border-black/10"></div>
                    </div>
                    <div className="ml-auto mr-auto px-4 py-1.5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-xs font-mono rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-inner">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      forge-saas-blueprint.local
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950">
                    <iframe 
                      src="/templates/saas" 
                      className="w-full h-full border-0"
                      title="SaaS Template Preview"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === "generating" && !result && (
              <div className="flex-1 flex justify-center items-center">
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl max-w-sm w-full mx-auto">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/30 shadow-lg shadow-blue-500/10 mb-8 relative">
                    <svg className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin absolute" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">Booting Sandbox...</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                    Deploying virtual WordPress instance to preview your generated block theme in real-time.
                  </p>
                </div>
              </div>
            )}

            {step === "results" && result && (
              <div className="flex-1 w-full h-full relative z-10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex-1 bg-white dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                  <WorkbenchHeader
                    files={[
                      ...(result.themeFiles.templates['front-page.html'] || result.themeFiles.templates['index.html'] ? ['front-page.html'] : []),
                      ...(result.themeFiles.templates['404.html'] ? ['404.html'] : []),
                      ...Object.keys(result.themeFiles.skeletonPages || {}).map(s => `pages/${s}`),
                      ...Object.keys(result.themeFiles.parts).map(p => `parts/${p}`),
                    ]}
                    activeFile={activeFile}
                    openFiles={openFiles}
                    onFileSelect={(file) => {
                      setActiveFile(file);
                      if (!openFiles.includes(file)) setOpenFiles(prev => [...prev, file]);
                    }}
                    onFileClose={(file) => {
                      const newOpen = openFiles.filter(f => f !== file);
                      setOpenFiles(newOpen);
                      if (activeFile === file && newOpen.length > 0) setActiveFile(newOpen[newOpen.length - 1]);
                    }}
                    mode={viewMode}
                    onModeChange={setViewMode}
                    isGlobalScope={selectedBlock?.blockName.toLowerCase().includes('header') || selectedBlock?.blockName.toLowerCase().includes('footer') || activeFile.includes('parts/')}
                  />
                  {/* Theme Preview Flex Container */}
                  <div className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950 relative z-0 overflow-hidden flex flex-col">
                    {(themeSlug && themeSlug !== "generated-theme") ? (() => {
                      const iframeSlug = (() => {
                        if (!activeFile || activeFile === 'index.html' || activeFile === 'front-page.html' || activeFile.startsWith('parts/')) return '';
                        if (activeFile.startsWith('pages/')) return activeFile.replace('pages/', '').replace('.html', '');
                        return activeFile.replace('.html', '');
                      })();
                      const iframeSrc = `/templates/${themeSlug}${iframeSlug ? `/${iframeSlug}` : ''}`;
                      return (
                        <iframe
                          key={activeFile}
                          src={iframeSrc}
                          className="w-full h-full border-0"
                          title={`${themeSlug} Template Iteration Preview`}
                        />
                      );
                    })() : (
                      <ThemePreview
                        themeJson={result?.themeFiles.darkMode || result?.themeFiles.themeJson}
                        templates={result?.themeFiles.templates}
                        parts={result?.themeFiles.parts}
                        patterns={result?.themeFiles.patterns}
                        customCss={result?.themeFiles.customCss}
                        skeletonPages={result?.themeFiles.skeletonPages}
                        activeFile={activeFile}
                        mode={viewMode}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {showInstallInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInstallInstructions(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Theme downloaded!</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Two ways to use your theme</p>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Option A: WordPress Playground (free, instant)</h4>
              <ol className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                  <span>Go to <a href="https://playground.wordpress.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 underline">playground.wordpress.net</a></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                  <span>Go to <span className="font-semibold text-zinc-900 dark:text-white">Appearance &rarr; Themes &rarr; Add New &rarr; Upload Theme</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                  <span>Upload <span className="font-semibold text-zinc-900 dark:text-white">{result?.meta.themeName}.zip</span>, install, and activate</span>
                </li>
              </ol>
            </div>

            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Option B: Your WordPress site</h4>
              <ol className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400">1</span>
                  <span>Go to <span className="font-semibold text-zinc-900 dark:text-white">Appearance &rarr; Themes</span> in your WordPress admin</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400">2</span>
                  <span>Click <span className="font-semibold text-zinc-900 dark:text-white">Add New Theme &rarr; Upload Theme</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400">3</span>
                  <span>Choose <span className="font-semibold text-zinc-900 dark:text-white">{result?.meta.themeName}.zip</span>, click <span className="font-semibold text-zinc-900 dark:text-white">Install Now</span>, then <span className="font-semibold text-zinc-900 dark:text-white">Activate</span></span>
                </li>
              </ol>
            </div>

            <p className="mt-5 text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">Note:</span> The WordPress admin editor may look different from the preview. Activate the theme and visit your live site URL to see the final result.
            </p>

            <button
              onClick={() => setShowInstallInstructions(false)}
              className="mt-4 w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
