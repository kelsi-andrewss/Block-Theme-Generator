function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

const PHONE_SVG = esc('<svg style="width:1.25rem;height:1.25rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>');
const STAR_SVG = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>');

export const LOCAL_BUSINESS_HEADER_JSX_SOURCE = `
<header style={{width:"100%",zIndex:50,position:"relative"}}>
  {/* Top Bar */}
  <div style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"0.625rem 0",fontSize:"0.875rem",fontWeight:"700",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>
    <div style={{maxWidth:"80rem",margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1rem"}}>
      <div style={{display:"flex",gap:"2rem"}}>
        <span style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          {"${PHONE_SVG}"}
          <a href="tel:555-0123" style={{color:"inherit",textDecoration:"none",letterSpacing:"0.05em"}}>(555) 123-4567</a>
        </span>
        <span style={{display:"flex",alignItems:"center",gap:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)"}}>
          <span>Open Mon-Fri: 8am - 6pm</span>
        </span>
      </div>
      <div>
        <a href="#quote" style={{color:"inherit",textDecoration:"underline",textUnderlineOffset:"4px",letterSpacing:"0.05em",textTransform:"uppercase",fontSize:"0.75rem",fontWeight:"800"}}>Emergency Service Available 24/7</a>
      </div>
    </div>
  </div>

  {/* Main Nav */}
  <div style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 90%, transparent)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",padding:"1.25rem 0",position:"sticky",top:0,zIndex:40,boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)"}}>
    <div style={{maxWidth:"80rem",margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      
      <a href="/" style={{display:"flex",alignItems:"center",gap:"0.75rem",textDecoration:"none"}}>
        <div style={{width:"3rem",height:"3rem",background:"linear-gradient(135deg, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",borderRadius:"0.75rem",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)",fontWeight:"900",fontSize:"1.5rem",boxShadow:"0 4px 10px -2px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>A</div>
        <span style={{color:"var(--wp--preset--color--contrast)",fontWeight:"900",fontSize:"1.75rem",letterSpacing:"-0.03em"}}>Apex<span style={{color:"var(--wp--preset--color--primary)"}}>Services</span></span>
      </a>

      <nav style={{display:"flex",gap:"2.5rem",alignItems:"center"}}>
        <a href="#services" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"700",fontSize:"1rem",transition:"color 0.2s"}}>Services</a>
        <a href="#reviews" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"700",fontSize:"1rem",transition:"color 0.2s"}}>Reviews</a>
        <a href="#about" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"700",fontSize:"1rem",transition:"color 0.2s"}}>About Us</a>
        <a href="#contact" style={{textDecoration:"none",color:"var(--wp--preset--color--base)",backgroundColor:"var(--wp--preset--color--primary)",fontWeight:"800",fontSize:"1rem",padding:"0.875rem 1.75rem",borderRadius:"999px",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)",transition:"all 0.2s"}}>Get a Quote</a>
      </nav>
    </div>
  </div>
</header>
`;

export const LOCAL_BUSINESS_FOOTER_JSX_SOURCE = `
<footer style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 95%, var(--wp--preset--color--base))",color:"var(--wp--preset--color--base)",padding:"8rem 0 3rem",marginTop:"8rem",position:"relative",overflow:"hidden",borderTop:"2px solid var(--wp--preset--color--primary)"}}>
  <div style={{position:"absolute",top:"-10%",left:"-10%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"80rem",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 15%, transparent)",paddingBottom:"5rem",marginBottom:"3rem"}}>
      
      {/* Brand & Contact */}
      <div>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"2rem"}}>
          <div style={{width:"2.5rem",height:"2.5rem",background:"linear-gradient(135deg, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",borderRadius:"0.5rem",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)",fontWeight:"900",fontSize:"1.25rem"}}>A</div>
          <span style={{color:"var(--wp--preset--color--base)",fontWeight:"900",fontSize:"1.75rem",letterSpacing:"-0.03em"}}>Apex<span style={{color:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)"}}>Services</span></span>
        </div>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",lineHeight:"1.8",marginBottom:"2rem",fontSize:"1.125rem",maxWidth:"20rem"}}>Your trusted local partner for residential and commercial property maintenance.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <a href="tel:5551234567" style={{display:"flex",alignItems:"center",gap:"0.75rem",color:"var(--wp--preset--color--base)",textDecoration:"none",fontWeight:"800",fontSize:"1.25rem"}}>{"${PHONE_SVG}"} (555) 123-4567</a>
          <a href="mailto:info@apexservices.local" style={{color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",textDecoration:"none",fontSize:"1.125rem",fontWeight:"500"}}>info@apexservices.local</a>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 style={{fontSize:"1.25rem",fontWeight:"800",marginBottom:"2rem",color:"var(--wp--preset--color--base)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Our Services</h3>
        <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",fontWeight:"500"}}>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Residential Plumbing</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>HVAC Repair & Install</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Electrical Services</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Emergency Response</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Routine Maintenance</a></li>
        </ul>
      </div>

      {/* Locations & Hours */}
      <div>
        <h3 style={{fontSize:"1.25rem",fontWeight:"800",marginBottom:"2rem",color:"var(--wp--preset--color--base)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Service Areas</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",lineHeight:"1.6",marginBottom:"2.5rem",fontWeight:"500"}}>Serving the Greater Metro Area, including Downtown, Westside, North Hills, and surrounding suburbs.</p>
        
        <h3 style={{fontSize:"1.25rem",fontWeight:"800",marginBottom:"1.5rem",color:"var(--wp--preset--color--base)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Hours</h3>
        <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"0.75rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",fontWeight:"500"}}>
          <li style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",paddingBottom:"0.5rem"}}><span>Mon-Fri</span><span>8:00 AM - 6:00 PM</span></li>
          <li style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",paddingBottom:"0.5rem"}}><span>Saturday</span><span>9:00 AM - 2:00 PM</span></li>
          <li style={{display:"flex",justifyContent:"space-between",paddingBottom:"0.5rem"}}><span>Sunday</span><span style={{color:"var(--wp--preset--color--primary)",fontWeight:"700"}}>Emergency Only</span></li>
        </ul>
      </div>

    </div>
    
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"1.5rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",fontSize:"1rem",fontWeight:"500"}}>
      <p>© 2026 Apex Services LLC. Licensed, Bonded, and Insured.</p>
      <div style={{display:"flex",gap:"2.5rem"}}>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Privacy Policy</a>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Terms of Use</a>
      </div>
    </div>
  </div>
</footer>
`;

export const LOCAL_BUSINESS_JSX_SOURCE = `
<main>
  {/* Hero Section */}
  <section style={{position:"relative",padding:"8rem 2rem 12rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,right:0,width:"60%",height:"100%",zIndex:0,display:"block"}}>
      <img src="/images/templates/local_guarantee.png" alt="Professional Technician" style={{width:"100%",height:"100%",objectFit:"cover",clipPath:"polygon(20% 0, 100% 0, 100% 100%, 0 100%)",filter:"contrast(1.1) brightness(0.9)"}} />
      <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",background:"linear-gradient(to right, color-mix(in srgb, var(--wp--preset--color--base) 100%, transparent) 0%, color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent) 30%, transparent 100%)"}}></div>
    </div>

    <div style={{maxWidth:"80rem",margin:"0 auto",position:"relative",zIndex:10}}>
      <div style={{maxWidth:"40rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",padding:"4rem",borderRadius:"2rem",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent), 0 0 0 1px color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",marginBottom:"2rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",padding:"0.5rem 1.25rem",borderRadius:"999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
          <div style={{display:"flex"}}>{"${STAR_SVG}"}{"${STAR_SVG}"}{"${STAR_SVG}"}{"${STAR_SVG}"}{"${STAR_SVG}"}</div>
          <span style={{fontWeight:"800",color:"var(--wp--preset--color--contrast)",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>5.0 (240+ Reviews)</span>
        </div>
        <h1 style={{fontSize:"clamp(3.5rem, 6vw, 4.5rem)",fontWeight:"900",lineHeight:"1.1",letterSpacing:"-0.03em",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem"}}>
          Fast, Reliable Home Services You Can Count On.
        </h1>
        <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"3rem",fontWeight:"500"}}>
          From emergency plumbing to routine HVAC maintenance, <strong style={{color:"var(--wp--preset--color--contrast)"}}>Apex</strong> delivers top-tier expertise with upfront pricing and guaranteed satisfaction.
        </p>
        <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
          <a href="#contact" style={{display:"inline-block",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"1.25rem 2.5rem",borderRadius:"999px",fontWeight:"800",fontSize:"1.125rem",textDecoration:"none",boxShadow:"0 10px 20px -5px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)",transition:"all 0.2s"}}>Book a Service</a>
          <a href="tel:5551234567" style={{display:"flex",alignItems:"center",gap:"0.5rem",justifyContent:"center",backgroundColor:"transparent",color:"var(--wp--preset--color--contrast)",border:"2px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",padding:"1.25rem 2.5rem",borderRadius:"999px",fontWeight:"800",fontSize:"1.125rem",textDecoration:"none",transition:"all 0.2s"}}>{"${PHONE_SVG}"} (555) 123-4567</a>
        </div>
      </div>
    </div>
  </section>

  {/* Trust Bar */}
  <section style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",backdropFilter:"blur(24px)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",padding:"3rem 0",boxShadow:"0 20px 25px -5px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",position:"relative",zIndex:20,marginTop:"-6rem",maxWidth:"76rem",margin:"-6rem auto 0 auto",borderRadius:"1.5rem"}}>
    <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:"3rem",textAlign:"center"}}>
      <div>
        <h4 style={{fontSize:"3rem",fontWeight:"900",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem",textShadow:"0 4px 6px color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>24/7</h4>
        <p style={{fontWeight:"700",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",margin:0,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Emergency Response</p>
      </div>
      <div>
        <h4 style={{fontSize:"3rem",fontWeight:"900",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem",textShadow:"0 4px 6px color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>15+</h4>
        <p style={{fontWeight:"700",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",margin:0,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Years Experience</p>
      </div>
      <div>
        <h4 style={{fontSize:"3rem",fontWeight:"900",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem",textShadow:"0 4px 6px color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>100%</h4>
        <p style={{fontWeight:"700",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",margin:0,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Satisfaction Guarantee</p>
      </div>
      <div>
        <h4 style={{fontSize:"3rem",fontWeight:"900",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem",textShadow:"0 4px 6px color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>A+</h4>
        <p style={{fontWeight:"700",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",margin:0,textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>BBB Rating</p>
      </div>
    </div>
  </section>

  {/* Services Grid */}
  <section id="services" style={{maxWidth:"80rem",margin:"0 auto",padding:"10rem 2rem",position:"relative"}}>
    <div style={{position:"absolute",top:"20%",left:"-10%",width:"500px",height:"500px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.08",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
    
    <div style={{textAlign:"center",marginBottom:"6rem",maxWidth:"48rem",margin:"0 auto 6rem",position:"relative",zIndex:"10"}}>
      <h2 style={{fontSize:"4rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",letterSpacing:"-0.03em",marginBottom:"1.5rem",lineHeight:"1.1"}}>Our Expertise</h2>
      <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",fontWeight:"500"}}>We cover all aspects of home systems. Certified, insured professionals ready to solve your problems today.</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:"3rem",position:"relative",zIndex:"10"}}>
      
      {/* Service 1 */}
      <div style={{backgroundColor:"var(--wp--preset--color--base)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",borderRadius:"1.5rem",overflow:"hidden",boxShadow:"0 20px 40px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"transform 0.3s ease",cursor:"pointer"}}>
        <div style={{height:"16rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",position:"relative",overflow:"hidden"}}>
          <img src="/images/templates/local_interior.png" alt="Plumbing" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent), transparent)"}}></div>
        </div>
        <div style={{padding:"2.5rem"}}>
          <h3 style={{fontSize:"1.75rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>Plumbing</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"2rem",fontSize:"1.125rem"}}>From leaky faucets to full pipe replacements. We fix water heaters, unclog drains, and ensure your water flows perfectly.</p>
          <a href="#quote" style={{fontWeight:"800",color:"var(--wp--preset--color--primary)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.5rem",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Learn More <span style={{fontSize:"1.25rem"}}>→</span></a>
        </div>
      </div>

       {/* Service 2 */}
       <div style={{backgroundColor:"var(--wp--preset--color--base)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",borderRadius:"1.5rem",overflow:"hidden",boxShadow:"0 20px 40px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"transform 0.3s ease",cursor:"pointer"}}>
        <div style={{height:"16rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",position:"relative",overflow:"hidden"}}>
           <img src="/images/templates/portfolio_brand.png" alt="HVAC" style={{width:"100%",height:"100%",objectFit:"cover"}} />
           <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent), transparent)"}}></div>
        </div>
        <div style={{padding:"2.5rem"}}>
          <h3 style={{fontSize:"1.75rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>Heating & Cooling</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"2rem",fontSize:"1.125rem"}}>Stay comfortable year-round. AC repair, furnace installation, and seasonal tune-ups by licensed HVAC technicians.</p>
          <a href="#quote" style={{fontWeight:"800",color:"var(--wp--preset--color--primary)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.5rem",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Learn More <span style={{fontSize:"1.25rem"}}>→</span></a>
        </div>
      </div>

       {/* Service 3 */}
       <div style={{backgroundColor:"var(--wp--preset--color--base)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",borderRadius:"1.5rem",overflow:"hidden",boxShadow:"0 20px 40px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"transform 0.3s ease",cursor:"pointer"}}>
        <div style={{height:"16rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",position:"relative",overflow:"hidden"}}>
           <img src="/images/templates/local_landscaping.png" alt="Electrical" style={{width:"100%",height:"100%",objectFit:"cover"}} />
           <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent), transparent)"}}></div>
        </div>
        <div style={{padding:"2.5rem"}}>
          <h3 style={{fontSize:"1.75rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>Electrical</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.6",marginBottom:"2rem",fontSize:"1.125rem"}}>Safe, code-compliant electrical work. Panel upgrades, lighting installations, and wiring troubleshooting.</p>
          <a href="#quote" style={{fontWeight:"800",color:"var(--wp--preset--color--primary)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.5rem",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem"}}>Learn More <span style={{fontSize:"1.25rem"}}>→</span></a>
        </div>
      </div>

    </div>
  </section>

  {/* CTA & Trust */}
  <section style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",padding:"10rem 2rem",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"0",bottom:"0",left:"0",right:"0",background:"linear-gradient(135deg, color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent), transparent)",zIndex:"0"}}></div>
    <div style={{maxWidth:"64rem",margin:"0 auto",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",backdropFilter:"blur(24px)",padding:"5rem",borderRadius:"2rem",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent), 0 0 0 1px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",textAlign:"center",position:"relative",zIndex:"10"}}>
      <h2 style={{fontSize:"3.5rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",letterSpacing:"-0.03em"}}>Need help right now?</h2>
      <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"4rem",maxWidth:"40rem",margin:"0 auto 4rem",fontWeight:"500"}}>Our dispatch team is ready to send an expert to your door. No hidden fees, just honest work.</p>
      <form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.75rem",maxWidth:"48rem",margin:"0 auto"}}>
        <input type="text" placeholder="Your Name" style={{padding:"1.25rem 1.5rem",borderRadius:"0.75rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",fontSize:"1.125rem",outline:"none",gridColumn:"auto"}} />
        <input type="tel" placeholder="Phone Number" style={{padding:"1.25rem 1.5rem",borderRadius:"0.75rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",fontSize:"1.125rem",outline:"none",gridColumn:"auto"}} />
        <textarea placeholder="Describe your issue..." style={{padding:"1.25rem 1.5rem",borderRadius:"0.75rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",fontSize:"1.125rem",outline:"none",gridColumn:"1 / -1",minHeight:"10rem",resize:"vertical"}}></textarea>
        <button type="submit" style={{gridColumn:"1 / -1",padding:"1.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",border:"none",borderRadius:"0.75rem",fontWeight:"900",fontSize:"1.25rem",textTransform:"uppercase",letterSpacing:"0.05em",cursor:"pointer",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)",transition:"transform 0.2s"}}>Request Call Back</button>
      </form>
    </div>
  </section>
</main>
`;

export const LOCAL_BUSINESS_ABOUT_JSX_SOURCE = `
<main style={{padding:"10rem 2rem",maxWidth:"80rem",margin:"0 auto",minHeight:"80vh",position:"relative"}}>
  <div style={{position:"absolute",top:"10%",right:"10%",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <h1 style={{fontSize:"clamp(4rem, 8vw, 6rem)",fontWeight:"900",letterSpacing:"-0.04em",marginBottom:"5rem",color:"var(--wp--preset--color--contrast)",position:"relative",zIndex:"10"}}>About <span style={{color:"var(--wp--preset--color--primary)"}}>Apex Services</span></h1>
  
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(400px, 1fr))",gap:"6rem",position:"relative",zIndex:"10"}}>
    <div>
      <h2 style={{fontSize:"2.5rem",fontWeight:"900",marginBottom:"2rem",color:"var(--wp--preset--color--contrast)",paddingBottom:"1rem",borderBottom:"2px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>Our History</h2>
      <p style={{fontSize:"1.25rem",lineHeight:"1.8",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"2.5rem",fontWeight:"500"}}>Founded in 2011, Apex Services started as a small, family-owned plumbing operation. Today, we've grown into a full-service home maintenance company, but our core values remain exactly the same: honesty, integrity, and doing the job right the first time.</p>
      <p style={{fontSize:"1.25rem",lineHeight:"1.8",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontWeight:"500"}}>Every technician on our team is fully licensed, rigorously background-checked, and committed to treating your home with the utmost respect. We wear shoe covers, clean up our mess, and guarantee all of our work.</p>
    </div>
    <div style={{aspectRatio:"4/3",borderRadius:"2rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",overflow:"hidden",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
       <img src="/images/templates/local_exterior.png" alt="Team" style={{width:"100%",height:"100%",objectFit:"cover"}} />
    </div>
  </div>
</main>
`;

export const LOCAL_BUSINESS_SERVICES_JSX_SOURCE = `
<main style={{padding:"10rem 2rem",maxWidth:"80rem",margin:"0 auto",minHeight:"80vh",position:"relative"}}>
  <h1 style={{fontSize:"clamp(4rem, 8vw, 6rem)",fontWeight:"900",letterSpacing:"-0.04em",marginBottom:"5rem",color:"var(--wp--preset--color--contrast)",borderBottom:"2px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"2rem",position:"relative",zIndex:"10"}}>All Services</h1>
  
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(350px, 1fr))",gap:"3rem",position:"relative",zIndex:"10"}}>
    {['Residential Repair', 'Commercial Contracts', 'Emergency Services', 'Preventative Maintenance', 'Appliance Install', 'Water Damage Restoration', 'HVAC Filter Plans', 'Smart Home Wiring'].map(service => (
      <div key={service} style={{padding:"2.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",borderRadius:"1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 2%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
        <h3 style={{fontSize:"1.5rem",fontWeight:"900",marginBottom:"1rem",color:"var(--wp--preset--color--contrast)"}}>{service}</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"2rem",lineHeight:"1.6",fontSize:"1.125rem",fontWeight:"500"}}>Customized solutions to keep your property safe, efficient, and running smoothly year-round without breaking the bank.</p>
        <a href="#contact" style={{color:"var(--wp--preset--color--primary)",fontWeight:"800",textDecoration:"none",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem",display:"inline-flex",alignItems:"center",gap:"0.5rem"}}>
          Request details 
          <span style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)",width:"2rem",height:"2rem",display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"50%"}}>→</span>
        </a>
      </div>
    ))}
  </div>
</main>
`;

export const LOCAL_BUSINESS_404_JSX_SOURCE = `
<main style={{height:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"800px",height:"800px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(150px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"40rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",backdropFilter:"blur(24px)",padding:"5rem 3rem",borderRadius:"2rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"8rem",fontWeight:"900",lineHeight:"1",color:"var(--wp--preset--color--primary)",letterSpacing:"-0.05em",marginBottom:"1.5rem",textShadow:"0 10px 20px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>404</h1>
    <h2 style={{fontSize:"2.5rem",fontWeight:"900",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",letterSpacing:"-0.02em"}}>Looks like a wrong turn</h2>
    <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",marginBottom:"3.5rem",fontSize:"1.25rem",lineHeight:"1.6",fontWeight:"500"}}>We can't find the page you are looking for. It might have been moved or deleted.</p>
    <a href="/" style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"1.25rem 3rem",borderRadius:"999px",textDecoration:"none",fontWeight:"900",fontSize:"1.125rem",textTransform:"uppercase",letterSpacing:"0.05em",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>Back to Homepage</a>
  </div>
</main>
`;
