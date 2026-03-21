"use client";

import { useEffect, useRef, useState } from "react";

type ViewportSize = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export interface ThemePreviewProps {
  themeJson?: string;
  templates?: Record<string, string>;
  parts?: Record<string, string>;
  patterns?: Record<string, string>;
  customCss?: string;
  skeletonPages?: Record<string, { title: string; slug: string; content: string }>;
  activeFile?: string;
  mode?: 'edit' | 'preview';
}

// Vanilla JS selection bridge — injected into the blob iframe to enable click-to-select
const SELECTION_BRIDGE_SCRIPT = (enabled: boolean) => `
<script>
(function() {
  if (!${enabled}) {
    // In preview mode, allow natural link clicks
    return;
  }
  var hl = null, sel = null;

  function bid(el) {
    var p = [], c = el;
    for (var i = 0; i < 4 && c && c !== document.documentElement; i++) {
      var par = c.parentElement;
      var idx = par ? Array.prototype.indexOf.call(par.children, c) : 0;
      p.unshift(c.tagName.toLowerCase() + idx);
      c = par;
    }
    return p.join('-');
  }

  function ok(t) {
    var n = t.tagName.toLowerCase();
    return n !== 'html' && n !== 'body' && !t.closest('[data-no-select]');
  }

  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    if (!ok(t) || t === sel) return;
    e.stopPropagation();
    if (hl && hl !== sel) { hl.style.outline = ''; hl.style.outlineOffset = ''; hl.style.cursor = ''; }
    hl = t;
    t.style.outline = '2px dashed #fb923c';
    t.style.outlineOffset = '4px';
    t.style.cursor = 'pointer';
  });

  document.addEventListener('mouseout', function() {
    if (hl && hl !== sel) { hl.style.outline = ''; hl.style.outlineOffset = ''; hl.style.cursor = ''; }
    hl = null;
  });

  document.addEventListener('click', function(e) {
    var t = e.target;
    if (!ok(t)) return;
    e.preventDefault();
    e.stopPropagation();
    if (sel) { sel.style.outline = ''; sel.style.outlineOffset = ''; sel.style.backgroundColor = ''; }
    var cleanHtml = t.outerHTML;
    sel = t;
    sel.style.outline = '2px solid #f97316';
    sel.style.outlineOffset = '4px';
    sel.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
    var n = t.tagName.toLowerCase();
    var r = t.innerText || t.textContent || '';
    var c = r.slice(0, 50) + (r.length > 50 ? '...' : '');
    window.parent.postMessage({
      type: 'BLOCK_SELECTED',
      payload: { blockId: bid(t), blockName: 'Native <' + n + '>', content: c, html: cleanHtml }
    }, '*');
  }, { capture: true });

  window.addEventListener('message', function(e) {
    if (!e.data) return;
    if (e.data.type === 'CLEAR_SELECTION' && sel) {
      sel.style.outline = ''; sel.style.outlineOffset = ''; sel.style.backgroundColor = '';
      sel = null;
    }
    if (e.data.type === 'PATCH_STYLES' && e.data.styles && sel) {
      var iterateId = e.data.iterateId;
      var styles = e.data.styles;
      sel.setAttribute('data-iterate-id', iterateId);
      var oldProps = {};
      var isGradientText = (sel.style.getPropertyValue('-webkit-background-clip') === 'text'
        || sel.style.getPropertyValue('background-clip') === 'text')
        && sel.style.getPropertyValue('-webkit-text-fill-color') === 'transparent';

      if (isGradientText && styles['color']) {
        var gps = ['background', 'background-image', '-webkit-background-clip', 'background-clip', '-webkit-text-fill-color'];
        for (var g = 0; g < gps.length; g++) { oldProps[gps[g]] = sel.style.getPropertyValue(gps[g]); }
        sel.style.setProperty('background', 'none');
        sel.style.removeProperty('-webkit-background-clip');
        sel.style.removeProperty('background-clip');
        sel.style.setProperty('-webkit-text-fill-color', styles['color']);
      }

      var keys = Object.keys(styles);
      for (var k = 0; k < keys.length; k++) {
        var p = keys[k];
        var v = styles[p];
        if (p === 'background' && isGradientText && !styles['color']) { p = 'background-image'; }
        if (!(p in oldProps)) { oldProps[p] = sel.style.getPropertyValue(p); }
        if (v === '') { sel.style.removeProperty(p); }
        else { sel.style.setProperty(p, v); }
      }
      if (isGradientText && styles['background'] && !styles['color']) {
        sel.style.setProperty('-webkit-background-clip', 'text');
        sel.style.setProperty('background-clip', 'text');
      }
      window.parent.postMessage({ type: 'STYLE_SNAPSHOT', iterateId: iterateId, oldProps: oldProps }, '*');
    }
    if (e.data.type === 'UNDO_STYLES' && e.data.iterateId) {
      var undoId = e.data.iterateId;
      var undoProps = e.data.oldProps;
      var undoEl = document.querySelector('[data-iterate-id="' + undoId + '"]');
      if (undoEl) {
        var undoKeys = Object.keys(undoProps);
        for (var u = 0; u < undoKeys.length; u++) {
          var up = undoKeys[u];
          if (undoProps[up] === '') { undoEl.style.removeProperty(up); }
          else { undoEl.style.setProperty(up, undoProps[up]); }
        }
        undoEl.removeAttribute('data-iterate-id');
      }
    }
    if (e.data.type === 'PATCH_ELEMENT' && e.data.html) {
      if (sel) {
        var w = sel.offsetWidth;
        var h = sel.offsetHeight;
        var wrapper = '<div style="max-width:' + w + 'px;max-height:' + h + 'px;overflow:hidden">' + e.data.html + '</div>';
        sel.outerHTML = wrapper;
      }
      hl = null; sel = null;
    }
    if (e.data.type === 'UNDO_ELEMENT' && e.data.findHtml && e.data.restoreHtml) {
      var allEls = document.body.querySelectorAll('*');
      for (var j = 0; j < allEls.length; j++) {
        if (allEls[j].outerHTML === e.data.findHtml) {
          allEls[j].outerHTML = e.data.restoreHtml;
          break;
        }
      }
    }
    if (e.data.type === 'PATCH_CONTENT' && e.data.html) {
      // Global fallback: swap entire body
      document.body.innerHTML = e.data.html;
      hl = null; sel = null;
    }
  });
})();
</script>`;

export default function ThemePreview({
  themeJson,
  templates,
  parts,
  customCss,
  skeletonPages,
  activeFile = "index.html",
  mode = "edit"
}: ThemePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  useEffect(() => {
    if (!iframeRef.current || !themeJson || !templates) return;

    try {
      const parsedJson = JSON.parse(themeJson);
      
      // 1. Build CSS from theme.json
      let cssVars = ":root {\n";
      
      // Colors
      const palette = parsedJson?.settings?.color?.palette || [];
      palette.forEach((c: any) => {
        cssVars += `  --wp--preset--color--${c.slug}: ${c.color};\n`;
      });
      
      // Typo
      const fonts = parsedJson?.settings?.typography?.fontFamilies || [];
      fonts.forEach((f: any) => {
        cssVars += `  --wp--preset--font-family--${f.slug}: ${f.fontFamily};\n`;
      });
      
      const sizes = parsedJson?.settings?.typography?.fontSizes || [];
      sizes.forEach((s: any) => {
        cssVars += `  --wp--preset--font-size--${s.slug}: ${s.size};\n`;
      });

      cssVars += "}\n";

      // Base Styles
      const styles = parsedJson?.styles || {};
      const bgColor = styles?.color?.background || "#ffffff";
      const textColor = styles?.color?.text || "#000000";
      const fontFam = styles?.typography?.fontFamily || "sans-serif";
      
      let baseCss = `
        /* WP Core Base */
        html, body {
          margin: 0;
          padding: 0;
          max-width: 100vw;
          overflow-x: hidden;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        body { 
          background-color: ${bgColor}; 
          color: ${textColor}; 
          font-family: ${fontFam};
          line-height: ${styles?.typography?.lineHeight || 1.6};
          -webkit-font-smoothing: antialiased;
        }

        a { color: inherit; text-decoration: underline; }
        a:hover { text-decoration: none; }
        
        /* Layouts & Containers */
        .wp-block-group { box-sizing: border-box; }
        .is-layout-constrained > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
          max-width: 1200px;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .is-layout-flex {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.25em;
        }
        .is-vertical { flex-direction: column; align-items: flex-start; }
        .is-content-justification-center { justify-content: center; }
        .is-content-justification-space-between { justify-content: space-between; }

        /* Columns */
        .wp-block-columns {
          display: flex;
          margin-bottom: 1.75em;
          box-sizing: border-box;
          flex-wrap: wrap;
        }
        @media (min-width: 782px) {
          .wp-block-columns { flex-wrap: nowrap; gap: 2em; }
        }
        
        .wp-block-columns.is-not-stacked-on-mobile {
          flex-wrap: nowrap;
        }
        
        .wp-block-column { 
          flex-grow: 1; 
          min-width: 0; 
          word-break: break-word; 
          overflow-wrap: break-word; 
          flex-basis: 100%; /* Default to stacking on mobile */
        }
        @media (min-width: 782px) {
          .wp-block-column { flex-basis: 0; }
        }

        /* Cover Block */
        .wp-block-cover {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          background-size: cover;
          background-position: center center;
          overflow: hidden;
          padding: 2em;
        }
        .wp-block-cover.has-background-dim::before {
          content: "";
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background-color: inherit;
          opacity: 0.5;
          z-index: 1;
        }
        .wp-block-cover__inner-container { z-index: 2; position: relative; width: 100%; }
        
        /* Buttons */
        .wp-block-buttons { display: flex; flex-wrap: wrap; gap: 0.5em; }
        .wp-block-button__link {
          box-sizing: border-box;
          cursor: pointer;
          display: inline-block;
          text-align: center;
          word-break: break-word;
          color: var(--wp--preset--color--base, #ffffff);
          background-color: var(--wp--preset--color--primary, #32373c);
          border-radius: 9999px;
          padding: calc(0.667em + 2px) calc(1.333em + 2px);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s ease;
        }
        .wp-block-button__link:hover { opacity: 0.85; text-decoration: none; }
        .has-background { background-color: var(--wp--preset--color--base, #32373c); }
        .has-text-color { color: var(--wp--preset--color--contrast, #fff); }

        /* Typography */
        h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: 0.5rem; font-weight: 700; line-height: 1.2; }
        h1 { font-size: 3rem; }
        h2 { font-size: 2.25rem; }
        h3 { font-size: 1.75rem; }
        p { margin-top: 0; margin-bottom: 1.5rem; }
        .has-text-align-center { text-align: center; }
        .has-text-align-right { text-align: right; }
        
        /* Utilities */
        hr.wp-block-separator {
          border: none;
          border-bottom: 2px solid currentColor;
          opacity: 0.1;
          margin: 3em auto;
          width: 100%;
        }
        .wp-block-spacer { display: block; height: 3rem; }
        img { max-width: 100%; width: 100%; height: auto; object-fit: cover; }
        
        /* Theme JSON Variable Classes Mapping */
        ${palette.map((c: any) => `
          .has-${c.slug}-color { color: var(--wp--preset--color--${c.slug}) !important; }
          .has-${c.slug}-background-color { background-color: var(--wp--preset--color--${c.slug}) !important; }
        `).join('')}
        
        ${sizes.map((s: any) => `
          .has-${s.slug}-font-size { font-size: var(--wp--preset--font-size--${s.slug}) !important; }
        `).join('')}
      `;

      // 2. Build HTML from blocks
      // Resolve active file (Template or Part)
      let templateHTML = "";
      if (activeFile.startsWith('parts/')) {
        const partSlug = activeFile.replace('parts/', '');
        templateHTML = parts?.[partSlug] || "";
      } else if (activeFile.startsWith('pages/')) {
        const pageSlug = activeFile.replace('pages/', '');
        templateHTML = skeletonPages?.[pageSlug]?.content || "";
      } else {
        templateHTML = templates?.[activeFile] || templates?.["index.html"] || templates?.["front-page.html"] || "";
      }
      
      // Stupid simple parser to just strip block comments and resolve template parts
      let rawHtml = templateHTML;
      
      if (parts) {
        // Resolve Header
        if (rawHtml.includes('{"slug":"header"')) {
          rawHtml = rawHtml.replace(/<!-- wp:template-part \{"slug":"header"[^>]*-->/g, parts["header.html"] || "");
        }
        // Resolve Footer
        if (rawHtml.includes('{"slug":"footer"')) {
          rawHtml = rawHtml.replace(/<!-- wp:template-part \{"slug":"footer"[^>]*-->/g, parts["footer.html"] || "");
        }
      }

      // Remove all remaining block comments
      rawHtml = rawHtml.replace(/<!-- wp:[^\-]*-->/g, "").replace(/<!-- \/wp:[^>]*-->/g, "");

      const doc = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${cssVars}
            ${baseCss}
          </style>
          ${customCss ? `<style>${customCss}</style>` : ""}
        </head>
        <body>
          <div class="wp-site-blocks">
            ${rawHtml}
          </div>
          ${SELECTION_BRIDGE_SCRIPT(mode === 'edit')}
        </body>
      </html>
      `;

      const blob = new Blob([doc], { type: "text/html" });
      iframeRef.current.src = URL.createObjectURL(blob);

    } catch (e) {
      console.error("Preview render error:", e);
    }
  }, [themeJson, templates, parts, customCss, skeletonPages, activeFile, mode]);

  return (
    <div className="flex flex-col h-full w-full space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
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
      </div>

      {/* Preview container */}
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-1 justify-center w-full">
        <iframe
          ref={iframeRef}
          title="Theme Preview"
          className="border-0 bg-white transition-[width] duration-300 ease-in-out h-full xl:mx-auto shadow-sm"
          style={{ width: VIEWPORT_WIDTHS[viewport] }}
        />
      </div>
    </div>
  );
}
