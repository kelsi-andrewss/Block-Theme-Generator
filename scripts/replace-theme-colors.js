const fs = require('fs');
const path = require('path');

const replacements = {
  // Primary
  'bg-purple-500': 'bg-[var(--color-primary-500)]',
  'bg-purple-900/20': 'bg-[var(--color-primary-900)]/20',
  'bg-purple-900/40': 'bg-[var(--color-primary-900)]/40',
  'text-purple-400': 'text-[var(--color-primary-400)]',
  'text-purple-200': 'text-[var(--color-primary-200)]',
  'text-purple-500/50': 'text-[var(--color-primary-500)]/50',
  'from-purple-400': 'from-[var(--color-primary-400)]',
  'from-purple-900/40': 'from-[var(--color-primary-900)]/40',
  'ring-purple-500/50': 'ring-[var(--color-primary-500)]/50',
  'selection:bg-purple-500/30': 'selection:bg-[var(--color-primary-500)]/30',
  'selection:text-purple-200': 'selection:text-[var(--color-primary-200)]',
  'shadow-\\[0_0_10px_rgba\\(168,85,247,0\\.8\\)\\]': 'shadow-[0_0_10px_var(--color-primary-500)]',
  'shadow-\\[0_0_10px_var\\(--color-theme-primary-500\\)\\]': 'shadow-[0_0_10px_var(--color-primary-500)]',
  'group-hover:text-purple-400': 'group-hover:text-[var(--color-primary-400)]',

  // Secondary
  'bg-blue-500': 'bg-[var(--color-secondary-500)]',
  'bg-blue-900/20': 'bg-[var(--color-secondary-900)]/20',
  'bg-blue-900/40': 'bg-[var(--color-secondary-900)]/40',
  'bg-blue-500/10': 'bg-[var(--color-secondary-500)]/10',
  'text-blue-400': 'text-[var(--color-secondary-400)]',
  'text-blue-500': 'text-[var(--color-secondary-500)]',
  'to-blue-500': 'to-[var(--color-secondary-500)]',
  'to-blue-900/40': 'to-[var(--color-secondary-900)]/40',
  'shadow-\\[0_0_10px_rgba\\(59,130,246,0\\.8\\)\\]': 'shadow-[0_0_10px_var(--color-secondary-500)]',
  'shadow-\\[0_0_10px_var\\(--color-theme-secondary-500\\)\\]': 'shadow-[0_0_10px_var(--color-secondary-500)]'
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx')) {
       let content = fs.readFileSync(full, 'utf8');
       
       Object.entries(replacements).forEach(([oldCls, newCls]) => {
         // Because we messed up the regex on the first pass, we need to match the actual strings
         // Let's just use replaceAll for strings we know exist in the codebase.
         
         // Fix previous run artifacts if any:
         oldCls = oldCls.replace(/theme-/, ''); // remove any old theme- prefix
         
         const escapedOldCls = oldCls.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
         
         // Look for the literal string, either the original tailwind class or the bad theme- class from prev run
         const regexStrOrig = `(?<=[\\'\\"\\\\s\\\`]|\\\\b)${escapedOldCls}(?=[\\'\\"\\\\s\\\`]|\\\\b)`;
         // also match the bad replacement from the previous step which was theme-primary-X instead of purple-X
         const regexStrBad = `(?<=[\\'\\"\\\\s\\\`]|\\\\b)theme-${oldCls.replace('purple','primary').replace('blue','secondary')}(?=[\\'\\"\\\\s\\\`]|\\\\b)`;
         
         const regex = new RegExp(`(${regexStrOrig}|${regexStrBad})`, 'g');
         content = content.replace(regex, newCls);
       });

       fs.writeFileSync(full, content);
    }
  }
}

try {
  walk(path.join(__dirname, '..', 'src', 'app', 'templates', 'portfolio'));
  console.log("Colors updated to inline custom property brackets.");
} catch(e) {
  console.error(e);
}
