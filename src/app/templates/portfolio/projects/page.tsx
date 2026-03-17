import Link from "next/link";

export const metadata = {
  title: "Projects | Portfolio Template",
  description: "A showcase of my recent work and open source projects.",
};

const projects = [
  {
    title: "E-Commerce Platform Redesign",
    description: "A complete overhaul of a legacy e-commerce system resulting in a 40% increase in conversion rate and a significant improvement in load times.",
    tags: ["Next.js", "Tailwind CSS", "Stripe API"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    link: "#",
    year: "2023"
  },
  {
    title: "AI Writing Assistant",
    description: "Built a web application that leverages large language models to assist users with drafting emails, articles, and creative writing.",
    tags: ["React", "Node.js", "OpenAI API"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    link: "#",
    year: "2023"
  },
  {
    title: "Financial Dashboard",
    description: "An interactive dashboard for a fintech startup visualizing complex financial data in real-time with customizable widgets.",
    tags: ["Vue.js", "D3.js", "WebSockets"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    link: "#",
    year: "2022"
  },
  {
    title: "Fitness Tracking App",
    description: "Mobile application for tracking daily workouts, nutrition, and integrating with wearable devices.",
    tags: ["React Native", "GraphQL", "AWS"],
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop",
    link: "#",
    year: "2021"
  },
  {
    title: "Developer Tools CLI",
    description: "An open-source command line tool to automate common development workflows and scaffolding.",
    tags: ["TypeScript", "Node.js", "Commander"],
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop",
    link: "#",
    year: "2021"
  },
  {
    title: "Real Estate Portal",
    description: "A high-performance property listing platform with advanced map integration and virtual tours.",
    tags: ["Next.js", "Mapbox", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
    link: "#",
    year: "2020"
  }
];

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-16">
        <Link href="/templates/portfolio" className="text-sm text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:text-white flex items-center gap-2 mb-8 w-fit transition-colors">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          All <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-secondary-500)]">Projects</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-gray-400 font-light max-w-2xl">
          A selection of projects I've worked on over the years, spanning web applications, mobile apps, and open source.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
        {projects.map((project, index) => (
          <div key={index} className="group flex flex-col">
            <Link href={project.link} className="block relative rounded-2xl overflow-hidden aspect-[4/3] border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 mb-6 group-hover:border-zinc-400 dark:border-white/30 transition-all duration-300">
              <div className="absolute inset-0 bg-zinc-50 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={project.image} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>
            
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-purple-400 transition-colors">
                  <Link href={project.link}>{project.title}</Link>
                </h3>
                <span className="text-xs font-medium text-zinc-500 dark:text-gray-500 bg-zinc-100 dark:bg-zinc-900 dark:bg-white/5 px-2 py-1 rounded-md">{project.year}</span>
              </div>
              
              <p className="text-zinc-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-zinc-900 dark:text-white/80 bg-zinc-200 dark:bg-zinc-900 dark:bg-white/10 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
