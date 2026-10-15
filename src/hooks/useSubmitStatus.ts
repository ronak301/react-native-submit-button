import { useCallback, useEffect, useRef, useState } from 'react'

import type { SubmitButtonStatus } from '../types'
import { isPromiseLike } from '../utils/isPromiseLike'

type Options = {
  status: SubmitButtonStatus | undefined
  onPress: (() => unknown) | undefined
  disabled: boolean
}

/**
 * Owns the button's status. Controlled when `status` is passed; otherwise a
 * promise returned from `onPress` moves it through loading to success or error.
 */
export function useSubmitStatus({
  status: controlledStatus,
  onPress,
  disabled
}: Options) {
  const isControlled = controlledStatus !== undefined
  const [internalStatus, setInternalStatus] =
    useState<SubmitButtonStatus>('idle')
  const status = isControlled ? controlledStatus : internalStatus

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

  const press = useCallback(() => {
    if (disabled || status !== 'idle') return
    const result = onPress?.()
    if (isControlled || !isPromiseLike(result)) return

    // Only the latest press may settle the button.
    const id = ++pressId.current
    setInternalStatus('loading')
    Promise.resolve(result).then(
      () => {
        if (mounted.current && id === pressId.current)
          setInternalStatus('success')
      },
      () => {
        if (mounted.current && id === pressId.current)
          setInternalStatus('error')
      }
    )
  }, [disabled, status, onPress, isControlled])

  /** Uncontrolled mode only: go back to idle after `ms`. */
  const scheduleReset = useCallback((ms: number) => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      if (mounted.current) setInternalStatus('idle')
    }, ms)
  }, [])

  return { status, isControlled, press, scheduleReset }
}
