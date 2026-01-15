# 링글 AI 영어학습 앱

AI 튜터와 영어 통화 연습하는 앱

**목표: 플레이스토어 출시**

---

## 1. 환경 설정

### Node.js 설치
https://nodejs.org 에서 LTS 버전 설치 (v18 이상)

```bash
node -v  # v18 이상인지 확인
```

### 프로젝트 클론
```bash
git clone https://github.com/1282saa/ringgle-front-test.git
cd ringgle-front-test
```

### 패키지 설치
```bash
npm install
```

---

## 2. 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 열기

### 모바일 테스트
크롬 개발자도구 (F12) → 모바일 뷰 (Ctrl+Shift+M)

---

## 3. 파일 구조

```
src/
├── pages/           ← 페이지 (여기서 작업!)
│   ├── Home.jsx         홈 화면
│   ├── Home.css         홈 스타일
│   ├── Call.jsx         AI 통화 화면
│   ├── Result.jsx       통화 결과
│   ├── Analysis.jsx     상세 분석
│   ├── Settings.jsx     설정
│   └── TutorSettings.jsx 튜터 선택
│
├── components/      ← 공통 컴포넌트
├── styles/          ← 공통 스타일
└── constants/       ← 상수 (튜터 목록 등)
```

---

## 4. 할 일

- [ ] 홈 화면 디자인 개선
- [ ] 통화 화면 UX 개선
- [ ] 결과/분석 화면 가독성 향상
- [ ] 로딩/에러 상태 디자인
- [ ] 전체 색상/폰트 통일

---

## 5. 작업 방법

### 브랜치 생성
```bash
git checkout -b feature/홈화면-개선
```

### 작업 후 커밋
```bash
git add .
git commit -m "홈 화면 버튼 스타일 수정"
```

### 푸시 & PR
```bash
git push origin feature/홈화면-개선
```
GitHub에서 Pull Request 생성

---

## 6. 디자인 가이드

### 색상
```
Primary:     #6366f1 (보라색)
Background:  #f7f7f8 (회색)
Text:        #1a1a1a
Text Gray:   #6b7280
```

### 스타일
- 모바일 퍼스트 (max-width: 480px)
- 버튼 border-radius: 12px
- 카드 border-radius: 16px

---

## 7. 주의사항

- `src/utils/api.js` 수정 X (백엔드 연동 코드)
- 모바일 뷰에서 항상 테스트
- PR 전 `npm run build` 확인

---

## 링크

- 웹 버전: https://d3pw62uy753kuv.cloudfront.net
- 플레이스토어: (출시 예정)
