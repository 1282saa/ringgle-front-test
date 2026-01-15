# 플레이스토어 출시 로드맵

## 현재 상태
- [x] 핵심 기능 완성 (AI 통화)
- [x] 백엔드 배포 완료
- [x] 웹 버전 배포 완료
- [ ] **UI 다듬기** ← 현재 단계
- [ ] 플레이스토어 출시

---

## Phase 1: 환경 세팅 (각자)

```bash
# 1. 레포 클론
git clone https://github.com/1282saa/ringgle-front-test.git
cd ringgle-front-test

# 2. 패키지 설치
npm install

# 3. 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173
```

완료 기준: 로컬에서 앱 실행 확인

---

## Phase 2: UI 개선 (분담 작업)

### 담당 배분 예시

| 담당 | 페이지 | 파일 |
|------|--------|------|
| A | 홈 화면 | `src/pages/Home.jsx`, `Home.css` |
| B | 통화 화면 | `src/pages/Call.jsx` |
| C | 결과/분석 | `src/pages/Result.jsx`, `Analysis.jsx` |
| D | 설정 | `src/pages/Settings.jsx`, `TutorSettings.jsx` |

### 체크리스트

#### 홈 화면
- [ ] 메인 버튼 디자인
- [ ] 카드 레이아웃
- [ ] 여백/정렬 정리

#### 통화 화면
- [ ] 통화 중 UI (마이크, 스피커 버튼)
- [ ] 자막 표시 영역
- [ ] 종료 버튼

#### 결과/분석 화면
- [ ] 점수 표시 디자인
- [ ] 피드백 카드
- [ ] 그래프/차트 (있다면)

#### 설정 화면
- [ ] 메뉴 리스트 스타일
- [ ] 튜터 선택 카드
- [ ] 옵션 버튼들

#### 공통
- [ ] 로딩 스피너
- [ ] 에러 화면
- [ ] 빈 상태 화면

---

## Phase 3: 테스트

### 웹 테스트
```bash
npm run dev
# 크롬 개발자도구 → 모바일 뷰
```

### 체크리스트
- [ ] 모든 버튼 클릭 가능
- [ ] 화면 전환 정상
- [ ] 텍스트 잘림 없음
- [ ] 스크롤 정상 동작

---

## Phase 4: 코드 합치기

### 작업 브랜치 생성
```bash
git checkout -b feature/홈화면-개선
```

### 커밋 & 푸시
```bash
git add .
git commit -m "홈 화면 버튼 스타일 개선"
git push origin feature/홈화면-개선
```

### PR 생성
GitHub에서 Pull Request 생성 → 리뷰 → Merge

---

## Phase 5: 최종 빌드 (리드)

```bash
# 빌드
npm run build

# Android 동기화
npx cap sync android

# APK 생성 (Android Studio 또는)
cd android && ./gradlew assembleRelease
```

---

## Phase 6: 플레이스토어 제출 (리드)

### 필요 자료
- [x] 앱 아이콘 (512x512)
- [x] 스크린샷 (최소 2장)
- [x] 기능 그래픽 (1024x500)
- [x] 앱 설명 (`STORE_LISTING.md` 참고)
- [x] 개인정보처리방침 (`PRIVACY_POLICY.md`)

### 제출 단계
1. Google Play Console 접속
2. 앱 만들기
3. 스토어 등록정보 입력
4. 앱 콘텐츠 설정
5. AAB/APK 업로드
6. 검토 요청

---

## 일정 (예시)

| 단계 | 기간 |
|------|------|
| Phase 1: 환경 세팅 | 1일 |
| Phase 2: UI 개선 | 3-5일 |
| Phase 3: 테스트 | 1일 |
| Phase 4: 코드 합치기 | 1일 |
| Phase 5: 빌드 | 1일 |
| Phase 6: 제출 | 1일 |
| **총** | **약 1-2주** |

---

## 질문/도움

프로젝트 리드에게 연락
