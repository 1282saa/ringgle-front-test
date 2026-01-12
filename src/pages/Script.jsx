/**
 * @file pages/Script.jsx
 * @description 대화 스크립트 확인 화면
 *
 * 기능:
 * - AI/User 메시지 버블 표시
 * - 번역 보기 토글
 * - 교정 받기 버튼
 * - 음성 재생
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft, Volume2, ChevronDown, ChevronUp,
  MessageCircle, AlertCircle, Check
} from 'lucide-react'
import { textToSpeech, playAudioBase64 } from '../utils/api'

function Script() {
  const navigate = useNavigate()
  const location = useLocation()

  // location.state에서 callData 가져오기
  const { callId, callData } = location.state || {}

  const [messages, setMessages] = useState([])
  const [corrections, setCorrections] = useState([])
  const [showTranslation, setShowTranslation] = useState({})
  const [showCorrection, setShowCorrection] = useState({})
  const [playingId, setPlayingId] = useState(null)
  const [tutorInfo, setTutorInfo] = useState({ name: 'AI', accent: 'us' })

  useEffect(() => {
    if (callData) {
      setMessages(callData.messages || [])
      setCorrections(callData.corrections || [])
      setTutorInfo(callData.tutor || { name: 'AI', accent: 'us' })
    }
  }, [callData])

  // 메시지에 대한 교정 찾기
  const getCorrectionForMessage = (messageId) => {
    return corrections.find(c => c.messageId === messageId)
  }

  // 번역 토글
  const toggleTranslation = (messageId) => {
    setShowTranslation(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  // 교정 토글
  const toggleCorrection = (messageId) => {
    setShowCorrection(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  // TTS 재생
  const handleSpeak = async (text, messageId) => {
    if (playingId === messageId) return

    setPlayingId(messageId)
    try {
      const settings = JSON.parse(localStorage.getItem('tutorSettings') || '{}')
      const ttsResponse = await textToSpeech(text, settings)
      if (ttsResponse.audio) {
        await playAudioBase64(ttsResponse.audio)
      }
    } catch (err) {
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        speechSynthesis.speak(utterance)
      }
    } finally {
      setPlayingId(null)
    }
  }

  // 날짜 포맷팅
  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[date.getDay()]
    return `${year}. ${month}. ${day}(${dayName})`
  }

  if (!callData) {
    return (
      <div className="script-error">
        <p>데이터를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    )
  }

  return (
    <div className="script-page">
      {/* Header */}
      <header className="script-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div className="header-info">
          <h1>대화 스크립트</h1>
          <p className="header-date">{formatDate(callData.timestamp)}</p>
        </div>
      </header>

      {/* Tutor Info */}
      <div className="tutor-banner">
        <div className="tutor-avatar">
          <span>{tutorInfo.name?.[0] || 'A'}</span>
        </div>
        <span className="tutor-name">{tutorInfo.name}</span>
        <span className="tutor-tag">#{tutorInfo.accent === 'us' ? '미국' : tutorInfo.accent === 'uk' ? '영국' : tutorInfo.accent}</span>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => {
          const isAI = message.role === 'assistant' || message.speaker === 'ai'
          const messageId = message.id
          const correction = getCorrectionForMessage(messageId)
          const hasTranslation = isAI && message.translation
          const content = message.content || message.en || ''

          return (
            <div
              key={messageId}
              className={`message-wrapper ${isAI ? 'ai' : 'user'}`}
            >
              {/* Speaker Label */}
              <div className="speaker-label">
                {isAI ? tutorInfo.name : 'You'}
              </div>

              {/* Message Bubble */}
              <div className={`message-bubble ${isAI ? 'ai' : 'user'}`}>
                <p className="message-text">{content}</p>

                {/* AI 메시지: 번역 보기 */}
                {hasTranslation && (
                  <button
                    className="translation-toggle"
                    onClick={() => toggleTranslation(messageId)}
                  >
                    <span>번역 보기</span>
                    {showTranslation[messageId] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}

                {/* 번역 내용 */}
                {showTranslation[messageId] && message.translation && (
                  <div className="translation-content">
                    {message.translation}
                  </div>
                )}

                {/* User 메시지: 교정이 있는 경우 */}
                {!isAI && correction && (
                  <button
                    className="correction-toggle"
                    onClick={() => toggleCorrection(messageId)}
                  >
                    <AlertCircle size={14} />
                    <span>교정 받기</span>
                    {showCorrection[messageId] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}

                {/* 교정 내용 */}
                {showCorrection[messageId] && correction && (
                  <div className="correction-content">
                    <div className="correction-row">
                      <span className="correction-label">수정 전</span>
                      <p className="original">{correction.originalText}</p>
                    </div>
                    <div className="correction-row">
                      <span className="correction-label">수정 후</span>
                      <p className="corrected">{correction.correctedText}</p>
                    </div>
                    {correction.explanation && (
                      <div className="correction-explanation">
                        <p>{correction.explanation}</p>
                      </div>
                    )}
                    {correction.translation && (
                      <div className="correction-translation">
                        <p>{correction.translation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Audio Button (AI messages only) */}
              {isAI && (
                <button
                  className={`audio-btn ${playingId === messageId ? 'playing' : ''}`}
                  onClick={() => handleSpeak(content, messageId)}
                  disabled={playingId === messageId}
                >
                  <Volume2 size={18} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button
          className="action-btn"
          onClick={() => navigate('/analysis', { state: { callId, callData } })}
          disabled={!callData.analysis}
        >
          AI 분석 보기
        </button>
      </div>

      <style>{`
        .script-page {
          min-height: 100vh;
          background: #f9fafb;
          padding-bottom: 100px;
        }

        .script-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
        }

        .script-error button {
          padding: 12px 24px;
          background: #5046e4;
          color: white;
          border-radius: 8px;
        }

        /* Header */
        .script-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .back-btn {
          background: none;
          padding: 4px;
          color: #374151;
        }

        .header-info h1 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .header-date {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        /* Tutor Banner */
        .tutor-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .tutor-avatar {
          width: 40px;
          height: 40px;
          background: #8b5cf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tutor-avatar span {
          color: white;
          font-size: 18px;
          font-weight: 600;
        }

        .tutor-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .tutor-tag {
          font-size: 13px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 12px;
        }

        /* Messages Container */
        .messages-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Message Wrapper */
        .message-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .message-wrapper.ai {
          align-items: flex-start;
        }

        .message-wrapper.user {
          align-items: flex-end;
        }

        /* Speaker Label */
        .speaker-label {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          padding: 0 4px;
        }

        /* Message Bubble */
        .message-bubble {
          max-width: 85%;
          padding: 14px 16px;
          border-radius: 16px;
          position: relative;
        }

        .message-bubble.ai {
          background: white;
          border: 1px solid #e5e7eb;
          border-top-left-radius: 4px;
        }

        .message-bubble.user {
          background: #5046e4;
          color: white;
          border-top-right-radius: 4px;
        }

        .message-text {
          font-size: 15px;
          line-height: 1.6;
        }

        /* Translation Toggle */
        .translation-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 12px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 13px;
          color: #5046e4;
          font-weight: 500;
        }

        .translation-content {
          margin-top: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        /* Correction Toggle */
        .correction-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 13px;
          color: white;
          font-weight: 500;
        }

        .correction-content {
          margin-top: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }

        .correction-row {
          margin-bottom: 12px;
        }

        .correction-row:last-child {
          margin-bottom: 0;
        }

        .correction-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 4px;
        }

        .correction-row .original {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: line-through;
        }

        .correction-row .corrected {
          font-size: 14px;
          color: white;
          font-weight: 500;
        }

        .correction-explanation {
          margin-top: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }

        .correction-explanation p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
        }

        .correction-translation {
          margin-top: 8px;
        }

        .correction-translation p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        /* Audio Button */
        .audio-btn {
          width: 36px;
          height: 36px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          margin-top: 4px;
        }

        .audio-btn.playing {
          background: #5046e4;
          border-color: #5046e4;
          color: white;
        }

        .audio-btn:disabled {
          opacity: 0.6;
        }

        /* Bottom Actions */
        .bottom-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px 32px;
          background: white;
          border-top: 1px solid #e5e7eb;
          max-width: 500px;
          margin: 0 auto;
        }

        .action-btn {
          width: 100%;
          padding: 16px;
          background: #5046e4;
          color: white;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
        }

        .action-btn:disabled {
          background: #d1d5db;
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
}

export default Script
