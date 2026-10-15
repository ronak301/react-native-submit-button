import type { ReactNode } from 'react'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'

export type SubmitButtonStatus = 'idle' | 'loading' | 'success' | 'error'

export type SubmitButtonResult = Extract<
  SubmitButtonStatus,
  'success' | 'error'
>

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
