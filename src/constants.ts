export const DEFAULTS = {
  title: 'Submit',
  width: 180,
  height: 54,
  color: '#1ECD97',
  backgroundColor: '#FFFFFF',
  errorColor: '#FF6666',
  trackColor: '#BBBBBB',
  borderWidth: 4,
  duration: 250
} as const

/** One full turn of the loading spinner, in ms. */
export const SPIN_DURATION = 900

/** Share of the button height used by the label font and the result icons. */
export const LABEL_SCALE = 0.38
export const ICON_SCALE = 0.42

/** Words announced to screen readers when no result title is given. */
export const DEFAULT_ANNOUNCEMENTS = {
  success: 'Success',
  error: 'Error'
} as const
