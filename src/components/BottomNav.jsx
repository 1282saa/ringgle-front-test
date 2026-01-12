/**
 * @file components/BottomNav.jsx
 * @description 하단 네비게이션 바 컴포넌트
 *
 * 링글 스타일의 6개 탭 하단 네비게이션을 제공합니다.
 * 홈, 1:1 수업, AI 튜터, AI 전화, 성취, 마이링글 탭으로 구성됩니다.
 *
 * @example
 * <BottomNav activeTab="ai-call" onTabChange={handleTabChange} />
 */

import { useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  Monitor,
  Bot,
  Phone,
  BarChart2,
  User,
} from 'lucide-react'

/**
 * 네비게이션 탭 설정
 * @constant {Array<Object>}
 */
const NAV_TABS = [
  { id: 'home', label: '홈', icon: HomeIcon, path: null },
  { id: 'lesson', label: '1:1 수업', icon: Monitor, path: null },
  { id: 'ai-tutor', label: 'AI 튜터', icon: Bot, path: null },
  { id: 'ai-call', label: 'AI 전화', icon: Phone, path: '/' },
  { id: 'achievement', label: '성취', icon: BarChart2, path: null },
  { id: 'my', label: '마이링글', icon: User, path: '/settings' },
]

/**
 * 하단 네비게이션 바 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.activeTab='ai-call'] - 현재 활성화된 탭 ID
 * @param {Function} [props.onTabChange] - 탭 변경 시 호출될 콜백 함수
 * @returns {JSX.Element} 하단 네비게이션 컴포넌트
 */
function BottomNav({ activeTab = 'ai-call', onTabChange }) {
  const navigate = useNavigate()

  /**
   * 탭 클릭 핸들러
   * @param {Object} tab - 클릭된 탭 정보
   */
  const handleTabClick = (tab) => {
    // 콜백 함수가 있으면 호출
    if (onTabChange) {
      onTabChange(tab.id)
    }

    // 경로가 있으면 네비게이션
    if (tab.path) {
      navigate(tab.path)
    }
  }

  return (
    <nav style={styles.container}>
      {NAV_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            }}
            onClick={() => handleTabClick(tab)}
          >
            <Icon size={22} style={{ strokeWidth: 1.5 }} />
            <span style={styles.navLabel}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

/**
 * 컴포넌트 스타일 정의
 * @constant {Object}
 */
const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 20px',
    maxWidth: 500,
    margin: '0 auto',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    minWidth: 50,
    cursor: 'pointer',
  },
  navItemActive: {
    color: '#1f2937',
  },
  navLabel: {
    fontSize: 10,
    whiteSpace: 'nowrap',
  },
}

export default BottomNav
