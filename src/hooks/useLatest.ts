import { useRef } from 'react'

/** A ref that always holds the latest value, for callbacks fired after an animation. */
export function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
