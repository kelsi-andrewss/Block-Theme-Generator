const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARCHETYPES = [
  "saas", "portfolio", "blog", "restaurant", 
  "ecommerce", "agency", "magazine", "creative"
];

async function captureThumbnails() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  for (const id of ARCHETYPES) {
    console.log(`\nCapturing thumbnail for ${id}...`);
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

      // Click the Template Gallery tab
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const galleryBtn = buttons.find(b => b.textContent?.includes('Template Gallery'));
        if (galleryBtn) galleryBtn.click();
      });

      // Wait for gallery to render
      await page.waitForTimeout(500);

      // Click the specific archetype card
      await page.evaluate((archetypeId) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        // Find the button whose interior has the Image representing this archetype
        // We know they are ordered matching ARCHETYPES or have the title text
        // As a fallback, we can just click the nth card.
        const card = buttons.find(b => {
          const img = b.querySelector('img');
          return img && img.src.includes(archetypeId);
        });
        if (card) {
          card.click();
        } else {
          console.log("Could not find card specifically by img src, clicking by index...");
          // Fallback if image src doesn't match yet
          const archNames = {
            "saas": "SaaS Platform",
            "portfolio": "Creative Portfolio",
            "blog": "Lifestyle Blog",
            "restaurant": "Restaurant & Cafe",
            "ecommerce": "Boutique Store",
            "agency": "Digital Agency",
            "magazine": "News Magazine",
            "creative": "Creative Studio"
          };
          const titleBtn = buttons.find(b => b.textContent?.includes(archNames[archetypeId]));
          if (titleBtn) titleBtn.click();
        }
      }, id);

      // Wait for Result screen to load
      console.log(`Waiting for WP Playground to boot for ${id}...`);
      
      // The iframe has class "w-full h-[600px]"
      await page.waitForSelector('iframe.w-full', { timeout: 30000 });
      
      // Let WP Playground boot (takes approx 10s)
      await page.waitForTimeout(15000); 

      // Get the iframe element handle and take a screenshot of JUST the iframe
      const iframeElement = await page.$('iframe.w-full');
      if (iframeElement) {
        const dest = path.join(__dirname, '..', 'public', 'thumbnails', `${id}.png`);
        await iframeElement.screenshot({ path: dest });
        console.log(`✅ Saved ${dest}`);
      } else {
        console.error(`❌ Could not find iframe for ${id}`);
      }

    } catch (err) {
      console.error(`Failed to capture ${id}:`, err);
    }
  }

  await browser.close();
  console.log("All thumbnails captured!");
}

captureThumbnails();
