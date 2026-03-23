import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('./src/app/templates');
const publicImagesDir = path.resolve('./public/images/templates');

// Create the public directory for these images
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Copy images from artifact directory to public
const artifactDir = '/Users/kelsiandrews/.gemini/antigravity/brain/21e08061-68a1-4019-8b61-cb64450bc25b/';
const images = fs.readdirSync(artifactDir).filter(f => f.endsWith('.png') && (
  f.startsWith('blog_') || f.startsWith('ecommerce_') || f.startsWith('local_') || f.startsWith('portfolio_') || f.startsWith('saas_')
));

// Find newest file for each prefix
const latestImages = {};
for (const file of images) {
  // Strip timestamp: e.g. blog_architecture_177...png -> blog_architecture
  const match = file.match(/^([a-z_]+)_\d+\.png$/);
  if (match) {
    const key = match[1];
    if (!latestImages[key] || fs.statSync(path.join(artifactDir, file)).mtime > fs.statSync(path.join(artifactDir, latestImages[key])).mtime) {
      latestImages[key] = file;
    }
  }
}

// Map from the generic "clean" name to the actual copied file path
const imageMap = {};
for (const [key, file] of Object.entries(latestImages)) {
  const src = path.join(artifactDir, file);
  const destName = `${key}.png`;
  const dest = path.join(publicImagesDir, destName);
  fs.copyFileSync(src, dest);
  imageMap[key] = `/images/templates/${destName}`;
}
console.log('Copied images:', Object.keys(imageMap).length);

// Dictionary of Unsplash URLs to our new local URLs
const replacements = {
  // E-commerce
  'https://images.unsplash.com/photo-1445205170230-053b83016050': imageMap['ecommerce_hero'],
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea': imageMap['ecommerce_overcoat'],
  'https://images.unsplash.com/photo-1588099768531-a72d4ba0cb32': imageMap['ecommerce_sweater'],
  'https://images.unsplash.com/photo-1544441893-675973e31985': imageMap['ecommerce_trousers'],
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d': imageMap['ecommerce_tote'],
  'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59': imageMap['ecommerce_accessories'],

  // Blog
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f': imageMap['blog_architecture'],
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32': imageMap['blog_camera'],
  'https://images.unsplash.com/photo-1497366216548-37526070297c': imageMap['blog_workspace'],
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f': imageMap['blog_nature'],
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f': imageMap['blog_books'],

  // Local Business
  'https://images.unsplash.com/photo-1542596594-649edbc13630': imageMap['local_hero'],
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12': imageMap['local_guarantee'],
  'https://images.unsplash.com/photo-1621905252472-886f4a860368': imageMap['local_exterior'],
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7': imageMap['local_interior'],
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e': imageMap['local_landscaping'],
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e': imageMap['local_hero'], // fallback

  // Portfolio
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71': imageMap['portfolio_3d'],
  'https://images.unsplash.com/photo-1618761714954-0b8cd0026356': imageMap['portfolio_digital'],
  'https://images.unsplash.com/photo-1558655146-d09347e92766': imageMap['portfolio_graphic'],
  'https://images.unsplash.com/photo-1600267175161-cfaa711b4a81': imageMap['portfolio_layout'],
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2': imageMap['portfolio_brand'],
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d': imageMap['portfolio_layout'], // fallback
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1': imageMap['portfolio_brand'], // fallback

  // SaaS
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330': imageMap['saas_testimonial'],
};

// Also catch any base url with ?... parameters and wipe the param part safely in a regex or just substring.
function replaceAll(content) {
  let newContent = content;
  // Replace direct matches
  for (const [unsplashUrl, localUrl] of Object.entries(replacements)) {
    if (!localUrl) continue;
    
    // We want to replace the full URL including any query parameters.
    // E.g., https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000...
    const regex = new RegExp(unsplashUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '[^"\\\'\\s]*', 'g');
    newContent = newContent.replace(regex, localUrl);
  }

  // Catch any remaining Unsplash URLs and default them to portfolio_3d or something generic
  const fallbackRegex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"'\s\)]*/g;
  newContent = newContent.replace(fallbackRegex, imageMap['portfolio_3d']);

  return newContent;
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('jsx-sources.ts')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const updated = replaceAll(original);
      if (original !== updated) {
        fs.writeFileSync(fullPath, updated);
        console.log(`Updated images in ${fullPath}`);
      }
    }
  }
}

processDir(baseDir);
console.log('Done replacement.');
