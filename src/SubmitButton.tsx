import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import Animated, {
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

import { CheckIcon, CrossIcon, ProgressRing } from './icons'

export type SubmitButtonStatus = 'idle' | 'loading' | 'success' | 'error'

export interface SubmitButtonProps {
  /**
   * Called on press. Return a promise to let the button drive itself:
   * it folds into a spinner, then shows success when the promise resolves
   * and error when it rejects. Ignored while the button is busy.
   */
  onPress?: () => unknown
  /**
   * Controls the button from outside. When set, the button never changes
   * state on its own: you move it to `loading`, `success`, `error`, `idle`.
   */
  status?: SubmitButtonStatus
  /** Label in the idle state. */
  title?: string
  /** Label after success. Without it, a check mark is shown. */
  successTitle?: string
  /** Label after an error. Without it, a cross is shown. */
  errorTitle?: string
  /** Replaces the default check mark. */
  successIcon?: ReactNode
  /** Replaces the default cross. */
  errorIcon?: ReactNode
  width?: number
  height?: number
  /** Border, text, spinner and success fill color. */
  color?: string
  /** Fill of the idle button; also the text and icon color on success or error. */
  backgroundColor?: string
  errorColor?: string
  /** Color of the spinner track. */
  trackColor?: string
  borderWidth?: number
  /** Fold and unfold duration in ms. */
  duration?: number
  /**
   * Uncontrolled mode only: return to idle this many ms after success or error.
   * Leave unset to keep the result on screen.
   */
  resetAfter?: number
  disabled?: boolean
  /** Fires once the button has unfolded into the success state. */
  onSuccess?: () => void
  /** Fires once the button has unfolded into the error state. */
  onError?: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

const SPIN_DURATION = 900

export function SubmitButton({
  onPress,
  status: controlledStatus,
  title = 'Submit',
  successTitle,
  errorTitle,
  successIcon,
  errorIcon,
  width = 180,
  height = 54,
  color = '#1ECD97',
  backgroundColor = '#FFFFFF',
  errorColor = '#FF6666',
  trackColor = '#BBBBBB',
  borderWidth = 4,
  duration = 250,
  resetAfter,
  disabled = false,
  onSuccess,
  onError,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID
}: SubmitButtonProps) {
  const isControlled = controlledStatus !== undefined
  const [internalStatus, setInternalStatus] = useState<SubmitButtonStatus>('idle')
  const status = isControlled ? controlledStatus : internalStatus

  // The colour to fade back from after a result, kept so an error does not
  // flash green while it resets to idle.
  const lastResult = useRef<'success' | 'error'>('success')
  if (status === 'success' || status === 'error') lastResult.current = status
  const resultColor = lastResult.current === 'error' ? errorColor : color
  const isLoading = status === 'loading'

  const collapse = useSharedValue(isLoading ? 1 : 0)
  const fill = useSharedValue(status === 'success' || status === 'error' ? 1 : 0)
  const spin = useSharedValue(0)

  // Latest props for callbacks that run after an animation.
  const latest = useRef({ onSuccess, onError, resetAfter, isControlled, successTitle, errorTitle })
  latest.current = { onSuccess, onError, resetAfter, isControlled, successTitle, errorTitle }

  const mounted = useRef(true)
  const pressId = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const settle = useCallback((result: 'success' | 'error') => {
    if (!mounted.current) return
    const p = latest.current
    if (result === 'success') p.onSuccess?.()
    else p.onError?.()
    AccessibilityInfo.announceForAccessibility(
      result === 'success' ? (p.successTitle ?? 'Success') : (p.errorTitle ?? 'Error')
    )
    if (!p.isControlled && p.resetAfter !== undefined) {
      resetTimer.current = setTimeout(() => {
        if (mounted.current) setInternalStatus('idle')
      }, p.resetAfter)
    }
  }, [])

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
        withTiming(360, { duration: SPIN_DURATION, easing: Easing.linear, reduceMotion: ReduceMotion.Never }),
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
      if (finished) scheduleOnRN(settle, result)
    })
  }, [status, duration, collapse, fill, spin, settle])

  const handlePress = useCallback(() => {
    if (disabled || status !== 'idle') return
    const result = onPress?.()
    if (isControlled || !isPromiseLike(result)) return

    const id = ++pressId.current
    setInternalStatus('loading')
    Promise.resolve(result).then(
      () => {
        if (mounted.current && id === pressId.current) setInternalStatus('success')
      },
      () => {
        if (mounted.current && id === pressId.current) setInternalStatus('error')
      }
    )
  }, [disabled, status, onPress, isControlled])

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(collapse.value, [0, 1], [width, height])
  }))

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], [backgroundColor, resultColor]),
    borderColor: isLoading
      ? trackColor
      : interpolateColor(fill.value, [0, 1], [color, resultColor])
  }))

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(collapse.value, [0, 0.5], [1, 0], 'clamp')
  }))

  const labelColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fill.value, [0, 1], [color, backgroundColor])
  }))

  const ringStyle = useAnimatedStyle(() => ({
    opacity: isLoading ? interpolate(collapse.value, [0.8, 1], [0, 1], 'clamp') : 0,
    transform: [{ rotate: `${spin.value}deg` }]
  }))

  const iconSize = Math.round(height * 0.42)
  const label =
    status === 'success' ? successTitle : status === 'error' ? errorTitle : title
  const icon =
    status === 'success'
      ? (successIcon ?? <CheckIcon size={iconSize} color={backgroundColor} />)
      : status === 'error'
        ? (errorIcon ?? <CrossIcon size={iconSize} color={backgroundColor} />)
        : null

  return (
    <Animated.View style={[{ height }, style, containerStyle]} testID={testID}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        role="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ busy: isLoading, disabled }}
        style={styles.fill}
        testID={testID ? `${testID}-pressable` : undefined}
      >
        <Animated.View
          style={[
            styles.button,
            { borderRadius: height / 2, borderWidth, opacity: disabled ? 0.5 : 1 },
            buttonStyle
          ]}
        >
          <Animated.View style={[styles.content, contentStyle]}>
            {label !== undefined ? (
              <Animated.Text
                numberOfLines={1}
                style={[styles.text, { fontSize: Math.round(height * 0.38) }, labelColorStyle, textStyle]}
              >
                {label}
              </Animated.Text>
            ) : (
              icon
            )}
          </Animated.View>
        </Animated.View>
      </Pressable>
      <View pointerEvents="none" style={[styles.ringHolder, { width: height, height }]}>
        <Animated.View style={ringStyle}>
          <ProgressRing size={height} strokeWidth={borderWidth} color={color} trackColor={trackColor} />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  text: {
    fontWeight: '700',
    backgroundColor: 'transparent'
  },
  ringHolder: {
    position: 'absolute',
    top: 0,
    left: 0
  }
})
