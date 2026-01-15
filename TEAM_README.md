# 링글 AI 영어학습 앱 - 팀 협업 가이드

## 목표
**플레이스토어 출시** (빠르게!)

## 현재 상태
- 웹/앱 동작: https://d3pw62uy753kuv.cloudfront.net
- 핵심 기능 (AI 통화) 완성
- UI 다듬기 필요

---

## 시작하기

### 1. 환경 설정
```bash
# Node.js 18+ 필요 (https://nodejs.org)
node -v  # v18 이상인지 확인

# 프로젝트 클론
git clone https://github.com/1282saa/ringgle-front-test.git
cd ringgle-front-test

# 패키지 설치
npm install
```

### 2. 실행
```bash
npm run dev
# 브라우저에서 http://localhost:5173 열기
```

### 3. 모바일 테스트
크롬 개발자도구 (F12) → 모바일 뷰 (Ctrl+Shift+M)

---

## 파일 구조 (UI 작업용)

```
src/
├── pages/          ← 페이지 컴포넌트 (여기서 작업!)
│   ├── Home.jsx        홈 화면
│   ├── Home.css        홈 스타일
│   ├── Call.jsx        통화 화면
│   ├── Result.jsx      결과 화면
│   ├── Analysis.jsx    분석 화면
│   ├── Settings.jsx    설정 화면
│   └── TutorSettings.jsx  튜터 선택
│
├── components/     ← 재사용 컴포넌트
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── LoadingSpinner.jsx
│
├── styles/         ← 공통 스타일
│   ├── common.css
│   └── variables.css
│
└── constants/      ← 상수 (튜터 목록, 난이도 등)
    └── index.js
```

---

## 할 일 (UI 중심)

### 필수
- [ ] 홈 화면 디자인 개선
- [ ] 통화 화면 UX 개선
- [ ] 결과/분석 화면 가독성 향상
- [ ] 전체 색상/폰트 통일

### 권장
- [ ] 로딩 애니메이션 추가
- [ ] 에러 화면 디자인
- [ ] 온보딩 화면 (첫 실행)

---

## 작업 방법

### 1. 브랜치 생성
```bash
git checkout -b feature/홈화면-개선
```

### 2. 작업 후 커밋
```bash
git add .
git commit -m "홈 화면 버튼 스타일 수정"
```

### 3. 푸시 & PR
```bash
git push origin feature/홈화면-개선
# GitHub에서 Pull Request 생성
```

---

## 디자인 참고

### 색상
```css
--primary: #6366f1;      /* 보라색 (메인) */
--primary-dark: #4f46e5;
--background: #f7f7f8;   /* 회색 배경 */
--text: #1a1a1a;
--text-gray: #6b7280;
```

### 폰트
- 기본: system-ui (시스템 기본 폰트)
- 모바일 최적화된 크기 사용

---

## 문의
문영광 (프로젝트 리드)
