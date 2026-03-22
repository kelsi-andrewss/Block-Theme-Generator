'use client';

import { useState, useEffect } from 'react';
import { get } from 'idb-keyval';
import { SAAS_FEATURES } from '@/lib/data/saas-features';
import JsxStringRenderer from '@/components/JsxStringRenderer';

import { SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE, SAAS_JSX_SOURCE } from './jsx-sources';




const WP_VAR_BRIDGE: Record<string, string> = {
  '--wp--preset--color--primary': 'var(--color-primary-500)',
  '--wp--preset--color--secondary': 'var(--color-secondary-500)',
  '--wp--preset--color--contrast': 'var(--color-text)',
  '--wp--preset--color--base': 'var(--color-bg)',
};

export default function SaaSPage() {
  const [jsxSource, setJsxSource] = useState(SAAS_JSX_SOURCE);

  useEffect(() => {
    get<Record<string, string>>("jsx-pages").then(stored => {
      if (stored?.home) setJsxSource(stored.home);
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
      <JsxStringRenderer jsxString={jsxSource} />
    </div>
  );
}
