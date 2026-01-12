/**
 * @file pages/Settings.jsx
 * @description AI 튜터 설정 페이지
 *
 * 사용자가 AI 튜터의 다양한 옵션을 설정할 수 있는 화면입니다.
 *
 * 설정 가능 항목:
 * - 억양 (미국, 영국, 호주, 인도)
 * - 성별 (남성, 여성)
 * - 말하기 속도 (느리게, 보통, 빠르게)
 * - 난이도 (초급, 중급, 고급)
 * - 대화 주제 (비즈니스, 일상 대화, 여행, 면접)
 *
 * @route /settings
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'

// 상수 및 유틸리티 import
import {
  ACCENTS,
  GENDERS,
  SPEEDS,
  LEVELS,
  TOPICS,
  DEFAULT_SETTINGS,
} from '../constants'
import { getTutorSettings, saveTutorSettings } from '../utils/helpers'

/**
 * 설정 페이지 컴포넌트
 *
 * @returns {JSX.Element} 설정 페이지
 */
function Settings() {
  const navigate = useNavigate()

  // ============================================
  // State 정의
  // ============================================

  const [accent, setAccent] = useState(DEFAULT_SETTINGS.accent)
  const [gender, setGender] = useState(DEFAULT_SETTINGS.gender)
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed)
  const [level, setLevel] = useState(DEFAULT_SETTINGS.level)
  const [topic, setTopic] = useState(DEFAULT_SETTINGS.topic)

  // ============================================
  // Effects
  // ============================================

  /**
   * 컴포넌트 마운트 시 저장된 설정 로드
   */
  useEffect(() => {
    const saved = getTutorSettings()
    if (saved.accent) setAccent(saved.accent)
    if (saved.gender) setGender(saved.gender)
    if (saved.speed) setSpeed(saved.speed)
    if (saved.level) setLevel(saved.level)
    if (saved.topic) setTopic(saved.topic)
  }, [])

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * 설정 저장 후 홈으로 이동
   */
  const handleSave = () => {
    const settings = { accent, gender, speed, level, topic }
    saveTutorSettings(settings)
    navigate('/')
  }

  // ============================================
  // Render
  // ============================================

  return (
    <>
      {/* 헤더 - 뒤로가기 / 타이틀 / 저장 버튼 */}
      <header className="header">
        <div className="header-content">
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', padding: 0 }}
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={24} color="#374151" />
          </button>
          <span style={{ fontWeight: 600 }}>AI 튜터 설정</span>
          <button
            onClick={handleSave}
            style={{ background: 'none', padding: 0 }}
            aria-label="설정 저장"
          >
            <Check size={24} color="#6366f1" />
          </button>
        </div>
      </header>

      <div className="page">
        {/* 억양 선택 섹션 */}
        <OptionGroup
          label="억양 선택"
          options={ACCENTS}
          value={accent}
          onChange={setAccent}
          showIcon
          showSublabel
        />

        {/* 성별 선택 섹션 */}
        <OptionGroup
          label="성별"
          options={GENDERS}
          value={gender}
          onChange={setGender}
          showIcon
        />

        {/* 말하기 속도 섹션 */}
        <OptionGroup
          label="말하기 속도"
          options={SPEEDS}
          value={speed}
          onChange={setSpeed}
          showSublabel
          columns={3}
        />

        {/* 난이도 섹션 */}
        <OptionGroup
          label="난이도"
          options={LEVELS}
          value={level}
          onChange={setLevel}
          showSublabel
          columns={3}
        />

        {/* 대화 주제 섹션 */}
        <OptionGroup
          label="대화 주제"
          options={TOPICS}
          value={topic}
          onChange={setTopic}
          showIcon
        />

        {/* 저장 버튼 */}
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleSave}
        >
          저장하기
        </button>
      </div>
    </>
  )
}

// ============================================
// 서브 컴포넌트
// ============================================

/**
 * 옵션 그룹 컴포넌트
 * 설정 항목의 선택 UI를 렌더링
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.label - 그룹 라벨
 * @param {Array} props.options - 선택 옵션 배열
 * @param {string} props.value - 현재 선택된 값
 * @param {Function} props.onChange - 값 변경 핸들러
 * @param {boolean} [props.showIcon=false] - 아이콘 표시 여부
 * @param {boolean} [props.showSublabel=false] - 서브라벨 표시 여부
 * @param {number} [props.columns] - 그리드 컬럼 수
 */
function OptionGroup({
  label,
  options,
  value,
  onChange,
  showIcon = false,
  showSublabel = false,
  columns,
}) {
  // 그리드 클래스 결정
  const gridClass = columns ? `option-grid cols-${columns}` : 'option-grid'

  return (
    <div className="option-group">
      <label className="option-label">{label}</label>
      <div className={gridClass}>
        {options.map((item) => (
          <div
            key={item.id}
            className={`option-item ${value === item.id ? 'selected' : ''}`}
            onClick={() => onChange(item.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onChange(item.id)}
          >
            {/* 아이콘 (있는 경우) */}
            {showIcon && item.icon && (
              <div className="icon">{item.icon}</div>
            )}
            {/* 메인 라벨 */}
            <div className="label">{item.label}</div>
            {/* 서브 라벨 (있는 경우) */}
            {showSublabel && item.sublabel && (
              <div className="sublabel">{item.sublabel}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings
