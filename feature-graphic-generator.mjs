import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const ICONS_DIR = './icons';

async function generateFeatureGraphic() {
  mkdirSync(ICONS_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 500 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const featureHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          width: 1024px;
          height: 500px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 40%, #4f46e5 100%);
          font-family: 'Noto Sans KR', -apple-system, sans-serif;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        /* Background decoration */
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .bg-circle-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          right: -100px;
        }
        .bg-circle-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -50px;
        }
        .bg-circle-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 40%;
          transform: translateY(-50%);
        }

        /* Left content */
        .left-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 50px 60px;
          z-index: 10;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          margin-bottom: 20px;
          width: fit-content;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .badge-text {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .main-title {
          color: white;
          font-size: 52px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 16px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .main-title span {
          color: #fde047;
        }

        .sub-title {
          color: rgba(255,255,255,0.9);
          font-size: 22px;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 30px;
        }

        .features {
          display: flex;
          gap: 20px;
        }

        .feature-tag {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          padding: 10px 18px;
          border-radius: 25px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .feature-icon {
          font-size: 16px;
        }

        /* Right content - Phone mockup */
        .right-content {
          flex: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
        }

        .phone-mockup {
          width: 220px;
          height: 420px;
          background: #1a1a2e;
          border-radius: 30px;
          padding: 12px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4);
          position: relative;
          transform: rotate(-5deg);
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 40px;
          overflow: hidden;
        }

        .phone-notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 24px;
          background: #000;
          border-radius: 12px;
          z-index: 10;
        }

        .tutor-avatar {
          width: 70px;
          height: 70px;
          background: #8b5cf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .tutor-avatar span {
          color: white;
          font-size: 28px;
          font-weight: 700;
        }

        .tutor-name {
          color: white;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .call-time {
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          margin-bottom: 16px;
        }

        .speech-text {
          color: white;
          font-size: 12px;
          padding: 0 16px;
          text-align: left;
          line-height: 1.5;
        }

        .speech-translation {
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          padding: 0 16px;
          margin-top: 6px;
        }

        .phone-controls {
          position: absolute;
          bottom: 30px;
          display: flex;
          gap: 30px;
        }

        .control-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .end-call {
          background: #ef4444;
          width: 50px;
          height: 50px;
        }

        /* Floating elements */
        .float-element {
          position: absolute;
          background: white;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 20;
        }

        .float-score {
          top: 60px;
          right: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .score-circle {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .score-label {
          font-size: 12px;
          color: #6b7280;
        }

        .score-value {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .float-accent {
          bottom: 80px;
          right: 60px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .accent-flags {
          display: flex;
          gap: 4px;
          font-size: 18px;
        }

        .accent-text {
          font-size: 11px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <!-- Background circles -->
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>

      <!-- Left content -->
      <div class="left-content">
        <div class="badge">
          <div class="badge-dot"></div>
          <span class="badge-text">AI 영어 튜터</span>
        </div>

        <h1 class="main-title">
          언제 어디서나<br/>
          <span>원어민</span>과 영어회화
        </h1>

        <p class="sub-title">
          AI 튜터와 실시간 대화하고<br/>
          발음·문법·유창성 분석까지!
        </p>

        <div class="features">
          <div class="feature-tag">
            <span class="feature-icon">🎙️</span>
            실시간 음성 대화
          </div>
          <div class="feature-tag">
            <span class="feature-icon">📊</span>
            AI 분석 피드백
          </div>
          <div class="feature-tag">
            <span class="feature-icon">🌍</span>
            다양한 악센트
          </div>
        </div>
      </div>

      <!-- Right content -->
      <div class="right-content">
        <div class="phone-mockup">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <div class="tutor-avatar">
              <span>G</span>
            </div>
            <div class="tutor-name">Gwen</div>
            <div class="call-time">02:34</div>
            <div class="speech-text">
              Great job! Your pronunciation is getting better.
            </div>
            <div class="speech-translation">
              잘했어요! 발음이 점점 좋아지고 있어요.
            </div>
            <div class="phone-controls">
              <div class="control-btn" style="background: rgba(255,255,255,0.1);">
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </div>
              <div class="control-btn end-call">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating elements -->
        <div class="float-element float-score">
          <div class="score-circle">A+</div>
          <div>
            <div class="score-label">Fluency Score</div>
            <div class="score-value">92점</div>
          </div>
        </div>

        <div class="float-element float-accent">
          <div class="accent-flags">🇺🇸 🇬🇧 🇦🇺</div>
          <div class="accent-text">악센트 선택</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(featureHTML);
  await page.waitForTimeout(1000);

  await page.screenshot({ path: `${ICONS_DIR}/feature-graphic.png` });
  console.log('✅ Saved: feature-graphic.png (1024x500)');

  await browser.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✨ Feature graphic saved to: ${ICONS_DIR}/`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

generateFeatureGraphic().catch(console.error);
