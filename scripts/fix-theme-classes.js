const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
       let content = fs.readFileSync(full, 'utf8');
       
       // Example text-theme-primary-400  -> text-[var(--color-primary-400)]
       //     bg-theme-secondary-900/40 -> bg-[var(--color-secondary-900)]/40
       
       content = content.replace(/([a-z-]+)-theme-(primary|secondary)-(\d{3})(?:\/(\d+))?/g, (match, prefix, type, weight, opacity) => {
         let result = `${prefix}-[var(--color-${type}-${weight})]`;
         if (opacity) {
           result += `/${opacity}`;
         }
         return result;
       });

       fs.writeFileSync(full, content);
    }
  }
}

try {
  walk(path.join(__dirname, '..', 'src', 'app', 'templates', 'portfolio'));
  console.log("Fixed theme classes in components.");
} catch(e) {
  console.error(e);
}
