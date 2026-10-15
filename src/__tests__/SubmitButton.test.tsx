import { act, fireEvent, render, screen } from '@testing-library/react-native'

import { SubmitButton } from '../index'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

// Lets a settled promise update state, then runs the fold/unfold animations to the end.
async function flushAnimations() {
  await act(async () => {
    await Promise.resolve()
  })
  await act(() => {
    jest.advanceTimersByTime(2000)
  })
}

describe('SubmitButton', () => {
  it('renders the title as an accessible button', async () => {
    await render(<SubmitButton title="Pay" />)
    expect(screen.getByRole('button', { name: 'Pay' })).toBeTruthy()
    expect(screen.getByText('Pay')).toBeTruthy()
  })

  it('goes busy while the promise from onPress is pending, then calls onSuccess', async () => {
    let resolve: () => void = () => {}
    const onPress = jest.fn(() => new Promise<void>((r) => (resolve = r)))
    const onSuccess = jest.fn()
    await render(<SubmitButton onPress={onPress} onSuccess={onSuccess} />)

    await fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).toBeBusy()

    // A second press while busy is ignored.
    await fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)

    await act(async () => resolve())
    await flushAnimations()
    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).not.toBeBusy()
  })

  it('calls onError when the promise rejects and shows the error title', async () => {
    const onError = jest.fn()
    await render(
      <SubmitButton onPress={() => Promise.reject(new Error('nope'))} onError={onError} errorTitle="Failed" />
    )
    await fireEvent.press(screen.getByRole('button'))
    await flushAnimations()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Failed')).toBeTruthy()
  })

  it('returns to idle after resetAfter', async () => {
    await render(<SubmitButton title="Send" successTitle="Sent" onPress={() => Promise.resolve()} resetAfter={5000} />)
    await fireEvent.press(screen.getByRole('button'))
    await flushAnimations()
    expect(screen.getByText('Sent')).toBeTruthy()
    await act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.getByText('Send')).toBeTruthy()
  })

  it('in controlled mode only reflects the status prop', async () => {
    const onPress = jest.fn(() => Promise.resolve())
    const onSuccess = jest.fn()
    const { rerender } = await render(<SubmitButton status="idle" onPress={onPress} onSuccess={onSuccess} />)

    await fireEvent.press(screen.getByRole('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button')).not.toBeBusy()

    await rerender(<SubmitButton status="loading" onPress={onPress} onSuccess={onSuccess} />)
    expect(screen.getByRole('button')).toBeBusy()

    await rerender(<SubmitButton status="success" onPress={onPress} onSuccess={onSuccess} />)
    await flushAnimations()
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn()
    await render(<SubmitButton disabled onPress={onPress} />)
    await fireEvent.press(screen.getByRole('button'))
    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
