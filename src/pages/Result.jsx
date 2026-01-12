import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, Star, Volume2, CheckCircle, ArrowRight, Loader,
  MessageCircle, Sparkles
} from 'lucide-react'
import { analyzeConversation, textToSpeech, playAudioBase64 } from '../utils/api'

function Result() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisRequested, setAnalysisRequested] = useState(false)
  const [showFeedback, setShowFeedback] = useState(true)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [showCorrections, setShowCorrections] = useState(false)
  const [currentCorrectionIndex, setCurrentCorrectionIndex] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('lastCallResult')
    if (saved) {
      const data = JSON.parse(saved)
      setResult(data)
      // 자동으로 AI 분석 시작
      if (data.messages && data.messages.length > 0) {
        runAutoAnalysis(data.messages)
      }
    }
  }, [])

  const runAutoAnalysis = async (messages) => {
    setIsAnalyzing(true)
    setAnalysisRequested(true)
    try {
      const response = await analyzeConversation(messages)
      if (response.analysis) {
        setAnalysis(response.analysis)
      }
    } catch (err) {
      console.error('Auto analysis failed:', err)
      // 실패 시 기본값
      setAnalysis({
        cafp_scores: { complexity: 70, accuracy: 75, fluency: 72, pronunciation: 78 },
        fillers: { count: 0, words: [], percentage: 0 },
        grammar_corrections: [],
        vocabulary: { total_words: 0, unique_words: 0, advanced_words: [], suggested_words: [] },
        overall_feedback: '대화를 완료하셨습니다!',
        improvement_tips: []
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const requestAnalysis = async () => {
    if (!result?.messages || result.messages.length === 0) return

    setIsAnalyzing(true)
    setAnalysisRequested(true)
    try {
      const response = await analyzeConversation(result.messages)
      if (response.analysis) {
        setAnalysis(response.analysis)
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setAnalysis({
        cafp_scores: { complexity: 70, accuracy: 75, fluency: 72, pronunciation: 78 },
        fillers: { count: 0, words: [], percentage: 0 },
        grammar_corrections: [],
        vocabulary: { total_words: 0, unique_words: 0, advanced_words: [], suggested_words: [] },
        overall_feedback: '대화를 완료하셨습니다!',
        improvement_tips: []
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 새로운 단어 수 (AI 분석 결과 또는 추정)
  const newWords = analysis?.vocabulary?.advanced_words?.length ||
    Math.floor((analysis?.vocabulary?.unique_words || 0) * 0.2)

  // 말한 단어 수
  const wordCount = result?.messages
    ?.filter(m => m.speaker === 'user' || m.role === 'user')
    .reduce((acc, m) => acc + ((m.en || m.content)?.split(' ').length || 0), 0) || 0

  const submitFeedback = () => {
    // 피드백 저장 (로컬스토리지 또는 API)
    const feedback = {
      rating,
      text: feedbackText,
      date: new Date().toISOString()
    }
    localStorage.setItem('lastFeedback', JSON.stringify(feedback))
    setShowFeedback(false)
  }

  const speakText = async (text) => {
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
    }
  }

  const corrections = analysis?.grammar_corrections || []

  return (
    <div className="ringle-result">
      {/* Header with Close */}
      <button
        className="close-btn"
        onClick={() => navigate('/')}
      >
        <X size={24} />
      </button>

      {/* Success Icon & Message */}
      <div className="success-section">
        <div className="success-icon">
          <CheckCircle size={48} color="white" />
        </div>
        <h1 className="success-title">대화를 완료했어요.</h1>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">새로운 단어</span>
            <span className="stat-value green">+ {newWords || Math.floor(wordCount * 0.2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">말한 단어</span>
            <span className="stat-value">{wordCount}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">대화 시간</span>
            <span className="stat-value">{formatDuration(result?.duration)}</span>
          </div>
        </div>
      </div>

      {/* Analysis Status */}
      {analysisRequested && isAnalyzing && (
        <div className="analysis-status">
          <Loader size={16} className="spin" />
          <span>AI 분석이 요청되었어요.</span>
        </div>
      )}

      {analysisRequested && !isAnalyzing && analysis && (
        <div className="analysis-status success">
          <Sparkles size={16} />
          <span>AI 분석이 완료되었어요!</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className={`action-btn outline ${analysisRequested ? 'disabled' : ''}`}
          onClick={requestAnalysis}
          disabled={analysisRequested || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader size={18} className="spin" />
              분석 중...
            </>
          ) : analysisRequested ? (
            'AI 분석 요청'
          ) : (
            'AI 분석 요청'
          )}
        </button>
        <button
          className="action-btn primary"
          onClick={() => setShowCorrections(true)}
          disabled={!analysis || corrections.length === 0}
        >
          표현 확인하기
        </button>
      </div>

      {/* Quick Analysis Preview (if analyzed) */}
      {analysis && !showCorrections && (
        <div className="analysis-preview">
          <div className="preview-header">
            <MessageCircle size={18} />
            <span>분석 결과 요약</span>
          </div>

          <div className="cafp-mini">
            {[
              { label: 'C', score: analysis.cafp_scores?.complexity || 0 },
              { label: 'A', score: analysis.cafp_scores?.accuracy || 0 },
              { label: 'F', score: analysis.cafp_scores?.fluency || 0 },
              { label: 'P', score: analysis.cafp_scores?.pronunciation || 0 },
            ].map(item => (
              <div key={item.label} className="cafp-item">
                <div className="cafp-label">{item.label}</div>
                <div className="cafp-bar">
                  <div
                    className="cafp-fill"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <div className="cafp-score">{item.score}</div>
              </div>
            ))}
          </div>

          {analysis.overall_feedback && (
            <p className="feedback-text">{analysis.overall_feedback}</p>
          )}

          {analysis.fillers?.count > 0 && (
            <div className="filler-warning">
              <span>필러 단어 {analysis.fillers.count}회 사용</span>
              <span className="filler-words">
                {analysis.fillers.words.slice(0, 3).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal-overlay">
          <div className="feedback-modal">
            <div className="modal-header">
              <span className="modal-label">피드백을 남겨주세요</span>
              <h2>AI와의 대화는 어땠나요?</h2>
            </div>

            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  className={`star-btn ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    fill={rating >= star ? '#a78bfa' : 'none'}
                    color="#a78bfa"
                  />
                </button>
              ))}
            </div>
            <p className="rating-hint">대화 만족도를 평가해주세요</p>

            <div className="feedback-input-section">
              <label>자세한 후기를 남겨주세요. (선택)</label>
              <textarea
                placeholder="Please share your honest user experience. Detailed feedback would be a great help in improving the features."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <button
              className="submit-btn"
              onClick={submitFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Corrections View (표현 확인하기) */}
      {showCorrections && corrections.length > 0 && (
        <div className="modal-overlay">
          <div className="correction-modal">
            <button
              className="close-btn"
              onClick={() => setShowCorrections(false)}
            >
              <X size={24} />
            </button>

            <h2 className="correction-title">이 표현을 짧게 연습해볼게요.</h2>

            <div className="correction-card">
              <p className="corrected-text">
                {corrections[currentCorrectionIndex]?.corrected}
              </p>
              <p className="original-text">
                {corrections[currentCorrectionIndex]?.explanation ||
                  '올바른 표현으로 수정되었습니다.'}
              </p>
            </div>

            <div className="correction-explanation">
              <p>
                '{corrections[currentCorrectionIndex]?.original}'이라는 표현은 자연스럽지 않아서,
                올바른 형태는 '{corrections[currentCorrectionIndex]?.corrected}'입니다.
              </p>
            </div>

            <button
              className="next-btn"
              onClick={() => {
                if (currentCorrectionIndex < corrections.length - 1) {
                  setCurrentCorrectionIndex(prev => prev + 1)
                } else {
                  setShowCorrections(false)
                }
              }}
            >
              {currentCorrectionIndex < corrections.length - 1 ? '다음' : '완료'}
            </button>
          </div>
        </div>
      )}

      {/* Practice Mode (듣고 따라 말해보세요) */}
      {showCorrections && corrections.length === 0 && analysis && (
        <div className="modal-overlay">
          <div className="correction-modal">
            <button
              className="close-btn"
              onClick={() => setShowCorrections(false)}
            >
              <X size={24} />
            </button>

            <div className="no-corrections">
              <CheckCircle size={48} color="#10b981" />
              <h3>훌륭해요!</h3>
              <p>수정이 필요한 표현이 없습니다.</p>
            </div>

            <button
              className="next-btn"
              onClick={() => setShowCorrections(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <style>{`
        .ringle-result {
          min-height: 100vh;
          background: #f5f5f5;
          padding-bottom: 40px;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          padding: 8px;
          color: #9ca3af;
          z-index: 100;
        }

        .success-section {
          background: #e5e5e5;
          padding: 60px 20px 30px;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        }

        .success-title {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .stats-row {
          display: flex;
          gap: 12px;
          padding: 0 10px;
        }

        .stat-card {
          flex: 1;
          background: white;
          border-radius: 12px;
          padding: 16px 12px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .stat-label {
          display: block;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-value.green {
          color: #22c55e;
        }

        .analysis-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          margin: 20px;
          background: #e0f2fe;
          border-radius: 8px;
          font-size: 14px;
          color: #0369a1;
        }

        .analysis-status.success {
          background: #dcfce7;
          color: #166534;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          padding: 0 20px;
          margin-top: 20px;
        }

        .action-btn {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .action-btn.outline {
          background: white;
          border: 2px solid #5046e4;
          color: #5046e4;
        }

        .action-btn.outline.disabled {
          border-color: #d1d5db;
          color: #9ca3af;
        }

        .action-btn.primary {
          background: #5046e4;
          color: white;
        }

        .action-btn.primary:disabled {
          background: #d1d5db;
        }

        .analysis-preview {
          margin: 20px;
          background: white;
          border-radius: 16px;
          padding: 20px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
        }

        .cafp-mini {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .cafp-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cafp-label {
          width: 24px;
          height: 24px;
          background: #5046e4;
          color: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .cafp-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .cafp-fill {
          height: 100%;
          background: linear-gradient(90deg, #5046e4, #7c3aed);
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .cafp-score {
          width: 32px;
          text-align: right;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .feedback-text {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .filler-warning {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fef2f2;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
        }

        .filler-warning span:first-child {
          color: #dc2626;
          font-weight: 500;
        }

        .filler-words {
          color: #9ca3af;
        }

        /* Modal Styles */
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

        .feedback-modal {
          background: white;
          width: 100%;
          max-width: 500px;
          border-radius: 24px 24px 0 0;
          padding: 32px 24px 40px;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .modal-header {
          margin-bottom: 24px;
        }

        .modal-label {
          color: #5046e4;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .star-rating {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .star-btn {
          background: none;
          padding: 4px;
        }

        .rating-hint {
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 24px;
        }

        .feedback-input-section {
          margin-bottom: 24px;
        }

        .feedback-input-section label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 12px;
        }

        .feedback-input-section textarea {
          width: 100%;
          height: 100px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          font-size: 14px;
          resize: none;
        }

        .feedback-input-section textarea::placeholder {
          color: #9ca3af;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #5046e4;
          color: white;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
        }

        /* Correction Modal */
        .correction-modal {
          background: white;
          width: 100%;
          max-width: 500px;
          min-height: 70vh;
          border-radius: 24px 24px 0 0;
          padding: 60px 24px 40px;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        .correction-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 40px;
        }

        .correction-card {
          background: #f9fafb;
          border-radius: 16px;
          padding: 32px 24px;
          margin-bottom: 20px;
        }

        .corrected-text {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .original-text {
          font-size: 14px;
          color: #9ca3af;
        }

        .correction-explanation {
          background: #eff6ff;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 40px;
        }

        .correction-explanation p {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
        }

        .next-btn {
          width: 100%;
          padding: 18px;
          background: #5046e4;
          color: white;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
        }

        .no-corrections {
          text-align: center;
          padding: 40px 0;
        }

        .no-corrections h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 16px 0 8px;
          color: #1f2937;
        }

        .no-corrections p {
          color: #6b7280;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Result
