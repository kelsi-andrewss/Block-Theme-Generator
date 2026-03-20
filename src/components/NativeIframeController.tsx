"use client";

import { useEffect } from "react";

export default function NativeIframeController() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Listen for messages from parent IDE
    function handleMessage(event: MessageEvent) {
      if (!event.data?.type) return;

      if (event.data.type === 'UPDATE_THEME' && event.data.payload) {
        try {
          const themeJson = typeof event.data.payload === 'string' ? JSON.parse(event.data.payload) : event.data.payload;
          const palette = themeJson.settings?.color?.palette || [];
          palette.forEach((colorObj: { slug: string; color: string }) => {
            if (colorObj.slug && colorObj.color) {
              document.documentElement.style.setProperty(`--color-${colorObj.slug}`, colorObj.color);
            }
          });
        } catch (e) {
          console.error("Error parsing theme update", e);
        }
      }

      if (event.data.type === 'CLEAR_SELECTION' && selectedEl) {
        selectedEl.style.outline = '';
        selectedEl.style.outlineOffset = '';
        selectedEl.style.backgroundColor = '';
        selectedEl = null;
      }

      if (event.data.type === 'PATCH_ELEMENT' && event.data.html) {
        // selectedEl still holds the live DOM reference — swap it directly
        if (selectedEl) {
          selectedEl.outerHTML = event.data.html;
        }
        highlightedEl = null;
        selectedEl = null;
      }

      if (event.data.type === 'PATCH_CONTENT' && event.data.html) {
        document.body.innerHTML = event.data.html;
        highlightedEl = null;
        selectedEl = null;
      }
    }
    window.addEventListener('message', handleMessage);

    // Deterministic block ID from element tag + DOM position (3 ancestor levels)
    function getBlockId(el: HTMLElement): string {
      const parts: string[] = [];
      let current: HTMLElement | null = el;
      for (let i = 0; i < 4 && current && current !== document.documentElement; i++) {
        const parent: HTMLElement | null = current.parentElement;
        const index = parent
          ? Array.prototype.indexOf.call(parent.children, current)
          : 0;
        parts.unshift(current.tagName.toLowerCase() + index);
        current = parent;
      }
      return parts.join('-');
    }

    // 2. Click-to-edit semantic bridge
    let highlightedEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    function isSelectable(target: HTMLElement) {
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'html' || tagName === 'body') return false;
      if (target.closest('[data-no-select]')) return false;
      return true;
    }

    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!isSelectable(target)) return;
      if (target === selectedEl) return;
      
      e.stopPropagation();
      if (highlightedEl && highlightedEl !== selectedEl) {
        highlightedEl.style.outline = '';
        highlightedEl.style.outlineOffset = '';
        highlightedEl.style.cursor = '';
      }
      highlightedEl = target;
      target.style.outline = '2px dashed #fb923c'; // Orange-400 for highlighting
      target.style.outlineOffset = '4px';
      target.style.cursor = 'pointer';
    }

    function handleMouseOut(e: MouseEvent) {
      if (highlightedEl && highlightedEl !== selectedEl) {
        highlightedEl.style.outline = '';
        highlightedEl.style.outlineOffset = '';
        highlightedEl.style.cursor = '';
      }
      highlightedEl = null;
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!isSelectable(target)) return;
      
      e.preventDefault();
      e.stopPropagation();

      if (selectedEl) {
        selectedEl.style.outline = '';
        selectedEl.style.outlineOffset = '';
        selectedEl.style.backgroundColor = '';
      }

      selectedEl = target;
      selectedEl.style.outline = '2px solid #f97316'; // Orange-500 for selection
      selectedEl.style.outlineOffset = '4px';
      selectedEl.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';

      const blockName = target.tagName.toLowerCase();
      // Only send the first 50 chars of text content safely, falling back to textContent or empty string
      const rawText = target.innerText || target.textContent || '';
      const content = rawText.slice(0, 50) + (rawText.length > 50 ? '...' : '');

      window.parent.postMessage({
        type: 'BLOCK_SELECTED',
        payload: {
          blockId: getBlockId(target),
          blockName: `Native <${blockName}>`,
          content: content,
          html: target.outerHTML
        }
      }, '*');
    }

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
}
