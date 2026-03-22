'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { get } from 'idb-keyval';
import TemplateProvider from "@/components/TemplateProvider";
import NativeIframeController from "@/components/NativeIframeController";
import JsxStringRenderer from "@/components/JsxStringRenderer";
import { SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE } from "./jsx-sources";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

function SaaSLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isolate = searchParams.get('isolate') === 'true';
  const isGallery = searchParams.get('gallery') === 'true';
  const [headerJsx, setHeaderJsx] = useState(SAAS_HEADER_JSX_SOURCE);
  const [footerJsx, setFooterJsx] = useState(SAAS_FOOTER_JSX_SOURCE);

  useEffect(() => {
    if (isGallery) return;
    get<Record<string, string>>("jsx-pages").then(stored => {
      if (stored?.header) setHeaderJsx(stored.header);
      if (stored?.footer) setFooterJsx(stored.footer);
    });
  }, [isGallery]);

  return (
    <TemplateProvider>
      <NativeIframeController />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', WebkitFontSmoothing: 'antialiased', fontFamily: inter.style.fontFamily }}>

        {!isolate && <JsxStringRenderer jsxString={headerJsx} />}

        {/* Main Content */}
        <main>
          {children}
        </main>

        {!isolate && <JsxStringRenderer jsxString={footerJsx} />}

      </div>
    </TemplateProvider>
  );
}

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}></div>}>
      <SaaSLayoutContent>{children}</SaaSLayoutContent>
    </Suspense>
  );
}
