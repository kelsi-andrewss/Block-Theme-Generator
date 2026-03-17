import Link from "next/link";

export default function SaaSPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary-500)]/20 dark:bg-[var(--color-primary-500)]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-secondary-500)]/20 dark:bg-[var(--color-secondary-500)]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-8 mt-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-primary-500)] animate-pulse"></span>
            Introducing SaaSFlow 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
            Build faster with our <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-secondary-500)]">
              advanced platform
            </span>
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The complete toolkit for modern teams. Streamline your workflow, collaborate in real-time, and ship powerful products faster than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-primary-500)] text-white font-bold hover:bg-[var(--color-primary-900)] dark:hover:bg-[var(--color-primary-400)] transition-all shadow-lg shadow-[var(--color-primary-500)]/25 hover:shadow-[var(--color-primary-500)]/40 hover:-translate-y-0.5 text-center border border-[var(--color-primary-900)]/30">
              Start for free
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-center flex items-center justify-center gap-2">
              View Documentation
            </Link>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-zinc-200/50 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/10">
              <div className="h-12 border-b border-zinc-200/50 dark:border-white/10 flex items-center px-4 gap-2 bg-zinc-50/50 dark:bg-zinc-950/50">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <div className="aspect-[16/9] w-full bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply dark:mix-blend-screen opacity-90 dark:opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-y border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-8 uppercase tracking-widest">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white">
                <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
                  {i}
                </div>
                Company {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-semibold tracking-wide uppercase mb-3">
              Powerful Features
            </h2>
            <p className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Everything you need to succeed
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We've built a comprehensive suite of tools designed to help you build, scale, and manage your product with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30 flex items-center justify-center mb-6 text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Optimized performance meaning your application loads instantly across all devices and network conditions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary-100)] dark:bg-[var(--color-secondary-900)]/30 flex items-center justify-center mb-6 text-[var(--color-secondary-600)] dark:text-[var(--color-secondary-400)] group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Secure by Default</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Enterprise-grade security built directly into the core, protecting your user's data with zero configuration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Beautiful UI</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Carefully crafted components that look stunning out of the box and adapt seamlessly to your brand.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Extensible API</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Connect deeply with existing tools via our powerful GraphQL API and robust webhook system.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Team Collaboration</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Built-in role management and multiplayer capabilities make it easy for teams to work together.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-[var(--color-primary-300)] dark:hover:border-[var(--color-primary-700)] transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Automated Backups</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                Never lose a byte of data. Automated daily backups and point-in-time recovery come standard.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stats/Testimonial Section */}
      <section id="testimonials" className="py-24 bg-zinc-900 dark:bg-black text-white relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-[var(--color-primary-500)]/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
                Loved by builders everywhere.
              </h2>
              <div className="relative">
                <svg className="absolute -top-6 -left-8 w-16 h-16 text-[var(--color-primary-500)]/30" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 relative z-10">
                  "Switching to SaaSFlow was the best decision we made this year. It allowed our team to ship features 40% faster and cut our infrastructure costs in half."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop')] bg-cover border-2 border-zinc-800" />
                  <div>
                    <h4 className="font-bold">Sarah Jenkins</h4>
                    <p className="text-zinc-400 text-sm">CTO at TechNova</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50">
                <div className="text-5xl font-extrabold text-[var(--color-primary-400)] mb-2">99.9%</div>
                <p className="text-zinc-400 font-medium">Uptime Guarantee</p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50 translate-y-6">
                <div className="text-5xl font-extrabold text-[var(--color-primary-400)] mb-2">10M+</div>
                <p className="text-zinc-400 font-medium">Requests per day</p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50">
                <div className="text-5xl font-extrabold text-[var(--color-secondary-400)] mb-2">5,000+</div>
                <p className="text-zinc-400 font-medium">Active Teams</p>
              </div>
              <div className="bg-zinc-800/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-700/50 translate-y-6">
                <div className="text-5xl font-extrabold text-[var(--color-secondary-400)] mb-2">24/7</div>
                <p className="text-zinc-400 font-medium">Expert Support</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
              Choose the plan that best fits your needs. All plans include a 14-day free trial.
            </p>
            
            {/* Toggle */}
            <div className="inline-flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
              <button className="px-6 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium text-sm shadow-sm transition-all focus:outline-none">Monthly</button>
              <button className="px-6 py-2 rounded-full text-zinc-500 dark:text-zinc-400 font-medium text-sm hover:text-zinc-900 dark:hover:text-white transition-all focus:outline-none">Annually <span className="ml-1 text-xs text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] font-bold">-20%</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Starter</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Perfect for side projects and small teams.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$19</span>
                <span className="text-zinc-500 dark:text-zinc-400">/mo</span>
              </div>
              <Link href="/signup" className="w-full py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium text-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors mb-8">
                Start Free Trial
              </Link>
              <div className="flex-1">
                <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Up to 5 users
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Basic analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Community support
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-3xl p-8 border-2 border-[var(--color-primary-500)] bg-white dark:bg-zinc-900 relative shadow-xl shadow-[var(--color-primary-500)]/10 flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary-500)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-2">Professional</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">For growing companies and established teams.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$49</span>
                <span className="text-zinc-500 dark:text-zinc-400">/mo</span>
              </div>
              <Link href="/signup" className="w-full py-3 rounded-lg bg-[var(--color-primary-600)] dark:bg-[var(--color-primary-500)] text-white font-bold text-center hover:opacity-90 transition-opacity mb-8 shadow-md">
                Get Started
              </Link>
              <div className="flex-1">
                <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--color-primary-500)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited users
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--color-primary-500)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--color-primary-500)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Priority email support
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[var(--color-primary-500)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Custom integrations
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex flex-col">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Custom solutions for large organizations.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">$99</span>
                <span className="text-zinc-500 dark:text-zinc-400">/mo</span>
              </div>
              <Link href="/contact" className="w-full py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium text-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors mb-8">
                Contact Sales
              </Link>
              <div className="flex-1">
                <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Dedicated account manager
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    SLA guarantees
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-900 dark:text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    SSO & Advanced Security
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-primary-50)] dark:to-[var(--color-primary-900)]/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
            Ready to supercharge your workflow?
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10">
            Join thousands of teams who are already building faster and better.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-lg shadow-zinc-900/20 dark:shadow-white/20">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
