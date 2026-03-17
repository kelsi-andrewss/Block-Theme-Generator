const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-black': 'bg-zinc-50 dark:bg-black',
  'text-white': 'text-zinc-900 dark:text-white',
  'bg-black/50': 'bg-white/80 dark:bg-black/50',
  'bg-white/5': 'bg-zinc-100 dark:bg-white/5',
  'bg-white/10': 'bg-zinc-200 dark:bg-white/10',
  'border-white/10': 'border-zinc-200 dark:border-white/10',
  'border-white/20': 'border-zinc-300 dark:border-white/20',
  'border-white/30': 'border-zinc-400 dark:border-white/30',
  'text-gray-300': 'text-zinc-700 dark:text-gray-300',
  'text-gray-400': 'text-zinc-600 dark:text-gray-400',
  'text-gray-500': 'text-zinc-500 dark:text-gray-500',
  'bg-white': 'bg-zinc-900 dark:bg-white',
  'text-black': 'text-white dark:text-black'
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx')) {
       let content = fs.readFileSync(full, 'utf8');
       
       // Match both normal string classes and template literal classes
       // e.g className="text-white"
       // or className={`flex ${isActive ? 'text-white' : 'text-gray-400'}`}
       // This simple script runs over all words that look like tailwind classes
       
       Object.entries(replacements).forEach(([oldCls, newCls]) => {
         // Escape slashes for regex
         const escapedOld = oldCls.replace(/\//g, '\\/');
         // Match the exact class string with boundaries. Because / isn't a word char, we use a custom boundary check.
         const regex = new RegExp(`(?<=['"\\s\`]|\\b)${escapedOld}(?=['"\\s\`]|\\b)`, 'g');
         content = content.replace(regex, newCls);
       });

       fs.writeFileSync(full, content);
    }
  }
}

try {
  walk(path.join(__dirname, '..', 'src', 'app', 'templates', 'portfolio'));
  console.log("Dark mode classes added.");
} catch(e) {
  console.error(e);
}
