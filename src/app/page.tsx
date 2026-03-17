import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              ForgeTheme
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors hidden sm:block">
              How it works
            </a>
            <Link 
              href="/app" 
              className="text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-zinc-900/20 dark:shadow-white/10"
            >
              Start Generating
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto pointer-events-none">
            <div className="absolute -top-48 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 blur-[128px] rounded-full" />
            <div className="absolute top-32 right-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[128px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
              v1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
              Design WordPress themes<br className="hidden md:block" />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                at the speed of thought.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Describe your ideal website, and our AI will generate a complete, production-ready Block Theme in seconds. Fully responsive, natively built, and instantly previewable.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/app"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-medium text-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-blue-500/25"
              >
                Generate Your Theme
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-full font-medium text-lg flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                View Features
              </a>
            </div>

            {/* Dashboard / UI Preview (Mock) */}
            <div className="mt-20 relative max-w-5xl mx-auto">
              {/* Glassmorphism framing */}
              <div className="absolute inset-x-8 -inset-y-8 bg-gradient-to-b from-blue-500/10 to-transparent blur-2xl rounded-[3rem] -z-10" />
              
              <div className="relative rounded-2xl md:rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[400px]">
                {/* Browser UI Bar */}
                <div className="h-12 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-32 py-1 text-xs text-zinc-500">
                    localhost:3000/app
                  </div>
                </div>
                
                {/* Abstract Preview Content mimicking the generator app */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-90">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800/50 rounded w-1/2"></div>
                    <div className="pt-4">
                      <div className="h-32 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shrink-0 flex items-center justify-center">
                        <div className="space-y-2 w-3/4">
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 h-64 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    {/* Placeholder for iframe / preview */}
                    <div className="w-full h-8 bg-zinc-200 dark:bg-zinc-700/50 flex items-center px-4">
                      <div className="w-16 h-2 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
                      <div className="ml-auto w-8 h-2 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="h-12 bg-zinc-200 dark:bg-zinc-700/50 rounded w-1/2"></div>
                      <div className="flex gap-4">
                        <div className="w-1/3 h-24 bg-zinc-200 dark:bg-zinc-700/30 rounded"></div>
                        <div className="w-1/3 h-24 bg-zinc-200 dark:bg-zinc-700/30 rounded"></div>
                        <div className="w-1/3 h-24 bg-zinc-200 dark:bg-zinc-700/30 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
                Everything you need to build stunning themes.
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Stop tweaking code and start designing. Our platform handles the complex architecture of WordPress Block Themes for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Generation",
                  desc: "Describe your brand, and our advanced LLM interprets your requirements into full semantic layouts.",
                  icon: (
                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Instant Live Previews",
                  desc: "See exactly what your theme looks like through the embedded WordPress Playground. No server required.",
                  icon: (
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )
                },
                {
                  title: "Native Block Compatibility",
                  desc: "Generates pure theme.json and core block HTML patterns. No bloated plugins or external page builders.",
                  icon: (
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: "1-Click Download",
                  desc: "Export your generated theme instantly as a .zip file ready to be uploaded to any WordPress instance.",
                  icon: (
                    <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )
                },
                {
                  title: "Curated Archetypes",
                  desc: "Not sure where to start? Choose from premium pre-built archetypes like Portfolios, Blogs, or SaaS pages.",
                  icon: (
                    <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )
                },
                {
                  title: "Code Validated",
                  desc: "Every theme goes through an automated audit to ensure structural integrity and HTML validity before you see it.",
                  icon: (
                    <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600 dark:bg-indigo-900"></div>
          {/* Abstract wavy lines */}
          <svg className="absolute inset-0 w-full h-full text-blue-500 dark:text-indigo-800 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
            <path d="M0,50 C20,20 80,80 100,50 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
          
          <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to create your next masterpiece?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of creators who are supercharging their WordPress workflow with AI-driven design capabilities.
            </p>
            <Link 
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 hover:bg-zinc-50 hover:text-blue-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl rounded-full font-bold text-lg"
            >
              Start Generating for Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 py-12 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">ForgeTheme</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              The fastest way to generate standard-compliant Block Themes for WordPress.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">WordPress Themes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500 text-center">
          © {new Date().getFullYear()} ForgeTheme. All rights reserved. Built with ❤️ for the WordPress community.
        </div>
      </footer>
    </div>
  );
}
