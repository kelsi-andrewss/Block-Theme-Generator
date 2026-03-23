function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

const SEARCH_SVG = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>');

export const BLOG_HEADER_JSX_SOURCE = `
<header style={{borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",padding:"1.25rem 0",width:"100%",position:"sticky",top:0,zIndex:50}}>
  <div style={{maxWidth:"64rem",margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    {/* Left Nav */}
    <nav style={{display:"flex",gap:"2rem",alignItems:"center",flex:"1"}}>
      <a href="#essays" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"color 0.2s"}}>Essays</a>
      <a href="#interviews" style={{textDecoration:"none",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"color 0.2s"}}>Interviews</a>
    </nav>
    
    {/* Logo */}
    <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:"0.5rem",color:"var(--wp--preset--color--contrast)",fontWeight:"900",fontSize:"2.5rem",letterSpacing:"-0.03em",flex:"0 0 auto"}}>
      <span style={{width:"2rem",height:"2rem",borderRadius:"0.25rem",backgroundColor:"var(--wp--preset--color--primary)",display:"inline-block",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}></span>
      Chronicle.
    </a>

    {/* Right Nav */}
    <div style={{display:"flex",gap:"1.5rem",alignItems:"center",flex:"1",justifyContent:"flex-end"}}>
      <a href="#search" style={{display:"flex",alignItems:"center",padding:"0.5rem",borderRadius:"50%",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"all 0.2s"}}>
        {"${SEARCH_SVG}"}
      </a>
      <a href="#subscribe" style={{textDecoration:"none",color:"var(--wp--preset--color--base)",backgroundColor:"var(--wp--preset--color--primary)",fontWeight:"700",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",padding:"0.75rem 1.5rem",borderRadius:"999px",boxShadow:"0 4px 12px -2px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>Subscribe</a>
    </div>
  </div>
</header>
`;

export const BLOG_FOOTER_JSX_SOURCE = `
<footer style={{position:"relative",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 95%, var(--wp--preset--color--base))",borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",padding:"8rem 0 4rem",marginTop:"8rem"}}>
  <div style={{position:"absolute",top:"-20%",left:"10%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"64rem",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10"}}>
    
    {/* Newsletter Section */}
    <div style={{textAlign:"center",marginBottom:"6rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",padding:"4rem 2rem",borderRadius:"1.5rem",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)"}}>
      <span style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.875rem",fontWeight:"700",color:"var(--wp--preset--color--primary)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"1rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",padding:"0.5rem 1rem",borderRadius:"999px"}}>
        <span style={{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"var(--wp--preset--color--primary)"}}></span>
        Stay updated
      </span>
      <h2 style={{fontSize:"clamp(3rem, 5vw, 4.5rem)",fontWeight:"800",letterSpacing:"-0.03em",color:"var(--wp--preset--color--base)",margin:"0 0 1.5rem 0"}}>The Chronicle Newsletter</h2>
      <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",maxWidth:"36rem",margin:"0 auto 3rem",lineHeight:"1.6"}}>Get a weekly digest of our best essays, interviews, and deep dives delivered straight to your inbox.</p>
      
      <form style={{display:"flex",gap:"1rem",justifyContent:"center",maxWidth:"32rem",margin:"0 auto"}}>
         <input type="email" placeholder="Your email address" style={{flex:"1",padding:"1.25rem 1.5rem",fontSize:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 20%, transparent)",borderRadius:"999px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",color:"var(--wp--preset--color--base)",outline:"none"}} />
         <button type="submit" style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",border:"none",padding:"0 2.5rem",fontWeight:"700",fontSize:"1rem",borderRadius:"999px",cursor:"pointer",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>Subscribe</button>
      </form>
    </div>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 15%, transparent)",paddingTop:"3rem",flexWrap:"wrap",gap:"2rem"}}>
      <a href="/" style={{display:"flex",alignItems:"center",gap:"0.5rem",textDecoration:"none",color:"var(--wp--preset--color--base)",fontWeight:"900",fontSize:"1.75rem"}}>
        <span style={{width:"1.5rem",height:"1.5rem",borderRadius:"0.25rem",backgroundColor:"var(--wp--preset--color--primary)",display:"inline-block"}}></span>
        Chronicle.
      </a>
      <div style={{display:"flex",gap:"2.5rem",fontSize:"0.875rem",fontWeight:"600",color:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",textTransform:"uppercase",letterSpacing:"0.05em"}}>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Twitter</a>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Instagram</a>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>RSS</a>
      </div>
    </div>
  </div>
</footer>
`;

export const BLOG_JSX_SOURCE = `
<main style={{position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"10%",right:"-10%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(150px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"64rem",margin:"0 auto",padding:"4rem 2rem 0",position:"relative",zIndex:"10"}}>
    
    {/* Featured Post */}
    <article style={{display:"flex",flexDirection:"column",gap:"3rem",paddingBottom:"5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",marginBottom:"5rem",cursor:"pointer"}}>
      <div style={{position:"relative",aspectRatio:"2/1",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1rem",overflow:"hidden",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
        <img src="/images/templates/blog_workspace.png" alt="Featured Article" style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale(1.02)",transition:"transform 0.7s ease"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent), transparent)"}}></div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",maxWidth:"48rem",margin:"0 auto"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"1rem",marginBottom:"2rem",fontSize:"0.875rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",padding:"0.5rem 1.25rem",borderRadius:"999px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
          <span style={{color:"var(--wp--preset--color--primary)"}}>Culture</span>
          <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>•</span>
          <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent)"}}>Mar 22, 2026</span>
        </div>
        <h2 style={{fontSize:"clamp(3.5rem, 6vw, 5rem)",fontWeight:"800",letterSpacing:"-0.02em",lineHeight:"1.1",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem"}}>
          The subtle architecture of everyday spaces
        </h2>
        <p style={{fontSize:"1.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"0"}}>
          How the environments we inhabit silently dictate our habits, creativity, and perception of time in the modern era.
        </p>
      </div>
    </article>

    {/* Recent Posts Grid */}
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"3rem"}}>
        <h3 style={{fontSize:"1.125rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--wp--preset--color--contrast)"}}>Latest Articles</h3>
        <span style={{height:"1px",flex:"1",margin:"0 2rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}></span>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))",gap:"5rem 3rem"}}>
        
        {/* Post 1 */}
        <article style={{display:"flex",flexDirection:"column",gap:"1.75rem",cursor:"pointer"}}>
          <div style={{aspectRatio:"3/2",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
            <img src="/images/templates/blog_camera.png" alt="Camera" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1s ease"}} />
          </div>
          <div>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"1rem",fontSize:"0.75rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span style={{color:"var(--wp--preset--color--secondary)"}}>Photography</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>•</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>Mar 18</span>
            </div>
            <h2 style={{fontSize:"2rem",fontWeight:"800",letterSpacing:"-0.01em",lineHeight:"1.2",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>The forgotten art of film development</h2>
            <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"0"}}>A deep dive into the analog resurgence and why tactile mediums endure.</p>
          </div>
        </article>

        {/* Post 2 */}
        <article style={{display:"flex",flexDirection:"column",gap:"1.75rem",cursor:"pointer"}}>
          <div style={{aspectRatio:"3/2",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
            <img src="/images/templates/portfolio_layout.png" alt="Workspace" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1s ease"}} />
          </div>
          <div>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"1rem",fontSize:"0.75rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span style={{color:"var(--wp--preset--color--primary)"}}>Productivity</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>•</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>Mar 14</span>
            </div>
            <h2 style={{fontSize:"2rem",fontWeight:"800",letterSpacing:"-0.01em",lineHeight:"1.2",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>Designing a distraction-free home office</h2>
            <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"0"}}>Principles for curating a workspace that fosters flow states and deep work.</p>
          </div>
        </article>

        {/* Post 3 */}
        <article style={{display:"flex",flexDirection:"column",gap:"1.75rem",cursor:"pointer"}}>
          <div style={{aspectRatio:"3/2",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
            <img src="/images/templates/local_hero.png" alt="Nature" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1s ease"}} />
          </div>
          <div>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"1rem",fontSize:"0.75rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span style={{color:"var(--wp--preset--color--secondary)"}}>Travel</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>•</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>Mar 10</span>
            </div>
            <h2 style={{fontSize:"2rem",fontWeight:"800",letterSpacing:"-0.01em",lineHeight:"1.2",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>Silence in the Pacific Northwest</h2>
            <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"0"}}>Disconnecting from the grid to experience the raw acoustic ecosystem of the coast.</p>
          </div>
        </article>

        {/* Post 4 */}
        <article style={{display:"flex",flexDirection:"column",gap:"1.75rem",cursor:"pointer"}}>
          <div style={{aspectRatio:"3/2",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
            <img src="/images/templates/blog_books.png" alt="Books" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1s ease"}} />
          </div>
          <div>
            <div style={{display:"flex",gap:"0.75rem",alignItems:"center",marginBottom:"1rem",fontSize:"0.75rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em"}}>
              <span style={{color:"var(--wp--preset--color--primary)"}}>Literature</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>•</span>
              <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>Mar 05</span>
            </div>
            <h2 style={{fontSize:"2rem",fontWeight:"800",letterSpacing:"-0.01em",lineHeight:"1.2",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>The return of long-form reading</h2>
            <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"0"}}>Why physical books are claiming back our attention spans from algorithmic feeds.</p>
          </div>
        </article>

      </div>
      
      <div style={{marginTop:"5rem",textAlign:"center"}}>
        <button style={{padding:"1.25rem 3.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",color:"var(--wp--preset--color--contrast)",fontWeight:"800",fontSize:"1rem",textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer",borderRadius:"999px",transition:"all 0.2s"}}>Load Older Entries</button>
      </div>

    </div>
  </div>
</main>
`;

export const BLOG_ABOUT_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"48rem",margin:"0 auto",minHeight:"80vh",position:"relative"}}>
  <div style={{position:"absolute",top:"20%",left:"-40%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(150px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"clamp(3.5rem, 8vw, 6rem)",fontWeight:"800",letterSpacing:"-0.02em",marginBottom:"2rem",color:"var(--wp--preset--color--contrast)",textAlign:"center"}}>About Chronicle.</h1>
    <p style={{fontSize:"1.5rem",lineHeight:"1.6",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"4rem",textAlign:"center"}}>
      An independent publication exploring the intersections of culture, design, technology, and philosophy. We believe in slow media.
    </p>
    
    <div style={{aspectRatio:"16/9",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"1.5rem",overflow:"hidden",marginBottom:"4rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
       <img src="/images/templates/blog_workspace.png" alt="Office" style={{width:"100%",height:"100%",objectFit:"cover"}} />
    </div>
    
    <h2 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1.5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"1rem"}}>Our Ethos</h2>
    <p style={{fontSize:"1.25rem",lineHeight:"1.8",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"2rem"}}>
      In an age of infinite scrolling and algorithmic compression, we seek to cultivate a space for deliberate reflection. Every article is meticulously researched and passionately written to challenge norms and inspire nuance.
    </p>
    
    <h2 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"2.5rem",marginTop:"5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"1rem"}}>The Team</h2>
    <div style={{display:"flex",flexDirection:"column",gap:"2rem"}}>
      <div style={{display:"flex",gap:"2rem",alignItems:"center",padding:"1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent)"}}>
        <div style={{width:"6rem",height:"6rem",borderRadius:"50%",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",overflow:"hidden",flexShrink:0,boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}></div>
        <div>
          <h3 style={{fontSize:"1.5rem",fontWeight:"800",marginBottom:"0.25rem"}}>Elena Rostova</h3>
          <p style={{fontSize:"0.875rem",color:"var(--wp--preset--color--primary)",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>Editor-in-Chief</p>
          <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",margin:0}}>Former architect turned cultural critic.</p>
        </div>
      </div>
    </div>
  </div>
</main>
`;

export const BLOG_ARCHIVE_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"64rem",margin:"0 auto",minHeight:"80vh",position:"relative"}}>
  <div style={{position:"absolute",top:"10%",right:"-20%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(150px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"clamp(4rem, 8vw, 6rem)",fontWeight:"800",letterSpacing:"-0.02em",marginBottom:"1rem",color:"var(--wp--preset--color--contrast)"}}>The Archive.</h1>
    <p style={{fontSize:"1.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"5rem"}}>A chronological catalog of every article ever published.</p>
    
    <div>
      {[2026, 2025, 2024].map((year) => (
        <div key={year} style={{marginBottom:"5rem"}}>
          <h2 style={{fontSize:"3rem",fontWeight:"800",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",paddingBottom:"0.5rem",marginBottom:"2.5rem"}}>{year}</h2>
          <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"1.5rem"}}>
            {[1,2,3,4].map((item) => (
              <li key={item}>
                <a href="#" style={{display:"grid",gridTemplateColumns:"6rem 1fr",gap:"2rem",alignItems:"center",textDecoration:"none",color:"var(--wp--preset--color--contrast)",padding:"1.5rem",borderRadius:"1rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 2%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent)",transition:"all 0.2s"}}>
                  <span style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"1rem",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.05em"}}>Nov 12</span>
                  <span style={{fontSize:"1.5rem",fontWeight:"800"}}>The changing dynamics of urban spaces in modern capitals</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</main>
`;

export const BLOG_404_JSX_SOURCE = `
<main style={{height:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"36rem",position:"relative",zIndex:"10"}}>
    <span style={{display:"inline-block",padding:"0.5rem 1rem",borderRadius:"999px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",color:"var(--wp--preset--color--primary)",fontSize:"1rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em",border:"1px solid color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>Error 404</span>
    <h1 style={{fontSize:"clamp(4rem, 8vw, 6rem)",fontWeight:"800",lineHeight:"1.1",color:"var(--wp--preset--color--contrast)",margin:"2rem 0",letterSpacing:"-0.02em"}}>Lost in the archives</h1>
    <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"3.5rem",fontSize:"1.5rem",lineHeight:"1.6"}}>We couldn't find the article you're seeking. It might have been moved or removed entirely.</p>
    <a href="/" style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"1.25rem 3rem",borderRadius:"999px",textDecoration:"none",fontWeight:"700",fontSize:"1.125rem",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>Read Latest Posts</a>
  </div>
</main>
`;
