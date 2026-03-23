function esc(s: string): string {
  return s.replace(/"/g, '\\"');
}

const CART_SVG = esc('<svg style="width:1.5rem;height:1.5rem;color:var(--wp--preset--color--contrast)" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>');

export const ECOMMERCE_HEADER_JSX_SOURCE = `
<header style={{position:"sticky",top:0,zIndex:50,backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent)",padding:"1.25rem 0",width:"100%"}}>
  <div style={{maxWidth:"90rem",margin:"0 auto",padding:"0 2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    {/* Left Nav */}
    <nav style={{display:"flex",gap:"2.5rem",alignItems:"center",flex:"1"}}>
      <a href="#shop" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"color 0.2s"}}>Shop</a>
      <a href="#collections" style={{textDecoration:"none",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"color 0.2s"}}>Collections</a>
      <a href="#about" style={{textDecoration:"none",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"color 0.2s"}}>Our Story</a>
    </nav>
    
    {/* Logo */}
    <a href="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:"0.5rem",color:"var(--wp--preset--color--contrast)",fontWeight:"900",fontSize:"2.25rem",letterSpacing:"-0.05em",textTransform:"uppercase",flex:"0 0 auto"}}>
      <span style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%",background:"linear-gradient(135deg, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",display:"inline-block",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 30%, transparent)"}}></span>
      AURA.
    </a>

    {/* Right Nav */}
    <div style={{display:"flex",gap:"2rem",alignItems:"center",flex:"1",justifyContent:"flex-end"}}>
      <a href="#search" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>Search</a>
      <a href="#account" style={{textDecoration:"none",color:"var(--wp--preset--color--contrast)",fontWeight:"600",fontSize:"0.875rem",textTransform:"uppercase",letterSpacing:"0.05em"}}>Account</a>
      <a href="#cart" style={{display:"flex",alignItems:"center",gap:"0.5rem",textDecoration:"none",padding:"0.5rem 1rem",borderRadius:"999px",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",transition:"all 0.2s"}}>
        {"${CART_SVG}"}
        <span style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",fontSize:"0.75rem",fontWeight:"800",minWidth:"1.5rem",height:"1.5rem",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"999px",padding:"0 0.35rem",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>0</span>
      </a>
    </div>
  </div>
</header>
`;

export const ECOMMERCE_FOOTER_JSX_SOURCE = `
<footer style={{position:"relative",overflow:"hidden",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 95%, var(--wp--preset--color--base))",color:"var(--wp--preset--color--base)",padding:"8rem 0 3rem",marginTop:"8rem",borderTop:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)"}}>
  <div style={{position:"absolute",bottom:"0",right:"0",width:"800px",height:"800px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.15",filter:"blur(150px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{maxWidth:"90rem",margin:"0 auto",padding:"0 2rem",position:"relative",zIndex:"10"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 15%, transparent)",paddingBottom:"5rem",marginBottom:"3rem"}}>
      
      <div style={{gridColumn:"auto / span 2"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"0.75rem",textDecoration:"none",marginBottom:"1.5rem"}}>
          <span style={{width:"2rem",height:"2rem",borderRadius:"50%",background:"linear-gradient(135deg, var(--wp--preset--color--primary), var(--wp--preset--color--secondary))",display:"inline-block"}}></span>
          <h2 style={{fontSize:"2.5rem",fontWeight:"900",letterSpacing:"-0.05em",color:"var(--wp--preset--color--base)",margin:0}}>AURA.</h2>
        </a>
        <p style={{color:"color-mix(in srgb, var(--wp--preset--color--base) 70%, transparent)",lineHeight:"1.8",maxWidth:"22rem",marginBottom:"2.5rem",fontSize:"1.125rem"}}>Curated essentials for the modern lifestyle. Designed with obsession, responsibly made worldwide.</p>
        <div style={{display:"flex",gap:"1rem"}}>
           <input type="email" placeholder="Join our newsletter" style={{padding:"1rem 1.25rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 20%, transparent)",color:"var(--wp--preset--color--base)",borderRadius:"999px",outline:"none",width:"100%",maxWidth:"18rem",fontSize:"1rem"}} />
           <button style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",border:"none",padding:"0 2rem",borderRadius:"999px",fontWeight:"700",cursor:"pointer",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>Subscribe</button>
        </div>
      </div>

      <div>
        <h3 style={{fontSize:"0.875rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--wp--preset--color--base)",marginBottom:"2rem"}}>Shop</h3>
        <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",fontWeight:"500"}}>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>New Arrivals</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Best Sellers</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Clothing</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Accessories</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Sale</a></li>
        </ul>
      </div>

      <div>
        <h3 style={{fontSize:"0.875rem",fontWeight:"800",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--wp--preset--color--base)",marginBottom:"2rem"}}>Support</h3>
        <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 60%, transparent)",fontWeight:"500"}}>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>FAQ</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Shipping & Returns</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Size Guide</a></li>
          <li><a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Contact Us</a></li>
        </ul>
      </div>

    </div>
    
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"2rem",color:"color-mix(in srgb, var(--wp--preset--color--base) 50%, transparent)",fontSize:"0.875rem",fontWeight:"500"}}>
      <p>© 2026 AURA. All rights reserved.</p>
      <div style={{display:"flex",gap:"2.5rem"}}>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Privacy Policy</a>
        <a href="#" style={{color:"inherit",textDecoration:"none",transition:"color 0.2s"}}>Terms of Service</a>
      </div>
    </div>
  </div>
</footer>
`;

export const ECOMMERCE_JSX_SOURCE = `
<main>
  {/* Premium Hero Banner */}
  <section style={{position:"relative",height:"90vh",width:"100%",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",zIndex:0,padding:"1.5rem"}}>
      <div style={{position:"relative",width:"100%",height:"100%",borderRadius:"2rem",overflow:"hidden",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)"}}>
        <img src="/images/templates/ecommerce_hero.png" alt="Spring Collection" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",transform:"scale(1.05)",transition:"transform 10s ease-out"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent), color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent))"}}></div>
      </div>
    </div>
    
    <div style={{position:"relative",zIndex:10,textAlign:"center",color:"var(--wp--preset--color--base)",padding:"0 2rem",maxWidth:"48rem"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.5rem 1.25rem",borderRadius:"9999px",border:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 30%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",backdropFilter:"blur(12px)",marginBottom:"2rem"}}>
        <span style={{fontSize:"0.875rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em"}}>Spring 2026 Collection</span>
      </div>
      <h1 style={{fontSize:"clamp(4rem, 10vw, 7rem)",fontWeight:"800",lineHeight:"1",letterSpacing:"-0.03em",marginBottom:"2.5rem",textShadow:"0 10px 30px rgba(0,0,0,0.3)"}}>The New<br/>Essentials</h1>
      <a href="#shop" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"1.25rem 3.5rem",fontSize:"1.125rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",textDecoration:"none",borderRadius:"999px",transition:"all 0.3s",boxShadow:"0 10px 20px -5px color-mix(in srgb, var(--wp--preset--color--primary) 50%, transparent)"}}>Shop Collection</a>
    </div>
  </section>

  {/* Category Highlights */}
  <section style={{maxWidth:"90rem",margin:"0 auto",padding:"6rem 2rem",position:"relative"}}>
    <div style={{position:"absolute",top:"20%",left:"-10%",width:"400px",height:"400px",backgroundColor:"var(--wp--preset--color--secondary)",opacity:"0.1",filter:"blur(100px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"2.5rem",position:"relative",zIndex:"10"}}>
      <div style={{position:"relative",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",overflow:"hidden",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 20px 40px -15px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
        <img src="/images/templates/blog_nature.png" alt="Womens" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.7s ease"}} />
        <div style={{position:"absolute",bottom:"0",left:"0",width:"100%",padding:"2.5rem",background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent), transparent)",color:"var(--wp--preset--color--base)"}}>
          <h3 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1rem",letterSpacing:"-0.02em"}}>Women's</h3>
          <span style={{fontSize:"1rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",display:"inline-flex",alignItems:"center",gap:"0.5rem"}}>Shop Now <svg style={{width:"16px",height:"16px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span>
        </div>
      </div>
      <div style={{position:"relative",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",overflow:"hidden",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 20px 40px -15px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
        <img src="/images/templates/ecommerce_accessories.png" alt="Mens" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.7s ease"}} />
        <div style={{position:"absolute",bottom:"0",left:"0",width:"100%",padding:"2.5rem",background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent), transparent)",color:"var(--wp--preset--color--base)"}}>
          <h3 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1rem",letterSpacing:"-0.02em"}}>Men's</h3>
          <span style={{fontSize:"1rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",display:"inline-flex",alignItems:"center",gap:"0.5rem"}}>Shop Now <svg style={{width:"16px",height:"16px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span>
        </div>
      </div>
      <div style={{position:"relative",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",overflow:"hidden",borderRadius:"1.5rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",boxShadow:"0 20px 40px -15px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
        <img src="/images/templates/ecommerce_luxury_accessory.png" alt="Accessories" style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.7s ease"}} />
        <div style={{position:"absolute",bottom:"0",left:"0",width:"100%",padding:"2.5rem",background:"linear-gradient(to top, color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent), transparent)",color:"var(--wp--preset--color--base)"}}>
          <h3 style={{fontSize:"2.5rem",fontWeight:"800",marginBottom:"1rem",letterSpacing:"-0.02em"}}>Accessories</h3>
          <span style={{fontSize:"1rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",display:"inline-flex",alignItems:"center",gap:"0.5rem"}}>Shop Now <svg style={{width:"16px",height:"16px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></span>
        </div>
      </div>
    </div>
  </section>

  {/* New Arrivals Grid */}
  <section id="shop" style={{maxWidth:"90rem",margin:"0 auto",padding:"6rem 2rem",position:"relative"}}>
    <div style={{position:"absolute",top:"40%",right:"-5%",width:"500px",height:"500px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
    
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"4rem",position:"relative",zIndex:"10"}}>
      <div>
        <p style={{fontSize:"1rem",fontWeight:"700",color:"var(--wp--preset--color--primary)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Curated Picks</p>
        <h2 style={{fontSize:"3.5rem",fontWeight:"800",letterSpacing:"-0.03em",color:"var(--wp--preset--color--contrast)",lineHeight:"1"}}>New Arrivals</h2>
      </div>
      <a href="/shop" style={{fontSize:"1rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",textDecoration:"none",borderBottom:"2px solid var(--wp--preset--color--primary)",paddingBottom:"4px"}}>View All</a>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"4rem 2.5rem",position:"relative",zIndex:"10"}}>
      
      {[
        {name:"Cotton Overcoat", color:"Sand", price:"185", img:"/images/templates/ecommerce_overcoat.png"},
        {name:"Ribbed Knit Sweater", color:"Charcoal", price:"95", img:"/images/templates/ecommerce_sweater.png"},
        {name:"Relaxed Fit Trousers", color:"Black", price:"120", img:"/images/templates/ecommerce_trousers.png"},
        {name:"Canvas Tote Bag", color:"Natural", price:"45", img:"/images/templates/ecommerce_tote.png"}
      ].map((prod, i) => (
        <div key={i} style={{display:"flex",flexDirection:"column",cursor:"pointer"}}>
          <div style={{position:"relative",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",marginBottom:"1.5rem",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
            <img src={prod.img} alt={prod.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} />
            <div style={{position:"absolute",top:"1rem",right:"1rem",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",padding:"0.5rem",borderRadius:"50%",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
               <svg style={{width:"1.25rem",height:"1.25rem"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <div style={{position:"absolute",bottom:"1rem",left:"1rem",right:"1rem",opacity:0,transition:"opacity 0.2s"}}>
              <button style={{width:"100%",padding:"1.25rem",backgroundColor:"var(--wp--preset--color--contrast)",color:"var(--wp--preset--color--base)",border:"none",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem",borderRadius:"999px",cursor:"pointer",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>Add to Cart</button>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"0 0.5rem"}}>
            <div>
              <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",margin:"0 0 0.25rem 0"}}>{prod.name}</h3>
              <p style={{fontSize:"1rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",margin:0,fontWeight:"500"}}>{prod.color}</p>
            </div>
            <span style={{fontSize:"1.25rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)"}}>{"$"}{prod.price}</span>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* Feature Highlight */}
  <section style={{backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 95%, var(--wp--preset--color--base))",color:"var(--wp--preset--color--base)",padding:"10rem 2rem",textAlign:"center",position:"relative",overflow:"hidden",marginTop:"6rem"}}>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, color-mix(in srgb, var(--wp--preset--color--primary) 15%, transparent), transparent)",zIndex:0}}></div>
    <div style={{maxWidth:"48rem",margin:"0 auto",position:"relative",zIndex:10}}>
      <h2 style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800",color:"var(--wp--preset--color--base)",marginBottom:"2.5rem",letterSpacing:"-0.03em",lineHeight:"1.1"}}>Sustainable fabrics.<br/>Ethical production.</h2>
      <p style={{fontSize:"1.5rem",lineHeight:"1.6",color:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",marginBottom:"4rem",fontWeight:"400"}}>We believe in creating pieces that last a lifetime, leaving a minimal footprint on the planet. Every garment explores the intersection of utility and conscious design.</p>
      <a href="#sustainability" style={{display:"inline-flex",alignItems:"center",gap:"1rem",border:"1px solid color-mix(in srgb, var(--wp--preset--color--base) 30%, transparent)",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 10%, transparent)",padding:"1.25rem 3.5rem",fontSize:"1.125rem",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",textDecoration:"none",color:"var(--wp--preset--color--base)",borderRadius:"999px",transition:"all 0.2s",backdropFilter:"blur(12px)"}}>
        Read Our Manifesto
        <svg style={{width:"20px",height:"20px"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </a>
    </div>
  </section>
</main>
`;

export const ECOMMERCE_ABOUT_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"90rem",margin:"0 auto",minHeight:"80vh"}}>
  <h1 style={{fontSize:"clamp(4rem, 8vw, 6rem)",fontWeight:"800",letterSpacing:"-0.04em",marginBottom:"4rem",textAlign:"center"}}>Our <span style={{color:"var(--wp--preset--color--primary)",fontStyle:"italic"}}>Story</span></h1>
  <div style={{width:"100%",aspectRatio:"21/9",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",marginBottom:"6rem",borderRadius:"2rem",overflow:"hidden",boxShadow:"0 25px 50px -12px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
    <img src="/images/templates/portfolio_brand.png" alt="Workshop" style={{width:"100%",height:"100%",objectFit:"cover"}} />
  </div>
  <div style={{maxWidth:"48rem",margin:"0 auto",fontSize:"1.5rem",lineHeight:"1.8",color:"var(--wp--preset--color--contrast)"}}>
    <p style={{marginBottom:"2.5rem",fontWeight:"400",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent)"}}>Founded in 2026, <strong style={{color:"var(--wp--preset--color--contrast)",fontWeight:"800"}}>AURA.</strong> was born from a desire to create a wardrobe of uncompromising quality. We bypass traditional retail markups to bring you premium essentials directly.</p>
    <p style={{marginBottom:"2.5rem",fontWeight:"400",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 80%, transparent)"}}>Our process begins with sourcing the finest natural materials from historic mills. Every piece is constructed with an obsession over fit and durability, designed to outlast passing trends and fast fashion.</p>
  </div>
</main>
`;

export const ECOMMERCE_SHOP_JSX_SOURCE = `
<main style={{padding:"8rem 2rem",maxWidth:"90rem",margin:"0 auto",minHeight:"80vh"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"5rem",borderBottom:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)",paddingBottom:"2.5rem"}}>
    <div>
      <h1 style={{fontSize:"clamp(3.5rem, 6vw, 5rem)",fontWeight:"800",letterSpacing:"-0.03em",color:"var(--wp--preset--color--contrast)",marginBottom:"1rem"}}>All Products</h1>
      <p style={{fontSize:"1.25rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",fontWeight:"500"}}>Showing 24 results</p>
    </div>
    <div style={{display:"flex",gap:"1.5rem"}}>
      <select style={{padding:"1rem 1.5rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--base) 80%, transparent)",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 20%, transparent)",borderRadius:"999px",fontSize:"1rem",fontWeight:"600",color:"var(--wp--preset--color--contrast)",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--contrast) 10%, transparent)",outline:"none"}}>
        <option>Sort by: Featured</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
      </select>
    </div>
  </div>

  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))",gap:"4rem 2.5rem"}}>
    {[1,2,3,4,5,6,7,8].map(item => (
      <div key={item} style={{display:"flex",flexDirection:"column",cursor:"pointer"}}>
        <div style={{position:"relative",aspectRatio:"3/4",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 5%, transparent)",marginBottom:"1.5rem",borderRadius:"1rem",overflow:"hidden",border:"1px solid color-mix(in srgb, var(--wp--preset--color--contrast) 8%, transparent)",boxShadow:"0 10px 20px -10px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
          <img src="/images/templates/ecommerce_trousers.png" alt="Product" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          <div style={{position:"absolute",top:"1rem",right:"1rem",backgroundColor:"var(--wp--preset--color--base)",color:"var(--wp--preset--color--contrast)",padding:"0.5rem",borderRadius:"50%",boxShadow:"0 4px 6px -1px color-mix(in srgb, var(--wp--preset--color--contrast) 15%, transparent)"}}>
             <svg style={{width:"1.25rem",height:"1.25rem"}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <div style={{position:"absolute",bottom:"1rem",left:"1rem",right:"1rem",opacity:0,transition:"opacity 0.2s"}}>
            <button style={{width:"100%",padding:"1.25rem",backgroundColor:"color-mix(in srgb, var(--wp--preset--color--contrast) 95%, var(--wp--preset--color--base))",color:"var(--wp--preset--color--base)",border:"none",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.05em",fontSize:"0.875rem",borderRadius:"999px",cursor:"pointer",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--contrast) 30%, transparent)"}}>Add to Cart</button>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"0 0.5rem"}}>
          <div>
            <h3 style={{fontSize:"1.25rem",fontWeight:"700",color:"var(--wp--preset--color--contrast)",margin:"0 0 0.25rem 0"}}>Essential Item 0{item}</h3>
            <p style={{fontSize:"1rem",color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",margin:0,fontWeight:"500"}}>Various Colors</p>
          </div>
          <span style={{fontSize:"1.25rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)"}}>$120</span>
        </div>
      </div>
    ))}
  </div>
</main>
`;

export const ECOMMERCE_404_JSX_SOURCE = `
<main style={{height:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"600px",height:"600px",backgroundColor:"var(--wp--preset--color--primary)",opacity:"0.1",filter:"blur(120px)",borderRadius:"50%",pointerEvents:"none",zIndex:"0"}}></div>
  <div style={{position:"relative",zIndex:"10"}}>
    <h1 style={{fontSize:"clamp(8rem, 20vw, 12rem)",fontWeight:"900",lineHeight:"1",color:"var(--wp--preset--color--contrast)",letterSpacing:"-0.05em",marginBottom:"1rem"}}>404</h1>
    <h2 style={{fontSize:"3rem",fontWeight:"800",color:"var(--wp--preset--color--contrast)",marginBottom:"1.5rem",letterSpacing:"-0.02em"}}>Product not found</h2>
    <p style={{color:"color-mix(in srgb, var(--wp--preset--color--contrast) 60%, transparent)",marginBottom:"3.5rem",fontSize:"1.5rem"}}>The page or product you are looking for is no longer available.</p>
    <a href="/shop" style={{backgroundColor:"var(--wp--preset--color--primary)",color:"var(--wp--preset--color--base)",padding:"1.25rem 3.5rem",textTransform:"uppercase",letterSpacing:"0.05em",borderRadius:"999px",textDecoration:"none",fontWeight:"700",boxShadow:"0 10px 15px -3px color-mix(in srgb, var(--wp--preset--color--primary) 40%, transparent)"}}>Continue Shopping</a>
  </div>
</main>
`;
