import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('./src/app/templates');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // In layout.tsx: remove `, fontFamily: inter.style.fontFamily`
      content = content.replace(/,\s*fontFamily:\s*inter\.style\.fontFamily/g, '');
      
      // In jsx-sources.ts: remove `fontFamily:"..."` and `,fontFamily:"..."`
      // This will match `fontFamily:"something"` or `fontFamily:"something",` or `,fontFamily:"something"`
      content = content.replace(/,?fontFamily:"[^"]+",?/g, (match) => {
        if (match.startsWith(',') && match.endsWith(',')) return ',';
        return '';
      });

      fs.writeFileSync(fullPath, content);
      console.log(`Processed ${fullPath}`);
    }
  }
}

processDir(baseDir);
