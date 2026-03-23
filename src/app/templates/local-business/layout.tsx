'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import TemplateProvider from "@/components/TemplateProvider";
import NativeIframeController from "@/components/NativeIframeController";
import JsxStringRenderer from "@/components/JsxStringRenderer";
import { LOCAL_BUSINESS_HEADER_JSX_SOURCE, LOCAL_BUSINESS_FOOTER_JSX_SOURCE } from "./jsx-sources";
import { get } from 'idb-keyval';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

function LocalBusinessLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const isolate = searchParams.get('isolate') === 'true';

  const [headerJsx, setHeaderJsx] = useState(LOCAL_BUSINESS_HEADER_JSX_SOURCE);
  const [footerJsx, setFooterJsx] = useState(LOCAL_BUSINESS_FOOTER_JSX_SOURCE);

  useEffect(() => {
    get('jsx-pages').then((pages: any) => {
      if (pages && pages['header']) setHeaderJsx(pages['header']);
      if (pages && pages['footer']) setFooterJsx(pages['footer']);
    });
  }, []);

  return (
    <TemplateProvider>
      <NativeIframeController />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', WebkitFontSmoothing: 'antialiased' }}>

        {!isolate && <JsxStringRenderer jsxString={headerJsx} />}

        <main>
          {children}
        </main>

        {!isolate && <JsxStringRenderer jsxString={footerJsx} />}

      </div>
    </TemplateProvider>
  );
}

export default function LocalBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}></div>}>
      <LocalBusinessLayoutContent>{children}</LocalBusinessLayoutContent>
    </Suspense>
  );
}
