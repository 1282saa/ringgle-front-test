import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const ICONS_DIR = './icons';

async function generateIcon() {
  mkdirSync(ICONS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 512, height: 512 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // App Icon HTML/CSS
  const iconHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          width: 512px;
          height: 512px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .icon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .phone-circle {
          width: 280px;
          height: 280px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .phone-icon {
          width: 120px;
          height: 120px;
          fill: white;
        }
        .speech-bubble {
          position: absolute;
          top: -20px;
          right: -20px;
          background: #22c55e;
          border-radius: 20px;
          padding: 15px 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 12px solid #22c55e;
        }
        .ai-text {
          color: white;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .title {
          margin-top: 30px;
          color: white;
          font-size: 48px;
          font-weight: 700;
          letter-spacing: 2px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div class="icon-container">
        <div class="phone-circle">
          <svg class="phone-icon" viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
          </svg>
          <div class="speech-bubble">
            <span class="ai-text">AI</span>
          </div>
        </div>
        <div class="title">ENG</div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(iconHTML);
  await page.waitForTimeout(500);

  // Save 512x512 icon
  await page.screenshot({ path: `${ICONS_DIR}/icon-512.png` });
  console.log('✅ Saved: icon-512.png (512x512)');

  // Generate different sizes for Android
  const sizes = [48, 72, 96, 144, 192];

  for (const size of sizes) {
    await context.close();
    const newContext = await browser.newContext({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    const newPage = await newContext.newPage();
    await newPage.setContent(iconHTML);
    await newPage.waitForTimeout(200);
    await newPage.screenshot({ path: `${ICONS_DIR}/icon-${size}.png` });
    console.log(`✅ Saved: icon-${size}.png (${size}x${size})`);
  }

  await browser.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ All icons saved to: ${ICONS_DIR}/`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

generateIcon().catch(console.error);
