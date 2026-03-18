const postcss = require('./node_modules/postcss');
const tailwindcss = require('./node_modules/tailwindcss');
const fs = require('fs');

const cssConfig = {
  content: ["./src/lib/generators/saas-template.ts"],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [],
};

const inputCss = `
@tailwind components;
@tailwind utilities;
`;

postcss([tailwindcss(cssConfig)])
  .process(inputCss, { from: undefined })
  .then(result => {
    fs.writeFileSync('/tmp/theme-compiled.css', result.css);
    console.log("Compiled CSS size: " + result.css.length);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
