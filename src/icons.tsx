import Svg, { Circle, Path } from 'react-native-svg'

type IconProps = { size: number; color: string }

export function CheckIcon({ size, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

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

type RingProps = {
  size: number
  strokeWidth: number
  color: string
  trackColor: string
}

// A track plus a quarter arc; the caller rotates it. Drawn over the button's
// border, so it uses the same stroke width and sits exactly on top of it.
export function ProgressRing({ size, strokeWidth, color, trackColor }: RingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference * 0.25} ${circumference}`}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  )
}
