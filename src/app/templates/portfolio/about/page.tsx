import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About | Portfolio Template",
  description: "Learn more about my background and experience.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-12">
        <Link href="/templates/portfolio" className="text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:text-white flex items-center gap-2 mb-8 w-fit transition-colors">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-secondary-500)]">Me</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="aspect-square rounded-3xl overflow-hidden relative border border-zinc-200 dark:border-white/10 mb-6 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary-900)]/40 to-[var(--color-secondary-900)]/40 mix-blend-overlay z-10" />
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop" 
              alt="Profile portrait" 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white/90 uppercase tracking-wider mb-2">Location</h3>
              <p className="text-zinc-600 dark:text-gray-400">San Francisco, CA</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white/90 uppercase tracking-wider mb-2">Contact</h3>
              <p className="text-zinc-600 dark:text-gray-400">hello@example.com</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8 text-lg text-zinc-700 dark:text-gray-300 leading-relaxed font-light">
          <p>
            Hello! I'm a software engineer and designer with a passion for building exceptional digital experiences. 
            For the past 5 years, I've had the privilege of working alongside talented teams to create products that 
            are not only functional but also beautiful and intuitive.
          </p>
          <p>
            My journey began when I discovered the intersection of code and design. Since then, I've focused on 
            mastering frontend technologies like React and Next.js, while developing a keen eye for aesthetics 
            and user experience.
          </p>
          <p>
            I believe that great software is built with empathy for the user. Whether it's crafting a complex 
            dashboard or a sleek marketing site, my goal is always to deliver solutions that solve real problems 
            elegantly.
          </p>

          <hr className="border-zinc-200 dark:border-white/10 my-10" />

          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Experience</h3>
          
          <div className="space-y-8">
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-500 before:rounded-full before:shadow-[0_0_10px_rgba(168,85,247,0.8)] after:content-[''] after:absolute after:left-[5px] after:top-6 after:w-[2px] after:h-[calc(100%+16px)] after:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10">
              <span className="text-sm font-medium text-[var(--color-primary-400)] mb-1 block">2021 — Present</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white">Senior Frontend Engineer</h4>
              <p className="text-zinc-600 dark:text-gray-400 mb-2">TechCorp Inc.</p>
              <p className="text-base font-light text-zinc-600 dark:text-gray-400">Led the frontend architecture for the flagship enterprise product, improving performance by 40% and mentoring junior developers.</p>
            </div>
            
            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full before:shadow-[0_0_10px_rgba(59,130,246,0.8)] after:content-[''] after:absolute after:left-[5px] after:top-6 after:w-[2px] after:h-[calc(100%+16px)] after:bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10">
              <span className="text-sm font-medium text-[var(--color-secondary-400)] mb-1 block">2018 — 2021</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white">Software Engineer</h4>
              <p className="text-zinc-600 dark:text-gray-400 mb-2">Startup Labs</p>
              <p className="text-base font-light text-zinc-600 dark:text-gray-400">Developed core features for a fast-growing SaaS platform, built cross-platform mobile apps using React Native.</p>
            </div>

            <div className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-zinc-900 dark:bg-white/40 before:rounded-full">
              <span className="text-sm font-medium text-zinc-900 dark:text-white/40 mb-1 block">2016 — 2018</span>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white/80">Web Developer</h4>
              <p className="text-zinc-500 dark:text-gray-500 mb-2">Creative Agency</p>
              <p className="text-base font-light text-zinc-500 dark:text-gray-500">Built highly interactive marketing websites for premium clients using modern web technologies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
