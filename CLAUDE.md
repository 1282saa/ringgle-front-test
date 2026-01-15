# 링글 AI 영어학습 앱

## 목표
**플레이스토어 출시** - UI 다듬기 작업 진행 중

전체 로드맵: ROADMAP.md 참고

## 기술 스택
- React 19 + Vite 7
- Capacitor (Android 앱)
- CSS (styled-jsx 방식)

## 실행 방법
```bash
npm install
npm run dev
# http://localhost:5173 에서 확인
```

## 프로젝트 구조

```
src/
├── pages/           # 페이지 (UI 작업 여기서!)
│   ├── Home.jsx         홈 화면
│   ├── Home.css         홈 스타일
│   ├── Call.jsx         AI 통화 화면
│   ├── Result.jsx       통화 결과
│   ├── Analysis.jsx     상세 분석
│   ├── Settings.jsx     설정
│   └── TutorSettings.jsx 튜터 선택
│
├── components/      # 공통 컴포넌트
├── styles/          # 공통 스타일
└── constants/       # 상수 (튜터 목록 등)
```

## 디자인 가이드

### 색상
- Primary: #6366f1 (보라색)
- Background: #f7f7f8
- Text: #1a1a1a
- Text Gray: #6b7280

### 스타일 규칙
- 모바일 퍼스트 (max-width: 480px)
- 버튼 border-radius: 12px
- 카드 border-radius: 16px
- 기본 padding: 16px ~ 20px

## 현재 할 일

### UI 개선
- 홈 화면 디자인 개선
- 통화 화면 UX 개선
- 결과/분석 화면 가독성 향상
- 로딩/에러 상태 디자인

### 주의사항
- 백엔드 코드 수정 X (API는 이미 동작 중)
- src/utils/api.js 수정 X
- 모바일 뷰에서 항상 테스트

## 테스트
- 웹: http://localhost:5173
- 배포된 버전: https://d3pw62uy753kuv.cloudfront.net
