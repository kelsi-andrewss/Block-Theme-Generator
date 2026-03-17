import Link from "next/link";

export const metadata = {
  title: "Contact | Portfolio Template",
  description: "Get in touch for new opportunities or just to say hi.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-12">
        <Link href="/templates/portfolio" className="text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:text-white flex items-center gap-2 mb-8 w-fit transition-colors">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-secondary-500)]">Connect</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-gray-400 font-light max-w-2xl">
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact Form */}
        <div className="bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-zinc-50 dark:bg-zinc-900 dark:bg-white/80 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-zinc-50 dark:bg-zinc-900 dark:bg-white/80 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full bg-zinc-50 dark:bg-zinc-900 dark:bg-white/80 dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
                placeholder="How can I help you?"
              />
            </div>
            <button 
              type="button" 
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] flex justify-center items-center gap-2"
            >
              Send Message
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Alternative Contact & Socials */}
        <div className="flex flex-col justify-center space-y-12">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-[var(--color-primary-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Direct Email
            </h3>
            <a href="mailto:hello@example.com" className="text-2xl font-light text-zinc-700 dark:text-gray-300 hover:text-zinc-900 dark:text-white transition-colors border-b border-zinc-300 dark:border-white/20 hover:border-white pb-1 w-fit">
              hello@example.com
            </a>
          </div>

          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-[var(--color-secondary-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Social Profiles
            </h3>
            <div className="flex flex-col gap-4">
              <a href="#" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 hover:border-zinc-400 dark:border-white/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10 transition-all">
                <span className="font-medium text-zinc-900 dark:text-white">GitHub</span>
                <svg className="w-5 h-5 text-zinc-500 dark:text-gray-500 group-hover:text-zinc-900 dark:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 hover:border-zinc-400 dark:border-white/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10 transition-all">
                <span className="font-medium text-zinc-900 dark:text-white">LinkedIn</span>
                <svg className="w-5 h-5 text-zinc-500 dark:text-gray-500 group-hover:text-zinc-900 dark:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="#" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 hover:border-zinc-400 dark:border-white/30 hover:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10 transition-all">
                <span className="font-medium text-zinc-900 dark:text-white">Twitter / X</span>
                <svg className="w-5 h-5 text-zinc-500 dark:text-gray-500 group-hover:text-zinc-900 dark:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
