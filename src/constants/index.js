/**
 * @file constants/index.js
 * @description 앱 전역에서 사용되는 상수 정의
 *
 * 이 파일에는 다음과 같은 상수들이 포함됩니다:
 * - 튜터 설정 옵션 (억양, 성별, 속도, 난이도, 주제)
 * - 튜터 이름 목록
 * - API 엔드포인트
 * - 로컬스토리지 키
 * - 기본 설정값
 */

// ============================================
// API 설정
// ============================================

/**
 * AWS API Gateway 엔드포인트
 * @constant {string}
 */
export const API_URL = 'https://n4o7d3c14c.execute-api.us-east-1.amazonaws.com/prod/chat'

// ============================================
// 로컬스토리지 키
// ============================================

/**
 * 로컬스토리지에서 사용하는 키 상수
 * @constant {Object}
 */
export const STORAGE_KEYS = {
  TUTOR_SETTINGS: 'tutorSettings',      // 튜터 설정
  CALL_HISTORY: 'callHistory',          // 통화 기록
  LAST_CALL_RESULT: 'lastCallResult',   // 마지막 통화 결과
  LAST_FEEDBACK: 'lastFeedback',        // 마지막 피드백
}

// ============================================
// 튜터 설정 옵션
// ============================================

/**
 * 지원하는 억양 목록
 * @constant {Array<Object>}
 * @property {string} id - 억양 식별자
 * @property {string} label - 한글 라벨
 * @property {string} icon - 국기 이모지
 * @property {string} sublabel - 영문 라벨
 */
export const ACCENTS = [
  { id: 'us', label: '미국', icon: '🇺🇸', sublabel: 'American' },
  { id: 'uk', label: '영국', icon: '🇬🇧', sublabel: 'British' },
  { id: 'au', label: '호주', icon: '🇦🇺', sublabel: 'Australian' },
  { id: 'in', label: '인도', icon: '🇮🇳', sublabel: 'Indian' },
]

/**
 * 억양 ID를 한글 라벨로 변환하는 맵
 * @constant {Object}
 */
export const ACCENT_LABELS = {
  us: '미국',
  uk: '영국',
  au: '호주',
  in: '인도',
}

/**
 * 지원하는 성별 목록
 * @constant {Array<Object>}
 */
export const GENDERS = [
  { id: 'female', label: '여성', icon: '👩' },
  { id: 'male', label: '남성', icon: '👨' },
]

/**
 * 말하기 속도 옵션
 * @constant {Array<Object>}
 * @property {string} id - 속도 식별자
 * @property {string} label - 한글 라벨
 * @property {string} sublabel - 속도 배율
 * @property {number} rate - Web Speech API에서 사용할 속도 값
 */
export const SPEEDS = [
  { id: 'slow', label: '느리게', sublabel: '0.8x', rate: 0.8 },
  { id: 'normal', label: '보통', sublabel: '1.0x', rate: 1.0 },
  { id: 'fast', label: '빠르게', sublabel: '1.2x', rate: 1.2 },
]

/**
 * 난이도 옵션
 * @constant {Array<Object>}
 */
export const LEVELS = [
  { id: 'beginner', label: '초급', sublabel: 'Beginner' },
  { id: 'intermediate', label: '중급', sublabel: 'Intermediate' },
  { id: 'advanced', label: '고급', sublabel: 'Advanced' },
]

/**
 * 대화 주제 옵션
 * @constant {Array<Object>}
 */
export const TOPICS = [
  { id: 'business', label: '비즈니스', icon: '💼' },
  { id: 'daily', label: '일상 대화', icon: '💬' },
  { id: 'travel', label: '여행', icon: '✈️' },
  { id: 'interview', label: '면접', icon: '🎯' },
]

// ============================================
// 튜터 이름 목록
// ============================================

/**
 * 성별에 따른 튜터 이름 목록
 * @constant {Object}
 */
export const TUTOR_NAMES = {
  female: ['Gwen', 'Emma', 'Olivia', 'Sophia'],
  male: ['James', 'Liam', 'Noah', 'Oliver'],
}

/**
 * 튜터 성격 태그 (홈 화면에서 표시)
 * @constant {Array<string>}
 */
export const PERSONALITY_TAGS = ['밝은', '활기찬']

// ============================================
// 기본 설정값
// ============================================

/**
 * 튜터 설정 기본값
 * 새 사용자나 설정이 없을 때 사용
 * @constant {Object}
 */
export const DEFAULT_SETTINGS = {
  accent: 'us',
  gender: 'female',
  speed: 'normal',
  level: 'intermediate',
  topic: 'business',
}

/**
 * 통화 기록 최대 저장 개수
 * @constant {number}
 */
export const MAX_CALL_HISTORY = 10

// ============================================
// AI 분석 기본값
// ============================================

/**
 * AI 분석 실패 시 사용할 기본 분석 결과
 * @constant {Object}
 */
export const DEFAULT_ANALYSIS = {
  cafp_scores: {
    complexity: 70,
    accuracy: 75,
    fluency: 72,
    pronunciation: 78,
  },
  fillers: {
    count: 0,
    words: [],
    percentage: 0,
  },
  grammar_corrections: [],
  vocabulary: {
    total_words: 0,
    unique_words: 0,
    advanced_words: [],
    suggested_words: [],
  },
  overall_feedback: '대화를 완료하셨습니다!',
  improvement_tips: [],
}

// ============================================
// UI 관련 상수
// ============================================

/**
 * 하단 네비게이션 탭 정보
 * @constant {Array<Object>}
 */
export const BOTTOM_NAV_TABS = [
  { id: 'home', label: '홈', icon: 'HomeIcon' },
  { id: 'lesson', label: '1:1 수업', icon: 'Monitor' },
  { id: 'ai-tutor', label: 'AI 튜터', icon: 'Bot' },
  { id: 'ai-call', label: 'AI 전화', icon: 'Phone' },
  { id: 'achievement', label: '성취', icon: 'BarChart2' },
  { id: 'my', label: '마이링글', icon: 'User' },
]

/**
 * 테마 색상
 * @constant {Object}
 */
export const COLORS = {
  primary: '#5046e4',
  primaryDark: '#4338ca',
  purple: '#8b5cf6',
  purpleLight: '#ddd6fe',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
}
