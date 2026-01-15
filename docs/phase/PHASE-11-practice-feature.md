# Phase 11: 핵심 표현 연습 (Practice Feature)

**작성일**: 2026-01-13
**상태**: 완료

---

## 개요

AI 분석에서 도출된 문법 교정 항목을 기반으로 사용자가 올바른 표현을 연습할 수 있는 기능 구현.
링글 원본 앱의 UI/UX를 100% 재현.

---

## 구현 내용

### 1. Practice.jsx 페이지 구현

**경로**: `src/pages/Practice.jsx`

#### Step 1: 설명 화면
- 교정된 문장 표시
- 한국어 번역 (AWS Translate)
- 설명 박스 (원본 → 교정 이유)
- X 버튼으로 닫기

#### Step 2: 따라 말하기
- 진행률 표시 바
- "문장 듣기" 버튼 (AWS Polly TTS)
- "내 발음 듣기" 버튼 (녹음 재생)
- 마이크 버튼 (녹음 시작/중지)
- 음성 인식 결과 표시

#### Step 3: 완료
- 성공 아이콘
- "잘했어요!" 메시지
- 다음 표현으로 이동 또는 완료

---

### 2. 데이터 흐름

```
Analysis 페이지 (문법 실수 모달)
    ↓
"핵심 표현 연습하기" 버튼 클릭
    ↓
navigate('/practice', { state: { corrections, callData } })
    ↓
Practice 페이지
    ↓
Step 1 → Step 2 → Step 3 → 다음 표현 반복
    ↓
모든 표현 완료 → localStorage에 히스토리 저장
```

---

### 3. 녹음 저장 구조

#### 프론트엔드
```javascript
// 녹음 완료 시
const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
setUserRecording(blob)

// 로컬 URL (즉시 재생용)
const localUrl = URL.createObjectURL(blob)
setUserRecordingUrl(localUrl)

// S3 업로드 (백그라운드)
const result = await uploadPracticeAudio(blob, sessionId, currentIndex)
```

#### 백엔드 (Lambda)
```python
def handle_upload_practice_audio(body):
    audio_data = base64.b64decode(body.get('audio', ''))
    s3_key = f"practice/{session_id}/{timestamp}_{practice_index}.webm"

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=s3_key,
        Body=audio_data,
        ContentType='audio/webm'
    )

    return {'audioUrl': f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"}
```

---

### 4. localStorage 히스토리 구조

```javascript
{
  id: "practice-1736771234567",
  sessionId: "session-uuid",
  completedAt: "2026-01-13T21:30:00+09:00",
  totalExpressions: 3,
  results: [
    {
      index: 0,
      original: "I go to school yesterday",
      corrected: "I went to school yesterday",
      userTranscript: "I went to school yesterday",
      audioUrl: "https://eng-learning-audio.s3.amazonaws.com/practice/...",
      timestamp: 1736771234567
    }
  ]
}
```

---

## 파일 변경 내역

### 신규 생성
없음 (기존 Practice.jsx 완전 재작성)

### 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/pages/Practice.jsx` | 링글 원본 UI 100% 재현, 3단계 플로우 구현 |
| `src/pages/Analysis.jsx` | "핵심 표현 연습하기" 버튼 추가 |
| `src/utils/api.js` | `uploadPracticeAudio`, `savePracticeResult` 함수 추가 |
| `backend/lambda_function.py` | `upload_practice_audio`, `save_practice_result` 핸들러 추가 |

---

## API 엔드포인트

### upload_practice_audio
사용자 녹음을 S3에 업로드

**Request:**
```json
{
  "action": "upload_practice_audio",
  "audio": "<base64 encoded audio>",
  "sessionId": "session-uuid",
  "practiceIndex": 0,
  "timestamp": 1736771234567
}
```

**Response:**
```json
{
  "success": true,
  "audioUrl": "https://eng-learning-audio.s3.amazonaws.com/practice/...",
  "audioKey": "practice/session-uuid/1736771234567_0.webm",
  "uploadedAt": "2026-01-13T21:30:00+09:00"
}
```

### save_practice_result
연습 결과 메타데이터를 DynamoDB에 저장

**Request:**
```json
{
  "action": "save_practice_result",
  "deviceId": "device-uuid",
  "sessionId": "session-uuid",
  "practiceData": {
    "totalExpressions": 3,
    "completedExpressions": 3,
    "results": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "practiceId": "PRACTICE#2026-01-13T21:30:00+09:00",
  "savedAt": "2026-01-13T21:30:00+09:00"
}
```

---

## UI 스크린샷 참조

### Step 1: 설명 화면
- 상단: X 버튼 (우측)
- 제목: "이 표현을 짧게 연습해볼게요."
- 문장 카드: 교정된 문장 + 한국어 번역
- 설명 박스: 파란색 배경, 교정 이유 설명
- 하단: "다음" 버튼

### Step 2: 따라 말하기
- 상단: ← 버튼 + 진행률 바
- 제목: "듣고 따라 말해보세요."
- 문장 카드: 교정된 문장 + 한국어 번역
- 액션 버튼: "문장 듣기" / "내 발음 듣기"
- 중앙: 마이크 버튼 (녹음)
- 하단: "다음" 버튼 (녹음 후 표시)

---

## 테스트

### 테스트 시나리오
1. 통화 완료 → AI 분석 → 문법 실수 카드 클릭
2. 문법 실수 모달에서 "핵심 표현 연습하기" 클릭
3. Step 1: 설명 확인 → "다음" 클릭
4. Step 2: "문장 듣기" → 마이크 녹음 → "내 발음 듣기" → "다음" 클릭
5. Step 3: 완료 확인 → 다음 표현 또는 종료

### 테스트 URL
```
https://d3pw62uy753kuv.cloudfront.net
```

---

## 관련 문서

- [Analysis 페이지 스펙](../FEATURE_SPECS.md)
- [API Reference](../API_REFERENCE.md)
- [AWS Infrastructure](../AWS_INFRASTRUCTURE.md)

---

## 완료 체크리스트

- [x] Practice.jsx 링글 원본 UI 100% 재현
- [x] Step 1: 설명 화면 구현
- [x] Step 2: 따라 말하기 구현
- [x] Step 3: 완료 화면 구현
- [x] Analysis → Practice 네비게이션 연결
- [x] AWS Translate 한국어 번역 통합
- [x] AWS Polly TTS "문장 듣기" 구현
- [x] MediaRecorder API 녹음 구현
- [x] "내 발음 듣기" 재생 구현
- [x] S3 녹음 업로드 Lambda 핸들러 추가
- [x] localStorage 히스토리 저장
- [x] 빌드 및 배포 완료
