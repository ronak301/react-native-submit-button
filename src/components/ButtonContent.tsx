import type { ReactNode } from 'react'
import { StyleSheet, type StyleProp, type TextStyle } from 'react-native'
import Animated, { type AnimatedStyle } from 'react-native-reanimated'

type Props = {
  /** Text to show; when undefined, `icon` is shown instead. */
  label: string | undefined
  icon: ReactNode
  fontSize: number
  contentStyle: StyleProp<AnimatedStyle<object>>
  labelStyle: StyleProp<AnimatedStyle<TextStyle>>
  textStyle: StyleProp<TextStyle>
}

export function ButtonContent({
  label,
  icon,
  fontSize,
  contentStyle,
  labelStyle,
  textStyle
}: Props) {
  return (
    <Animated.View style={[styles.content, contentStyle]}>
      {label !== undefined ? (
        <Animated.Text
          numberOfLines={1}
          style={[styles.text, { fontSize }, labelStyle, textStyle]}
        >
          {label}
        </Animated.Text>
      ) : (
        icon
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  text: {
    fontWeight: '700',
    backgroundColor: 'transparent'
  }
})
