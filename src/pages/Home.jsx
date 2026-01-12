import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ChevronRight, Menu, Flame, Home as HomeIcon, Monitor, Bot, BarChart2, User } from 'lucide-react'

function Home() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('call') // call, settings, history
  const [callHistory, setCallHistory] = useState([])

  // 설정에서 저장된 값 로드
  const settings = JSON.parse(localStorage.getItem('tutorSettings') || '{}')
  const accent = settings.accent || 'us'
  const gender = settings.gender || 'female'

  const accentLabel = {
    us: '미국',
    uk: '영국',
    au: '호주',
    in: '인도'
  }[accent] || '미국'

  const genderLabel = gender === 'male' ? '남성' : '여성'

  // 튜터 이름 생성 (링글 스타일)
  const tutorNames = {
    female: ['Gwen', 'Emma', 'Olivia', 'Sophia'],
    male: ['James', 'Liam', 'Noah', 'Oliver']
  }
  const tutorName = settings.tutorName || tutorNames[gender][0]
  const tutorInitial = tutorName[0]

  // 성격 태그
  const personalityTags = ['밝은', '활기찬']

  useEffect(() => {
    // 통화 기록 로드
    const saved = localStorage.getItem('callHistory')
    if (saved) {
      setCallHistory(JSON.parse(saved))
    }
  }, [])

  const handleCall = () => {
    navigate('/call')
  }

  return (
    <div className="ringle-home">
      {/* Header */}
      <header className="ringle-header">
        <h1>AI 전화</h1>
        <div className="header-icons">
          <button className="icon-btn">
            <Flame size={22} color="#22d3ee" fill="#22d3ee" />
          </button>
          <button className="icon-btn">
            <Menu size={22} color="#1f2937" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'call' ? 'active' : ''}`}
          onClick={() => setActiveTab('call')}
        >
          전화
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('settings')
            navigate('/settings')
          }}
        >
          맞춤설정
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          전화내역
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'call' && (
          <>
            {/* Tutor Card - 링글 스타일 */}
            <div className="tutor-card">
              <div className="tutor-avatar-wrapper">
                <div className="tutor-avatar">
                  <span>{tutorInitial}</span>
                </div>
              </div>

              <div className="tutor-tags">
                {personalityTags.map(tag => (
                  <span key={tag} className="personality-tag">{tag}</span>
                ))}
              </div>

              <h2 className="tutor-name">{tutorName}</h2>

              <div className="tutor-info-tags">
                <span className="info-tag">#{accentLabel}</span>
                <span className="info-tag">#{genderLabel}</span>
              </div>
            </div>

            {/* Call Button - 링글 스타일 */}
            <button className="call-btn" onClick={handleCall}>
              바로 전화하기
            </button>
          </>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            {callHistory.length > 0 ? (
              callHistory.map((call, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => navigate('/result')}
                >
                  <div className="history-date">{call.date}</div>
                  <div className="history-info">
                    <span>{call.duration}</span>
                    <span>{call.words} 단어</span>
                  </div>
                  <ChevronRight size={20} color="#9ca3af" />
                </div>
              ))
            ) : (
              <div className="empty-history">
                <div className="empty-icon">
                  <Phone size={32} color="#9ca3af" />
                </div>
                <p>아직 전화 내역이 없어요</p>
                <p className="sub">AI와 대화를 시작해보세요!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation - 링글 6개 탭 */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <HomeIcon size={22} />
          <span>홈</span>
        </button>
        <button className="nav-item">
          <Monitor size={22} />
          <span>1:1 수업</span>
        </button>
        <button className="nav-item">
          <Bot size={22} />
          <span>AI 튜터</span>
        </button>
        <button className="nav-item active">
          <Phone size={22} />
          <span>AI 전화</span>
        </button>
        <button className="nav-item" onClick={() => setActiveTab('history')}>
          <BarChart2 size={22} />
          <span>성취</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/settings')}>
          <User size={22} />
          <span>마이링글</span>
        </button>
      </nav>

      <style>{`
        .ringle-home {
          min-height: 100vh;
          background: #f9fafb;
          padding-bottom: 80px;
        }

        .ringle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: white;
        }

        .ringle-header h1 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .header-icons {
          display: flex;
          gap: 16px;
        }

        .icon-btn {
          background: none;
          padding: 4px;
        }

        .tabs {
          display: flex;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 20px;
        }

        .tab {
          padding: 16px 20px;
          font-size: 15px;
          font-weight: 500;
          color: #9ca3af;
          background: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab.active {
          color: #1f2937;
          border-bottom-color: #1f2937;
        }

        .main-content {
          padding: 20px;
        }

        /* Tutor Card - 링글 스타일 */
        .tutor-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 40px 32px;
          text-align: center;
          margin-bottom: 16px;
        }

        .tutor-avatar-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .tutor-avatar {
          width: 140px;
          height: 140px;
          background: #8b5cf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 6px solid #ddd6fe;
        }

        .tutor-avatar span {
          font-size: 56px;
          font-weight: 600;
          color: white;
        }

        .tutor-tags {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .personality-tag {
          padding: 6px 14px;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 14px;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .tutor-name {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .tutor-info-tags {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .info-tag {
          font-size: 15px;
          color: #6b7280;
        }

        /* Call Button - 링글 스타일 */
        .call-btn {
          width: 100%;
          padding: 18px;
          background: #5046e4;
          color: white;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 600;
          margin-top: 4px;
        }

        .call-btn:active {
          background: #4338ca;
        }

        /* History Section */
        .history-section {
          background: white;
          border-radius: 12px;
          padding: 0 16px;
        }

        .history-item {
          display: flex;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
        }

        .history-item:last-child {
          border-bottom: none;
        }

        .history-date {
          flex: 1;
          font-size: 15px;
          color: #1f2937;
          font-weight: 500;
        }

        .history-info {
          display: flex;
          gap: 12px;
          margin-right: 8px;
        }

        .history-info span {
          font-size: 14px;
          color: #6b7280;
        }

        .empty-history {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .empty-history p {
          font-size: 16px;
          color: #374151;
          margin-bottom: 4px;
        }

        .empty-history .sub {
          font-size: 14px;
          color: #9ca3af;
        }

        /* Bottom Navigation - 링글 6개 탭 */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-around;
          padding: 8px 0 20px;
          max-width: 500px;
          margin: 0 auto;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: none;
          color: #9ca3af;
          min-width: 50px;
        }

        .nav-item.active {
          color: #1f2937;
        }

        .nav-item span {
          font-size: 10px;
          white-space: nowrap;
        }

        .nav-item svg {
          stroke-width: 1.5;
        }
      `}</style>
    </div>
  )
}

export default Home
