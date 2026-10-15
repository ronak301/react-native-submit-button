import Svg, { Path } from 'react-native-svg'

import type { IconProps } from './types'

export function CrossIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 6.5l11 11M17.5 6.5l-11 11"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </Svg>
  )
}
