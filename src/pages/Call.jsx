import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Settings, Volume2, Mic } from 'lucide-react'
import { sendMessage, textToSpeech, playAudioBase64 } from '../utils/api'

function Call() {
  const navigate = useNavigate()
  const [callTime, setCallTime] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [transcript, setTranscript] = useState('')
  const [turnCount, setTurnCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [showSubtitleModal, setShowSubtitleModal] = useState(false)
  const [showTranslation, setShowTranslation] = useState({})

  const timerRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)
  const messagesEndRef = useRef(null)

  // 설정 로드
  const settings = JSON.parse(localStorage.getItem('tutorSettings') || '{}')
  const topic = settings.topic || 'daily'
  const topicLabels = {
    business: 'Business English',
    daily: 'Daily Conversation',
    travel: 'Travel English',
    interview: 'Job Interview'
  }
  const topicLabel = topicLabels[topic] || 'Daily Conversation'

  // 타이머
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCallTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Web Speech API 초기화
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

        setTranscript(text)

        if (result.isFinal) {
          handleUserSpeech(text)
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

  // 첫 인사 시작
  useEffect(() => {
    startConversation()
  }, [])

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startConversation = async () => {
    setIsLoading(true)
    try {
      const response = await sendMessage([], settings)
      const aiMessage = {
        role: 'assistant',
        content: response.message,
        speaker: 'ai',
        translation: '' // 번역은 나중에 추가 가능
      }
      setMessages([aiMessage])
      await speakText(response.message)
    } catch (err) {
      console.error('Start conversation error:', err)
      const mockMessage = {
        speaker: 'ai',
        content: `Hello! Let's practice English together. How are you doing today?`,
        translation: '안녕하세요! 함께 영어를 연습해봐요. 오늘 어떠세요?'
      }
      setMessages([mockMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const speakText = async (text) => {
    setIsSpeaking(true)

    try {
      const ttsResponse = await textToSpeech(text, settings)

      if (ttsResponse.audio) {
        await playAudioBase64(ttsResponse.audio, audioRef)
      }

      setIsSpeaking(false)
      startListening()
    } catch (err) {
      console.error('TTS error:', err)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = settings.speed === 'slow' ? 0.8 : settings.speed === 'fast' ? 1.2 : 1.0

        utterance.onend = () => {
          setIsSpeaking(false)
          startListening()
        }

        speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
        startListening()
      }
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true)
      setTranscript('')
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

  const handleUserSpeech = async (text) => {
    if (!text.trim()) return

    setIsListening(false)
    setIsLoading(true)

    const newTurnCount = turnCount + 1
    const newWordCount = wordCount + text.split(' ').length

    const userMessage = {
      role: 'user',
      content: text,
      speaker: 'user',
      turnNumber: newTurnCount,
      totalWords: newWordCount
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setTurnCount(newTurnCount)
    setWordCount(newWordCount)

    try {
      const apiMessages = updatedMessages.map(m => ({
        role: m.role || (m.speaker === 'ai' ? 'assistant' : 'user'),
        content: m.content
      }))

      const response = await sendMessage(apiMessages, settings)

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        speaker: 'ai',
        translation: ''
      }

      setMessages(prev => [...prev, aiMessage])
      await speakText(response.message)
    } catch (err) {
      console.error('Chat error:', err)
      setTimeout(() => startListening(), 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    clearInterval(timerRef.current)
    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }

    // 통화 결과 저장
    const result = {
      duration: callTime,
      messages: messages,
      date: new Date().toISOString(),
      turnCount,
      wordCount,
      topic: topicLabel
    }
    localStorage.setItem('lastCallResult', JSON.stringify(result))

    // 통화 기록 저장
    const history = JSON.parse(localStorage.getItem('callHistory') || '[]')
    history.unshift({
      date: new Date().toLocaleDateString('ko-KR'),
      duration: formatTime(callTime),
      words: wordCount,
      topic: topicLabel
    })
    localStorage.setItem('callHistory', JSON.stringify(history.slice(0, 10)))

    navigate('/result')
  }

  const toggleTranslation = (index) => {
    setShowTranslation(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="ringle-call">
      {/* Header - 링글 스타일 */}
      <header className="call-header">
        <button className="back-btn" onClick={handleEndCall}>
          <ChevronLeft size={24} color="#1f2937" />
        </button>
        <h1 className="topic-title">{topicLabel}</h1>
        <button className="settings-btn" onClick={() => setShowSubtitleModal(true)}>
          <Settings size={20} color="#6b7280" />
        </button>
      </header>

      {/* Messages Section - 링글 스타일 */}
      <div className="messages-section">
        {messages.map((msg, index) => {
          const isUser = msg.speaker === 'user' || msg.role === 'user'
          return (
            <div key={index} className={`message-wrapper ${isUser ? 'user' : 'ai'}`}>
              <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
                <p className="message-text">{msg.content}</p>

                {/* AI 메시지 하단 */}
                {!isUser && (
                  <div className="message-footer ai-footer">
                    <button
                      className="translate-btn"
                      onClick={() => toggleTranslation(index)}
                    >
                      {showTranslation[index] ? '번역 숨기기' : '번역 보기'}
                    </button>
                    <button className="speak-btn">
                      <Volume2 size={18} color="#6b7280" />
                    </button>
                  </div>
                )}

                {/* 번역 표시 */}
                {!isUser && showTranslation[index] && msg.translation && (
                  <p className="translation-text">{msg.translation}</p>
                )}

                {/* 사용자 메시지 하단 */}
                {isUser && (
                  <div className="message-footer user-footer">
                    <button className="speak-btn">
                      <Volume2 size={18} color="rgba(255,255,255,0.7)" />
                    </button>
                    <button className="correction-btn">
                      <span className="sparkle">✨</span> 교정 받기
                    </button>
                  </div>
                )}
              </div>

              {/* 턴/단어 카운트 - 사용자 메시지 아래 */}
              {isUser && (
                <div className="turn-info">
                  {msg.turnNumber} 턴 — {msg.totalWords}단어
                </div>
              )}
            </div>
          )
        })}

        {/* Current Transcript */}
        {isListening && transcript && (
          <div className="message-wrapper user">
            <div className="message-bubble user typing">
              <p className="message-text">{transcript}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom - 마이크 버튼 */}
      <div className="call-bottom">
        <div className="status-text">
          {isSpeaking && 'AI가 말하는 중...'}
          {isListening && '듣고 있어요...'}
          {isLoading && 'AI가 생각하는 중...'}
          {!isSpeaking && !isListening && !isLoading && '마이크를 눌러 말하세요'}
        </div>

        <button
          className={`mic-btn ${isListening ? 'active' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking || isLoading}
        >
          <Mic size={32} color="white" />
        </button>

        <button className="end-call-text" onClick={handleEndCall}>
          통화 종료
        </button>
      </div>

      {/* Subtitle Settings Modal */}
      {showSubtitleModal && (
        <div className="modal-overlay" onClick={() => setShowSubtitleModal(false)}>
          <div className="subtitle-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>설정</h3>
              <button onClick={() => setShowSubtitleModal(false)}>
                <span style={{ fontSize: 24, color: '#9ca3af' }}>&times;</span>
              </button>
            </div>
            <div className="modal-options">
              <button className="modal-option">자막 설정</button>
              <button className="modal-option">말하기 속도</button>
              <button className="modal-option">음성 볼륨</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ringle-call {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .call-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          background: white;
        }

        .back-btn, .settings-btn {
          background: none;
          padding: 4px;
        }

        .topic-title {
          font-size: 17px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Messages */
        .messages-section {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: white;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
        }

        .message-wrapper.user {
          align-items: flex-end;
        }

        .message-wrapper.ai {
          align-items: flex-start;
        }

        .message-bubble {
          max-width: 85%;
          padding: 16px 20px;
          border-radius: 16px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-bubble.ai {
          background: #f3f4f6;
          color: #1f2937;
          border-bottom-left-radius: 4px;
        }

        .message-bubble.user {
          background: #8b5cf6;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.typing {
          opacity: 0.8;
        }

        .message-text {
          font-size: 16px;
          line-height: 1.6;
        }

        .message-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .user-footer {
          border-top-color: rgba(255,255,255,0.2);
        }

        .translate-btn {
          font-size: 14px;
          color: #6b7280;
          background: none;
        }

        .speak-btn {
          background: none;
          padding: 4px;
        }

        .correction-btn {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          background: none;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }

        .sparkle {
          font-size: 14px;
        }

        .translation-text {
          font-size: 14px;
          color: #6b7280;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #e5e7eb;
        }

        .turn-info {
          font-size: 13px;
          color: #6b7280;
          margin-top: 8px;
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 16px 20px;
          align-self: flex-start;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        /* Bottom */
        .call-bottom {
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        .status-text {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .mic-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #8b5cf6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .mic-btn.active {
          background: #5046e4;
          animation: pulse 1.5s infinite;
        }

        .mic-btn:disabled {
          opacity: 0.5;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }

        .end-call-text {
          font-size: 15px;
          color: #ef4444;
          background: none;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
        }

        .subtitle-modal {
          background: white;
          width: 100%;
          max-width: 500px;
          border-radius: 24px 24px 0 0;
          padding: 24px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .modal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header-row h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-header-row button {
          background: none;
        }

        .modal-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-option {
          padding: 16px;
          text-align: left;
          font-size: 16px;
          color: #374151;
          background: #f9fafb;
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}

export default Call
