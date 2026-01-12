/**
 * @file components/TutorAvatar.jsx
 * @description AI 튜터 아바타 컴포넌트
 *
 * 튜터의 이니셜을 원형 배경에 표시하는 재사용 가능한 컴포넌트입니다.
 * 홈 화면, 통화 화면, 통화 기록 등에서 일관된 스타일로 사용됩니다.
 *
 * @example
 * // 기본 사용 (중간 크기)
 * <TutorAvatar name="Gwen" />
 *
 * // 큰 크기 (홈 화면용)
 * <TutorAvatar name="Gwen" size="large" />
 *
 * // 작은 크기 (통화 기록용)
 * <TutorAvatar name="James" size="small" />
 */

import { COLORS } from '../constants'

/**
 * 사이즈별 스타일 정의
 * @constant {Object}
 */
const SIZES = {
  small: {
    container: 48,
    fontSize: 20,
    borderWidth: 0,
  },
  medium: {
    container: 100,
    fontSize: 40,
    borderWidth: 0,
  },
  large: {
    container: 140,
    fontSize: 56,
    borderWidth: 6,
  },
}

/**
 * AI 튜터 아바타 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.name - 튜터 이름 (첫 글자가 표시됨)
 * @param {string} [props.size='medium'] - 아바타 크기 ('small' | 'medium' | 'large')
 * @param {string} [props.backgroundColor] - 배경색 (기본: COLORS.purple)
 * @param {Object} [props.style] - 추가 인라인 스타일
 * @returns {JSX.Element} 튜터 아바타 컴포넌트
 */
function TutorAvatar({
  name,
  size = 'medium',
  backgroundColor = COLORS.purple,
  style = {},
}) {
  // 이름의 첫 글자 추출 (없으면 'G')
  const initial = name?.[0]?.toUpperCase() || 'G'

  // 사이즈 설정 가져오기
  const sizeConfig = SIZES[size] || SIZES.medium

  // 인라인 스타일 정의
  const containerStyle = {
    width: sizeConfig.container,
    height: sizeConfig.container,
    backgroundColor,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // large 사이즈일 때만 테두리 추가
    ...(sizeConfig.borderWidth > 0 && {
      border: `${sizeConfig.borderWidth}px solid ${COLORS.purpleLight}`,
    }),
    ...style,
  }

  const initialStyle = {
    fontSize: sizeConfig.fontSize,
    fontWeight: 600,
    color: 'white',
  }

  return (
    <div style={containerStyle}>
      <span style={initialStyle}>{initial}</span>
    </div>
  )
}

export default TutorAvatar
