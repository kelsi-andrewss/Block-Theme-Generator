export {
  SAAS_HEADER_JSX_SOURCE,
  SAAS_FOOTER_JSX_SOURCE,
  SAAS_JSX_SOURCE,
} from './page';

function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

const CHECK_SVG_PRIMARY = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--primary);display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_GREEN = esc('<svg style="width:1.25rem;height:1.25rem;color:#22c55e;display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');
const CHECK_SVG_CONTRAST = esc('<svg style="width:1.25rem;height:1.25rem;color:var(--wp--preset--color--contrast);display:inline;vertical-align:middle;flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>');

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
