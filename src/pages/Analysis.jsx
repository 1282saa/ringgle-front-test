import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Play, ChevronRight, Volume2 } from 'lucide-react'

function Analysis() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('filler')
  const [callData, setCallData] = useState(null)

  // 분석 데이터 (실제로는 API에서 가져옴)
  const [analysisData] = useState({
    filler: {
      total: 12,
      items: [
        { word: 'um', count: 5, percentage: 42 },
        { word: 'uh', count: 3, percentage: 25 },
        { word: 'like', count: 2, percentage: 17 },
        { word: 'you know', count: 2, percentage: 16 }
      ]
    },
    grammar: {
      total: 3,
      items: [
        {
          id: 1,
          original: "I go to school yesterday.",
          corrected: "I went to school yesterday.",
          explanation: "과거 시제를 사용해야 합니다. 'yesterday'는 과거를 나타내므로 'go' 대신 'went'를 사용합니다.",
          type: "시제 오류"
        },
        {
          id: 2,
          original: "She don't like coffee.",
          corrected: "She doesn't like coffee.",
          explanation: "3인칭 단수 주어(She)와 함께 'doesn't'를 사용해야 합니다.",
          type: "주어-동사 일치"
        },
        {
          id: 3,
          original: "I have been to there before.",
          corrected: "I have been there before.",
          explanation: "'there'는 부사이므로 전치사 'to'가 필요하지 않습니다.",
          type: "전치사 오류"
        }
      ]
    },
    repetition: {
      total: 8,
      items: [
        { word: 'really', count: 4, contexts: ['I really like it', 'It was really good', 'Really interesting', 'Really nice'] },
        { word: 'very', count: 2, contexts: ['Very good', 'Very interesting'] },
        { word: 'actually', count: 2, contexts: ['Actually, I think...', 'Actually yes'] }
      ]
    }
  })

  useEffect(() => {
    const lastCall = localStorage.getItem('lastCallResult')
    if (lastCall) {
      setCallData(JSON.parse(lastCall))
    }
  }, [])

  const tabs = [
    { id: 'filler', label: '필러워드', count: analysisData.filler.total },
    { id: 'grammar', label: '문법 실수', count: analysisData.grammar.total },
    { id: 'repetition', label: '단어 반복', count: analysisData.repetition.total }
  ]

  return (
    <div className="analysis-page">
      {/* Header */}
      <header className="analysis-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>AI 분석</h1>
        <div style={{ width: 24 }} />
      </header>

      {/* Tabs */}
      <div className="analysis-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`analysis-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="analysis-content">
        {/* Filler Words */}
        {activeTab === 'filler' && (
          <div className="filler-section">
            <div className="section-header">
              <h2>필러워드 사용 현황</h2>
              <p className="section-desc">대화 중 사용된 불필요한 추임새입니다</p>
            </div>

            <div className="filler-summary">
              <div className="summary-circle">
                <span className="summary-number">{analysisData.filler.total}</span>
                <span className="summary-label">회</span>
              </div>
              <p>총 필러워드 사용</p>
            </div>

            <div className="filler-list">
              {analysisData.filler.items.map((item, index) => (
                <div key={index} className="filler-item">
                  <div className="filler-word">"{item.word}"</div>
                  <div className="filler-bar-container">
                    <div
                      className="filler-bar"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="filler-count">{item.count}회</div>
                </div>
              ))}
            </div>

            <div className="tip-card">
              <h3>개선 팁</h3>
              <p>필러워드를 줄이려면 말하기 전에 잠시 멈추고 생각하는 습관을 들여보세요.
                침묵이 "um"이나 "uh"보다 훨씬 자연스럽게 들립니다.</p>
            </div>
          </div>
        )}

        {/* Grammar Mistakes */}
        {activeTab === 'grammar' && (
          <div className="grammar-section">
            <div className="section-header">
              <h2>문법 실수 분석</h2>
              <p className="section-desc">AI가 감지한 문법 오류와 교정 제안입니다</p>
            </div>

            <div className="grammar-list">
              {analysisData.grammar.items.map((item) => (
                <div key={item.id} className="grammar-card">
                  <div className="grammar-type">{item.type}</div>

                  <div className="grammar-comparison">
                    <div className="grammar-original">
                      <span className="label">원문</span>
                      <p>{item.original}</p>
                      <button className="play-btn">
                        <Volume2 size={16} />
                      </button>
                    </div>

                    <div className="grammar-arrow">→</div>

                    <div className="grammar-corrected">
                      <span className="label">교정</span>
                      <p>{item.corrected}</p>
                      <button className="play-btn">
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grammar-explanation">
                    <p>{item.explanation}</p>
                  </div>

                  <button className="practice-btn" onClick={() => navigate('/practice')}>
                    이 문장 연습하기
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Word Repetition */}
        {activeTab === 'repetition' && (
          <div className="repetition-section">
            <div className="section-header">
              <h2>반복 사용 단어</h2>
              <p className="section-desc">자주 반복된 단어들입니다. 다양한 표현을 사용해보세요.</p>
            </div>

            <div className="repetition-list">
              {analysisData.repetition.items.map((item, index) => (
                <div key={index} className="repetition-card">
                  <div className="repetition-header">
                    <span className="repetition-word">"{item.word}"</span>
                    <span className="repetition-count">{item.count}회 사용</span>
                  </div>

                  <div className="repetition-contexts">
                    {item.contexts.map((context, idx) => (
                      <div key={idx} className="context-item">
                        <span className="context-bullet">•</span>
                        {context}
                      </div>
                    ))}
                  </div>

                  <div className="alternative-section">
                    <span className="alternative-label">대체 표현 제안</span>
                    <div className="alternatives">
                      {item.word === 'really' && (
                        <>
                          <span className="alt-word">truly</span>
                          <span className="alt-word">genuinely</span>
                          <span className="alt-word">extremely</span>
                        </>
                      )}
                      {item.word === 'very' && (
                        <>
                          <span className="alt-word">incredibly</span>
                          <span className="alt-word">highly</span>
                          <span className="alt-word">quite</span>
                        </>
                      )}
                      {item.word === 'actually' && (
                        <>
                          <span className="alt-word">in fact</span>
                          <span className="alt-word">indeed</span>
                          <span className="alt-word">as a matter of fact</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .analysis-page {
          min-height: 100vh;
          background: #f9fafb;
        }

        .analysis-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .analysis-header h1 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .back-btn {
          background: none;
          color: #374151;
        }

        .analysis-tabs {
          display: flex;
          background: white;
          padding: 0 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .analysis-tab {
          flex: 1;
          padding: 16px 8px;
          font-size: 14px;
          font-weight: 500;
          color: #9ca3af;
          background: none;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .analysis-tab.active {
          color: #1f2937;
          border-bottom-color: #5046e4;
        }

        .tab-count {
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }

        .analysis-tab.active .tab-count {
          background: #5046e4;
          color: white;
        }

        .analysis-content {
          padding: 20px;
        }

        .section-header {
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .section-desc {
          font-size: 14px;
          color: #6b7280;
        }

        /* Filler Words Styles */
        .filler-summary {
          text-align: center;
          padding: 24px;
          background: white;
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .summary-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }

        .summary-number {
          font-size: 28px;
          font-weight: 700;
          color: white;
        }

        .summary-label {
          font-size: 12px;
          color: rgba(255,255,255,0.8);
        }

        .filler-summary > p {
          font-size: 14px;
          color: #6b7280;
        }

        .filler-list {
          background: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .filler-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .filler-item:last-child {
          border-bottom: none;
        }

        .filler-word {
          width: 80px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .filler-bar-container {
          flex: 1;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .filler-bar {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          border-radius: 4px;
        }

        .filler-count {
          width: 40px;
          font-size: 13px;
          color: #6b7280;
          text-align: right;
        }

        .tip-card {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 12px;
          padding: 16px;
        }

        .tip-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 8px;
        }

        .tip-card p {
          font-size: 13px;
          color: #a16207;
          line-height: 1.5;
        }

        /* Grammar Styles */
        .grammar-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .grammar-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
        }

        .grammar-type {
          display: inline-block;
          padding: 4px 10px;
          background: #fee2e2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 500;
          border-radius: 6px;
          margin-bottom: 16px;
        }

        .grammar-comparison {
          display: flex;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 16px;
        }

        .grammar-original,
        .grammar-corrected {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          position: relative;
        }

        .grammar-original {
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .grammar-corrected {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .grammar-original .label,
        .grammar-corrected .label {
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 6px;
          display: block;
        }

        .grammar-original p {
          font-size: 14px;
          color: #dc2626;
          line-height: 1.4;
        }

        .grammar-corrected p {
          font-size: 14px;
          color: #16a34a;
          line-height: 1.4;
        }

        .grammar-arrow {
          display: flex;
          align-items: center;
          color: #9ca3af;
          font-size: 18px;
        }

        .play-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          color: #9ca3af;
          padding: 4px;
        }

        .grammar-explanation {
          background: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .grammar-explanation p {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.5;
        }

        .practice-btn {
          width: 100%;
          padding: 12px;
          background: #5046e4;
          color: white;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* Repetition Styles */
        .repetition-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .repetition-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
        }

        .repetition-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .repetition-word {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .repetition-count {
          font-size: 13px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 10px;
        }

        .repetition-contexts {
          background: #f9fafb;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .context-item {
          font-size: 13px;
          color: #4b5563;
          padding: 4px 0;
          display: flex;
          gap: 8px;
        }

        .context-bullet {
          color: #9ca3af;
        }

        .alternative-section {
          border-top: 1px solid #f3f4f6;
          padding-top: 12px;
        }

        .alternative-label {
          font-size: 12px;
          color: #6b7280;
          display: block;
          margin-bottom: 8px;
        }

        .alternatives {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .alt-word {
          padding: 6px 12px;
          background: #ede9fe;
          color: #7c3aed;
          font-size: 13px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  )
}

export default Analysis
