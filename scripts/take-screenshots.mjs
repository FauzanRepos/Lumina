import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const baseDir = '/Users/mac/Developer/Lumina/External/Browser';

const viewports = {
  desktop: { width: 1440, height: 900, tasks: [
    { name: 'home.jpeg', url: 'http://localhost:3000/' },
    { name: 'home-testimoni.jpeg', url: 'http://localhost:3000/', action: 'open_testimonials' },
    { name: 'services.jpeg', url: 'http://localhost:3000/services' },
    { name: 'psychologists.jpeg', url: 'http://localhost:3000/psychologists' },
    { name: 'psychologists-info.jpeg', url: 'http://localhost:3000/psychologists/olaffiqih-wibowo' },
    { name: 'insights.jpeg', url: 'http://localhost:3000/insight' },
    { name: 'insight-article.jpeg', url: 'http://localhost:3000/insight/digital-boundaries' },
    { name: 'insight-author.jpeg', url: 'http://localhost:3000/insight/author/olaffiqih-wibowo-m-psi-psikolog' }
  ] },
  tablet: { width: 768, height: 1024, tasks: [
    { name: 'home.jpeg', url: 'http://localhost:3000/' },
    { name: 'home-testimoni.jpeg', url: 'http://localhost:3000/', action: 'open_testimonials' },
    { name: 'services.jpeg', url: 'http://localhost:3000/services' },
    { name: 'psychologists.jpeg', url: 'http://localhost:3000/psychologists' },
    { name: 'psychologists-info.jpeg', url: 'http://localhost:3000/psychologists/olaffiqih-wibowo' }
  ] },
  phone: { width: 375, height: 812, tasks: [
    { name: 'home.jpeg', url: 'http://localhost:3000/' },
    { name: 'home-testimoni.jpeg', url: 'http://localhost:3000/', action: 'open_testimonials' },
    { name: 'services.jpeg', url: 'http://localhost:3000/services' },
    { name: 'psychologists.jpeg', url: 'http://localhost:3000/psychologists' },
    { name: 'psychologists-info.jpeg', url: 'http://localhost:3000/psychologists/olaffiqih-wibowo' },
    { name: '_navigation.jpeg', url: 'http://localhost:3000/', action: 'open_navigation' }
  ] }
};

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Recreate base directory completely
  if (fs.existsSync(baseDir)) {
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
  fs.mkdirSync(baseDir, { recursive: true });

  console.log('Starting screenshot captures matching Figma structure...');

  for (const [vpName, vpConfig] of Object.entries(viewports)) {
    const dir = path.join(baseDir, vpName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Processing viewport: ${vpName} (${vpConfig.width}x${vpConfig.height})`);

    for (const task of vpConfig.tasks) {
      console.log(`  - Processing: ${task.name} from ${task.url}`);
      const page = await browser.newPage();
      await page.setViewport({
        width: vpConfig.width,
        height: vpConfig.height
      });

      try {
        await page.goto(task.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for GSAP transitions
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (task.action === 'open_testimonials') {
          console.log('    [Action] Opening testimonials modal...');
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => b.textContent.includes('Lihat Semua'));
            if (btn) btn.click();
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else if (task.action === 'open_navigation') {
          console.log('    [Action] Opening navigation drawer...');
          await page.evaluate(() => {
            const btn = document.querySelector('button[aria-label="Open navigation"]');
            if (btn) btn.click();
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const outputPath = path.join(dir, task.name);
        
        // home-testimoni and _navigation look best captured as standard viewports instead of full scrollable pages
        const isFullPage = !(task.action === 'open_testimonials' || task.action === 'open_navigation');

        await page.screenshot({
          path: outputPath,
          fullPage: isFullPage,
          type: 'jpeg',
          quality: 90
        });
        console.log(`    Saved: ${outputPath}`);
      } catch (err) {
        console.error(`    Error capturing ${task.name} on ${vpName}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
