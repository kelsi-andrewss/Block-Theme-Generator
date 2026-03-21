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

      if (event.data.type === 'PATCH_STYLES' && event.data.styles && selectedEl) {
        const { iterateId, styles } = event.data as { iterateId: string; styles: Record<string, string> };
        selectedEl.setAttribute('data-iterate-id', iterateId);
        const oldProps: Record<string, string> = {};
        const isGradientText = (selectedEl.style.getPropertyValue('-webkit-background-clip') === 'text'
          || selectedEl.style.getPropertyValue('background-clip') === 'text')
          && selectedEl.style.getPropertyValue('-webkit-text-fill-color') === 'transparent';

        // If setting "color" on a gradient-text element, clear the gradient so color is visible
        if (isGradientText && styles['color']) {
          const colorVal = styles['color'];
          // Snapshot gradient-related props for undo
          for (const gp of ['background', 'background-image', '-webkit-background-clip', 'background-clip', '-webkit-text-fill-color']) {
            oldProps[gp] = selectedEl.style.getPropertyValue(gp);
          }
          selectedEl.style.setProperty('background', 'none');
          selectedEl.style.removeProperty('-webkit-background-clip');
          selectedEl.style.removeProperty('background-clip');
          selectedEl.style.setProperty('-webkit-text-fill-color', colorVal);
        }

        for (let [prop, value] of Object.entries(styles)) {
          // background shorthand resets background-clip — use background-image instead
          if (prop === 'background' && isGradientText && !styles['color']) {
            prop = 'background-image';
          }
          if (!(prop in oldProps)) {
            oldProps[prop] = selectedEl.style.getPropertyValue(prop);
          }
          if (value === '') {
            selectedEl.style.removeProperty(prop);
          } else {
            selectedEl.style.setProperty(prop, value);
          }
        }
        // Re-assert background-clip if we redirected background → background-image
        if (isGradientText && styles['background'] && !styles['color']) {
          selectedEl.style.setProperty('-webkit-background-clip', 'text');
          selectedEl.style.setProperty('background-clip', 'text');
        }
        window.parent.postMessage({ type: 'STYLE_SNAPSHOT', iterateId, oldProps }, '*');
      }

      if (event.data.type === 'UNDO_STYLES' && event.data.iterateId) {
        const { iterateId, oldProps } = event.data as { iterateId: string; oldProps: Record<string, string> };
        const el = document.querySelector<HTMLElement>(`[data-iterate-id="${iterateId}"]`);
        if (el) {
          for (const [prop, value] of Object.entries(oldProps)) {
            if (value === '') {
              el.style.removeProperty(prop);
            } else {
              el.style.setProperty(prop, value);
            }
          }
          el.removeAttribute('data-iterate-id');
        }
      }

      if (event.data.type === 'PATCH_ELEMENT' && event.data.html) {
        // selectedEl still holds the live DOM reference — swap it directly
        if (selectedEl) {
          selectedEl.outerHTML = event.data.html;
        }
        highlightedEl = null;
        selectedEl = null;
      }

      if (event.data.type === 'UNDO_ELEMENT' && event.data.findHtml && event.data.restoreHtml) {
        // Walk all elements to find the one matching the patched HTML
        const all = document.body.querySelectorAll('*');
        for (const el of all) {
          if (el.outerHTML === event.data.findHtml) {
            el.outerHTML = event.data.restoreHtml;
            break;
          }
        }
      }

      if (event.data.type === 'PATCH_CONTENT' && event.data.html) {
        document.body.innerHTML = event.data.html;
        highlightedEl = null;
        selectedEl = null;
      }

      if (event.data.type === 'SET_MODE') {
        editMode = event.data.mode === 'edit';
        if (!editMode) {
          // Clear any selection/highlight when switching to browse
          if (highlightedEl) {
            highlightedEl.style.outline = '';
            highlightedEl.style.outlineOffset = '';
            highlightedEl.style.cursor = '';
            highlightedEl = null;
          }
          if (selectedEl) {
            selectedEl.style.outline = '';
            selectedEl.style.outlineOffset = '';
            selectedEl.style.backgroundColor = '';
            selectedEl = null;
          }
        }
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
    let editMode = true;

    function isSelectable(target: HTMLElement) {
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'html' || tagName === 'body') return false;
      if (target.closest('[data-no-select]')) return false;
      return true;
    }

    function handleMouseOver(e: MouseEvent) {
      if (!editMode) return;
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
      if (!editMode) return;
      if (highlightedEl && highlightedEl !== selectedEl) {
        highlightedEl.style.outline = '';
        highlightedEl.style.outlineOffset = '';
        highlightedEl.style.cursor = '';
      }
      highlightedEl = null;
    }

    function handleClick(e: MouseEvent) {
      if (!editMode) return;
      const target = e.target as HTMLElement;
      if (!isSelectable(target)) return;
      
      e.preventDefault();
      e.stopPropagation();

      if (selectedEl) {
        selectedEl.style.outline = '';
        selectedEl.style.outlineOffset = '';
        selectedEl.style.backgroundColor = '';
      }

      // Capture clean outerHTML BEFORE adding selection highlight styles
      const cleanHtml = target.outerHTML;

      selectedEl = target;
      selectedEl.style.outline = '2px solid #f97316'; // Orange-500 for selection
      selectedEl.style.outlineOffset = '4px';
      selectedEl.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';

      const blockName = target.tagName.toLowerCase();
      const rawText = target.innerText || target.textContent || '';
      const content = rawText.slice(0, 50) + (rawText.length > 50 ? '...' : '');

      window.parent.postMessage({
        type: 'BLOCK_SELECTED',
        payload: {
          blockId: getBlockId(target),
          blockName: `Native <${blockName}>`,
          content: content,
          html: cleanHtml
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
