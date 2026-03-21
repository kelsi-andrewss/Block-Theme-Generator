'use client';

import { useSearchParams } from 'next/navigation';
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

  return (
    <TemplateProvider>
      <NativeIframeController />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', WebkitFontSmoothing: 'antialiased', fontFamily: inter.style.fontFamily }}>

        {!isolate && <JsxStringRenderer jsxString={SAAS_HEADER_JSX_SOURCE} />}

        {/* Main Content */}
        <main>
          {children}
        </main>

        {!isolate && <JsxStringRenderer jsxString={SAAS_FOOTER_JSX_SOURCE} />}

      </div>
    </TemplateProvider>
  );
}
