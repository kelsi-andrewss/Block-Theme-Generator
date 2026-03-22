import { SAAS_FEATURES } from '@/lib/data/saas-features';

const COLOR_MAP: Record<string, { iconBg: string; iconColor: string }> = {
  primary: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)',
    iconColor: 'var(--wp--preset--color--primary)',
  },
  secondary: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--secondary) 15%, transparent)',
    iconColor: 'var(--wp--preset--color--secondary)',
  },
  accent: {
    iconBg: 'color-mix(in srgb, var(--wp--preset--color--primary) 10%, color-mix(in srgb, var(--wp--preset--color--secondary) 5%, transparent))',
    iconColor: 'var(--wp--preset--color--secondary)',
  },
};

function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

function buildFeatureCardsJsx(): string {
  return SAAS_FEATURES.map((feature, i) => {
    const colors = COLOR_MAP[feature.colorType] || COLOR_MAP.primary;
    const escapedSvg = esc(feature.icon);
    return `<div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
  <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"${colors.iconBg}",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem",color:"${colors.iconColor}"}}>{"<svg style=\\"width:24px;height:24px\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\">${escapedSvg}</svg>"}</div>
  <h3 data-uid="feature-title-${i}" style={{fontSize:"1.25rem",fontWeight:"700",marginBottom:"0.75rem"}}>${feature.title}</h3>
  <p data-uid="feature-desc-${i}" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.625"}}>${feature.description}</p>
</div>`;
  }).join('\n');
}

const CHECK_SVG_GREEN = esc('<svg style="width:1.25rem;height:1.25rem;color:#22c55e;display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_PRIMARY = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary);display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_CONTRAST = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast);display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const QUOTE_SVG = esc('<svg style="position:absolute;top:-1.5rem;left:-2rem;width:4rem;height:4rem;color:var(--wp--preset--color--primary);opacity:0.3" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>');

const featuresJsx = buildFeatureCardsJsx();

const TWITTER_SVG = esc('<svg style="width:1.25rem;height:1.25rem" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>');
const GITHUB_SVG = esc('<svg style="width:1.25rem;height:1.25rem" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/></svg>');

export const SAAS_HEADER_JSX_SOURCE = `<header style={{borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",paddingTop:"0",paddingRight:"0",paddingBottom:"0",paddingLeft:"0",width:"100%",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",backdropFilter:"blur(24px)",zIndex:"50"}}>
  <div style={{paddingRight:"1.5rem",paddingLeft:"1.5rem",maxWidth:"80rem",margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:"5rem"}}>
      <div style={{display:"flex"}}>
        <p><a href="/" style={{display:"flex",alignItems:"center",gap:"0.5rem",textDecoration:"none"}}><span style={{width:"2rem",height:"2rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"700",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent)"}}>S</span><span style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",letterSpacing:"-0.025em",fontFamily:"sans-serif"}}>SaaS<span style={{color:"var(--wp--preset--color--primary)"}}>Flow</span></span></a></p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"2rem"}}>
        <p><a href="#features" style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontFamily:"sans-serif"}}>Features</a></p>
        <p><a href="#testimonials" style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontFamily:"sans-serif"}}>Customers</a></p>
        <p><a href="#pricing" style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontFamily:"sans-serif"}}>Pricing</a></p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
        <p><a href="#login" style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none",fontFamily:"sans-serif"}}>Log in</a></p>
        <a role="button" href="#signup" style={{fontSize:"0.875rem",fontWeight:"500",backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",padding:"0.625rem 1.25rem",borderRadius:"9999px",textDecoration:"none",fontFamily:"sans-serif",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1)"}}>Get Started</a>
      </div>
    </div>
  </div>
</header>`;

export const SAAS_FOOTER_JSX_SOURCE = `<footer style={{borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",backgroundColor:"var(--wp--preset--color--base)",paddingTop:"4rem",paddingBottom:"2rem",paddingRight:"0",paddingLeft:"0",fontFamily:"sans-serif"}}>
  <div style={{paddingRight:"1.5rem",paddingLeft:"1.5rem",maxWidth:"80rem",margin:"0 auto"}}>
    <div style={{display:"flex",flexWrap:"wrap",gap:"3rem",marginBottom:"3rem"}}>
      <div style={{flex:"2",minWidth:"250px"}}>
        <p><a href="#" style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1rem",textDecoration:"none"}}><span style={{width:"1.5rem",height:"1.5rem",borderRadius:"0.375rem",backgroundColor:"var(--wp--preset--color--primary)",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.75rem",fontWeight:"700"}}>S</span><span style={{fontSize:"1.125rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",letterSpacing:"-0.025em"}}>SaaSFlow</span></a></p>
        <p style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",maxWidth:"20rem",lineHeight:"1.6",margin:"0"}}>Building the next generation of powerful, scalable SaaS tools for modern teams.</p>
      </div>
      <div style={{flex:"1",minWidth:"120px"}}>
        <h3 style={{fontWeight:"600",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",fontSize:"0.875rem",lineHeight:"1.2",marginTop:"0"}}>Product</h3>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Features</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Integrations</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Pricing</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Changelog</a></p>
        </div>
      </div>
      <div style={{flex:"1",minWidth:"120px"}}>
        <h3 style={{fontWeight:"600",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",fontSize:"0.875rem",lineHeight:"1.2",marginTop:"0"}}>Company</h3>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>About Us</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Careers</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Blog</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Contact</a></p>
        </div>
      </div>
      <div style={{flex:"1",minWidth:"120px"}}>
        <h3 style={{fontWeight:"600",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",fontSize:"0.875rem",lineHeight:"1.2",marginTop:"0"}}>Legal</h3>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Privacy Policy</a></p>
          <p><a href="#" style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",textDecoration:"none"}}>Terms of Service</a></p>
        </div>
      </div>
    </div>
    <div style={{borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",paddingTop:"2rem",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:"1rem"}}>
      <p style={{fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",margin:"0"}}>\u00a9 2026 SaaSFlow Inc. All rights reserved.</p>
      <div style={{display:"flex",gap:"1rem"}}>
        <p><a href="#" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>{"${TWITTER_SVG}"}</a></p>
        <p><a href="#" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>{"${GITHUB_SVG}"}</a></p>
      </div>
    </div>
  </div>
</footer>`;

export const SAAS_JSX_SOURCE = `<main>

<div style={{paddingTop:"8rem",paddingBottom:"5rem",position:"relative",overflow:"hidden"}}>

  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"800px",height:"800px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"absolute",top:"0",right:"0",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--secondary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>

  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10",textAlign:"center"}}>

    <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 1rem",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",boxShadow:"0 1px 2px rgba(0,0,0,0.05)",marginBottom:"2rem",marginTop:"2rem",backdropFilter:"blur(4px)"}}>
      <div style={{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"var(--wp--preset--color--primary)"}}></div>
      <p data-uid="hero-badge" style={{fontSize:"0.875rem",fontWeight:"500",color:"var(--wp--preset--color--contrast)"}}>Introducing SaaSFlow 2.0</p>
    </div>

    <h1 data-uid="hero-headline" style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800",lineHeight:"1.1",marginBottom:"2rem",maxWidth:"1024px",marginLeft:"auto",marginRight:"auto"}}>{"Build faster with our <br><span style=\\"background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\\">advanced platform</span>"}</h1>

    <p data-uid="hero-subtitle" style={{fontSize:"1.25rem",maxWidth:"672px",margin:"0 auto 3rem auto",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"300",lineHeight:"1.625"}}>The complete toolkit for modern teams. Streamline your workflow, collaborate in real-time, and ship powerful products faster than ever before.</p>

    <div style={{display:"flex",justifyContent:"center",gap:"1rem"}}>
      <a data-uid="hero-cta-primary" role="button" href="/signup" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"700",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 25%, transparent)"}}>Start for free</a>
      <a data-uid="hero-cta-secondary" role="button" href="#features" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"500",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>View Documentation</a>
    </div>

    <div style={{marginTop:"5rem",position:"relative",maxWidth:"1024px",marginLeft:"auto",marginRight:"auto",width:"100%"}}>
      <div style={{borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",backdropFilter:"blur(24px)",boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)",overflow:"hidden"}}>
        <div style={{height:"3rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",display:"flex",alignItems:"center",padding:"0 1rem",gap:"0.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <div style={{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:"rgba(248, 113, 113, 0.8)"}}></div>
          <div style={{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:"rgba(251, 191, 36, 0.8)"}}></div>
          <div style={{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:"rgba(74, 222, 128, 0.8)"}}></div>
        </div>
        <div style={{aspectRatio:"16/9",width:"100%",backgroundImage:"url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')",backgroundSize:"cover",backgroundPosition:"center",mixBlendMode:"multiply",opacity:"0.9"}}></div>
      </div>
    </div>
  </div>
</div>

<div style={{paddingTop:"3rem",paddingBottom:"3rem",borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem",textAlign:"center"}}>
    <p style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"2rem"}}>Trusted by innovative teams worldwide</p>
    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"4rem",opacity:"0.5",filter:"grayscale(100%)"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:"700",fontSize:"1.25rem",color:"var(--wp--preset--color--contrast)"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"4px",backgroundColor:"var(--wp--preset--color--contrast)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)"}}>{"1"}</div>
        {"Company 1"}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:"700",fontSize:"1.25rem",color:"var(--wp--preset--color--contrast)"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"4px",backgroundColor:"var(--wp--preset--color--contrast)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)"}}>{"2"}</div>
        {"Company 2"}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:"700",fontSize:"1.25rem",color:"var(--wp--preset--color--contrast)"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"4px",backgroundColor:"var(--wp--preset--color--contrast)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)"}}>{"3"}</div>
        {"Company 3"}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:"700",fontSize:"1.25rem",color:"var(--wp--preset--color--contrast)"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"4px",backgroundColor:"var(--wp--preset--color--contrast)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)"}}>{"4"}</div>
        {"Company 4"}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontWeight:"700",fontSize:"1.25rem",color:"var(--wp--preset--color--contrast)"}}>
        <div style={{width:"32px",height:"32px",borderRadius:"4px",backgroundColor:"var(--wp--preset--color--contrast)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--wp--preset--color--base)"}}>{"5"}</div>
        {"Company 5"}
      </div>
    </div>
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"8rem",position:"relative"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem"}}>
    <div style={{marginBottom:"5rem",textAlign:"center"}}>
      <p data-uid="features-badge" style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem",textAlign:"center"}}>Powerful Features</p>
      <h2 data-uid="features-headline" style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Everything you need to succeed</h2>
      <p data-uid="features-subtitle" style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",lineHeight:"1.625",textAlign:"center"}}>{"We\\u2019ve built a comprehensive suite of tools designed to help you build, scale, and manage your product with ease."}</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem"}}>
      ${featuresJsx}
    </div>
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"6rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, var(--wp--preset--color--base))",color:"var(--wp--preset--color--contrast)",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",right:"0",bottom:"0",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.2",filter:"blur(100px)",borderRadius:"50%",pointerEvents:"none"}}></div>

  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10"}}>
    <div style={{display:"flex",gap:"4rem",alignItems:"center"}}>

      <div style={{flex:"1"}}>
        <h2 data-uid="testimonial-headline" style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"2rem"}}>Loved by builders everywhere.</h2>

        <div style={{position:"relative"}}>
          <div>{"${QUOTE_SVG}"}</div>
          <p data-uid="testimonial-quote" style={{fontSize:"1.25rem",fontWeight:"500",lineHeight:"1.6",marginBottom:"2rem",position:"relative",zIndex:"10"}}>{"\\u201cSwitching to SaaSFlow was the best decision we made this year. It allowed our team to ship features 40% faster and cut our infrastructure costs in half.\\u201d"}</p>
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            <div style={{width:"3.5rem",height:"3.5rem",borderRadius:"50%",backgroundImage:"url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop')",backgroundSize:"cover",border:"2px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}></div>
            <div>
              <h4 data-uid="testimonial-author" style={{fontWeight:"700",marginTop:"0",marginBottom:"0"}}>Sarah Jenkins</h4>
              <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginTop:"0",marginBottom:"0"}}>CTO at TechNova</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:"1"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
          <div style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, var(--wp--preset--color--base))",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
            <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>99.9%</p>
            <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Uptime Guarantee</p>
          </div>
          <div style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, var(--wp--preset--color--base))",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",transform:"translateY(1.5rem)"}}>
            <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>10M+</p>
            <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Requests per day</p>
          </div>
          <div style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, var(--wp--preset--color--base))",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
            <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--secondary)",marginBottom:"0.5rem"}}>5,000+</p>
            <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Active Teams</p>
          </div>
          <div style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, var(--wp--preset--color--base))",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",transform:"translateY(1.5rem)"}}>
            <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--secondary)",marginBottom:"0.5rem"}}>24/7</p>
            <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Expert Support</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"8rem",position:"relative"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem"}}>
    <div style={{marginBottom:"4rem",textAlign:"center"}}>
      <h2 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Simple, transparent pricing</h2>
      <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",lineHeight:"1.625",marginBottom:"2rem",textAlign:"center"}}>Choose the plan that best fits your needs. All plans include a 14-day free trial.</p>
      <div style={{display:"inline-flex",alignItems:"center",padding:"0.25rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
        <a role="button" style={{padding:"0.5rem 1.5rem",borderRadius:"9999px",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",fontSize:"0.875rem",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>Monthly</a>
        <a role="button" style={{padding:"0.5rem 1.5rem",borderRadius:"9999px",backgroundColor:"transparent",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",fontSize:"0.875rem"}}>{"Annually <span style=\\"margin-left:0.25rem;font-size:0.75rem;color:var(--wp--preset--color--primary);font-weight:700\\">-20%</span>"}</a>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem",maxWidth:"1024px",margin:"0 auto",alignItems:"center"}}>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Starter</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Perfect for side projects and small teams.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$19</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Start Free Trial</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Up to 5 users"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Basic analytics"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Community support"}</li>
          </ul>
        </div>
      </div>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"2px solid var(--wp--preset--color--primary)",backgroundColor:"var(--wp--preset--color--base)",display:"flex",flexDirection:"column",position:"relative",boxShadow:"0 20px 25px -5px color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",transform:"translateY(-1rem)"}}>
        <div style={{position:"absolute",top:"-0.5rem",left:"50%",transform:"translateX(-50%)",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontSize:"0.75rem",fontWeight:"700",padding:"0.25rem 0.75rem",borderRadius:"9999px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{"Most Popular"}</div>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>Professional</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>For growing companies and established teams.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$49</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"700",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Get Started</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Unlimited users"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Advanced analytics"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Priority email support"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Custom integrations"}</li>
          </ul>
        </div>
      </div>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Enterprise</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Custom solutions for large organizations.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$99</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Contact Sales</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} Everything in Pro"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} Dedicated account manager"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} SLA guarantees"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} SSO &amp; Advanced Security"}</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"6rem",position:"relative",overflow:"hidden",background:"linear-gradient(to bottom, transparent, color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent))"}}>
  <div style={{maxWidth:"1024px",margin:"0 auto",padding:"0 2rem",textAlign:"center",position:"relative",zIndex:"10"}}>
    <h2 data-uid="cta-headline" style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Ready to supercharge your workflow?</h2>
    <p data-uid="cta-subtitle" style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"2.5rem",textAlign:"center"}}>Join thousands of teams who are already building faster and better.</p>
    <div style={{display:"flex",justifyContent:"center"}}>
      <a data-uid="cta-button" role="button" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"700",backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>Get Started for Free</a>
    </div>
  </div>
</div>

</main>`;

const MAIL_SVG = esc('<svg style="width:1.5rem;height:1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>');
const PHONE_SVG = esc('<svg style="width:1.5rem;height:1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>');
const MAP_SVG = esc('<svg style="width:1.5rem;height:1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>');
const BOOK_SVG = esc('<svg style="width:1rem;height:1rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>');
const LIGHTBULB_SVG = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary);flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>');
const CHEVRON_RIGHT_SVG = esc('<svg style="width:0.75rem;height:0.75rem" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>');

export const SAAS_404_JSX_SOURCE = `<main style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"500px",height:"500px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(100px)",borderRadius:"50%",zIndex:"0"}}></div>
  <div style={{position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"8rem",fontWeight:"900",margin:"0",lineHeight:"1",background:"linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>404</h1>
    <h2 style={{fontSize:"2rem",fontWeight:"700",marginBottom:"1rem"}}>Page not found</h2>
    <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",maxWidth:"400px",margin:"0 auto 2.5rem auto",lineHeight:"1.6"}}>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    <div style={{display:"flex",gap:"1rem",justifyContent:"center"}}>
      <a href="/" style={{padding:"0.75rem 1.5rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"600",textDecoration:"none"}}>Back to Home</a>
      <a href="/contact" style={{padding:"0.75rem 1.5rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",color:"var(--wp--preset--color--contrast)",fontWeight:"600",textDecoration:"none"}}>Contact Support</a>
    </div>
  </div>
</main>`;

export const SAAS_SIGNUP_JSX_SOURCE = `<main style={{padding:"6rem 2rem",display:"flex",justifyContent:"center"}}>
  <div style={{width:"100%",maxWidth:"480px"}}>
    <div style={{textAlign:"center",marginBottom:"3rem"}}>
      <h1 style={{fontSize:"2.25rem",fontWeight:"800",marginBottom:"0.75rem"}}>Create your account</h1>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>Start your 14-day free trial. No credit card required.</p>
    </div>
    <div style={{padding:"2.5rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",backdropFilter:"blur(24px)",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.1)"}}>
      <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
        <div>
          <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Full Name</label>
          <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
        </div>
        <div>
          <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Work Email</label>
          <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
        </div>
        <div>
          <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Password</label>
          <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.875rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"700",textAlign:"center",textDecoration:"none",marginTop:"1rem",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>Create Account</a>
      </div>
      <p style={{textAlign:"center",marginTop:"2rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)"}}>{"Already have an account? <a href=\\"/login\\" style=\\"color:var(--wp--preset--color--primary);font-weight:600;text-decoration:none\\">Sign in</a>"}</p>
    </div>
  </div>
</main>`;

export const SAAS_PRICING_JSX_SOURCE = `<main style={{paddingTop:"6rem",paddingBottom:"8rem",position:"relative"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem"}}>
    <div style={{marginBottom:"4rem",textAlign:"center"}}>
      <h1 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"800",marginBottom:"1.5rem",textAlign:"center"}}>Simple, transparent pricing</h1>
      <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",lineHeight:"1.625",marginBottom:"2rem",textAlign:"center"}}>Choose the plan that best fits your needs. All plans include a 14-day free trial.</p>
      <div style={{display:"inline-flex",alignItems:"center",padding:"0.25rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
        <a role="button" style={{padding:"0.5rem 1.5rem",borderRadius:"9999px",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",fontSize:"0.875rem",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>Monthly</a>
        <a role="button" style={{padding:"0.5rem 1.5rem",borderRadius:"9999px",backgroundColor:"transparent",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500",fontSize:"0.875rem"}}>{"Annually <span style=\\"margin-left:0.25rem;font-size:0.75rem;color:var(--wp--preset--color--primary);font-weight:700\\">-20%</span>"}</a>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem",maxWidth:"1024px",margin:"0 auto",alignItems:"center"}}>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Starter</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Perfect for side projects and small teams.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$19</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Start Free Trial</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Up to 5 users"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Basic analytics"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_GREEN} Community support"}</li>
          </ul>
        </div>
      </div>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"2px solid var(--wp--preset--color--primary)",backgroundColor:"var(--wp--preset--color--base)",display:"flex",flexDirection:"column",position:"relative",boxShadow:"0 20px 25px -5px color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",transform:"translateY(-1rem)"}}>
        <div style={{position:"absolute",top:"-0.5rem",left:"50%",transform:"translateX(-50%)",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontSize:"0.75rem",fontWeight:"700",padding:"0.25rem 0.75rem",borderRadius:"9999px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{"Most Popular"}</div>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>Professional</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>For growing companies and established teams.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$49</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"700",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Get Started</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Unlimited users"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Advanced analytics"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Priority email support"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_PRIMARY} Custom integrations"}</li>
          </ul>
        </div>
      </div>

      <div style={{padding:"2rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",display:"flex",flexDirection:"column"}}>
        <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Enterprise</h3>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Custom solutions for large organizations.</p>
        <div style={{marginBottom:"1.5rem"}}>
          <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$99</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
        </div>
        <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Contact Sales</a>
        <div style={{flex:"1"}}>
          <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} Everything in Pro"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} Dedicated account manager"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} SLA guarantees"}</li>
            <li style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>{"${CHECK_SVG_CONTRAST} SSO &amp; Advanced Security"}</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</main>`;

export const SAAS_DOCS_JSX_SOURCE = `<main style={{paddingTop:"4rem",paddingBottom:"6rem"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem",display:"flex",gap:"3rem"}}>

    <aside style={{width:"240px",flexShrink:"0"}}>
      <div style={{position:"sticky",top:"6rem"}}>
        <h3 style={{fontSize:"0.75rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",marginBottom:"1rem"}}>Documentation</h3>
        <div style={{display:"flex",flexDirection:"column",gap:"0.25rem"}}>
          <a href="/docs/getting-started" style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",color:"var(--wp--preset--color--primary)",fontWeight:"600",fontSize:"0.875rem",textDecoration:"none"}}>{"${BOOK_SVG}"} Getting Started</a>
          <a href="/docs/installation" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>Installation</a>
          <a href="/docs/configuration" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>Configuration</a>
          <a href="/docs/authentication" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>Authentication</a>
          <a href="/docs/api-reference" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>API Reference</a>
          <a href="/docs/webhooks" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>Webhooks</a>
          <a href="/docs/sdks" style={{display:"block",padding:"0.5rem 0.75rem",borderRadius:"0.5rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",textDecoration:"none"}}>SDKs &amp; Libraries</a>
        </div>
      </div>
    </aside>

    <article style={{flex:"1",minWidth:"0"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",marginBottom:"2rem"}}>
        <a href="/docs" style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",textDecoration:"none"}}>Docs</a>
        <span>{"${CHEVRON_RIGHT_SVG}"}</span>
        <span style={{color:"var(--wp--preset--color--contrast)",fontWeight:"500"}}>Getting Started</span>
      </div>

      <h1 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1rem"}}>Getting Started</h1>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"1.125rem",lineHeight:"1.625",marginBottom:"3rem"}}>Learn how to set up SaaSFlow in your project and start building in minutes.</p>

      <div style={{padding:"1.25rem 1.5rem",borderRadius:"0.75rem",borderLeft:"4px solid var(--wp--preset--color--primary)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 5%, transparent)",marginBottom:"2.5rem",display:"flex",gap:"0.75rem",alignItems:"flex-start"}}>
        <span>{"${LIGHTBULB_SVG}"}</span>
        <div>
          <p style={{fontWeight:"600",marginBottom:"0.25rem",marginTop:"0"}}>Tip</p>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",fontSize:"0.875rem",lineHeight:"1.6",marginBottom:"0",marginTop:"0"}}>Make sure you have Node.js 18+ and npm installed before proceeding with the installation steps below.</p>
        </div>
      </div>

      <h2 style={{fontSize:"1.5rem",fontWeight:"700",marginBottom:"1rem"}}>Installation</h2>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.625",marginBottom:"1.5rem"}}>Install the SaaSFlow SDK using your preferred package manager:</p>

      <div style={{borderRadius:"0.75rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",overflow:"hidden",marginBottom:"2.5rem"}}>
        <div style={{padding:"0.75rem 1rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:"0.75rem",fontWeight:"600",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Terminal</span>
        </div>
        <div style={{padding:"1.25rem 1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <pre style={{margin:"0",fontFamily:"monospace",fontSize:"0.875rem",lineHeight:"1.7",color:"var(--wp--preset--color--contrast)"}}>npm install @saasflow/sdk</pre>
        </div>
      </div>

      <h2 style={{fontSize:"1.5rem",fontWeight:"700",marginBottom:"1rem"}}>Quick Start</h2>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)",lineHeight:"1.625",marginBottom:"1.5rem"}}>Initialize the client with your API key and start making requests:</p>

      <div style={{borderRadius:"0.75rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",overflow:"hidden",marginBottom:"2.5rem"}}>
        <div style={{padding:"0.75rem 1rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)"}}>
          <span style={{fontSize:"0.75rem",fontWeight:"600",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",textTransform:"uppercase",letterSpacing:"0.05em"}}>JavaScript</span>
        </div>
        <div style={{padding:"1.25rem 1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <pre style={{margin:"0",fontFamily:"monospace",fontSize:"0.875rem",lineHeight:"1.7",color:"var(--wp--preset--color--contrast)"}}>{"import { SaaSFlow } from \\u0027@saasflow/sdk\\u0027;\\n\\nconst client = new SaaSFlow({\\n  apiKey: process.env.SAASFLOW_API_KEY,\\n});\\n\\nconst result = await client.query({\\n  collection: \\u0027users\\u0027,\\n  limit: 10,\\n});"}</pre>
        </div>
      </div>
    </article>

  </div>
</main>`;

export const SAAS_CONTACT_JSX_SOURCE = `<main style={{paddingTop:"6rem",paddingBottom:"8rem"}}>
  <div style={{maxWidth:"1280px",margin:"0 auto",padding:"0 2rem"}}>
    <div style={{textAlign:"center",marginBottom:"4rem"}}>
      <h1 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"800",marginBottom:"1rem"}}>Get in touch</h1>
      <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",maxWidth:"600px",margin:"0 auto",lineHeight:"1.625"}}>Have a question or need help? Our team is here to assist you.</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",maxWidth:"960px",margin:"0 auto"}}>

      <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
        <div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",color:"var(--wp--preset--color--primary)"}}>{"${MAIL_SVG}"}</div>
          <h3 style={{fontSize:"1.125rem",fontWeight:"700",marginBottom:"0.5rem"}}>Email Support</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.6",marginBottom:"1rem"}}>Get help from our support team within 24 hours.</p>
          <a href="mailto:support@saasflow.io" style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",fontSize:"0.875rem",textDecoration:"none"}}>support@saasflow.io</a>
        </div>
        <div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--secondary) 15%, transparent)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",color:"var(--wp--preset--color--secondary)"}}>{"${PHONE_SVG}"}</div>
          <h3 style={{fontSize:"1.125rem",fontWeight:"700",marginBottom:"0.5rem"}}>Sales Inquiries</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.6",marginBottom:"1rem"}}>Talk to our sales team about Enterprise plans.</p>
          <a href="mailto:sales@saasflow.io" style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",fontSize:"0.875rem",textDecoration:"none"}}>sales@saasflow.io</a>
        </div>
        <div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--primary) 10%, color-mix(in srgb, var(--wp--preset--color--secondary) 5%, transparent))",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.25rem",color:"var(--wp--preset--color--secondary)"}}>{"${MAP_SVG}"}</div>
          <h3 style={{fontSize:"1.125rem",fontWeight:"700",marginBottom:"0.5rem"}}>Office</h3>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.6",marginBottom:"0"}}>100 Market Street, Suite 300</p>
          <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.6",marginTop:"0.25rem"}}>San Francisco, CA 94105</p>
        </div>
      </div>

      <div style={{padding:"2.5rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",backdropFilter:"blur(24px)",boxShadow:"0 20px 25px -5px rgba(0,0,0,0.1)"}}>
        <h2 style={{fontSize:"1.5rem",fontWeight:"700",marginBottom:"2rem"}}>Send us a message</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
            <div>
              <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>First Name</label>
              <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
            </div>
            <div>
              <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Last Name</label>
              <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
            </div>
          </div>
          <div>
            <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Email</label>
            <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
          </div>
          <div>
            <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Subject</label>
            <div style={{width:"100%",height:"2.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
          </div>
          <div>
            <label style={{display:"block",fontSize:"0.875rem",fontWeight:"600",marginBottom:"0.5rem"}}>Message</label>
            <div style={{width:"100%",height:"8rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)"}}></div>
          </div>
          <a role="button" style={{display:"block",width:"100%",padding:"0.875rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"700",textAlign:"center",textDecoration:"none",marginTop:"0.5rem",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}>Send Message</a>
        </div>
      </div>

    </div>
  </div>
</main>`;
