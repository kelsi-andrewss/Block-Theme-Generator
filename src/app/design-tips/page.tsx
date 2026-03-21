import Link from "next/link";

export default function DesignTipsPage() {
  const navItems = [
    { 
      id: "precision", 
      label: "Precision", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: "dictionary", 
      label: "Dictionary", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: "fixes", 
      label: "Quick Fixes", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 114 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      )
    },
    { 
      id: "click-trick", 
      label: "Click Trick", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    { 
      id: "global", 
      label: "Global Styles", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h.272M20.357 15H19a2 2 0 00-2 2v1a2 2 0 002 2h2.357M11 4.535V6a2 2 0 01-2 2H8" />
        </svg>
      )
    },
    { 
      id: "mobile", 
      label: "Mobile First", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: "tone", 
      label: "Content Tone", 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30">
      <nav className="shrink-0 w-full z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-all shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            ForgeTheme
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/app" className="text-sm font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm">
            Back to Generator
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 flex gap-12 relative">
        {/* Sticky Sidebar Nav */}
        <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-73px)] sticky top-[73px] py-16">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4 px-4 font-sans">Navigation</p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-zinc-400 transition-all group"
              >
                <span className="group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-blue-500">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-auto pt-8 px-4">
             <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 text-sans">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Quick Tip</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Select a block in the app to iterate on just that piece.</p>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-16 min-w-0">
          <header className="mb-20">
            <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
              The Iteration Playbook
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed italic max-w-2xl">
              Learn the "Pro Phrasing" that unlocks high-end layouts, precise control, and pixel-perfect iterations.
            </p>
          </header>

          <div className="space-y-32">
            {/* Tip 1: Precision Pitfall */}
            <section id="precision" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20 text-xl">1</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The "Precision" Pitfall</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                When you ask for a change, the AI needs to know <b>exactly</b> which part you're talking about. Vague prompts lead to random results.
              </p>
              
              <div className="grid md:grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl font-sans">
                {/* Row 1 */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-8">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-sans">
                    <svg className="w-3 h-3 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    Vague (The AI Guesses)
                  </p>
                  <p className="text-xl text-zinc-500 line-through font-medium">"Make it pink."</p>
                  <p className="mt-2 text-xs text-zinc-400 italic font-sans">Does it mean the text? The background? The border?</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 border-l border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2 font-sans">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Precise (Exact Result)
                  </p>
                  <p className="text-xl text-zinc-900 dark:text-white font-bold">"Make the <span className="text-blue-600 dark:text-blue-400">background</span> pink."</p>
                  <p className="mt-2 text-xs text-zinc-500 italic font-sans">Tells the AI exactly where to pour the paint.</p>
                </div>

                {/* Row 2 */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xl text-zinc-500 line-through font-medium">"Add a shadow."</p>
                  <p className="mt-2 text-xs text-zinc-400 italic">Shadow on what? The headline? The whole page?</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 border-t border-l border-zinc-200 dark:border-zinc-800">
                  <p className="text-xl text-zinc-900 dark:text-white font-bold">"Add a shadow to <span className="text-blue-600 dark:text-blue-400">every card</span>."</p>
                  <p className="mt-2 text-xs text-zinc-500 italic">Tells the AI exactly which objects to lift up.</p>
                </div>

                {/* Row 3 */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-8 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xl text-zinc-500 line-through font-medium">"Change the font."</p>
                  <p className="mt-2 text-xs text-zinc-400 italic">Should everything change? Just the big titles?</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 border-t border-l border-zinc-200 dark:border-zinc-800">
                  <p className="text-xl text-zinc-900 dark:text-white font-bold">"Use a bold serif font for <span className="text-blue-600 dark:text-blue-400">headings</span>."</p>
                  <p className="mt-2 text-xs text-zinc-500 italic">Keeps the small text readable while fixing the look.</p>
                </div>
              </div>
            </section>

            {/* Tip 2: The UI Dictionary */}
            <section id="dictionary" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 text-xl">2</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The Visual Dictionary</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed font-sans">
                Using the correct names for website parts is the "secret code" for getting high-quality designs.
              </p>
              
              <div className="grid md:grid-cols-2 gap-10">
                {/* Hero */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex flex-col justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative group font-sans">
                    <div className="w-3/4 h-4 bg-zinc-300 dark:bg-zinc-600 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-zinc-300 dark:bg-zinc-600 rounded mb-6 opacity-50"></div>
                    <div className="w-24 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Hero</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Hero Section</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">The "big splash" area at the top of the page.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a large hero section with a photo background."</code>
                </div>

                {/* Cards */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex gap-3 justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-20 h-28 bg-white dark:bg-zinc-900 rounded-xl shadow-md p-2 flex flex-col gap-1 border border-zinc-100 dark:border-zinc-800">
                          <div className="w-full h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-1"></div>
                          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                          <div className="w-2/3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                      </div>
                    ))}
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Cards</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Cards</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Boxed groups of info (features, testimonials).</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Put these 3 features into white cards with shadows."</code>
                </div>

                {/* Chips */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex gap-2 justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    <div className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider font-sans">New</div>
                    <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider font-sans">Live</div>
                    <div className="px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-wider font-sans">Sale</div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Chips</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Chips / Badges</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Small colorful labels used to highlight items.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a green chip that says 'Ready' above the title."</code>
                </div>

                {/* Modal */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                    <div className="w-36 h-24 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-10 border border-zinc-200 dark:border-zinc-700 flex flex-col p-4 gap-3">
                        <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                        <div className="w-full h-8 bg-blue-600 rounded-xl"></div>
                    </div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-white/50 uppercase tracking-widest z-20 font-sans">Example: Modal</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Modal / Pop-up</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">A window that floats over the rest of the site.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Make this button open a modal window."</code>
                </div>

                {/* Pricing */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex gap-3 justify-center items-end border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    <div className="w-24 h-32 bg-white dark:bg-zinc-900 rounded-xl shadow-md p-3 flex flex-col gap-2 border border-zinc-100 dark:border-zinc-800 font-sans">
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                        <div className="w-1/2 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg mx-auto font-sans"></div>
                        <div className="flex-1"></div>
                        <div className="w-full h-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-sans"></div>
                    </div>
                    <div className="w-24 h-36 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-3 flex flex-col gap-2 border-2 border-blue-500 z-10 scale-110 font-sans">
                        <div className="w-full h-2 bg-blue-50 dark:bg-blue-900/30 rounded-full"></div>
                        <div className="w-1/2 h-4 bg-blue-100 dark:bg-blue-800 rounded-lg mx-auto font-sans"></div>
                        <div className="flex-1"></div>
                        <div className="w-full h-6 bg-blue-600 rounded-lg font-sans"></div>
                    </div>
                    <div className="w-24 h-32 bg-white dark:bg-zinc-900 rounded-xl shadow-md p-3 flex flex-col gap-2 border border-zinc-100 dark:border-zinc-800 font-sans">
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                        <div className="w-1/2 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-lg mx-auto font-sans"></div>
                        <div className="flex-1"></div>
                        <div className="w-full h-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-sans"></div>
                    </div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Pricing</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Pricing Table</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Comparison boxes for different plans or tiers.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a 3-column pricing table with a 'Most Popular' tag."</code>
                </div>

                {/* Accordion */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex flex-col gap-2 justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-48 ${i === 2 ? 'h-16' : 'h-8'} bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 flex flex-col p-2 px-3 justify-center gap-1 shadow-sm font-sans`}>
                          <div className="flex justify-between items-center">
                            <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-sans"></div>
                            <div className={`w-2 h-2 border-r-2 border-b-2 border-zinc-400 ${i === 2 ? 'rotate-[225deg] mt-1' : 'rotate-45 mb-1'} transition-transform font-sans`}></div>
                          </div>
                          {i === 2 && <div className="w-full h-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-full mt-1 font-sans"></div>}
                          {i === 2 && <div className="w-2/3 h-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-full font-sans"></div>}
                      </div>
                    ))}
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Accordion</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Accordion</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Expandable list items, perfect for FAQ sections.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Make these FAQ questions into an accordion."</code>
                </div>

                {/* Form */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    <div className="w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-4 flex flex-col gap-3 border border-zinc-100 dark:border-zinc-800 font-sans">
                        <div className="space-y-1 font-sans">
                          <div className="w-8 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-sans"></div>
                          <div className="w-full h-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-700 font-sans"></div>
                        </div>
                        <div className="space-y-1 font-sans">
                          <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-sans"></div>
                          <div className="w-full h-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-700 font-sans"></div>
                        </div>
                        <div className="w-full h-8 bg-blue-600 rounded-xl font-sans"></div>
                    </div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Form</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Contact Form</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Input fields for names, emails, and messages.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a contact form with fields for Name and Message."</code>
                </div>

                {/* Testimonials */}
                <div className="flex flex-col">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative font-sans">
                    <div className="w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-4 flex flex-col gap-3 border border-zinc-100 dark:border-zinc-800 relative font-sans">
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-serif">"</div>
                        <div className="space-y-2 py-2 font-sans">
                          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full font-sans"></div>
                          <div className="w-5/6 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full font-sans"></div>
                          <div className="w-4/6 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full font-sans"></div>
                        </div>
                        <div className="flex items-center gap-2 font-sans">
                          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 font-sans"></div>
                          <div className="space-y-1 font-sans">
                              <div className="w-16 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full font-sans"></div>
                              <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full font-sans"></div>
                          </div>
                        </div>
                    </div>
                    <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest font-sans">Example: Testimonial</div>
                  </div>
                  <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Testimonials</h3>
                  <p className="text-sm text-zinc-500 mb-4 font-sans">Quotes from happy customers or users.</p>
                  <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a testimonial section with customer photos."</code>
                </div>
              </div>
            </section>

            {/* Tip 3: Design Fixes */}
            <section id="fixes" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 text-xl">3</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Pro "Design Fix" Cheat Sheet</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                If your site looks "unprofessional" but you don't know why, try these designer fixes.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { trap: "Cluttered / Crowded", fix: "Add a lot of 'whitespace' (empty space) between every section." },
                  { trap: "Hard to Read", fix: "Increase the contrast between the text and the background." },
                  { trap: "Too Many Colors", fix: "Use a monochromatic palette with only ONE primary color." },
                  { trap: "Looks Cheap", fix: "Use a 'serif' font for headings and 'sans-serif' for the body text." },
                  { trap: "Confusing Layout", fix: "Align everything to a center column with clear vertical borders." },
                  { trap: "Boring Buttons", fix: "Add a subtle drop shadow and rounded corners to all buttons." },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:ring-2 ring-amber-500/20 transition-all font-sans">
                    <p className="text-[10px] font-black uppercase text-zinc-400 mb-2 font-sans">If it feels...</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white mb-4 italic">"{item.trap}"</p>
                    <p className="text-[10px] font-black uppercase text-amber-600 mb-2 font-sans">Ask the AI to...</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium font-sans">"{item.fix}"</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tip 4: The Click Rule */}
            <section id="click-trick" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 text-xl">4</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The "Click-to-Edit" Trick</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                Before you type a message, <b>click the part you want to change</b> in the preview window. 
              </p>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-700 flex items-center gap-8 font-sans">
                <div className="w-20 h-20 shrink-0 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 font-sans">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                </div>
                <p className="text-xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed font-sans">
                  If you select a block first, the AI knows exactly where to look. No more "the other button" confusion!
                </p>
              </div>
            </section>

            {/* New Tip 5: Global vs Specific */}
            <section id="global" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20 text-xl">5</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Global vs. Specific Changes</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                Decide if you want to change <span className="font-bold text-zinc-900 dark:text-white underline decoration-orange-500/30 underline-offset-4 font-sans">one</span> thing or <span className="font-bold text-zinc-900 dark:text-white underline decoration-orange-500/30 underline-offset-4 font-sans">everything</span> like it. This saves you from repeating yourself.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 font-sans">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl font-sans">
                  <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
                    <svg className="w-3.5 h-3.5 font-sans" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Global (Sitewide)
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 font-sans">Changes every block of that type on the whole site.</p>
                  <code className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block font-mono border border-zinc-200 dark:border-zinc-700 font-sans font-mono">"Make <span className="text-orange-600 font-bold font-sans font-mono">all</span> buttons rounded."</code>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl font-sans">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
                    <svg className="w-3.5 h-3.5 font-sans" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Specific (Local)
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 font-sans">Changes only the one item you are looking at.</p>
                  <code className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block font-mono border border-zinc-200 dark:border-zinc-700 font-sans font-mono">"Make <span className="text-blue-600 font-bold font-sans font-mono">this</span> button red."</code>
                </div>
              </div>
            </section>

            {/* New Tip 6: Mobile First */}
            <section id="mobile" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 text-xl font-sans">6</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white font-sans">Mobile & Screen Sizes</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                Sometimes things look great on a laptop but crowded on a phone. You can tell the AI how to behave on smaller screens.
              </p>
              
              <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-700 font-sans">
                <div className="grid sm:grid-cols-2 gap-6 font-sans">
                    <div className="space-y-3 font-sans">
                      <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm font-sans">
                          <svg className="w-4 h-4 text-cyan-500 font-sans" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          Fixing Columns
                      </p>
                      <code className="text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block border border-zinc-200 dark:border-zinc-800 font-mono shadow-sm font-mono">"Make these columns stack on top of each other on mobile."</code>
                    </div>
                    <div className="space-y-3 font-sans">
                      <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm font-sans">
                          <svg className="w-4 h-4 text-cyan-500 font-sans" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>
                          Adjusting Size
                      </p>
                      <code className="text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block border border-zinc-200 dark:border-zinc-800 font-mono shadow-sm font-mono font-mono">"Make the main headline smaller on phone screens."</code>
                    </div>
                </div>
              </div>
            </section>

            {/* New Tip 7: Content & Tone */}
            <section id="tone" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/20 text-xl font-sans">7</div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white font-sans">Change the "Voice"</h2>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-sans">
                Design isn't just colors—it's the words. You can ask the AI to rewrite your text to match your brand's personality.
              </p>
              
              <div className="flex flex-col gap-4 font-sans">
                {[
                  { tone: "Professional", text: "Rewrite the welcome text to sound like a serious law firm." },
                  { tone: "Exciting", text: "Make the product descriptions sound energetic and hype." },
                  { tone: "Short", text: "Summarize this whole section into just 3 punchy bullet points." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-violet-500 transition-colors text-zinc-900 dark:text-zinc-100 font-sans">
                    <span className="w-24 text-[10px] font-black uppercase text-zinc-400 group-hover:text-violet-500 transition-colors font-sans">{item.tone}</span>
                    <code className="text-sm text-violet-600 dark:text-violet-400 font-mono font-mono">"{item.text}"</code>
                  </div>
                ))}
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden font-sans">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl font-sans"></div>
              <h2 className="text-4xl font-black mb-6 flex items-center gap-4 font-sans">
                <svg className="w-10 h-10 text-blue-200 font-sans" fill="none" viewBox="0 0 24 24" stroke="currentColor font-sans">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Still stuck?
              </h2>
              <p className="text-2xl text-blue-50 mb-10 leading-relaxed max-w-2xl font-sans">
                If the AI makes a mess, hit <span className="font-bold text-white underline decoration-white/30 underline-offset-4 font-sans">Undo</span>. It's much easier for the AI to get <span className="font-bold text-white underline decoration-white/30 underline-offset-4 font-sans">one small change</span> right than three giant ones at once.
              </p>
              <Link href="/app" className="inline-flex items-center px-12 py-6 bg-white text-blue-600 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95 font-sans">
                Back to Generator &rarr;
              </Link>
            </section>
          </div>
          
          <footer className="mt-40 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-500 text-sm font-sans">
            ForgeTheme Design Guide • Version 1.5
          </footer>
        </main>
      </div>
    </div>
  );
}
