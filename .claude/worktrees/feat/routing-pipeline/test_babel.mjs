import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
const traverse = _traverse.default;
import * as t from '@babel/types';
import * as recast from 'recast';

const source = `
<h1 data-uid="h1-2-1" style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800",lineHeight:"1.1",marginBottom:"2rem",maxWidth:"1024px",marginLeft:"auto",marginRight:"auto"}}>{"Build faster with our <br><span style=\\"background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\\">advanced platform</span>"}</h1>
`;

const newHtml = `
<h1 data-uid="h1-2-1" style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800",lineHeight:"1.1",marginBottom:"2rem",maxWidth:"1024px",marginLeft:"auto",marginRight:"auto",color:"red"}}>{"Build faster with our <br><span style=\\"color: red\\">advanced platform</span>"}</h1>
`;

const ast = recast.parse(source, {
  parser: {
    parse(src) {
      return parse(src, { sourceType: 'module', plugins: ['jsx', 'typescript'], tokens: true });
    }
  }
});

let elementPath;
traverse(ast, {
  JSXOpeningElement(path) {
    if (path.node.attributes.some(a => a.name?.name === 'data-uid' && a.value.value === 'h1-2-1')) {
      elementPath = path.parentPath;
    }
  }
});

const fragmentAst = recast.parse(newHtml, {
  parser: {
    parse(src) {
      return parse(src, { sourceType: 'module', plugins: ['jsx', 'typescript'], tokens: true });
    }
  }
});

elementPath.replaceWith(fragmentAst.program.body[0].expression);

console.log("RECAST OUTPUT:");
console.log(recast.print(ast).code);
