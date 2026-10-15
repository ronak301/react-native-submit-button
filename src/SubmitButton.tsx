import { useCallback } from 'react'
import { AccessibilityInfo, Pressable, StyleSheet, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { ButtonContent } from './components/ButtonContent'
import { CheckIcon } from './components/CheckIcon'
import { CrossIcon } from './components/CrossIcon'
import { ProgressRing } from './components/ProgressRing'
import {
  DEFAULTS,
  DEFAULT_ANNOUNCEMENTS,
  ICON_SCALE,
  LABEL_SCALE
} from './constants'
import { useLatest } from './hooks/useLatest'
import { useSubmitAnimation } from './hooks/useSubmitAnimation'
import { useSubmitStatus } from './hooks/useSubmitStatus'
import type { SubmitButtonProps, SubmitButtonResult } from './types'

export function SubmitButton({
  onPress,
  status: statusProp,
  title = DEFAULTS.title,
  successTitle,
  errorTitle,
  successIcon,
  errorIcon,
  width = DEFAULTS.width,
  height = DEFAULTS.height,
  color = DEFAULTS.color,
  backgroundColor = DEFAULTS.backgroundColor,
  errorColor = DEFAULTS.errorColor,
  trackColor = DEFAULTS.trackColor,
  borderWidth = DEFAULTS.borderWidth,
  duration = DEFAULTS.duration,
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
  const { status, isControlled, press, scheduleReset } = useSubmitStatus({
    status: statusProp,
    onPress,
    disabled
  })

  const latest = useLatest({
    onSuccess,
    onError,
    successTitle,
    errorTitle,
    resetAfter,
    isControlled
  })
  const handleSettled = useCallback(
    (result: SubmitButtonResult) => {
      const p = latest.current
      if (result === 'success') p.onSuccess?.()
      else p.onError?.()
      const title = result === 'success' ? p.successTitle : p.errorTitle
      AccessibilityInfo.announceForAccessibility(
        title ?? DEFAULT_ANNOUNCEMENTS[result]
      )
      if (!p.isControlled && p.resetAfter !== undefined)
        scheduleReset(p.resetAfter)
    },
    [latest, scheduleReset]
  )

  const animation = useSubmitAnimation({
    status,
    width,
    height,
    duration,
    color,
    backgroundColor,
    errorColor,
    trackColor,
    onSettled: handleSettled
  })

  const isLoading = status === 'loading'
  const iconSize = Math.round(height * ICON_SCALE)
  const label =
    status === 'success'
      ? successTitle
      : status === 'error'
        ? errorTitle
        : title
  const icon =
    status === 'success'
      ? (successIcon ?? <CheckIcon size={iconSize} color={backgroundColor} />)
      : status === 'error'
        ? (errorIcon ?? <CrossIcon size={iconSize} color={backgroundColor} />)
        : null

  return (
    <Animated.View
      style={[{ height }, style, animation.containerStyle]}
      testID={testID}
    >
      <Pressable
        onPress={press}
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
            styles.surface,
            {
              borderRadius: height / 2,
              borderWidth,
              opacity: disabled ? 0.5 : 1
            },
            animation.surfaceStyle
          ]}
        >
          <ButtonContent
            label={label}
            icon={icon}
            fontSize={Math.round(height * LABEL_SCALE)}
            contentStyle={animation.contentStyle}
            labelStyle={animation.labelStyle}
            textStyle={textStyle}
          />
        </Animated.View>
      </Pressable>
      <View
        pointerEvents="none"
        style={[styles.ring, { width: height, height }]}
      >
        <Animated.View style={animation.ringStyle}>
          <ProgressRing
            size={height}
            strokeWidth={borderWidth}
            color={color}
            trackColor={trackColor}
          />
        </Animated.View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  surface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0
  }
})
