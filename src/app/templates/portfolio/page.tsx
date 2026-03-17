import Link from "next/link";

export default function PortfolioHome() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 text-sm text-zinc-700 dark:text-gray-300 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          Available for new opportunities
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-white/90 dark:to-white/40 xl:leading-[1.1]">
          Crafting Digital <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-secondary-500)]">
            Experiences
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-600 dark:text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
          I am a specialized software engineer and designer focused on building scalable, performant, and beautiful web applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/templates/portfolio/projects" className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold hover:bg-gray-200 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.5)] text-center">
            View My Work
          </Link>
          <Link href="/templates/portfolio/contact" className="px-8 py-4 rounded-full border border-zinc-300 dark:border-white/20 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10 transition-all text-center">
            Get In Touch
          </Link>
        </div>
      </section>

      {/* Featured Projects Bento Grid */}
      <section className="py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Selected Work</h2>
            <p className="text-zinc-600 dark:text-gray-400">A showcase of recent projects and explorations.</p>
          </div>
          <Link href="/templates/portfolio/projects" className="hidden sm:flex text-sm text-zinc-900 dark:text-white/70 hover:text-zinc-900 dark:text-white items-center gap-2 transition-colors">
            View all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Project 1 - Spans 2 columns */}
          <div className="group relative rounded-3xl overflow-hidden border border-[var(--color-primary-900)]/30 bg-[length:200%_200%] animate-gradient bg-gradient-to-br from-[var(--color-primary-950)] via-[var(--color-primary-900)] to-black md:col-span-2 hover:border-[var(--color-primary-500)]/50 transition-all duration-500">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
              <div className="flex gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">Next.js</span>
                <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">Tailwind</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">E-Commerce Platform Redesign</h3>
              <p className="text-white/80 text-sm max-w-md line-clamp-2">A complete overhaul of a legacy e-commerce system resulting in a 40% increase in conversion rate.</p>
            </div>
          </div>

          {/* Project 2 */}
          <div className="group relative rounded-3xl overflow-hidden border border-[var(--color-primary-900)]/30 bg-[length:200%_200%] animate-gradient bg-gradient-to-br from-black via-[var(--color-primary-950)] to-[var(--color-primary-900)] hover:border-[var(--color-primary-500)]/50 transition-all duration-500">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
              <div className="flex gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/30">React Native</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fitness Tracking App</h3>
              <p className="text-white/80 text-sm line-clamp-2">Mobile application for tracking daily workouts and nutrition.</p>
            </div>
          </div>

          {/* Project 3 */}
          <div className="group relative rounded-3xl overflow-hidden border border-[var(--color-primary-900)]/30 hover:border-[var(--color-primary-500)]/50 transition-all duration-500 bg-[length:200%_200%] animate-gradient bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-primary-950)] to-black p-8 flex flex-col justify-end">
             <div className="flex justify-between items-start mb-auto">
               <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                 <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
               </div>
               <Link href="/templates/portfolio/projects" className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/20 transition-colors">
                 <svg className="w-4 h-4 text-white -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                 </svg>
               </Link>
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Open Source Library</h3>
               <p className="text-white/80 text-sm">A lightweight state management library for React applications used by over 10k developers.</p>
             </div>
          </div>

          {/* About snippet */}
          <div className="md:col-span-2 group relative rounded-3xl overflow-hidden border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)] hover:border-[var(--color-primary-400)] dark:hover:border-[var(--color-primary-600)] transition-all duration-500 p-8 md:p-10 flex flex-col justify-center">
             <div className="absolute right-0 top-0 w-64 h-64 bg-[var(--color-primary-400)]/10 dark:bg-[var(--color-primary-500)]/20 blur-[80px] rounded-full" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-secondary-400)]/10 dark:bg-[var(--color-secondary-500)]/20 blur-[60px] rounded-full" />
             <div className="relative z-10 w-full max-w-xl">
               <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-primary-900)] dark:text-[var(--color-primary-100)] mb-4">A bit about me</h3>
               <p className="text-[var(--color-primary-800)] dark:text-[var(--color-primary-200)]/80 text-base md:text-lg mb-6 leading-relaxed">
                 I've spent the last 5 years building products that people love. From early stage startups to enterprise organizations, I focus on the intersection of design and engineering.
               </p>
               <Link href="/templates/portfolio/about" className="text-[var(--color-secondary-600)] dark:text-[var(--color-secondary-400)] font-semibold flex items-center gap-2 group-hover:gap-3 transition-all w-fit">
                 Read full bio <span>&rarr;</span>
               </Link>
             </div>
          </div>
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/templates/portfolio/projects" className="inline-flex text-sm text-zinc-900 dark:text-white/70 hover:text-zinc-900 dark:text-white items-center gap-2 transition-colors">
            View all projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
