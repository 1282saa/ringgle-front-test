# 프로젝트 구조 문서

## 개요

이 프로젝트는 **링글 AI 전화영어** 서비스를 클론한 MVP입니다.
React + Vite 기반의 프론트엔드와 AWS Lambda 서버리스 백엔드로 구성됩니다.

---

## 디렉토리 구조

```
eng-learning/
├── dist/                      # 빌드 결과물 (배포용)
├── ios/                       # iOS 네이티브 프로젝트 (Capacitor)
├── android/                   # Android 네이티브 프로젝트 (Capacitor)
├── src/
│   ├── components/            # 재사용 가능한 공통 컴포넌트
│   │   ├── index.js           # 컴포넌트 내보내기
│   │   ├── TutorAvatar.jsx    # 튜터 아바타 컴포넌트
│   │   └── BottomNav.jsx      # 하단 네비게이션 컴포넌트
│   │
│   ├── constants/             # 상수 및 설정 값
│   │   └── index.js           # 모든 상수 정의
│   │
│   ├── pages/                 # 페이지 컴포넌트
│   │   ├── Home.jsx           # 홈 화면 (메인)
│   │   ├── Settings.jsx       # 설정 화면
│   │   ├── Call.jsx           # 통화 화면
│   │   ├── Result.jsx         # 결과 화면
│   │   └── Analysis.jsx       # AI 분석 화면
│   │
│   ├── utils/                 # 유틸리티 함수
│   │   ├── api.js             # API 통신 함수
│   │   └── helpers.js         # 헬퍼 함수 모음
│   │
│   ├── App.jsx                # 라우팅 설정
│   ├── App.css                # 전역 스타일
│   ├── index.css              # 기본 스타일
│   └── main.jsx               # 앱 진입점
│
├── capacitor.config.json      # Capacitor 설정
├── package.json               # 의존성 관리
├── vite.config.js             # Vite 설정
└── STRUCTURE.md               # 이 문서
```

---

## 주요 파일 설명

### `/src/constants/index.js`

앱 전역에서 사용되는 상수들을 정의합니다.

| 상수명 | 설명 |
|--------|------|
| `API_URL` | AWS Lambda API 엔드포인트 |
| `STORAGE_KEYS` | 로컬스토리지 키 상수 |
| `ACCENTS` | 억양 옵션 (미국, 영국, 호주, 인도) |
| `GENDERS` | 성별 옵션 |
| `SPEEDS` | 말하기 속도 옵션 |
| `LEVELS` | 난이도 옵션 |
| `TOPICS` | 대화 주제 옵션 |
| `TUTOR_NAMES` | 튜터 이름 목록 |
| `DEFAULT_SETTINGS` | 기본 설정값 |
| `DEFAULT_ANALYSIS` | AI 분석 기본값 |
| `COLORS` | 테마 색상 |

### `/src/utils/helpers.js`

재사용 가능한 유틸리티 함수들입니다.

| 함수명 | 설명 |
|--------|------|
| `formatTime(seconds)` | 초를 MM:SS 형식으로 변환 |
| `getFromStorage(key, default)` | 로컬스토리지에서 안전하게 읽기 |
| `setToStorage(key, value)` | 로컬스토리지에 안전하게 저장 |
| `getTutorSettings()` | 튜터 설정 로드 |
| `saveTutorSettings(settings)` | 튜터 설정 저장 |
| `getCallHistory()` | 통화 기록 로드 |
| `addCallHistory(record)` | 통화 기록 추가 |
| `countWords(text)` | 단어 수 계산 |
| `getTutorName(settings)` | 설정에서 튜터 이름 추출 |

### `/src/utils/api.js`

AWS Lambda API와 통신하는 함수들입니다.

| 함수명 | 설명 |
|--------|------|
| `sendMessage(messages, settings)` | AI 채팅 메시지 전송 |
| `analyzeConversation(messages)` | 대화 내용 AI 분석 |
| `textToSpeech(text, settings)` | TTS (AWS Polly) |
| `playAudioBase64(audio, ref)` | Base64 오디오 재생 |
| `speakWithBrowserTTS(text, settings)` | 브라우저 TTS 폴백 |
| `speakText(text, settings, ref)` | TTS 통합 함수 (Polly + 폴백) |
| `speechToText(audioBlob, language)` | STT (AWS Transcribe) |

---

## 페이지별 기능

### Home.jsx (`/`)

- 홈 화면 (AI 전화 메인)
- 튜터 카드 표시
- "바로 전화하기" 버튼
- 통화 기록 탭

### Settings.jsx (`/settings`)

- 튜터 설정 화면
- 억양, 성별, 속도, 난이도, 주제 선택
- 설정 저장

### Call.jsx (`/call`)

- 실시간 음성 통화 화면
- Web Speech API로 음성 인식
- AWS Polly로 TTS 재생
- 통화 타이머

### Result.jsx (`/result`)

- 통화 종료 후 결과 화면
- 통계 (단어 수, 통화 시간)
- CAFP 분석 미리보기
- 피드백 모달

### Analysis.jsx (`/analysis`)

- 상세 AI 분석 화면
- 필러워드 분석
- 문법 오류 분석
- 단어 반복 분석

---

## 공통 컴포넌트

### TutorAvatar

튜터의 이니셜을 표시하는 원형 아바타

```jsx
// 사용 예시
<TutorAvatar name="Gwen" size="large" />
<TutorAvatar name="James" size="small" />
```

| Props | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| `name` | string | 필수 | 튜터 이름 |
| `size` | string | 'medium' | 크기 (small/medium/large) |
| `backgroundColor` | string | COLORS.purple | 배경색 |

### BottomNav

하단 6개 탭 네비게이션

```jsx
// 사용 예시
<BottomNav activeTab="ai-call" onTabChange={handleTab} />
```

| Props | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| `activeTab` | string | 'ai-call' | 활성 탭 ID |
| `onTabChange` | function | - | 탭 변경 콜백 |

---

## 데이터 흐름

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 음성 입력
       ▼
┌─────────────┐     ┌─────────────┐
│ Web Speech  │────▶│   Call.jsx  │
│    API      │     │  (state)    │
└─────────────┘     └──────┬──────┘
                           │ API 호출
                           ▼
                   ┌─────────────┐
                   │ AWS Lambda  │
                   │ (Bedrock)   │
                   └──────┬──────┘
                          │ AI 응답
                          ▼
                   ┌─────────────┐
                   │ AWS Polly   │
                   │   (TTS)     │
                   └──────┬──────┘
                          │ 오디오
                          ▼
                   ┌─────────────┐
                   │   User      │
                   │ (스피커)    │
                   └─────────────┘
```

---

## 로컬스토리지 구조

| 키 | 타입 | 설명 |
|----|------|------|
| `tutorSettings` | Object | 튜터 설정 |
| `callHistory` | Array | 통화 기록 (최대 10개) |
| `lastCallResult` | Object | 마지막 통화 결과 |
| `lastFeedback` | Object | 마지막 피드백 |

### tutorSettings 구조

```json
{
  "accent": "us",
  "gender": "female",
  "speed": "normal",
  "level": "intermediate",
  "topic": "business"
}
```

### callHistory 항목 구조

```json
{
  "date": "2024. 1. 15.",
  "fullDate": "2024. 1. 15. 오후 3:30:00",
  "duration": "05:30",
  "words": 150,
  "tutorName": "Gwen"
}
```

---

## 배포

### 웹 배포 (S3)

```bash
# 빌드
npm run build

# S3 동기화
aws s3 sync dist/ s3://eng-learning-app-1768214099 --delete
```

### 모바일 배포 (Capacitor)

```bash
# iOS 빌드
npx cap sync ios
npx cap open ios

# Android 빌드
npx cap sync android
npx cap open android
```

---

## 코드 컨벤션

### 파일 주석

모든 파일 상단에 JSDoc 스타일 주석 추가:

```javascript
/**
 * @file 파일명
 * @description 파일 설명
 */
```

### 함수 주석

공개 함수에는 JSDoc 주석 추가:

```javascript
/**
 * 함수 설명
 *
 * @param {type} paramName - 파라미터 설명
 * @returns {type} 반환값 설명
 */
```

### Import 순서

1. React 관련
2. 외부 라이브러리
3. 상수 (`../constants`)
4. 유틸리티 (`../utils/*`)
5. 컴포넌트 (`../components`)
6. 스타일

---

## 추후 개선 사항

- [ ] TypeScript 마이그레이션
- [ ] 상태 관리 라이브러리 도입 (Zustand/Jotai)
- [ ] CSS 모듈 또는 Tailwind 적용
- [ ] 테스트 코드 작성
- [ ] 에러 바운더리 추가
- [ ] PWA 지원
