'use client';

import { useState, useEffect, Suspense } from 'react';

import JsxStringRenderer from '@/components/JsxStringRenderer';
import { BLOG_JSX_SOURCE } from './jsx-sources';
import { get } from 'idb-keyval';

const WP_VAR_BRIDGE: Record<string, string> = {
  '--wp--preset--color--primary': 'var(--color-primary-500)',
  '--wp--preset--color--secondary': 'var(--color-secondary-500)',
  '--wp--preset--color--contrast': 'var(--color-text)',
  '--wp--preset--color--base': 'var(--color-bg)',
};

export default function BlogPage() {
  const [jsxSource, setJsxSource] = useState(BLOG_JSX_SOURCE);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('gallery=true')) return;
    get('jsx-pages').then((pages: any) => {
      if (pages && pages['home']) setJsxSource(pages['home']);
    });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: '100vh',
      ...WP_VAR_BRIDGE,
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}></div>}>
        <JsxStringRenderer jsxString={jsxSource} />
      </Suspense>
    </div>
  );
}

export const dynamic = 'force-dynamic';
