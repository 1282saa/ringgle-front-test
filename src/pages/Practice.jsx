import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Volume2, Mic, MicOff, Check, X, RefreshCw, ChevronRight } from 'lucide-react'
import { textToSpeech, playAudioBase64 } from '../utils/api'

function Practice() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userTranscript, setUserTranscript] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [practiceComplete, setPracticeComplete] = useState(false)
  const [scores, setScores] = useState([])

  const recognitionRef = useRef(null)
  const settings = JSON.parse(localStorage.getItem('tutorSettings') || '{}')

  // 연습할 표현들 (실제로는 API에서 가져옴)
  const [expressions] = useState([
    {
      id: 1,
      original: "I go to school yesterday.",
      corrected: "I went to school yesterday.",
      korean: "나는 어제 학교에 갔다.",
      tip: "과거 시제를 나타낼 때 'go'의 과거형 'went'를 사용합니다."
    },
    {
      id: 2,
      original: "She don't like coffee.",
      corrected: "She doesn't like coffee.",
      korean: "그녀는 커피를 좋아하지 않는다.",
      tip: "3인칭 단수 주어(She, He, It)와 함께는 'doesn't'를 사용합니다."
    },
    {
      id: 3,
      original: "I have been to there before.",
      corrected: "I have been there before.",
      korean: "나는 전에 거기에 가본 적이 있다.",
      tip: "'there'는 부사이므로 전치사 'to'가 필요없습니다."
    },
    {
      id: 4,
      original: "He is more taller than me.",
      corrected: "He is taller than me.",
      korean: "그는 나보다 키가 크다.",
      tip: "'taller'는 이미 비교급이므로 'more'가 필요없습니다."
    },
    {
      id: 5,
      original: "I'm agree with you.",
      corrected: "I agree with you.",
      korean: "나는 당신에게 동의합니다.",
      tip: "'agree'는 동사이므로 'be동사' 없이 사용합니다."
    }
  ])

  const currentExpression = expressions[currentIndex]

  // Speech Recognition 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex
        const result = event.results[current]
        const text = result[0].transcript

        setUserTranscript(text)

        if (result.isFinal) {
          setIsListening(false)
          evaluatePronunciation(text)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const playExpression = async () => {
    setIsPlaying(true)
    try {
      const ttsResponse = await textToSpeech(currentExpression.corrected, settings)
      if (ttsResponse.audio) {
        await playAudioBase64(ttsResponse.audio)
      }
    } catch (err) {
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentExpression.corrected)
        utterance.lang = 'en-US'
        utterance.rate = 0.9
        utterance.onend = () => setIsPlaying(false)
        speechSynthesis.speak(utterance)
        return
      }
    }
    setIsPlaying(false)
  }

  const startListening = () => {
    if (recognitionRef.current) {
      setUserTranscript('')
      setShowResult(false)
      setIsListening(true)
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Recognition start error:', err)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  // Levenshtein 거리 계산 함수
  const levenshteinDistance = (str1, str2) => {
    const m = str1.length
    const n = str2.length
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
      }
    }
    return dp[m][n]
  }

  const evaluatePronunciation = (text) => {
    // 텍스트 정규화
    const normalize = (str) => str.toLowerCase()
      .replace(/[.,!?']/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    const target = normalize(currentExpression.corrected)
    const spoken = normalize(text)

    // 1. 문자 단위 Levenshtein 유사도 (40% 가중치)
    const charDistance = levenshteinDistance(target, spoken)
    const maxCharLen = Math.max(target.length, spoken.length)
    const charSimilarity = maxCharLen > 0 ? (1 - charDistance / maxCharLen) * 100 : 0

    // 2. 단어 순서 고려 유사도 (60% 가중치)
    const targetWords = target.split(' ')
    const spokenWords = spoken.split(' ')

    let orderScore = 0
    let matchedWords = 0

    targetWords.forEach((word, index) => {
      const spokenIndex = spokenWords.indexOf(word)
      if (spokenIndex !== -1) {
        matchedWords++
        // 위치가 가까울수록 높은 점수
        const positionDiff = Math.abs(index - spokenIndex)
        const positionScore = Math.max(0, 1 - positionDiff / targetWords.length)
        orderScore += positionScore
      }
    })

    const wordMatchRate = targetWords.length > 0 ? (matchedWords / targetWords.length) * 100 : 0
    const orderBonus = targetWords.length > 0 ? (orderScore / targetWords.length) * 20 : 0

    // 최종 점수 계산 (문자 유사도 40% + 단어 매칭 60% + 순서 보너스)
    const accuracy = Math.min(100, Math.round(
      charSimilarity * 0.4 + wordMatchRate * 0.6 + orderBonus
    ))

    setScores(prev => [...prev, accuracy])
    setShowResult(true)
  }

  const nextExpression = () => {
    if (currentIndex < expressions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserTranscript('')
      setShowResult(false)
    } else {
      setPracticeComplete(true)
    }
  }

  const retryExpression = () => {
    setUserTranscript('')
    setShowResult(false)
  }

  const getAccuracyColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  if (practiceComplete) {
    return (
      <div className="practice-page">
        <header className="practice-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1>연습 완료</h1>
          <div style={{ width: 24 }} />
        </header>

        <div className="complete-section">
          <div className="complete-icon">
            <Check size={48} color="white" />
          </div>

          <h2>훌륭해요!</h2>
          <p>모든 표현 연습을 완료했습니다.</p>

          <div className="score-summary">
            <div className="score-circle">
              <span className="score-number">{averageScore}</span>
              <span className="score-label">점</span>
            </div>
            <p>평균 정확도</p>
          </div>

          <div className="score-breakdown">
            {expressions.map((exp, index) => (
              <div key={exp.id} className="score-item">
                <span className="score-text">{exp.corrected.substring(0, 25)}...</span>
                <span
                  className="score-badge"
                  style={{ background: getAccuracyColor(scores[index] || 0) }}
                >
                  {scores[index] || 0}%
                </span>
              </div>
            ))}
          </div>

          <div className="complete-buttons">
            <button className="btn-secondary" onClick={() => navigate('/analysis')}>
              분석으로 돌아가기
            </button>
            <button className="btn-primary" onClick={() => navigate('/')}>
              홈으로
            </button>
          </div>
        </div>

        <style>{styles}</style>
      </div>
    )
  }

  return (
    <div className="practice-page">
      {/* Header */}
      <header className="practice-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>표현 연습</h1>
        <span className="progress-text">
          {currentIndex + 1} / {expressions.length}
        </span>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / expressions.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="practice-content">
        {/* Expression Card */}
        <div className="expression-card">
          <div className="expression-label">올바른 표현</div>
          <p className="expression-text">{currentExpression.corrected}</p>
          <p className="expression-korean">{currentExpression.korean}</p>

          <button
            className={`listen-btn ${isPlaying ? 'playing' : ''}`}
            onClick={playExpression}
            disabled={isPlaying}
          >
            <Volume2 size={20} />
            {isPlaying ? '재생 중...' : '듣기'}
          </button>
        </div>

        {/* Wrong Expression */}
        <div className="wrong-card">
          <div className="wrong-label">이렇게 말하면 안 돼요</div>
          <p className="wrong-text">{currentExpression.original}</p>
        </div>

        {/* Tip */}
        <div className="tip-card">
          <span className="tip-icon">💡</span>
          <p>{currentExpression.tip}</p>
        </div>

        {/* User Recording Section */}
        <div className="recording-section">
          <h3>따라 말해보세요</h3>

          {userTranscript && (
            <div className={`transcript-box ${showResult ? (scores[scores.length - 1] >= 70 ? 'success' : 'error') : ''}`}>
              <p>{userTranscript}</p>
              {showResult && (
                <span className="accuracy-badge" style={{ background: getAccuracyColor(scores[scores.length - 1]) }}>
                  {scores[scores.length - 1]}% 일치
                </span>
              )}
            </div>
          )}

          {!showResult ? (
            <button
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          ) : (
            <div className="result-buttons">
              <button className="retry-btn" onClick={retryExpression}>
                <RefreshCw size={18} />
                다시 하기
              </button>
              <button className="next-btn" onClick={nextExpression}>
                {currentIndex < expressions.length - 1 ? '다음' : '완료'}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {isListening && (
            <p className="listening-text">듣고 있어요...</p>
          )}
        </div>
      </div>

      <style>{styles}</style>
    </div>
  )
}

const styles = `
  .practice-page {
    min-height: 100vh;
    background: #f9fafb;
  }

  .practice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: white;
    border-bottom: 1px solid #e5e7eb;
  }

  .practice-header h1 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
  }

  .back-btn {
    background: none;
    color: #374151;
  }

  .progress-text {
    font-size: 14px;
    color: #6b7280;
  }

  .progress-bar {
    height: 4px;
    background: #e5e7eb;
  }

  .progress-fill {
    height: 100%;
    background: #5046e4;
    transition: width 0.3s ease;
  }

  .practice-content {
    padding: 20px;
  }

  .expression-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    text-align: center;
  }

  .expression-label {
    font-size: 12px;
    color: #22c55e;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .expression-text {
    font-size: 22px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .expression-korean {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }

  .listen-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #f3f4f6;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .listen-btn.playing {
    background: #5046e4;
    color: white;
  }

  .wrong-card {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .wrong-label {
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .wrong-text {
    font-size: 16px;
    color: #dc2626;
    text-decoration: line-through;
  }

  .tip-card {
    background: #fef3c7;
    border: 1px solid #fcd34d;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .tip-icon {
    font-size: 20px;
  }

  .tip-card p {
    font-size: 14px;
    color: #92400e;
    line-height: 1.5;
  }

  .recording-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    text-align: center;
  }

  .recording-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20px;
  }

  .transcript-box {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
    position: relative;
  }

  .transcript-box.success {
    border-color: #22c55e;
    background: #f0fdf4;
  }

  .transcript-box.error {
    border-color: #f59e0b;
    background: #fffbeb;
  }

  .transcript-box p {
    font-size: 16px;
    color: #374151;
  }

  .accuracy-badge {
    position: absolute;
    top: -10px;
    right: 10px;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }

  .mic-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #5046e4;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    box-shadow: 0 4px 12px rgba(80, 70, 228, 0.3);
  }

  .mic-btn.listening {
    background: #ef4444;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .listening-text {
    margin-top: 12px;
    font-size: 14px;
    color: #6b7280;
  }

  .result-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 14px 24px;
    background: #f3f4f6;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  .next-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 14px 24px;
    background: #5046e4;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: white;
  }

  /* Complete Section */
  .complete-section {
    padding: 40px 20px;
    text-align: center;
  }

  .complete-icon {
    width: 80px;
    height: 80px;
    background: #22c55e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }

  .complete-section h2 {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .complete-section > p {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 32px;
  }

  .score-summary {
    margin-bottom: 32px;
  }

  .score-circle {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #5046e4, #7c3aed);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .score-number {
    font-size: 32px;
    font-weight: 700;
    color: white;
  }

  .score-label {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
  }

  .score-summary > p {
    font-size: 14px;
    color: #6b7280;
  }

  .score-breakdown {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 32px;
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .score-item:last-child {
    border-bottom: none;
  }

  .score-text {
    font-size: 14px;
    color: #374151;
  }

  .score-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }

  .complete-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn-secondary {
    padding: 16px;
    background: #f3f4f6;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #374151;
  }

  .btn-primary {
    padding: 16px;
    background: #5046e4;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    color: white;
  }
`

export default Practice
