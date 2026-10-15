import { useEffect, useRef } from 'react'
import {
  Easing,
  ReduceMotion,
  cancelAnimation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import { SPIN_DURATION } from '../constants'
import type { SubmitButtonResult, SubmitButtonStatus } from '../types'

type Options = {
  status: SubmitButtonStatus
  width: number
  height: number
  duration: number
  color: string
  backgroundColor: string
  errorColor: string
  trackColor: string
  /** Called on the JS thread once a success or error state has fully unfolded. */
  onSettled: (result: SubmitButtonResult) => void
}

/**
 * Drives the fold, spin and fill animations from `status` and returns the
 * animated styles. All animation work runs on the UI thread.
 *
 * - `collapse`: 0 = full width, 1 = folded into a circle
 * - `fill`: 0 = idle colors, 1 = result (success or error) colors
 * - `spin`: spinner rotation in degrees
 */
export function useSubmitAnimation({
  status,
  width,
  height,
  duration,
  color,
  backgroundColor,
  errorColor,
  trackColor,
  onSettled
}: Options) {
  const isLoading = status === 'loading'
  const isResult = status === 'success' || status === 'error'

  // The color to fade back from after a result, kept so an error does not
  // flash green while it resets to idle.
  const lastResult = useRef<SubmitButtonResult>('success')
  if (isResult) lastResult.current = status
  const resultColor = lastResult.current === 'error' ? errorColor : color

  const collapse = useSharedValue(isLoading ? 1 : 0)
  const fill = useSharedValue(isResult ? 1 : 0)
  const spin = useSharedValue(0)

  const previous = useRef(status)
  useEffect(() => {
    if (previous.current === status) return
    previous.current = status
    const timing = { duration, easing: Easing.out(Easing.cubic) }

    if (status === 'loading') {
      fill.value = withTiming(0, timing)
      collapse.value = withTiming(1, timing)
      spin.value = 0
      spin.value = withRepeat(
        // A spinner is progress, not decoration: keep it moving under Reduce Motion.
        withTiming(360, {
          duration: SPIN_DURATION,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.Never
        }),
        -1,
        false
      )
      return
    }

    cancelAnimation(spin)
    if (status === 'idle') {
      collapse.value = withTiming(0, timing)
      fill.value = withTiming(0, timing)
      return
    }

    const result = status
    fill.value = withTiming(1, timing)
    collapse.value = withTiming(0, timing, (finished) => {
      if (finished) scheduleOnRN(onSettled, result)
    })
  }, [status, duration, collapse, fill, spin, onSettled])

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(collapse.value, [0, 1], [width, height])
  }))

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      fill.value,
      [0, 1],
      [backgroundColor, resultColor]
    ),
    borderColor: isLoading
      ? trackColor
      : interpolateColor(fill.value, [0, 1], [color, resultColor])
  }))

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(collapse.value, [0, 0.5], [1, 0], 'clamp')
  }))

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fill.value, [0, 1], [color, backgroundColor])
  }))

  const ringStyle = useAnimatedStyle(() => ({
    opacity: isLoading
      ? interpolate(collapse.value, [0.8, 1], [0, 1], 'clamp')
      : 0,
    transform: [{ rotate: `${spin.value}deg` }]
  }))

  return { containerStyle, surfaceStyle, contentStyle, labelStyle, ringStyle }
}
