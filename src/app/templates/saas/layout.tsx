import TemplateProvider from "@/components/TemplateProvider";
import NativeIframeController from "@/components/NativeIframeController";
import JsxStringRenderer from "@/components/JsxStringRenderer";
import { SAAS_HEADER_JSX_SOURCE, SAAS_FOOTER_JSX_SOURCE } from "./page";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "SaaS Template | Block Theme Generator",
  description: "A high-converting, premium SaaS landing page template.",
};

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TemplateProvider>
      <NativeIframeController />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', WebkitFontSmoothing: 'antialiased', fontFamily: inter.style.fontFamily }}>

        <JsxStringRenderer jsxString={SAAS_HEADER_JSX_SOURCE} />

        {/* Main Content */}
        <main style={{ paddingTop: '5rem' }}>
          {children}
        </main>

        <JsxStringRenderer jsxString={SAAS_FOOTER_JSX_SOURCE} />

      </div>
    </TemplateProvider>
  );
}
