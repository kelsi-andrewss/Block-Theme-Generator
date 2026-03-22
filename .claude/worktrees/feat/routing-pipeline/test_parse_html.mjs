import { parse } from '@babel/parser';

const html = `<h1 data-uid="h1-2-1" style="color: red; fontSize:clamp(3rem, 6vw, 4.5rem);fontWeight:800;lineHeight:1.1;marginBottom:2rem;maxWidth:1024px;marginLeft:auto;marginRight:auto;">Build faster with our <br><span style="">advanced platform</span></h1>`;

function sanitizeHtmlToJsx(htmlStr) {
  let jsx = htmlStr;
  const voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
  for (const tag of voidTags) {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  }
  return jsx;
}

try {
  console.log("Parsing original...");
  parse(html, { sourceType: 'module', plugins: ['jsx', 'typescript'], tokens: true });
  console.log("Original parsed successfully!");
} catch (e) {
  console.error("Original failed:", e.message);
  console.log("Parsing sanitized...");
  const clean = sanitizeHtmlToJsx(html);
  console.log("Sanitized HTML:", clean);
  parse(clean, { sourceType: 'module', plugins: ['jsx', 'typescript'], tokens: true });
  console.log("Sanitized parsed successfully!");
}
