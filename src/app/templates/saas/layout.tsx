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
      <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-[var(--color-primary-500)]/30 selection:text-[var(--color-primary-600)] dark:selection:text-[var(--color-primary-200)] antialiased ${inter.className}`}>
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-white/5 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              
              {/* Logo */}
              <Link href="/templates/saas" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-500)] flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--color-primary-500)]/20 group-hover:scale-105 transition-transform">
                  S
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  SaaS<span className="text-[var(--color-primary-500)] dark:text-[var(--color-primary-400)]">Flow</span>
                </span>
              </Link>
              
              {/* Desktop Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="#features" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Features</Link>
                <Link href="#testimonials" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Customers</Link>
                <Link href="#pricing" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Pricing</Link>
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 hover:scale-105 transition-all shadow-md">
                  Get Started
                </Link>
              </div>
              
              {/* Mobile menu button could go here */}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16 md:pt-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200/50 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <Link href="/templates/saas" className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-[var(--color-primary-500)] flex items-center justify-center text-white text-xs font-bold">
                    S
                  </div>
                  <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">SaaSFlow</span>
                </Link>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 max-w-xs">
                  Building the next generation of powerful, scalable SaaS tools for modern teams.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 text-sm">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Features</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Integrations</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Changelog</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 text-sm">Company</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">About Us</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Careers</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Blog</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 text-sm">Legal</h3>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[var(--color-primary-500)] transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-zinc-200/50 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                © {new Date().getFullYear()} SaaSFlow Inc. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </Link>
                <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </TemplateProvider>
  );
}
