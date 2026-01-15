import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const SCREENSHOTS_DIR = './screenshots';
const VIEWPORT = { width: 1080, height: 1920 };

async function captureScreenshots() {
  // Create screenshots directory
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('📸 Starting screenshot capture...\n');

  // 1. Home Screen
  console.log('1. Capturing Home screen...');
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01_home.png` });
  console.log('   ✅ Saved: 01_home.png\n');

  // 2. Settings Screen
  console.log('2. Capturing Settings screen...');
  await page.goto('http://localhost:5173/settings');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/02_settings.png` });
  console.log('   ✅ Saved: 02_settings.png\n');

  // 3. Call Screen (without actual call - just UI)
  console.log('3. Capturing Call screen...');
  await page.goto('http://localhost:5173/call');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/03_call.png` });
  console.log('   ✅ Saved: 03_call.png\n');

  // 4. Check if there's a result or analysis page
  console.log('4. Capturing Result screen...');
  await page.goto('http://localhost:5173/result');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/04_result.png` });
  console.log('   ✅ Saved: 04_result.png\n');

  // 5. Analysis screen
  console.log('5. Capturing Analysis screen...');
  await page.goto('http://localhost:5173/analysis');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/05_analysis.png` });
  console.log('   ✅ Saved: 05_analysis.png\n');

  await browser.close();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ All screenshots saved to: ${SCREENSHOTS_DIR}/`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

captureScreenshots().catch(console.error);
