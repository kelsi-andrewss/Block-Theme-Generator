import { SAAS_FEATURES } from '../data/saas-features';

function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

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

function buildFeatureCards(): string {
  return SAAS_FEATURES.map((feature) => {
    const colors = COLOR_MAP[feature.colorType] || COLOR_MAP.primary;
    const escapedSvg = esc(feature.wpIconSvg);
    return `<div style={{padding:"2rem",borderRadius:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 3%, transparent)",boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
  <div style={{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:"${colors.iconBg}",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1.5rem",color:"${colors.iconColor}"}}>{"<svg style=\\"width:24px;height:24px\\" fill=\\"none\\" viewBox=\\"0 0 24 24\\" stroke=\\"currentColor\\">${escapedSvg}</svg>"}</div>
  <h3 style={{fontSize:"1.25rem",fontWeight:"700",marginBottom:"0.75rem"}}>${feature.title}</h3>
  <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",lineHeight:"1.625"}}>${feature.description}</p>
</div>`;
  }).join('\n');
}

const CHECK_SVG_GREEN = esc('<svg style="width:1.25rem;height:1.25rem;color:#22c55e" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_PRIMARY = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_CONTRAST = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');

const QUOTE_SVG = esc('<svg style="position:absolute;top:-1.5rem;left:-2rem;width:4rem;height:4rem;color:var(--wp--preset--color--primary);opacity:0.3" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>');

export function generateSaasFrontPageJsx(): string {
  const featuresJsx = buildFeatureCards();

  return `<main>

<div style={{paddingTop:"8rem",paddingBottom:"5rem",position:"relative"}}>

  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"800px",height:"800px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"absolute",top:"0",right:"0",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--secondary)",opacity:"0.15",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>

  <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"relative",zIndex:"10",textAlign:"center"}}>

    <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 1rem",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",boxShadow:"0 1px 2px rgba(0,0,0,0.05)",marginBottom:"2rem",backdropFilter:"blur(4px)"}}>
      <p>{"<span style=\\"display:block;width:8px;height:8px;border-radius:50%;background-color:var(--wp--preset--color--primary)\\"></span><span style=\\"font-size:0.875rem;font-weight:500;color:var(--wp--preset--color--contrast)\\">Introducing SaaSFlow 2.0</span>"}</p>
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
  <p style={{fontSize:"0.875rem",fontWeight:"500",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 50%, transparent)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"2rem",textAlign:"center"}}>Trusted by innovative teams worldwide</p>
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

<div style={{paddingTop:"6rem",paddingBottom:"8rem",position:"relative"}}>
  <div style={{marginBottom:"5rem",textAlign:"center"}}>
    <p style={{color:"var(--wp--preset--color--primary)",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"0.75rem",textAlign:"center"}}>Powerful Features</p>
    <h2 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Everything you need to succeed</h2>
    <p style={{fontSize:"1.125rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",lineHeight:"1.625",textAlign:"center"}}>{"We\\u2019ve built a comprehensive suite of tools designed to help you build, scale, and manage your product with ease."}</p>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2rem"}}>
    ${featuresJsx}
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"6rem",backgroundColor:"#09090b",color:"#ffffff",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",right:"0",bottom:"0",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.2",filter:"blur(100px)",borderRadius:"50%",pointerEvents:"none"}}></div>

  <div style={{display:"flex",gap:"4rem",alignItems:"center"}}>
    <div style={{flex:"1"}}>
      <h2 style={{fontSize:"clamp(2rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"2rem"}}>Loved by builders everywhere.</h2>

      <div style={{position:"relative"}}>
        <div>{"${QUOTE_SVG}"}</div>
        <p style={{fontSize:"1.25rem",fontWeight:"500",lineHeight:"1.6",marginBottom:"2rem",position:"relative",zIndex:"10"}}>{"\\u201cSwitching to SaaSFlow was the best decision we made this year. It allowed our team to ship features 40% faster and cut our infrastructure costs in half.\\u201d"}</p>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <div style={{width:"3.5rem",height:"3.5rem",borderRadius:"50%",backgroundImage:"url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop')",backgroundSize:"cover",border:"2px solid #27272a"}}></div>
          <div>
            <h4 style={{fontWeight:"700",marginTop:"0",marginBottom:"0"}}>Sarah Jenkins</h4>
            <p style={{color:"#a1a1aa",fontSize:"0.875rem",marginTop:"0",marginBottom:"0"}}>CTO at TechNova</p>
          </div>
        </div>
      </div>
    </div>

    <div style={{flex:"1"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
        <div style={{backgroundColor:"rgba(39,39,42,0.5)",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid rgba(63,63,70,0.5)"}}>
          <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>99.9%</p>
          <p style={{color:"#a1a1aa",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Uptime</p>
        </div>
        <div style={{backgroundColor:"rgba(39,39,42,0.5)",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid rgba(63,63,70,0.5)",transform:"translateY(1.5rem)"}}>
          <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>10M+</p>
          <p style={{color:"#a1a1aa",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Requests</p>
        </div>
        <div style={{backgroundColor:"rgba(39,39,42,0.5)",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid rgba(63,63,70,0.5)"}}>
          <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--secondary)",marginBottom:"0.5rem"}}>5,000+</p>
          <p style={{color:"#a1a1aa",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Teams</p>
        </div>
        <div style={{backgroundColor:"rgba(39,39,42,0.5)",backdropFilter:"blur(4px)",padding:"2rem",borderRadius:"1rem",border:"1px solid rgba(63,63,70,0.5)",transform:"translateY(1.5rem)"}}>
          <p style={{fontSize:"2.5rem",fontWeight:"800",color:"var(--wp--preset--color--secondary)",marginBottom:"0.5rem"}}>24/7</p>
          <p style={{color:"#a1a1aa",fontWeight:"500",marginTop:"0",marginBottom:"0",fontSize:"0.875rem"}}>Support</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"8rem",position:"relative"}}>
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
      <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
        <li>{"${CHECK_SVG_GREEN} Up to 5 users"}</li>
        <li>{"${CHECK_SVG_GREEN} Basic analytics"}</li>
        <li>{"${CHECK_SVG_GREEN} Community support"}</li>
      </ul>
    </div>

    <div style={{padding:"2rem",borderRadius:"1.5rem",border:"2px solid var(--wp--preset--color--primary)",backgroundColor:"var(--wp--preset--color--base)",display:"flex",flexDirection:"column",position:"relative",boxShadow:"0 20px 25px -5px color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent)",transform:"translateY(-1rem)"}}>
      <div style={{position:"absolute",top:"-0.5rem",left:"50%",transform:"translateX(-50%)",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontSize:"0.75rem",fontWeight:"700",padding:"0.25rem 0.75rem",borderRadius:"9999px",textTransform:"uppercase",letterSpacing:"0.05em"}}>{"Most Popular"}</div>
      <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--primary)",marginBottom:"0.5rem"}}>Professional</h3>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>For growing companies and established teams.</p>
      <div style={{marginBottom:"1.5rem"}}>
        <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$49</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
      </div>
      <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontWeight:"700",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Get Started</a>
      <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
        <li>{"${CHECK_SVG_PRIMARY} Unlimited users"}</li>
        <li>{"${CHECK_SVG_PRIMARY} Advanced analytics"}</li>
        <li>{"${CHECK_SVG_PRIMARY} Priority email support"}</li>
        <li>{"${CHECK_SVG_PRIMARY} Custom integrations"}</li>
      </ul>
    </div>

    <div style={{padding:"2rem",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",display:"flex",flexDirection:"column"}}>
      <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",marginBottom:"0.5rem"}}>Enterprise</h3>
      <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Custom solutions for large organizations.</p>
      <div style={{marginBottom:"1.5rem"}}>
        <p>{"<span style=\\"font-size:2.25rem;font-weight:800;color:var(--wp--preset--color--contrast)\\">$99</span><span style=\\"color:color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)\\">/mo</span>"}</p>
      </div>
      <a role="button" style={{display:"block",width:"100%",padding:"0.75rem",borderRadius:"0.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",fontWeight:"500",textAlign:"center",textDecoration:"none",marginBottom:"2rem"}}>Contact Sales</a>
      <ul style={{listStyle:"none",padding:"0",margin:"0",display:"flex",flexDirection:"column",gap:"1rem",fontSize:"0.875rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 70%, transparent)"}}>
        <li>{"${CHECK_SVG_CONTRAST} Everything in Pro"}</li>
        <li>{"${CHECK_SVG_CONTRAST} Dedicated account manager"}</li>
        <li>{"${CHECK_SVG_CONTRAST} SLA guarantees"}</li>
        <li>{"${CHECK_SVG_CONTRAST} SSO &amp; Advanced Security"}</li>
      </ul>
    </div>

  </div>
</div>

<div style={{paddingTop:"6rem",paddingBottom:"6rem",position:"relative",overflow:"hidden",background:"linear-gradient(to bottom, transparent, color-mix(in srgb, var(--wp--preset--color--primary) 10%, transparent))"}}>
  <div style={{textAlign:"center",position:"relative",zIndex:"10"}}>
    <h2 style={{fontSize:"clamp(2.25rem, 4vw, 3rem)",fontWeight:"700",marginBottom:"1.5rem",textAlign:"center"}}>Ready to supercharge your workflow?</h2>
    <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"2.5rem",textAlign:"center"}}>Join thousands of teams who are already building faster and better.</p>
    <div style={{display:"flex",justifyContent:"center"}}>
      <a role="button" style={{borderRadius:"9999px",padding:"16px 32px",fontWeight:"700",backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>Get Started for Free</a>
    </div>
  </div>
</div>

</main>`;
}
