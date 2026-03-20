'use client';

import { SAAS_FEATURES } from '@/lib/data/saas-features';
import JsxStringRenderer from '@/components/JsxStringRenderer';

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
  return SAAS_FEATURES.map((feature) => {
    const colors = COLOR_MAP[feature.colorType] || COLOR_MAP.primary;
    const escapedSvg = esc(feature.icon);
    return `<div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
  <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"${colors.iconBg}",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem",color:"${colors.iconColor}"}}>{"<svg style=\\"width:24px;height:24px\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\">${escapedSvg}</svg>"}</div>
  <h3 style={{fontSize:"1.25rem",fontWeight:"700",marginBottom:"0.75rem"}}>${feature.title}</h3>
  <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.625"}}>${feature.description}</p>
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
      <p style={{fontSize:"0.875rem",fontWeight:"500",color:"var(--wp--preset--color--contrast)"}}>Introducing SaaSFlow 2.0</p>
    </div>

    <h1 style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800",lineHeight:"1.1",marginBottom:"2rem",maxWidth:"1024px",marginLeft:"auto",marginRight:"auto"}}>{"Build faster with our <br><span style=\\"background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\\">advanced platform</span>"}</h1>

    <p style={{fontSize:"1.25rem",maxWidth:"672px",margin:"0 auto 3rem auto",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"300",lineHeight:"1.625"}}>The complete toolkit for modern teams. Streamline your workflow, collaborate in real-time, and ship powerful products faster than ever before.</p>

    <div style={{display:"flex",justifyContent:"center",gap:"1rem"}}>
      <a role="button" href="/signup" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"700",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 25%, transparent)"}}>Start for free</a>
      <a role="button" href="#features" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"500",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>View Documentation</a>
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
      <p style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem",textAlign:"center"}}>Powerful Features</p>
      <h2 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Everything you need to succeed</h2>
      <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",lineHeight:"1.625",textAlign:"center"}}>{"We\\u2019ve built a comprehensive suite of tools designed to help you build, scale, and manage your product with ease."}</p>
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
        <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"2rem"}}>Loved by builders everywhere.</h2>

        <div style={{position:"relative"}}>
          <div>{"${QUOTE_SVG}"}</div>
          <p style={{fontSize:"1.25rem",fontWeight:"500",lineHeight:"1.6",marginBottom:"2rem",position:"relative",zIndex:"10"}}>{"\\u201cSwitching to SaaSFlow was the best decision we made this year. It allowed our team to ship features 40% faster and cut our infrastructure costs in half.\\u201d"}</p>
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            <div style={{width:"3.5rem",height:"3.5rem",borderRadius:"50%",backgroundImage:"url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop')",backgroundSize:"cover",border:"2px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}></div>
            <div>
              <h4 style={{fontWeight:"700",marginTop:"0",marginBottom:"0"}}>Sarah Jenkins</h4>
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
    <h2 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Ready to supercharge your workflow?</h2>
    <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"2.5rem",textAlign:"center"}}>Join thousands of teams who are already building faster and better.</p>
    <div style={{display:"flex",justifyContent:"center"}}>
      <a role="button" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"700",backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>Get Started for Free</a>
    </div>
  </div>
</div>

</main>`;


const WP_VAR_BRIDGE: Record<string, string> = {
  '--wp--preset--color--primary': 'var(--color-primary-500)',
  '--wp--preset--color--secondary': 'var(--color-secondary-500)',
  '--wp--preset--color--contrast': 'var(--color-text)',
  '--wp--preset--color--base': 'var(--color-bg)',
};

export default function SaaSPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      minHeight: '100vh',
      ...WP_VAR_BRIDGE,
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      <JsxStringRenderer jsxString={SAAS_JSX_SOURCE} />
    </div>
  );
}
