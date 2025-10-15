import { act, renderHook } from '@testing-library/react'
import { useDebouncedValue } from '../useDebounce'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should initialize with the initial value', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce string values correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Should still be the initial value before delay
    expect(result.current).toBe('initial')

    // Fast-forward time by 499ms (just before delay)
    act(() => {
      jest.advanceTimersByTime(499)
    })

    expect(result.current).toBe('initial')

    // Fast-forward time by 1ms more (completing the delay)
    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toBe('updated')
  })

  it('should debounce numeric values correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 0, delay: 300 },
      }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })

    expect(result.current).toBe(0)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it('should debounce boolean values correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: false, delay: 200 },
      }
    )

    expect(result.current).toBe(false)

    rerender({ value: true, delay: 200 })

    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe(true)
  })

  it('should debounce object values correctly', () => {
    const initialObj = { id: 1, name: 'initial' }
    const updatedObj = { id: 2, name: 'updated' }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: initialObj, delay: 400 },
      }
    )

    expect(result.current).toBe(initialObj)

    rerender({ value: updatedObj, delay: 400 })

    expect(result.current).toBe(initialObj)

    act(() => {
      jest.advanceTimersByTime(400)
    })

    expect(result.current).toBe(updatedObj)
  })

  it('should debounce array values correctly', () => {
    const initialArray = [1, 2, 3]
    const updatedArray = [4, 5, 6]

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: initialArray, delay: 250 },
      }
    )

    expect(result.current).toBe(initialArray)

    rerender({ value: updatedArray, delay: 250 })

    expect(result.current).toBe(initialArray)

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(result.current).toBe(updatedArray)
  })

  it('should reset debounce timer when value changes multiple times', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // First update
    rerender({ value: 'first-update', delay: 500 })

    // Advance time but not the full delay
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('initial')

    // Second update (should reset timer)
    rerender({ value: 'second-update', delay: 500 })

    // Advance time by 300ms again (total 600ms from first update, but only 300ms from second)
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Should still be initial because timer was reset
    expect(result.current).toBe('initial')

    // Complete the debounce delay for the second update
    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe('second-update')
  })

  it('should handle rapid consecutive value changes correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 1, delay: 100 },
      }
    )

    expect(result.current).toBe(1)

    // Make several rapid changes
    rerender({ value: 2, delay: 100 })
    rerender({ value: 3, delay: 100 })
    rerender({ value: 4, delay: 100 })
    rerender({ value: 5, delay: 100 })

    // Should still be the initial value
    expect(result.current).toBe(1)

    // Complete the debounce delay
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should only update to the final value
    expect(result.current).toBe(5)
  })

  it('should handle delay changes correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update value and delay simultaneously
    rerender({ value: 'updated', delay: 200 })

    expect(result.current).toBe('initial')

    // Advance time by the new shorter delay
    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle zero delay correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 0 })

    // With zero delay, should update immediately on next tick
    act(() => {
      jest.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle very large delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 10000 },
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 10000 })

    // Advance by a significant amount but less than delay
    act(() => {
      jest.advanceTimersByTime(9999)
    })

    expect(result.current).toBe('initial')

    // Complete the delay
    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle null and undefined values correctly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: null as string | null | undefined, delay: 300 },
      }
    )

    expect(result.current).toBe(null)

    rerender({ value: 'not-null', delay: 300 })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('not-null')

    rerender({ value: undefined, delay: 300 })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(undefined)
  })

  it('should clean up timers on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const { rerender, unmount } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    rerender({ value: 'updated', delay: 500 })

    // Unmount before debounce completes
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('should work with complex objects and maintain reference equality when appropriate', () => {
    const complexObj = {
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark', notifications: true },
      data: [1, 2, 3, { nested: true }],
    }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      {
        initialProps: { value: complexObj, delay: 200 },
      }
    )

    expect(result.current).toBe(complexObj)

    const newComplexObj = {
      user: { id: 2, name: 'Jane' },
      settings: { theme: 'light', notifications: false },
      data: [4, 5, 6, { nested: false }],
    }

    rerender({ value: newComplexObj, delay: 200 })

    expect(result.current).toBe(complexObj)

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(result.current).toBe(newComplexObj)
    expect(result.current).not.toBe(complexObj)
  })
})
