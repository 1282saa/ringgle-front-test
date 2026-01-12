import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'

const ACCENTS = [
  { id: 'us', label: '미국', icon: '🇺🇸', sublabel: 'American' },
  { id: 'uk', label: '영국', icon: '🇬🇧', sublabel: 'British' },
  { id: 'au', label: '호주', icon: '🇦🇺', sublabel: 'Australian' },
  { id: 'in', label: '인도', icon: '🇮🇳', sublabel: 'Indian' },
]

const GENDERS = [
  { id: 'female', label: '여성', icon: '👩' },
  { id: 'male', label: '남성', icon: '👨' },
]

const SPEEDS = [
  { id: 'slow', label: '느리게', sublabel: '0.8x' },
  { id: 'normal', label: '보통', sublabel: '1.0x' },
  { id: 'fast', label: '빠르게', sublabel: '1.2x' },
]

const LEVELS = [
  { id: 'beginner', label: '초급', sublabel: 'Beginner' },
  { id: 'intermediate', label: '중급', sublabel: 'Intermediate' },
  { id: 'advanced', label: '고급', sublabel: 'Advanced' },
]

const TOPICS = [
  { id: 'business', label: '비즈니스', icon: '💼' },
  { id: 'daily', label: '일상 대화', icon: '💬' },
  { id: 'travel', label: '여행', icon: '✈️' },
  { id: 'interview', label: '면접', icon: '🎯' },
]

function Settings() {
  const navigate = useNavigate()

  const [accent, setAccent] = useState('us')
  const [gender, setGender] = useState('female')
  const [speed, setSpeed] = useState('normal')
  const [level, setLevel] = useState('intermediate')
  const [topic, setTopic] = useState('business')

  // 저장된 설정 로드
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tutorSettings') || '{}')
    if (saved.accent) setAccent(saved.accent)
    if (saved.gender) setGender(saved.gender)
    if (saved.speed) setSpeed(saved.speed)
    if (saved.level) setLevel(saved.level)
    if (saved.topic) setTopic(saved.topic)
  }, [])

  const handleSave = () => {
    const settings = { accent, gender, speed, level, topic }
    localStorage.setItem('tutorSettings', JSON.stringify(settings))
    navigate('/')
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} style={{ background: 'none', padding: 0 }}>
            <ArrowLeft size={24} color="#374151" />
          </button>
          <span style={{ fontWeight: 600 }}>AI 튜터 설정</span>
          <button onClick={handleSave} style={{ background: 'none', padding: 0 }}>
            <Check size={24} color="#6366f1" />
          </button>
        </div>
      </header>

      <div className="page">
        {/* Accent */}
        <div className="option-group">
          <label className="option-label">억양 선택</label>
          <div className="option-grid">
            {ACCENTS.map(item => (
              <div
                key={item.id}
                className={`option-item ${accent === item.id ? 'selected' : ''}`}
                onClick={() => setAccent(item.id)}
              >
                <div className="icon">{item.icon}</div>
                <div className="label">{item.label}</div>
                <div className="sublabel">{item.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="option-group">
          <label className="option-label">성별</label>
          <div className="option-grid">
            {GENDERS.map(item => (
              <div
                key={item.id}
                className={`option-item ${gender === item.id ? 'selected' : ''}`}
                onClick={() => setGender(item.id)}
              >
                <div className="icon">{item.icon}</div>
                <div className="label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div className="option-group">
          <label className="option-label">말하기 속도</label>
          <div className="option-grid cols-3">
            {SPEEDS.map(item => (
              <div
                key={item.id}
                className={`option-item ${speed === item.id ? 'selected' : ''}`}
                onClick={() => setSpeed(item.id)}
              >
                <div className="label">{item.label}</div>
                <div className="sublabel">{item.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="option-group">
          <label className="option-label">난이도</label>
          <div className="option-grid cols-3">
            {LEVELS.map(item => (
              <div
                key={item.id}
                className={`option-item ${level === item.id ? 'selected' : ''}`}
                onClick={() => setLevel(item.id)}
              >
                <div className="label">{item.label}</div>
                <div className="sublabel">{item.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div className="option-group">
          <label className="option-label">대화 주제</label>
          <div className="option-grid">
            {TOPICS.map(item => (
              <div
                key={item.id}
                className={`option-item ${topic === item.id ? 'selected' : ''}`}
                onClick={() => setTopic(item.id)}
              >
                <div className="icon">{item.icon}</div>
                <div className="label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </>
  )
}

export default Settings
