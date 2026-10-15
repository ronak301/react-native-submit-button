import Svg, { Circle } from 'react-native-svg'

type Props = {
  size: number
  strokeWidth: number
  color: string
  trackColor: string
}

// A track plus a quarter arc; the caller rotates it. Drawn over the button's
// border, so it uses the same stroke width and sits exactly on top of it.
export function ProgressRing({ size, strokeWidth, color, trackColor }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
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
