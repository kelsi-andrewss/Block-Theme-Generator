import { applyAstMutation } from './src/lib/transpiler/ast-mutator';

const source = `
<h1 data-uid="h1-2-1" style={{fontSize:"clamp(3rem, 6vw, 4.5rem)",fontWeight:"800"}}>
  {"Build faster with our <br><span style=\\"background: linear-gradient(to right, var(--wp--preset--color--primary), var(--wp--preset--color--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;\\">advanced platform</span>"}
</h1>
`;

const edits = [
  { kind: 'style', uid: 'h1-2-1', styles: { color: 'red' } }
];

console.log(applyAstMutation(source, edits as any));
