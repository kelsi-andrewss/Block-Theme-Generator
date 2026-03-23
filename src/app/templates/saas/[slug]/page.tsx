'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import JsxStringRenderer from '@/components/JsxStringRenderer';
import {
  SAAS_404_JSX_SOURCE,
  SAAS_SIGNUP_JSX_SOURCE,
  SAAS_PRICING_JSX_SOURCE,
  SAAS_DOCS_JSX_SOURCE,
  SAAS_CONTACT_JSX_SOURCE,
  SAAS_HEADER_JSX_SOURCE,
  SAAS_FOOTER_JSX_SOURCE,
} from '../jsx-sources';
import { get } from 'idb-keyval';

const TEMPLATE_MAP: Record<string, string> = {
  '404': SAAS_404_JSX_SOURCE,
  'signup': SAAS_SIGNUP_JSX_SOURCE,
  'pricing': SAAS_PRICING_JSX_SOURCE,
  'docs': SAAS_DOCS_JSX_SOURCE,
  'contact': SAAS_CONTACT_JSX_SOURCE,
  'header': SAAS_HEADER_JSX_SOURCE,
  'footer': SAAS_FOOTER_JSX_SOURCE,
};

const WP_VAR_BRIDGE: Record<string, string> = {
  '--wp--preset--color--primary': 'var(--color-primary-500)',
  '--wp--preset--color--secondary': 'var(--color-secondary-500)',
  '--wp--preset--color--contrast': 'var(--color-text)',
  '--wp--preset--color--base': 'var(--color-bg)',
};

export default function SaaSSubPage() {
  const { slug } = useParams<{ slug: string }>();
  const fallback = TEMPLATE_MAP[slug] ?? SAAS_404_JSX_SOURCE;
  const [jsxSource, setJsxSource] = useState(fallback);

  useEffect(() => {
    get('jsx-pages').then((pages: any) => {
      if (pages && pages[slug]) setJsxSource(pages[slug]);
    });
  }, [slug]);

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
