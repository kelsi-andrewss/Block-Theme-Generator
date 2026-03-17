import Link from "next/link";
import '../../globals.css';
import TemplateProvider from "@/components/TemplateProvider";

export const metadata = {
  title: "Portfolio Template",
  description: "A modern, premium portfolio template.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TemplateProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white selection:bg-[var(--color-primary-500)]/30 selection:text-[var(--color-primary-200)] antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 dark:bg-white/80 dark:bg-black/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/templates/portfolio" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-white/60 hover:to-zinc-900 dark:hover:to-white transition-all">
              Portfolio
            </Link>
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/templates/portfolio" className="text-sm text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:text-white transition-colors">Home</Link>
                <Link href="/templates/portfolio/projects" className="text-sm text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:text-white transition-colors">Projects</Link>
                <Link href="/templates/portfolio/about" className="text-sm text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:text-white transition-colors">About</Link>
                <Link href="/templates/portfolio/contact" className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                  Contact Me
                </Link>
              </div>
            </div>
            {/* Mobile menu button could go here */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 min-h-[calc(100vh-80px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 dark:bg-white/80 dark:bg-black/50 backdrop-blur-md py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-zinc-500 dark:text-gray-500">
            <Link href="#" className="hover:text-zinc-900 dark:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-zinc-900 dark:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-zinc-900 dark:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary-900)]/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-secondary-900)]/20 blur-[120px]" />
      </div>
    </div>
    </TemplateProvider>
  );
}
