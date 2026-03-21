'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { get } from 'idb-keyval';
import TemplateProvider from "@/components/TemplateProvider";
import NativeIframeController from "@/components/NativeIframeController";
import JsxStringRenderer from "@/components/JsxStringRenderer";
import { SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE } from "./page";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isolate = searchParams.get('isolate') === 'true';
  const [headerJsx, setHeaderJsx] = useState(SAAS_HEADER_JSX_SOURCE);
  const [footerJsx, setFooterJsx] = useState(SAAS_FOOTER_JSX_SOURCE);

  useEffect(() => {
    get<Record<string, string>>("jsx-pages").then(stored => {
      if (stored?.header) setHeaderJsx(stored.header);
      if (stored?.footer) setFooterJsx(stored.footer);
    });
  }, []);

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
