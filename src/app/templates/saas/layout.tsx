import Link from "next/link";
import TemplateProvider from "@/components/TemplateProvider";
import NativeIframeController from "@/components/NativeIframeController";
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

        {/* Navigation */}
        <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderBottom: '1px solid var(--color-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 70%, transparent)', backdropFilter: 'blur(24px)', transition: 'all 0.2s' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>

              {/* Logo */}
              <Link href="/templates/saas" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 700, boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--color-primary-500) 20%, transparent)' }}>
                  S
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)' }}>
                  SaaS<span style={{ color: 'var(--color-primary-500)' }}>Flow</span>
                </span>
              </Link>

              {/* Desktop Links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link href="#features" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Features</Link>
                <Link href="#testimonials" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Customers</Link>
                <Link href="#pricing" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Pricing</Link>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                  Log in
                </Link>
                <Link href="/signup" style={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', padding: '0.625rem 1.25rem', borderRadius: '9999px', textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ paddingTop: '5rem' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <Link href="/templates/saas" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem', backgroundColor: 'var(--color-primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700 }}>
                    S
                  </div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)' }}>SaaSFlow</span>
                </Link>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem', maxWidth: '20rem', lineHeight: 1.6 }}>
                  Building the next generation of powerful, scalable SaaS tools for modern teams.
                </p>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', fontSize: '0.875rem' }}>Product</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Features</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Integrations</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Pricing</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Changelog</Link></li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', fontSize: '0.875rem' }}>Company</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>About Us</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Careers</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Blog</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Contact</Link></li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '1rem', fontSize: '0.875rem' }}>Legal</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                  <li><Link href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}>Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                &copy; {new Date().getFullYear()} SaaSFlow Inc. All rights reserved.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                  <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>Twitter</span>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </Link>
                <Link href="#" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
                  <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>GitHub</span>
                  <svg style={{ height: '1.25rem', width: '1.25rem' }} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </TemplateProvider>
  );
}
