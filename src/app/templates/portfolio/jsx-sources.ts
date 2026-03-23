function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

export const PORTFOLIO_HEADER_JSX_SOURCE = `
<header style={{position:"sticky",top:0,zIndex:50,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",padding:"1.25rem 0",width:"100%"}}>
  <div style={{maxWidth:"80rem",margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <a href="/" style={{display:"flex",alignItems:"center",gap:"0.5rem",textDecoration:"none"}}>
      <span style={{width:"2.5rem",height:"2.5rem",borderRadius:"0.75rem",backgroundColor:"var(--wp--preset--color--primary)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)",fontWeight:"800",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>J.D</span>
      <span style={{color:"var(--wp--preset--color--contrast)",fontWeight:"800",fontSize:"1.5rem",letterSpacing:"-0.05em",textTransform:"uppercase"}}>J.Doe</span>
    </a>
    <nav style={{display:"flex",gap:"2.5rem",alignItems:"center"}}>
      <a href="#work" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"600",fontSize:"0.875rem",letterSpacing:"0.05em",textTransform:"uppercase",transition:"color 0.2s"}}>Selected Work</a>
      <a href="#about" style={{textDecoration:"none",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"600",fontSize:"0.875rem",letterSpacing:"0.05em",textTransform:"uppercase",transition:"color 0.2s"}}>About</a>
      <a href="#contact" style={{textDecoration:"none",color:"var(--wp--preset--color--base)",backgroundColor:"var(--wp--preset--color--contrast)",padding:"0.75rem 1.75rem",borderRadius:"999px",fontWeight:"700",fontSize:"0.875rem",boxShadow:"0 4px 12px -2px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>Let's Talk</a>
    </nav>
  </div>
</header>
`;

export const PORTFOLIO_FOOTER_JSX_SOURCE = `
<footer style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",color:"var(--wp--preset--color--contrast)",padding:"8rem 0 4rem",marginTop:"8rem",borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"80rem",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"4rem",marginBottom:"4rem",flexWrap:"wrap",gap:"4rem"}}>
      <div>
        <h2 style={{fontSize:"clamp(2.5rem, 5vw, 4rem)",fontWeight:"800",color:"var(--wp--preset--color--contrast)",lineHeight:"1.1",letterSpacing:"-0.03em",marginBottom:"2rem",maxWidth:"30rem"}}>Have an idea?<br/><span style={{background:"linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Let's build it.</span></h2>
        <a href="mailto:hello@jdoe.com" style={{fontSize:"1.5rem",fontWeight:"600",color:"var(--wp--preset--color--contrast)",textDecoration:"underline",textUnderlineOffset:"8px"}}>hello@jdoe.com</a>
      </div>
      <div style={{display:"flex",gap:"2rem",alignItems:"center"}}>
        <a href="#" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontSize:"1rem",fontWeight:"500",padding:"0.75rem 1.5rem",borderRadius:"999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)"}}>Twitter / X</a>
        <a href="#" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontSize:"1rem",fontWeight:"500",padding:"0.75rem 1.5rem",borderRadius:"999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)"}}>LinkedIn</a>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 40%, transparent)",fontWeight:"500"}}>
      <span>© 2026 J.Doe Portfolio</span>
      <span>Designed with passion.</span>
    </div>
  </div>
</footer>
`;

export const PORTFOLIO_JSX_SOURCE = `
<main>
  {/* Hero Section */}
  <section style={{padding:"12rem 2rem 8rem",maxWidth:"80rem",margin:"0 auto",position:"relative"}}>
    <div style={{position:"absolute",top:"20%",left:"0%",width:"500px",height:"500px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
    <div style={{maxWidth:"60rem",position:"relative",zIndex:"10"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 1rem",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",backdropFilter:"blur(12px)",marginBottom:"2rem"}}>
        <span style={{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"var(--wp--preset--color--primary)"}}></span>
        <span style={{fontSize:"0.875rem",fontWeight:"600",color:"var(--wp--preset--color--contrast)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Digital Product Designer</span>
      </div>
      <h1 style={{fontSize:"clamp(3.5rem, 8vw, 7rem)",fontWeight:"800",lineHeight:"1.05",letterSpacing:"-0.04em",color:"var(--wp--preset--color--contrast)",marginBottom:"2.5rem"}}>
        Crafting digital experiences that merge <span style={{color:"var(--wp--preset--color--primary)",fontStyle:"italic"}}>art</span> & <span style={{background:"linear-gradient(135deg, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>logic</span>.
      </h1>
      <p style={{fontSize:"1.5rem",lineHeight:"1.6",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",maxWidth:"40rem",fontWeight:"400"}}>
        I partner with ambitious brands to build intuitive, conversion-focused websites and applications. Based in San Francisco.
      </p>
    </div>
  </section>

  {/* Selected Works Grid */}
  <section id="work" style={{padding:"4rem 2rem",maxWidth:"80rem",margin:"0 auto",position:"relative",zIndex:"10"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"4rem",flexWrap:"wrap",gap:"2rem"}}>
      <h2 style={{fontSize:"3.5rem",fontWeight:"800",letterSpacing:"-0.04em",color:"var(--wp--preset--color--contrast)"}}>Selected works</h2>
      <a href="/archive" style={{fontSize:"1rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",textDecoration:"none",borderBottom:"2px solid var(--wp--preset--color--primary)",paddingBottom:"4px",display:"inline-flex",alignItems:"center",gap:"0.5rem"}}>
        View Archive 
        <svg style={{width:"16px",height:"16px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:"3rem"}}>
      {/* Project 1 */}
      <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",cursor:"pointer"}}>
        <div style={{position:"relative",aspectRatio:"4/3",borderRadius:"2rem",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.15)"}}>
          <img src="/images/templates/blog_architecture.png" alt="Project 1" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} />
          <div style={{position:"absolute",inset:"0",background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 40%, transparent), transparent)",opacity:"0"}}></div>
        </div>
        <div>
          <h3 style={{fontSize:"1.75rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Acme FinTech Redesign</h3>
          <p style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",fontSize:"1rem"}}>UX / UI Design • 2025</p>
        </div>
      </div>
      
      {/* Project 2 */}
      <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",cursor:"pointer",marginTop:"4rem"}}>
        <div style={{position:"relative",aspectRatio:"3/4",borderRadius:"2rem",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.15)"}}>
          <img src="/images/templates/portfolio_layout.png" alt="Project 2" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} />
        </div>
        <div>
          <h3 style={{fontSize:"1.75rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Aura E-Commerce</h3>
          <p style={{color:"var(--wp--preset--color--secondary)",fontWeight:"600",fontSize:"1rem"}}>Web Design & Development • 2025</p>
        </div>
      </div>

       {/* Project 3 */}
       <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",cursor:"pointer"}}>
        <div style={{position:"relative",aspectRatio:"3/4",borderRadius:"2rem",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.15)"}}>
          <img src="/images/templates/portfolio_digital.png" alt="Project 3" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} />
        </div>
        <div>
          <h3 style={{fontSize:"1.75rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Lumina Smart Home App</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--primary) 80%, var(--wp--preset--color--secondary) 20%)",fontWeight:"600",fontSize:"1rem"}}>Product Design • 2024</p>
        </div>
      </div>

      {/* Project 4 */}
      <div style={{display:"flex",flexDirection:"column",gap:"1.5rem",cursor:"pointer",marginTop:"-4rem"}}>
        <div style={{position:"relative",aspectRatio:"4/3",borderRadius:"2rem",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.15)"}}>
          <img src="/images/templates/portfolio_graphic.png" alt="Project 4" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} />
        </div>
        <div>
          <h3 style={{fontSize:"1.75rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Echo Sound Brand Identity</h3>
          <p style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",fontSize:"1rem"}}>Branding • 2024</p>
        </div>
      </div>
    </div>
  </section>

  {/* Capabilities */}
  <section style={{padding:"8rem 2rem",marginTop:"8rem",position:"relative"}}>
    <div style={{position:"absolute",top:"0",bottom:"0",left:"0",right:"0",background:"linear-gradient(135deg, color-mix(in srgb, var(--wp--preset--color--primary) 5%, transparent), color-mix(in srgb, var(--wp--preset--color--secondary) 5%, transparent))",zIndex:"0"}}></div>
    <div style={{maxWidth:"80rem",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"4rem",position:"relative",zIndex:"10"}}>
      <h2 style={{fontSize:"3.5rem",fontWeight:"800",letterSpacing:"-0.04em",color:"var(--wp--preset--color--contrast)"}}>Capabilities.<br/><span style={{color:"var(--wp--preset--color--primary)"}}>Everything you need.</span></h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"3rem",gridColumn:"auto / span 2"}}>
        <div style={{padding:"2.5rem",borderRadius:"1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",backdropFilter:"blur(12px)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 30px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
          <h4 style={{fontSize:"1.5rem",fontWeight:"800",marginBottom:"1.5rem",color:"var(--wp--preset--color--contrast)"}}>Strategy</h4>
          <ul style={{listStyle:"none",padding:0,margin:0,color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"2.5",fontWeight:"500"}}>
            <li>Brand Strategy</li>
            <li>Digital Architecture</li>
            <li>UX Research</li>
            <li>Content Modeling</li>
          </ul>
        </div>
        <div style={{padding:"2.5rem",borderRadius:"1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",backdropFilter:"blur(12px)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 30px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
          <h4 style={{fontSize:"1.5rem",fontWeight:"800",marginBottom:"1.5rem",color:"var(--wp--preset--color--contrast)"}}>Design</h4>
          <ul style={{listStyle:"none",padding:0,margin:0,color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"2.5",fontWeight:"500"}}>
            <li>UI/UX Design</li>
            <li>Interaction Design</li>
            <li>Design Systems</li>
            <li>Prototyping</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</main>
`;

export const PORTFOLIO_ABOUT_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"80rem",margin:"0 auto",minHeight:"80vh",position:"relative"}}>
  <div style={{position:"absolute",top:"10%",right:"10%",width:"400px",height:"400px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(100px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <h1 style={{fontSize:"clamp(3.5rem, 6vw, 6rem)",fontWeight:"800",letterSpacing:"-0.05em",marginBottom:"4rem",position:"relative",zIndex:"10"}}>About <span style={{color:"var(--wp--preset--color--primary)",fontStyle:"italic"}}>me</span></h1>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:"5rem",position:"relative",zIndex:"10"}}>
    <div style={{borderRadius:"2.5rem",overflow:"hidden",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.15)",padding:"1rem"}}>
       <img src="/images/templates/local_hero.png" alt="Portrait" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"1.5rem"}} />
    </div>
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <h2 style={{fontSize:"2rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem"}}>Hi, I'm J.Doe.</h2>
      <p style={{fontSize:"1.5rem",lineHeight:"1.6",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"2rem",fontWeight:"400"}}>
        I hold a degree in Human-Computer Interaction and have spent the last 8 years crafting digital products that are both beautiful and wildly effective.
      </p>
      <p style={{fontSize:"1.125rem",lineHeight:"1.8",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"3rem",fontWeight:"400"}}>
        My approach blends systematic thinking with artistic exploration. I believe the best products don't just solve problems—they create emotional connections with their users. When I'm not pushing pixels, you can find me hiking the coast or brewing the perfect cup of <span style={{color:"var(--wp--preset--color--contrast)",fontWeight:"600"}}>pour-over coffee</span>.
      </p>
      <a href="#contact" style={{display:"inline-flex",alignItems:"center",gap:"1rem",padding:"1.25rem 2.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",textDecoration:"none",borderRadius:"999px",fontWeight:"700",alignSelf:"flex-start",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>
        Download Resume
        <svg style={{width:"20px",height:"20px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
      </a>
    </div>
  </div>
</main>
`;

export const PORTFOLIO_ARCHIVE_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"80rem",margin:"0 auto",minHeight:"80vh"}}>
  <h1 style={{fontSize:"clamp(3.5rem, 6vw, 5rem)",fontWeight:"800",letterSpacing:"-0.05em",marginBottom:"1rem"}}>The Archive.</h1>
  <p style={{fontSize:"1.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"4rem",maxWidth:"40rem"}}>A complete list of independent experiments, case studies, and client works.</p>
  
  <div style={{width:"100%"}}>
    {[2025, 2024, 2023].map((year, yIdx) => (
      <div key={year} style={{marginBottom:"5rem"}}>
        <h2 style={{fontSize:"2.5rem",fontWeight:"800",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"1rem",marginBottom:"2.5rem"}}>{year}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
           {[1, 2, 3].map(item => (
             <a href="#" key={item} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",alignItems:"center",padding:"1.5rem 2rem",borderRadius:"1rem",textDecoration:"none",color:"var(--wp--preset--color--contrast)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"all 0.2s"}}>
               <span style={{fontWeight:"700",fontSize:"1.25rem",gridColumn:"auto / span 2"}}>Project Alpha {yIdx}{item}</span>
               <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500"}}>Client / Personal</span>
               <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textAlign:"right",fontWeight:"500"}}>Web Design</span>
             </a>
           ))}
        </div>
      </div>
    ))}
  </div>
</main>
`;

export const PORTFOLIO_404_JSX_SOURCE = `
<main style={{height:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"clamp(8rem, 20vw, 12rem)",fontWeight:"900",lineHeight:"1",color:"var(--wp--preset--color--primary)",letterSpacing:"-0.05em",marginBottom:"1rem",textShadow:"0 20px 40px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>404</h1>
    <h2 style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",letterSpacing:"-0.02em"}}>Page not found</h2>
    <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"3rem",fontSize:"1.25rem"}}>The project or page you are looking for has been moved or doesn't exist.</p>
    <a href="/" style={{backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",padding:"1.25rem 2.5rem",borderRadius:"999px",textDecoration:"none",fontWeight:"700",boxShadow:"0 10px 20px -5px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>Return Home</a>
  </div>
</main>
`;
