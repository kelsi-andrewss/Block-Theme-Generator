const fs = require('fs');
const path = require('path');

const THEMES = [
  { id: "default", primary: { 400: "#c084fc", 500: "#a855f7", 700: "#7e22ce", 900: "#581c87" }, secondary: { 400: "#60a5fa", 500: "#3b82f6", 700: "#1d4ed8", 900: "#1e3a8a" } },
  { id: "sunset", primary: { 400: "#fb923c", 500: "#f97316", 700: "#c2410c", 900: "#7c2d12" }, secondary: { 400: "#fb7185", 500: "#f43f5e", 700: "#be123c", 900: "#881337" } },
  { id: "forest", primary: { 400: "#34d399", 500: "#10b981", 700: "#047857", 900: "#064e3b" }, secondary: { 400: "#2dd4bf", 500: "#14b8a6", 700: "#0f766e", 900: "#134e4a" } },
  { id: "ocean", primary: { 400: "#22d3ee", 500: "#06b6d4", 700: "#0e7490", 900: "#164e63" }, secondary: { 400: "#60a5fa", 500: "#3b82f6", 700: "#1d4ed8", 900: "#1e3a8a" } },
  { id: "cherry", primary: { 400: "#f472b6", 500: "#ec4899", 700: "#be185d", 900: "#831843" }, secondary: { 400: "#f87171", 500: "#ef4444", 700: "#b91c1c", 900: "#7f1d1d" } },
  { id: "midnight", primary: { 400: "#818cf8", 500: "#6366f1", 700: "#4338ca", 900: "#312e81" }, secondary: { 400: "#94a3b8", 500: "#64748b", 700: "#334155", 900: "#0f172a" } },
];

let css = '\n/* --- DYNAMIC TEMPLATE THEMES --- */\n';

THEMES.forEach(t => {
  // Light mode mappings
  css += `[data-theme="${t.id}"] {\n`;
  css += `  --color-primary-400: ${t.primary[700]};\n`;
  css += `  --color-primary-500: ${t.primary[700]};\n`;
  css += `  --color-primary-900: ${t.primary[900]};\n`;
  css += `  --color-secondary-400: ${t.secondary[700]};\n`;
  css += `  --color-secondary-500: ${t.secondary[700]};\n`;
  css += `  --color-secondary-900: ${t.secondary[900]};\n`;
  css += `}\n`;
  
  // Dark mode mappings
  css += `.dark[data-theme="${t.id}"] {\n`;
  css += `  --color-primary-400: ${t.primary[400]};\n`;
  css += `  --color-primary-500: ${t.primary[500]};\n`;
  css += `  --color-primary-900: ${t.primary[900]};\n`;
  css += `  --color-secondary-400: ${t.secondary[400]};\n`;
  css += `  --color-secondary-500: ${t.secondary[500]};\n`;
  css += `  --color-secondary-900: ${t.secondary[900]};\n`;
  css += `}\n`;
});

const globalsPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
fs.appendFileSync(globalsPath, css);
console.log('Appended dynamic themes to globals.css');
