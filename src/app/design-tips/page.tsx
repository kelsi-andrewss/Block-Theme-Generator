import Link from "next/link";

export default function DesignTipsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/30">
      <nav className="shrink-0 w-full z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:shadow-lg transition-all shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 tracking-tight">
            Design for Non-Designers
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            You don't need to be a pro. Use these "AI-Friendly" phrases to get the exact design you want.
          </p>
        </header>

        <div className="space-y-32">
          {/* Tip 1: Precision Pitfall - FIXED CORRELATION */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/20 text-xl">1</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The "Precision" Pitfall</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              When you ask for a change, the AI needs to know <b>exactly</b> which part you're talking about. Vague prompts lead to random results.
            </p>
            
            <div className="grid md:grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
              {/* Row 1 */}
              <div className="bg-zinc-50 dark:bg-zinc-950 p-8">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">❌ Vague (The AI Guesses)</p>
                <p className="text-xl text-zinc-500 line-through font-medium">"Make it pink."</p>
                <p className="mt-2 text-xs text-zinc-400 italic">Does it mean the text? The background? The border?</p>
              </div>
              <div className="bg-white dark:bg-zinc-900 p-8 border-l border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">✅ Precise (Exact Result)</p>
                <p className="text-xl text-zinc-900 dark:text-white font-bold">"Make the <span className="text-blue-600 dark:text-blue-400">background</span> pink."</p>
                <p className="mt-2 text-xs text-zinc-500 italic">Tells the AI exactly where to pour the paint.</p>
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
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 text-xl">2</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The Visual Dictionary</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
              Using the correct names for website parts is the "secret code" for getting high-quality designs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* Hero */}
              <div className="flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex flex-col justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative group">
                   <div className="w-3/4 h-4 bg-zinc-300 dark:bg-zinc-600 rounded mb-2"></div>
                   <div className="w-1/2 h-4 bg-zinc-300 dark:bg-zinc-600 rounded mb-6 opacity-50"></div>
                   <div className="w-24 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
                   <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Example: Hero</div>
                </div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Hero Section</h3>
                <p className="text-sm text-zinc-500 mb-4">The "big splash" area at the top of the page.</p>
                <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a large hero section with a photo background."</code>
              </div>

              {/* Cards */}
              <div className="flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex gap-3 justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="w-20 h-28 bg-white dark:bg-zinc-900 rounded-xl shadow-md p-2 flex flex-col gap-1 border border-zinc-100 dark:border-zinc-800">
                        <div className="w-full h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-1"></div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                        <div className="w-2/3 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                     </div>
                   ))}
                   <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Example: Cards</div>
                </div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Cards</h3>
                <p className="text-sm text-zinc-500 mb-4">Boxed groups of info (features, testimonials).</p>
                <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Put these 3 features into white cards with shadows."</code>
              </div>

              {/* Chips */}
              <div className="flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex gap-2 justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative">
                   <div className="px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-wider">New</div>
                   <div className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">Live</div>
                   <div className="px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-black uppercase tracking-wider">Sale</div>
                   <div className="absolute top-3 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Example: Chips</div>
                </div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Chips / Badges</h3>
                <p className="text-sm text-zinc-500 mb-4">Small colorful labels used to highlight items.</p>
                <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Add a green chip that says 'Ready' above the title."</code>
              </div>

              {/* Modal */}
              <div className="flex flex-col">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-3xl p-4 mb-4 h-48 flex justify-center items-center border border-zinc-200 dark:border-zinc-700 overflow-hidden relative">
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                   <div className="w-36 h-24 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl z-10 border border-zinc-200 dark:border-zinc-700 flex flex-col p-4 gap-3">
                      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                      <div className="w-full h-8 bg-blue-600 rounded-xl"></div>
                   </div>
                   <div className="absolute top-3 right-4 text-[10px] font-black text-white/50 uppercase tracking-widest z-20">Example: Modal</div>
                </div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-1">Modal / Pop-up</h3>
                <p className="text-sm text-zinc-500 mb-4">A window that floats over the rest of the site.</p>
                <code className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 block font-mono">"Make this button open a modal window."</code>
              </div>
            </div>
          </section>

          {/* Tip 3: Design Fixes */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 text-xl">3</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Pro "Design Fix" Cheat Sheet</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
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
                 <div key={i} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:ring-2 ring-amber-500/20 transition-all">
                   <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">If it feels...</p>
                   <p className="text-lg font-bold text-zinc-900 dark:text-white mb-4 italic">"{item.trap}"</p>
                   <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Ask the AI to...</p>
                   <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">"{item.fix}"</p>
                 </div>
               ))}
            </div>
          </section>

          {/* Tip 4: The Click Rule */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 text-xl">4</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">The "Click-to-Edit" Trick</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Before you type a message, <b>click the part you want to change</b> in the preview window. 
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-700 flex items-center gap-8">
              <div className="w-20 h-20 shrink-0 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                If you select a block first, the AI knows exactly where to look. No more "the other button" confusion!
              </p>
            </div>
          </section>

          {/* New Tip 5: Global vs Specific */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20 text-xl">5</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Global vs. Specific Changes</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Decide if you want to change <span className="font-bold text-zinc-900 dark:text-white underline decoration-orange-500/30 underline-offset-4">one</span> thing or <span className="font-bold text-zinc-900 dark:text-white underline decoration-orange-500/30 underline-offset-4">everything</span> like it. This saves you from repeating yourself.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl">
                <p className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-4">🏠 Global (Sitewide)</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Changes every block of that type on the whole site.</p>
                <code className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block font-mono border border-zinc-200 dark:border-zinc-700">"Make <span className="text-orange-600 font-bold">all</span> buttons rounded."</code>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl">
                <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">📍 Specific (Local)</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Changes only the one item you are looking at.</p>
                <code className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block font-mono border border-zinc-200 dark:border-zinc-700">"Make <span className="text-blue-600 font-bold">this</span> button red."</code>
              </div>
            </div>
          </section>

          {/* New Tip 6: Mobile First */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 text-xl">6</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Mobile & Screen Sizes</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Sometimes things look great on a laptop but crowded on a phone. You can tell the AI how to behave on smaller screens.
            </p>
            
            <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-700">
               <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor font-mono"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Fixing Columns
                     </p>
                     <code className="text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block border border-zinc-200 dark:border-zinc-800 font-mono shadow-sm">"Make these columns stack on top of each other on mobile."</code>
                  </div>
                  <div className="space-y-3">
                     <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor font-mono"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>
                        Adjusting Size
                     </p>
                     <code className="text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl block border border-zinc-200 dark:border-zinc-800 font-mono shadow-sm">"Make the main headline smaller on phone screens."</code>
                  </div>
               </div>
            </div>
          </section>

          {/* New Tip 7: Content & Tone */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold shadow-lg shadow-violet-500/20 text-xl">7</div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Change the "Voice"</h2>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
              Design isn't just colors—it's the words. You can ask the AI to rewrite your text to match your brand's personality.
            </p>
            
            <div className="flex flex-col gap-4">
               {[
                 { tone: "Professional", text: "Rewrite the welcome text to sound like a serious law firm." },
                 { tone: "Exciting", text: "Make the product descriptions sound energetic and hype." },
                 { tone: "Short", text: "Summarize this whole section into just 3 punchy bullet points." },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-violet-500 transition-colors">
                   <span className="w-24 text-[10px] font-black uppercase text-zinc-400 group-hover:text-violet-500 transition-colors">{item.tone}</span>
                   <code className="text-sm text-violet-600 dark:text-violet-400 font-mono">"{item.text}"</code>
                 </div>
               ))}
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl font-black mb-6 flex items-center gap-4">
              <svg className="w-10 h-10 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Still stuck?
            </h2>
            <p className="text-2xl text-blue-50 mb-10 leading-relaxed max-w-2xl">
              If the AI makes a mess, hit **Undo**. It's much easier for the AI to get **one small change** right than three giant ones at once.
            </p>
            <Link href="/app" className="inline-flex items-center px-12 py-6 bg-white text-blue-600 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95">
              Back to Generator &rarr;
            </Link>
          </section>
        </div>
        
        <footer className="mt-40 pt-10 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-500 text-sm">
          ForgeTheme Design Guide • Version 1.4
        </footer>
      </main>
    </div>
  );
}
